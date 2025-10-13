<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PedidoCompra extends Model
{
    use HasFactory;

    protected $table = 'pedidos_compras';

    protected $fillable = [
        'numero_pedido',
        'secretaria_id',
        'fornecedor_id',
        'contrato_id',
        'usuario_solicitante_id',
        'usuario_autorizador_id',
        'titulo',
        'descricao',
        'justificativa',
        'valor_total_estimado',
        'data_solicitacao',
        'data_necessidade',
        'status',
        'prioridade',
        'observacoes',
        'motivo_rejeicao',
        'data_aprovacao',
        'data_rejeicao',
    ];

    protected $casts = [
        'valor_total_estimado' => 'decimal:2',
        'data_solicitacao' => 'date',
        'data_necessidade' => 'date',
        'data_aprovacao' => 'date',
        'data_rejeicao' => 'date',
    ];

    /**
     * Get the secretaria that owns the pedido compra.
     *
     * @return BelongsTo<Secretaria, PedidoCompra>
     */
    public function secretaria(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class);
    }

    /**
     * Get the fornecedor that owns the pedido compra.
     *
     * @return BelongsTo<Fornecedor, PedidoCompra>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the contrato that owns the pedido compra.
     *
     * @return BelongsTo<Contrato, PedidoCompra>
     */
    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }

    /**
     * Get the usuario solicitante that owns the pedido compra.
     *
     * @return BelongsTo<User, PedidoCompra>
     */
    public function usuarioSolicitante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_solicitante_id');
    }

    /**
     * Get the usuario autorizador that owns the pedido compra.
     *
     * @return BelongsTo<User, PedidoCompra>
     */
    public function usuarioAutorizador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_autorizador_id');
    }

    /**
     * Get the items for the pedido compra.
     *
     * @return HasMany<PedidoCompraItem>
     */
    public function items(): HasMany
    {
        return $this->hasMany(PedidoCompraItem::class);
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'rascunho' => 'Rascunho',
            'pendente_aprovacao' => 'Pendente de Aprovação',
            'aprovado' => 'Aprovado',
            'rejeitado' => 'Rejeitado',
            'cancelado' => 'Cancelado',
            'em_execucao' => 'Em Execução',
            'concluido' => 'Concluído',
        ];

        return $statuses[$this->status] ?? $this->status;
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            'rascunho' => 'bg-gray-100 text-gray-800',
            'pendente_aprovacao' => 'bg-yellow-100 text-yellow-800',
            'aprovado' => 'bg-green-100 text-green-800',
            'rejeitado' => 'bg-red-100 text-red-800',
            'cancelado' => 'bg-red-100 text-red-800',
            'em_execucao' => 'bg-blue-100 text-blue-800',
            'concluido' => 'bg-green-100 text-green-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get priority display text.
     */
    public function getPrioridadeDisplayAttribute(): string
    {
        $priorities = [
            'baixa' => 'Baixa',
            'normal' => 'Normal',
            'alta' => 'Alta',
            'urgente' => 'Urgente',
        ];

        return $priorities[$this->prioridade] ?? $this->prioridade;
    }

    /**
     * Get priority color for UI.
     */
    public function getPrioridadeColorAttribute(): string
    {
        $colors = [
            'baixa' => 'bg-gray-100 text-gray-800',
            'normal' => 'bg-blue-100 text-blue-800',
            'alta' => 'bg-orange-100 text-orange-800',
            'urgente' => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->prioridade] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get formatted valor total estimado.
     */
    public function getValorTotalEstimadoFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->valor_total_estimado, 2, ',', '.');
    }

    /**
     * Get formatted data solicitacao.
     */
    public function getDataSolicitacaoFormatadaAttribute(): string
    {
        return $this->data_solicitacao->format('d/m/Y');
    }

    /**
     * Generate unique pedido number.
     */
    public static function gerarNumeroPedido(): string
    {
        $year = date('Y');
        $count = self::whereYear('data_solicitacao', $year)->count() + 1;

        return 'PC/' . $year . '/' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Check if pedido can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, ['rascunho', 'rejeitado']);
    }

    /**
     * Check if pedido can be submitted for approval.
     */
    public function podeEnviarParaAprovacao(): bool
    {
        return $this->status === 'rascunho' && $this->items()->count() > 0;
    }

    /**
     * Check if pedido can be approved.
     */
    public function podeAprovar(): bool
    {
        return $this->status === 'pendente_aprovacao';
    }

    /**
     * Check if pedido can be rejected.
     */
    public function podeRejeitar(): bool
    {
        return $this->status === 'pendente_aprovacao';
    }

    /**
     * Check if pedido can be canceled.
     */
    public function podeCancelar(): bool
    {
        return !in_array($this->status, ['concluido', 'cancelado']);
    }

    /**
     * Submit pedido for approval.
     */
    public function enviarParaAprovacao(): void
    {
        if ($this->podeEnviarParaAprovacao()) {
            $this->status = 'pendente_aprovacao';
            $this->save();
        }
    }

    /**
     * Approve pedido.
     */
    public function aprovar($usuarioAutorizadorId): void
    {
        if ($this->podeAprovar()) {
            $this->status = 'aprovado';
            $this->usuario_autorizador_id = $usuarioAutorizadorId;
            $this->data_aprovacao = now();
            $this->save();
        }
    }

    /**
     * Reject pedido.
     */
    public function rejeitar($usuarioAutorizadorId, $motivo): void
    {
        if ($this->podeRejeitar()) {
            $this->status = 'rejeitado';
            $this->usuario_autorizador_id = $usuarioAutorizadorId;
            $this->motivo_rejeicao = $motivo;
            $this->data_rejeicao = now();
            $this->save();
        }
    }

    /**
     * Cancel pedido.
     */
    public function cancelar($motivo): void
    {
        if ($this->podeCancelar()) {
            $this->status = 'cancelado';
            $this->observacoes = ($this->observacoes ? $this->observacoes . "\n\n" : '') . "CANCELADO: {$motivo}";
            $this->save();
        }
    }

    /**
     * Scope a query for a specific status.
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query for a specific secretaria.
     */
    public function scopeSecretaria(Builder $query, int $secretariaId): Builder
    {
        return $query->where('secretaria_id', $secretariaId);
    }

    /**
     * Scope a query for pending approval.
     */
    public function scopePendentesAprovacao(Builder $query): Builder
    {
        return $query->where('status', 'pendente_aprovacao');
    }

    /**
     * Scope a query for a specific period.
     */
    public function scopePeriodo(Builder $query, $inicio, $fim): Builder
    {
        return $query->whereBetween('data_solicitacao', [$inicio, $fim]);
    }

    /**
     * Scope a query to search pedidos.
     */
    public function scopeSearch(Builder $query, $term): Builder
    {
        return $query->where(function($q) use ($term) {
            $q->where('numero_pedido', 'like', "%{$term}%")
              ->orWhere('titulo', 'like', "%{$term}%")
              ->orWhere('descricao', 'like', "%{$term}%")
              ->orWhereHas('secretaria', function($subQuery) use ($term) {
                  $subQuery->where('nome', 'like', "%{$term}%")
                           ->orWhere('sigla', 'like', "%{$term}%");
              });
        });
    }

    /**
     * Recalculate total value based on items.
     */
    public function recalcularValorTotal(): void
    {
        $total = $this->items()->sum('valor_total_estimado');
        $this->valor_total_estimado = $total;
        $this->save();
    }
}
