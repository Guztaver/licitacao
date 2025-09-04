<?php

namespace Database\Seeders;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConferenciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have suppliers and users available
        $fornecedores = Fornecedor::where('status', true)->get();
        $users = User::all();

        if ($fornecedores->isEmpty() || $users->isEmpty()) {
            $this->command->error('Erro: É necessário ter fornecedores e usuários cadastrados antes de criar conferências.');
            $this->command->info('Execute: php artisan db:seed --class=FornecedorSeeder');
            $this->command->info('Execute: php artisan db:seed --class=UserSeeder');

            return;
        }

        // Create specific realistic conferences
        $conferencias = [
            [
                'fornecedor_id' => $fornecedores->first()->id,
                'periodo_inicio' => now()->subMonths(3)->startOfMonth(),
                'periodo_fim' => now()->subMonths(3)->endOfMonth(),
                'total_requisicoes' => 45000.50,
                'total_pedidos_manuais' => 12500.25,
                'total_geral' => 57500.75,
                'status' => 'finalizada',
                'data_finalizacao' => now()->subMonths(2)->subDays(15),
                'usuario_criacao_id' => $users->random()->id,
                'usuario_finalizacao_id' => $users->random()->id,
                'observacoes' => 'Conferência trimestral finalizada sem divergências. Todos os valores foram validados e aprovados.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(1)->first()->id,
                'periodo_inicio' => now()->subMonths(2)->startOfMonth(),
                'periodo_fim' => now()->subMonths(2)->endOfMonth(),
                'total_requisicoes' => 32000.00,
                'total_pedidos_manuais' => 8750.50,
                'total_geral' => 40750.50,
                'status' => 'finalizada',
                'data_finalizacao' => now()->subMonths(1)->subDays(20),
                'usuario_criacao_id' => $users->random()->id,
                'usuario_finalizacao_id' => $users->random()->id,
                'observacoes' => 'Conferência mensal com pequenas divergências corrigidas durante o processo.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(2)->first()->id,
                'periodo_inicio' => now()->subMonths(1)->startOfMonth(),
                'periodo_fim' => now()->subMonths(1)->endOfMonth(),
                'total_requisicoes' => 28500.75,
                'total_pedidos_manuais' => 15200.00,
                'total_geral' => 43700.75,
                'status' => 'finalizada',
                'data_finalizacao' => now()->subDays(25),
                'usuario_criacao_id' => $users->random()->id,
                'usuario_finalizacao_id' => $users->random()->id,
                'observacoes' => 'Conferência concluída com aprovação total dos valores apresentados.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(3)->first()->id,
                'periodo_inicio' => now()->startOfMonth(),
                'periodo_fim' => now()->endOfMonth(),
                'total_requisicoes' => 18750.25,
                'total_pedidos_manuais' => 6500.00,
                'total_geral' => 25250.25,
                'status' => 'em_andamento',
                'usuario_criacao_id' => $users->random()->id,
                'observacoes' => 'Conferência do mês atual em andamento. Aguardando finalização dos pedidos pendentes.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(4)->first()->id,
                'periodo_inicio' => now()->subDays(15)->startOfMonth(),
                'periodo_fim' => now()->subDays(15)->endOfMonth(),
                'total_requisicoes' => 52000.00,
                'total_pedidos_manuais' => 18900.50,
                'total_geral' => 70900.50,
                'status' => 'em_andamento',
                'usuario_criacao_id' => $users->random()->id,
                'observacoes' => 'Conferência em análise. Identificadas algumas pendências que necessitam esclarecimento.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(5)->first()->id,
                'periodo_inicio' => now()->subMonths(6)->startOfMonth(),
                'periodo_fim' => now()->subMonths(4)->endOfMonth(),
                'total_requisicoes' => 125000.00,
                'total_pedidos_manuais' => 45000.25,
                'total_geral' => 170000.25,
                'status' => 'finalizada',
                'data_finalizacao' => now()->subMonths(3)->subDays(10),
                'usuario_criacao_id' => $users->random()->id,
                'usuario_finalizacao_id' => $users->random()->id,
                'observacoes' => 'Conferência semestral finalizada. Maior volume de transações do período.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(6)->first()->id,
                'periodo_inicio' => now()->subDays(45),
                'periodo_fim' => now()->subDays(15),
                'total_requisicoes' => 35500.00,
                'total_pedidos_manuais' => 12750.75,
                'total_geral' => 48250.75,
                'status' => 'em_andamento',
                'usuario_criacao_id' => $users->random()->id,
                'observacoes' => 'Conferência quinzenal em processo de validação final.',
            ],
            [
                'fornecedor_id' => $fornecedores->skip(7)->first()->id,
                'periodo_inicio' => now()->subYear()->startOfYear(),
                'periodo_fim' => now()->subYear()->endOfYear(),
                'total_requisicoes' => 450000.00,
                'total_pedidos_manuais' => 125000.50,
                'total_geral' => 575000.50,
                'status' => 'finalizada',
                'data_finalizacao' => now()->subMonths(10),
                'usuario_criacao_id' => $users->random()->id,
                'usuario_finalizacao_id' => $users->random()->id,
                'observacoes' => 'Conferência anual do exercício anterior. Todos os valores foram auditados e aprovados.',
            ],
        ];

        foreach ($conferencias as $conferencia) {
            // Only create if the supplier exists
            if (Fornecedor::find($conferencia['fornecedor_id'])) {
                Conferencia::create($conferencia);
            }
        }

        // Create monthly conferences using factory
        Conferencia::factory(8)->monthly()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        // Create quarterly conferences using factory
        Conferencia::factory(4)->quarterly()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        // Create annual conferences using factory
        Conferencia::factory(2)->annual()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        // Create some in-progress conferences
        Conferencia::factory(6)->inProgress()->recent()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
        ]);

        // Create high-value conferences
        Conferencia::factory(3)->highValue()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        // Create low-value conferences
        Conferencia::factory(5)->lowValue()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        // Create conferences with observations
        Conferencia::factory(4)->withObservations()->finalized()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
            'usuario_criacao_id' => fn () => $users->random()->id,
            'usuario_finalizacao_id' => fn () => $users->random()->id,
        ]);

        $this->command->info('Conferências criadas com sucesso!');
        $this->command->info('Total: '.Conferencia::count().' conferências');

        // Show statistics
        $stats = [
            'Finalizadas' => Conferencia::where('status', 'finalizada')->count(),
            'Em andamento' => Conferencia::where('status', 'em_andamento')->count(),
        ];

        $this->command->info("\nEstatísticas por status:");
        foreach ($stats as $status => $count) {
            $this->command->line("- {$status}: {$count}");
        }

        $totalGeral = Conferencia::sum('total_geral');
        $totalRequisicoes = Conferencia::sum('total_requisicoes');
        $totalPedidosManuais = Conferencia::sum('total_pedidos_manuais');
        $avgValue = Conferencia::avg('total_geral');

        $this->command->info("\nEstatísticas financeiras:");
        $this->command->info('Total geral: R$ '.number_format($totalGeral, 2, ',', '.'));
        $this->command->info('Total requisições: R$ '.number_format($totalRequisicoes, 2, ',', '.'));
        $this->command->info('Total pedidos manuais: R$ '.number_format($totalPedidosManuais, 2, ',', '.'));
        $this->command->info('Valor médio por conferência: R$ '.number_format($avgValue, 2, ',', '.'));

        $this->command->info("\nConferências por fornecedor:");
        $fornecedores->each(function ($fornecedor) {
            $count = Conferencia::where('fornecedor_id', $fornecedor->id)->count();
            if ($count > 0) {
                $total = Conferencia::where('fornecedor_id', $fornecedor->id)->sum('total_geral');
                $this->command->line("- {$fornecedor->razao_social}: {$count} conferências (R$ ".number_format($total, 2, ',', '.').')');
            }
        });

        $this->command->info("\nConferências com observações: ".Conferencia::whereNotNull('observacoes')->count());
    }
}
