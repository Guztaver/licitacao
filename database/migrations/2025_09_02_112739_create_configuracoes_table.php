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
        Schema::create('configuracoes', function (Blueprint $table) {
            $table->id();
            $table->string('chave')->unique();
            $table->text('valor')->nullable();
            $table->string('tipo')->default('string'); // string, boolean, integer, decimal, json
            $table->text('descricao')->nullable();
            $table->string('grupo')->default('geral');
            $table->boolean('publico')->default(false);
            $table->timestamps();

            $table->index(['chave']);
            $table->index(['grupo']);
            $table->index(['publico']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuracoes');
    }
};
