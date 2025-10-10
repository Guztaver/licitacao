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
        Schema::create("contratos", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("fornecedor_id")
                ->nullable()
                ->constrained("fornecedores")
                ->onDelete("cascade");
            $table->string("numero_contrato")->unique();
            $table->date("data_inicio");
            $table->date("data_fim");
            $table
                ->integer("limite_requisicoes")
                ->nullable()
                ->comment(
                    "Limite de requisições para este contrato (null = ilimitado)",
                );
            $table
                ->integer("limite_conferencias")
                ->nullable()
                ->comment(
                    "Limite de conferências para este contrato (null = ilimitado)",
                );
            $table->text("descricao")->nullable();
            $table
                ->enum("status", ["ativo", "inativo", "expirado"])
                ->default("ativo");
            $table
                ->foreignId("usuario_criacao_id")
                ->nullable()
                ->constrained("users")
                ->onDelete("set null");
            $table->timestamps();

            $table->index(["fornecedor_id"]);
            $table->index(["status"]);
            $table->index(["data_inicio", "data_fim"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("contratos");
    }
};
