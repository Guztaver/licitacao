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
        Schema::create('categorias_fornecedores', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->string('codigo')->unique(); // Código da categoria
            $table->foreignId('categoria_pai_id')->nullable()->constrained('categorias_fornecedores');

            // Classification and requirements
            $table->enum('tipo_categoria', [
                'material',         // Fornecedores de materiais
                'servico',          // Fornecedores de serviços
                'misto',            // Ambos
                'especializado'     // Especializado em nicho específico
            ])->default('material');

            $table->enum('segmento_mercado', [
                'construcao_civil', // Construção civil
                'tecnologia',       // TI e tecnologia
                'saude',           // Saúde
                'educacao',        // Educação
                'alimentacao',     // Alimentação
                'transporte',      // Transporte e logística
                'energia',         // Energia e utilities
                'telecomunicacoes', // Telecomunicações
                'consultoria',     // Consultoria e serviços profissionais
                'outros'           // Outros segmentos
            ])->nullable();

            // Requirements for this category
            $table->json('requisitos_obrigatorios')->nullable(); // Requisitos obrigatórios
            $table->json('requisitos_desejaveis')->nullable(); // Requisitos desejáveis
            $table->json('certificacoes_exigidas')->nullable(); // Certificações exigidas
            $table->decimal('faturamento_minimo', 15, 2)->nullable(); // Faturamento mínimo anual
            $table->integer('anos_experiencia_minimos')->nullable(); // Experiência mínima
            $table->integer('capacidade_maxima_projetos')->nullable(); // Capacidade máxima

            // Risk and performance expectations
            $table->enum('nivel_risco_padrao', [
                'baixo',
                'medio',
                'alto',
                'critico'
            ])->default('medio');

            $table->decimal('classificacao_minima', 5, 2)->default(70); // Nota mínima aceitável
            $table->decimal('prazo_maximo_entrega', 5, 2)->nullable(); // Prazo máximo em dias
            $table->decimal('percentual_maximo_atraso', 5, 2)->default(10); // Percentual máximo de atraso

            // Financial requirements
            $table->enum('exigencia_seguro', [
                'nao_exigido',
                'basico',
                'completo',
                'especifico'
            ])->default('basico');

            $table->decimal('valor_seguro_minimo', 15, 2)->nullable();
            $table->json('coberturas_seguro_exigidas')->nullable();

            // Quality and compliance
            $table->boolean('exige_certificacao_qualidade')->default(false);
            $table->string('certificacao_qualidade_exigida')->nullable(); // ISO específica
            $table->boolean('exige_auditoria_periodica')->default(false);
            $table->integer('frequencia_auditoria_meses')->nullable();

            // Service level requirements
            $table->decimal('disponibilidade_minima', 5, 2)->nullable(); // Percentual
            $table->decimal('tempo_resposta_maximo', 5, 2)->nullable(); // Horas
            $table->decimal('tempo_solucao_maximo', 5, 2)->nullable(); // Horas

            // Monitoring and evaluation
            $table->enum('frequencia_avaliacao', [
                'mensal',
                'trimestral',
                'semestral',
                'anual',
                'sob_demanda'
            ])->default('trimestral');

            $table->json('criterios_avaliacao')->nullable(); // Critérios específicos da categoria
            $table->json('indicadores_desempenho')->nullable(); // KPIs específicos

            // Commercial terms
            $table->enum('forma_pagamento_padrao', [
                'vista',
                '30_dias',
                '60_dias',
                '90_dias',
                'personalizado'
            ])->default('30_dias');

            $table->decimal('multa_atraso_padrao', 5, 2)->default(2); // Percentual ao dia
            $table->decimal('garantia_minima_meses')->default(12);

            // Status and management
            $table->boolean('ativa')->default(true);
            $table->date('data_inativacao')->nullable();
            $table->text('motivo_inativacao')->nullable();

            // Audit fields
            $table->foreignId('usuario_criacao_id')->constrained('users');
            $table->foreignId('usuario_atualizacao_id')->nullable()->constrained('users');

            $table->timestamps();

            // Indexes
            $table->index(['tipo_categoria', 'segmento_mercado']);
            $table->index('ativa');
            $table->index('nivel_risco_padrao');
            $table->index(['exige_certificacao_qualidade', 'certificacao_qualidade_exigida']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias_fornecedores');
    }
};
