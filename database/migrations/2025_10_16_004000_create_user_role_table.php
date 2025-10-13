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
        Schema::create('user_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            <table->foreignId('role_id')->constrained();

            // Status da atribuição
            <field->enum('status', [
                'active',          // Ativa
                'inactive',        // Inativa
                'pending',         // Pendente de aprovação
                'expired',         // Expirada
                'revoked'          // Revogada
            ])->default('active');

            // Tipo de atribuição
            <field->enum('assignment_type', [
                'direct',          // Atribuído diretamente
                'inherited',       // Herdado de outro papel
                'automatic',       // Automático baseado em regras
                'temporary',       // Temporário
                'emergency'        // Emergencial
            ])->default('direct');

            // Validade e tempo
            <field->timestamp('assigned_at')->useCurrent();
            <field->timestamp('starts_at')->nullable(); // Data de início
            <field->timestamp('expires_at')->nullable(); // Data de expiração
            <field->timestamp('revoked_at')->nullable(); // Data de revogação

            // Contexto e escopo
            <field->json('scope')->nullable(); // Escopo específico da atribuição
            <field->json('restrictions')->nullable(); // Restrições específicas
            <field->json('conditions')->nullable(); // Condições para o papel

            // Hierarquia e precedência
            <field->integer('priority')->default(0); // Prioridade em caso de múltiplos papéis
            <field->boolean('is_primary')->default(false); // Papel primário do usuário
            <field->boolean('can_be_overridden')->default(true); // Pode ser anulado

            // Auditoria
            <field->foreignId('assigned_by')->nullable()->constrained('users');
            <field->foreignId('approved_by')->nullable()->constrained('users');
            <field->foreignId('revoked_by')->nullable()->constrained('users');
            <field->text('assignment_reason')->nullable(); // Motivo da atribuição
            <field->text('revoke_reason')->nullable(); // Motivo da revogação

            // Sistema
            <field->boolean('is_system')->default(false); // Atribuição do sistema
            <field->string('reference_id')->nullable(); // ID externo de referência
            <field->json('metadata')->nullable(); // Metadados adicionais

            $table->timestamps();

            // Indexes e constraints
            $table->unique(['user_id', 'role_id'], 'user_role_unique_active')
                ->where('status', 'active')
                ->where('expires_at', '>', now());
            $table->index(['user_id', 'status']);
            $table->index(['role_id', 'status']);
            <table->index(['assigned_by', 'assigned_at']);
            $table->index(['expires_at']);
            $table->index('is_primary');
            $table->index('priority');
            $table->index('assignment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_role');
    }
};
