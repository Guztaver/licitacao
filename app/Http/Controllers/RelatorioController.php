<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use App\Models\Requisicao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RelatorioController extends Controller
{
    /**
     * Display the main reports page.
     */
    public function index(): Response
    {
        // Get statistics for quick stats card
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $requisicoesEsteMes = Requisicao::where('status', '!=', 'excluida')
            ->whereMonth('data_recebimento', $currentMonth)
            ->whereYear('data_recebimento', $currentYear)
            ->get();

        $stats = [
            'requisicoes_este_mes' => $requisicoesEsteMes->count(),
            'aprovadas' => $requisicoesEsteMes->where('status', 'autorizada')->count(),
            'pendentes' => $requisicoesEsteMes->where('status', 'pendente')->count(),
            'rejeitadas' => $requisicoesEsteMes->where('status', 'cancelada')->count(),
            'concretizadas' => $requisicoesEsteMes->where('status', 'concretizada')->count(),
            'valor_total_mes' => $requisicoesEsteMes->where('status', 'concretizada')->sum('valor_final') ?? 0,
        ];

        // Get emitentes and fornecedores for dropdowns
        $emitentes = \App\Models\Emitente::orderBy('nome')->get(['id', 'nome', 'sigla']);
        $fornecedores = \App\Models\Fornecedor::where('status', true)->orderBy('razao_social')->get(['id', 'razao_social', 'cnpj']);

        return Inertia::render('Relatorios/Index', [
            'stats' => $stats,
            'emitentes' => $emitentes,
            'fornecedores' => $fornecedores,
        ]);
    }

    /**
     * Generate requisições report.
     */
     public function requisicoes(Request $request): Response
         {
             $request->validate([
                 'data_inicio' => 'nullable|date',
                 'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                 'status' => 'nullable|string|in:autorizada,concretizada,cancelada',
                 'emitente_id' => 'nullable|exists:emitentes,id',
                 'fornecedor_id' => 'nullable|exists:fornecedores,id',
             ]);

             $query = Requisicao::query()->where('status', '!=', 'excluida')
                 ->with(['emitente', 'destinatario', 'fornecedor', 'usuarioCriacao']);

             // Apply filters
             if ($request->filled('data_inicio')) {
                 $query->whereDate('data_recebimento', '>=', $request->data_inicio);
             }

             if ($request->filled('data_fim')) {
                 $query->whereDate('data_recebimento', '<=', $request->data_fim);
             }

             if ($request->filled('status')) {
                 $query->where('status', $request->status);
             }

             if ($request->filled('emitente_id')) {
                 $query->where('emitente_id', $request->emitente_id);
             }

             if ($request->filled('fornecedor_id')) {
                 $query->where('fornecedor_id', $request->fornecedor_id);
             }

             $requisicoes = $query->orderBy('data_recebimento', 'desc')->get();

             // Calculate statistics
             $stats = [
                 'total_requisicoes' => $requisicoes->count(),
                 'valor_total' => $requisicoes->where('status', 'concretizada')->sum('valor_final'),
                 'requisicoes_por_status' => $requisicoes->groupBy('status')->map(fn ($group) => $group->count()),
                 'valor_por_emitente' => $requisicoes
                     ->where('status', 'concretizada')
                     ->groupBy('emitente.nome')
                     ->map(fn ($group) =>
                         $group->sum('valor_final')
                     ),
                 'valor_por_fornecedor' => $requisicoes
                     ->where('status', 'concretizada')
                     ->whereNotNull('fornecedor')
                     ->groupBy('fornecedor.razao_social')
                     ->map(fn ($group) =>
                         $group->sum('valor_final')
                     ),
             ];

             $requisicoesList = $requisicoes->map(fn ($requisicao) =>
                 [
                     'id' => $requisicao->id,
                     'numero_completo' => $requisicao->numero_completo,
                     'solicitante' => $requisicao->solicitante,
                     'data_recebimento' => $requisicao->data_recebimento ? $requisicao->data_recebimento->format('d/m/Y') : '',
                     'status' => $requisicao->status,
                     'status_display' => $requisicao->status_display,
                     'valor_final' => $requisicao->valor_final,
                     'emitente' => $requisicao->emitente ? [
                         'nome' => $requisicao->emitente->nome,
                         'sigla' => $requisicao->emitente->sigla,
                     ] : null,
                     'destinatario' => $requisicao->destinatario ? [
                         'nome' => $requisicao->destinatario->nome,
                     ] : null,
                     'fornecedor' => $requisicao->fornecedor ? [
                         'razao_social' => $requisicao->fornecedor->razao_social,
                     ] : null,
                 ]
             );

             // Get emitentes and fornecedores for dropdowns
             $emitentes = \App\Models\Emitente::orderBy('nome')->get(['id', 'nome', 'sigla']);
             $fornecedores = \App\Models\Fornecedor::where('status', true)->orderBy('razao_social')->get(['id', 'razao_social']);

             return Inertia::render('Relatorios/Requisicoes', [
                 'requisicoes' => $requisicoesList,
                 'stats' => $stats,
                 'filters' => $request->only(['data_inicio', 'data_fim', 'status', 'emitente_id', 'fornecedor_id']),
                 'emitentes' => $emitentes,
                 'fornecedores' => $fornecedores,
             ]);
         }

    /**
     * Generate fornecedores report.
     */
     public function fornecedores(Request $request): Response
         {
             $request->validate([
                 'data_inicio' => 'nullable|date',
                 'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                 'status' => 'nullable|boolean',
             ]);

             $query = Fornecedor::query();

             // Apply status filter
             if ($request->filled('status')) {
                 if ($request->status === '1') {
                     $query->where('status', true);
                 } elseif ($request->status === '0') {
                     $query->where('status', false);
                 }
             }

             $fornecedores = $query->get();

             // For each fornecedor, calculate statistics within the date range
             $fornecedoresList = $fornecedores->map(function ($fornecedor) use ($request) {
                 $requisicoesQuery = $fornecedor->requisicoes()->where('status', 'concretizada');

                 if ($request->filled('data_inicio')) {
                     $requisicoesQuery->whereDate('data_recebimento', '>=', $request->data_inicio);
                 }

                 if ($request->filled('data_fim')) {
                     $requisicoesQuery->whereDate('data_recebimento', '<=', $request->data_fim);
                 }

                 $requisicoes = $requisicoesQuery->get();
                 $valorTotal = $requisicoes->sum('valor_final');

                 return [
                     'id' => $fornecedor->id,
                     'razao_social' => $fornecedor->razao_social,
                     'cnpj_formatado' => $fornecedor->cnpj_formatado,
                     'telefone_formatado' => $fornecedor->telefone_formatado,
                     'email' => $fornecedor->email,
                     'status' => $fornecedor->status,
                     'status_display' => $fornecedor->status_display,
                     'total_requisicoes' => $requisicoes->count(),
                     'valor_total' => $valorTotal,
                     'created_at' => $fornecedor->created_at->format('d/m/Y'),
                 ];
             })->sortByDesc('valor_total')->values();

             // Calculate overall statistics
             $stats = [
                 'total_fornecedores' => $fornecedores->count(),
                 'fornecedores_ativos' => $fornecedores->where('status', true)->count(),
                 'fornecedores_inativos' => $fornecedores->where('status', false)->count(),
                 'valor_total_geral' => $fornecedoresList->sum('valor_total'),
                 'total_requisicoes' => $fornecedoresList->sum('total_requisicoes'),
                 'fornecedores_com_movimento' => $fornecedoresList->where('total_requisicoes', '>', 0)->count(),
             ];

             return Inertia::render('Relatorios/Fornecedores', [
                 'fornecedores' => $fornecedoresList,
                 'stats' => $stats,
                 'filters' => $request->only(['data_inicio', 'data_fim', 'status']),
             ]);
         }

    /**
     * Generate conferências report.
     */
     public function conferencias(Request $request): Response
         {
             $request->validate([
                 'data_inicio' => 'nullable|date',
                 'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                 'fornecedor_id' => 'nullable|exists:fornecedores,id',
             ]);

             $query = Conferencia::with('fornecedor');

             // Apply filters
             if ($request->filled('data_inicio')) {
                 $query->whereDate('data_conferencia', '>=', $request->data_inicio);
             }

             if ($request->filled('data_fim')) {
                 $query->whereDate('data_conferencia', '<=', $request->data_fim);
             }

             if ($request->filled('fornecedor_id')) {
                 $query->where('fornecedor_id', $request->fornecedor_id);
             }

             $conferencias = $query->orderBy('data_conferencia', 'desc')->get();

             // Calculate statistics
             $stats = [
                 'total_conferencias' => $conferencias->count(),
                 'valor_total_geral' => $conferencias->sum('total_geral'),
                 'valor_total_requisicoes' => $conferencias->sum('total_requisicoes'),
                 'valor_total_pedidos_manuais' => $conferencias->sum('total_pedidos_manuais'),
                 'conferencias_por_fornecedor' => $conferencias->groupBy('fornecedor.razao_social')->map(fn ($group) => [
                     'count' => $group->count(),
                     'valor_total' => $group->sum('total_geral'),
                 ]),
                 'conferencias_por_mes' => $conferencias->groupBy(fn ($conferencia) =>
                     \Carbon\Carbon::parse($conferencia->data_conferencia)->format('Y-m')
                 )->map(fn ($group) => [
                     'count' => $group->count(),
                     'valor_total' => $group->sum('total_geral'),
                 ]),
             ];

             $conferenciasList = $conferencias->map(fn ($conferencia) => [
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
             ]);

             // Get fornecedores for dropdown
             $fornecedores = \App\Models\Fornecedor::where('status', true)->orderBy('razao_social')->get(['id', 'razao_social']);

             return Inertia::render('Relatorios/Conferencias', [
                 'conferencias' => $conferenciasList,
                 'stats' => $stats,
                 'filters' => $request->only(['data_inicio', 'data_fim', 'fornecedor_id']),
                 'fornecedores' => $fornecedores,
             ]);
         }

    /**
     * Export requisições report.
     */
    public function exportRequisicoes(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|string|in:autorizada,concretizada,cancelada',
            'emitente_id' => 'nullable|exists:emitentes,id',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'formato' => 'nullable|string|in:csv,excel,pdf',
        ]);

        $query = Requisicao::query()->where('status', '!=', 'excluida')
            ->with(['emitente', 'destinatario', 'fornecedor', 'usuarioCriacao']);

        // Apply filters
        if ($request->filled('data_inicio')) {
            $query->whereDate('data_recebimento', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('data_recebimento', '<=', $request->data_fim);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('emitente_id')) {
            $query->where('emitente_id', $request->emitente_id);
        }

        if ($request->filled('fornecedor_id')) {
            $query->where('fornecedor_id', $request->fornecedor_id);
        }

        $requisicoes = $query->orderBy('data_recebimento', 'desc')->get();

        $filename = 'relatorio-requisicoes_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($requisicoes) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv($file, [
                'Número',
                'Solicitante',
                'Data Recebimento',
                'Status',
                'Valor Final',
                'Emitente',
                'Destinatário',
                'Fornecedor',
                'Usuário Criação',
                'Data Criação'
            ], ';', '"', '\\');

            foreach ($requisicoes as $requisicao) {
                fputcsv($file, [
                    $requisicao->numero_completo,
                    $requisicao->solicitante,
                    $requisicao->data_recebimento ? $requisicao->data_recebimento->format('d/m/Y') : '',
                    $requisicao->status_display,
                    $requisicao->valor_final ? 'R$ ' . number_format((float)$requisicao->valor_final, 2, ',', '.') : '',
                    $requisicao->emitente?->nome ?? '',
                    $requisicao->destinatario?->nome ?? '',
                    $requisicao->fornecedor?->razao_social ?? '',
                    $requisicao->usuarioCriacao?->name ?? '',
                    $requisicao->created_at->format('d/m/Y H:i'),
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export fornecedores report.
     */
    public function exportFornecedores(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|boolean',
            'formato' => 'nullable|string|in:csv,excel,pdf',
        ]);

        $query = Fornecedor::query();

        // Apply status filter
        if ($request->filled('status')) {
            if ($request->status === '1') {
                $query->where('status', true);
            } elseif ($request->status === '0') {
                $query->where('status', false);
            }
        }

        $fornecedores = $query->get();

        // For each fornecedor, calculate statistics within the date range
        $fornecedoresList = $fornecedores->map(function ($fornecedor) use ($request) {
            $requisicoesQuery = $fornecedor->requisicoes()->where('status', 'concretizada');

            if ($request->filled('data_inicio')) {
                $requisicoesQuery->whereDate('data_recebimento', '>=', $request->data_inicio);
            }

            if ($request->filled('data_fim')) {
                $requisicoesQuery->whereDate('data_recebimento', '<=', $request->data_fim);
            }

            $requisicoes = $requisicoesQuery->get();
            $valorTotal = $requisicoes->sum('valor_final');

            return [
                'razao_social' => $fornecedor->razao_social,
                'cnpj_formatado' => $fornecedor->cnpj_formatado,
                'telefone_formatado' => $fornecedor->telefone_formatado,
                'email' => $fornecedor->email,
                'status_display' => $fornecedor->status_display,
                'total_requisicoes' => $requisicoes->count(),
                'valor_total' => $valorTotal,
                'created_at' => $fornecedor->created_at->format('d/m/Y'),
            ];
        });

        $filename = 'relatorio-fornecedores_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($fornecedoresList) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv($file, [
                'Razão Social',
                'CNPJ',
                'Telefone',
                'Email',
                'Status',
                'Total Requisições',
                'Valor Total',
                'Data Cadastro'
            ], ';', '"', '\\');

            foreach ($fornecedoresList as $fornecedor) {
                fputcsv($file, [
                    $fornecedor['razao_social'],
                    $fornecedor['cnpj_formatado'],
                    $fornecedor['telefone_formatado'],
                    $fornecedor['email'],
                    $fornecedor['status_display'],
                    $fornecedor['total_requisicoes'],
                    'R$ ' . number_format($fornecedor['valor_total'], 2, ',', '.'),
                    $fornecedor['created_at'],
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export conferências report.
     */
    public function exportConferencias(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'formato' => 'nullable|string|in:csv,excel,pdf',
        ]);

        $query = Conferencia::with('fornecedor');

        // Apply filters
        if ($request->filled('data_inicio')) {
            $query->whereDate('data_conferencia', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('data_conferencia', '<=', $request->data_fim);
        }

        if ($request->filled('fornecedor_id')) {
            $query->where('fornecedor_id', $request->fornecedor_id);
        }

        $conferencias = $query->orderBy('data_conferencia', 'desc')->get();

        $filename = 'relatorio-conferencias_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($conferencias) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv($file, [
                'Período',
                'Fornecedor',
                'CNPJ',
                'Total Requisições',
                'Total Pedidos Manuais',
                'Total Geral',
                'Data Conferência',
                'Observações',
                'Data Criação'
            ], ';', '"', '\\');

            foreach ($conferencias as $conferencia) {
                fputcsv($file, [
                    $conferencia->periodo,
                    $conferencia->fornecedor?->razao_social ?? '',
                    $conferencia->fornecedor?->cnpj_formatado ?? '',
                    'R$ ' . number_format((float)$conferencia->total_requisicoes, 2, ',', '.'),
                    'R$ ' . number_format((float)$conferencia->total_pedidos_manuais, 2, ',', '.'),
                    'R$ ' . number_format((float)$conferencia->total_geral, 2, ',', '.'),
                    $conferencia->data_conferencia->format('d/m/Y'),
                    $conferencia->observacoes ?? '',
                    $conferencia->created_at->format('d/m/Y H:i'),
                ], ';', '"', '\\');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
