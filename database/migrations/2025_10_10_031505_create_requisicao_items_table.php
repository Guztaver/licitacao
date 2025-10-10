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
        Schema::create("requisicao_items", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("requisicao_id")
                ->constrained("requisicoes")
                ->onDelete("cascade");
            $table
                ->foreignId("item_id")
                ->constrained("items")
                ->onDelete("cascade");
            $table->integer("quantidade_solicitada")->unsigned();
            $table->decimal("valor_unitario_maximo", 15, 2);
            $table->decimal("valor_total_maximo", 15, 2);
            $table->text("observacao")->nullable();
            $table->timestamps();

            $table->index(["requisicao_id", "item_id"]);
            $table->unique(["requisicao_id", "item_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("requisicao_items");
    }
};
