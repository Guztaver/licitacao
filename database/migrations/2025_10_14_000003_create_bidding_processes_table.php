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
        Schema::create('bidding_processes', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Título do processo licitatório');
            $table->string('status')->default('draft')->comment('Status do processo');
            $table->json('consolidated_items')->comment('Itens consolidados dos pedidos de compra');
            $table->foreignId('created_by')->constrained('users')->comment('Usuário que criou o processo');
            $table->text('observations')->nullable()->comment('Observações do processo');
            $table->timestamps();

            $table->index(['status', 'created_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bidding_processes');
    }
};
