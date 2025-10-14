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
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Título do pedido de compra');
            $table->text('description')->comment('Descrição detalhada do pedido');
            $table->string('status')->default('draft')->comment('Status atual do pedido');
            $table->foreignId('secretaria_id')->constrained()->comment('Secretaria solicitante');
            $table->foreignId('user_id')->constrained()->comment('Usuário que criou o pedido');
            $table->decimal('estimated_total', 15, 2)->nullable()->comment('Valor total estimado');
            $table->decimal('approved_total', 15, 2)->nullable()->comment('Valor total aprovado');
            $table->json('status_history')->nullable()->comment('Histórico de mudanças de status');
            $table->text('rejection_reason')->nullable()->comment('Motivo da rejeição');
            $table->text('observations')->nullable()->comment('Observações gerais');
            $table->timestamps();

            $table->index(['status', 'secretaria_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
