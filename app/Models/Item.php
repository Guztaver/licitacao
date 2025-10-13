<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        "codigo",
        "descricao",
        "unidade_medida",
        "preco_medio",
        "first_used_at",
        "last_used_at",
        "is_frozen",
        "frozen_description",
        "frozen_by_user_id",
        "frozen_at",
    ];

    protected $casts = [
        "preco_medio" => "decimal:2",
        "first_used_at" => "datetime",
        "last_used_at" => "datetime",
        "is_frozen" => "boolean",
        "frozen_at" => "datetime",
    ];

    protected $dates = ["first_used_at", "last_used_at", "frozen_at"];

    /**
     * Get the audit logs for the item.
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(ItemAuditLog::class)->orderBy(
            "created_at",
            "desc",
        );
    }

    /**
     * Get the contrato items for this item.
     */
    public function contratoItems(): HasMany
    {
        return $this->hasMany(ContratoItem::class);
    }

    /**
     * Get the pedido compra items for this item.
     */
    public function pedidoCompraItems(): HasMany
    {
        return $this->hasMany(PedidoCompraItem::class);
    }

    /**
     * Get the requisicao items for this item.
     */
    public function requisicaoItems(): HasMany
    {
        return $this->hasMany(RequisicaoItem::class);
    }

    /**
     * Get formatted preco medio.
     */
    public function getPrecoMedioFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->preco_medio, 2, ",", ".");
    }

    /**
     * Get display text for lists.
     */
    public function getDisplayTextAttribute(): string
    {
        return "{$this->codigo} - {$this->descricao}";
    }

    /**
     * Check if item can be edited.
     */
    public function podeEditar(): bool
    {
        return !$this->is_frozen;
    }

    /**
     * Check if description can be edited.
     */
    public function podeEditarDescricao(): bool
    {
        return !$this->is_frozen;
    }

    /**
     * Check if item has been used.
     */
    public function foiUtilizado(): bool
    {
        return $this->first_used_at !== null;
    }

    /**
     * Check if item should be frozen (used in any transaction).
     */
    public function deveSerCongelado(): bool
    {
        if ($this->is_frozen) {
            return true;
        }

        // Check if item is used in any contracts, orders, or requisitions
        $usageCount = $this->contratoItems()
            ->whereHas("contrato", function ($query) {
                $query->whereIn("status", [
                    "ativo",
                    "em_execucao",
                    "concluido",
                ]);
            })
            ->count();

        $usageCount += $this->pedidoCompraItems()
            ->whereHas("pedidoCompra", function ($query) {
                $query->whereIn("status", [
                    "aprovado",
                    "em_execucao",
                    "concluido",
                ]);
            })
            ->count();

        $usageCount += $this->requisicaoItems()
            ->whereHas("requisicao", function ($query) {
                $query->whereIn("status", ["autorizada", "concretizada"]);
            })
            ->count();

        return $usageCount > 0;
    }

    /**
     * Freeze the item description.
     */
    public function congelar(?int $userId = null): void
    {
        if (!$this->is_frozen) {
            $this->is_frozen = true;
            $this->frozen_description = $this->descricao;
            $this->frozen_by_user_id = $userId ?? auth()->id();
            $this->frozen_at = now();
            $this->save();

            // Log the freeze action
            ItemAuditLog::log(
                $this,
                "frozen",
                "descricao",
                null,
                $this->frozen_description,
                null,
                null,
            );
        }
    }

    /**
     * Record usage of the item.
     */
    public function registrarUso(string $contextType, int $contextId): void
    {
        $now = now();

        if (!$this->first_used_at) {
            $this->first_used_at = $now;
        }
        $this->last_used_at = $now;

        // Freeze the item if it should be frozen
        if ($this->deveSerCongelado()) {
            $this->congelar();
        } else {
            $this->save();
        }

        // Log the usage
        ItemAuditLog::log(
            $this,
            "updated",
            null,
            null,
            "Item utilizado em " . $contextType,
            $contextType,
            $contextId,
        );
    }

    /**
     * Check if a specific field can be edited.
     */
    public function podeEditarCampo(string $campo): bool
    {
        if ($this->is_frozen) {
            // These fields can never be edited when frozen
            $prohibitedFields = ["descricao", "codigo"];
            return !in_array($campo, $prohibitedFields);
        }

        return true;
    }

    /**
     * Update item with immutability checks.
     */
    public function atualizarComControle(
        array $attributes,
        ?int $userId = null,
    ): bool {
        foreach ($attributes as $campo => $valor) {
            if (!$this->podeEditarCampo($campo)) {
                // Log the attempted change
                ItemAuditLog::log(
                    $this,
                    "attempted_update",
                    $campo,
                    $this->getOriginal($campo),
                    $valor,
                    request()->route()->getName(),
                    null,
                );

                throw new \InvalidArgumentException(
                    "O campo '{$campo}' não pode ser alterado porque o material já foi utilizado.",
                );
            }
        }

        // Log successful changes
        foreach ($attributes as $campo => $valor) {
            if ($this->getOriginal($campo) != $valor) {
                ItemAuditLog::log(
                    $this,
                    "updated",
                    $campo,
                    $this->getOriginal($campo),
                    $valor,
                    request()->route()->getName(),
                    null,
                );
            }
        }

        return $this->update($attributes);
    }

    /**
     * Get usage statistics.
     */
    public function getEstatisticasUso(): array
    {
        return [
            "contratos_count" => $this->contratoItems()->count(),
            "pedidos_count" => $this->pedidoCompraItems()->count(),
            "requisicoes_count" => $this->requisicaoItems()->count(),
            "total_usages" =>
                $this->contratoItems()->count() +
                $this->pedidoCompraItems()->count() +
                $this->requisicaoItems()->count(),
            "first_used_at" => $this->first_used_at,
            "last_used_at" => $this->last_used_at,
            "is_frozen" => $this->is_frozen,
            "frozen_at" => $this->frozen_at,
            "frozen_by_user" => $this->frozen_by_user_id
                ? User::find($this->frozen_by_user_id)
                : null,
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Log creation
        static::created(function ($item) {
            ItemAuditLog::log(
                $item,
                "created",
                null,
                null,
                $item->descricao,
                null,
                null,
            );
        });

        // Check for usage and freeze on save
        static::saved(function ($item) {
            if ($item->deveSerCongelado() && !$item->is_frozen) {
                $item->congelar();
            }
        });
    }
}
