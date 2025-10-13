<?php

namespace App\Http\Controllers;

use App\Models\Estoque;
use App\Models\Item;
use App\Models\Localizacao;
use App\Models\MovimentacaoEstoque;
use App\Models\AlertaEstoque;
use App\Models\ReposicaoEstoque;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EstoqueController extends Controller
{
    /**
     * Display the inventory dashboard.
     */
    public function index()
    {
        $itensEstoqueBaixo = Estoque::ativo()
            ->estoqueBaixo()
            ->with(['item', 'localizacao'])
            ->count();

        $itensEstoqueZerado = Estoque::ativo()
            ->estoqueZerado()
            ->with(['item', 'localizacao'])
            ->count();

        $itensVencidos = Estoque::ativo()
            ->vencido()
            ->with(['item', 'localizacao'])
            ->count();

        $alertasAtivos = AlertaEstoque::ativa()
            ->aberta()
            ->count();

        $reposicoesPendentes = ReposicaoEstoque::ativa()
            ->whereIn('status', ['sugerida', 'aprovada'])
            ->count();

        return view('estoque.index', compact(
            'itensEstoqueBaixo',
            'itensEstoqueZerado',
            'itensVencidos',
            'alertasAtivos',
            'reposicoesPendentes'
        ));
    }

    /**
     * Get dashboard data for charts and KPIs.
     */
    public function getDashboardData(Request $request): JsonResponse
    {
        try {
            // Basic counts
            $totalItens = Estoque::ativo()->count();
            $itensEstoqueBaixo = Estoque::ativo()->estoqueBaixo()->count();
            $itensEstoqueZerado = Estoque::ativo()->estoqueZerado()->count();
            $itensPrecisandoReposicao = Estoque::ativo()->precisaReposicao()->count();
            $alertasCriticos = AlertaEstoque::criticidade(AlertaEstoque::CRITICIDADE_CRITICA)
                ->aberta()
                ->count();

            // Value totals
            $valorTotalEstoque = Estoque::ativo()->sum('valor_total_estoque');
            $valorEstoqueBaixo = Estoque::ativo()->estoqueBaixo()->sum('valor_total_estoque');
            $valorEstoqueZerado = 0; // Zero items have no value

            // Recent movements
            $movimentacoesRecentes = MovimentacaoEstoque::with(['item', 'usuario'])
                ->confirmada()
                ->orderBy('data_movimentacao', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($mov) {
                    return [
                        'id' => $mov->id,
                        'item' => $mov->item->descricao,
                        'tipo' => $mov->tipo_movimentacao_display,
                        'quantidade' => $mov->quantidade_formatada,
                        'usuario' => $mov->usuario->name,
                        'data' => $mov->data_movimentacao->format('d/m/Y H:i'),
                        'cor' => $mov->tipo_color,
                    ];
                });

            // Critical items
            $itensCriticos = Estoque::ativo()
                ->with(['item', 'localizacao'])
                ->where(function ($query) {
                    $query->whereRaw('quantidade_atual <= quantidade_minima')
                          ->orWhere('data_validade', '<', now()->addDays(30))
                          ->orWhere('data_validade', '<', now());
                })
                ->limit(10)
                ->get()
                ->map(function ($estoque) {
                    return [
                        'id' => $estoque->id,
                        'item' => $estoque->item->descricao,
                        'localizacao' => $estoque->localizacao->descricao,
                        'quantidade_atual' => $estoque->quantidade_atual,
                        'quantidade_minima' => $estoque->quantidade_minima,
                        'percentual_minimo' => $estoque->percentual_minimo,
                        'status_estoque' => $estoque->status_estoque,
                        'cor_status' => $estoque->status_color,
                        'data_validade' => $estoque->data_validade?->format('d/m/Y'),
                        'dias_vencimento' => $estoque->data_validade
                            ? $estoque->data_validade->diffInDays(now(), false)
                            : null,
                    ];
                });

            // Alert summary
            $resumoAlertas = AlertaEstoque::getResumoPorCriticidade();

            // Replenishment summary
            $reposicoesUrgentes = ReposicaoEstoque::ativa()
                ->prioridade(ReposicaoEstoque::PRIORIDADE_URGENTE)
                ->count();

            $reposicoesAtrasadas = ReposicaoEstoque::ativa()
                ->atrasada()
                ->count();

            return response()->json([
                'kpis' => [
                    'total_itens' => $totalItens,
                    'itens_estoque_baixo' => $itensEstoqueBaixo,
                    'itens_estoque_zerado' => $itensEstoqueZerado,
                    'itens_precisando_reposicao' => $itensPrecisandoReposicao,
                    'alertas_criticos' => $alertasCriticos,
                    'valor_total_estoque' => $valorTotalEstoque,
                    'valor_estoque_baixo' => $valorEstoqueBaixo,
                    'valor_estoque_zerado' => $valorEstoqueZerado,
                ],
                'movimentacoes_recentes' => $movimentacoesRecentes,
                'itens_criticos' => $itensCriticos,
                'resumo_alertas' => $resumoAlertas,
                'resumo_reposicoes' => [
                    'urgentes' => $reposicoesUrgentes,
                    'atrasadas' => $reposicoesAtrasadas,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar dados do dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory items list.
     */
    public function getItensEstoque(Request $request): JsonResponse
    {
        $query = Estoque::ativo()->with(['item', 'localizacao']);

        // Filters
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('item', function ($q) use ($search) {
                $q->where('codigo', 'like', "%{$search}%")
                  ->orWhere('descricao', 'like', "%{$search}%");
            });
        }

        if ($request->filled('localizacao_id')) {
            $query->where('localizacao_id', $request->input('localizacao_id'));
        }

        if ($request->filled('status_estoque')) {
            $status = $request->input('status_estoque');

            switch ($status) {
                case 'baixo':
                    $query->estoqueBaixo();
                    break;
                case 'zerado':
                    $query->estoqueZerado();
                    break;
                case 'excedente':
                    $query->whereRaw('quantidade_atual > quantidade_maxima');
                    break;
                case 'vencido':
                    $query->vencido();
                    break;
                case 'vencimento_proximo':
                    $query->proximoVencimento();
                    break;
                case 'normal':
                    $query->whereRaw('quantidade_atual > quantidade_minima')
                          ->where(function ($q) {
                              $q->whereNull('data_validade')
                                ->orWhere('data_validade', '>', now()->addDays(30));
                          })
                          ->where(function ($q) {
                              $q->whereNull('quantidade_maxima')
                                ->orWhere('quantidade_atual', '<=', DB::raw('quantidade_maxima'));
                          });
                    break;
            }
        }

        if ($request->filled('precisa_reposicao')) {
            if ($request->boolean('precisa_reposicao')) {
                $query->precisaReposicao();
            } else {
                $query->whereRaw('quantidade_atual > ponto_reposicao');
            }
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $total = $query->count();
        $itens = $query->orderBy('quantidade_atual', 'asc')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function ($estoque) {
                return [
                    'id' => $estoque->id,
                    'item_codigo' => $estoque->item->codigo,
                    'item_descricao' => $estoque->item->descricao,
                    'localizacao' => $estoque->localizacao->descricao,
                    'quantidade_atual' => $estoque->quantidade_atual,
                    'quantidade_disponivel' => $estoque->quantidade_disponivel,
                    'quantidade_minima' => $estoque->quantidade_minima,
                    'quantidade_maxima' => $estoque->quantidade_maxima,
                    'percentual_minimo' => $estoque->percentual_minimo,
                    'percentual_maximo' => $estoque->percentual_maximo,
                    'ponto_reposicao' => $estoque->ponto_reposicao,
                    'custo_unitario_medio' => $estoque->custo_unitario_medio,
                    'valor_total_estoque' => $estoque->valor_total_estoque,
                    'status_estoque' => $estoque->status_estoque,
                    'cor_status' => $estoque->status_color,
                    'data_validade' => $estoque->data_validade?->format('d/m/Y'),
                    'dias_vencimento' => $estoque->data_validade
                        ? $estoque->data_validade->diffInDays(now(), false)
                        : null,
                    'ultima_atualizacao' => $estoque->updated_at->format('d/m/Y H:i'),
                ];
            });

        return response()->json([
            'data' => $itens,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Get stock movements.
     */
    public function getMovimentacoes(Request $request): JsonResponse
    {
        $query = MovimentacaoEstoque::with(['item', 'usuario', 'localizacaoOrigem', 'localizacaoDestino']);

        // Filters
        if ($request->filled('item_id')) {
            $query->where('item_id', $request->input('item_id'));
        }

        if ($request->filled('estoque_id')) {
            $query->where('estoque_id', $request->input('estoque_id'));
        }

        if ($request->filled('tipo_movimentacao')) {
            $query->where('tipo_movimentacao', $request->input('tipo_movimentacao'));
        }

        if ($request->filled('data_inicio')) {
            $query->where('data_movimentacao', '>=', $request->input('data_inicio'));
        }

        if ($request->filled('data_fim')) {
            $query->where('data_movimentacao', '<=', $request->input('data_fim'));
        }

        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->input('usuario_id'));
        }

        if ($request->filled('documento')) {
            $query->documento($request->input('documento'));
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $total = $query->count();
        $movimentacoes = $query->orderBy('data_movimentacao', 'desc')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function ($mov) {
                return [
                    'id' => $mov->id,
                    'item' => $mov->item->descricao,
                    'tipo_movimentacao' => $mov->tipo_movimentacao_display,
                    'quantidade' => $mov->quantidade_formatada,
                    'saldo_anterior' => $mov->saldo_anterior,
                    'saldo_posterior' => $mov->saldo_posterior,
                    'documento_origem' => $mov->documento_origem,
                    'localizacao_origem' => $mov->localizacaoOrigem?->descricao,
                    'localizacao_destino' => $mov->localizacaoDestino?->descricao,
                    'usuario' => $mov->usuario->name,
                    'motivo' => $mov->motivo,
                    'data_movimentacao' => $mov->data_movimentacao->format('d/m/Y H:i'),
                    'status' => $mov->status_display,
                    'cor_tipo' => $mov->tipo_color,
                    'cor_status' => $mov->status_color,
                ];
            });

        return response()->json([
            'data' => $movimentacoes,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Create stock movement.
     */
    public function criarMovimentacao(Request $request): JsonResponse
    {
        $request->validate([
            'estoque_id' => 'required|exists:estoques,id',
            'tipo_movimentacao' => [
                'required',
                Rule::in([
                    MovimentacaoEstoque::TIPO_ENTRADA,
                    MovimentacaoEstoque::TIPO_SAIDA,
                    MovimentacaoEstoque::TIPO_TRANSFERENCIA,
                    MovimentacaoEstoque::TIPO_AJUSTE,
                ])
            ],
            'quantidade' => 'required|numeric|min:0.001',
            'documento_origem' => 'required|string|max:50',
            'motivo' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string|max:1000',
            'localizacao_destino_id' => 'required_if:tipo_movimentacao,transferencia|exists:localizacoes,id',
        ]);

        try {
            DB::beginTransaction();

            $estoque = Estoque::findOrFail($request->input('estoque_id'));
            $quantidade = $request->input('quantidade');
            $tipo = $request->input('tipo_movimentacao');
            $documento = $request->input('documento_origem');

            switch ($tipo) {
                case MovimentacaoEstoque::TIPO_ENTRADA:
                    $movimentacao = MovimentacaoEstoque::criarEntrada(
                        $estoque,
                        $quantidade,
                        $documento,
                        [
                            'motivo' => $request->input('motivo'),
                            'observacoes' => $request->input('observacoes'),
                        ]
                    );
                    break;

                case MovimentacaoEstoque::TIPO_SAIDA:
                    $movimentacao = MovimentacaoEstoque::criarSaida(
                        $estoque,
                        $quantidade,
                        $documento,
                        [
                            'motivo' => $request->input('motivo'),
                            'observacoes' => $request->input('observacoes'),
                        ]
                    );
                    break;

                case MovimentacaoEstoque::TIPO_TRANSFERENCIA:
                    $localizacaoDestino = Localizacao::findOrFail($request->input('localizacao_destino_id'));

                    // Find or create stock in destination
                    $estoqueDestino = Estoque::firstOrCreate(
                        [
                            'item_id' => $estoque->item_id,
                            'localizacao_id' => $localizacaoDestino->id,
                        ],
                        [
                            'quantidade_atual' => 0,
                            'quantidade_minima' => $estoque->quantidade_minima,
                            'quantidade_maxima' => $estoque->quantidade_maxima,
                            'ponto_reposicao' => $estoque->ponto_reposicao,
                            'lead_time_reposicao' => $estoque->lead_time_reposicao,
                            'custo_unitario_medio' => $estoque->custo_unitario_medio,
                        ]
                    );

                    [$movimentacaoSaida, $movimentacaoEntrada] = MovimentacaoEstoque::criarTransferencia(
                        $estoque,
                        $estoqueDestino,
                        $quantidade,
                        $documento,
                        [
                            'motivo' => $request->input('motivo'),
                            'observacoes' => $request->input('observacoes'),
                        ]
                    );

                    $movimentacao = $movimentacaoSaida; // Return the first movement
                    break;

                case MovimentacaoEstoque::TIPO_AJUSTE:
                    $ajuste = $request->input('tipo_ajuste', 'positivo') === 'negativo'
                        ? -$quantidade
                        : $quantidade;

                    $movimentacao = MovimentacaoEstoque::criarAjuste(
                        $estoque,
                        $ajuste,
                        $request->input('motivo') ?? 'Ajuste de inventário',
                        [
                            'documento_origem' => $documento,
                            'observacoes' => $request->input('observacoes'),
                        ]
                    );
                    break;

                default:
                    throw new \Exception('Tipo de movimentação não implementado');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Movimentação registrada com sucesso',
                'movimentacao' => [
                    'id' => $movimentacao->id,
                    'tipo' => $movimentacao->tipo_movimentacao_display,
                    'quantidade' => $movimentacao->quantidade_formatada,
                    'saldo_anterior' => $movimentacao->saldo_anterior,
                    'saldo_posterior' => $movimentacao->saldo_posterior,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get inventory alerts.
     */
    public function getAlertas(Request $request): JsonResponse
    {
        $query = AlertaEstoque::ativa()->with(['item', 'estoque.localizacao']);

        // Filters
        if ($request->filled('tipo_alerta')) {
            $query->where('tipo_alerta', $request->input('tipo_alerta'));
        }

        if ($request->filled('criticidade')) {
            $query->where('nivel_criticidade', $request->input('criticidade'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('nao_lidas')) {
            if ($request->boolean('nao_lidas')) {
                $query->naoLida();
            } else {
                $query->where('lida', true);
            }
        }

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->input('item_id'));
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $total = $query->count();
        $alertas = $query->orderBy('data_alerta', 'desc')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function ($alerta) {
                return [
                    'id' => $alerta->id,
                    'item' => $alerta->item->descricao,
                    'localizacao' => $alerta->estoque->localizacao->descricao,
                    'tipo_alerta' => $alerta->tipo_alerta_display,
                    'nivel_criticidade' => $alerta->criticidade_display,
                    'titulo' => $alerta->titulo,
                    'mensagem' => $alerta->mensagem,
                    'status' => $alerta->status_display,
                    'lida' => $alerta->lida,
                    'data_alerta' => $alerta->data_alerta->format('d/m/Y H:i'),
                    'idade_dias' => $alerta->idade_dias,
                    'idade_horas' => $alerta->idade_horas,
                    'icone' => $alerta->icone,
                    'cor_criticidade' => $alerta->criticidade_color,
                    'cor_status' => $alerta->status_color,
                ];
            });

        return response()->json([
            'data' => $alertas,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Mark alert as read.
     */
    public function marcarAlertaComoLida(Request $request, int $id): JsonResponse
    {
        try {
            $alerta = AlertaEstoque::findOrFail($id);
            $success = $alerta->marcarComoLida();

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Alerta marcado como lido' : 'Alerta já estava lido',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Resolve alert.
     */
    public function resolverAlerta(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'resolucao' => 'required|string|max:1000',
        ]);

        try {
            $alerta = AlertaEstoque::findOrFail($id);
            $success = $alerta->marcarComoResolvido($request->input('resolucao'));

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Alerta resolvido com sucesso' : 'Erro ao resolver alerta',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Get replenishment suggestions.
     */
    public function getReposicoes(Request $request): JsonResponse
    {
        $query = ReposicaoEstoque::ativa()->with(['item', 'estoque.localizacao', 'fornecedor']);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('prioridade')) {
            $query->where('prioridade', $request->input('prioridade'));
        }

        if ($request->filled('tipo_reposicao')) {
            $query->where('tipo_reposicao', $request->input('tipo_reposicao'));
        }

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->input('item_id'));
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $total = $query->count();
        $reposicoes = $query->orderByRaw('FIELD(prioridade, ?, ?, ?, ?)', [
            ReposicaoEstoque::PRIORIDADE_URGENTE,
            ReposicaoEstoque::PRIORIDADE_ALTA,
            ReposicaoEstoque::PRIORIDADE_NORMAL,
            ReposicaoEstoque::PRIORIDADE_BAIXA,
        ])
            ->orderBy('data_sugerida', 'asc')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function ($reposicao) {
                return [
                    'id' => $reposicao->id,
                    'item' => $reposicao->item->descricao,
                    'localizacao' => $reposicao->estoque->localizacao->descricao,
                    'tipo_reposicao' => $reposicao->tipo_reposicao_display,
                    'prioridade' => $reposicao->prioridade_display,
                    'quantidade_sugerida' => $reposicao->quantidade_sugerida,
                    'quantidade_solicitada' => $reposicao->quantidade_solicitada,
                    'quantidade_atendida' => $reposicao->quantidade_atendida,
                    'quantidade_restante' => $reposicao->quantidade_restante,
                    'percentual_concluido' => $reposicao->percentual_concluido,
                    'data_sugerida' => $reposicao->data_sugerida->format('d/m/Y'),
                    'data_solicitacao' => $reposicao->data_solicitacao?->format('d/m/Y'),
                    'data_prevista_entrega' => $reposicao->data_prevista_entrega?->format('d/m/Y'),
                    'status' => $reposicao->status_display,
                    'fornecedor' => $reposicao->fornecedor?->nome,
                    'dias_ate_entrega' => $reposicao->dias_ate_entrega,
                    'precisa_atencao' => $reposicao->precisa_atencao(),
                    'cor_prioridade' => $reposicao->prioridade_color,
                    'cor_status' => $reposicao->status_color,
                ];
            });

        return response()->json([
            'data' => $reposicoes,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Approve replenishment suggestion.
     */
    public function aprovarReposicao(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'quantidade_solicitada' => 'nullable|numeric|min:0.001',
        ]);

        try {
            $reposicao = ReposicaoEstoque::findOrFail($id);
            $success = $reposicao->aprovar(
                auth()->id(),
                $request->input('quantidade_solicitada')
            );

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Reposição aprovada com sucesso' : 'Erro ao aprovar reposição',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Request replenishment from supplier.
     */
    public function solicitarReposicao(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'data_prevista_entrega' => 'nullable|date|after_or_equal:today',
        ]);

        try {
            $reposicao = ReposicaoEstoque::findOrFail($id);
            $dataPrevista = $request->input('data_prevista_entrega')
                ? new \DateTime($request->input('data_prevista_entrega'))
                : null;

            $success = $reposicao->solicitar(
                $request->input('fornecedor_id'),
                $dataPrevista
            );

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Reposição solicitada com sucesso' : 'Erro ao solicitar reposição',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Record replenishment receipt.
     */
    public function registrarRecebimentoReposicao(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'quantidade' => 'required|numeric|min:0.001',
        ]);

        try {
            $reposicao = ReposicaoEstoque::findOrFail($id);
            $success = $reposicao->registrarRecebimentoParcial($request->input('quantidade'));

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Recebimento registrado com sucesso' : 'Erro ao registrar recebimento',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Get locations for select.
     */
    public function getLocalizacoes(): JsonResponse
    {
        $localizacoes = Localizacao::ativa()
            ->orderBy('almoxarifado')
            ->orderBy('rua')
            ->orderBy('prateleira')
            ->get()
            ->map(function ($localizacao) {
                return [
                    'id' => $localizacao->id,
                    'codigo' => $localizacao->codigo,
                    'descricao' => $localizacao->descricao,
                    'codigo_completo' => $localizacao->codigo_completo,
                    'almoxarifado' => $localizacao->almoxarifado,
                    'tipo' => $localizacao->tipo_display,
                ];
            });

        return response()->json($localizacoes);
    }

    /**
     * Get items for select.
     */
    public function getItens(): JsonResponse
    {
        $itens = Item::orderBy('codigo')
            ->orderBy('descricao')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'codigo' => $item->codigo,
                    'descricao' => $item->descricao,
                    'display_text' => $item->display_text,
                ];
            });

        return response()->json($itens);
    }

    /**
     * Run automatic checks.
     */
    public function executarVerificacoesAutomaticas(): JsonResponse
    {
        try {
            $sugestoesCriadas = ReposicaoEstoque::gerarSugestoesAutomaticas();
            $alertasReposicao = ReposicaoEstoque::verificarReposicoesAtrasadas();
            $alertasMovimentacao = AlertaEstoque::verificarMovimentacoesAnormais();
            $alertasLotes = AlertaEstoque::verificarLotesObsoletos();

            return response()->json([
                'success' => true,
                'message' => 'Verificações automáticas executadas com sucesso',
                'resultados' => [
                    'sugestoes_reposicao_criadas' => $sugestoesCriadas,
                    'alertas_reposicao_criados' => $alertasReposicao,
                    'alertas_movimentacao_criados' => $alertasMovimentacao,
                    'alertas_lotes_criados' => $alertasLotes,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao executar verificações automáticas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
