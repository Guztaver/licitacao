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
        Schema::create('anexos', function (Blueprint $table) {
            $table->id();
            $table->string('nome_original');
            $table->string('nome_arquivo');
            $table->string('caminho');
            $table->string('mime_type');
            $table->unsignedBigInteger('tamanho');
            $table->morphs('anexavel'); // Polymorphic relationship
            $table->string('tipo')->default('documento'); // documento, imagem, pdf, etc.
            $table->text('descricao')->nullable();
            $table->foreignId('usuario_upload_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['tipo']);
            $table->index(['mime_type']);
            $table->index(['usuario_upload_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anexos');
    }
};
