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
        Schema::create('contrato_historico_limites', function (
            Blueprint $table,
        ) {
            $table->id();
            $table
                ->foreignId('contrato_id')
                ->constrained('contratos')
                ->onDelete('cascade');
            $table
                ->foreignId('usuario_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('Usuário que fez a alteração');
            $table
                ->enum('tipo_alteracao', ['criacao', 'atualizacao'])
                ->comment('Tipo de operação realizada');
            $table
                ->enum('campo_alterado', [
                    'limite_requisicoes',
                    'limite_conferencias',
                    'limite_valor_mensal',
                ])
                ->nullable()
                ->comment('Campo que foi alterado');
            $table
                ->decimal('valor_anterior', 15, 2)
                ->nullable()
                ->comment('Valor anterior do limite (null para criação)');
            $table
                ->decimal('valor_novo', 15, 2)
                ->nullable()
                ->comment('Novo valor do limite');
            $table
                ->decimal('diferenca', 15, 2)
                ->nullable()
                ->comment('Diferença entre valor novo e anterior');
            $table
                ->text('descricao')
                ->nullable()
                ->comment('Descrição ou motivo da alteração');
            $table->timestamps();

            // Indexes
            $table->index(['contrato_id', 'created_at']);
            $table->index(['campo_alterado']);
            $table->index(['tipo_alteracao']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrato_historico_limites');
    }
};
