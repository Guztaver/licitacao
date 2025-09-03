<?php

namespace Database\Factories;

use App\Models\Emitente;
use App\Models\Destinatario;
use App\Models\Fornecedor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Requisicao>
 */
class RequisicaoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numero = fake()->numberBetween(1, 9999);
        $year = fake()->dateTimeBetween('-2 years', 'now')->format('Y');
        $numeroCompleto = sprintf('%04d/%s', $numero, $year);

        $status = fake()->randomElement(['autorizada', 'concretizada', 'cancelada']);
        $dataRecebimento = fake()->dateTimeBetween('-1 year', 'now');

        $descricoes = [
            'Aquisição de material de escritório para atendimento das necessidades administrativas',
            'Contratação de serviços de manutenção preventiva e corretiva de equipamentos',
            'Aquisição de material de limpeza para manutenção das instalações públicas',
            'Contratação de serviços de impressão gráfica para materiais institucionais',
            'Aquisição de equipamentos de informática para modernização do parque tecnológico',
            'Contratação de serviços de segurança patrimonial para proteção das instalações',
            'Aquisição de medicamentos para abastecimento da rede básica de saúde',
            'Contratação de serviços de transporte escolar para atendimento aos estudantes',
            'Aquisição de material pedagógico para apoio às atividades educacionais',
            'Contratação de serviços de limpeza urbana e coleta de resíduos sólidos',
            'Aquisição de combustível para abastecimento da frota municipal',
            'Contratação de serviços de manutenção de vias públicas e pavimentação',
        ];

        $solicitantes = [
            'João Silva Santos',
            'Maria Oliveira Costa',
            'Pedro Almeida Ferreira',
            'Ana Paula Rodrigues',
            'Carlos Eduardo Lima',
            'Fernanda Souza Martins',
            'Roberto Carlos Pereira',
            'Juliana Mendes Barbosa',
            'Antonio José Nascimento',
            'Luciana Fernandes Gomes',
            'Ricardo Machado Oliveira',
            'Patrícia Alves Ribeiro',
        ];

        $attributes = [
            'numero' => (string)$numero,
            'numero_completo' => $numeroCompleto,
            'emitente_id' => Emitente::factory(),
            'destinatario_id' => Destinatario::factory(),
            'solicitante' => fake()->randomElement($solicitantes),
            'numero_oficio' => fake()->optional(0.7)->numerify('OF-###/####'),
            'data_recebimento' => $dataRecebimento,
            'descricao' => fake()->randomElement($descricoes),
            'fornecedor_id' => fake()->optional(0.6)->randomElement([
                fn() => Fornecedor::factory(),
                null
            ]),
            'anexo' => fake()->optional(0.3)->word() . '.pdf',
            'status' => $status,
            'usuario_criacao_id' => User::factory(),
        ];

        // Add status-specific attributes
        if ($status === 'concretizada') {
            $attributes['numero_pedido_real'] = fake()->numerify('PED-####/####');
            $attributes['valor_final'] = fake()->randomFloat(2, 1000, 50000);
            $attributes['data_concretizacao'] = fake()->dateTimeBetween($dataRecebimento, 'now');
            $attributes['usuario_concretizacao_id'] = User::factory();
        }

        if ($status === 'cancelada' || $status === 'excluida') {
            $attributes['data_exclusao'] = fake()->dateTimeBetween($dataRecebimento, 'now');
            $attributes['usuario_exclusao_id'] = User::factory();
            $attributes['motivo_exclusao'] = fake()->randomElement([
                'Cancelamento solicitado pelo órgão emissor',
                'Verba insuficiente para execução',
                'Alteração de prioridades orçamentárias',
                'Processo licitatório fracassado',
                'Mudança de especificações técnicas',
                'Urgência superada',
            ]);
        }

        return $attributes;
    }

    /**
     * Indicate that the requisição should be authorized.
     */
    public function authorized(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'autorizada',
            'numero_pedido_real' => null,
            'valor_final' => null,
            'data_concretizacao' => null,
            'usuario_concretizacao_id' => null,
            'data_exclusao' => null,
            'usuario_exclusao_id' => null,
            'motivo_exclusao' => null,
        ]);
    }

    /**
     * Indicate that the requisição should be completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'concretizada',
            'numero_pedido_real' => fake()->numerify('PED-####/####'),
            'valor_final' => fake()->randomFloat(2, 1000, 50000),
            'data_concretizacao' => fake()->dateTimeBetween($attributes['data_recebimento'] ?? '-1 month', 'now'),
            'usuario_concretizacao_id' => User::factory(),
            'data_exclusao' => null,
            'usuario_exclusao_id' => null,
            'motivo_exclusao' => null,
        ]);
    }

    /**
     * Indicate that the requisição should be cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelada',
            'numero_pedido_real' => null,
            'valor_final' => null,
            'data_concretizacao' => null,
            'usuario_concretizacao_id' => null,
            'data_exclusao' => fake()->dateTimeBetween($attributes['data_recebimento'] ?? '-1 month', 'now'),
            'usuario_exclusao_id' => User::factory(),
            'motivo_exclusao' => fake()->randomElement([
                'Cancelamento solicitado pelo órgão emissor',
                'Verba insuficiente para execução',
                'Alteração de prioridades orçamentárias',
                'Processo licitatório fracassado',
            ]),
        ]);
    }

    /**
     * Indicate that the requisição should be deleted.
     */
    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'excluida',
            'numero_pedido_real' => null,
            'valor_final' => null,
            'data_concretizacao' => null,
            'usuario_concretizacao_id' => null,
            'data_exclusao' => fake()->dateTimeBetween($attributes['data_recebimento'] ?? '-1 month', 'now'),
            'usuario_exclusao_id' => User::factory(),
            'motivo_exclusao' => fake()->randomElement([
                'Erro na criação da requisição',
                'Duplicata identificada',
                'Informações incorretas',
                'Solicitação indevida',
            ]),
        ]);
    }

    /**
     * Indicate that the requisição should have a supplier.
     */
    public function withSupplier(): static
    {
        return $this->state(fn (array $attributes) => [
            'fornecedor_id' => Fornecedor::factory(),
        ]);
    }

    /**
     * Indicate that the requisição should have an attachment.
     */
    public function withAttachment(): static
    {
        return $this->state(fn (array $attributes) => [
            'anexo' => fake()->word() . '.pdf',
        ]);
    }

    /**
     * Indicate that the requisição should be recent (last 30 days).
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'data_recebimento' => fake()->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Indicate that the requisição should be old (more than 6 months).
     */
    public function old(): static
    {
        return $this->state(fn (array $attributes) => [
            'data_recebimento' => fake()->dateTimeBetween('-2 years', '-6 months'),
        ]);
    }
}
