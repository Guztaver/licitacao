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
        Schema::create('certificacoes_fornecedores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained();

            // Certification details
            $table->string('nome_certificacao'); // ISO 9001, ISO 14001, OHSAS 18001, etc.
            $table->string('numero_certificado')->unique();
            $table->string('orgao_certificador'); // Entidade certificadora
            $table->enum('tipo_certificacao', [
                'qualidade',        // ISO 9001
                'ambiental',        // ISO 14001
                'seguranca',        // OHSAS 18001/ISO 45001
                'social',           // SA 8000
                'especifica',       // Certificações específicas do setor
                'outros'
            ]);

            // Validity period
            $table->date('data_emissao');
            $table->date('data_validade');
            $table->date('data_ultima_auditoria')->nullable();
            $table->date('data_proxima_auditoria')->nullable();

            // Scope and coverage
            $table->text('escopo')->nullable(); // Escopo da certificação
            $table->json('normas_aplicaveis')->nullable(); // Normas aplicáveis
            $table->text('localidades_cobertas')->nullable(); // Unidades/endereços cobertos

            // Status
            $table->enum('status_certificacao', [
                'ativa',            // Certificação válida
                'suspensa',         // Suspensa temporariamente
                'cancelada',        // Cancelada
                'vencida',          // Vencida
                'em_renovacao',     // Em processo de renovação
                'revogada'          // Revogada pelo órgão certificador
            ])->default('ativa');

            // Audit information
            $table->enum('resultado_auditoria', [
                'aprovado',         // Aprovado sem não conformidades
                'aprovado_nc',      // Aprovado com não conformidades menores
                'reprovado',        // Reprovado
                'em_andamento'      // Auditoria em andamento
            ])->nullable();

            $table->integer('nao_conformidades_encontradas')->default(0);
            $table->integer('nao_conformidades_menores')->default(0);
            $table->integer('nao_conformidades_maiores')->default(0);
            $table->integer('nao_conformidades_criticas')->default(0);

            // Documents and evidence
            $table->string('caminho_certificado')->nullable(); // Path do arquivo PDF
            $table->string('caminho_relatorio_auditoria')->nullable();
            $table->json('documentos_comprobatorios')->nullable(); // Array de paths de documentos

            // Monitoring and follow-up
            $table->boolean('requer_acao_corretiva')->default(false);
            $table->date('data_limite_acoes')->nullable();
            $table->enum('status_acoes_corretivas', [
                'nao_aplicavel',
                'pendente',
                'em_andamento',
                'concluida',
                'atrasada'
            ])->default('nao_aplicavel');

            // Risk assessment
            $table->enum('nivel_risco_certificacao', [
                'baixo',           // Sem não conformidades ou apenas menores
                'medio',           // Algumas não conformidades menores
                'alto',            // Não conformidades maiores
                'critico'          // Não conformidades críticas ou múltiplos problemas
            ])->nullable();

            // Additional information
            $table->text('observacoes')->nullable();
            $table->foreignId('usuario_cadastro_id')->constrained('users');
            $table->foreignId('responsavel_acompanhamento_id')->nullable()->constrained('users');

            $table->timestamps();

            // Indexes
            $table->index(['fornecedor_id', 'status_certificacao']);
            $table->index(['fornecedor_id', 'data_validade']);
            $table->index('tipo_certificacao');
            $table->index('status_certificacao');
            $table->index('data_validade');
            $table->index('data_proxima_auditoria');
            $table->index(['requer_acao_corretiva', 'status_acoes_corretivas']);

            // Constraints
            $table->unique(['fornecedor_id', 'nome_certificacao', 'numero_certificado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificacoes_fornecedores');
    }
};
