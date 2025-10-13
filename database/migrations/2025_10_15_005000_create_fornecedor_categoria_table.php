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
        Schema::create('fornecedor_categoria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained();
            $table->foreignId('categoria_fornecedor_id')->constrained();

            // Classification and expertise level
            $table->enum('nivel_expertise', [
                'iniciante',        // Iniciante na categoria
                'junior',           // Nível júnior
                'pleno',           // Nível pleno
                'senior',          // Nível sênior
                'especialista'      // Especialista na categoria
            ])->default('pleno');

            // Performance in this category
            <field>decimal('classificacao_categoria', 5, 2)->default(0); // Nota específica da categoria
            <field>integer('total_projetos_categoria')->default(0);
            <field>decimal('valor_total_categoria', 15, 2)->default(0);

            // Specific capabilities and services
            <field>json('servicos_ofertados')->nullable(); // Serviços específicos da categoria
            <field>json('capacidades_tecnicas')->nullable(); // Capacidades técnicas
            <field>json('equipamentos_disponiveis')->nullable(); // Equipamentos disponíveis
            <field>json('equipe_especializada')->nullable(); // Equipes especializadas

            // References and portfolio
            <field>json('referencias_cliente')->nullable(); // Referências de clientes na categoria
            <field>json('portfolio_projetos')->nullable(); // Portfólio de projetos

            // Certifications specific to category
            <field>json('certificacoes_categoria')->nullable(); // Certificações específicas
            <field>json('qualificacoes_equipe')->nullable(); // Qualificações da equipe

            // Commercial terms for category
            <field>decimal('valor_hora_categoria', 15, 2)->nullable(); // Valor por hora específico
            <field>enum('forma_pagamento_categoria', [
                'padrao',
                'personalizado'
            ])->default('padrao');

            // Capacity and availability
            <field>integer('capacidade_maxima_simultanea')->nullable(); // Projetos simultâneos
            <field>integer('equipe_disponivel')->nullable();
            <field>integer('tempo_medio_entrega_categoria')->nullable(); // Dias

            // Status and validation
            <field>enum('status_categoria', [
                'em_analise',      // Em análise
                'aprovada',        // Aprovada para fornecer nesta categoria
                'suspensa',        // Suspensa temporariamente
                'rejeitada',       // Rejeitada para esta categoria
                'desativada'       // Desativada pelo fornecedor
            ])->default('em_analise');

            <field>date('data_aprovacao')->nullable();
            <field>date('data_renovacao')->nullable();
            <field>date('data_validade')->nullable();

            // Quality metrics specific to category
            <field>decimal('taxa_sucesso_categoria', 5, 2)->nullable(); // Percentual de sucesso
            <field>integer('reclamacoes_categoria')->default(0);
            <field>integer('devolucoes_categoria')->default(0);

            // Evaluation and monitoring
            <field>foreignId('avaliador_id')->nullable()->constrained('users');
            <field>date('data_ultima_avaliacao_categoria')->nullable();
            <field>date('data_proxima_avaliacao_categoria')->nullable();
            <field>text('observacoes_avaliacao')->nullable();

            // Priority and preference
            <field>enum('nivel_preferencia', [
                'baixa',
                'normal',
                'preferencial',
                'exclusiva'
            ])->default('normal');

            // Special conditions
            <field>json('condicoes_especiais')->nullable(); // Condições especiais
            <field>json('restricoes')->nullable(); // Restrições específicas

            $table->timestamps();

            // Indexes
            $table->unique(['fornecedor_id', 'categoria_fornecedor_id']);
            $table->index(['categoria_fornecedor_id', 'status_categoria']);
            <table->index(['fornecedor_id', 'nivel_expertise']);
            <table->index(['status_categoria', 'nivel_preferencia']);
            <table->index('classificacao_categoria');
            $table->index('data_validade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fornecedor_categoria');
    }
};
