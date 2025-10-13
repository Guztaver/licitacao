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
        Schema::create('pedidos_compras', function (Blueprint $table) {
            $table->id();
            $table->string('numero_pedido', 50)->unique();
            $table->foreignId('secretaria_id')->constrained('secretarias')->onDelete('cascade');
            $table->foreignId('fornecedor_id')->nullable()->constrained('fornecedores')->onDelete('cascade');
            $table->foreignId('contrato_id')->nullable()->constrained('contratos')->onDelete('cascade');
            $table->foreignId('usuario_solicitante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('usuario_autorizador_id')->nullable()->constrained('users')->onDelete('set null');

            $table->string('titulo', 200);
            $table->text('descricao');
            $table->text('justificativa')->nullable();
            $table->decimal('valor_total_estimado', 15, 2);
            $table->date('data_solicitacao');
            $table->date('data_necessidade')->nullable();
            $table->enum('status', ['rascunho', 'pendente_aprovacao', 'aprovado', 'rejeitado', 'cancelado', 'em_execucao', 'concluido'])->default('rascunho');
            $table->enum('prioridade', ['baixa', 'normal', 'alta', 'urgente'])->default('normal');

            $table->text('observacoes')->nullable();
            $table->text('motivo_rejeicao')->nullable();
            $table->date('data_aprovacao')->nullable();
            $table->date('data_rejeicao')->nullable();

            $table->timestamps();

            $table->index(['numero_pedido']);
            $table->index(['secretaria_id']);
            $table->index(['fornecedor_id']);
            $table->index(['status']);
            $table->index(['data_solicitacao']);
            $table->index(['prioridade']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_compras');
    }
};
