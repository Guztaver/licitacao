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
        Schema::table('contratos', function (Blueprint $table) {
            $table->foreignId('fiscal_id')->nullable()->after('usuario_criacao_id')->constrained('users')->comment('Fiscal do contrato responsável pelo acompanhamento');
            $table->date('data_designacao_fiscal')->nullable()->after('fiscal_id')->comment('Data de designação do fiscal');
            $table->text('observacoes_fiscal')->nullable()->after('data_designacao_fiscal')->comment('Observações do fiscal do contrato');

            $table->index('fiscal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contratos', function (Blueprint $table) {
            $table->dropIndex(['fiscal_id']);
            $table->dropForeign(['fiscal_id']);
            $table->dropColumn(['fiscal_id', 'data_designacao_fiscal', 'observacoes_fiscal']);
        });
    }
};