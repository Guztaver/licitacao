<?php

namespace App\Http\Controllers;

use App\Models\Destinatario;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DestinatarioController extends Controller
{
    /**
     * Display a listing of the destinatários.
     */
    public function index(Request $request): Response
    {
        $query = Destinatario::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('sigla', 'like', "%{$request->search}%");
            });
        }

        $destinatariosPaginated = $query
            ->withCount('requisicoes')
            ->orderBy('nome')
            ->paginate(15)
            ->withQueryString();

        $destinatariosPaginated->getCollection()->transform(function ($destinatario) {
            return [
                'id' => $destinatario->id,
                'nome' => $destinatario->nome,
                'sigla' => $destinatario->sigla,
                'endereco' => $destinatario->endereco,
                'telefone' => $destinatario->telefone,
                'email' => $destinatario->email,
                'requisicoes_count' => $destinatario->requisicoes_count,
                'created_at' => $destinatario->created_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Destinatarios/Index', [
            'destinatarios' => $destinatariosPaginated,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new destinatário.
     */
    public function create(): Response
    {
        return Inertia::render('Destinatarios/Create');
    }

    /**
     * Store a newly created destinatário in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:20|unique:destinatarios,sigla',
            'endereco' => 'nullable|string|max:500',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $destinatario = new Destinatario($validated);
        $destinatario->save();

        return redirect()->route('destinatarios.show', $destinatario)
            ->with('success', 'Destinatário criado com sucesso!');
    }

    /**
     * Display the specified destinatário.
     */
    public function show(Destinatario $destinatario): Response
    {
        $destinatario->load([
            'requisicoes' => function ($query) {
                $query->where('status', '!=', 'excluida')->orderBy('created_at', 'desc')->limit(10);
            },
            'requisicoes.emitente',
            'requisicoes.fornecedor'
        ]);

        $destinatarioData = [
            'id' => $destinatario->id,
            'nome' => $destinatario->nome,
            'sigla' => $destinatario->sigla,
            'endereco' => $destinatario->endereco,
            'telefone' => $destinatario->telefone,
            'email' => $destinatario->email,
            'created_at' => $destinatario->created_at->format('d/m/Y H:i'),
            'updated_at' => $destinatario->updated_at->format('d/m/Y H:i'),
        ];

        $requisicoes = $destinatario->requisicoes->map(function ($requisicao) {
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
                'fornecedor' => $requisicao->fornecedor ? [
                    'razao_social' => $requisicao->fornecedor->razao_social,
                ] : null,
            ];
        });

        // Statistics
        $stats = [
            'total_requisicoes' => $destinatario->requisicoes()->where('status', '!=', 'excluida')->count(),
            'requisicoes_concretizadas' => $destinatario->requisicoes()->where('status', 'concretizada')->count(),
            'valor_total' => $destinatario->requisicoes()->where('status', 'concretizada')->sum('valor_final') ?? 0,
            'requisicoes_mes_atual' => $destinatario->requisicoes()
                ->where('status', '!=', 'excluida')
                ->whereMonth('data_recebimento', now()->month)
                ->whereYear('data_recebimento', now()->year)
                ->count(),
        ];

        return Inertia::render('Destinatarios/Show', [
            'destinatario' => $destinatarioData,
            'requisicoes' => $requisicoes,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified destinatário.
     */
    public function edit(Destinatario $destinatario): Response
    {
        return Inertia::render('Destinatarios/Edit', [
            'destinatario' => [
                'id' => $destinatario->id,
                'nome' => $destinatario->nome,
                'sigla' => $destinatario->sigla,
                'endereco' => $destinatario->endereco,
                'telefone' => $destinatario->telefone,
                'email' => $destinatario->email,
            ],
        ]);
    }

    /**
     * Update the specified destinatário in storage.
     */
    public function update(Request $request, Destinatario $destinatario): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:20|unique:destinatarios,sigla,' . $destinatario->id,
            'endereco' => 'nullable|string|max:500',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $destinatario->update($validated);

        return redirect()->route('destinatarios.show', $destinatario)
            ->with('success', 'Destinatário atualizado com sucesso!');
    }

    /**
     * Remove the specified destinatário from storage.
     */
    public function destroy(Destinatario $destinatario): RedirectResponse
    {
        // Check if destinatário has requisições
        if ($destinatario->requisicoes()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Não é possível excluir este destinatário pois possui requisições associadas.');
        }

        $destinatario->delete();

        return redirect()->route('destinatarios.index')
            ->with('success', 'Destinatário excluído com sucesso!');
    }

    /**
     * Export destinatários to CSV.
     */
    public function export(Request $request)
    {
        $query = Destinatario::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                  ->orWhere('sigla', 'like', "%{$request->search}%");
            });
        }

        $destinatarios = $query->orderBy('nome')->get();

        $filename = 'destinatarios_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function() use ($destinatarios) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, [
                'Nome',
                'Sigla',
                'Data Criação',
                'Data Atualização'
            ], ';', '"', '\\');

            foreach ($destinatarios as $destinatario) {
                fputcsv($file, [
                    $destinatario->nome,
                    $destinatario->sigla ?? '',
                    $destinatario->created_at->format('d/m/Y H:i'),
                    $destinatario->updated_at->format('d/m/Y H:i')
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
