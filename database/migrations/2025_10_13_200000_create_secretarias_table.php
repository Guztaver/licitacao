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
        Schema::create('secretarias', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100);
            $table->string('sigla', 20)->unique();
            $table->text('descricao')->nullable();
            $table->string('responsavel', 100)->nullable();
            $table->string('email_responsavel')->nullable();
            $table->boolean('ativa')->default(true);
            $table->timestamps();

            $table->index(['sigla']);
            $table->index(['ativa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secretarias');
    }
};
