<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
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

        $conferenciasPaginated = $query
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $conferenciasPaginated->getCollection()->transform(function ($conferencia) {
            return [
                'id' => $conferencia->id,
                'periodo' => $conferencia->periodo,
                'total_requisicoes' => $conferencia->total_requisicoes,
                'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
                'total_geral' => $conferencia->total_geral,
                'data_conferencia' => $conferencia->data_conferencia,
                'observacoes' => $conferencia->observacoes,
                'fornecedor' => $conferencia->fornecedor ? [
                    'id' => $conferencia->fornecedor->id,
                    'razao_social' => $conferencia->fornecedor->razao_social,
                    'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                ] : null,
                'created_at' => $conferencia->created_at->format('d/m/Y H:i'),
            ];
        });

        $fornecedores = Fornecedor::query()->where('status', true)->orderBy('razao_social')->get(['id', 'razao_social']);

        return Inertia::render('Conferencias/Index', [
            'conferencias' => $conferenciasPaginated,
            'fornecedores' => $fornecedores,
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
            'periodo' => 'required|string|max:100',
            'data_conferencia' => 'required|date',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        $fornecedor = Fornecedor::query()->findOrFail($request->fornecedor_id);

        // Calculate totals
        $validated['total_requisicoes'] = $fornecedor->getTotalRequisicoes();
        $validated['total_pedidos_manuais'] = $fornecedor->getTotalPedidosManuais();
        $validated['total_geral'] = $fornecedor->getTotalGeral();

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
            'periodo' => $conferencia->periodo,
            'total_requisicoes' => $conferencia->total_requisicoes,
            'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
            'total_geral' => $conferencia->total_geral,
            'data_conferencia' => $conferencia->data_conferencia,
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
            ->map(function ($req) {
                return [
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
                ];
            });

        // Get pedidos manuais for the period
        $pedidosManuais = $fornecedor->pedidosManuais()
            ->whereYear('data_pedido', $ano)
            ->whereMonth('data_pedido', $mes)
            ->orderBy('data_pedido')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'descricao' => $pedido->descricao,
                    'valor' => $pedido->valor,
                    'numero_pedido' => $pedido->numero_pedido,
                    'data_pedido' => $pedido->data_pedido,
                ];
            });

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

        $filename = 'conferencias_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function() use ($conferencias) {
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
                'Data Atualização'
            ]);

            foreach ($conferencias as $conferencia) {
                fputcsv($file, [
                    $conferencia->id,
                    $conferencia->periodo,
                    $conferencia->fornecedor?->razao_social ?? '',
                    number_format($conferencia->total_requisicoes, 2, ',', '.'),
                    number_format($conferencia->total_pedidos_manuais, 2, ',', '.'),
                    number_format($conferencia->total_geral, 2, ',', '.'),
                    $conferencia->data_conferencia?->format('d/m/Y') ?? '',
                    $conferencia->observacoes ?? '',
                    $conferencia->created_at->format('d/m/Y H:i'),
                    $conferencia->updated_at->format('d/m/Y H:i')
                ]);
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
