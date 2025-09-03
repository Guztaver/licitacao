<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Destinatario>
 */
class DestinatarioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departamentos = [
            ['nome' => 'Departamento de Compras e Licitações', 'sigla' => 'DCL'],
            ['nome' => 'Departamento de Suprimentos', 'sigla' => 'DS'],
            ['nome' => 'Departamento de Materiais e Patrimônio', 'sigla' => 'DMP'],
            ['nome' => 'Departamento de Contratos', 'sigla' => 'DC'],
            ['nome' => 'Departamento de Almoxarifado', 'sigla' => 'DA'],
            ['nome' => 'Central de Compras', 'sigla' => 'CC'],
            ['nome' => 'Setor de Aquisições', 'sigla' => 'SA'],
            ['nome' => 'Coordenadoria de Compras', 'sigla' => 'CCOMP'],
            ['nome' => 'Divisão de Licitações', 'sigla' => 'DL'],
            ['nome' => 'Núcleo de Compras Públicas', 'sigla' => 'NCP'],
            ['nome' => 'Gerência de Suprimentos', 'sigla' => 'GS'],
            ['nome' => 'Departamento de Logística', 'sigla' => 'DLOG'],
        ];

        $departamento = fake()->randomElement($departamentos);
        $randomSuffix = fake()->numberBetween(100, 999);

        return [
            'nome' => $departamento['nome'],
            'sigla' => $departamento['sigla'] . $randomSuffix,
            'endereco' => fake()->streetAddress() . ', ' . fake()->city() . ' - ' . fake()->stateAbbr(),
            'telefone' => fake()->phoneNumber(),
            'email' => strtolower($departamento['sigla'] . $randomSuffix) . '@compras.gov.br',
        ];
    }

    /**
     * Create a specific procurement department.
     */
    public function department(string $nome, string $sigla): static
    {
        return $this->state(fn (array $attributes) => [
            'nome' => $nome,
            'sigla' => $sigla,
            'email' => strtolower($sigla) . '@compras.gov.br',
        ]);
    }

    /**
     * Create main procurement department.
     */
    public function mainProcurement(): static
    {
        return $this->department('Departamento de Compras e Licitações', 'DCL');
    }

    /**
     * Create supplies department.
     */
    public function supplies(): static
    {
        return $this->department('Departamento de Suprimentos', 'DS');
    }

    /**
     * Create materials and patrimony department.
     */
    public function materialsAndPatrimony(): static
    {
        return $this->department('Departamento de Materiais e Patrimônio', 'DMP');
    }

    /**
     * Create contracts department.
     */
    public function contracts(): static
    {
        return $this->department('Departamento de Contratos', 'DC');
    }

    /**
     * Create warehouse department.
     */
    public function warehouse(): static
    {
        return $this->department('Departamento de Almoxarifado', 'DA');
    }
}
