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
        Schema::create('dispensa_licitacoes', function (Blueprint $table) {
            $table->id();

            // Referência ao item/serviço
            $table->foreignId('item_id')->nullable()->constrained('items')->onDelete('cascade');
            $table->foreignId('categoria_material_id')->nullable()->constrained('categoria_materiais')->onDelete('cascade');

            // Detalhes da dispensa
            $table->string('numero_processo', 50); // Número do processo
            $table->string('numero_dispensa', 50)->unique(); // Número da dispensa
            $table->text('objeto'); // Objeto da dispensa
            $table->decimal('valor_total', 15, 2); // Valor total da dispensa
            $table->date('data_dispensa'); // Data da dispensa
            $table->date('data_inicio_vigencia'); // Início da vigência
            $table->date('data_fim_vigencia')->nullable(); // Fim da vigência
            $table->integer('quantidade')->nullable(); // Quantidade de itens

            // Status e validação
            $table->enum('status', ['rascunho', 'aprovada', 'rejeitada', 'executada', 'concluida', 'cancelada'])->default('rascunho');
            $table->boolean('excedeu_limite')->default(false); // Se excedeu o limite
            $table->text('motivo_excedimento')->nullable(); // Motivo do excesso
            $table->text('justificativa')->nullable(); // Justificativa da dispensa

            // Controle de limites
            $table->decimal('limite_anual_disponivel', 15, 2)->default(0); // Limite disponível no ano
            $table->decimal('limite_mensal_disponivel', 15, 2)->default(0); // Limite disponível no mês
            $table->decimal('valor_excedido', 15, 2)->default(0); // Valor que excedeu o limite

            // Responsáveis
            $table->foreignId('fornecedor_id')->constrained('fornecedores')->onDelete('cascade');
            $table->foreignId('secretaria_id')->constrained('secretarias')->onDelete('cascade');
            $table->foreignId('usuario_solicitante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('usuario_aprovador_id')->nullable()->constrained('users')->onDelete('set null');

            // Auditoria
            $table->text('observacoes')->nullable();
            $table->text('documentos')->nullable(); // JSON com documentos anexos
            $table->timestamps();

            // Índices
            $table->index(['numero_dispensa']);
            $table->index(['categoria_material_id']);
            $table->index(['fornecedor_id']);
            $table->index(['secretaria_id']);
            $table->index(['status']);
            $table->index(['data_dispensa']);
            $table->index(['excedeu_limite']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispensa_licitacoes');
    }
};
