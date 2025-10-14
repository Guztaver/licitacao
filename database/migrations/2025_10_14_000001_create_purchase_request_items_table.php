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
        Schema::create('purchase_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_request_id')->constrained()->comment('ID do pedido de compra');
            $table->foreignId('item_id')->nullable()->constrained()->comment('ID do item do catálogo (se aplicável)');
            $table->string('descricao_material')->comment('Descrição do material solicitado');
            $table->decimal('quantidade_solicitada', 10, 3)->comment('Quantidade solicitada');
            $table->string('unidade_medida')->comment('Unidade de medida');
            $table->decimal('valor_unitario_estimado', 15, 2)->nullable()->comment('Valor unitário estimado');
            $table->decimal('valor_total_estimado', 15, 2)->nullable()->comment('Valor total estimado');
            $table->text('especificacoes')->nullable()->comment('Especificações técnicas');
            $table->text('observacoes')->nullable()->comment('Observações do item');
            $table->timestamps();

            $table->index(['purchase_request_id', 'descricao_material']);
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_request_items');
    }
};
