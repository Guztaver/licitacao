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
        Schema::create('conferencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained('fornecedores')->onDelete('cascade');
            $table->date('periodo_inicio');
            $table->date('periodo_fim');
            $table->decimal('total_requisicoes', 15, 2)->default(0);
            $table->decimal('total_pedidos_manuais', 15, 2)->default(0);
            $table->decimal('total_geral', 15, 2)->default(0);
            $table->enum('status', ['em_andamento', 'finalizada'])->default('em_andamento');
            $table->timestamp('data_finalizacao')->nullable();
            $table->foreignId('usuario_criacao_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('usuario_finalizacao_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->index(['fornecedor_id']);
            $table->index(['status']);
            $table->index(['periodo_inicio']);
            $table->index(['periodo_fim']);
            $table->index(['fornecedor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conferencias');
    }
};
