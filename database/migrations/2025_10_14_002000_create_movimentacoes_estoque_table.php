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
        Schema::create('movimentacoes_estoque', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estoque_id')->constrained();
            $table->foreignId('item_id')->constrained();
            $table->enum('tipo_movimentacao', [
                'entrada',         // Entrada de material
                'saida',           // Saída de material
                'transferencia',   // Transferência entre localizações
                'ajuste',          // Ajuste de inventário
                'perda',           // Perda/dano
                'devolucao',       // Devolução de fornecedor
                'reserva',         // Reserva para requisição
                'baixa_reserva',   // Baixa de reserva
            ]);
            $table->decimal('quantidade', 15, 3); // Quantidade movimentada (positiva ou negativa)
            $table->decimal('saldo_anterior', 15, 3); // Saldo antes da movimentação
            $table->decimal('saldo_posterior', 15, 3); // Saldo após a movimentação
            $table->string('documento_origem')->nullable(); // NF, Requisição, etc.
            $table->string('documento_tipo')->nullable(); // Tipo do documento
            $table->string('numero_lote')->nullable(); // Número do lote (se aplicável)
            $table->foreignId('localizacao_origem_id')->nullable()->constrained('localizacoes');
            $table->foreignId('localizacao_destino_id')->nullable()->constrained('localizacoes');
            $table->foreignId('usuario_id')->constrained();
            $table->text('motivo')->nullable();
            $table->timestamp('data_movimentacao');
            $table->enum('status', ['pendente', 'confirmada', 'cancelada'])->default('confirmada');
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->index(['estoque_id', 'tipo_movimentacao']);
            $table->index(['item_id', 'data_movimentacao']);
            $table->index(['tipo_movimentacao', 'status']);
            $table->index('usuario_id');
            $table->index('data_movimentacao');
            $table->index('documento_origem');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimentacoes_estoque');
    }
};
