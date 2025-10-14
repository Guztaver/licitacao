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
        Schema::create('contract_drafts', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Título da minuta de contrato');
            $table->text('description')->nullable()->comment('Descrição detalhada da solicitação');
            $table->string('status')->default('pending_analysis')->comment('Status da minuta de contrato');
            $table->foreignId('source_purchase_request_id')->constrained('purchase_requests')->comment('ID do pedido de compra original');
            $table->foreignId('requesting_department_id')->constrained('secretarias')->comment('ID da secretaria solicitante');
            $table->foreignId('requesting_user_id')->constrained('users')->comment('ID do usuário solicitante');
            $table->json('items')->comment('Itens da solicitação com preços pesquisados');
            $table->decimal('estimated_total_value', 15, 2)->nullable()->comment('Valor total estimado');
            $table->text('research_notes')->nullable()->comment('Notas da pesquisa de preços');
            $table->text('contract_notes')->nullable()->comment('Notas do setor de contratos');
            $table->string('priority_level')->default('medium')->comment('Nível de prioridade');
            $table->foreignId('created_by')->constrained('users')->comment('ID do usuário que criou a minuta');
            $table->timestamps();

            $table->index(['status', 'priority_level']);
            $table->index('source_purchase_request_id');
            $table->index('requesting_department_id');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_drafts');
    }
};
