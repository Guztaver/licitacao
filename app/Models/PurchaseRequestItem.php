<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_request_id',
        'item_id',
        'descricao_material',
        'quantidade_solicitada',
        'unidade_medida',
        'valor_unitario_estimado',
        'valor_total_estimado',
        'especificacoes',
        'observacoes',
    ];

    protected $casts = [
        'quantidade_solicitada' => 'decimal:3',
        'valor_unitario_estimado' => 'decimal:2',
        'valor_total_estimado' => 'decimal:2',
    ];

    /**
     * Get the purchase request that owns the item.
     *
     * @return BelongsTo<PurchaseRequest, PurchaseRequestItem>
     */
    public function purchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class);
    }

    /**
     * Get the item that owns the purchase request item.
     *
     * @return BelongsTo<Item, PurchaseRequestItem>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get formatted quantidade solicitada.
     */
    public function getQuantidadeSolicitadaFormatadaAttribute(): string
    {
        return number_format($this->quantidade_solicitada, 3, ',', '.');
    }

    /**
     * Get formatted valor unitario estimado.
     */
    public function getValorUnitarioEstimadoFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->valor_unitario_estimado, 2, ',', '.');
    }

    /**
     * Get formatted valor total estimado.
     */
    public function getValorTotalEstimadoFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->valor_total_estimado, 2, ',', '.');
    }

    /**
     * Check if item can be edited.
     */
    public function podeEditar(): bool
    {
        return $this->purchaseRequest && $this->purchaseRequest->status === PurchaseRequest::STATUS_DRAFT;
    }

    /**
     * Recalculate total value.
     */
    public function recalcularValorTotal(): void
    {
        $this->valor_total_estimado = $this->quantidade_solicitada * $this->valor_unitario_estimado;
        $this->save();
    }

    /**
     * Get unique key for aggregation (normalized description + unit of measure)
     */
    public function getAggregationKey(): string
    {
        return strtolower(trim($this->descricao_material)) . '|' . strtolower(trim($this->unidade_medida));
    }
}
