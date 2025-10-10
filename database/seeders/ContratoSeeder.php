<?php

namespace Database\Seeders;

use App\Models\Contrato;
use App\Models\Fornecedor;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContratoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user as creator
        $user = User::first();

        // Get some fornecedores
        $fornecedores = Fornecedor::limit(3)->get();

        if ($fornecedores->isEmpty()) {
            $this->command->warn(
                "No fornecedores found. Please run FornecedorSeeder first.",
            );
            return;
        }

        // Create contracts with limits
        $contratos = [
            [
                "fornecedor_id" => $fornecedores[0]->id ?? null,
                "numero_contrato" => "001/2024",
                "data_inicio" => now()->startOfYear(),
                "data_fim" => now()->endOfYear(),
                "limite_requisicoes" => 50,
                "limite_conferencias" => 12,
                "descricao" =>
                    "Contrato anual para fornecimento de materiais de escritório com limites definidos.",
                "status" => "ativo",
                "usuario_criacao_id" => $user->id ?? null,
            ],
            [
                "fornecedor_id" => $fornecedores[1]->id ?? null,
                "numero_contrato" => "002/2024",
                "data_inicio" => now()->subMonths(6),
                "data_fim" => now()->addMonths(6),
                "limite_requisicoes" => 30,
                "limite_conferencias" => 6,
                "descricao" =>
                    "Contrato semestral para serviços de manutenção.",
                "status" => "ativo",
                "usuario_criacao_id" => $user->id ?? null,
            ],
            [
                "fornecedor_id" => $fornecedores[2]->id ?? null,
                "numero_contrato" => "003/2024",
                "data_inicio" => now()->subMonths(3),
                "data_fim" => now()->addMonths(3),
                "limite_requisicoes" => null, // Unlimited
                "limite_conferencias" => null, // Unlimited
                "descricao" =>
                    "Contrato trimestral sem limites de requisições e conferências.",
                "status" => "ativo",
                "usuario_criacao_id" => $user->id ?? null,
            ],
            [
                "fornecedor_id" => null, // General contract
                "numero_contrato" => "004/2024",
                "data_inicio" => now()->startOfMonth(),
                "data_fim" => now()->addYear(),
                "limite_requisicoes" => 100,
                "limite_conferencias" => 24,
                "descricao" =>
                    "Contrato geral para múltiplos fornecedores com limites amplos.",
                "status" => "ativo",
                "usuario_criacao_id" => $user->id ?? null,
            ],
            [
                "fornecedor_id" => $fornecedores[0]->id ?? null,
                "numero_contrato" => "005/2023",
                "data_inicio" => now()->subYear(),
                "data_fim" => now()->subMonths(1),
                "limite_requisicoes" => 25,
                "limite_conferencias" => 12,
                "descricao" => "Contrato do ano anterior já expirado.",
                "status" => "expirado",
                "usuario_criacao_id" => $user->id ?? null,
            ],
            [
                "fornecedor_id" => $fornecedores[1]->id ?? null,
                "numero_contrato" => "006/2024",
                "data_inicio" => now()->addMonths(2),
                "data_fim" => now()->addYear(),
                "limite_requisicoes" => 40,
                "limite_conferencias" => 8,
                "descricao" => "Contrato futuro ainda não iniciado.",
                "status" => "inativo",
                "usuario_criacao_id" => $user->id ?? null,
            ],
        ];

        foreach ($contratos as $contratoData) {
            Contrato::create($contratoData);
        }

        $this->command->info("Contratos seeded successfully!");
    }
}
