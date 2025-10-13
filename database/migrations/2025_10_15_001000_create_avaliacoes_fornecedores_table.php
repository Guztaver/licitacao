<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('avaliacoes_fornecedores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained();
            $table->foreignId('contrato_id')->nullable()->constrained();
            $table->foreignId('requisicao_id')->nullable()->constrained();
            $table->foreignId('avaliador_id')->constrained('users');

            // Evaluation details
            $table->enum('tipo_avaliacao', [
                'contrato',          // Avaliação de contrato
                'entrega',           // Avaliação de entrega específica
                'periodica',         // Avaliação periódica
                'qualificacao',      // Avaliação de qualificação
                'reavaliacao',       // Reavaliação periódica
                'emergencial',       // Avaliação em caso de problema
            ]);

            // Criteria ratings (1-5 scale)
            $table->decimal('nota_qualidade', 3, 1); // Qualidade dos produtos/serviços
            $table->decimal('nota_prazo', 3, 1);     // Cumprimento de prazos
            $table->decimal('nota_atendimento', 3, 1); // Atendimento ao cliente
            $table->decimal('nota_preco', 3, 1);      // Competitividade de preço
            $table->decimal('nota_comunicacao', 3, 1); // Clareza na comunicação
            $table->decimal('nota_flexibilidade', 3, 1); // Flexibilidade para mudanças
            $table->decimal('nota_documentacao', 3, 1); // Qualidade da documentação

            // Overall score and recommendation
            $table->decimal('nota_geral', 5, 2);       // Weighted average
            $table->enum('recomendacao', [
                'recomendado',      // Recomendado sem restrições
                'recomendado_reserva', // Recomendado com ressalvas
                'nao_recomendado',  // Não recomendado
                'avaliar_novamente', // Requer nova avaliação
            ]);

            // Period evaluated
            $table->date('data_inicio_avaliacao');
            $table->date('data_fim_avaliacao');
            $table->date('data_avaliacao');

            // Evaluation context
            $table->text('descricao_servico')->nullable(); // Serviço/produto avaliado
            $table->decimal('valor_contrato', 15, 2)->nullable(); // Valor do contrato/entrega
            $table->string('documento_referencia')->nullable(); // Contrato, NF, etc.

            // Comments and feedback
            $table->text('pontos_positivos')->nullable();
            $table->text('pontos_negativos')->nullable();
            $table->text('sugestoes_melhoria')->nullable();
            $table->text('observacoes')->nullable();

            // Follow-up actions
            $table->json('acoes_corretivas')->nullable(); // Ações corretivas sugeridas
            $table->date('data_seguimento')->nullable(); // Data para seguimento
            $table->boolean('requer_acao_corretiva')->default(false);
            $table->enum('status_acoes', [
                'pendente',
                'em_andamento',
                'concluida',
                'nao_aplicavel'
            ])->default('nao_aplicavel');

            // Approval workflow
            $table->foreignId('aprovador_id')->nullable()->constrained('users');
            $table->timestamp('data_aprovacao')->nullable();
            $table->enum('status_aprovacao', [
                'rascunho',
                'aguardando_aprovacao',
                'aprovada',
                'rejeitada',
                'cancelada'
            ])->default('rascunho');

            $table->timestamps();

            // Indexes
            $table->index(['fornecedor_id', 'data_avaliacao']);
            $table->index(['avaliador_id', 'data_avaliacao']);
            $table->index('tipo_avaliacao');
            $table->index('nota_geral');
            $table->index('recomendacao');
            $table->index('status_aprovacao');
            $table->index(['requer_acao_corretiva', 'status_acoes']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliacoes_fornecedores');
    }
};
