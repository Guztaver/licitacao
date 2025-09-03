<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conferencia extends Model
{
    use HasFactory;

    protected $table = 'conferencias';

    protected $fillable = [
        'fornecedor_id',
        'periodo_inicio',
        'periodo_fim',
        'total_requisicoes',
        'total_pedidos_manuais',
        'total_geral',
        'status',
        'data_finalizacao',
        'usuario_criacao_id',
        'usuario_finalizacao_id',
        'observacoes',
    ];

    protected $casts = [
        'periodo_inicio' => 'date',
        'periodo_fim' => 'date',
        'total_requisicoes' => 'decimal:2',
        'total_pedidos_manuais' => 'decimal:2',
        'total_geral' => 'decimal:2',
        'data_finalizacao' => 'datetime',
    ];

    /**
     * Get the fornecedor that owns the conferencia.
     */
    /**
     * @return BelongsTo<Fornecedor, Conferencia>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the user who created the conferencia.
     */
    /**
     * @return BelongsTo<User, Conferencia>
     */
    public function usuarioCriacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_criacao_id');
    }

    /**
     * Get the user who finalized the conferencia.
     */
    /**
     * @return BelongsTo<User, Conferencia>
     */
    public function usuarioFinalizacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_finalizacao_id');
    }

    /**
     * Get the pedidos manuais for the conferencia.
     */
    /**
     * @return HasMany<PedidoManual, Conferencia>
     */
    public function pedidosManuais(): HasMany
    {
        return $this->hasMany(PedidoManual::class);
    }

    /**
     * Get requisições for this period and fornecedor.
     */
    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Requisicao>
     */
    public function getRequisicoes()
    {
        return Requisicao::query()->where('fornecedor_id', $this->fornecedor_id)
            ->whereBetween('data_recebimento', [$this->data_inicio, $this->data_fim])
            ->get();
    }

    /**
     * Scope a query to only include active conferencias.
     */
    /**
     * @param Builder $query
     * @return Builder
     */
    public function scopeEmAndamento(Builder $query): Builder
    {
        return $query->where('status', 'em_andamento');
    }

    /**
     * Scope a query to only include finalized conferencias.
     */
    /**
     * @param Builder $query
     * @return Builder
     */
    public function scopeFinalizada(Builder $query): Builder
    {
        return $query->where('status', 'finalizada');
    }

    /**
     * Scope a query for a specific period.
     * @param Builder $query
     * @param \DateTime $inicio
     * @param \DateTime $fim
     * @return Builder
     */
    public function scopePeriodo(Builder $query, \DateTime $inicio, \DateTime $fim): Builder
    {
        return $query->where(function ($q) use ($inicio, $fim) {
            $q->whereBetween('periodo_inicio', [$inicio, $fim])
              ->orWhereBetween('periodo_fim', [$inicio, $fim])
              ->orWhere(function ($q2) use ($inicio, $fim) {
                  $q2->where('periodo_inicio', '<=', $inicio)
                     ->where('periodo_fim', '>=', $fim);
              });
        });
    }

    /**
     * Check if conferencia can be edited.
     */
    public function podeEditar(): bool
    {
        return $this->status === 'em_andamento';
    }

    /**
     * Check if conferencia can be finalized.
     */
    public function podeFinalizar(): bool
    {
        return $this->status === 'em_andamento';
    }

    /**
     * Calculate totals and update.
     */
    public function calcularTotais(): void
    {
        $requisicoes = $this->getRequisicoes();
        $totalRequisicoes = $requisicoes->where('status', 'concretizada')->sum('valor_final') ?? 0;

        $totalPedidosManuais = $this->pedidosManuais()->sum('valor') ?? 0;

        $this->update([
            'total_requisicoes' => $totalRequisicoes,
            'total_pedidos_manuais' => $totalPedidosManuais,
            'total_geral' => $totalRequisicoes + $totalPedidosManuais,
        ]);
    }

    /**
     * Finalizar conferência.
     */
    public function finalizar(User $usuario): void
    {
        $this->calcularTotais();

        $this->update([
            'status' => 'finalizada',
            'data_finalizacao' => now(),
            'usuario_finalizacao_id' => $usuario->id,
        ]);
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statusMap = [
            'em_andamento' => 'Em Andamento',
            'finalizada' => 'Finalizada',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            'em_andamento' => 'bg-yellow-100 text-yellow-800',
            'finalizada' => 'bg-green-100 text-green-800',
        ];

        return $colorMap[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get period display.
     */
    public function getPeriodoDisplayAttribute(): string
    {
        $inicio = $this->periodo_inicio ? $this->periodo_inicio->format('d/m/Y') : '';
        $fim = $this->periodo_fim ? $this->periodo_fim->format('d/m/Y') : '';
        return $inicio . ' a ' . $fim;
    }

    /**
     * Get formatted total geral.
     */
    public function getTotalGeralFormatadoAttribute(): string
    {
        return number_format((float)($this->total_geral ?? 0), 2, ',', '.');
    }

    /**
     * Get formatted total requisicoes.
     */
    public function getTotalRequisicoesFormatadoAttribute(): string
    {
        return number_format((float)($this->total_requisicoes ?? 0), 2, ',', '.');
    }

    /**
     * Get formatted total pedidos manuais.
     */
    public function getTotalPedidosManuaisFormatadoAttribute(): string
    {
        return number_format((float)($this->total_pedidos_manuais ?? 0), 2, ',', '.');
    }
}
