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
        Schema::create('categoria_materiais', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100); // Nome da categoria
            $table->string('codigo', 20)->unique(); // Código único
            $table->text('descricao')->nullable(); // Descrição detalhada
            $table->enum('tipo', ['material', 'servico', 'obra']); // Tipo de categoria
            $table->boolean('ativo')->default(true); // Status da categoria

            // Limites de dispensa de licitação
            $table->decimal('limite_dispensa_anual', 15, 2)->default(0); // Limite anual em reais
            $table->decimal('limite_dispensa_mensal', 15, 2)->default(0); // Limite mensal em reais
            $table->integer('limite_dispensa_quantidade')->default(0); // Limite por quantidade
            $table->string('periodo_limite', 20)->default('mensal'); // 'mensal' ou 'anual'

            // Configurações de alerta
            $table->integer('alerta_percentual')->default(80); // Alertar em 80% do limite
            $table->integer('bloqueio_percentual')->default(100); // Bloquear em 100% do limite
            $table->boolean('alerta_ativo')->default(true); // Sistema de alerta ativo

            // Metadados
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Índices
            $table->index(['ativo']);
            $table->index(['tipo']);
            $table->index(['codigo']);
            $table->index(['alerta_ativo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categoria_materiais');
    }
};
