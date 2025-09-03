<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use App\Models\Requisicao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index(Request $request): Response
    {
        $stats = $this->getDashboardStats();
        $recentRequisicoes = $this->getRecentRequisicoes();
        $fornecedoresAtivos = $this->getFornecedoresAtivos();
        $conferenciasRecentes = $this->getConferenciasRecentes();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_requisicoes' => $recentRequisicoes,
            'fornecedores_ativos' => $fornecedoresAtivos,
            'conferencias_recentes' => $conferenciasRecentes,
        ]);
    }

    /**
     * Get dashboard statistics.
     */
    private function getDashboardStats(): array
    {
        $totalFornecedores = Fornecedor::query()->count();
        $fornecedoresAtivos = Fornecedor::query()->where('status', true)->count();

        $totalRequisicoes = Requisicao::query()->where('status', '!=', 'excluida')->count();
        $requisicoesAutorizadas = Requisicao::query()->where('status', 'autorizada')->count();
        $requisicoesConcretizadas = Requisicao::query()->where('status', 'concretizada')->count();

        $valorTotalRequisicoes = Requisicao::query()->where('status', 'concretizada')
            ->sum('valor_final') ?? 0;

        $requisicoesNoMes = Requisicao::query()->where('status', '!=', 'excluida')
            ->whereMonth('data_recebimento', now()->month)
            ->whereYear('data_recebimento', now()->year)
            ->count();

        $conferenciasNoMes = Conferencia::query()->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            'total_fornecedores' => $totalFornecedores,
            'fornecedores_ativos' => $fornecedoresAtivos,
            'total_requisicoes' => $totalRequisicoes,
            'requisicoes_pendentes' => $requisicoesAutorizadas,
            'requisicoes_concretizadas' => $requisicoesConcretizadas,
            'valor_total_requisicoes' => $valorTotalRequisicoes,
            'requisicoes_mes_atual' => $requisicoesNoMes,
            'conferencias_mes_atual' => $conferenciasNoMes,
        ];
    }

    /**
     * Get recent requisições.
     */
    private function getRecentRequisicoes(): array
    {
        return Requisicao::query()->where('status', '!=', 'excluida')
            ->with(['emitente', 'destinatario', 'fornecedor'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($requisicao) {
                return [
                    'id' => $requisicao->id,
                    'numero_completo' => $requisicao->numero_completo,
                    'solicitante' => $requisicao->solicitante,
                    'status' => $requisicao->status,
                    'status_display' => $requisicao->status_display,
                    'status_color' => $requisicao->status_color,
                    'data_recebimento' => $requisicao->data_recebimento ? $requisicao->data_recebimento->format('d/m/Y') : null,
                    'emitente' => $requisicao->emitente ? [
                        'nome' => $requisicao->emitente->nome,
                        'sigla' => $requisicao->emitente->sigla,
                    ] : null,
                    'fornecedor' => $requisicao->fornecedor ? [
                        'razao_social' => $requisicao->fornecedor->razao_social,
                    ] : null,
                ];
            })
            ->toArray();
    }

    /**
     * Get active fornecedores with recent activity.
     */
    private function getFornecedoresAtivos(): array
    {
        return Fornecedor::query()->where('status', true)
            ->withCount([
                'requisicoes as total_requisicoes',
                'requisicoes as requisicoes_mes_atual' => function ($query) {
                    $query->whereMonth('data_recebimento', now()->month)
                          ->whereYear('data_recebimento', now()->year);
                }
            ])
            ->orderBy('requisicoes_mes_atual', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($fornecedor) {
                return [
                    'id' => $fornecedor->id,
                    'razao_social' => $fornecedor->razao_social,
                    'cnpj_formatado' => $fornecedor->cnpj_formatado,
                    'email' => $fornecedor->email,
                    'telefone_formatado' => $fornecedor->telefone_formatado,
                    'total_requisicoes' => $fornecedor->total_requisicoes,
                    'requisicoes_mes_atual' => $fornecedor->requisicoes_mes_atual,
                    'total_geral' => $fornecedor->getTotalGeral(),
                ];
            })
            ->toArray();
    }

    /**
     * Get recent conferências.
     */
    /**
     * @return array<int,mixed>
     */
    private function getConferenciasRecentes(): array
    {
        return Conferencia::with('fornecedor')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($conferencia) {
                return [
                    'id' => $conferencia->id,
                    'periodo' => $conferencia->periodo,
                    'total_geral' => $conferencia->total_geral,
                    'data_conferencia' => $conferencia->data_conferencia,
                    'fornecedor' => $conferencia->fornecedor ? [
                        'razao_social' => $conferencia->fornecedor->razao_social,
                    ] : null,
                ];
            })
            ->toArray();
    }
}
