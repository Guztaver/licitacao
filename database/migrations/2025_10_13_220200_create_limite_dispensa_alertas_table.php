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
        Schema::create('limite_dispensa_alertas', function (Blueprint $table) {
            $table->id();

            // Relacionamentos
            $table->foreignId('categoria_material_id')->constrained('categoria_materiais')->onDelete('cascade');
            $table->foreignId('dispensa_licitacao_id')->nullable()->constrained('dispensa_licitacoes')->onDelete('cascade');
            $table->foreignId('secretaria_id')->nullable()->constrained('secretarias')->onDelete('cascade');

            // Tipo e nível do alerta
            $table->enum('tipo_alerta', ['limite_atingido', 'limite_excedido', 'bloqueio', 'aviso_previo']); // Tipo de alerta
            $table->enum('nivel_severidade', ['baixo', 'medio', 'alto', 'critico']); // Nível de severidade
            $table->enum('status', ['ativo', 'visualizado', 'resolvido', 'ignorado'])->default('ativo'); // Status do alerta

            // Valores e limites
            $table->decimal('valor_acumulado', 15, 2); // Valor acumulado no período
            $table->decimal('limite_aplicavel', 15, 2); // Limite aplicável
            $table->decimal('percentual_utilizado', 5, 2); // Percentual utilizado
            $table->decimal('valor_excedido', 15, 2)->default(0); // Valor excedido

            // Período do alerta
            $table->date('periodo_inicio'); // Início do período
            $table->date('periodo_fim'); // Fim do período
            $table->enum('periodo_tipo', ['mensal', 'anual']); // Tipo de período

            // Mensagens e ações
            $table->string('titulo', 200); // Título do alerta
            $table->text('mensagem'); // Mensagem detalhada
            $table->text('recomendacao')->nullable(); // Recomendações
            $table->text('acao_requerida')->nullable(); // Ação requerida

            // Controle de notificação
            $table->boolean('notificado')->default(false); // Se foi notificado
            $table->timestamp('data_notificacao')->nullable(); // Data da notificação
            $table->json('destinatarios_notificados')->nullable(); // JSON com destinatários notificados

            // Auditoria
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('resolved_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('resolucao')->nullable(); // Como foi resolvido
            $table->timestamp('data_resolucao')->nullable(); // Data da resolução
            $table->timestamps();

            // Índices
            $table->index(['categoria_material_id']);
            $table->index(['dispensa_licitacao_id']);
            $table->index(['secretaria_id']);
            $table->index(['tipo_alerta']);
            $table->index(['nivel_severidade']);
            $table->index(['status']);
            $table->index(['notificado']);
            $table->index(['periodo_tipo']);
            $table->index(['data_notificacao']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('limite_dispensa_alertas');
    }
};
