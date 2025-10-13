<?php

namespace App\Console\Commands;

use App\Services\PatrimonioIntegrationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessPatrimonioIntegrations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'patrimonio:process-integrations {--retry : Process only failed integrations} {--force : Force processing of all pending integrations}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process automatic integrations with the patrimonio system';

    /**
     * Execute the console command.
     */
    public function handle(PatrimonioIntegrationService $service): int
    {
        $this->info('Starting patrimonio integration processing...');

        try {
            if ($this->option('retry')) {
                $this->info('Processing failed integrations...');
                $resultados = $service->retentarIntegracoesFalhas();
            } else {
                $this->info('Processing pending integrations...');
                $resultados = $service->processarIntegracoesPendentes();
            }

            $this->displayResults($resultados);
            $this->logResults($resultados);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error processing patrimonio integrations: ' . $e->getMessage());
            Log::error('Error in patrimonio integration command', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Command::FAILURE;
        }
    }

    /**
     * Display processing results.
     */
    private function displayResults(array $resultados): void
    {
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Integrações processadas', $resultados['processadas']],
                ['Integrações realizadas', $resultados['integradas']],
                ['Erros encontrados', $resultados['erros']],
            ]
        );

        if (!empty($resultados['detalhes'])) {
            $this->newLine();
            $this->info('Detalhes das integrações:');

            foreach ($resultados['detalhes'] as $detalhe) {
                $status = $detalhe['status'] === 'integrada' ? '✅' : '❌';
                $this->line("  {$status} Integração #{$detalhe['integracao_id']}: {$detalhe['mensagem']}");
            }
        }

        // Display statistics
        $estatisticas = app(PatrimonioIntegrationService::class)->getEstatisticasIntegracoes();
        $this->newLine();
        $this->info('Estatísticas gerais:');
        $this->table(
            ['Status', 'Quantidade', 'Percentual'],
            [
                ['Pendentes', $estatisticas['pendentes'], number_format($estatisticas['pendentes'] / max($estatisticas['total'], 1) * 100, 2) . '%'],
                ['Em andamento', $estatisticas['integrando'], number_format($estatisticas['integrando'] / max($estatisticas['total'], 1) * 100, 2) . '%'],
                ['Integradas', $estatisticas['integradas'], number_format($estatisticas['integradas'] / max($estatisticas['total'], 1) * 100, 2) . '%'],
                ['Com erro', $estatisticas['erros'], number_format($estatisticas['erros'] / max($estatisticas['total'], 1) * 100, 2) . '%'],
                ['Rejeitadas', $estatisticas['rejeitadas'], number_format($estatisticas['rejeitadas'] / max($estatisticas['total'], 1) * 100, 2) . '%'],
            ]
        );
        $this->line("Taxa de sucesso: {$estatisticas['taxa_sucesso']}%");
        $this->line("Taxa de erro: {$estatisticas['taxa_erro']}%");
    }

    /**
     * Log processing results.
     */
    private function logResults(array $resultados): void
    {
        Log::info('Patrimonio integration command executed', [
            'command' => $this->getName(),
            'options' => $this->options(),
            'results' => $resultados,
            'timestamp' => now()->toISOString()
        ]);
    }
}