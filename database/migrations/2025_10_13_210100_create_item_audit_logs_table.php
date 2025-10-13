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
        Schema::create('item_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // What changed
            $table->string('action', 50); // 'created', 'updated', 'frozen'
            $table->string('field_changed', 100)->nullable(); // 'descricao', 'codigo', etc.

            // Old and new values
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();

            // Context
            $table->string('context_type', 100)->nullable(); // 'requisicao', 'contrato', 'pedido_compra'
            $table->unsignedBigInteger('context_id')->nullable(); // ID of the related record

            // Metadata
            $table->ipAddress('user_ip')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['item_id', 'created_at']);
            $table->index(['action']);
            $table->index(['context_type', 'context_id']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_audit_logs');
    }
};
