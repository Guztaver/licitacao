<?php

namespace Database\Factories;

use App\Models\Fornecedor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conferencia>
 */
class ConferenciaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $periodoInicio = fake()->dateTimeBetween('-1 year', '-1 month');
        $periodoFim = fake()->dateTimeBetween($periodoInicio, 'now');

        $totalRequisicoes = fake()->randomFloat(2, 5000, 100000);
        $totalPedidosManuais = fake()->randomFloat(2, 2000, 50000);
        $totalGeral = $totalRequisicoes + $totalPedidosManuais;

        $status = fake()->randomElement(['em_andamento', 'finalizada']);

        $attributes = [
            'fornecedor_id' => Fornecedor::factory(),
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
            'total_requisicoes' => $totalRequisicoes,
            'total_pedidos_manuais' => $totalPedidosManuais,
            'total_geral' => $totalGeral,
            'status' => $status,
            'usuario_criacao_id' => User::factory(),
            'observacoes' => fake()->optional(0.3)->sentence(),
        ];

        // Add finalization data if status is 'finalizada'
        if ($status === 'finalizada') {
            $attributes['data_finalizacao'] = fake()->dateTimeBetween($periodoFim, 'now');
            $attributes['usuario_finalizacao_id'] = User::factory();
        }

        return $attributes;
    }

    /**
     * Indicate that the conferencia should be in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'em_andamento',
            'data_finalizacao' => null,
            'usuario_finalizacao_id' => null,
        ]);
    }

    /**
     * Indicate that the conferencia should be finalized.
     */
    public function finalized(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'finalizada',
            'data_finalizacao' => fake()->dateTimeBetween($attributes['periodo_fim'] ?? '-1 month', 'now'),
            'usuario_finalizacao_id' => User::factory(),
        ]);
    }

    /**
     * Indicate that the conferencia should have high values.
     */
    public function highValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_requisicoes' => fake()->randomFloat(2, 50000, 200000),
            'total_pedidos_manuais' => fake()->randomFloat(2, 20000, 80000),
        ])->afterMaking(function ($conferencia) {
            $conferencia->total_geral = $conferencia->total_requisicoes + $conferencia->total_pedidos_manuais;
        });
    }

    /**
     * Indicate that the conferencia should have low values.
     */
    public function lowValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_requisicoes' => fake()->randomFloat(2, 1000, 10000),
            'total_pedidos_manuais' => fake()->randomFloat(2, 500, 5000),
        ])->afterMaking(function ($conferencia) {
            $conferencia->total_geral = $conferencia->total_requisicoes + $conferencia->total_pedidos_manuais;
        });
    }

    /**
     * Indicate that the conferencia should be recent.
     */
    public function recent(): static
    {
        $periodoInicio = fake()->dateTimeBetween('-3 months', '-1 month');
        $periodoFim = fake()->dateTimeBetween($periodoInicio, 'now');

        return $this->state(fn (array $attributes) => [
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
        ]);
    }

    /**
     * Indicate that the conferencia should be old.
     */
    public function old(): static
    {
        $periodoInicio = fake()->dateTimeBetween('-2 years', '-6 months');
        $periodoFim = fake()->dateTimeBetween($periodoInicio, '-3 months');

        return $this->state(fn (array $attributes) => [
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
        ]);
    }

    /**
     * Indicate that the conferencia should have observations.
     */
    public function withObservations(): static
    {
        return $this->state(fn (array $attributes) => [
            'observacoes' => fake()->paragraph(),
        ]);
    }

    /**
     * Create a monthly conference.
     */
    public function monthly(): static
    {
        $month = fake()->numberBetween(1, 12);
        $year = fake()->numberBetween(2023, 2024);
        $periodoInicio = fake()->dateTimeBetween("$year-$month-01", "$year-$month-01");
        $periodoFim = fake()->dateTimeBetween($periodoInicio, $periodoInicio->format('Y-m-t'));

        return $this->state(fn (array $attributes) => [
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
        ]);
    }

    /**
     * Create a quarterly conference.
     */
    public function quarterly(): static
    {
        $quarter = fake()->numberBetween(1, 4);
        $year = fake()->numberBetween(2023, 2024);

        $startMonth = ($quarter - 1) * 3 + 1;
        $endMonth = $quarter * 3;

        $periodoInicio = fake()->dateTimeBetween("$year-$startMonth-01", "$year-$startMonth-01");
        $periodoFim = fake()->dateTimeBetween("$year-$endMonth-01", "$year-$endMonth-31");

        return $this->state(fn (array $attributes) => [
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
        ]);
    }

    /**
     * Create an annual conference.
     */
    public function annual(): static
    {
        $year = fake()->numberBetween(2022, 2024);
        $periodoInicio = fake()->dateTimeBetween("$year-01-01", "$year-01-31");
        $periodoFim = fake()->dateTimeBetween("$year-11-01", "$year-12-31");

        return $this->state(fn (array $attributes) => [
            'periodo_inicio' => $periodoInicio,
            'periodo_fim' => $periodoFim,
        ]);
    }
}
