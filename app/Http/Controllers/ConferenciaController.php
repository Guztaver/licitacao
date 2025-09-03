<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
                 'em_andamento' => $allConferencias->where('status', 'em_andamento')->count(),
                 'finalizadas' => $allConferencias->where('status', 'finalizada')->count(),
                 'este_mes' => $allConferencias->filter(fn ($conferencia) =>
                     $conferencia->periodo_inicio?->format('Y-m') === now()->format('Y-m') ||
                            $conferencia->periodo_fim?->format('Y-m') === now()->format('Y-m')
                 )->count(),
                 'fornecedores_unicos' => $allConferencias->pluck('fornecedor_id')->unique()->count(),
                 'valor_total' => $allConferencias->sum('total_geral') ?? 0,
             ];

             $conferenciasPaginated = $query
                 ->orderBy('created_at', 'desc')
                 ->paginate(15)
                 ->withQueryString();

             $conferenciasPaginated->getCollection()->transform(fn ($conferencia) =>
                 [
                     'id' => $conferencia->id,
                     'periodo_inicio' => $conferencia->periodo_inicio->format('d/m/Y'),
                     'periodo_fim' => $conferencia->periodo_fim->format('d/m/Y'),
                     'periodo_display' => $conferencia->periodo_display,
                     'status' => $conferencia->status,
                     'status_display' => $conferencia->status_display,
                     'status_color' => $conferencia->status_color,
                     'total_requisicoes' => $conferencia->total_requisicoes,
                     'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
                     'total_geral' => $conferencia->total_geral,
                     'observacoes' => $conferencia->observacoes,
                     'fornecedor' => $conferencia->fornecedor ? [
                         'id' => $conferencia->fornecedor->id,
                         'razao_social' => $conferencia->fornecedor->razao_social,
                         'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                     ] : null,
                     'created_at' => $conferencia->created_at->format('d/m/Y H:i'),
                 ]
             );

             $fornecedores = Fornecedor::query()->where('status', true)->orderBy('razao_social')->get(['id', 'razao_social']);

             return Inertia::render('Conferencias/Index', [
                 'conferencias' => $conferenciasPaginated,
                 'fornecedores' => $fornecedores,
                 'stats' => $stats,
                 'filters' => $request->only(['search', 'fornecedor_id', 'data_inicio', 'data_fim']),
             ]);
         }

    /**
     * Show the form for creating a new conferência.
     */
    public function create(): Response
    {
        $fornecedores = Fornecedor::query()->where('status', true)->orderBy('razao_social')->get(['id', 'razao_social']);

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
            return redirect()->back()
                ->withErrors(['periodo' => 'Formato de período inválido. Use MM/AAAA (ex: 01/2024)'])
                ->withInput();
        }

        // Calculate totals
        $validated['total_requisicoes'] = $fornecedor->getTotalRequisicoes();
        $validated['total_pedidos_manuais'] = $fornecedor->getTotalPedidosManuais();
        $validated['total_geral'] = $fornecedor->getTotalGeral();

        // Add the parsed dates and user info
        $validated['periodo_inicio'] = $periodo_inicio;
        $validated['periodo_fim'] = $periodo_fim;
        $validated['usuario_criacao_id'] = auth()->id();

        // Remove the original periodo field as it's not in the database
        unset($validated['periodo']);

        $conferencia = new Conferencia($validated);
        $conferencia->save();

        return redirect()->route('conferencias.show', $conferencia)
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
            'periodo_inicio' => $conferencia->periodo_inicio->format('d/m/Y'),
            'periodo_fim' => $conferencia->periodo_fim->format('d/m/Y'),
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

        $fornecedor = $conferencia->fornecedor ? [
            'id' => $conferencia->fornecedor->id,
            'razao_social' => $conferencia->fornecedor->razao_social,
            'cnpj' => $conferencia->fornecedor->cnpj,
            'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
            'telefone' => $conferencia->fornecedor->telefone,
            'telefone_formatado' => $conferencia->fornecedor->telefone_formatado,
            'email' => $conferencia->fornecedor->email,
            'endereco_completo' => $conferencia->fornecedor->endereco_completo,
        ] : null;

        return Inertia::render('Conferencias/Show', [
            'conferencia' => $conferenciaData,
            'fornecedor' => $fornecedor,
        ]);
    }

    /**
     * Display conferência for specific fornecedor and period.
     */
    public function fornecedor(Request $request, $fornecedorId, $periodo): Response
    {
        $fornecedor = Fornecedor::query()->findOrFail($fornecedorId);

        // Parse period (e.g., "2024-01" for January 2024)
        $periodoData = explode('-', $periodo);
        if (count($periodoData) !== 2) {
            return redirect()->route('conferencias.index')
                ->with('error', 'Período inválido.');
        }

        $ano = (int) $periodoData[0];
        $mes = (int) $periodoData[1];

        // Get requisições for the period
        $requisicoes = $fornecedor->requisicoes()
            ->concretizada()
            ->whereYear('data_concretizacao', $ano)
            ->whereMonth('data_concretizacao', $mes)
            ->with(['emitente', 'destinatario'])
            ->orderBy('data_concretizacao')
            ->get()
            ->map(fn ($req) =>
                [
                    'id' => $req->id,
                    'numero_completo' => $req->numero_completo,
                    'solicitante' => $req->solicitante,
                    'valor_final' => $req->valor_final,
                    'numero_pedido_real' => $req->numero_pedido_real,
                    'data_concretizacao' => $req->data_concretizacao->format('d/m/Y'),
                    'emitente' => $req->emitente ? [
                        'nome' => $req->emitente->nome,
                        'sigla' => $req->emitente->sigla,
                    ] : null,
                    'destinatario' => $req->destinatario ? [
                        'nome' => $req->destinatario->nome,
                    ] : null,
                ]
            );

        // Get pedidos manuais for the period
        $pedidosManuais = $fornecedor->pedidosManuais()
            ->whereYear('data_pedido', $ano)
            ->whereMonth('data_pedido', $mes)
            ->orderBy('data_pedido')
            ->get()
            ->map(fn ($pedido) =>
                [
                    'id' => $pedido->id,
                    'descricao' => $pedido->descricao,
                    'valor' => $pedido->valor,
                    'numero_pedido' => $pedido->numero_pedido,
                    'data_pedido' => $pedido->data_pedido,
                ]
            );

        $totals = [
            'requisicoes' => $requisicoes->sum('valor_final'),
            'pedidos_manuais' => $pedidosManuais->sum('valor'),
            'geral' => $requisicoes->sum('valor_final') + $pedidosManuais->sum('valor'),
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
    public function export(Request $request)
    {
        $query = Conferencia::query()->with('fornecedor');

        // Search functionality
        if ($request->filled('search')) {
            $query->whereHas('fornecedor', function ($q) use ($request) {
                $q->where('razao_social', 'like', "%{$request->search}%");
            })->orWhere('periodo', 'like', "%{$request->search}%");
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
            fputcsv($file, [
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
            ], ';', '"', '\\');

            foreach ($conferencias as $conferencia) {
                fputcsv($file, [
                    $conferencia->id,
                    $conferencia->periodo,
                    $conferencia->fornecedor?->razao_social ?? '',
                    'R$ '.number_format($conferencia->total_requisicoes ?? 0, 2, ',', '.'),
                    'R$ '.number_format($conferencia->total_pedidos_manuais ?? 0, 2, ',', '.'),
                    'R$ '.number_format($conferencia->total_geral ?? 0, 2, ',', '.'),
                    $conferencia->data_conferencia?->format('d/m/Y') ?? '',
                    $conferencia->observacoes ?? '',
                    $conferencia->created_at->format('d/m/Y H:i'),
                    $conferencia->updated_at->format('d/m/Y H:i'),
                ], ';', '"', '\\');
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

        return redirect()->route('conferencias.index')
            ->with('success', 'Conferência excluída com sucesso!');
    }
}
