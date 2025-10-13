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
            $table->decimal('classificacao_categoria', 5, 2)->default(0); // Nota específica da categoria
            $table->integer('total_projetos_categoria')->default(0);
            $table->decimal('valor_total_categoria', 15, 2)->default(0);

            // Specific capabilities and services
            $table->json('servicos_ofertados')->nullable(); // Serviços específicos da categoria
            $table->json('capacidades_tecnicas')->nullable(); // Capacidades técnicas
            $table->json('equipamentos_disponiveis')->nullable(); // Equipamentos disponíveis
            $table->json('equipe_especializada')->nullable(); // Equipes especializadas

            // References and portfolio
            $table->json('referencias_cliente')->nullable(); // Referências de clientes na categoria
            $table->json('portfolio_projetos')->nullable(); // Portfólio de projetos

            // Certifications specific to category
            $table->json('certificacoes_categoria')->nullable(); // Certificações específicas
            $table->json('qualificacoes_equipe')->nullable(); // Qualificações da equipe

            // Commercial terms for category
            $table->decimal('valor_hora_categoria', 15, 2)->nullable(); // Valor por hora específico
            $table->enum('forma_pagamento_categoria', [
                'padrao',
                'personalizado'
            ])->default('padrao');

            // Capacity and availability
            $table->integer('capacidade_maxima_simultanea')->nullable(); // Projetos simultâneos
            $table->integer('equipe_disponivel')->nullable();
            $table->integer('tempo_medio_entrega_categoria')->nullable(); // Dias

            // Status and validation
            $table->enum('status_categoria', [
                'em_analise',      // Em análise
                'aprovada',        // Aprovada para fornecer nesta categoria
                'suspensa',        // Suspensa temporariamente
                'rejeitada',       // Rejeitada para esta categoria
                'desativada'       // Desativada pelo fornecedor
            ])->default('em_analise');

            $table->date('data_aprovacao')->nullable();
            $table->date('data_renovacao')->nullable();
            $table->date('data_validade')->nullable();

            // Quality metrics specific to category
            $table->decimal('taxa_sucesso_categoria', 5, 2)->nullable(); // Percentual de sucesso
            $table->integer('reclamacoes_categoria')->default(0);
            $table->integer('devolucoes_categoria')->default(0);

            // Evaluation and monitoring
            $table->foreignId('avaliador_id')->nullable()->constrained('users');
            $table->date('data_ultima_avaliacao_categoria')->nullable();
            $table->date('data_proxima_avaliacao_categoria')->nullable();
            $table->text('observacoes_avaliacao')->nullable();

            // Priority and preference
            $table->enum('nivel_preferencia', [
                'baixa',
                'normal',
                'preferencial',
                'exclusiva'
            ])->default('normal');

            // Special conditions
            $table->json('condicoes_especiais')->nullable(); // Condições especiais
            $table->json('restricoes')->nullable(); // Restrições específicas

            $table->timestamps();

            // Indexes
            $table->unique(['fornecedor_id', 'categoria_fornecedor_id']);
            $table->index(['categoria_fornecedor_id', 'status_categoria']);
            $table->index(['fornecedor_id', 'nivel_expertise']);
            $table->index(['status_categoria', 'nivel_preferencia']);
            $table->index('classificacao_categoria');
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
