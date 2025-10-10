<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContratoHistoricoLimite extends Model
{
    use HasFactory;

    protected $table = "contrato_historico_limites";

    protected $fillable = [
        "contrato_id",
        "usuario_id",
        "tipo_alteracao",
        "campo_alterado",
        "valor_anterior",
        "valor_novo",
        "diferenca",
        "descricao",
    ];

    protected $casts = [
        "valor_anterior" => "decimal:2",
        "valor_novo" => "decimal:2",
        "diferenca" => "decimal:2",
        "created_at" => "datetime",
        "updated_at" => "datetime",
    ];

    /**
     * Get the contrato that owns the historico.
     *
     * @return BelongsTo<Contrato, ContratoHistoricoLimite>
     */
    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }

    /**
     * Get the user who made the change.
     *
     * @return BelongsTo<User, ContratoHistoricoLimite>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get campo display name.
     */
    public function getCampoDisplayAttribute(): string
    {
        $campoMap = [
            "limite_requisicoes" => "Limite de Requisições",
            "limite_conferencias" => "Limite de Conferências",
            "limite_valor_mensal" => "Limite de Valor Mensal",
        ];

        return $campoMap[$this->campo_alterado] ?? $this->campo_alterado;
    }

    /**
     * Get tipo display name.
     */
    public function getTipoDisplayAttribute(): string
    {
        $tipoMap = [
            "criacao" => "Criação",
            "atualizacao" => "Atualização",
        ];

        return $tipoMap[$this->tipo_alteracao] ?? $this->tipo_alteracao;
    }

    /**
     * Get display message for the change.
     */
    public function getMensagemAttribute(): string
    {
        if ($this->tipo_alteracao === "criacao") {
            if ($this->valor_novo === null) {
                return "Criado como ilimitado";
            }
            return "Criado com valor: " .
                $this->formatarValor($this->valor_novo);
        }

        // Atualização
        $valorAnterior =
            $this->valor_anterior === null
                ? "ilimitado"
                : $this->formatarValor($this->valor_anterior);
        $valorNovo =
            $this->valor_novo === null
                ? "ilimitado"
                : $this->formatarValor($this->valor_novo);

        return "Alterado de {$valorAnterior} para {$valorNovo}";
    }

    /**
     * Format value based on field type.
     */
    private function formatarValor(?float $valor): string
    {
        if ($valor === null) {
            return "ilimitado";
        }

        if ($this->campo_alterado === "limite_valor_mensal") {
            return "R$ " . number_format($valor, 2, ",", ".");
        }

        return number_format($valor, 0, ",", ".");
    }

    /**
     * Get icon color based on change type.
     */
    public function getIconColorAttribute(): string
    {
        if ($this->tipo_alteracao === "criacao") {
            return "text-blue-600";
        }

        if ($this->diferenca === null || $this->diferenca == 0) {
            return "text-gray-600";
        }

        // Positive difference = increase
        return $this->diferenca > 0 ? "text-green-600" : "text-red-600";
    }

    /**
     * Get badge color based on field type.
     */
    public function getBadgeColorAttribute(): string
    {
        $colorMap = [
            "limite_requisicoes" => "bg-blue-100 text-blue-800",
            "limite_conferencias" => "bg-purple-100 text-purple-800",
            "limite_valor_mensal" => "bg-green-100 text-green-800",
        ];

        return $colorMap[$this->campo_alterado] ?? "bg-gray-100 text-gray-800";
    }

    /**
     * Static method to register a creation event.
     */
    public static function registrarCriacao(
        Contrato $contrato,
        ?int $usuarioId,
    ): void {
        $campos = [
            "limite_requisicoes" => $contrato->limite_requisicoes,
            "limite_conferencias" => $contrato->limite_conferencias,
            "limite_valor_mensal" => $contrato->limite_valor_mensal,
        ];

        foreach ($campos as $campo => $valor) {
            self::create([
                "contrato_id" => $contrato->id,
                "usuario_id" => $usuarioId,
                "tipo_alteracao" => "criacao",
                "campo_alterado" => $campo,
                "valor_anterior" => null,
                "valor_novo" => $valor,
                "diferenca" => $valor,
                "descricao" => "Limite inicial definido na criação do contrato",
            ]);
        }
    }

    /**
     * Static method to register an update event.
     */
    public static function registrarAtualizacao(
        Contrato $contrato,
        array $alteracoes,
        ?int $usuarioId,
        ?string $descricao = null,
    ): void {
        foreach ($alteracoes as $campo => $valores) {
            $valorAnterior = $valores["anterior"];
            $valorNovo = $valores["novo"];

            // Calculate difference (handling nulls as 0 for calculation)
            $diffAnterior = $valorAnterior ?? 0;
            $diffNovo = $valorNovo ?? 0;
            $diferenca = $diffNovo - $diffAnterior;

            self::create([
                "contrato_id" => $contrato->id,
                "usuario_id" => $usuarioId,
                "tipo_alteracao" => "atualizacao",
                "campo_alterado" => $campo,
                "valor_anterior" => $valorAnterior,
                "valor_novo" => $valorNovo,
                "diferenca" => $diferenca,
                "descricao" => $descricao ?? "Limite atualizado",
            ]);
        }
    }
}
