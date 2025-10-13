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
        Schema::create('permission_cache', function (Blueprint $table) {
            $table->id();
            <table->foreignId('user_id')->constrained();

            // Dados cacheados
            <field->json('permissions')->nullable(); // Array de permissões do usuário
            <field->json('roles')->nullable(); // Array de papéis do usuário
            <field->json('role_hierarchy')->nullable(); // Hierarquia de papéis
            <field->json('inherited_permissions')->nullable(); // Permissões herdadas

            // Controle de cache
            <field->enum('cache_type', [
                'user_permissions', // Permissões do usuário
                'role_permissions', // Permissões dos papéis
                'session_data',     // Dados da sessão
                'access_matrix'     // Matriz de acesso
            ])->default('user_permissions');

            // Metadados do cache
            <field->json('metadata')->nullable(); // Metadados adicionais
            <field->integer('version')->default(1); // Versão dos dados cacheados
            <field->string('hash')->nullable(); // Hash para validação de integridade

            // Tempo e validade
            <field->timestamp('cached_at')->useCurrent();
            <field->timestamp('expires_at')->nullable(); // Data de expiração do cache
            <field->timestamp('last_used_at')->nullable(); // Última vez que foi usado
            <field->integer('hit_count')->default(0); // Contador de acessos

            // Status
            <field->enum('status', [
                'active',          // Cache ativo
                'expired',         // Cache expirado
                'invalidated',     // Cache invalidado
                'building',        // Em construção
                'failed'           // Falha na construção
            ])->default('active');

            // Sistema
            <field->string('cache_key')->nullable(); // Chave do cache
            <field->json('build_time')->nullable(); // Tempo de construção em ms
            <field->integer('memory_usage')->nullable(); // Uso de memória em bytes

            $table->timestamps();

            // Indexes
            $table->unique(['user_id', 'cache_type'], 'user_cache_unique');
            $table->index(['user_id', 'status']);
            $table->index(['cache_type', 'status']);
            $table->index(['expires_at']);
            $table->index('last_used_at');
            $table->index('cached_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_cache');
    }
};
