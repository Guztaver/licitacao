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
            $table->foreignId('default_role_id')->nullable()->constrained('roles');
            $table->enum('auth_type', [
                'local',           // Autenticação local
                'ldap',            // LDAP/Active Directory
                'oauth',           // OAuth (Google, etc.)
                'saml',            // SAML
                'api_key',         // Chave de API
                'biometric'        // Biometria
            ])->default('local');

            // Status e validade
            $table->enum('status', [
                'active',          // Ativo
                'inactive',        // Inativo
                'suspended',       // Suspenso
                'locked',          // Bloqueado
                'pending_approval', // Aguardando aprovação
                'expired'          // Expirado
            ])->default('pending_approval');

            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamp('locked_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            // Segurança
            $table->string('two_factor_secret')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->json('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();

            $table->integer('failed_login_attempts')->default(0);
            $table->timestamp('last_failed_login_at')->nullable();
            $table->string('locked_until')->nullable();
            $table->string('password_reset_token')->nullable();
            $table->timestamp('password_reset_expires_at')->nullable();

            // Perfil e informações
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->json('metadata')->nullable(); // Metadados adicionais

            // Preferências
            $table->string('timezone')->default('America/Sao_Paulo');
            $table->string('language')->default('pt-BR');
            $table->json('preferences')->nullable(); // Preferências do usuário
            $table->boolean('email_notifications')->default(true);
            $table->boolean('push_notifications')->default(false);

            // Auditoria
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();

            // Sistema
            $table->boolean('is_system')->default(false);
            $table->boolean('must_change_password')->default(false);
            $table->timestamp('last_activity_at')->nullable();
            $table->string('remember_token')->nullable();

            // Indexes
            $table->index(['status', 'expires_at']);
            $table->index('email');
            $table->index('last_login_at');
            $table->index(['failed_login_attempts', 'locked_until']);
            $table->index('default_role_id');
            $table->index(['department', 'position']);
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
