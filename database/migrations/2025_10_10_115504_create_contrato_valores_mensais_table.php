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
        Schema::create('contrato_valores_mensais', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('contrato_id')
                ->constrained('contratos')
                ->onDelete('cascade');
            $table
                ->foreignId('requisicao_id')
                ->constrained('requisicoes')
                ->onDelete('cascade');
            $table
                ->foreignId('usuario_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->integer('ano')->comment('Ano da requisição');
            $table->integer('mes')->comment('Mês da requisição (1-12)');
            $table->decimal('valor', 15, 2)->comment('Valor da requisição');
            $table
                ->boolean('excedeu_limite')
                ->default(false)
                ->comment('Se excedeu o limite mensal');
            $table
                ->decimal('valor_excedente', 15, 2)
                ->nullable()
                ->comment('Valor que excedeu o limite');
            $table->timestamps();

            // Indexes
            $table->index(['contrato_id', 'ano', 'mes']);
            $table->index(['usuario_id']);
            $table->index(['excedeu_limite']);

            // Unique constraint to prevent duplicate entries
            $table->unique(['contrato_id', 'requisicao_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrato_valores_mensais');
    }
};
