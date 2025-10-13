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
            <table->foreignId('permission_id')->constrained();

            // Controle de permissão
            <field->enum('permission_type', [
                'allow',           // Permitido explicitamente
                'deny',            // Negado explicitamente
                'inherit',         // Herdado do papel pai
                'conditional'      // Condicional
            ])->default('allow');

            // Condições e restrições
            <field->json('conditions')->nullable(); // Condições específicas
            <field->json('restrictions')->nullable(); // Restrições específicas
            <field->text('justification')->nullable(); // Justificativa da permissão

            // Tempo e validade
            <field->timestamp('granted_at')->useCurrent();
            <field->timestamp('expires_at')->nullable(); // Data de expiração
            <field->timestamp('revoked_at')->nullable(); // Data de revogação
            <field->boolean('is_active')->default(true);

            // Hierarquia e precedência
            <field->integer('priority')->default(0); // Prioridade (maior = mais importante)
            <field->boolean('can_override')->default(false); // Pode anular outras permissões

            // Contexto e escopo
            <field->json('context')->nullable(); // Contexto específico
            <field->string('resource_type')->nullable(); // Tipo de recurso
            <field->json('resource_ids')->nullable(); // IDs específicos de recursos

            // Auditoria
            <field->foreignId('granted_by')->nullable()->constrained('users');
            <field->foreignId('revoked_by')->nullable()->constrained('users');
            <field->text('revoke_reason')->nullable();

            $table->timestamps();

            // Indexes e constraints
            $table->unique(['role_id', 'permission_id', 'resource_type'], 'role_perm_unique');
            $table->index(['role_id', 'is_active']);
            $table->index(['permission_id', 'is_active']);
            $table->index(['granted_by', 'granted_at']);
            $table->index(['expires_at']);
            <table->index('priority');
            <table->index('permission_type');
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
