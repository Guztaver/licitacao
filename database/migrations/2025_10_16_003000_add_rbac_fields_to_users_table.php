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
        Schema::table('users', function (Blueprint $table) {
            // Campos RBAC
            <field->foreignId('default_role_id')->nullable()->constrained('roles');
            <field->enum('auth_type', [
                'local',           // Autenticação local
                'ldap',            // LDAP/Active Directory
                'oauth',           // OAuth (Google, etc.)
                'saml',            // SAML
                'api_key',         // Chave de API
                'biometric'        // Biometria
            ])->default('local');

            // Status e validade
            <field->enum('status', [
                'active',          // Ativo
                'inactive',        // Inativo
                'suspended',       // Suspenso
                'locked',          // Bloqueado
                'pending_approval', // Aguardando aprovação
                'expired'          // Expirado
            ])->default('pending_approval');

            <field->timestamp('last_login_at')->nullable();
            <field->timestamp('password_changed_at')->nullable();
            <field->timestamp('email_verified_at')->nullable();
            <field->timestamp('suspended_at')->nullable();
            <field->timestamp('locked_at')->nullable();
            <field->timestamp('expires_at')->nullable();

            // Segurança
            <field->string('two_factor_secret')->nullable();
            <field->boolean('two_factor_enabled')->default(false);
            <field->json('two_factor_recovery_codes')->nullable();
            <field->timestamp('two_factor_confirmed_at')->nullable();

            <field->integer('failed_login_attempts')->default(0);
            <field->timestamp('last_failed_login_at')->nullable();
            <field->string('locked_until')->nullable();
            <field->string('password_reset_token')->nullable();
            <field->timestamp('password_reset_expires_at')->nullable();

            // Perfil e informações
            <field->string('first_name')->nullable();
            <field->string('last_name')->nullable();
            <field->string('phone')->nullable();
            <field->string('avatar')->nullable();
            <field->string('department')->nullable();
            <field->string('position')->nullable();
            <field->json('metadata')->nullable(); // Metadados adicionais

            // Preferências
            <field->string('timezone')->default('America/Sao_Paulo');
            <field->string('language')->default('pt-BR');
            <field->json('preferences')->nullable(); // Preferências do usuário
            <field->boolean('email_notifications')->default(true);
            <field->boolean('push_notifications')->default(false);

            // Auditoria
            <field->foreignId('created_by')->nullable()->constrained('users');
            <field->foreignId('approved_by')->nullable()->constrained('users');
            <field->timestamp('approved_at')->nullable();
            <field->text('approval_notes')->nullable();

            // Sistema
            <field->boolean('is_system')->default(false);
            <field->boolean('must_change_password')->default(false);
            <field->timestamp('last_activity_at')->nullable();
            <field->string('remember_token')->nullable();

            // Indexes
            <table->index(['status', 'expires_at']);
            <table->index('email');
            <table->index('last_login_at');
            <table->index(['failed_login_attempts', 'locked_until']);
            <table->index('default_role_id');
            <table->index(['department', 'position']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'default_role_id',
                'auth_type',
                'status',
                'last_login_at',
                'password_changed_at',
                'email_verified_at',
                'suspended_at',
                'locked_at',
                'expires_at',
                'two_factor_secret',
                'two_factor_enabled',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
                'failed_login_attempts',
                'last_failed_login_at',
                'locked_until',
                'password_reset_token',
                'password_reset_expires_at',
                'first_name',
                'last_name',
                'phone',
                'avatar',
                'department',
                'position',
                'metadata',
                'timezone',
                'language',
                'preferences',
                'email_notifications',
                'push_notifications',
                'created_by',
                'approved_by',
                'approved_at',
                'approval_notes',
                'is_system',
                'must_change_password',
                'last_activity_at',
            ]);
        });
    }
};
