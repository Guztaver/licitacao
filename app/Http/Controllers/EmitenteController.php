<?php

namespace App\Http\Controllers;

use App\Models\Emitente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmitenteController extends Controller
{
    /**
     * Display a listing of the emitentes.
     */
    public function index(Request $request): Response
    {
        $query = Emitente::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                    ->orWhere('sigla', 'like', "%{$request->search}%");
            });
        }

        // Calculate statistics for the complete filtered dataset (before pagination)
        $statsQuery = clone $query;
        $allEmitentes = $statsQuery->withCount('requisicoes')->get();

        $stats = [
            'total_emitentes' => $allEmitentes->count(),
            'com_requisicoes' => $allEmitentes->filter(fn ($emitente) => $emitente->requisicoes_count > 0)->count(),
            'total_requisicoes' => $allEmitentes->sum('requisicoes_count'),
            'sem_atividade' => $allEmitentes->filter(fn ($emitente) => $emitente->requisicoes_count === 0)->count(),
        ];

        $emitentesPaginated = $query
            ->withCount('requisicoes')
            ->orderBy('nome')
            ->paginate(15)
            ->withQueryString();

        $emitentesPaginated->getCollection()->transform(fn ($emitente) => [
            'id' => $emitente->id,
            'nome' => $emitente->nome,
            'sigla' => $emitente->sigla,
            'endereco' => $emitente->endereco,
            'telefone' => $emitente->telefone,
            'email' => $emitente->email,
            'requisicoes_count' => $emitente->requisicoes_count,
            'created_at' => $emitente->created_at->format('d/m/Y'),
        ]
        );

        return Inertia::render('Emitentes/Index', [
            'emitentes' => $emitentesPaginated,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new emitente.
     */
    public function create(): Response
    {
        return Inertia::render('Emitentes/Create');
    }

    /**
     * Store a newly created emitente in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:20|unique:emitentes,sigla',
            'endereco' => 'nullable|string|max:500',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $emitente = new Emitente($validated);
        $emitente->save();

        return redirect()->route('emitentes.show', $emitente)
            ->with('success', 'Emitente criado com sucesso!');
    }

    /**
     * Display the specified emitente.
     */
    public function show(Emitente $emitente): Response
    {
        $emitente->load([
            'requisicoes' => function ($query) {
                $query->ativa()->orderBy('created_at', 'desc')->limit(10);
            },
            'requisicoes.destinatario',
            'requisicoes.fornecedor',
        ]);

        $emitenteData = [
            'id' => $emitente->id,
            'nome' => $emitente->nome,
            'sigla' => $emitente->sigla,
            'endereco' => $emitente->endereco,
            'telefone' => $emitente->telefone,
            'email' => $emitente->email,
            'created_at' => $emitente->created_at->format('d/m/Y H:i'),
            'updated_at' => $emitente->updated_at->format('d/m/Y H:i'),
        ];

        $requisicoes = $emitente->requisicoes->map(fn ($requisicao) => [
            'id' => $requisicao->id,
            'numero_completo' => $requisicao->numero_completo,
            'solicitante' => $requisicao->solicitante,
            'status' => $requisicao->status,
            'status_display' => $requisicao->status_display,
            'status_color' => $requisicao->status_color,
            'valor_final' => $requisicao->valor_final,
            'data_recebimento' => $requisicao->data_recebimento->format('d/m/Y'),
            'destinatario' => $requisicao->destinatario ? [
                'nome' => $requisicao->destinatario->nome,
                'sigla' => $requisicao->destinatario->sigla,
            ] : null,
            'fornecedor' => $requisicao->fornecedor ? [
                'razao_social' => $requisicao->fornecedor->razao_social,
            ] : null,
        ]
        );

        // Statistics
        $stats = [
            'total_requisicoes' => $emitente->requisicoes()->where('status', '!=', 'excluida')->count(),
            'requisicoes_concretizadas' => $emitente->requisicoes()->where('status', 'concretizada')->count(),
            'valor_total' => $emitente->requisicoes()->where('status', 'concretizada')->sum('valor_final') ?? 0,
            'requisicoes_mes_atual' => $emitente->requisicoes()
                ->where('status', '!=', 'excluida')
                ->whereMonth('data_recebimento', now()->month)
                ->whereYear('data_recebimento', now()->year)
                ->count(),
        ];

        return Inertia::render('Emitentes/Show', [
            'emitente' => $emitenteData,
            'requisicoes' => $requisicoes,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified emitente.
     */
    public function edit(Emitente $emitente): Response
    {
        return Inertia::render('Emitentes/Edit', [
            'emitente' => [
                'id' => $emitente->id,
                'nome' => $emitente->nome,
                'sigla' => $emitente->sigla,
                'endereco' => $emitente->endereco,
                'telefone' => $emitente->telefone,
                'email' => $emitente->email,
            ],
        ]);
    }

    /**
     * Update the specified emitente in storage.
     */
    public function update(Request $request, Emitente $emitente): RedirectResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'sigla' => 'required|string|max:20|unique:emitentes,sigla,'.$emitente->id,
            'endereco' => 'nullable|string|max:500',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $emitente->update($validated);

        return redirect()->route('emitentes.show', $emitente)
            ->with('success', 'Emitente atualizado com sucesso!');
    }

    /**
     * Remove the specified emitente from storage.
     */
    public function destroy(Emitente $emitente): RedirectResponse
    {
        // Check if emitente has requisições
        if ($emitente->requisicoes()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Não é possível excluir este emitente pois possui requisições associadas.');
        }

        $emitente->delete();

        return redirect()->route('emitentes.index')
            ->with('success', 'Emitente excluído com sucesso!');
    }

    /**
     * Export emitentes to CSV.
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $query = Emitente::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nome', 'like', "%{$request->search}%")
                    ->orWhere('sigla', 'like', "%{$request->search}%");
            });
        }

        $emitentes = $query->orderBy('nome')->get();

        $filename = 'emitentes_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($emitentes) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, [
                'Nome',
                'Sigla',
                'Endereço',
                'Telefone',
                'Email',
                'Data Criação',
                'Data Atualização',
            ], ';', '"', '\\');

            foreach ($emitentes as $emitente) {
                fputcsv($file, [
                    $emitente->nome,
                    $emitente->sigla ?? '',
                    $emitente->endereco ?? '',
                    $emitente->telefone ?? '',
                    $emitente->email ?? '',
                    $emitente->created_at->format('d/m/Y H:i'),
                    $emitente->updated_at->format('d/m/Y H:i'),
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
