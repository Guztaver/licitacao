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
        Schema::create('estoques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->foreignId('localizacao_id')->nullable()->constrained();
            $table->decimal('quantidade_atual', 15, 3)->default(0);
            $table->decimal('quantidade_minima', 15, 3)->default(0);
            $table->decimal('quantidade_maxima', 15, 3)->nullable();
            $table->decimal('quantidade_reservada', 15, 3)->default(0); // Quantidade reservada para requisições
            $table->decimal('ponto_reposicao', 15, 3)->default(0); // Ponto de pedido para reposição
            $table->integer('lead_time_reposicao')->default(7); // Dias para receber reposição
            $dateLote = $table->string('lote')->nullable(); // Número do lote
            $table->date('data_validade')->nullable(); // Data de validade
            $table->decimal('custo_unitario_medio', 15, 2)->default(0); // Custo médio atual
            $table->decimal('valor_total_estoque', 15, 2)->default(0); // Valor total em estoque
            $table->enum('status', ['ativo', 'bloqueado', 'em_analise'])->default('ativo');
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->unique(['item_id', 'localizacao_id', 'lote']);
            $table->index(['item_id', 'status']);
            $table->index('localizacao_id');
            $table->index('quantidade_atual');
            $table->index('ponto_reposicao');
            $table->index('data_validade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estoques');
    }
};
