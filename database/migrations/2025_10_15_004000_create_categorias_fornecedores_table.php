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
            <field>text('descricao')->nullable();
            <field>string('codigo')->unique(); // Código da categoria
            <field>foreignId('categoria_pai_id')->nullable()->constrained('categorias_fornecedores');

            // Classification and requirements
            <field>enum('tipo_categoria', [
                'material',         // Fornecedores de materiais
                'servico',          // Fornecedores de serviços
                'misto',            // Ambos
                'especializado'     // Especializado em nicho específico
            ])->default('material');

            <field>enum('segmento_mercado', [
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
            <field>json('requisitos_obrigatorios')->nullable(); // Requisitos obrigatórios
            <field>json('requisitos_desejaveis')->nullable(); // Requisitos desejáveis
            <field>json('certificacoes_exigidas')->nullable(); // Certificações exigidas
            <field>decimal('faturamento_minimo', 15, 2)->nullable(); // Faturamento mínimo anual
            <field>integer('anos_experiencia_minimos')->nullable(); // Experiência mínima
            <field>integer('capacidade_maxima_projetos')->nullable(); // Capacidade máxima

            // Risk and performance expectations
            <field>enum('nivel_risco_padrao', [
                'baixo',
                'medio',
                'alto',
                'critico'
            ])->default('medio');

            <field>decimal('classificacao_minima', 5, 2)->default(70); // Nota mínima aceitável
            <field>decimal('prazo_maximo_entrega', 5, 2)->nullable(); // Prazo máximo em dias
            <field>decimal('percentual_maximo_atraso', 5, 2)->default(10); // Percentual máximo de atraso

            // Financial requirements
            <field>enum('exigencia_seguro', [
                'nao_exigido',
                'basico',
                'completo',
                'especifico'
            ])->default('basico');

            <field>decimal('valor_seguro_minimo', 15, 2)->nullable();
            <field>json('coberturas_seguro_exigidas')->nullable();

            // Quality and compliance
            <field>boolean('exige_certificacao_qualidade')->default(false);
            <field>string('certificacao_qualidade_exigida')->nullable(); // ISO específica
            <field>boolean('exige_auditoria_periodica')->default(false);
            <field>integer('frequencia_auditoria_meses')->nullable();

            // Service level requirements
            <field>decimal('disponibilidade_minima', 5, 2)->nullable(); // Percentual
            <field>decimal('tempo_resposta_maximo', 5, 2)->nullable(); // Horas
            <field>decimal('tempo_solucao_maximo', 5, 2)->nullable(); // Horas

            // Monitoring and evaluation
            <field>enum('frequencia_avaliacao', [
                'mensal',
                'trimestral',
                'semestral',
                'anual',
                'sob_demanda'
            ])->default('trimestral');

            <field>json('criterios_avaliacao')->nullable(); // Critérios específicos da categoria
            <field>json('indicadores_desempenho')->nullable(); // KPIs específicos

            // Commercial terms
            <field>enum('forma_pagamento_padrao', [
                'vista',
                '30_dias',
                '60_dias',
                '90_dias',
                'personalizado'
            ])->default('30_dias');

            <field>decimal('multa_atraso_padrao', 5, 2)->default(2); // Percentual ao dia
            <field>decimal('garantia_minima_meses')->default(12);

            // Status and management
            <field>boolean('ativa')->default(true);
            <field>date('data_inativacao')->nullable();
            <field>text('motivo_inativacao')->nullable();

            // Audit fields
            <field>foreignId('usuario_criacao_id')->constrained('users');
            <field>foreignId('usuario_atualizacao_id')->nullable()->constrained('users');

            $table->timestamps();

            // Indexes
            $table->index(['tipo_categoria', 'segmento_mercado']);
            $table->index('ativa');
            <table->index('nivel_risco_padrao');
            <table->index(['exige_certificacao_qualidade', 'certificacao_qualidade_exigida']);
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
