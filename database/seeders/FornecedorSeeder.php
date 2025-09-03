<?php

namespace Database\Seeders;

use App\Models\Fornecedor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FornecedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some specific well-known suppliers
        $fornecedoresEspecificos = [
            [
                'razao_social' => 'Papelaria Central Ltda',
                'cnpj' => '12.345.678/0001-90',
                'telefone' => '(11) 3456-7890',
                'email' => 'vendas@papelcentral.com.br',
                'endereco' => 'Rua das Flores, 123',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234-567',
                'contato' => 'João Silva',
                'status' => true,
                'observacoes' => 'Fornecedor tradicional de material de escritório',
            ],
            [
                'razao_social' => 'TechSoft Informática S/A',
                'cnpj' => '98.765.432/0001-10',
                'telefone' => '(21) 2345-6789',
                'email' => 'comercial@techsoft.com.br',
                'endereco' => 'Av. Paulista, 1000',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cep' => '20000-000',
                'contato' => 'Maria Santos',
                'status' => true,
                'observacoes' => 'Especializada em equipamentos de informática',
            ],
            [
                'razao_social' => 'Limpeza Total Serviços Ltda',
                'cnpj' => '11.222.333/0001-44',
                'telefone' => '(31) 3333-4444',
                'email' => 'contato@limpezatotal.com.br',
                'endereco' => 'Rua da Limpeza, 456',
                'cidade' => 'Belo Horizonte',
                'estado' => 'MG',
                'cep' => '30000-000',
                'contato' => 'Carlos Oliveira',
                'status' => true,
                'observacoes' => 'Fornecedora de produtos de limpeza e higiene',
            ],
            [
                'razao_social' => 'Medicamentos Brasil S/A',
                'cnpj' => '55.666.777/0001-88',
                'telefone' => '(85) 4444-5555',
                'email' => 'vendas@medbrasil.com.br',
                'endereco' => 'Av. da Saúde, 789',
                'cidade' => 'Fortaleza',
                'estado' => 'CE',
                'cep' => '60000-000',
                'contato' => 'Dra. Ana Paula',
                'status' => true,
                'observacoes' => 'Distribuidora de medicamentos e insumos hospitalares',
            ],
            [
                'razao_social' => 'Transportes Rápidos Ltda',
                'cnpj' => '77.888.999/0001-00',
                'telefone' => '(47) 5555-6666',
                'email' => 'operacao@transporterapido.com.br',
                'endereco' => 'Rod. BR-101, Km 50',
                'cidade' => 'Joinville',
                'estado' => 'SC',
                'cep' => '89000-000',
                'contato' => 'Roberto Lima',
                'status' => true,
                'observacoes' => 'Empresa de transporte e logística',
            ],
            [
                'razao_social' => 'Combustíveis Cidade Ltda',
                'cnpj' => '33.444.555/0001-66',
                'telefone' => '(62) 6666-7777',
                'email' => 'atendimento@combcidade.com.br',
                'endereco' => 'Av. Central, 1500',
                'cidade' => 'Goiânia',
                'estado' => 'GO',
                'cep' => '74000-000',
                'contato' => 'Pedro Ferreira',
                'status' => true,
                'observacoes' => 'Fornecedora de combustíveis e lubrificantes',
            ],
            [
                'razao_social' => 'Gráfica Impressão Rápida Ltda',
                'cnpj' => '22.333.444/0001-55',
                'telefone' => '(41) 7777-8888',
                'email' => 'orcamentos@graficaimpressao.com.br',
                'endereco' => 'Rua dos Gráficos, 200',
                'cidade' => 'Curitiba',
                'estado' => 'PR',
                'cep' => '80000-000',
                'contato' => 'Fernanda Costa',
                'status' => true,
                'observacoes' => 'Serviços gráficos e impressão digital',
            ],
            [
                'razao_social' => 'Segurança Total Vigilância S/A',
                'cnpj' => '66.777.888/0001-99',
                'telefone' => '(71) 8888-9999',
                'email' => 'contratos@segurancatotal.com.br',
                'endereco' => 'Av. da Segurança, 300',
                'cidade' => 'Salvador',
                'estado' => 'BA',
                'cep' => '40000-000',
                'contato' => 'Major Silva',
                'status' => true,
                'observacoes' => 'Empresa de segurança patrimonial e vigilância',
            ],
            [
                'razao_social' => 'Móveis e Equipamentos Escritório Ltda',
                'cnpj' => '44.555.666/0001-77',
                'telefone' => '(51) 9999-0000',
                'email' => 'vendas@moveisescritorio.com.br',
                'endereco' => 'Rua dos Móveis, 400',
                'cidade' => 'Porto Alegre',
                'estado' => 'RS',
                'cep' => '90000-000',
                'contato' => 'Juliana Barbosa',
                'status' => true,
                'observacoes' => 'Fornecedora de móveis e equipamentos para escritório',
            ],
            [
                'razao_social' => 'Construção e Reformas Norte Ltda',
                'cnpj' => '88.999.000/0001-11',
                'telefone' => '(95) 1111-2222',
                'email' => 'obras@construcaonorte.com.br',
                'endereco' => 'Av. das Construções, 500',
                'cidade' => 'Boa Vista',
                'estado' => 'RR',
                'cep' => '69000-000',
                'contato' => 'Engº. Antonio José',
                'status' => true,
                'observacoes' => 'Empresa de construção civil e reformas',
            ],
        ];

        foreach ($fornecedoresEspecificos as $fornecedor) {
            Fornecedor::create($fornecedor);
        }

        // Create random suppliers using factory
        Fornecedor::factory(25)->create();

        // Create some inactive suppliers
        Fornecedor::factory(5)->inactive()->create();

        $this->command->info('Fornecedores criados com sucesso!');
        $this->command->info('Total: ' . Fornecedor::count() . ' fornecedores');
        $this->command->info('Ativos: ' . Fornecedor::where('status', true)->count());
        $this->command->info('Inativos: ' . Fornecedor::where('status', false)->count());
    }
}
