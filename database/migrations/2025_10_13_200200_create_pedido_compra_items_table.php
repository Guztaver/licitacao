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
        Schema::create('pedido_compra_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_compra_id')->constrained('pedidos_compras')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->foreignId('contrato_item_id')->nullable()->constrained('contrato_items')->onDelete('set null');

            $table->string('descricao_material', 500);
            $table->decimal('quantidade_solicitada', 10, 3);
            $table->string('unidade_medida', 20);
            $table->decimal('valor_unitario_estimado', 15, 2);
            $table->decimal('valor_total_estimado', 15, 2);
            $table->text('especificacoes')->nullable();
            $table->text('observacoes')->nullable();

            $table->timestamps();

            $table->index(['pedido_compra_id']);
            $table->index(['item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_compra_items');
    }
};
