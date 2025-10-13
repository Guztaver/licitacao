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
        Schema::create('role_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained();
            $table->foreignId('permission_id')->constrained();

            // Controle de permissão
            $table->enum('permission_type', [
                'allow',           // Permitido explicitamente
                'deny',            // Negado explicitamente
                'inherit',         // Herdado do papel pai
                'conditional'      // Condicional
            ])->default('allow');

            // Condições e restrições
            $table->json('conditions')->nullable(); // Condições específicas
            $table->json('restrictions')->nullable(); // Restrições específicas
            $table->text('justification')->nullable(); // Justificativa da permissão

            // Tempo e validade
            $table->timestamp('granted_at')->useCurrent();
            $table->timestamp('expires_at')->nullable(); // Data de expiração
            $table->timestamp('revoked_at')->nullable(); // Data de revogação
            $table->boolean('is_active')->default(true);

            // Hierarquia e precedência
            $table->integer('priority')->default(0); // Prioridade (maior = mais importante)
            $table->boolean('can_override')->default(false); // Pode anular outras permissões

            // Contexto e escopo
            $table->json('context')->nullable(); // Contexto específico
            $table->string('resource_type')->nullable(); // Tipo de recurso
            $table->json('resource_ids')->nullable(); // IDs específicos de recursos

            // Auditoria
            $table->foreignId('granted_by')->nullable()->constrained('users');
            $table->foreignId('revoked_by')->nullable()->constrained('users');
            $table->text('revoke_reason')->nullable();

            $table->timestamps();

            // Indexes e constraints
            $table->unique(['role_id', 'permission_id', 'resource_type'], 'role_perm_unique');
            $table->index(['role_id', 'is_active']);
            $table->index(['permission_id', 'is_active']);
            $table->index(['granted_by', 'granted_at']);
            $table->index(['expires_at']);
            $table->index('priority');
            $table->index('permission_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permission');
    }
};
