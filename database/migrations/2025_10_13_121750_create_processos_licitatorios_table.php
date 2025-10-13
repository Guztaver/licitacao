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
        Schema::create("processos_licitatorios", function (Blueprint $table) {
            $table->id();
            $table->string("numero_processo")->unique();
            $table->string("objeto");
            $table->text("descricao")->nullable();
            $table->enum("modalidade", [
                "pregao_eletronico",
                "pregao_presencial",
                "concorrencia",
                "tomada_precos",
                "convite",
                "dispensa",
                "inexigibilidade",
            ]);
            $table
                ->enum("tipo_licitacao", [
                    "menor_preco",
                    "melhor_tecnica",
                    "tecnica_preco",
                    "maior_lance",
                ])
                ->default("menor_preco");
            $table
                ->enum("status", [
                    "em_elaboracao",
                    "publicado",
                    "em_andamento",
                    "homologado",
                    "adjudicado",
                    "deserto",
                    "fracassado",
                    "revogado",
                    "anulado",
                    "suspenso",
                ])
                ->default("em_elaboracao");
            $table->date("data_abertura")->nullable();
            $table->date("data_homologacao")->nullable();
            $table->date("data_adjudicacao")->nullable();
            $table->decimal("valor_estimado", 15, 2)->nullable();
            $table->decimal("valor_adjudicado", 15, 2)->nullable();
            $table->string("setor_requisitante")->nullable();
            $table
                ->foreignId("usuario_responsavel_id")
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table
                ->foreignId("usuario_criacao_id")
                ->constrained("users")
                ->cascadeOnDelete();
            $table->text("observacoes")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("processos_licitatorios");
    }
};
