<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info("🌱 Iniciando o seeding do banco de dados...");

        // Create users first as they are referenced by other models
        $this->command->info("👤 Criando usuários...");
        $this->call(UserSeeder::class);

        // Create suppliers
        $this->command->info("🏢 Criando fornecedores...");
        $this->call(FornecedorSeeder::class);

        // Create issuers (government departments that issue requests)
        $this->command->info("🏛️ Criando emitentes...");
        $this->call(EmitenteSeeder::class);

        // Create recipients (procurement departments that receive requests)
        $this->command->info("📋 Criando destinatários...");
        $this->call(DestinatarioSeeder::class);

        // Create contracts (requires suppliers and users)
        $this->command->info("📝 Criando contratos...");
        $this->call(ContratoSeeder::class);

        // Create procurement requests (requires all above models)
        $this->command->info("📄 Criando requisições...");
        $this->call(RequisicaoSeeder::class);

        // Create manual orders (requires suppliers)
        $this->command->info("📝 Criando pedidos manuais...");
        $this->call(PedidoManualSeeder::class);

        // Create conferences (requires suppliers and users)
        $this->command->info("📊 Criando conferências...");
        $this->call(ConferenciaSeeder::class);

        $this->command->info("✅ Seeding concluído com sucesso!");
        $this->command->info("");
        $this->command->info("📊 Resumo dos dados criados:");
        $this->command->info("👥 Usuários: " . \App\Models\User::count());
        $this->command->info(
            "🏢 Fornecedores: " . \App\Models\Fornecedor::count(),
        );
        $this->command->info("🏛️ Emitentes: " . \App\Models\Emitente::count());
        $this->command->info(
            "📋 Destinatários: " . \App\Models\Destinatario::count(),
        );
        $this->command->info(
            "📄 Requisições: " . \App\Models\Requisicao::count(),
        );
        $this->command->info(
            "📝 Pedidos manuais: " . \App\Models\PedidoManual::count(),
        );
        $this->command->info(
            "📊 Conferências: " . \App\Models\Conferencia::count(),
        );
        $this->command->info("📋 Contratos: " . \App\Models\Contrato::count());
        $this->command->info("");
        $this->command->info("🔑 Credenciais de acesso:");
        $this->command->info("Admin: admin@licitacao.gov.br / admin123");
        $this->command->info(
            "Supervisor: supervisor@licitacao.gov.br / supervisor123",
        );
        $this->command->info("Operador: operador@compras.gov.br / operador123");
        $this->command->info("Outros usuários: password123");
        $this->command->info("");
        $this->command->info("🚀 Para executar o seeding:");
        $this->command->info("php artisan db:seed");
        $this->command->info("");
        $this->command->info("🔄 Para resetar e executar novamente:");
        $this->command->info("php artisan migrate:fresh --seed");
    }
}
