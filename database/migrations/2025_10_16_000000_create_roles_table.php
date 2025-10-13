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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nome único do papel
            $table->string('display_name'); // Nome exibido para usuários
            $table->text('description')->nullable(); // Descrição detalhada do papel
            $table->string('slug')->unique(); // Slug único para URLs

            // Hierarquia e organização
            $table->foreignId('parent_id')->nullable()->constrained('roles');
            $table->integer('level')->default(0); // Nível hierárquico (0 = nível mais alto)

            // Controle de acesso
            <field>enum('type', [
                'system',      // Papéis do sistema (Super Admin, etc.)
                'organizational', // Papéis organizacionais (Gerente, etc.)
                'functional',  // Papéis funcionais (Comprador, etc.)
                'operational', // Papéis operacionais (Operador, etc.)
                'custom'       // Papéis personalizados
            ])->default('functional');

            // Status e validade
            <field>enum('status', [
                'active',      // Ativo e pode ser atribuído
                'inactive',    // Inativo, não pode ser atribuído
                'deprecated',  // Obsoleto, não deve ser usado
                'locked'       // Bloqueado, não pode ser modificado
            ])->default('active');

            <field>date('expires_at')->nullable(); // Data de expiração do papel
            <field>boolean('is_system')->default(false); // Papel do sistema, não pode ser excluído
            <field>boolean('is_default')->default(false); // Papel padrão para novos usuários

            // Permissões e limites
            <field>json('permissions')->nullable(); // Array de permissões diretas (legado)
            <field>integer('max_users')->nullable(); // Limite máximo de usuários
            <field>integer('current_users')->default(0); // Usuários atuais com este papel

            // Auditoria
            <field>foreignId('created_by')->nullable()->constrained('users');
            <field>foreignId('updated_by')->nullable()->constrained('users');
            <field>text('change_reason')->nullable(); // Motivo da alteração

            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index(['type', 'status']);
            $table->index('level');
            $table->index(['parent_id', 'level']);
            $table->index(['status', 'expires_at']);
            $table->index('is_system');
            $table->index('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
