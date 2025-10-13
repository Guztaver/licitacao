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
        Schema::create('reposicoes_estoque', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->foreignId('estoque_id')->constrained();
            $table->enum('tipo_reposicao', [
                'automatica',     // Gerada automaticamente pelo sistema
                'manual',         // Solicitação manual
                'preventiva',     // Com base na previsão de demanda
                'emergencial',    // Reposição de emergência
            ]);
            $table->decimal('quantidade_sugerida', 15, 3);
            $table->decimal('quantidade_solicitada', 15, 3)->nullable();
            $table->decimal('quantidade_atendida', 15, 3)->default(0);
            $table->enum('prioridade', ['baixa', 'normal', 'alta', 'urgente'])->default('normal');
            $table->date('data_sugerida'); // Data sugerida para reposição
            $table->date('data_solicitacao')->nullable();
            $table->date('data_prevista_entrega')->nullable();
            $table->date('data_efetiva_entrega')->nullable();
            $table->foreignId('fornecedor_id')->nullable()->constrained();
            $table->enum('status', [
                'sugerida',       // Aguardando aprovação
                'aprovada',       // Aprovada e agendada
                'solicitada',     // Solicitada ao fornecedor
                'em_transito',    // Em trânsito
                'recebida_parcial', // Recebida parcialmente
                'recebida',       // Recebida completamente
                'cancelada',      // Cancelada
                'atrasada',       // Atrasada
            ])->default('sugerida');
            $table->decimal('valor_unitario_estimado', 15, 2)->nullable();
            $table->decimal('valor_total_estimado', 15, 2)->nullable();
            $table->foreignId('usuario_solicitante_id')->nullable()->constrained('users');
            $table->foreignId('usuario_aprovador_id')->nullable()->constrained('users');
            $table->timestamp('data_aprovacao')->nullable();
            $table->text('motivo')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->index(['item_id', 'status']);
            $table->index(['tipo_reposicao', 'status']);
            $table->index('data_sugerida');
            $table->index('prioridade');
            $table->index('fornecedor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reposicoes_estoque');
    }
};
