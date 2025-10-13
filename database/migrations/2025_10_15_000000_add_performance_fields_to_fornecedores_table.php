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
        Schema::table('fornecedores', function (Blueprint $table) {
            // Performance fields
            $table->decimal('classificacao_geral', 5, 2)->default(0); // 0-100 rating
            $table->integer('total_avaliacoes')->default(0);
            $table->decimal('media_atendimento', 5, 2)->nullable();
            $table->decimal('media_qualidade', 5, 2)->nullable();
            $table->decimal('media_prazo', 5, 2)->nullable();
            $table->decimal('media_preco', 5, 2)->nullable();

            // Business metrics
            $table->decimal('valor_total_contratos', 15, 2)->default(0);
            $table->integer('total_contratos')->default(0);
            $table->integer('total_entregas')->default(0);
            $table->integer('entregas_no_prazo')->default(0);
            $table->integer('entregas_atrasadas')->default(0);
            $table->decimal('percentual_cumprimento_prazo', 5, 2)->default(0);

            // Certification and compliance
            $table->json('certificacoes')->nullable(); // Array de certificações
            $table->string('nivel_certificacao')->nullable(); // bronze, prata, ouro, platinum
            $table->date('data_ultima_certificacao')->nullable();
            $table->date('data_proxima_recertificacao')->nullable();
            $table->boolean('possui_certificado_qualidade')->default(false);
            $table->string('numero_certificado_qualidade')->nullable();

            // Risk management
            $table->enum('nivel_risco', ['baixo', 'medio', 'alto', 'critico'])->default('medio');
            $table->integer('dias_medio_entrega')->default(0);
            $table->integer('dias_maximo_atraso')->default(0);
            $table->decimal('taxa_reprovacao', 5, 2)->default(0);

            // Financial information
            $table->decimal('faturamento_anual_estimado', 15, 2)->nullable();
            $table->integer('anos_atividade')->nullable();
            $table->integer('numero_funcionarios')->nullable();

            // Additional details
            $table->text('area_atuacao')->nullable();
            $table->json('produtos_servicos')->nullable(); // Array de produtos/serviços
            $table->json('segmentos_mercado')->nullable(); // Segmentos de mercado atendidos
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();

            // Status management
            $table->enum('status_fornecedor', [
                'ativo', 'inativo', 'em_analise', 'suspenso', 'bloqueado'
            ])->default('em_analise');
            $table->text('motivo_suspensao')->nullable();
            $table->date('data_ultima_avaliacao')->nullable();
            $table->date('data_proxima_avaliacao')->nullable();

            // Indexes
            $table->index('classificacao_geral');
            $table->index('nivel_risco');
            $table->index('status_fornecedor');
            $table->index('nivel_certificacao');
            $table->index(['possui_certificado_qualidade', 'status_fornecedor']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fornecedores', function (Blueprint $table) {
            $table->dropColumn([
                'classificacao_geral',
                'total_avaliacoes',
                'media_atendimento',
                'media_qualidade',
                'media_prazo',
                'media_preco',
                'valor_total_contratos',
                'total_contratos',
                'total_entregas',
                'entregas_no_prazo',
                'entregas_atrasadas',
                'percentual_cumprimento_prazo',
                'certificacoes',
                'nivel_certificacao',
                'data_ultima_certificacao',
                'data_proxima_recertificacao',
                'possui_certificado_qualidade',
                'numero_certificado_qualidade',
                'nivel_risco',
                'dias_medio_entrega',
                'dias_maximo_atraso',
                'taxa_reprovacao',
                'faturamento_anual_estimado',
                'anos_atividade',
                'numero_funcionarios',
                'area_atuacao',
                'produtos_servicos',
                'segmentos_mercado',
                'website',
                'linkedin',
                'status_fornecedor',
                'motivo_suspensao',
                'data_ultima_avaliacao',
                'data_proxima_avaliacao',
            ]);
        });
    }
};
