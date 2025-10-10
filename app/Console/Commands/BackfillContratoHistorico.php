<?php

namespace App\Console\Commands;

use App\Models\Contrato;
use App\Models\ContratoHistoricoLimite;
use Illuminate\Console\Command;

class BackfillContratoHistorico extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contratos:backfill-historico';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backfill historico de limites for existing contracts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting backfill of contract history...');

        $contratos = Contrato::all();

        if ($contratos->isEmpty()) {
            $this->warn('No contracts found in the database.');

            return;
        }

        $this->info("Found {$contratos->count()} contracts.");

        $bar = $this->output->createProgressBar($contratos->count());
        $bar->start();

        $created = 0;

        foreach ($contratos as $contrato) {
            // Check if history already exists for this contract
            $existingHistory = ContratoHistoricoLimite::where(
                'contrato_id',
                $contrato->id,
            )->exists();

            if ($existingHistory) {
                $bar->advance();

                continue;
            }

            // Create initial history records for this contract
            $campos = [
                'limite_requisicoes' => $contrato->limite_requisicoes,
                'limite_conferencias' => $contrato->limite_conferencias,
                'limite_valor_mensal' => $contrato->limite_valor_mensal,
            ];

            foreach ($campos as $campo => $valor) {
                ContratoHistoricoLimite::create([
                    'contrato_id' => $contrato->id,
                    'usuario_id' => $contrato->usuario_criacao_id,
                    'tipo_alteracao' => 'criacao',
                    'campo_alterado' => $campo,
                    'valor_anterior' => null,
                    'valor_novo' => $valor,
                    'diferenca' => $valor,
                    'descricao' => 'Limite inicial definido na criação do contrato (backfilled)',
                    'created_at' => $contrato->created_at,
                    'updated_at' => $contrato->created_at,
                ]);

                $created++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info(
            "Backfill completed! Created {$created} history records for {$contratos->count()} contracts.",
        );
    }
}
