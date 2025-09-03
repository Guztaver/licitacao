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
        Schema::create('pedidos_manuais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained('fornecedores')->onDelete('cascade');
            $table->text('descricao');
            $table->decimal('valor', 15, 2);
            $table->date('data_pedido');
            $table->string('numero_pedido', 50)->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->index(['fornecedor_id']);
            $table->index(['data_pedido']);
            $table->index(['valor']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_manuais');
    }
};
