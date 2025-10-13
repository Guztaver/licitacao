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
        Schema::create('estatisticas_materiais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->foreignId('categoria_material_id')->nullable()->constrained();
            $table->integer('ano');
            $table->integer('mes');
            $table->integer('total_contratos')->default(0);
            $table->integer('total_pedidos')->default(0);
            $table->integer('total_requisicoes')->default(0);
            $table->decimal('valor_total_contratos', 15, 2)->default(0);
            $table->decimal('valor_total_pedidos', 15, 2)->default(0);
            $table->decimal('valor_total_requisicoes', 15, 2)->default(0);
            $table->decimal('valor_medio_ponderado', 15, 2)->default(0);
            $table->integer('quantidade_total')->default(0);
            $table->integer('fornecedores_distintos')->default(0);
            $table->decimal('variacao_preco_percentual', 8, 2)->default(0); // variação vs mês anterior
            $table->timestamps();

            $table->unique(['item_id', 'ano', 'mes']);
            $table->index(['categoria_material_id', 'ano', 'mes']);
            $table->index(['ano', 'mes']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estatisticas_materiais');
    }
};
