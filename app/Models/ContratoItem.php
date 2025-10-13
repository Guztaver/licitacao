<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContratoItem extends Model
{
    use HasFactory;

    protected $table = "contrato_items";

    protected $fillable = [
        "contrato_id",
        "item_id",
        "quantidade",
        "valor_unitario",
        "valor_total",
        "marca",
        "unidade_medida",
        "especificacao",
        "observacoes",
    ];

    protected $casts = [
        "quantidade" => "integer",
        "valor_unitario" => "decimal:2",
        "valor_total" => "decimal:2",
    ];

    /**
     * Get the contrato that owns the item.
     */
    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }

    /**
     * Get the item details.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Calculate total value before saving
        static::saving(function ($contratoItem) {
            if ($contratoItem->quantidade && $contratoItem->valor_unitario) {
                $contratoItem->valor_total =
                    $contratoItem->quantidade * $contratoItem->valor_unitario;
            }
        });
    }

    /**
     * Get formatted valor unitario.
     */
    public function getValorUnitarioFormattedAttribute(): string
    {
        return 'R$ ' .
            number_format((float) $this->valor_unitario, 2, ",", ".");
    }

    /**
     * Get formatted valor total.
     */
    public function getValorTotalFormattedAttribute(): string
    {
        return 'R$ ' . number_format((float) $this->valor_total, 2, ",", ".");
    }

    /**
     * Get item description.
     */
    public function getItemDescricaoAttribute(): ?string
    {
        return $this->item?->descricao;
    }

    /**
     * Get item codigo.
     */
    public function getItemCodigoAttribute(): ?string
    {
        return $this->item?->codigo;
    }
}
