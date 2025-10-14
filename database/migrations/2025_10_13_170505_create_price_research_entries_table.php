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
        Schema::create('price_research_entries', function (Blueprint $table) {
            $table->id();
            $table->string('item_description')->comment('Descrição do item pesquisado');
            $table->string('supplier_name')->comment('Nome do fornecedor');
            $table->decimal('supplier_price', 15, 2)->comment('Preço do fornecedor');
            $table->integer('quantity')->default(1)->comment('Quantidade');
            $table->string('unit')->comment('Unidade de medida');
            $table->string('uf', 2)->comment('UF do fornecedor');
            $table->string('municipio')->nullable()->comment('Município do fornecedor');
            $table->date('proposal_date')->comment('Data da proposta');
            $table->string('numero_processo')->nullable()->comment('Número do processo');
            $table->string('orgao')->nullable()->comment('Órgão público');
            $table->string('modalidade')->nullable()->comment('Modalidade licitatória');
            $table->string('situacao')->default('Ativa')->comment('Situação da proposta');
            $table->foreignId('purchase_request_id')->nullable()->constrained()->comment('Pedido de compra relacionado');
            $table->foreignId('user_id')->nullable()->constrained()->comment('Usuário que registrou');
            $table->json('source_data')->nullable()->comment('Dados originais da fonte PNCP');
            $table->timestamps();

            $table->index(['item_description']);
            $table->index(['supplier_price']);
            $table->index(['proposal_date']);
            $table->index(['purchase_request_id']);
            $table->index(['user_id']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_research_entries');
    }
};
