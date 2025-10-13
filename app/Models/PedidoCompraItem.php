<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCompraItem extends Model
{
    use HasFactory;

    protected $table = 'pedido_compra_items';

    protected $fillable = [
        'pedido_compra_id',
        'item_id',
        'contrato_item_id',
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
     * Get the pedido compra that owns the item.
     *
     * @return BelongsTo<PedidoCompra, PedidoCompraItem>
     */
    public function pedidoCompra(): BelongsTo
    {
        return $this->belongsTo(PedidoCompra::class);
    }

    /**
     * Get the item that owns the pedido compra item.
     *
     * @return BelongsTo<Item, PedidoCompraItem>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the contrato item that owns the pedido compra item.
     *
     * @return BelongsTo<ContratoItem, PedidoCompraItem>
     */
    public function contratoItem(): BelongsTo
    {
        return $this->belongsTo(ContratoItem::class);
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
        return $this->pedidoCompra && $this->pedidoCompra->podeEditar();
    }

    /**
     * Recalculate total value.
     */
    public function recalcularValorTotal(): void
    {
        $this->valor_total_estimado = $this->quantidade_solicitada * $this->valor_unitario_estimado;
        $this->save();
    }
}
