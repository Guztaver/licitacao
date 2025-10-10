<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contrato extends Model
{
    use HasFactory;

    protected $table = "contratos";

    protected $fillable = [
        "fornecedor_id",
        "numero_contrato",
        "data_inicio",
        "data_fim",
        "limite_requisicoes",
        "limite_conferencias",
        "descricao",
        "status",
        "usuario_criacao_id",
    ];

    protected $casts = [
        "data_inicio" => "date",
        "data_fim" => "date",
        "limite_requisicoes" => "integer",
        "limite_conferencias" => "integer",
    ];

    /**
     * Get the fornecedor that owns the contrato.
     *
     * @return BelongsTo<Fornecedor, Contrato>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the user who created the contrato.
     *
     * @return BelongsTo<User, Contrato>
     */
    public function usuarioCriacao(): BelongsTo
    {
        return $this->belongsTo(User::class, "usuario_criacao_id");
    }

    /**
     * Scope a query to only include active contratos.
     */
    public function scopeAtivo(Builder $query): Builder
    {
        return $query->where("status", "ativo");
    }

    /**
     * Scope a query to only include contratos valid for a specific date.
     */
    public function scopeVigenteEm(
        Builder $query,
        \DateTimeInterface $data,
    ): Builder {
        return $query
            ->where("data_inicio", "<=", $data)
            ->where("data_fim", ">=", $data);
    }

    /**
     * Scope a query for a specific fornecedor.
     */
    public function scopeFornecedor(Builder $query, int $fornecedorId): Builder
    {
        return $query->where("fornecedor_id", $fornecedorId);
    }

    /**
     * Check if contrato is currently valid.
     */
    public function isVigente(): bool
    {
        $hoje = now()->startOfDay();
        return $this->status === "ativo" &&
            $this->data_inicio <= $hoje &&
            $this->data_fim >= $hoje;
    }

    /**
     * Check if contrato is expired.
     */
    public function isExpirado(): bool
    {
        return $this->data_fim < now()->startOfDay();
    }

    /**
     * Check if contrato can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, ["ativo", "inativo"]);
    }

    /**
     * Check if contrato can be deleted.
     */
    public function podeExcluir(): bool
    {
        // Can only delete if no requisitions or conferences are linked
        $temRequisicoes = $this->getRequisicoes()->count() > 0;
        $temConferencias = $this->getConferencias()->count() > 0;

        return !$temRequisicoes && !$temConferencias;
    }

    /**
     * Get requisições linked to this contract.
     */
    public function getRequisicoes()
    {
        if (!$this->fornecedor_id) {
            return collect([]);
        }

        return Requisicao::query()
            ->where("fornecedor_id", $this->fornecedor_id)
            ->whereBetween("data_recebimento", [
                $this->data_inicio,
                $this->data_fim,
            ])
            ->where("status", "!=", "excluida")
            ->get();
    }

    /**
     * Get conferências linked to this contract.
     */
    public function getConferencias()
    {
        if (!$this->fornecedor_id) {
            return collect([]);
        }

        return Conferencia::query()
            ->where("fornecedor_id", $this->fornecedor_id)
            ->where(function ($query) {
                $query
                    ->whereBetween("periodo_inicio", [
                        $this->data_inicio,
                        $this->data_fim,
                    ])
                    ->orWhereBetween("periodo_fim", [
                        $this->data_inicio,
                        $this->data_fim,
                    ])
                    ->orWhere(function ($q) {
                        $q->where(
                            "periodo_inicio",
                            "<=",
                            $this->data_inicio,
                        )->where("periodo_fim", ">=", $this->data_fim);
                    });
            })
            ->get();
    }

    /**
     * Get count of requisições for this contract.
     */
    public function getCountRequisicoes(): int
    {
        return $this->getRequisicoes()->count();
    }

    /**
     * Get count of conferências for this contract.
     */
    public function getCountConferencias(): int
    {
        return $this->getConferencias()->count();
    }

    /**
     * Check if requisição limit is reached.
     */
    public function limiteRequisioesAtingido(): bool
    {
        // If no limit set, never reached
        if ($this->limite_requisicoes === null) {
            return false;
        }

        return $this->getCountRequisicoes() >= $this->limite_requisicoes;
    }

    /**
     * Check if conferência limit is reached.
     */
    public function limiteConferenciasAtingido(): bool
    {
        // If no limit set, never reached
        if ($this->limite_conferencias === null) {
            return false;
        }

        return $this->getCountConferencias() >= $this->limite_conferencias;
    }

    /**
     * Get remaining requisições count.
     */
    public function getRequisicoesRestantes(): ?int
    {
        if ($this->limite_requisicoes === null) {
            return null; // Unlimited
        }

        $restantes = $this->limite_requisicoes - $this->getCountRequisicoes();
        return max(0, $restantes);
    }

    /**
     * Get remaining conferências count.
     */
    public function getConferenciasRestantes(): ?int
    {
        if ($this->limite_conferencias === null) {
            return null; // Unlimited
        }

        $restantes = $this->limite_conferencias - $this->getCountConferencias();
        return max(0, $restantes);
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statusMap = [
            "ativo" => "Ativo",
            "inativo" => "Inativo",
            "expirado" => "Expirado",
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            "ativo" => "bg-green-100 text-green-800",
            "inativo" => "bg-gray-100 text-gray-800",
            "expirado" => "bg-red-100 text-red-800",
        ];

        return $colorMap[$this->status] ?? "bg-gray-100 text-gray-800";
    }

    /**
     * Get vigencia display.
     */
    public function getVigenciaDisplayAttribute(): string
    {
        $inicio = $this->data_inicio ? $this->data_inicio->format("d/m/Y") : "";
        $fim = $this->data_fim ? $this->data_fim->format("d/m/Y") : "";

        return $inicio . " a " . $fim;
    }

    /**
     * Update status based on dates.
     */
    public function atualizarStatus(): void
    {
        if ($this->isExpirado() && $this->status === "ativo") {
            $this->update(["status" => "expirado"]);
        }
    }

    /**
     * Find active contract for fornecedor and date.
     */
    public static function findContratoVigente(
        ?int $fornecedorId,
        \DateTimeInterface $data,
    ): ?self {
        if (!$fornecedorId) {
            return null;
        }

        return self::query()
            ->ativo()
            ->fornecedor($fornecedorId)
            ->vigenteEm($data)
            ->first();
    }

    /**
     * Find active contract for fornecedor (today).
     */
    public static function findContratoVigenteHoje(?int $fornecedorId): ?self
    {
        return self::findContratoVigente($fornecedorId, now());
    }
}
