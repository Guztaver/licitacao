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
        Schema::create('integracoes_patrimonio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requisicao_id')->constrained()->comment('Requisição que originou a integração');
            $table->foreignId('contrato_item_id')->nullable()->constrained()->comment('Item do contrato vinculado');
            $table->foreignId('item_id')->constrained()->comment('Item do sistema de licitações');
            $table->string('patrimonio_id')->nullable()->comment('ID do item no sistema patrimonial');
            $table->string('codigo_tombamento')->nullable()->comment('Código de tombamento do bem');

            // Status da integração
            $table->enum('status', [
                'pendente',        // Aguardando integração
                'integrando',      // Em processo de integração
                'integrado',       // Integrado com sucesso
                'erro',           // Erro na integração
                'rejeitado'       // Rejeitado pelo sistema patrimonial
            ])->default('pendente');

            // Dados do bem para integração
            $table->string('nome_bem')->comment('Nome/descrição do bem');
            $table->decimal('valor_aquisicao', 15, 2)->comment('Valor de aquisição');
            $table->date('data_aquisicao')->comment('Data de aquisição');
            $table->string('localizacao')->nullable()->comment('Localização do bem');
            $table->string('responsavel')->nullable()->comment('Responsável pelo bem');
            $table->string('setor')->nullable()->comment('Setor/unidade do bem');

            // Dados técnicos
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->string('numero_serie')->nullable()->comment('Número de série do bem');
            $table->string('placa')->nullable()->comment('Placa de identificação');
            $table->text('caracteristicas')->nullable()->comment('Características técnicas do bem');

            // Controle da integração
            $table->json('dados_integracao')->nullable()->comment('Dados enviados para o sistema patrimonial');
            $table->json('resposta_integracao')->nullable()->comment('Resposta do sistema patrimonial');
            $table->text('erro_integracao')->nullable()->comment('Mensagem de erro na integração');
            $table->integer('tentativas')->default(0)->comment('Número de tentativas de integração');

            // Auditoria
            $table->foreignId('usuario_solicitacao_id')->constrained('users')->comment('Usuário que solicitou a integração');
            $table->timestamp('data_solicitacao')->useCurrent()->comment('Data da solicitação');
            $table->timestamp('data_integracao')->nullable()->comment('Data da integração');
            $table->timestamp('proxima_tentativa')->nullable()->comment('Próxima tentativa de integração');

            $table->timestamps();

            // Índices
            $table->index(['status', 'data_solicitacao']);
            $table->index('patrimonio_id');
            $table->index('codigo_tombamento');
            $table->index('requisicao_id');
            $table->index(['item_id', 'status']);
            $table->index('proxima_tentativa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integracoes_patrimonio');
    }
};