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
        Schema::create('requisicoes', function (Blueprint $table) {
            $table->id();
            $table->string('numero', 10);
            $table->string('numero_completo', 50)->unique();
            $table->foreignId('emitente_id')->constrained('emitentes')->onDelete('cascade');
            $table->foreignId('destinatario_id')->constrained('destinatarios')->onDelete('cascade');
            $table->string('solicitante');
            $table->string('numero_oficio', 50)->nullable();
            $table->date('data_recebimento');
            $table->text('descricao');
            $table->foreignId('fornecedor_id')->nullable()->constrained('fornecedores')->onDelete('set null');
            $table->string('anexo')->nullable();
            $table->enum('status', ['autorizada', 'concretizada', 'cancelada', 'excluida'])->default('autorizada');
            $table->string('numero_pedido_real', 50)->nullable();
            $table->decimal('valor_final', 15, 2)->nullable();
            $table->timestamp('data_concretizacao')->nullable();
            $table->foreignId('usuario_concretizacao_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('data_exclusao')->nullable();
            $table->foreignId('usuario_exclusao_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('motivo_exclusao')->nullable();
            $table->foreignId('usuario_criacao_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['status']);
            $table->index(['data_recebimento']);
            $table->index(['numero']);
            $table->index(['numero_completo']);
            $table->index(['emitente_id', 'status']);
            $table->index(['fornecedor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requisicoes');
    }
};
