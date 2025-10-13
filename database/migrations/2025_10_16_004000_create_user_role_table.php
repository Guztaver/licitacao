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
            $table->foreignId('role_id')->constrained();

            // Status da atribuição
            $table->enum('status', [
                'active',          // Ativa
                'inactive',        // Inativa
                'pending',         // Pendente de aprovação
                'expired',         // Expirada
                'revoked'          // Revogada
            ])->default('active');

            // Tipo de atribuição
            $table->enum('assignment_type', [
                'direct',          // Atribuído diretamente
                'inherited',       // Herdado de outro papel
                'automatic',       // Automático baseado em regras
                'temporary',       // Temporário
                'emergency'        // Emergencial
            ])->default('direct');

            // Validade e tempo
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('starts_at')->nullable(); // Data de início
            $table->timestamp('expires_at')->nullable(); // Data de expiração
            $table->timestamp('revoked_at')->nullable(); // Data de revogação

            // Contexto e escopo
            $table->json('scope')->nullable(); // Escopo específico da atribuição
            $table->json('restrictions')->nullable(); // Restrições específicas
            $table->json('conditions')->nullable(); // Condições para o papel

            // Hierarquia e precedência
            $table->integer('priority')->default(0); // Prioridade em caso de múltiplos papéis
            $table->boolean('is_primary')->default(false); // Papel primário do usuário
            $table->boolean('can_be_overridden')->default(true); // Pode ser anulado

            // Auditoria
            $table->foreignId('assigned_by')->nullable()->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->foreignId('revoked_by')->nullable()->constrained('users');
            $table->text('assignment_reason')->nullable(); // Motivo da atribuição
            $table->text('revoke_reason')->nullable(); // Motivo da revogação

            // Sistema
            $table->boolean('is_system')->default(false); // Atribuição do sistema
            $table->string('reference_id')->nullable(); // ID externo de referência
            $table->json('metadata')->nullable(); // Metadados adicionais

            $table->timestamps();

            // Indexes e constraints
            $table->unique(['user_id', 'role_id'], 'user_role_unique_active')
                ->where('status', 'active')
                ->where('expires_at', '>', now());
            $table->index(['user_id', 'status']);
            $table->index(['role_id', 'status']);
            $table->index(['assigned_by', 'assigned_at']);
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
