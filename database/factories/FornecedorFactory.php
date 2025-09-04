<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fornecedor>
 */
class FornecedorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cnpj = $this->generateCNPJ();

        return [
            'razao_social' => fake()->company(),
            'cnpj' => $cnpj,
            'telefone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'endereco' => fake()->streetAddress(),
            'cidade' => fake()->city(),
            'estado' => fake()->stateAbbr(),
            'cep' => fake()->postcode(),
            'contato' => fake()->name(),
            'status' => fake()->boolean(85), // 85% chance of being active
            'observacoes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Indicate that the fornecedor should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => false,
        ]);
    }

    /**
     * Indicate that the fornecedor should be active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => true,
        ]);
    }

    /**
     * Generate a valid CNPJ number.
     */
    private function generateCNPJ(): string
    {
        // Generate the first 12 digits
        $cnpj = '';
        for ($i = 0; $i < 12; $i++) {
            $cnpj .= fake()->numberBetween(0, 9);
        }

        // Calculate first verification digit
        $sum = 0;
        $multiplier = 5;
        for ($i = 0; $i < 12; $i++) {
            $sum += (int) $cnpj[$i] * $multiplier;
            $multiplier = ($multiplier == 2) ? 9 : $multiplier - 1;
        }
        $remainder = $sum % 11;
        $digit1 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cnpj .= $digit1;

        // Calculate second verification digit
        $sum = 0;
        $multiplier = 6;
        for ($i = 0; $i < 13; $i++) {
            $sum += (int) $cnpj[$i] * $multiplier;
            $multiplier = ($multiplier == 2) ? 9 : $multiplier - 1;
        }
        $remainder = $sum % 11;
        $digit2 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cnpj .= $digit2;

        // Format CNPJ with dots, slash and dash
        return substr($cnpj, 0, 2).'.'.
               substr($cnpj, 2, 3).'.'.
               substr($cnpj, 5, 3).'/'.
               substr($cnpj, 8, 4).'-'.
               substr($cnpj, 12, 2);
    }
}
