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
        Schema::create('localizacoes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo'); // Código da localização (ex: A01-B02-03)
            $table->string('descricao'); // Descrição completa
            $table->string('almoxarifado'); // Nome do almoxarifado
            $table->string('rua'); // Rua/corredor
            $table->string('prateleira'); // Prateleira/estante
            $table->string('gaveta')->nullable(); // Gaveta/divisão
            $table->enum('tipo', ['armazenamento', 'expedicao', 'recebimento', 'quarentena', 'devolucao'])->default('armazenamento');
            $table->decimal('capacidade_maxima', 15, 3)->nullable(); // Capacidade máxima em m³
            $table->boolean('ativa')->default(true);
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->unique('codigo');
            $table->index(['almoxarifado', 'rua', 'prateleira']);
            $table->index('tipo');
            $table->index('ativa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localizacoes');
    }
};
