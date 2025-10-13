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
        Schema::create('relatorios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('tipo'); // materiais, servicos, contratos, dispensas, etc
            $table->json('parametros')->nullable(); // filtros e configurações
            $table->json('dados')->nullable(); // dados do relatório
            $table->string('status'); // gerando, concluido, erro
            $table->text('mensagem_erro')->nullable();
            $table->string('arquivo_path')->nullable(); // path para download
            $table->string('arquivo_formato')->nullable(); // pdf, xlsx, csv
            $table->timestamp('data_geracao');
            $table->timestamp('data_expiracao')->nullable();
            $table->foreignId('usuario_solicitante_id')->constrained('users');
            $table->timestamps();

            $table->index(['tipo', 'status']);
            $table->index('data_geracao');
            $table->index('data_expiracao');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relatorios');
    }
};
