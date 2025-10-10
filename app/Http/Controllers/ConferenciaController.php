<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Contrato;
use App\Models\Fornecedor;
use App\Models\PedidoManual;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ConferenciaController extends Controller
{
    /**
     * Display a listing of the conferências.
     */
    public function index(Request $request): Response
    {
        $query = Conferencia::with('fornecedor');

        // Search functionality
        if ($request->filled('search')) {
            $query->whereHas('fornecedor', function ($q) use ($request) {
                $q->where('razao_social', 'like', "%{$request->search}%");
            });
        }

        // Fornecedor filter
        if ($request->filled('fornecedor_id')) {
            $query->where('fornecedor_id', $request->fornecedor_id);
        }

        // Date range filter
        if ($request->filled('data_inicio')) {
            $query->whereDate('periodo_inicio', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('periodo_fim', '<=', $request->data_fim);
        }

        // Calculate statistics for the complete filtered dataset (before pagination)
        $statsQuery = clone $query;
        $allConferencias = $statsQuery->get();

        $stats = [
            'total_conferencias' => $allConferencias->count(),
            'em_andamento' => $allConferencias
                ->where('status', 'em_andamento')
                ->count(),
            'finalizadas' => $allConferencias
                ->where('status', 'finalizada')
                ->count(),
            'este_mes' => $allConferencias
                ->filter(
                    fn ($conferencia) => $conferencia->periodo_inicio?->format(
                        'Y-m',
                    ) === now()->format('Y-m') ||
                        $conferencia->periodo_fim?->format('Y-m') ===
                            now()->format('Y-m'),
                )
                ->count(),
            'fornecedores_unicos' => $allConferencias
                ->pluck('fornecedor_id')
                ->unique()
                ->count(),
            'valor_total' => $allConferencias->sum('total_geral') ?? 0,
        ];

        $conferenciasPaginated = $query
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $conferenciasPaginated->getCollection()->transform(
            fn ($conferencia) => [
                /**
                 * @var Conferencia $conferencia
                 */
                'id' => $conferencia->id,
                'periodo_inicio' => $conferencia->periodo_inicio
                    ? $conferencia->periodo_inicio->format('d/m/Y')
                    : '',
                'periodo_fim' => $conferencia->periodo_fim
                    ? $conferencia->periodo_fim->format('d/m/Y')
                    : '',
                'periodo_display' => $conferencia->periodo_display,
                'periodo' => $conferencia->periodo_display,
                'status' => $conferencia->status,
                'status_display' => $conferencia->status_display,
                'status_color' => $conferencia->status_color,
                'total_requisicoes' => $conferencia->total_requisicoes,
                'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
                'total_geral' => $conferencia->total_geral,
                'observacoes' => $conferencia->observacoes,
                'fornecedor' => $conferencia->fornecedor
                    ? [
                        'id' => $conferencia->fornecedor->id,
                        'razao_social' => $conferencia->fornecedor->razao_social,
                        'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                    ]
                    : null,
                'created_at' => $conferencia->created_at->format('d/m/Y H:i'),
            ],
        );

        $fornecedores = Fornecedor::query()
            ->where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social']);

        return Inertia::render('Conferencias/Index', [
            'conferencias' => $conferenciasPaginated,
            'fornecedores' => $fornecedores,
            'stats' => $stats,
            'filters' => $request->only([
                'search',
                'fornecedor_id',
                'data_inicio',
                'data_fim',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new conferência.
     */
    public function create(): Response
    {
        $fornecedores = Fornecedor::query()
            ->where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social']);

        return Inertia::render('Conferencias/Create', [
            'fornecedores' => $fornecedores,
        ]);
    }

    /**
     * Store a newly created conferência in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fornecedor_id' => 'required|exists:fornecedores,id',
            'periodo' => 'required|string|max:100|regex:/^\d{2}\/\d{4}$/',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        $fornecedor = Fornecedor::query()->findOrFail($request->fornecedor_id);

        // Parse periodo (MM/YYYY) to generate periodo_inicio and periodo_fim
        $periodo = $validated['periodo'];
        if (preg_match('/^(\d{2})\/(\d{4})$/', $periodo, $matches)) {
            $month = intval($matches[1]);
            $year = intval($matches[2]);

            // Create first day of the month
            $periodo_inicio = \Carbon\Carbon::create($year, $month, 1);
            // Create last day of the month
            $periodo_fim = $periodo_inicio->copy()->endOfMonth();
        } else {
            return redirect()
                ->back()
                ->withErrors([
                    'periodo' => 'Formato de período inválido. Use MM/AAAA (ex: 01/2024)',
                ])
                ->withInput();
        }

        // Check contract limits for the fornecedor
        $contrato = Contrato::findContratoVigente(
            $validated['fornecedor_id'],
            $periodo_inicio,
        );

        if ($contrato && $contrato->limiteConferenciasAtingido()) {
            return redirect()
                ->back()
                ->withErrors([
                    'fornecedor_id' => 'O limite de conferências para o contrato '.
                        $contrato->numero_contrato.
                        ' foi atingido. Limite: '.
                        $contrato->limite_conferencias.
                        ', Utilizadas: '.
                        $contrato->getCountConferencias().
                        '.',
                ])
                ->withInput();
        }

        // Calculate totals
        $validated['total_requisicoes'] = $fornecedor->getTotalRequisicoes();
        $validated[
            'total_pedidos_manuais'
        ] = $fornecedor->getTotalPedidosManuais();
        $validated['total_geral'] = $fornecedor->getTotalGeral();

        // Add the parsed dates and user info
        $validated['periodo_inicio'] = $periodo_inicio;
        $validated['periodo_fim'] = $periodo_fim;
        $validated['usuario_criacao_id'] = Auth::id();

        // Remove the original periodo field as it's not in the database
        unset($validated['periodo']);

        $conferencia = new Conferencia($validated);
        $conferencia->save();

        return redirect()
            ->route('conferencias.show', $conferencia)
            ->with('success', 'Conferência criada com sucesso!');
    }

    /**
     * Display the specified conferência.
     */
    public function show(Conferencia $conferencia): Response
    {
        $conferencia->load('fornecedor');

        $conferenciaData = [
            'id' => $conferencia->id,
            'periodo_inicio' => $conferencia->periodo_inicio
                ? $conferencia->periodo_inicio->format('d/m/Y')
                : '',
            'periodo_fim' => $conferencia->periodo_fim
                ? $conferencia->periodo_fim->format('d/m/Y')
                : '',
            'periodo_display' => $conferencia->periodo_display,
            'total_requisicoes' => $conferencia->total_requisicoes,
            'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
            'total_geral' => $conferencia->total_geral,
            'status' => $conferencia->status,
            'status_display' => $conferencia->status_display,
            'status_color' => $conferencia->status_color,
            'observacoes' => $conferencia->observacoes,
            'created_at' => $conferencia->created_at->format('d/m/Y H:i'),
            'updated_at' => $conferencia->updated_at->format('d/m/Y H:i'),
        ];

        $fornecedor = $conferencia->fornecedor
            ? [
                'id' => $conferencia->fornecedor->id,
                'razao_social' => $conferencia->fornecedor->razao_social,
                'cnpj' => $conferencia->fornecedor->cnpj,
                'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                'telefone' => $conferencia->fornecedor->telefone,
                'telefone_formatado' => $conferencia->fornecedor->telefone_formatado,
                'email' => $conferencia->fornecedor->email,
                'endereco_completo' => $conferencia->fornecedor->endereco_completo,
            ]
            : null;

        return Inertia::render('Conferencias/Show', [
            'conferencia' => $conferenciaData,
            'fornecedor' => $fornecedor,
        ]);
    }

    /**
     * Show the form for editing the specified conferência.
     */
    public function edit(Conferencia $conferencia): Response
    {
        $conferencia->load(['fornecedor', 'pedidosManuais']);

        // Get requisições for this period
        $requisicoes = $conferencia->getRequisicoes();

        $conferenciaData = [
            'id' => $conferencia->id,
            'fornecedor_id' => $conferencia->fornecedor_id,
            'periodo_inicio' => $conferencia->periodo_inicio
                ? $conferencia->periodo_inicio->format('Y-m-d')
                : '',
            'periodo_fim' => $conferencia->periodo_fim
                ? $conferencia->periodo_fim->format('d/m/Y')
                : '',
            'periodo_display' => $conferencia->periodo_display,
            'total_requisicoes' => $conferencia->total_requisicoes,
            'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
            'total_geral' => $conferencia->total_geral,
            'status' => $conferencia->status,
            'status_display' => $conferencia->status_display,
            'status_color' => $conferencia->status_color,
            'observacoes' => $conferencia->observacoes,
            'pode_editar' => $conferencia->podeEditar(),
            'pode_finalizar' => $conferencia->podeFinalizar(),
        ];

        $fornecedor = $conferencia->fornecedor
            ? [
                'id' => $conferencia->fornecedor->id,
                'razao_social' => $conferencia->fornecedor->razao_social,
                'cnpj' => $conferencia->fornecedor->cnpj,
                'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                'telefone' => $conferencia->fornecedor->telefone,
                'telefone_formatado' => $conferencia->fornecedor->telefone_formatado,
                'email' => $conferencia->fornecedor->email,
                'endereco_completo' => $conferencia->fornecedor->endereco_completo,
            ]
            : null;

        $requisicoesData = $requisicoes->map(
            fn ($req) => [
                'id' => $req->id,
                'numero_completo' => $req->numero_completo,
                'descricao' => $req->descricao,
                'valor_final' => $req->valor_final,
                'data_concretizacao' => $req->data_concretizacao
                    ? $req->data_concretizacao->format('d/m/Y')
                    : null,
                'status' => $req->status,
                'emitente' => $req->emitente
                    ? [
                        'nome' => $req->emitente->nome,
                        'sigla' => $req->emitente->sigla,
                    ]
                    : null,
            ],
        );

        $pedidosManuaisData = $conferencia->pedidosManuais->map(
            fn ($pedido) => [
                'id' => $pedido->id,
                'descricao' => $pedido->descricao,
                'valor' => $pedido->valor,
                'numero_pedido' => $pedido->numero_pedido,
                'data_pedido' => $pedido->data_pedido
                    ? $pedido->data_pedido->format('d/m/Y')
                    : null,
                'observacoes' => $pedido->observacoes,
            ],
        );

        $totals = [
            'total_requisicoes' => $conferencia->total_requisicoes,
            'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
            'total_geral' => $conferencia->total_geral,
        ];

        return Inertia::render('Conferencias/Edit', [
            'conferencia' => $conferenciaData,
            'fornecedor' => $fornecedor,
            'requisicoes' => $requisicoesData,
            'pedidos_manuais' => $pedidosManuaisData,
            'totals' => $totals,
        ]);
    }

    /**
     * Update the specified conferência in storage.
     */
    public function update(
        Request $request,
        Conferencia $conferencia,
    ): RedirectResponse {
        // Check if can edit
        if (! $conferencia->podeEditar()) {
            return redirect()
                ->route('conferencias.show', $conferencia)
                ->with('error', 'Conferência finalizada não pode ser editada.');
        }

        $validated = $request->validate([
            'observacoes' => 'nullable|string|max:1000',
            'status' => 'nullable|in:em_andamento,finalizada',
        ]);

        // If finalizing, set finalization data
        if (
            isset($validated['status']) &&
            $validated['status'] === 'finalizada' &&
            $conferencia->status === 'em_andamento'
        ) {
            $conferencia->finalizar(Auth::user());
        }

        // Update observations if provided
        if (isset($validated['observacoes'])) {
            $conferencia->observacoes = $validated['observacoes'];
            $conferencia->save();
        }

        // Recalculate totals
        $conferencia->calcularTotais();

        return redirect()
            ->route('conferencias.show', $conferencia)
            ->with('success', 'Conferência atualizada com sucesso!');
    }

    /**
     * Display conferência for specific fornecedor and period.
     */
    /**
     * Display conference details for a specific fornecedor and period.
     *
     * @return Response
     */
    public function fornecedor(
        Request $request,
        int $fornecedorId,
        string $periodo,
    ): Response|RedirectResponse {
        $fornecedor = Fornecedor::query()->findOrFail($fornecedorId);

        // Parse period (e.g., "2024-01" for January 2024)
        $periodoData = explode('-', $periodo);
        if (count($periodoData) !== 2) {
            return redirect()
                ->route('conferencias.index')
                ->with('error', 'Período inválido.');
        }

        $ano = (int) $periodoData[0];
        $mes = (int) $periodoData[1];

        // Get requisições for the period
        $requisicoes = $fornecedor
            ->requisicoes()
            ->where('status', 'concretizada')
            ->whereYear('data_concretizacao', $ano)
            ->whereMonth('data_concretizacao', $mes)
            ->with(['emitente', 'destinatario'])
            ->orderBy('data_concretizacao')
            ->get()
            ->map(
                fn ($req) => [
                    'id' => $req->id,
                    'numero_completo' => $req->numero_completo,
                    'solicitante' => $req->solicitante,
                    'valor_final' => $req->valor_final,
                    'numero_pedido_real' => $req->numero_pedido_real,
                    'data_concretizacao' => $req->data_concretizacao->format(
                        'd/m/Y',
                    ),
                    'emitente' => $req->emitente
                        ? [
                            'nome' => $req->emitente->nome,
                            'sigla' => $req->emitente->sigla,
                        ]
                        : null,
                    'destinatario' => $req->destinatario
                        ? [
                            'nome' => $req->destinatario->nome,
                        ]
                        : null,
                ],
            );

        // Get pedidos manuais for the period
        $pedidosManuais = $fornecedor
            ->pedidosManuais()
            ->whereYear('data_pedido', $ano)
            ->whereMonth('data_pedido', $mes)
            ->orderBy('data_pedido')
            ->get()
            ->map(
                fn ($pedido) => [
                    'id' => $pedido->id,
                    'descricao' => $pedido->descricao,
                    'valor' => $pedido->valor,
                    'numero_pedido' => $pedido->numero_pedido,
                    'data_pedido' => $pedido->data_pedido,
                ],
            );

        $totals = [
            'requisicoes' => $requisicoes->sum('valor_final'),
            'pedidos_manuais' => $pedidosManuais->sum('valor'),
            'geral' => $requisicoes->sum('valor_final') +
                $pedidosManuais->sum('valor'),
        ];

        $fornecedorData = [
            'id' => $fornecedor->id,
            'razao_social' => $fornecedor->razao_social,
            'cnpj_formatado' => $fornecedor->cnpj_formatado,
            'telefone_formatado' => $fornecedor->telefone_formatado,
            'email' => $fornecedor->email,
            'endereco_completo' => $fornecedor->endereco_completo,
        ];

        return Inertia::render('Conferencias/Fornecedor', [
            'fornecedor' => $fornecedorData,
            'periodo' => $periodo,
            'periodo_display' => sprintf('%02d/%d', $mes, $ano),
            'requisicoes' => $requisicoes,
            'pedidos_manuais' => $pedidosManuais,
            'totals' => $totals,
        ]);
    }

    /**
     * Export conferências to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $query = Conferencia::query()->with('fornecedor');

        // Search functionality
        if ($request->filled('search')) {
            $query
                ->whereHas('fornecedor', function ($q) use ($request) {
                    $q->where('razao_social', 'like', "%{$request->search}%");
                })
                ->orWhere('periodo', 'like', "%{$request->search}%");
        }

        // Fornecedor filter
        if ($request->filled('fornecedor_id')) {
            $query->where('fornecedor_id', $request->fornecedor_id);
        }

        // Date range filter
        if ($request->filled('data_inicio')) {
            $query->whereDate('data_conferencia', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('data_conferencia', '<=', $request->data_fim);
        }

        $conferencias = $query->orderBy('created_at', 'desc')->get();

        $filename = 'conferencias_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($conferencias) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv(
                $file,
                [
                    'ID',
                    'Período',
                    'Fornecedor',
                    'Total Requisições',
                    'Total Pedidos Manuais',
                    'Total Geral',
                    'Data Conferência',
                    'Observações',
                    'Data Criação',
                    'Data Atualização',
                ],
                ';',
                '"',
                '\\',
            );

            foreach ($conferencias as $conferencia) {
                fputcsv(
                    $file,
                    [
                        $conferencia->id,
                        $conferencia->periodo,
                        $conferencia->fornecedor?->razao_social ?? '',
                        'R$ '.
                        number_format(
                            $conferencia->total_requisicoes ?? 0,
                            2,
                            ',',
                            '.',
                        ),
                        'R$ '.
                        number_format(
                            $conferencia->total_pedidos_manuais ?? 0,
                            2,
                            ',',
                            '.',
                        ),
                        'R$ '.
                        number_format(
                            $conferencia->total_geral ?? 0,
                            2,
                            ',',
                            '.',
                        ),
                        $conferencia->data_conferencia?->format('d/m/Y') ?? '',
                        $conferencia->observacoes ?? '',
                        $conferencia->created_at->format('d/m/Y H:i'),
                        $conferencia->updated_at->format('d/m/Y H:i'),
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

    /**
     * Remove the specified conferência from storage.
     */
    public function destroy(Conferencia $conferencia): RedirectResponse
    {
        $conferencia->delete();

        return redirect()
            ->route('conferencias.index')
            ->with('success', 'Conferência excluída com sucesso!');
    }

    /**
     * Store a new pedido manual for conferência.
     */
    public function storePedidoManual(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'conferencia_id' => 'required|exists:conferencias,id',
            'descricao' => 'required|string|max:500',
            'valor' => 'required|numeric|min:0',
            'numero_pedido' => 'nullable|string|max:100',
            'data_pedido' => 'required|date',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        $conferencia = Conferencia::query()->findOrFail(
            $validated['conferencia_id'],
        );

        // Check if can edit
        if (! $conferencia->podeEditar()) {
            return redirect()
                ->route('conferencias.show', $conferencia)
                ->with('error', 'Conferência finalizada não pode ser editada.');
        }

        $pedidoManual = new PedidoManual($validated);
        $pedidoManual->fornecedor_id = $conferencia->fornecedor_id;
        $pedidoManual->conferencia_id = $conferencia->id;
        $pedidoManual->save();

        // Recalculate totals
        $conferencia->calcularTotais();

        return redirect()
            ->route('conferencias.edit', $conferencia)
            ->with('success', 'Pedido manual adicionado com sucesso!');
    }

    /**
     * Delete a pedido manual from conferência.
     */
    public function destroyPedidoManual(
        int $conferenciaId,
        int $pedidoId,
    ): RedirectResponse {
        $conferencia = Conferencia::query()->findOrFail($conferenciaId);

        // Check if can edit
        if (! $conferencia->podeEditar()) {
            return redirect()
                ->route('conferencias.show', $conferencia)
                ->with('error', 'Conferência finalizada não pode ser editada.');
        }

        $pedidoManual = PedidoManual::query()->findOrFail($pedidoId);

        // Verify the pedido belongs to the correct conferencia
        if (
            $pedidoManual->conferencia_id != $conferencia->id ||
            $pedidoManual->fornecedor_id != $conferencia->fornecedor_id
        ) {
            return redirect()
                ->route('conferencias.edit', $conferencia)
                ->with('error', 'Pedido manual não encontrado.');
        }

        $pedidoManual->delete();

        // Recalculate totals
        $conferencia->calcularTotais();

        return redirect()
            ->route('conferencias.edit', $conferencia)
            ->with('success', 'Pedido manual excluído com sucesso!');
    }

    /**
     * Finalize conferência for a fornecedor and period.
     */
    public function finalizarConferencia(
        Request $request,
        int $fornecedorId,
        string $periodo,
    ): RedirectResponse {
        $fornecedor = Fornecedor::query()->findOrFail($fornecedorId);

        // Parse period (e.g., "2024-01" for January 2024)
        $periodoData = explode('-', $periodo);
        if (count($periodoData) !== 2) {
            return redirect()
                ->route('conferencias.index')
                ->with('error', 'Período inválido.');
        }

        $ano = (int) $periodoData[0];
        $mes = (int) $periodoData[1];

        // Create first and last day of the month
        $periodo_inicio = \Carbon\Carbon::create($ano, $mes, 1);
        $periodo_fim = $periodo_inicio->copy()->endOfMonth();

        // Check if conference already exists for this fornecedor and period
        $conferencia = Conferencia::query()
            ->where('fornecedor_id', $fornecedorId)
            ->where('periodo_inicio', $periodo_inicio)
            ->where('periodo_fim', $periodo_fim)
            ->first();

        if ($conferencia) {
            return redirect()
                ->route('conferencias.show', $conferencia)
                ->with('info', 'Conferência já foi finalizada anteriormente.');
        }

        // Calculate totals
        $totalRequisicoes =
            $fornecedor
                ->requisicoes()
                ->where('status', 'concretizada')
                ->whereYear('data_concretizacao', $ano)
                ->whereMonth('data_concretizacao', $mes)
                ->sum('valor_final') ?? 0;

        $totalPedidosManuais =
            $fornecedor
                ->pedidosManuais()
                ->whereYear('data_pedido', $ano)
                ->whereMonth('data_pedido', $mes)
                ->sum('valor') ?? 0;

        $totalGeral = $totalRequisicoes + $totalPedidosManuais;

        // Create the conference record
        $conferencia = new Conferencia([
            'fornecedor_id' => $fornecedor->id,
            'periodo_inicio' => $periodo_inicio,
            'periodo_fim' => $periodo_fim,
            'total_requisicoes' => $totalRequisicoes,
            'total_pedidos_manuais' => $totalPedidosManuais,
            'total_geral' => $totalGeral,
            'status' => 'finalizada',
            'usuario_finalizacao_id' => Auth::id(),
            'observacoes' => 'Conferência finalizada através do módulo de conferência detalhada.',
        ]);

        $conferencia->save();

        return redirect()
            ->route('conferencias.show', $conferencia)
            ->with('success', 'Conferência finalizada com sucesso!');
    }
}
