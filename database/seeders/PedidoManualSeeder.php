<?php

namespace Database\Seeders;

use App\Models\Fornecedor;
use App\Models\PedidoManual;
use Illuminate\Database\Seeder;

class PedidoManualSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have suppliers available
        $fornecedores = Fornecedor::where('status', true)->get();

        if ($fornecedores->isEmpty()) {
            $this->command->error('Erro: É necessário ter fornecedores cadastrados antes de criar pedidos manuais.');
            $this->command->info('Execute: php artisan db:seed --class=FornecedorSeeder');

            return;
        }

        // Create specific realistic manual orders
        $pedidosManuais = [
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Papelaria%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Aquisição emergencial de material de escritório para atendimento das demandas administrativas do primeiro semestre, incluindo papel A4, canetas, lápis, grampeadores e pastas.',
                'valor' => 2500.75,
                'data_pedido' => now()->subDays(45),
                'numero_pedido' => 'PM-001/2024',
                'observacoes' => 'Pedido realizado devido à urgência na reposição do estoque.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Limpeza%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Compra de produtos de limpeza e higienização para as unidades de saúde, incluindo álcool gel, detergente hospitalar, desinfetante e papel toalha.',
                'valor' => 4200.00,
                'data_pedido' => now()->subDays(30),
                'numero_pedido' => 'PM-002/2024',
                'observacoes' => 'Atendimento emergencial para manutenção dos protocolos de higiene.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%TechSoft%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Aquisição de equipamentos de informática para substituição de computadores danificados na Secretaria de Educação.',
                'valor' => 15000.00,
                'data_pedido' => now()->subDays(60),
                'numero_pedido' => 'PM-003/2024',
                'observacoes' => 'Equipamentos necessários para continuidade dos trabalhos administrativos.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Medicamentos%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Compra emergencial de medicamentos básicos para reposição do estoque da farmácia municipal.',
                'valor' => 8750.50,
                'data_pedido' => now()->subDays(20),
                'numero_pedido' => 'PM-004/2024',
                'observacoes' => 'Reposição urgente para atendimento da população.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Combustíveis%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Aquisição de combustível (gasolina e diesel) para abastecimento emergencial da frota municipal.',
                'valor' => 12000.00,
                'data_pedido' => now()->subDays(15),
                'numero_pedido' => 'PM-005/2024',
                'observacoes' => 'Abastecimento necessário para manutenção dos serviços públicos.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Gráfica%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Impressão de material gráfico institucional incluindo folders, cartazes e informativos para campanhas educativas.',
                'valor' => 3200.25,
                'data_pedido' => now()->subDays(25),
                'numero_pedido' => 'PM-006/2024',
                'observacoes' => 'Material para campanha de conscientização ambiental.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Segurança%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Aquisição de equipamentos de proteção individual (EPIs) para os funcionários da limpeza urbana.',
                'valor' => 5500.00,
                'data_pedido' => now()->subDays(35),
                'numero_pedido' => 'PM-007/2024',
                'observacoes' => 'Equipamentos necessários para segurança dos trabalhadores.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Móveis%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Compra de móveis para escritório incluindo cadeiras, mesas e armários para nova sala administrativa.',
                'valor' => 18500.00,
                'data_pedido' => now()->subDays(50),
                'numero_pedido' => 'PM-008/2024',
                'observacoes' => 'Mobiliário para adequação do espaço de trabalho.',
            ],
            [
                'fornecedor_id' => $fornecedores->where('razao_social', 'LIKE', '%Construção%')->first()?->id ?? $fornecedores->random()->id,
                'descricao' => 'Aquisição de material de construção para reparos emergenciais em prédios públicos.',
                'valor' => 22000.75,
                'data_pedido' => now()->subDays(40),
                'numero_pedido' => 'PM-009/2024',
                'observacoes' => 'Material para manutenção preventiva das instalações.',
            ],
            [
                'fornecedor_id' => $fornecedores->random()->id,
                'descricao' => 'Compra de uniformes para funcionários da limpeza urbana e jardinagem.',
                'valor' => 6800.00,
                'data_pedido' => now()->subDays(10),
                'numero_pedido' => 'PM-010/2024',
                'observacoes' => 'Uniformes para identificação e proteção dos funcionários.',
            ],
        ];

        foreach ($pedidosManuais as $pedido) {
            PedidoManual::create($pedido);
        }

        // Create additional random manual orders using factory
        PedidoManual::factory(20)->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        // Create some high-value orders
        PedidoManual::factory(5)->highValue()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        // Create some low-value orders
        PedidoManual::factory(10)->lowValue()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        // Create recent orders
        PedidoManual::factory(8)->recent()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        // Create orders with observations
        PedidoManual::factory(6)->withObservations()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        // Create specific type orders
        PedidoManual::factory(3)->cleaningSupplies()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        PedidoManual::factory(3)->officeSupplies()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        PedidoManual::factory(2)->itEquipment()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        PedidoManual::factory(2)->medicalSupplies()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        PedidoManual::factory(2)->fuel()->create([
            'fornecedor_id' => fn () => $fornecedores->random()->id,
        ]);

        $this->command->info('Pedidos manuais criados com sucesso!');
        $this->command->info('Total: '.PedidoManual::count().' pedidos manuais');

        // Show statistics
        $totalValue = PedidoManual::sum('valor');
        $avgValue = PedidoManual::avg('valor');
        $maxValue = PedidoManual::max('valor');
        $minValue = PedidoManual::min('valor');

        $this->command->info("\nEstatísticas dos pedidos manuais:");
        $this->command->info('Valor total: R$ '.number_format($totalValue, 2, ',', '.'));
        $this->command->info('Valor médio: R$ '.number_format($avgValue, 2, ',', '.'));
        $this->command->info('Maior valor: R$ '.number_format($maxValue, 2, ',', '.'));
        $this->command->info('Menor valor: R$ '.number_format($minValue, 2, ',', '.'));

        $this->command->info("\nPedidos por fornecedor:");
        $fornecedores->each(function ($fornecedor) {
            $count = PedidoManual::where('fornecedor_id', $fornecedor->id)->count();
            if ($count > 0) {
                $total = PedidoManual::where('fornecedor_id', $fornecedor->id)->sum('valor');
                $this->command->line("- {$fornecedor->razao_social}: {$count} pedidos (R$ ".number_format($total, 2, ',', '.').')');
            }
        });

        $this->command->info("\nPedidos com número: ".PedidoManual::whereNotNull('numero_pedido')->count());
        $this->command->info('Pedidos com observações: '.PedidoManual::whereNotNull('observacoes')->count());
    }
}
