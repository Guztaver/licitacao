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
        Schema::create('desempenho_fornecedores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained();

            // Period reference
            $table->integer('ano');
            $table->integer('mes'); // 0 para anual

            // Delivery performance metrics
            $table->integer('total_entregas')->default(0);
            $table->integer('entregas_no_prazo')->default(0);
            $table->integer('entregas_adiantadas')->default(0);
            $table->integer('entregas_atrasadas')->default(0);
            $table->integer('entregas_canceladas')->default(0);
            $table->integer('entregas_rejeitadas')->default(0);

            // Delivery time metrics
            $table->integer('dias_medio_entrega')->default(0);
            $table->integer('dias_minimo_entrega')->nullable();
            $table->integer('dias_maximo_entrega')->nullable();
            $table->integer('total_dias_atraso')->default(0);
            $table->integer('total_dias_adianto')->default(0);

            // Quality metrics
            $table->integer('total_itens_entregues')->default(0);
            $table->integer('itens_conformes')->default(0);
            $table->integer('itens_nao_conformes')->default(0);
            $table->decimal('percentual_conformidade', 5, 2)->default(0);
            $table->integer('devolucoes_cliente')->default(0);
            $table->integer('retrabalhos_internos')->default(0);

            // Financial performance
            $table->decimal('valor_total_faturado', 15, 2)->default(0);
            $table->decimal('valor_medio_contrato', 15, 2)->default(0);
            $table->decimal('valor_descontos_concedidos', 15, 2)->default(0);
            $table->decimal('valor_multas_atraso', 15, 2)->default(0);
            $table->decimal('valor_garantias', 15, 2)->default(0);

            // Contract performance
            $table->integer('total_contratos_periodo')->default(0);
            $table->integer('contratos_ativos')->default(0);
            $table->integer('contratos_encerrados')->default(0);
            $table->integer('contratos_renovados')->default(0);
            $table->integer('contratos_cancelados')->default(0);

            // Communication and service
            $table->integer('total_reclamacoes')->default(0);
            $table->integer('reclamacoes_resolvidas')->default(0);
            $table->integer('reclamacoes_pendentes')->default(0);
            $table->decimal('tempo_medio_resposta_cl', 5, 2)->default(0); // horas
            $table->integer('visitas_tecnicas')->default(0);

            // Compliance and certification
            $table->boolean('possui_nao_conformidades')->default(false);
            $table->integer('nao_conformidades')->default(0);
            $table->integer('nao_conformidades_resolvidas')->default(0);
            $table->boolean('certificacoes_atualizadas')->default(false);
            $table->date('data_ultima_auditoria')->nullable();

            // Calculated KPIs
            $table->decimal('indice_desempenho_geral', 5, 2)->default(0); // 0-100
            $table->decimal('indice_confianca', 5, 2)->default(0); // 0-100
            $table->decimal('rentabilidade_media', 5, 2)->nullable(); // percentual
            $table->enum('nivel_desempenho', [
                'excelente',    // 90-100
                'bom',         // 75-89
                'regular',     // 60-74
                'ruim',        // 40-59
                'critico'      // <40
            ])->nullable();

            // Comparison with previous period
            $table->decimal('variacao_desempenho', 5, 2)->nullable(); // percentual vs período anterior
            $table->decimal('variacao_entregas', 5, 2)->nullable(); // percentual vs período anterior
            $table->decimal('variacao_valor', 5, 2)->nullable(); // percentual vs período anterior

            $table->timestamps();

            // Indexes and constraints
            $table->unique(['fornecedor_id', 'ano', 'mes']);
            $table->index(['fornecedor_id', 'ano', 'mes']);
            $table->index('indice_desempenho_geral');
            $table->index('nivel_desempenho');
            $table->index('ano');
            $table->index('mes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desempenho_fornecedores');
    }
};
