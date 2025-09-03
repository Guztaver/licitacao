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
        Schema::create('destinatarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('sigla', 20)->unique();
            $table->text('endereco')->nullable();
            $table->string('telefone', 20)->nullable();
            $table->string('email')->nullable();
            $table->timestamps();

            $table->index(['nome']);
            $table->index(['sigla']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinatarios');
    }
};
