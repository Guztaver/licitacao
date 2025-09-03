<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DevelopmentSeeder extends Seeder
{
    /**
     * Run specific seeders for development.
     */
    public function run(): void
    {
        $this->command->info('🚀 Development Seeder - Escolha o que deseja popular:');
        $this->command->info('');

        $option = $this->command->choice(
            'Qual seeder deseja executar?',
            [
                'all' => 'Todos os seeders (completo)',
                'users' => 'Apenas usuários',
                'fornecedores' => 'Apenas fornecedores',
                'emitentes' => 'Apenas emitentes',
                'destinatarios' => 'Apenas destinatários',
                'requisicoes' => 'Apenas requisições',
                'pedidos' => 'Apenas pedidos manuais',
                'conferencias' => 'Apenas conferências',
                'essentials' => 'Dados essenciais (usuários, fornecedores, emitentes, destinatários)',
                'clean' => 'Limpar e popular tudo',
            ],
            'all'
        );

        switch ($option) {
            case 'all':
                $this->runAllSeeders();
                break;
            case 'users':
                $this->call(UserSeeder::class);
                break;
            case 'fornecedores':
                $this->call(FornecedorSeeder::class);
                break;
            case 'emitentes':
                $this->call(EmitenteSeeder::class);
                break;
            case 'destinatarios':
                $this->call(DestinatarioSeeder::class);
                break;
            case 'requisicoes':
                $this->checkDependencies(['users', 'emitentes', 'destinatarios'], 'requisições');
                $this->call(RequisicaoSeeder::class);
                break;
            case 'pedidos':
                $this->checkDependencies(['fornecedores'], 'pedidos manuais');
                $this->call(PedidoManualSeeder::class);
                break;
            case 'conferencias':
                $this->checkDependencies(['users', 'fornecedores'], 'conferências');
                $this->call(ConferenciaSeeder::class);
                break;
            case 'essentials':
                $this->runEssentialSeeders();
                break;
            case 'clean':
                $this->command->info('🧹 Limpando banco de dados...');
                $this->command->call('migrate:fresh');
                $this->runAllSeeders();
                break;
        }

        $this->showSummary();
    }

    /**
     * Run all seeders in the correct order.
     */
    private function runAllSeeders(): void
    {
        $this->command->info('📊 Executando todos os seeders...');

        $this->command->info('👤 Criando usuários...');
        $this->call(UserSeeder::class);

        $this->command->info('🏢 Criando fornecedores...');
        $this->call(FornecedorSeeder::class);

        $this->command->info('🏛️ Criando emitentes...');
        $this->call(EmitenteSeeder::class);

        $this->command->info('📋 Criando destinatários...');
        $this->call(DestinatarioSeeder::class);

        $this->command->info('📄 Criando requisições...');
        $this->call(RequisicaoSeeder::class);

        $this->command->info('📝 Criando pedidos manuais...');
        $this->call(PedidoManualSeeder::class);

        $this->command->info('📊 Criando conferências...');
        $this->call(ConferenciaSeeder::class);
    }

    /**
     * Run only essential seeders.
     */
    private function runEssentialSeeders(): void
    {
        $this->command->info('⚡ Executando seeders essenciais...');

        $this->command->info('👤 Criando usuários...');
        $this->call(UserSeeder::class);

        $this->command->info('🏢 Criando fornecedores...');
        $this->call(FornecedorSeeder::class);

        $this->command->info('🏛️ Criando emitentes...');
        $this->call(EmitenteSeeder::class);

        $this->command->info('📋 Criando destinatários...');
        $this->call(DestinatarioSeeder::class);
    }

    /**
     * Check if dependencies exist before running a seeder.
     */
    private function checkDependencies(array $dependencies, string $entityName): void
    {
        $missing = [];

        foreach ($dependencies as $dependency) {
            $count = $this->getModelCount($dependency);
            if ($count === 0) {
                $missing[] = $dependency;
            }
        }

        if (!empty($missing)) {
            $this->command->warn("⚠️  Dependências ausentes para criar {$entityName}:");
            foreach ($missing as $dep) {
                $this->command->line("   - {$dep}");
            }

            if ($this->command->confirm('Deseja criar as dependências primeiro?')) {
                foreach ($missing as $dep) {
                    $this->runDependencySeeder($dep);
                }
            } else {
                $this->command->error("❌ Não é possível criar {$entityName} sem as dependências.");
                return;
            }
        }
    }

    /**
     * Run a specific dependency seeder.
     */
    private function runDependencySeeder(string $dependency): void
    {
        switch ($dependency) {
            case 'users':
                $this->command->info('👤 Criando usuários...');
                $this->call(UserSeeder::class);
                break;
            case 'fornecedores':
                $this->command->info('🏢 Criando fornecedores...');
                $this->call(FornecedorSeeder::class);
                break;
            case 'emitentes':
                $this->command->info('🏛️ Criando emitentes...');
                $this->call(EmitenteSeeder::class);
                break;
            case 'destinatarios':
                $this->command->info('📋 Criando destinatários...');
                $this->call(DestinatarioSeeder::class);
                break;
        }
    }

    /**
     * Get count of models for a given type.
     */
    private function getModelCount(string $type): int
    {
        switch ($type) {
            case 'users':
                return \App\Models\User::count();
            case 'fornecedores':
                return \App\Models\Fornecedor::count();
            case 'emitentes':
                return \App\Models\Emitente::count();
            case 'destinatarios':
                return \App\Models\Destinatario::count();
            default:
                return 0;
        }
    }

    /**
     * Show summary of created data.
     */
    private function showSummary(): void
    {
        $this->command->info('');
        $this->command->info('✅ Seeding concluído!');
        $this->command->info('');
        $this->command->info('📊 Resumo atual do banco:');
        $this->command->info('👥 Usuários: ' . \App\Models\User::count());
        $this->command->info('🏢 Fornecedores: ' . \App\Models\Fornecedor::count());
        $this->command->info('🏛️ Emitentes: ' . \App\Models\Emitente::count());
        $this->command->info('📋 Destinatários: ' . \App\Models\Destinatario::count());
        $this->command->info('📄 Requisições: ' . \App\Models\Requisicao::count());
        $this->command->info('📝 Pedidos manuais: ' . \App\Models\PedidoManual::count());
        $this->command->info('📊 Conferências: ' . \App\Models\Conferencia::count());

        if (\App\Models\User::count() > 0) {
            $this->command->info('');
            $this->command->info('🔑 Credenciais principais:');
            $this->command->info('Admin: admin@licitacao.gov.br / admin123');
            $this->command->info('Supervisor: supervisor@licitacao.gov.br / supervisor123');
            $this->command->info('Operador: operador@compras.gov.br / operador123');
        }

        $this->command->info('');
        $this->command->info('💡 Comandos úteis:');
        $this->command->info('php artisan db:seed --class=DevelopmentSeeder (executar novamente)');
        $this->command->info('php artisan migrate:fresh --seed (resetar tudo)');
        $this->command->info('php artisan tinker (explorar dados)');
    }
}
