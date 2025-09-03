<?php

namespace Database\Seeders;

use App\Models\Destinatario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DestinatarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific procurement and administrative departments
        $destinatarios = [
            [
                'nome' => 'Departamento de Compras e Licitações',
                'sigla' => 'DCL',
                'endereco' => 'Av. Central, 100 - Setor Administrativo',
                'telefone' => '(11) 4000-1000',
                'email' => 'dcl@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Suprimentos',
                'sigla' => 'DS',
                'endereco' => 'Rua dos Suprimentos, 200 - Centro',
                'telefone' => '(11) 4000-2000',
                'email' => 'ds@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Materiais e Patrimônio',
                'sigla' => 'DMP',
                'endereco' => 'Av. do Patrimônio, 300 - Administrativo',
                'telefone' => '(11) 4000-3000',
                'email' => 'dmp@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Contratos',
                'sigla' => 'DC',
                'endereco' => 'Rua dos Contratos, 400 - Centro',
                'telefone' => '(11) 4000-4000',
                'email' => 'dc@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Almoxarifado',
                'sigla' => 'DA',
                'endereco' => 'Av. do Almoxarifado, 500 - Industrial',
                'telefone' => '(11) 4000-5000',
                'email' => 'da@compras.gov.br',
            ],
            [
                'nome' => 'Central de Compras',
                'sigla' => 'CC',
                'endereco' => 'Praça das Compras, 1 - Centro',
                'telefone' => '(11) 4000-6000',
                'email' => 'cc@compras.gov.br',
            ],
            [
                'nome' => 'Setor de Aquisições',
                'sigla' => 'SA',
                'endereco' => 'Rua das Aquisições, 600 - Administrativo',
                'telefone' => '(11) 4000-7000',
                'email' => 'sa@compras.gov.br',
            ],
            [
                'nome' => 'Coordenadoria de Compras',
                'sigla' => 'CCOMP',
                'endereco' => 'Av. da Coordenação, 700 - Centro',
                'telefone' => '(11) 4000-8000',
                'email' => 'ccomp@compras.gov.br',
            ],
            [
                'nome' => 'Divisão de Licitações',
                'sigla' => 'DL',
                'endereco' => 'Rua das Licitações, 800 - Administrativo',
                'telefone' => '(11) 4000-9000',
                'email' => 'dl@compras.gov.br',
            ],
            [
                'nome' => 'Núcleo de Compras Públicas',
                'sigla' => 'NCP',
                'endereco' => 'Av. das Compras Públicas, 900 - Governo',
                'telefone' => '(11) 4000-1100',
                'email' => 'ncp@compras.gov.br',
            ],
            [
                'nome' => 'Gerência de Suprimentos',
                'sigla' => 'GS',
                'endereco' => 'Rua da Gerência, 1000 - Centro',
                'telefone' => '(11) 4000-1200',
                'email' => 'gs@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Logística',
                'sigla' => 'DLOG',
                'endereco' => 'Av. da Logística, 1100 - Industrial',
                'telefone' => '(11) 4000-1300',
                'email' => 'dlog@compras.gov.br',
            ],
            [
                'nome' => 'Setor de Compras Emergenciais',
                'sigla' => 'SCE',
                'endereco' => 'Rua da Urgência, 1200 - Centro',
                'telefone' => '(11) 4000-1400',
                'email' => 'sce@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Controle de Qualidade',
                'sigla' => 'DCQ',
                'endereco' => 'Av. da Qualidade, 1300 - Industrial',
                'telefone' => '(11) 4000-1500',
                'email' => 'dcq@compras.gov.br',
            ],
            [
                'nome' => 'Coordenadoria de Pregões',
                'sigla' => 'CPG',
                'endereco' => 'Rua dos Pregões, 1400 - Administrativo',
                'telefone' => '(11) 4000-1600',
                'email' => 'cpg@compras.gov.br',
            ],
            [
                'nome' => 'Setor de Compras Diretas',
                'sigla' => 'SCD',
                'endereco' => 'Av. das Compras Diretas, 1500 - Centro',
                'telefone' => '(11) 4000-1700',
                'email' => 'scd@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Gestão de Contratos',
                'sigla' => 'DGC',
                'endereco' => 'Rua da Gestão, 1600 - Administrativo',
                'telefone' => '(11) 4000-1800',
                'email' => 'dgc@compras.gov.br',
            ],
            [
                'nome' => 'Núcleo de Compras Especializadas',
                'sigla' => 'NCE',
                'endereco' => 'Av. Especializada, 1700 - Técnico',
                'telefone' => '(11) 4000-1900',
                'email' => 'nce@compras.gov.br',
            ],
            [
                'nome' => 'Setor de Análise de Propostas',
                'sigla' => 'SAP',
                'endereco' => 'Rua das Análises, 1800 - Centro',
                'telefone' => '(11) 4000-2000',
                'email' => 'sap@compras.gov.br',
            ],
            [
                'nome' => 'Departamento de Compras Estratégicas',
                'sigla' => 'DCE',
                'endereco' => 'Av. Estratégica, 1900 - Planejamento',
                'telefone' => '(11) 4000-2100',
                'email' => 'dce@compras.gov.br',
            ],
        ];

        foreach ($destinatarios as $destinatario) {
            Destinatario::create($destinatario);
        }

        // Create a few additional random destinatarios using factory
        Destinatario::factory(5)->create();

        $this->command->info('Destinatários criados com sucesso!');
        $this->command->info('Total: ' . Destinatario::count() . ' destinatários');

        // Show some examples
        $this->command->info("\nExemplos de destinatários criados:");
        Destinatario::take(5)->get()->each(function ($destinatario) {
            $this->command->line("- {$destinatario->sigla}: {$destinatario->nome}");
        });
    }
}
