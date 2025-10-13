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
        Schema::create("contrato_items", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("contrato_id")
                ->constrained("contratos")
                ->onDelete("cascade");
            $table
                ->foreignId("item_id")
                ->constrained("items")
                ->onDelete("cascade");
            $table->integer("quantidade")->unsigned();
            $table->decimal("valor_unitario", 15, 2);
            $table->decimal("valor_total", 15, 2);
            $table->string("marca")->nullable();
            $table->string("unidade_medida", 50)->nullable();
            $table->text("especificacao")->nullable();
            $table->text("observacoes")->nullable();
            $table->timestamps();

            $table->index(["contrato_id", "item_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("contrato_items");
    }
};
