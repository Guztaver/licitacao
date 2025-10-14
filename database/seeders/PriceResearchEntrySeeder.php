<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PriceResearchEntry;
use App\Models\User;
use App\Models\PurchaseRequest;

class PriceResearchEntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or create a sample one
        $user = User::first();
        $purchaseRequest = PurchaseRequest::first();

        // Sample price research data
        $sampleData = [
            [
                'item_description' => 'Notebook Dell Inspiron 15',
                'supplier_name' => 'Dell Computadores Brasil',
                'supplier_price' => 3499.99,
                'quantity' => 10,
                'unit' => 'unidade',
                'uf' => 'SP',
                'municipio' => 'São Paulo',
                'proposal_date' => '2024-01-15',
                'numero_processo' => '001/2024',
                'orgao' => 'Secretaria de Educação',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(30),
            ],
            [
                'item_description' => 'Notebook Dell Inspiron 15',
                'supplier_name' => 'Lojas Americanas',
                'supplier_price' => 3299.00,
                'quantity' => 5,
                'unit' => 'unidade',
                'uf' => 'RJ',
                'municipio' => 'Rio de Janeiro',
                'proposal_date' => '2024-01-20',
                'numero_processo' => '002/2024',
                'orgao' => 'Secretaria de Educação',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(25),
            ],
            [
                'item_description' => 'Monitor LED 24 polegadas',
                'supplier_name' => 'Samsung Brasil',
                'supplier_price' => 899.90,
                'quantity' => 20,
                'unit' => 'unidade',
                'uf' => 'SP',
                'municipio' => 'São Paulo',
                'proposal_date' => '2024-02-01',
                'numero_processo' => '003/2024',
                'orgao' => 'Secretaria de Administração',
                'modalidade' => 'Dispensa de Licitação',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(20),
            ],
            [
                'item_description' => 'Monitor LED 24 polegadas',
                'supplier_name' => 'LG Electronics Brasil',
                'supplier_price' => 949.00,
                'quantity' => 15,
                'unit' => 'unidade',
                'uf' => 'MG',
                'municipio' => 'Belo Horizonte',
                'proposal_date' => '2024-02-05',
                'numero_processo' => '004/2024',
                'orgao' => 'Secretaria de Administração',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(15),
            ],
            [
                'item_description' => 'Impressora Multifuncional HP',
                'supplier_name' => 'HP Brasil',
                'supplier_price' => 1599.00,
                'quantity' => 8,
                'unit' => 'unidade',
                'uf' => 'PR',
                'municipio' => 'Curitiba',
                'proposal_date' => '2024-02-10',
                'numero_processo' => '005/2024',
                'orgao' => 'Secretaria de Saúde',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(10),
            ],
            [
                'item_description' => 'Cadeira Executiva',
                'supplier_name' => 'Movelaria Brasil',
                'supplier_price' => 450.00,
                'quantity' => 30,
                'unit' => 'unidade',
                'uf' => 'RS',
                'municipio' => 'Porto Alegre',
                'proposal_date' => '2024-02-15',
                'numero_processo' => '006/2024',
                'orgao' => 'Secretaria de Saúde',
                'modalidade' => 'Dispensa de Licitação',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(5),
            ],
            [
                'item_description' => 'Mesa de Escritório',
                'supplier_name' => 'Movelaria Sul',
                'supplier_price' => 680.00,
                'quantity' => 25,
                'unit' => 'unidade',
                'uf' => 'SC',
                'municipio' => 'Florianópolis',
                'proposal_date' => '2024-02-20',
                'numero_processo' => '007/2024',
                'orgao' => 'Secretaria de Educação',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(2),
            ],
            [
                'item_description' => 'Notebook Dell Inspiron 15',
                'supplier_name' => ' Magazine Luiza',
                'supplier_price' => 3199.00,
                'quantity' => 12,
                'unit' => 'unidade',
                'uf' => 'PE',
                'municipio' => 'Recife',
                'proposal_date' => '2024-02-22',
                'numero_processo' => '008/2024',
                'orgao' => 'Secretaria de Educação',
                'modalidade' => 'Pregão Eletrônico',
                'situacao' => 'Ativa',
                'purchase_request_id' => $purchaseRequest?->id,
                'user_id' => $user?->id,
                'created_at' => now()->subDays(1),
            ],
        ];

        foreach ($sampleData as $entry) {
            PriceResearchEntry::create($entry);
        }

        $this->command->info('Price research entries seeded successfully!');
    }
}
