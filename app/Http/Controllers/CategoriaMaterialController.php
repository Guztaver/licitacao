<?php

namespace App\Http\Controllers;

use App\Models\CategoriaMaterial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $tipo = $request->input('tipo');
        $status = $request->input('status');

        $query = CategoriaMaterial::withCount('dispensaLicitas')
            ->orderBy('nome');

        // Apply filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%")
                  ->orWhere('descricao', 'like', "%{$search}%");
            });
        }

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        if ($status !== null) {
            $query->where('ativo', $status === 'ativo');
        }

        $categorias = $query->paginate(15)->withQueryString();

        // Transform data for frontend
        $categorias->getCollection()->transform(function ($categoria) {
            return [
                'id' => $categoria->id,
                'nome' => $categoria->nome,
                'codigo' => $categoria->codigo,
                'descricao' => $categoria->descricao,
                'tipo' => $categoria->tipo,
                'tipo_display' => $categoria->tipo_display,
                'ativo' => $categoria->ativo,
                'limite_dispensa_anual' => $categoria->limite_dispensa_anual,
                'limite_dispensa_mensal' => $categoria->limite_dispensa_mensal,
                'limite_dispensa_quantidade' => $categoria->limite_dispensa_quantidade,
                'periodo_limite' => $categoria->periodo_limite,
                'alerta_percentual' => $categoria->alerta_percentual,
                'bloqueio_percentual' => $categoria->bloqueio_percentual,
                'alerta_ativo' => $categoria->alerta_ativo,
                'total_dispensas' => $categoria->dispensa_licitacoes_count,
                'status_display' => $categoria->ativo ? 'Ativa' : 'Inativa',
                'status_color' => $categoria->ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'created_at' => $categoria->created_at->format('d/m/Y H:i'),
            ];
        });

        return Inertia::render('CategoriasMateriais/Index', [
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'tipo' => $tipo,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('CategoriasMateriais/Create', [
            'tipos' => [
                ['value' => 'material', 'label' => 'Material'],
                ['value' => 'servico', 'label' => 'Serviço'],
                ['value' => 'obra', 'label' => 'Obra'],
            ],
            'periodos' => [
                ['value' => 'mensal', 'label' => 'Mensal'],
                ['value' => 'anual', 'label' => 'Anual'],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'codigo' => 'required|string|max:20|unique:categoria_materiais,codigo',
            'descricao' => 'nullable|string|max:1000',
            'tipo' => 'required|in:material,servico,obra',
            'ativo' => 'boolean',
            'limite_dispensa_anual' => 'required|numeric|min:0',
            'limite_dispensa_mensal' => 'required|numeric|min:0',
            'limite_dispensa_quantidade' => 'required|integer|min:0',
            'periodo_limite' => 'required|in:mensal,anual',
            'alerta_percentual' => 'required|integer|min:0|max:100',
            'bloqueio_percentual' => 'required|integer|min:0|max:100',
            'alerta_ativo' => 'boolean',
        ]);

        $validated['created_by_user_id'] = auth()->id();

        $categoria = CategoriaMaterial::create($validated);

        return redirect()
            ->route('categorias-materiais.index')
            ->with('success', 'Categoria de material criada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(CategoriaMaterial $categoriaMaterial): Response
    {
        $categoriaMaterial->load(['createdByUser']);

        // Get current usage statistics
        $usoMensal = $categoriaMaterial->calcularUsoAtual('mensal');
        $usoAnual = $categoriaMaterial->calcularUsoAtual('anual');

        // Get recent dispensas
        $dispensasRecentes = $categoriaMaterial->dispensaLicitas()
            ->with(['fornecedor', 'secretaria', 'usuarioSolicitante'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($dispensa) {
                return [
                    'id' => $dispensa->id,
                    'numero_dispensa' => $dispensa->numero_dispensa,
                    'valor_total' => $dispensa->valor_total,
                    'valor_total_formatado' => $dispensa->valor_total_formatado,
                    'data_dispensa' => $dispensa->data_dispensa_formatada,
                    'status' => $dispensa->status,
                    'status_display' => $dispensa->status_display,
                    'status_color' => $dispensa->status_color,
                    'fornecedor' => $dispensa->fornecedor ? [
                        'id' => $dispensa->fornecedor->id,
                        'razao_social' => $dispensa->fornecedor->razao_social,
                    ] : null,
                    'secretaria' => $dispensa->secretaria ? [
                        'id' => $dispensa->secretaria->id,
                        'nome' => $dispensa->secretaria->nome,
                        'sigla' => $dispensa->secretaria->sigla,
                    ] : null,
                    'usuario_solicitante' => $dispensa->usuarioSolicitante ? [
                        'id' => $dispensa->usuarioSolicitante->id,
                        'name' => $dispensa->usuarioSolicitante->name,
                    ] : null,
                ];
            });

        // Get alerts
        $alertas = $categoriaMaterial->limiteDispensaAlertas()
            ->with(['createdByUser'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($alerta) {
                return [
                    'id' => $alerta->id,
                    'tipo_alerta' => $alerta->tipo_alerta,
                    'tipo_alerta_display' => $alerta->tipo_alerta_display,
                    'nivel_severidade' => $alerta->nivel_severidade,
                    'nivel_severidade_display' => $alerta->nivel_severidade_display,
                    'percentual_utilizado_formatado' => $alerta->percentual_utilizado_formatado,
                    'valor_acumulado_formatado' => $alerta->valor_acumulado_formatado,
                    'valor_excedido_formatado' => $alerta->valor_excedido_formatado,
                    'periodo_descricao' => $alerta->periodo_descricao,
                    'status' => $alerta->status,
                    'status_display' => $alerta->status_display,
                    'severity_color' => $alerta->severity_color,
                    'created_at' => $alerta->created_at->format('d/m/Y H:i'),
                    'created_by_user' => $alerta->createdByUser ? [
                        'id' => $alerta->createdByUser->id,
                        'name' => $alerta->createdByUser->name,
                    ] : null,
                ];
            });

        return Inertia::render('CategoriasMateriais/Show', [
            'categoria' => [
                'id' => $categoriaMaterial->id,
                'nome' => $categoriaMaterial->nome,
                'codigo' => $categoriaMaterial->codigo,
                'descricao' => $categoriaMaterial->descricao,
                'tipo' => $categoriaMaterial->tipo,
                'tipo_display' => $categoriaMaterial->tipo_display,
                'ativo' => $categoriaMaterial->ativo,
                'status_display' => $categoriaMaterial->ativo ? 'Ativa' : 'Inativa',
                'status_color' => $categoriaMaterial->ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'limite_dispensa_anual' => $categoriaMaterial->limite_dispensa_anual,
                'limite_dispensa_mensal' => $categoriaMaterial->limite_dispensa_mensal,
                'limite_dispensa_quantidade' => $categoriaMaterial->limite_dispensa_quantidade,
                'periodo_limite' => $categoriaMaterial->periodo_limite,
                'alerta_percentual' => $categoriaMaterial->alerta_percentual,
                'bloqueio_percentual' => $categoriaMaterial->bloqueio_percentual,
                'alerta_ativo' => $categoriaMaterial->alerta_ativo,
                'created_by_user' => $categoriaMaterial->createdByUser,
                'created_at' => $categoriaMaterial->created_at->format('d/m/Y H:i'),
                'updated_at' => $categoriaMaterial->updated_at->format('d/m/Y H:i'),
            ],
            'uso_mensal' => [
                'valor_acumulado' => $usoMensal['valor_acumulado'],
                'quantidade_acumulada' => $usoMensal['quantidade_acumulada'],
                'total_dispensas' => $usoMensal['total_dispensas'],
                'limite_aplicavel' => $usoMensal['limite_aplicavel'],
                'percentual_utilizado' => $usoMensal['percentual_utilizado'],
                'status_uso' => $usoMensal['status_uso'],
                'pode_gerar_dispensa' => $usoMensal['pode_gerar_dispensa'],
            ],
            'uso_anual' => [
                'valor_acumulado' => $usoAnual['valor_acumulado'],
                'quantidade_acumulada' => $usoAnual['quantidade_acumulada'],
                'total_dispensas' => $usoAnual['total_dispensas'],
                'limite_aplicavel' => $usoAnual['limite_aplicavel'],
                'percentual_utilizado' => $usoAnual['percentual_utilizado'],
                'status_uso' => $usoAnual['status_uso'],
                'pode_gerar_dispensa' => $usoAnual['pode_gerar_dispensa'],
            ],
            'dispensas_recentes' => $dispensasRecentes,
            'alertas' => $alertas,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoriaMaterial $categoriaMaterial): Response
    {
        return Inertia::render('CategoriasMateriais/Edit', [
            'categoria' => $categoriaMaterial,
            'tipos' => [
                ['value' => 'material', 'label' => 'Material'],
                ['value' => 'servico', 'label' => 'Serviço'],
                ['value' => 'obra', 'label' => 'Obra'],
            ],
            'periodos' => [
                ['value' => 'mensal', 'label' => 'Mensal'],
                ['value' => 'anual', 'label' => 'Anual'],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoriaMaterial $categoriaMaterial): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'codigo' => [
                'required',
                'string',
                'max:20',
                Rule::unique('categoria_materiais', 'codigo')->ignore($categoriaMaterial->id),
            ],
            'descricao' => 'nullable|string|max:1000',
            'tipo' => 'required|in:material,servico,obra',
            'ativo' => 'boolean',
            'limite_dispensa_anual' => 'required|numeric|min:0',
            'limite_dispensa_mensal' => 'required|numeric|min:0',
            'limite_dispensa_quantidade' => 'required|integer|min:0',
            'periodo_limite' => 'required|in:mensal,anual',
            'alerta_percentual' => 'required|integer|min:0|max:100',
            'bloqueio_percentual' => 'required|integer|min:0|max:100',
            'alerta_ativo' => 'boolean',
        ]);

        $categoriaMaterial->update($validated);

        return redirect()
            ->route('categorias-materiais.index')
            ->with('success', 'Categoria de material atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoriaMaterial $categoriaMaterial): RedirectResponse
    {
        // Check if category has dispensas
        if ($categoriaMaterial->dispensaLicitas()->exists()) {
            return redirect()
                ->back()
                ->with('error', 'Esta categoria não pode ser excluída porque possui dispensas de licitação vinculadas.');
        }

        $categoriaMaterial->delete();

        return redirect()
            ->route('categorias-materiais.index')
            ->with('success', 'Categoria de material excluída com sucesso!');
    }

    /**
     * Toggle category status.
     */
    public function toggleStatus(CategoriaMaterial $categoriaMaterial): RedirectResponse
    {
        $categoriaMaterial->update(['ativo' => !$categoriaMaterial->ativo]);

        $status = $categoriaMaterial->ativo ? 'ativada' : 'inativada';

        return redirect()
            ->back()
            ->with('success', "Categoria {$status} com sucesso!");
    }

    /**
     * Get categories for API/autocomplete.
     */
    public function search(Request $request)
    {
        $search = $request->input('search');
        $tipo = $request->input('tipo');

        $query = CategoriaMaterial::ativas();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%");
            });
        }

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $categorias = $query->select('id', 'codigo', 'nome', 'tipo', 'limite_dispensa_mensal', 'limite_dispensa_anual')
                     ->orderBy('nome')
                     ->get();

        return response()->json($categorias);
    }

    /**
     * Check limit for a category (API endpoint).
     */
    public function checkLimits(Request $request)
    {
        $categoriaId = $request->input('categoria_id');
        $valor = floatval($request->input('valor', 0));
        $periodo = $request->input('periodo', 'mensal');
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        if (!$categoriaId || $valor <= 0) {
            return response()->json([
                'error' => 'Categoria e valor são obrigatórios',
                'valid' => false,
            ], 400);
        }

        $categoria = CategoriaMaterial::find($categoriaId);

        if (!$categoria) {
            return response()->json([
                'error' => 'Categoria não encontrada',
                'valid' => false,
            ], 404);
        }

        $validacao = $categoria->podeGerarDispensa($valor, $periodo, $year, $month);

        return response()->json([
            'categoria' => [
                'id' => $categoria->id,
                'nome' => $categoria->nome,
                'codigo' => $categoria->codigo,
                'limite_dispensa_mensal' => $categoria->limite_dispensa_mensal,
                'limite_dispensa_anual' => $categoria->limite_dispensa_anual,
            ],
            'validacao' => $validacao,
            'valor_solicitado' => $valor,
            'periodo' => $periodo,
            'year' => $year,
            'month' => $month,
        ]);
    }

    /**
     * Generate alerts for all categories.
     */
    public function gerarAlertas(Request $request): Response
    {
        $alertasGeradas = LimiteDispensaAlerta::gerarAlertasPeriodicas();

        return response()->json([
            'success' => true,
            'total_geradas' => count($alertasGeradas),
            'alertas' => $alertasGeradas,
            'mensagem' => count($alertasGeradas) . ' alertas geradas com sucesso.',
        ]);
    }

    /**
     * Get category usage report.
     */
    public function usageReport(Request $request): Response
    {
        $ano = $request->input('ano', now()->year);
        $mes = $request->input('mes');
        $categoriaId = $request->input('categoria_id');

        $query = CategoriaMaterial::with(['dispensaLicitas' => function ($query) use ($ano, $mes) {
            if ($mes) {
                $query->whereYear('data_dispensa', $ano)
                      ->whereMonth('data_dispensa', $mes);
            } else {
                $query->whereYear('data_dispensa', $ano);
            }
        }]);

        if ($categoriaId) {
            $query->where('id', $categoriaId);
        }

        $categorias = $query->get();

        $relatorio = [];
        foreach ($categorias as $categoria) {
            $periodo = $mes ? 'mensal' : 'anual';
            $uso = $categoria->calcularUsoAtual($periodo, $ano, $mes);

            $relatorio[] = [
                'categoria' => [
                    'id' => $categoria->id,
                    'nome' => $categoria->nome,
                    'codigo' => $categoria->codigo,
                    'tipo' => $categoria->tipo_display,
                ],
                'periodo' => $periodo,
                'ano' => $ano,
                'mes' => $mes,
                'estatisticas' => $uso,
            ];
        }

        return response()->json([
            'relatorio' => $relatorio,
            'periodo' => $mes ? 'Mensal' : 'Anual',
            'ano' => $ano,
            'mes' => $mes,
        ]);
    }
}
