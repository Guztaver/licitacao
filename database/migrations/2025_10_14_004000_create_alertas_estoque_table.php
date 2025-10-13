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
        Schema::create('alertas_estoque', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->foreignId('estoque_id')->constrained();
            $table->enum('tipo_alerta', [
                'estoque_baixo',          // Estoque abaixo do mínimo
                'estoque_zerado',         // Estoque zerado
                'estoque_excedente',      // Estoque acima do máximo
                'validade_proxima',       // Produto próximo da validade
                'validade_vencida',       // Produto vencido
                'lote_obsoleto',          // Lote obsoleto/sem movimentação
                'reposicao_atrasada',     // Reposição atrasada
                'movimentacao_anormal',   // Movimentação fora do padrão
                'qualidade',              // Problema de qualidade
            ]);
            $table->enum('nivel criticidade', ['baixa', 'media', 'alta', 'critica'])->default('media');
            $table->string('titulo');
            $table->text('mensagem');
            $table->json('dados_adicionais')->nullable(); // Dados complementares do alerta
            $table->boolean('ativo')->default(true);
            $table->boolean('lida')->default(false);
            $table->timestamp('data_alerta');
            $table->timestamp('data_leitura')->nullable();
            $table->foreignId('usuario_leitura_id')->nullable()->constrained('users');
            $table->foreignId('usuario_resolucao_id')->nullable()->constrained('users');
            $table->timestamp('data_resolucao')->nullable();
            $table->text('resolucao')->nullable();
            $table->enum('status', [
                'aberto',                // Alerta aberto, não tratado
                'em_analise',            // Em análise pelo responsável
                'resolvido',             // Resolvido
                'ignorado',              // Ignorado/justificado
            ])->default('aberto');
            $table->timestamps();

            $table->index(['item_id', 'tipo_alerta', 'status']);
            $table->index(['nivel criticidade', 'status']);
            $table->index(['ativo', 'lida']);
            $table->index('data_alerta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alertas_estoque');
    }
};
