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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nome único da permissão
            $table->string('display_name'); // Nome exibido para usuários
            $table->text('description')->nullable(); // Descrição detalhada
            $table->string('slug')->unique(); // Slug único para URLs

            // Categorização
            <field>enum('module', [
                'users',           // Gestão de usuários
                'roles',           // Gestão de papéis
                'fornecedores',    // Gestão de fornecedores
                'contratos',       // Gestão de contratos
                'requisicoes',     // Gestão de requisições
                'pedidos',         // Gestão de pedidos
                'conferencias',    // Gestão de conferências
                'estoque',         // Gestão de estoque
                'relatorios',      // Relatórios
                'dashboard',       // Dashboard
                'system',          // Configurações do sistema
                'auditoria',       // Auditoria e logs
                'notifications',   // Notificações
                'integrations',    // Integrações externas
                'custom'           // Módulos personalizados
            ])->default('custom');

            <field>enum('type', [
                'create',          // Criar
                'read',            // Ler/Visualizar
                'update',          // Atualizar
                'delete',          // Excluir
                'approve',         // Aprovar
                'reject',          // Rejeitar
                'export',          // Exportar
                'import',          // Importar
                'manage',          // Gerenciar (CRD completo)
                'admin',           // Administração completa
                'execute',         // Executar ações específicas
                'view_sensitive',  // Visualizar dados sensíveis
                'custom'           // Ação personalizada
            ])->default('read');

            // Escopo e contexto
            <field>enum('scope', [
                'global',          // Global, afeta todo o sistema
                'own',             // Apenas próprio conteúdo
                'department',      // Apenas departamento
                'team',            // Apenas equipe
                'custom'           // Escopo personalizado
            ])->default('global');

            <field>json('scope_conditions')->nullable(); // Condições específicas do escopo

            // Controle de acesso
            <field>enum('level', [
                'basic',           // Nível básico de acesso
                'intermediate',    // Nível intermediário
                'advanced',        // Nível avançado
                'expert',          // Nível especialista
                'master'           // Nível mestre
            ])->default('basic');

            // Restrições e condições
            <field->json('restrictions')->nullable(); // Array de restrições
            <field>json('conditions')->nullable(); // Condições para acesso
            <field->boolean('requires_approval')->default(false); // Requer aprovação
            <field->integer('approval_level')->nullable(); // Nível necessário para aprovação

            // Sistema
            <field>boolean('is_system')->default(false); // Permissão do sistema
            <field>enum('status', [
                'active',          // Ativa
                'inactive',        // Inativa
                'deprecated',      // Obsoleta
                'experimental'     // Experimental
            ])->default('active');

            // Auditoria
            <field->foreignId('created_by')->nullable()->constrained('users');
            <field->text('change_reason')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index(['module', 'type']);
            $table->index('scope');
            $table->index('level');
            $table->index(['status', 'is_system']);
            $table->index('requires_approval');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
