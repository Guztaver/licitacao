<?php

namespace Database\Seeders;

use App\Models\Requisicao;
use App\Models\Emitente;
use App\Models\Destinatario;
use App\Models\Fornecedor;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequisicaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have the necessary related records
        $emitentes = Emitente::all();
        $destinatarios = Destinatario::all();
        $fornecedores = Fornecedor::where('status', true)->get();
        $users = User::all();

        if ($emitentes->isEmpty() || $destinatarios->isEmpty() || $users->isEmpty()) {
            $this->command->error('Erro: É necessário ter emitentes, destinatários e usuários cadastrados antes de criar requisições.');
            $this->command->info('Execute: php artisan db:seed --class=EmitenteSeeder');
            $this->command->info('Execute: php artisan db:seed --class=DestinatarioSeeder');
            $this->command->info('Execute: php artisan db:seed --class=UserSeeder');
            return;
        }

        // Create specific realistic requisitions
        $requisicoes = [
            [
                'numero' => '0001',
                'numero_completo' => '0001/2024',
                'emitente_id' => $emitentes->where('sigla', 'SME')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'DCL')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'João Silva Santos',
                'numero_oficio' => 'OF-001/2024',
                'data_recebimento' => now()->subDays(30),
                'descricao' => 'Aquisição de material escolar para atendimento das escolas municipais no ano letivo de 2024, incluindo cadernos, lápis, canetas, borrachas e demais itens pedagógicos.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => 'requisicao_001_2024.pdf',
                'status' => 'concretizada',
                'numero_pedido_real' => 'PED-001/2024',
                'valor_final' => 25000.50,
                'data_concretizacao' => now()->subDays(15),
                'usuario_concretizacao_id' => $users->random()->id,
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0002',
                'numero_completo' => '0002/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMS')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'DS')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Maria Oliveira Costa',
                'numero_oficio' => 'OF-002/2024',
                'data_recebimento' => now()->subDays(25),
                'descricao' => 'Contratação de serviços de limpeza hospitalar para as unidades básicas de saúde, incluindo fornecimento de produtos de limpeza e desinfecção.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => null,
                'status' => 'autorizada',
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0003',
                'numero_completo' => '0003/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMO')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'DMP')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Pedro Almeida Ferreira',
                'numero_oficio' => 'OF-003/2024',
                'data_recebimento' => now()->subDays(45),
                'descricao' => 'Aquisição de equipamentos de construção para obras de infraestrutura urbana, incluindo britadeiras, furadeiras e equipamentos de segurança.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => 'especificacoes_tecnicas_003.pdf',
                'status' => 'concretizada',
                'numero_pedido_real' => 'PED-003/2024',
                'valor_final' => 85000.00,
                'data_concretizacao' => now()->subDays(10),
                'usuario_concretizacao_id' => $users->random()->id,
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0004',
                'numero_completo' => '0004/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMA')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'CC')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Ana Paula Rodrigues',
                'numero_oficio' => null,
                'data_recebimento' => now()->subDays(60),
                'descricao' => 'Aquisição de móveis para escritório, incluindo mesas, cadeiras, armários e estantes para reorganização dos espaços administrativos.',
                'fornecedor_id' => null,
                'anexo' => null,
                'status' => 'cancelada',
                'data_exclusao' => now()->subDays(35),
                'usuario_exclusao_id' => $users->random()->id,
                'motivo_exclusao' => 'Verba insuficiente para execução da aquisição no exercício atual.',
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0005',
                'numero_completo' => '0005/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMF')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'SA')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Carlos Eduardo Lima',
                'numero_oficio' => 'OF-005/2024',
                'data_recebimento' => now()->subDays(20),
                'descricao' => 'Contratação de serviços de tecnologia da informação para modernização do sistema financeiro municipal.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => 'termo_referencia_ti.pdf',
                'status' => 'autorizada',
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0006',
                'numero_completo' => '0006/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMT')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'DLOG')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Fernanda Souza Martins',
                'numero_oficio' => 'OF-006/2024',
                'data_recebimento' => now()->subDays(15),
                'descricao' => 'Aquisição de combustível para abastecimento da frota municipal de transporte público.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => null,
                'status' => 'autorizada',
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0007',
                'numero_completo' => '0007/2024',
                'emitente_id' => $emitentes->where('sigla', 'SMMA')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'NCE')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Roberto Carlos Pereira',
                'numero_oficio' => 'OF-007/2024',
                'data_recebimento' => now()->subDays(40),
                'descricao' => 'Contratação de serviços especializados em recuperação de áreas degradadas e plantio de mudas nativas.',
                'fornecedor_id' => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
                'anexo' => 'projeto_ambiental_007.pdf',
                'status' => 'concretizada',
                'numero_pedido_real' => 'PED-007/2024',
                'valor_final' => 45000.75,
                'data_concretizacao' => now()->subDays(5),
                'usuario_concretizacao_id' => $users->random()->id,
                'usuario_criacao_id' => $users->random()->id,
            ],
            [
                'numero' => '0008',
                'numero_completo' => '0008/2024',
                'emitente_id' => $emitentes->where('sigla', 'FMAS')->first()?->id ?? $emitentes->random()->id,
                'destinatario_id' => $destinatarios->where('sigla', 'SCE')->first()?->id ?? $destinatarios->random()->id,
                'solicitante' => 'Juliana Mendes Barbosa',
                'numero_oficio' => null,
                'data_recebimento' => now()->subDays(5),
                'descricao' => 'Aquisição emergencial de cestas básicas para atendimento às famílias em situação de vulnerabilidade social.',
                'fornecedor_id' => null,
                'anexo' => null,
                'status' => 'autorizada',
                'usuario_criacao_id' => $users->random()->id,
            ],
        ];

        foreach ($requisicoes as $requisicao) {
            Requisicao::create($requisicao);
        }

        // Create authorized requisitions using factory
        Requisicao::factory(15)->authorized()->create([
            'emitente_id' => fn() => $emitentes->random()->id,
            'destinatario_id' => fn() => $destinatarios->random()->id,
            'usuario_criacao_id' => fn() => $users->random()->id,
            'fornecedor_id' => fn() => $fornecedores->isNotEmpty() && fake()->boolean(60)
                ? $fornecedores->random()->id
                : null,
        ]);

        // Create completed requisitions using factory
        Requisicao::factory(20)->completed()->create([
            'emitente_id' => fn() => $emitentes->random()->id,
            'destinatario_id' => fn() => $destinatarios->random()->id,
            'usuario_criacao_id' => fn() => $users->random()->id,
            'usuario_concretizacao_id' => fn() => $users->random()->id,
            'fornecedor_id' => fn() => $fornecedores->isNotEmpty() ? $fornecedores->random()->id : null,
        ]);

        // Create cancelled requisitions using factory
        Requisicao::factory(8)->cancelled()->create([
            'emitente_id' => fn() => $emitentes->random()->id,
            'destinatario_id' => fn() => $destinatarios->random()->id,
            'usuario_criacao_id' => fn() => $users->random()->id,
            'usuario_exclusao_id' => fn() => $users->random()->id,
        ]);

        // Create deleted requisitions using factory
        Requisicao::factory(3)->deleted()->create([
            'emitente_id' => fn() => $emitentes->random()->id,
            'destinatario_id' => fn() => $destinatarios->random()->id,
            'usuario_criacao_id' => fn() => $users->random()->id,
            'usuario_exclusao_id' => fn() => $users->random()->id,
        ]);

        // Create some recent requisitions
        Requisicao::factory(10)->recent()->authorized()->create([
            'emitente_id' => fn() => $emitentes->random()->id,
            'destinatario_id' => fn() => $destinatarios->random()->id,
            'usuario_criacao_id' => fn() => $users->random()->id,
            'fornecedor_id' => fn() => $fornecedores->isNotEmpty() && fake()->boolean(40)
                ? $fornecedores->random()->id
                : null,
        ]);

        $this->command->info('Requisições criadas com sucesso!');
        $this->command->info('Total: ' . Requisicao::count() . ' requisições');

        // Show statistics
        $stats = [
            'Autorizadas' => Requisicao::where('status', 'autorizada')->count(),
            'Concretizadas' => Requisicao::where('status', 'concretizada')->count(),
            'Canceladas' => Requisicao::where('status', 'cancelada')->count(),
            'Excluídas' => Requisicao::where('status', 'excluida')->count(),
        ];

        $this->command->info("\nEstatísticas por status:");
        foreach ($stats as $status => $count) {
            $this->command->line("- {$status}: {$count}");
        }

        $this->command->info("\nRequisições com fornecedor: " . Requisicao::whereNotNull('fornecedor_id')->count());
        $this->command->info("Requisições com anexo: " . Requisicao::whereNotNull('anexo')->count());
        $this->command->info("Valor total concretizado: R$ " . number_format(Requisicao::where('status', 'concretizada')->sum('valor_final'), 2, ',', '.'));
    }
}
