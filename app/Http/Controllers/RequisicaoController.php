<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\Destinatario;
use App\Models\Emitente;
use App\Models\Fornecedor;
use App\Models\Requisicao;
use App\Services\PdfService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RequisicaoController extends Controller
{
    /**
     * Display a listing of the requisições.
     */
    public function index(Request $request): Response
    {
        $query = Requisicao::query()
            ->where('status', '!=', 'excluida')
            ->with([
                'emitente',
                'destinatario',
                'fornecedor',
                'usuarioCriacao',
            ]);

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('numero', 'like', "%{$request->search}%")
                    ->orWhere('numero_completo', 'like', "%{$request->search}%")
                    ->orWhere('solicitante', 'like', "%{$request->search}%")
                    ->orWhere('descricao', 'like', "%{$request->search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Emitente filter
        if ($request->filled('emitente_id')) {
            $query->where('emitente_id', $request->emitente_id);
        }

        // Date range filter
        if ($request->filled('data_inicio')) {
            $query->whereDate('data_recebimento', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('data_recebimento', '<=', $request->data_fim);
        }

        // Calculate statistics for the complete filtered dataset (before pagination)
        $statsQuery = clone $query;
        $allRequisicoes = $statsQuery->get();

        $stats = [
            'total_requisicoes' => $allRequisicoes->count(),
            'autorizadas' => $allRequisicoes
                ->where('status', 'autorizada')
                ->count(),
            'concretizadas' => $allRequisicoes
                ->where('status', 'concretizada')
                ->count(),
            'canceladas' => $allRequisicoes
                ->where('status', 'cancelada')
                ->count(),
            'valor_total' => $allRequisicoes
                ->where('status', 'concretizada')
                ->sum('valor_final') ?? 0,
        ];

        $requisicoesPaginated = $query
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $requisicoesPaginated
            ->getCollection()
            ->transform(function ($requisicao) {
                return [
                    'id' => $requisicao->id,
                    'numero' => $requisicao->numero,
                    'numero_completo' => $requisicao->numero_completo,
                    'solicitante' => $requisicao->solicitante,
                    'numero_oficio' => $requisicao->numero_oficio,
                    'data_recebimento' => $requisicao->data_recebimento->format(
                        'd/m/Y',
                    ),
                    'descricao' => $requisicao->descricao,
                    'status' => $requisicao->status,
                    'status_display' => $requisicao->status_display,
                    'status_color' => $requisicao->status_color,
                    'valor_final' => $requisicao->valor_final,
                    'numero_pedido_real' => $requisicao->numero_pedido_real,
                    'data_concretizacao' => $requisicao->data_concretizacao
                        ? $requisicao->data_concretizacao->format('d/m/Y')
                        : null,
                    'pode_editar' => $requisicao->podeEditar(),
                    'pode_concretizar' => $requisicao->podeConcretizar(),
                    'pode_excluir' => $requisicao->podeExcluir(),
                    'emitente' => $requisicao->emitente
                        ? [
                            'id' => $requisicao->emitente->id,
                            'nome' => $requisicao->emitente->nome,
                            'sigla' => $requisicao->emitente->sigla,
                        ]
                        : null,
                    'destinatario' => $requisicao->destinatario
                        ? [
                            'id' => $requisicao->destinatario->id,
                            'nome' => $requisicao->destinatario->nome,
                            'sigla' => $requisicao->destinatario->sigla,
                        ]
                        : null,
                    'fornecedor' => $requisicao->fornecedor
                        ? [
                            'id' => $requisicao->fornecedor->id,
                            'razao_social' => $requisicao->fornecedor->razao_social,
                            'cnpj_formatado' => $requisicao->fornecedor->cnpj_formatado,
                        ]
                        : null,
                    'usuario_criacao' => $requisicao->usuarioCriacao
                        ? [
                            'name' => $requisicao->usuarioCriacao->name,
                        ]
                        : null,
                    'created_at' => $requisicao->created_at->format(
                        'd/m/Y H:i',
                    ),
                ];
            });

        $emitentes = Emitente::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'sigla']);

        return Inertia::render('Requisicoes/Index', [
            'requisicoes' => $requisicoesPaginated,
            'emitentes' => $emitentes,
            'stats' => $stats,
            'filters' => $request->only([
                'search',
                'status',
                'emitente_id',
                'data_inicio',
                'data_fim',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new requisição.
     */
    public function create(): Response
    {
        $emitentes = Emitente::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'sigla']);
        $destinatarios = Destinatario::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'sigla']);
        $items = Item::query()
            ->orderBy('name')
            ->get([
                'id',
                'code',
                'name',
                'unit_of_measurement',
                'medium_price',
            ]);

        return Inertia::render('Requisicoes/Create', [
            'emitentes' => $emitentes,
            'destinatarios' => $destinatarios,
            'items' => $items,
            'proximo_numero' => Requisicao::gerarProximoNumero(),
        ]);
    }

    /**
     * Store a newly created requisição in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:requisicoes,numero',
            'emitente_id' => 'required|exists:emitentes,id',
            'destinatario_id' => 'required|exists:destinatarios,id',
            'solicitante' => 'required|string|max:255',
            'numero_oficio' => 'nullable|string|max:100',
            'data_recebimento' => 'required|date',
            'descricao' => 'required|string',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'anexo' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantidade_solicitada' => 'required|integer|min:1',
            'items.*.valor_unitario_maximo' => 'required|numeric|min:0',
            'items.*.observacao' => 'nullable|string|max:500',
        ]);

        // Check contract limits if fornecedor is specified
        if (! empty($validated['fornecedor_id'])) {
            $dataRecebimento = new \DateTime($validated['data_recebimento']);
            $contrato = Contrato::findContratoVigente(
                $validated['fornecedor_id'],
                $dataRecebimento,
            );

            if ($contrato && $contrato->limiteRequisioesAtingido()) {
                return back()
                    ->withErrors([
                        'fornecedor_id' => 'O limite de requisições para o contrato '.
                            $contrato->numero_contrato.
                            ' foi atingido. Limite: '.
                            $contrato->limite_requisicoes.
                            ', Utilizadas: '.
                            $contrato->getCountRequisicoes().
                            '.',
                    ])
                    ->withInput();
            }
        }

        $validated['status'] = 'autorizada';
        $validated['usuario_criacao_id'] = $request->user()->id;

        // Handle file upload
        if ($request->hasFile('anexo')) {
            $validated['anexo'] = $request
                ->file('anexo')
                ->store('requisicoes/anexos', 'public');
        }

        // Load emitente to generate complete number before saving
        $emitente = Emitente::query()->find($validated['emitente_id']);
        if (! $emitente) {
            return back()->withErrors([
                'emitente_id' => 'Emitente não encontrado.',
            ]);
        }
        $validated['numero_completo'] =
            $validated['numero'].'/'.$emitente->sigla;

        $requisicao = new Requisicao($validated);
        $requisicao->save();

        // Attach items to requisicao
        if (! empty($validated['items'])) {
            foreach ($validated['items'] as $itemData) {
                $valorTotal =
                    $itemData['quantidade_solicitada'] *
                    $itemData['valor_unitario_maximo'];

                $requisicao->items()->attach($itemData['item_id'], [
                    'quantidade_solicitada' => $itemData['quantidade_solicitada'],
                    'valor_unitario_maximo' => $itemData['valor_unitario_maximo'],
                    'valor_total_maximo' => $valorTotal,
                    'observacao' => $itemData['observacao'] ?? null,
                ]);
            }
        }

        return redirect()
            ->route('requisicoes.show', $requisicao)
            ->with('success', 'Requisição criada com sucesso!');
    }

    /**
     * Display the specified requisição.
     */
    public function show(Requisicao $requisicao): Response
    {
        $requisicao->load([
            'emitente',
            'destinatario',
            'fornecedor',
            'usuarioCriacao',
            'usuarioConcretizacao',
            'usuarioExclusao',
            'items',
        ]);

        $requisicaoData = [
            'id' => $requisicao->id,
            'numero' => $requisicao->numero,
            'numero_completo' => $requisicao->numero_completo,
            'solicitante' => $requisicao->solicitante,
            'numero_oficio' => $requisicao->numero_oficio,
            'data_recebimento' => $requisicao->data_recebimento
                ? $requisicao->data_recebimento->format('d/m/Y')
                : null,
            'descricao' => $requisicao->descricao,
            'anexo' => $requisicao->anexo,
            'status' => $requisicao->status,
            'status_display' => $requisicao->status_display,
            'status_color' => $requisicao->status_color,
            'numero_pedido_real' => $requisicao->numero_pedido_real,
            'valor_final' => $requisicao->valor_final,
            'data_concretizacao' => $requisicao->data_concretizacao
                ? $requisicao->data_concretizacao->format('d/m/Y H:i')
                : null,
            'data_exclusao' => $requisicao->data_exclusao
                ? $requisicao->data_exclusao->format('d/m/Y H:i')
                : null,
            'motivo_exclusao' => $requisicao->motivo_exclusao,
            'pode_editar' => $requisicao->podeEditar(),
            'pode_concretizar' => $requisicao->podeConcretizar(),
            'pode_excluir' => $requisicao->podeExcluir(),
            'pode_cancelar' => $requisicao->podeCancelar(),
            'created_at' => $requisicao->created_at->format('d/m/Y H:i'),
            'updated_at' => $requisicao->updated_at->format('d/m/Y H:i'),
            'valor_total_itens' => $requisicao->getValorTotalItens(),
        ];

        $items = $requisicao->items->map(function ($item) {
            return [
                'id' => $item->id,
                'code' => $item->code,
                'name' => $item->name,
                'unit_of_measurement' => $item->unit_of_measurement,
                'quantidade_solicitada' => $item->pivot->quantidade_solicitada,
                'valor_unitario_maximo' => $item->pivot->valor_unitario_maximo,
                'valor_total_maximo' => $item->pivot->valor_total_maximo,
                'observacao' => $item->pivot->observacao,
            ];
        });

        $relations = [
            'emitente' => $requisicao->emitente
                ? [
                    'id' => $requisicao->emitente->id,
                    'nome' => $requisicao->emitente->nome,
                    'sigla' => $requisicao->emitente->sigla,
                    'endereco' => $requisicao->emitente->endereco,
                    'telefone' => $requisicao->emitente->telefone,
                    'email' => $requisicao->emitente->email,
                ]
                : null,
            'destinatario' => $requisicao->destinatario
                ? [
                    'id' => $requisicao->destinatario->id,
                    'nome' => $requisicao->destinatario->nome,
                    'sigla' => $requisicao->destinatario->sigla,
                    'endereco' => $requisicao->destinatario->endereco,
                    'telefone' => $requisicao->destinatario->telefone,
                    'email' => $requisicao->destinatario->email,
                ]
                : null,
            'fornecedor' => $requisicao->fornecedor
                ? [
                    'id' => $requisicao->fornecedor->id,
                    'razao_social' => $requisicao->fornecedor->razao_social,
                    'cnpj' => $requisicao->fornecedor->cnpj,
                    'cnpj_formatado' => $requisicao->fornecedor->cnpj_formatado,
                    'telefone' => $requisicao->fornecedor->telefone,
                    'telefone_formatado' => $requisicao->fornecedor->telefone_formatado,
                    'email' => $requisicao->fornecedor->email,
                    'endereco_completo' => $requisicao->fornecedor->endereco_completo,
                ]
                : null,
            'usuario_criacao' => $requisicao->usuarioCriacao
                ? [
                    'name' => $requisicao->usuarioCriacao->name,
                    'email' => $requisicao->usuarioCriacao->email,
                ]
                : null,
            'usuario_concretizacao' => $requisicao->usuarioConcretizacao
                ? [
                    'name' => $requisicao->usuarioConcretizacao->name,
                    'email' => $requisicao->usuarioConcretizacao->email,
                ]
                : null,
            'usuario_exclusao' => $requisicao->usuarioExclusao
                ? [
                    'name' => $requisicao->usuarioExclusao->name,
                    'email' => $requisicao->usuarioExclusao->email,
                ]
                : null,
        ];

        // Get fornecedores for concretizar modal
        $fornecedores = \App\Models\Fornecedor::query()
            ->where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social']);

        return Inertia::render('Requisicoes/Show', [
            'requisicao' => $requisicaoData,
            'relations' => $relations,
            'fornecedores' => $fornecedores,
            'items' => $items,
        ]);
    }

    /**
     * Show the form for editing the specified requisição.
     */
    public function edit(Requisicao $requisicao): Response|RedirectResponse
    {
        // Check if requisicao can be edited
        if (! in_array($requisicao->status, ['autorizada'])) {
            return redirect()
                ->route('requisicoes.show', $requisicao)
                ->with('error', 'Esta requisição não pode ser editada.');
        }

        $requisicao->load('items');

        $emitentes = Emitente::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'sigla']);
        $destinatarios = Destinatario::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'sigla']);
        $allItems = Item::query()
            ->orderBy('name')
            ->get([
                'id',
                'code',
                'name',
                'unit_of_measurement',
                'medium_price',
            ]);

        $requisicaoItems = $requisicao->items->map(function ($item) {
            return [
                'item_id' => $item->id,
                'quantidade_solicitada' => $item->pivot->quantidade_solicitada,
                'valor_unitario_maximo' => $item->pivot->valor_unitario_maximo,
                'observacao' => $item->pivot->observacao,
            ];
        });

        return Inertia::render('Requisicoes/Edit', [
            'requisicao' => [
                'id' => $requisicao->id,
                'numero' => $requisicao->numero,
                'emitente_id' => $requisicao->emitente_id,
                'destinatario_id' => $requisicao->destinatario_id,
                'solicitante' => $requisicao->solicitante,
                'numero_oficio' => $requisicao->numero_oficio,
                'data_recebimento' => $requisicao->data_recebimento
                    ? $requisicao->data_recebimento->format('Y-m-d')
                    : null,
                'descricao' => $requisicao->descricao,
                'anexo' => $requisicao->anexo,
                'items' => $requisicaoItems,
            ],
            'emitentes' => $emitentes,
            'destinatarios' => $destinatarios,
            'items' => $allItems,
        ]);
    }

    /**
     * Update the specified requisição in storage.
     */
    public function update(
        Request $request,
        Requisicao $requisicao,
    ): RedirectResponse {
        if (! $requisicao->podeEditar()) {
            return redirect()
                ->route('requisicoes.show', $requisicao)
                ->with('error', 'Esta requisição não pode ser editada.');
        }

        $validated = $request->validate([
            'numero' => 'required|string|unique:requisicoes,numero,'.$requisicao->id,
            'emitente_id' => 'required|exists:emitentes,id',
            'destinatario_id' => 'required|exists:destinatarios,id',
            'solicitante' => 'required|string|max:255',
            'numero_oficio' => 'nullable|string|max:100',
            'data_recebimento' => 'required|date',
            'descricao' => 'required|string',
            'anexo' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantidade_solicitada' => 'required|integer|min:1',
            'items.*.valor_unitario_maximo' => 'required|numeric|min:0',
            'items.*.observacao' => 'nullable|string|max:500',
        ]);

        // Handle file upload
        if ($request->hasFile('anexo')) {
            // Delete old file if exists
            if ($requisicao->anexo) {
                \Storage::disk('public')->delete($requisicao->anexo);
            }
            $validated['anexo'] = $request
                ->file('anexo')
                ->store('requisicoes/anexos', 'public');
        }

        $requisicao->update($validated);

        // Update complete number if emitente changed
        if ($requisicao->wasChanged('emitente_id')) {
            $requisicao->update([
                'numero_completo' => $requisicao->gerarNumeroCompleto(),
            ]);
        }

        // Sync items - detach all and re-attach
        $requisicao->items()->detach();
        if (! empty($validated['items'])) {
            foreach ($validated['items'] as $itemData) {
                $valorTotal =
                    $itemData['quantidade_solicitada'] *
                    $itemData['valor_unitario_maximo'];

                $requisicao->items()->attach($itemData['item_id'], [
                    'quantidade_solicitada' => $itemData['quantidade_solicitada'],
                    'valor_unitario_maximo' => $itemData['valor_unitario_maximo'],
                    'valor_total_maximo' => $valorTotal,
                    'observacao' => $itemData['observacao'] ?? null,
                ]);
            }
        }

        return redirect()
            ->route('requisicoes.show', $requisicao)
            ->with('success', 'Requisição atualizada com sucesso!');
    }

    /**
     * Concretizar requisição.
     */
    public function concretizar(
        Request $request,
        Requisicao $requisicao,
    ): RedirectResponse {
        if (! $requisicao->podeConcretizar()) {
            return redirect()
                ->back()
                ->with('error', 'Esta requisição não pode ser concretizada.');
        }

        $validated = $request->validate([
            'fornecedor_id' => 'required|exists:fornecedores,id',
            'numero_pedido_real' => 'required|string|max:100',
            'valor_final' => 'required|numeric|min:0',
        ]);

        $requisicao->concretizar($validated, $request->user());

        // Check for active contract and register monthly value
        $dataRecebimento = $requisicao->data_recebimento;
        $contrato = Contrato::findContratoVigente(
            $requisicao->fornecedor_id,
            $dataRecebimento,
        );

        $warningMessage = null;
        if ($contrato && $contrato->limite_valor_mensal !== null) {
            $ano = $dataRecebimento->year;
            $mes = $dataRecebimento->month;
            $valor = (float) $validated['valor_final'];

            // Check if exceeds monthly limit
            if ($contrato->excedeLimiteMensal($valor, $ano, $mes)) {
                $valorExcedente = $contrato->getValorExcedente(
                    $valor,
                    $ano,
                    $mes,
                );
                $warningMessage = sprintf(
                    'ATENÇÃO: O valor desta requisição (R$ %s) excede o limite mensal do contrato %s. '.
                        'Limite: R$ %s. Valor utilizado no mês: R$ %s. Valor excedente: R$ %s. '.
                        'A requisição foi adicionada, mas está marcada como excedente.',
                    number_format($valor, 2, ',', '.'),
                    $contrato->numero_contrato,
                    number_format(
                        (float) $contrato->limite_valor_mensal,
                        2,
                        ',',
                        '.',
                    ),
                    number_format(
                        $contrato->getValorUsadoNoMes($ano, $mes),
                        2,
                        ',',
                        '.',
                    ),
                    number_format($valorExcedente, 2, ',', '.'),
                );
            }

            // Register the monthly value
            $contrato->registrarValorMensal($requisicao, $request->user());
        }

        return redirect()
            ->route('requisicoes.show', $requisicao)
            ->with('success', 'Requisição concretizada com sucesso!')
            ->with('warning', $warningMessage);
    }

    /**
     * Remove the specified requisição from storage (logical delete).
     */
    public function destroy(
        Request $request,
        Requisicao $requisicao,
    ): RedirectResponse {
        if (! $requisicao->podeExcluir()) {
            return redirect()
                ->back()
                ->with('error', 'Esta requisição não pode ser excluída.');
        }

        $validated = $request->validate([
            'motivo_exclusao' => 'required|string|max:500',
        ]);

        $requisicao->excluirLogicamente(
            $validated['motivo_exclusao'],
            $request->user(),
        );

        return redirect()
            ->route('requisicoes.index')
            ->with('success', 'Requisição excluída com sucesso!');
    }

    /**
     * Cancel the specified requisição.
     */
    public function cancelar(
        Request $request,
        Requisicao $requisicao,
    ): RedirectResponse {
        if (! $requisicao->podeCancelar()) {
            return redirect()
                ->back()
                ->with('error', 'Esta requisição não pode ser cancelada.');
        }

        $validated = $request->validate([
            'motivo_cancelamento' => 'required|string|max:500',
        ]);

        $requisicao->cancelar(
            $validated['motivo_cancelamento'],
            $request->user(),
        );

        return redirect()
            ->route('requisicoes.show', $requisicao)
            ->with('success', 'Requisição cancelada com sucesso!');
    }

    /**
     * Show deleted requisições.
     */
    public function excluidas(Request $request): Response
    {
        $query = Requisicao::query()
            ->where('status', 'excluida')
            ->with([
                'emitente',
                'destinatario',
                'fornecedor',
                'usuarioExclusao',
            ]);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('numero', 'like', "%{$request->search}%")
                    ->orWhere('numero_completo', 'like', "%{$request->search}%")
                    ->orWhere('solicitante', 'like', "%{$request->search}%");
            });
        }

        $requisicoes = $query
            ->orderBy('data_exclusao', 'desc')
            ->paginate(15)
            ->withQueryString();

        $requisicoes->getCollection()->transform(function ($requisicao) {
            return [
                'id' => $requisicao->id,
                'numero_completo' => $requisicao->numero_completo,
                'solicitante' => $requisicao->solicitante,
                'data_recebimento' => $requisicao->data_recebimento->format(
                    'd/m/Y',
                ),
                'data_exclusao' => $requisicao->data_exclusao->format(
                    'd/m/Y H:i',
                ),
                'motivo_exclusao' => $requisicao->motivo_exclusao,
                'emitente' => $requisicao->emitente
                    ? [
                        'nome' => $requisicao->emitente->nome,
                        'sigla' => $requisicao->emitente->sigla,
                    ]
                    : null,
                'usuario_exclusao' => $requisicao->usuarioExclusao
                    ? [
                        'name' => $requisicao->usuarioExclusao->name,
                    ]
                    : null,
            ];
        });

        return Inertia::render('Requisicoes/Excluidas', [
            'requisicoes' => $requisicoes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Generate PDF for requisição.
     */
    public function pdf(
        Request $request,
        Requisicao $requisicao,
        PdfService $pdfService,
    ): \Illuminate\Http\Response {
        $type = $request->get('type', 'setor'); // 'setor' or 'fornecedor'

        if (! in_array($type, ['setor', 'fornecedor'])) {
            $type = 'setor';
        }

        return $pdfService->generateRequisicaoPdf($requisicao, $type);
    }

    /**
     * Download anexo.
     */
    public function anexo(
        Requisicao $requisicao,
    ): \Illuminate\Http\RedirectResponse|\Symfony\Component\HttpFoundation\StreamedResponse {
        if (! $requisicao->anexo) {
            return redirect()
                ->back()
                ->with('error', 'Esta requisição não possui anexo.');
        }

        if (! Storage::disk('public')->exists($requisicao->anexo)) {
            return redirect()->back()->with('error', 'Arquivo não encontrado.');
        }

        $filename = basename($requisicao->anexo);

        return Storage::disk('public')->download(
            $requisicao->anexo,
            basename($requisicao->anexo),
        );
    }

    /**
     * Export requisições to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $query = Requisicao::query()
            ->where('status', '!=', 'excluida')
            ->with(['emitente', 'destinatario', 'fornecedor']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where(
                    'numero_completo',
                    'like',
                    "%{$request->search}%",
                )->orWhere('objeto', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('emitente_id')) {
            $query->where('emitente_id', $request->emitente_id);
        }

        if ($request->filled('data_inicio')) {
            $query->whereDate('data_recebimento', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('data_recebimento', '<=', $request->data_fim);
        }

        $requisicoes = $query->orderBy('created_at', 'desc')->get();

        $filename = 'requisicoes_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($requisicoes) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv(
                $file,
                [
                    'Número Completo',
                    'Emitente',
                    'Destinatário',
                    'Fornecedor',
                    'Objeto',
                    'Status',
                    'Valor Total',
                    'Data Recebimento',
                    'Data Vencimento',
                    'Observações',
                    'Data Criação',
                    'Data Atualização',
                ],
                ';',
                '"',
                '\\',
            );

            foreach ($requisicoes as $requisicao) {
                fputcsv(
                    $file,
                    [
                        $requisicao->numero_completo,
                        $requisicao->emitente?->nome ?? '',
                        $requisicao->destinatario?->nome ?? '',
                        $requisicao->fornecedor?->razao_social ?? '',
                        $requisicao->objeto,
                        ucfirst($requisicao->status),
                        'R$ '.
                        number_format(
                            $requisicao->valor_total ?? 0,
                            2,
                            ',',
                            '.',
                        ),
                        $requisicao->data_recebimento?->format('d/m/Y') ?? '',
                        $requisicao->data_vencimento?->format('d/m/Y') ?? '',
                        $requisicao->observacoes ?? '',
                        $requisicao->created_at->format('d/m/Y H:i'),
                        $requisicao->updated_at->format('d/m/Y H:i'),
                    ],
                    ';',
                    '"',
                    '\\',
                );
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
