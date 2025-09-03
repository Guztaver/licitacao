<?php

namespace App\Http\Controllers;

use App\Models\Fornecedor;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FornecedorController extends Controller
{
    /**
     * Display a listing of the fornecedores.
     */
    public function index(Request $request): Response
    {
        $query = Fornecedor::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('razao_social', 'like', "%{$request->search}%")
                  ->orWhere('cnpj', 'like', "%{$request->search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'ativo') {
                $query->where('status', true);
            } elseif ($request->status === 'inativo') {
                $query->where('status', false);
            }
        }

        $fornecedoresPaginated = $query
            ->withCount(['requisicoes', 'pedidosManuais', 'conferencias'])
            ->orderBy('razao_social')
            ->paginate(15)
            ->withQueryString();

        $fornecedoresPaginated->getCollection()->transform(function ($fornecedor) {
            return [
                'id' => $fornecedor->id,
                'razao_social' => $fornecedor->razao_social,
                'cnpj' => $fornecedor->cnpj,
                'cnpj_formatado' => $fornecedor->cnpj_formatado,
                'telefone' => $fornecedor->telefone,
                'telefone_formatado' => $fornecedor->telefone_formatado,
                'email' => $fornecedor->email,
                'endereco_completo' => $fornecedor->endereco_completo,
                'status' => $fornecedor->status,
                'status_display' => $fornecedor->status_display,
                'status_color' => $fornecedor->status_color,
                'observacoes' => $fornecedor->observacoes,
                'requisicoes_count' => $fornecedor->requisicoes_count,
                'pedidos_manuais_count' => $fornecedor->pedidos_manuais_count,
                'conferencias_count' => $fornecedor->conferencias_count,
                'total_geral' => $fornecedor->getTotalGeral(),
                'pode_excluir' => $fornecedor->podeExcluir(),
                'created_at' => $fornecedor->created_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Fornecedores/Index', [
            'fornecedores' => $fornecedoresPaginated,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new fornecedor.
     */
    public function create(): Response
    {
        return Inertia::render('Fornecedores/Create');
    }

    /**
     * Store a newly created fornecedor in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'razao_social' => 'required|string|max:255',
            'cnpj' => 'required|string|unique:fornecedores,cnpj',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'endereco' => 'nullable|string|max:500',
            'cidade' => 'nullable|string|max:100',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:10',
            'contato' => 'nullable|string|max:255',
            'status' => 'boolean',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        $fornecedor = new Fornecedor($validated);
        $fornecedor->save();

        return redirect()->route('fornecedores.index')
            ->with('success', 'Fornecedor criado com sucesso!');
    }

    /**
     * Display the specified fornecedor.
     */
    public function show(Fornecedor $fornecedor): Response
    {
        $fornecedor->load([
            'requisicoes' => function ($query) {
                $query->ativa()->orderBy('created_at', 'desc')->limit(10);
            },
            'requisicoes.emitente',
            'pedidosManuais' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            },
            'conferencias' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }
        ]);

        $fornecedorData = [
            'id' => $fornecedor->id,
            'razao_social' => $fornecedor->razao_social,
            'cnpj' => $fornecedor->cnpj,
            'cnpj_formatado' => $fornecedor->cnpj_formatado,
            'telefone' => $fornecedor->telefone,
            'telefone_formatado' => $fornecedor->telefone_formatado,
            'email' => $fornecedor->email,
            'endereco' => $fornecedor->endereco,
            'cidade' => $fornecedor->cidade,
            'estado' => $fornecedor->estado,
            'cep' => $fornecedor->cep,
            'endereco_completo' => $fornecedor->endereco_completo,
            'contato' => $fornecedor->contato,
            'status' => $fornecedor->status,
            'status_display' => $fornecedor->status_display,
            'status_color' => $fornecedor->status_color,
            'observacoes' => $fornecedor->observacoes,
            'total_requisicoes' => $fornecedor->getTotalRequisicoes(),
            'total_pedidos_manuais' => $fornecedor->getTotalPedidosManuais(),
            'total_geral' => $fornecedor->getTotalGeral(),
            'pode_excluir' => $fornecedor->podeExcluir(),
            'created_at' => $fornecedor->created_at->format('d/m/Y H:i'),
            'updated_at' => $fornecedor->updated_at->format('d/m/Y H:i'),
        ];

        $requisicoes = $fornecedor->requisicoes->map(function ($requisicao) {
            return [
                'id' => $requisicao->id,
                'numero_completo' => $requisicao->numero_completo,
                'solicitante' => $requisicao->solicitante,
                'status' => $requisicao->status,
                'status_display' => $requisicao->status_display,
                'status_color' => $requisicao->status_color,
                'valor_final' => $requisicao->valor_final,
                'data_recebimento' => $requisicao->data_recebimento->format('d/m/Y'),
                'emitente' => $requisicao->emitente ? [
                    'nome' => $requisicao->emitente->nome,
                    'sigla' => $requisicao->emitente->sigla,
                ] : null,
            ];
        });

        $pedidosManuais = $fornecedor->pedidosManuais->map(function ($pedido) {
            return [
                'id' => $pedido->id,
                'descricao' => $pedido->descricao,
                'valor' => $pedido->valor,
                'numero_pedido' => $pedido->numero_pedido,
                'data_pedido' => $pedido->data_pedido,
                'observacoes' => $pedido->observacoes,
            ];
        });

        $conferencias = $fornecedor->conferencias->map(function ($conferencia) {
            return [
                'id' => $conferencia->id,
                'periodo' => $conferencia->periodo,
                'total_geral' => $conferencia->total_geral,
                'data_conferencia' => $conferencia->data_conferencia,
                'observacoes' => $conferencia->observacoes,
            ];
        });

        return Inertia::render('Fornecedores/Show', [
            'fornecedor' => $fornecedorData,
            'requisicoes' => $requisicoes,
            'pedidos_manuais' => $pedidosManuais,
            'conferencias' => $conferencias,
        ]);
    }

    /**
     * Show the form for editing the specified fornecedor.
     */
    public function edit(Fornecedor $fornecedor): Response
    {
        return Inertia::render('Fornecedores/Edit', [
            'fornecedor' => [
                'id' => $fornecedor->id,
                'razao_social' => $fornecedor->razao_social,
                'cnpj' => $fornecedor->cnpj,
                'telefone' => $fornecedor->telefone,
                'email' => $fornecedor->email,
                'endereco' => $fornecedor->endereco,
                'cidade' => $fornecedor->cidade,
                'estado' => $fornecedor->estado,
                'cep' => $fornecedor->cep,
                'contato' => $fornecedor->contato,
                'status' => $fornecedor->status,
                'observacoes' => $fornecedor->observacoes,
            ],
        ]);
    }

    /**
     * Update the specified fornecedor in storage.
     */
    public function update(Request $request, Fornecedor $fornecedor): RedirectResponse
    {
        $validated = $request->validate([
            'razao_social' => 'required|string|max:255',
            'cnpj' => 'required|string|unique:fornecedores,cnpj,' . $fornecedor->id,
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'endereco' => 'nullable|string|max:500',
            'cidade' => 'nullable|string|max:100',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:10',
            'contato' => 'nullable|string|max:255',
            'status' => 'boolean',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        $fornecedor->update($validated);

        return redirect()->route('fornecedores.show', $fornecedor)
            ->with('success', 'Fornecedor atualizado com sucesso!');
    }

    /**
     * Remove the specified fornecedor from storage.
     */
    public function destroy(Fornecedor $fornecedor): RedirectResponse
    {
        if (!$fornecedor->podeExcluir()) {
            return redirect()->back()
                ->with('error', 'Não é possível excluir este fornecedor pois possui requisições, pedidos manuais ou conferências associadas.');
        }

        $fornecedor->delete();

        return redirect()->route('fornecedores.index')
            ->with('success', 'Fornecedor excluído com sucesso!');
    }

    /**
     * Export fornecedores to CSV.
     */
    public function export(Request $request)
    {
        $query = Fornecedor::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('razao_social', 'like', "%{$request->search}%")
                  ->orWhere('cnpj', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'ativo') {
                $query->where('status', true);
            } elseif ($request->status === 'inativo') {
                $query->where('status', false);
            }
        }

        $fornecedores = $query->orderBy('razao_social')->get();

        $filename = 'fornecedores_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function() use ($fornecedores) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, [
                'Razão Social',
                'CNPJ',
                'Email',
                'Telefone',
                'Endereço',
                'Status',
                'Data Criação',
                'Data Atualização'
            ], ';', '"', '\\');

            foreach ($fornecedores as $fornecedor) {
                fputcsv($file, [
                    $fornecedor->razao_social,
                    $fornecedor->cnpj,
                    $fornecedor->email ?? '',
                    $fornecedor->telefone ?? '',
                    $fornecedor->endereco ?? '',
                    $fornecedor->status ? 'Ativo' : 'Inativo',
                    $fornecedor->created_at->format('d/m/Y H:i'),
                    $fornecedor->updated_at->format('d/m/Y H:i')
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Search fornecedores for AJAX requests.
     */
    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $fornecedores = Fornecedor::query()
            ->where(function ($q) use ($request) {
                $q->where('razao_social', 'like', "%{$request->q}%")
                  ->orWhere('cnpj', 'like', "%{$request->q}%");
            })
            ->where('status', true)
            ->orderBy('razao_social')
            ->limit(10)
            ->get(['id', 'razao_social', 'cnpj']);

        return response()->json($fornecedores->map(function ($fornecedor) {
            return [
                'id' => $fornecedor->id,
                'label' => $fornecedor->razao_social,
                'cnpj' => $fornecedor->cnpj_formatado,
            ];
        }));
    }
}
