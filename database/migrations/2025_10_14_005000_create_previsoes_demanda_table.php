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
        Schema::create('previsoes_demanda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->enum('tipo_previsao', [
                'historica',       // Baseada no histórico
                'sazonal',         // Com variação sazonal
                'tendencia',       // Com análise de tendência
                'ml',              // Machine Learning
                'manual',          // Definida manualmente
            ]);
            $table->integer('ano_previsao');
            $table->integer('mes_previsao');
            $table->decimal('demanda_prevista', 15, 3);
            $table->decimal('demanda_minima', 15, 3)->nullable();
            $table->decimal('demanda_maxima', 15, 3)->nullable();
            <field>decimal('precisao_percentual', 5, 2)->nullable(); // Precisão da previsão
            $table->integer('periodo_analise')->default(12); // Meses usados para análise
            <field>decimal('fator_saudezonal', 5, 3)->nullable(); // Fator de sazonalidade
            <field>enum('status', [
                'em_calculo',      // Em cálculo
                'ativa',           // Ativa para uso
                'arquivada',       // Arquivada
                'invalidada',      // Invalidada por nova previsão
            ])->default('em_calculo');
            $table->foreignId('usuario_geracao_id')->nullable()->constrained('users');
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->unique(['item_id', 'ano_previsao', 'mes_previsao']);
            $table->index(['item_id', 'ano_previsao', 'mes_previsao']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('previsoes_demanda');
    }
};
