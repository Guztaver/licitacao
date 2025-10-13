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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            <table->foreignId('user_id')->nullable()->constrained('users'); // Usuário que executou
            <table->foreignId('target_user_id')->nullable()->constrained('users'); // Usuário alvo

            // Informações básicas da ação
            <field->enum('action', [
                // Ações de usuário
                'login', 'logout', 'login_failed', 'password_changed', 'password_reset',
                'profile_updated', 'avatar_updated', 'preferences_updated',

                // Ações de RBAC
                'role_assigned', 'role_removed', 'role_updated', 'permission_granted',
                'permission_revoked', 'user_suspended', 'user_unlocked', 'user_approved',

                // Ações do sistema
                'user_created', 'user_updated', 'user_deleted', 'user_restored',
                'role_created', 'role_updated', 'role_deleted', 'permission_created',
                'permission_updated', 'permission_deleted',

                // Ações de dados
                'data_accessed', 'data_created', 'data_updated', 'data_deleted', 'data_exported',
                'data_imported', 'report_generated', 'file_uploaded', 'file_downloaded',

                // Ações de sistema
                'system_config_updated', 'security_setting_changed', 'backup_created',
                'backup_restored', 'maintenance_started', 'maintenance_completed',

                // Outras
                'api_access', 'api_key_created', 'api_key_revoked', 'webhook_triggered'
            ]);

            // Detalhes do evento
            <field->string('event_type'); // Tipo de evento para agrupamento
            <field->string('resource_type')->nullable(); // Tipo de recurso (user, role, etc.)
            <field->json('resource_id')->nullable(); // ID(s) do(s) recurso(s)
            <field->text('description')->nullable(); // Descrição do evento

            // Dados anteriores e novos
            <field->json('old_values')->nullable(); // Valores antes da alteração
            <field->json('new_values')->nullable(); // Valores após a alteração
            <field->json('changed_fields')->nullable(); // Campos alterados

            // Contexto e ambiente
            <field->string('ip_address', 45); // IP do cliente
            <field->string('user_agent')->nullable(); // User Agent do navegador
            <field->string('session_id')->nullable(); // ID da sessão
            <field->string('request_id')->nullable(); // ID único da requisição
            <field->string('request_method', 10)->nullable(); // Método HTTP
            <field->text('request_url')->nullable(); // URL completa da requisição
            <field->json('request_headers')->nullable(); // Cabeçalhos da requisição
            <field->json('request_body')->nullable(); // Corpo da requisição
            <field->json('request_params')->nullable(); // Parâmetros da requisição

            // Resultado
            <field->enum('status', [
                'success',         // Sucesso
                'failed',          // Falha
                'warning',         // Aviso
                'info',            // Informação
                'error',           // Erro
                'blocked'          // Bloqueado
            ])->default('success');

            <field->integer('http_status_code')->nullable(); // Código HTTP de resposta
            <field->text('error_message')->nullable(); // Mensagem de erro
            <field->integer('response_time_ms')->nullable(); // Tempo de resposta em ms

            // Localização e dispositivo
            <field->string('country_code', 2)->nullable(); // Código do país
            <field->string('country_name')->nullable(); // Nome do país
            <field->string('region')->nullable(); // Região/Estado
            <field->string('city')->nullable(); // Cidade
            <field->string('timezone')->nullable(); // Fuso horário
            <field->string('device_type')->nullable(); // Tipo de dispositivo
            <field->string('platform')->nullable(); // Plataforma (Windows, iOS, etc.)
            <field->string('browser')->nullable(); // Navegador

            // Segurança e risco
            <field->enum('risk_level', [
                'low',             // Baixo risco
                'medium',          // Médio risco
                'high',            // Alto risco
                'critical'         // Risco crítico
            ])->default('low');

            <field->json('security_flags')->nullable(); // Flags de segurança
            <field->boolean('is_suspicious')->default(false); // Atividade suspeita
            <field->boolean('requires_review')->default(false); // Requer revisão
            <field->text('security_notes')->nullable(); // Notas de segurança

            // Metadados
            <field->json('metadata')->nullable(); // Metadados adicionais
            <field->json('tags')->nullable(); // Tags para classificação
            <field->json('custom_fields')->nullable(); // Campos personalizados

            // Auditoria e conformidade
            <field->json('compliance_flags')->nullable(); // Flags de conformidade
            <field->enum('data_classification', [
                'public',          // Público
                'internal',        // Interno
                'confidential',    // Confidencial
                'restricted',      // Restrito
                'secret'           // Secreto
            ])->nullable(); // Classificação dos dados

            <field->boolean('gdpr_relevant')->default(false); // Relevante para GDPR
            <field->text('retention_reason')->nullable(); // Motivo de retenção

            $table->timestamp('occurred_at')->useCurrent(); // Quando o evento ocorreu
            $table->timestamps();

            // Soft deletes
            <table->timestamp('deleted_at')->nullable();

            // Indexes
            $table->index(['user_id', 'occurred_at']);
            <table->index(['action', 'occurred_at']);
            $table->index(['resource_type', 'resource_id']);
            $table->index(['status', 'occurred_at']);
            $table->index(['risk_level', 'occurred_at']);
            <table->index(['is_suspicious', 'occurred_at']);
            $table->index('ip_address');
            $table->index('session_id');
            $table->index('request_id');
            <table->index('event_type');
            $table->index(['gdpr_relevant', 'occurred_at']);
            $table->index('deleted_at');

            // Full-text search
            $table->fullText(['description', 'error_message']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
