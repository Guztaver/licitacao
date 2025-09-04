<?php

namespace Database\Seeders;

use App\Models\Emitente;
use Illuminate\Database\Seeder;

class EmitenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific government departments and entities
        $emitentes = [
            [
                'nome' => 'Secretaria Municipal de Educação',
                'sigla' => 'SME',
                'endereco' => 'Rua da Educação, 100 - Centro',
                'telefone' => '(11) 3000-1000',
                'email' => 'sme@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Saúde',
                'sigla' => 'SMS',
                'endereco' => 'Av. da Saúde, 200 - Centro',
                'telefone' => '(11) 3000-2000',
                'email' => 'sms@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Obras',
                'sigla' => 'SMO',
                'endereco' => 'Rua das Obras, 300 - Industrial',
                'telefone' => '(11) 3000-3000',
                'email' => 'smo@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Administração',
                'sigla' => 'SMA',
                'endereco' => 'Praça da Administração, 1 - Centro',
                'telefone' => '(11) 3000-4000',
                'email' => 'sma@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Finanças',
                'sigla' => 'SMF',
                'endereco' => 'Av. das Finanças, 400 - Centro',
                'telefone' => '(11) 3000-5000',
                'email' => 'smf@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Planejamento',
                'sigla' => 'SMP',
                'endereco' => 'Rua do Planejamento, 500 - Centro',
                'telefone' => '(11) 3000-6000',
                'email' => 'smp@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Transporte',
                'sigla' => 'SMT',
                'endereco' => 'Av. dos Transportes, 600 - Rodoviário',
                'telefone' => '(11) 3000-7000',
                'email' => 'smt@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Cultura',
                'sigla' => 'SMC',
                'endereco' => 'Rua da Cultura, 700 - Centro Histórico',
                'telefone' => '(11) 3000-8000',
                'email' => 'smc@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Esporte e Lazer',
                'sigla' => 'SMEL',
                'endereco' => 'Av. do Esporte, 800 - Vila Olímpica',
                'telefone' => '(11) 3000-9000',
                'email' => 'smel@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Meio Ambiente',
                'sigla' => 'SMMA',
                'endereco' => 'Rua Verde, 900 - Parque Ecológico',
                'telefone' => '(11) 3000-1100',
                'email' => 'smma@prefeitura.gov.br',
            ],
            [
                'nome' => 'Fundação Municipal de Assistência Social',
                'sigla' => 'FMAS',
                'endereco' => 'Av. da Solidariedade, 1000 - Social',
                'telefone' => '(11) 3000-1200',
                'email' => 'fmas@prefeitura.gov.br',
            ],
            [
                'nome' => 'Instituto de Previdência Municipal',
                'sigla' => 'IPM',
                'endereco' => 'Rua da Previdência, 1100 - Centro',
                'telefone' => '(11) 3000-1300',
                'email' => 'ipm@prefeitura.gov.br',
            ],
            [
                'nome' => 'Câmara Municipal',
                'sigla' => 'CM',
                'endereco' => 'Praça da Democracia, s/n - Centro',
                'telefone' => '(11) 3000-1400',
                'email' => 'cm@camaramunicipal.gov.br',
            ],
            [
                'nome' => 'Autarquia Municipal de Água e Esgoto',
                'sigla' => 'AMAE',
                'endereco' => 'Av. das Águas, 1200 - Industrial',
                'telefone' => '(11) 3000-1500',
                'email' => 'amae@aguaesgoto.gov.br',
            ],
            [
                'nome' => 'Companhia de Desenvolvimento Urbano',
                'sigla' => 'CDU',
                'endereco' => 'Rua do Desenvolvimento, 1300 - Novo Centro',
                'telefone' => '(11) 3000-1600',
                'email' => 'cdu@desenvolvimento.gov.br',
            ],
            [
                'nome' => 'Guarda Municipal',
                'sigla' => 'GM',
                'endereco' => 'Av. da Segurança, 1400 - Centro',
                'telefone' => '(11) 3000-1700',
                'email' => 'gm@guardamunicipal.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Habitação',
                'sigla' => 'SMH',
                'endereco' => 'Rua da Moradia, 1500 - Popular',
                'telefone' => '(11) 3000-1800',
                'email' => 'smh@prefeitura.gov.br',
            ],
            [
                'nome' => 'Secretaria Municipal de Turismo',
                'sigla' => 'SMTUR',
                'endereco' => 'Av. Turística, 1600 - Centro Histórico',
                'telefone' => '(11) 3000-1900',
                'email' => 'smtur@prefeitura.gov.br',
            ],
            [
                'nome' => 'Departamento Municipal de Trânsito',
                'sigla' => 'DMT',
                'endereco' => 'Rua do Trânsito, 1700 - Centro',
                'telefone' => '(11) 3000-2000',
                'email' => 'dmt@transito.gov.br',
            ],
            [
                'nome' => 'Hospital Municipal Central',
                'sigla' => 'HMC',
                'endereco' => 'Av. da Saúde, 1800 - Hospital',
                'telefone' => '(11) 3000-2100',
                'email' => 'hmc@saude.gov.br',
            ],
        ];

        foreach ($emitentes as $emitente) {
            Emitente::create($emitente);
        }

        // Create a few additional random emitentes using factory
        Emitente::factory(5)->create();

        $this->command->info('Emitentes criados com sucesso!');
        $this->command->info('Total: '.Emitente::count().' emitentes');

        // Show some examples
        $this->command->info("\nExemplos de emitentes criados:");
        Emitente::take(5)->get()->each(function ($emitente) {
            $this->command->line("- {$emitente->sigla}: {$emitente->nome}");
        });
    }
}
