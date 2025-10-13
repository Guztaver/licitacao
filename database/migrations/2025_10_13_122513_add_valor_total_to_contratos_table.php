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
                ->decimal("valor_total", 15, 2)
                ->nullable()
                ->after("descricao")
                ->comment("Valor total do contrato (soma dos itens)");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("contratos", function (Blueprint $table) {
            $table->dropColumn("valor_total");
        });
    }
};
