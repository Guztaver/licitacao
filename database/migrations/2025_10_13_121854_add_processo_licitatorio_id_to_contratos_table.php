<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("contratos", function (Blueprint $table) {
            $table
                ->foreignId("processo_licitatorio_id")
                ->nullable()
                ->after("fornecedor_id")
                ->constrained("processos_licitatorios")
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("contratos", function (Blueprint $table) {
            $table->dropForeign(["processo_licitatorio_id"]);
            $table->dropColumn("processo_licitatorio_id");
        });
    }
};
