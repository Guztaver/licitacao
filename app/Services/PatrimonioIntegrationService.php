<?php

namespace App\Services;

use App\Models\IntegracaoPatrimonio;
use App\Models\Requisicao;
use App\Models\RequisicaoItem;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PatrimonioIntegrationService
{
    /**
     * Create patrimonio integration for a requisition item.
     */
    public function criarIntegracaoParaRequisicao(Requisicao $requisicao, RequisicaoItem $item, User $usuario): IntegracaoPatrimonio
    {
        // Check if integration already exists
        $existente = IntegracaoPatrimonio::where('requisicao_id', $requisicao->id)
            ->where('item_id', $item->item_id)
            ->first();

        if ($existente) {
            return $existente;
        }

        // Prepare integration data
        $dadosIntegracao = [
            'requisicao_id' => $requisicao->id,
            'item_id' => $item->item_id,
            'nome_bem' => $item->item->descricao,
            'valor_aquisicao' => $item->valor_unitario * $item->quantidade,
            'data_aquisicao' => $requisicao->data_recebimento,
            'localizacao' => $requisicao->local_entrega ?? 'Almoxarifado',
            'responsavel' => $requisicao->responsavel_recebimento ?? $usuario->name,
            'setor' => $requisicao->secretaria->nome ?? 'Administração',
            'marca' => $item->marca,
            'modelo' => $item->modelo ?? null,
            'caracteristicas' => $item->especificacoes ?? $item->item->descricao,
            'usuario_solicitacao_id' => $usuario->id,
            'status' => 'pendente',
        ];

        return IntegracaoPatrimonio::create($dadosIntegracao);
    }

    /**
     * Process pending integrations.
     */
    public function processarIntegracoesPendentes(): array
    {
        $integracoes = IntegracaoPatrimonio::prontoParaRetentar()
            ->with(['requisicao.fornecedor', 'item', 'usuarioSolicitacao'])
            ->limit(10) // Process in batches
            ->get();

        $resultados = [
            'processadas' => 0,
            'integradas' => 0,
            'erros' => 0,
            'detalhes' => []
        ];

        foreach ($integracoes as $integracao) {
            try {
                $resultados['processadas']++;
                $this->processarIntegracao($integracao);
                $resultados['integradas']++;
                $resultados['detalhes'][] = [
                    'integracao_id' => $integracao->id,
                    'status' => 'integrada',
                    'mensagem' => 'Integração realizada com sucesso'
                ];
            } catch (\Exception $e) {
                $resultados['erros']++;
                $resultados['detalhes'][] = [
                    'integracao_id' => $integracao->id,
                    'status' => 'erro',
                    'mensagem' => $e->getMessage()
                ];

                Log::error('Erro na integração com sistema patrimonial', [
                    'integracao_id' => $integracao->id,
                    'erro' => $e->getMessage(),
                    'dados' => $integracao->prepararDadosIntegracao()
                ]);
            }
        }

        return $resultados;
    }

    /**
     * Process a single integration.
     */
    public function processarIntegracao(IntegracaoPatrimonio $integracao): void
    {
        $integracao->update(['status' => 'integrando']);

        try {
            // Prepare data for external system
            $dados = $integracao->prepararDadosIntegracao();

            // Store integration data
            $integracao->update(['dados_integracao' => $dados]);

            // Simulate integration with external system
            $resultado = $this->enviarParaSistemaPatrimonial($dados);

            if ($resultado['sucesso']) {
                $integracao->marcarComoIntegrado(
                    $resultado['patrimonio_id'],
                    $resultado['codigo_tombamento'] ?? null,
                    $resultado['resposta'] ?? []
                );
            } else {
                $integracao->marcarComoErro(
                    $resultado['erro'] ?? 'Erro desconhecido na integração',
                    $resultado['resposta'] ?? []
                );
            }
        } catch (\Exception $e) {
            $integracao->marcarComoErro($e->getMessage());
            throw $e;
        }
    }

    /**
     * Send data to patrimonio system (simulation).
     * In production, this would make an actual API call to the patrimonio system.
     */
    private function enviarParaSistemaPatrimonial(array $dados): array
    {
        // Simulate API call delay
        usleep(100000); // 100ms

        // Simulate different scenarios based on data
        if (rand(1, 100) <= 80) { // 80% success rate
            // Simulate successful integration
            $patrimonioId = 'PAT-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);
            $codigoTombamento = date('Y') . '.' . rand(1000, 9999);

            return [
                'sucesso' => true,
                'patrimonio_id' => $patrimonioId,
                'codigo_tombamento' => $codigoTombamento,
                'resposta' => [
                    'mensagem' => 'Bem integrado com sucesso',
                    'data_integracao' => now()->format('Y-m-d H:i:s'),
                    'sistema' => 'Sistema Patrimonial v1.0'
                ]
            ];
        } else {
            // Simulate error
            $erros = [
                'Erro de conexão com o sistema patrimonial',
                'Dados inválidos: valor de aquisição não pode ser zero',
                'Bem com número de série já cadastrado',
                'Fornecedor não encontrado no sistema patrimonial',
                'Erro de validação: setor inválido'
            ];

            return [
                'sucesso' => false,
                'erro' => $erros[array_rand($erros)],
                'resposta' => [
                    'codigo_erro' => rand(400, 500),
                    'timestamp' => now()->format('Y-m-d H:i:s')
                ]
            ];
        }
    }

    /**
     * Retry failed integrations.
     */
    public function retentarIntegracoesFalhas(): array
    {
        return $this->processarIntegracoesPendentes();
    }

    /**
     * Get integration statistics.
     */
    public function getEstatisticasIntegracoes(): array
    {
        $total = IntegracaoPatrimonio::count();
        $pendentes = IntegracaoPatrimonio::pendente()->count();
        $integrando = IntegracaoPatrimonio::integrando()->count();
        $integradas = IntegracaoPatrimonio::integrado()->count();
        $erros = IntegracaoPatrimonio::comErro()->count();
        $rejeitadas = IntegracaoPatrimonio::where('status', 'rejeitado')->count();

        return [
            'total' => $total,
            'pendentes' => $pendentes,
            'integrando' => $integrando,
            'integradas' => $integradas,
            'erros' => $erros,
            'rejeitadas' => $rejeitadas,
            'taxa_sucesso' => $total > 0 ? round(($integradas / $total) * 100, 2) : 0,
            'taxa_erro' => $total > 0 ? round((($erros + $rejeitadas) / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Check if an item should be integrated with patrimonio.
     */
    public function deveIntegrarComPatrimonio(RequisicaoItem $item): bool
    {
        // Only integrate items marked as permanent goods
        if (!$item->item->is_permanente) {
            return false;
        }

        // Only integrate if value is significant (e.g., > R$ 1,000)
        if ($item->valor_total < 1000) {
            return false;
        }

        // Check if item category requires integration
        $categoriasPatrimonio = [
            'EQUIPAMENTOS DE INFORMÁTICA',
            'MÓVEIS E UTENSÍLIOS',
            'VEÍCULOS',
            'EQUIPAMENTOS DE COMUNICAÇÃO',
            'EQUIPAMENTOS DE SEGURANÇA',
            'MÁQUINAS E EQUIPAMENTOS'
        ];

        return in_array(strtoupper($item->item->categoria->nome ?? ''), $categoriasPatrimonio);
    }

    /**
     * Create automatic integrations for received requisitions.
     */
    public function criarIntegracoesAutomaticas(Requisicao $requisicao): void
    {
        if ($requisicao->status !== 'recebida' || !$requisicao->data_recebimento) {
            return;
        }

        foreach ($requisicao->itens as $item) {
            if ($this->deveIntegrarComPatrimonio($item)) {
                $this->criarIntegracaoParaRequisicao(
                    $requisicao,
                    $item,
                    $requisicao->usuarioCriacao ?? auth()->user()
                );
            }
        }
    }
}