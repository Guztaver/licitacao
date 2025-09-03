<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Emitente>
 */
class EmitenteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $orgaos = [
            ['nome' => 'Secretaria Municipal de Educação', 'sigla' => 'SME'],
            ['nome' => 'Secretaria Municipal de Saúde', 'sigla' => 'SMS'],
            ['nome' => 'Secretaria Municipal de Obras', 'sigla' => 'SMO'],
            ['nome' => 'Secretaria Municipal de Administração', 'sigla' => 'SMA'],
            ['nome' => 'Secretaria Municipal de Finanças', 'sigla' => 'SMF'],
            ['nome' => 'Secretaria Municipal de Planejamento', 'sigla' => 'SMP'],
            ['nome' => 'Secretaria Municipal de Transporte', 'sigla' => 'SMT'],
            ['nome' => 'Secretaria Municipal de Cultura', 'sigla' => 'SMC'],
            ['nome' => 'Secretaria Municipal de Esporte', 'sigla' => 'SMES'],
            ['nome' => 'Secretaria Municipal de Meio Ambiente', 'sigla' => 'SMMA'],
            ['nome' => 'Fundação Municipal de Assistência Social', 'sigla' => 'FMAS'],
            ['nome' => 'Instituto de Previdência Municipal', 'sigla' => 'IPM'],
            ['nome' => 'Câmara Municipal', 'sigla' => 'CM'],
            ['nome' => 'Autarquia Municipal de Água e Esgoto', 'sigla' => 'AMAE'],
            ['nome' => 'Companhia de Desenvolvimento Urbano', 'sigla' => 'CDU'],
        ];

        $orgao = fake()->randomElement($orgaos);
        $randomSuffix = fake()->numberBetween(100, 999);

        return [
            'nome' => $orgao['nome'],
            'sigla' => $orgao['sigla'] . $randomSuffix,
            'endereco' => fake()->streetAddress() . ', ' . fake()->city() . ' - ' . fake()->stateAbbr(),
            'telefone' => fake()->phoneNumber(),
            'email' => strtolower($orgao['sigla'] . $randomSuffix) . '@prefeitura.gov.br',
        ];
    }

    /**
     * Create a specific government department.
     */
    public function department(string $nome, string $sigla): static
    {
        return $this->state(fn (array $attributes) => [
            'nome' => $nome,
            'sigla' => $sigla,
            'email' => strtolower($sigla) . '@prefeitura.gov.br',
        ]);
    }

    /**
     * Create education department.
     */
    public function education(): static
    {
        return $this->department('Secretaria Municipal de Educação', 'SME');
    }

    /**
     * Create health department.
     */
    public function health(): static
    {
        return $this->department('Secretaria Municipal de Saúde', 'SMS');
    }

    /**
     * Create public works department.
     */
    public function publicWorks(): static
    {
        return $this->department('Secretaria Municipal de Obras', 'SMO');
    }

    /**
     * Create administration department.
     */
    public function administration(): static
    {
        return $this->department('Secretaria Municipal de Administração', 'SMA');
    }
}
