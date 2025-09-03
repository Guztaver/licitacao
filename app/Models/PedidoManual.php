<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoManual extends Model
{
    use HasFactory;

    protected $table = 'pedidos_manuais';

    protected $fillable = [
        'fornecedor_id',
        'descricao',
        'valor',
        'data_pedido',
        'numero_pedido',
        'observacoes',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'data_pedido' => 'date',
    ];

    /**
     * Get the fornecedor that owns the pedido manual.
     *
     * @return BelongsTo<Fornecedor, PedidoManual>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Scope a query for a specific period.
     */
    public function scopePeriodo(Builder $query, \DateTime $inicio, \DateTime $fim): Builder
    {
        return $query->whereBetween('data_pedido', [$inicio, $fim]);
    }

    /**
     * Scope a query for a specific fornecedor.
     */
    public function scopeFornecedor(Builder $query, int $fornecedorId): Builder
    {
        return $query->where('fornecedor_id', $fornecedorId);
    }

    /**
     * Get formatted valor.
     */
    public function getValorFormatadoAttribute(): string
    {
        return 'R$ '.number_format((float) $this->valor, 2, ',', '.');
    }

    /**
     * Get formatted data pedido.
     */
    public function getDataPedidoFormatadaAttribute(): string
    {
        return $this->data_pedido ? $this->data_pedido->format('d/m/Y') : '';
    }

    /**
     * Get short description.
     */
    public function getDescricaoCurtaAttribute(): string
    {
        return strlen($this->descricao) > 50
            ? substr($this->descricao, 0, 50).'...'
            : $this->descricao;
    }

    /**
     * Check if pedido manual can be edited.
     */
    public function podeEditar(): bool
    {
        return true;
    }

    /**
     * Check if pedido manual can be deleted.
     */
    public function podeExcluir(): bool
    {
        return true;
    }

    /**
     * Get display text for lists.
     */
    public function getDisplayTextAttribute(): string
    {
        return $this->descricao_curta.' - '.$this->valor_formatado;
    }
}
