<?php

namespace Database\Factories;

use App\Models\Fornecedor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PedidoManual>
 */
class PedidoManualFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $descricoes = [
            'Aquisição emergencial de material de limpeza para higienização das instalações',
            'Compra de equipamentos de informática para substituição de itens danificados',
            'Aquisição de medicamentos para reposição de estoque da farmácia básica',
            'Compra de material de escritório para atendimento das demandas administrativas',
            'Aquisição de combustível para abastecimento da frota municipal',
            'Compra de peças de reposição para manutenção de equipamentos',
            'Aquisição de material elétrico para reparos na rede elétrica municipal',
            'Compra de ferramentas para oficina de manutenção',
            'Aquisição de material de construção para reparos emergenciais',
            'Compra de equipamentos de segurança para proteção individual',
            'Aquisição de material gráfico para impressão de documentos oficiais',
            'Compra de alimentos para merenda escolar emergencial',
            'Aquisição de produtos químicos para tratamento de água',
            'Compra de uniformes para servidores municipais',
            'Aquisição de material hospitalar para unidades de saúde',
        ];

        return [
            'fornecedor_id' => Fornecedor::factory(),
            'descricao' => fake()->randomElement($descricoes),
            'valor' => fake()->randomFloat(2, 500, 25000),
            'data_pedido' => fake()->dateTimeBetween('-6 months', 'now'),
            'numero_pedido' => fake()->optional(0.8)->numerify('PM-####/####'),
            'observacoes' => fake()->optional(0.4)->sentence(),
        ];
    }

    /**
     * Indicate that the pedido manual should have a high value.
     */
    public function highValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'valor' => fake()->randomFloat(2, 15000, 50000),
        ]);
    }

    /**
     * Indicate that the pedido manual should have a low value.
     */
    public function lowValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'valor' => fake()->randomFloat(2, 100, 2000),
        ]);
    }

    /**
     * Indicate that the pedido manual should be recent.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'data_pedido' => fake()->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Indicate that the pedido manual should be old.
     */
    public function old(): static
    {
        return $this->state(fn (array $attributes) => [
            'data_pedido' => fake()->dateTimeBetween('-2 years', '-6 months'),
        ]);
    }

    /**
     * Indicate that the pedido manual should have observations.
     */
    public function withObservations(): static
    {
        return $this->state(fn (array $attributes) => [
            'observacoes' => fake()->paragraph(),
        ]);
    }

    /**
     * Indicate that the pedido manual should have a specific order number.
     */
    public function withOrderNumber(): static
    {
        return $this->state(fn (array $attributes) => [
            'numero_pedido' => 'PM-' . fake()->numerify('####') . '/' . fake()->year(),
        ]);
    }

    /**
     * Create a cleaning supplies order.
     */
    public function cleaningSupplies(): static
    {
        return $this->state(fn (array $attributes) => [
            'descricao' => 'Aquisição de material de limpeza e higienização incluindo detergente, desinfetante, sabão em pó, papel higiênico e demais produtos de limpeza',
            'valor' => fake()->randomFloat(2, 1000, 5000),
        ]);
    }

    /**
     * Create an office supplies order.
     */
    public function officeSupplies(): static
    {
        return $this->state(fn (array $attributes) => [
            'descricao' => 'Aquisição de material de escritório incluindo papel A4, canetas, lápis, grampeadores, pastas e demais itens administrativos',
            'valor' => fake()->randomFloat(2, 800, 3000),
        ]);
    }

    /**
     * Create an IT equipment order.
     */
    public function itEquipment(): static
    {
        return $this->state(fn (array $attributes) => [
            'descricao' => 'Aquisição de equipamentos de informática incluindo computadores, impressoras, mouses, teclados e demais equipamentos tecnológicos',
            'valor' => fake()->randomFloat(2, 5000, 30000),
        ]);
    }

    /**
     * Create a medical supplies order.
     */
    public function medicalSupplies(): static
    {
        return $this->state(fn (array $attributes) => [
            'descricao' => 'Aquisição de material médico-hospitalar incluindo seringas, luvas, máscaras, medicamentos básicos e demais insumos de saúde',
            'valor' => fake()->randomFloat(2, 2000, 15000),
        ]);
    }

    /**
     * Create a fuel order.
     */
    public function fuel(): static
    {
        return $this->state(fn (array $attributes) => [
            'descricao' => 'Aquisição de combustível (gasolina, diesel e etanol) para abastecimento da frota municipal de veículos e equipamentos',
            'valor' => fake()->randomFloat(2, 3000, 20000),
        ]);
    }
}
