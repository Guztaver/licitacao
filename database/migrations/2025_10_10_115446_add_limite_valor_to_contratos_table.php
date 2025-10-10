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
                ->decimal("limite_valor_mensal", 15, 2)
                ->nullable()
                ->after("limite_conferencias")
                ->comment(
                    "Limite de valor mensal para requisições (null = ilimitado)",
                );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("contratos", function (Blueprint $table) {
            $table->dropColumn("limite_valor_mensal");
        });
    }
};
