<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Estoque extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'localizacao_id',
        'quantidade_atual',
        'quantidade_minima',
        'quantidade_maxima',
        'quantidade_reservada',
        'ponto_reposicao',
        'lead_time_reposicao',
        'lote',
        'data_validade',
        'custo_unitario_medio',
        'valor_total_estoque',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'quantidade_atual' => 'decimal:3',
        'quantidade_minima' => 'decimal:3',
        'quantidade_maxima' => 'decimal:3',
        'quantidade_reservada' => 'decimal:3',
        'ponto_reposicao' => 'decimal:3',
        'custo_unitario_medio' => 'decimal:2',
        'valor_total_estoque' => 'decimal:2',
        'data_validade' => 'date',
    ];

    protected $dates = ['data_validade'];

    // Status constants
    const STATUS_ATIVO = 'ativo';
    const STATUS_BLOQUEADO = 'bloqueado';
    const STATUS_EM_ANALISE = 'em_analise';

    /**
     * Get the item that owns the estoque.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the localizacao that owns the estoque.
     */
    public function localizacao(): BelongsTo
    {
        return $this->belongsTo(Localizacao::class);
    }

    /**
     * Get the movimentacoes for the estoque.
     */
    public function movimentacoes(): HasMany
    {
        return $this->hasMany(MovimentacaoEstoque::class)->orderBy('data_movimentacao', 'desc');
    }

    /**
     * Get the alertas for the estoque.
     */
    public function alertas(): HasMany
    {
        return $this->hasMany(AlertaEstoque::class)->orderBy('data_alerta', 'desc');
    }

    /**
     * Get the reposicoes for the estoque.
     */
    public function reposicoes(): HasMany
    {
        return $this->hasMany(ReposicaoEstoque::class)->orderBy('data_sugerida', 'desc');
    }

    /**
     * Get available quantity (current - reserved).
     */
    public function getQuantidadeDisponivelAttribute(): float
    {
        return (float) $this->quantidade_atual - (float) $this->quantidade_reservada;
    }

    /**
     * Get quantity percentage vs minimum.
     */
    public function getPercentualMinimoAttribute(): float
    {
        if ($this->quantidade_minima <= 0) {
            return 100;
        }

        return (($this->quantidade_atual / $this->quantidade_minima) * 100);
    }

    /**
     * Get quantity percentage vs maximum.
     */
    public function getPercentualMaximoAttribute(): float
    {
        if (!$this->quantidade_maxima || $this->quantidade_maxima <= 0) {
            return 0;
        }

        return (($this->quantidade_atual / $this->quantidade_maxima) * 100);
    }

    /**
     * Check if stock is low.
     */
    public function isEstoqueBaixo(): bool
    {
        return $this->quantidade_atual <= $this->quantidade_minima;
    }

    /**
     * Check if stock is zero.
     */
    public function isEstoqueZerado(): bool
    {
        return $this->quantidade_atual <= 0;
    }

    /**
     * Check if stock is above maximum.
     */
    public function isEstoqueExcedente(): bool
    {
        return $this->quantidade_maxima && $this->quantidade_atual > $this->quantidade_maxima;
    }

    /**
     * Check if needs replenishment.
     */
    public function precisaReposicao(): bool
    {
        return $this->quantidade_atual <= $this->ponto_reposicao;
    }

    /**
     * Check if is expired.
     */
    public function isVencido(): bool
    {
        return $this->data_validade && $this->data_validade->isPast();
    }

    /**
     * Check if is near expiration.
     */
    public function isProximoVencimento(int $dias = 30): bool
    {
        if (!$this->data_validade) {
            return false;
        }

        return $this->data_validade->diffInDays(now()) <= $dias;
    }

    /**
     * Get stock status.
     */
    public function getStatusEstoqueAttribute(): string
    {
        if ($this->isVencido()) {
            return 'vencido';
        }

        if ($this->isEstoqueZerado()) {
            return 'estoque_zerado';
        }

        if ($this->isEstoqueBaixo()) {
            return 'estoque_baixo';
        }

        if ($this->isEstoqueExcedente()) {
            return 'estoque_excedente';
        }

        if ($this->isProximoVencimento()) {
            return 'vencimento_proximo';
        }

        return 'normal';
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        switch ($this->status_estoque) {
            case 'vencido':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'estoque_zerado':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'estoque_baixo':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'estoque_excedente':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'vencimento_proximo':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-green-100 text-green-800 border-green-200';
        }
    }

    /**
     * Reserve quantity for requisition.
     */
    public function reservarQuantidade(float $quantidade, string $documento): bool
    {
        $disponivel = $this->quantidade_disponivel;

        if ($quantidade > $disponivel) {
            return false;
        }

        // Create reservation movement
        $this->createMovimentacao([
            'tipo_movimentacao' => 'reserva',
            'quantidade' => $quantidade,
            'saldo_anterior' => $this->quantidade_atual,
            'saldo_posterior' => $this->quantidade_atual,
            'documento_origem' => $documento,
            'motivo' => 'Reserva para requisição',
        ]);

        // Update reserved quantity
        $this->increment('quantidade_reservada', $quantidade);

        return true;
    }

    /**
     * Release reserved quantity.
     */
    public function liberarReserva(float $quantidade, string $documento): void
    {
        if ($quantidade > $this->quantidade_reservada) {
            $quantidade = $this->quantidade_reservada;
        }

        // Create release movement
        $this->createMovimentacao([
            'tipo_movimentacao' => 'baixa_reserva',
            'quantidade' => $quantidade,
            'saldo_anterior' => $this->quantidade_atual,
            'saldo_posterior' => $this->quantidade_atual,
            'documento_origem' => $documento,
            'motivo' => 'Baixa de reserva',
        ]);

        // Update reserved quantity
        $this->decrement('quantidade_reservada', $quantidade);
    }

    /**
     * Add stock (entrada).
     */
    public function adicionarEstoque(float $quantidade, array $dados = []): MovimentacaoEstoque
    {
        $saldoAnterior = $this->quantidade_atual;
        $novoSaldo = $saldoAnterior + $quantidade;

        // Create movement
        $movimentacao = $this->createMovimentacao(array_merge([
            'tipo_movimentacao' => 'entrada',
            'quantidade' => $quantidade,
            'saldo_anterior' => $saldoAnterior,
            'saldo_posterior' => $novoSaldo,
        ], $dados));

        // Update stock
        $this->update([
            'quantidade_atual' => $novoSaldo,
            'valor_total_estoque' => $novoSaldo * $this->custo_unitario_medio,
        ]);

        // Check if needs to resolve alerts
        $this->verificarAlertas();

        return $movimentacao;
    }

    /**
     * Remove stock (saída).
     */
    public function removerEstoque(float $quantidade, array $dados = []): ?MovimentacaoEstoque
    {
        $disponivel = $this->quantidade_disponivel;

        if ($quantidade > $disponivel) {
            throw new \Exception("Quantidade indisponível em estoque. Disponível: {$disponivel}, Solicitado: {$quantidade}");
        }

        $saldoAnterior = $this->quantidade_atual;
        $novoSaldo = $saldoAnterior - $quantidade;

        // Create movement
        $movimentacao = $this->createMovimentacao(array_merge([
            'tipo_movimentacao' => 'saida',
            'quantidade' => -$quantidade,
            'saldo_anterior' => $saldoAnterior,
            'saldo_posterior' => $novoSaldo,
        ], $dados));

        // Update stock
        $this->update([
            'quantidade_atual' => $novoSaldo,
            'valor_total_estoque' => $novoSaldo * $this->custo_unitario_medio,
        ]);

        // Check if needs to create alerts or replenishment
        $this->verificarAlertas();
        $this->verificarReposicao();

        return $movimentacao;
    }

    /**
     * Create stock movement.
     */
    private function createMovimentacao(array $dados): MovimentacaoEstoque
    {
        return MovimentacaoEstoque::create(array_merge([
            'estoque_id' => $this->id,
            'item_id' => $this->item_id,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => 'confirmada',
        ], $dados));
    }

    /**
     * Check and create necessary alerts.
     */
    public function verificarAlertas(): void
    {
        // Remove resolved alerts
        $this->alertas()
            ->whereIn('tipo_alerta', ['estoque_baixo', 'estoque_zerado'])
            ->where('status', 'aberto')
            ->where('ativo', true)
            ->each(function ($alerta) {
                $alerta->marcarComoResolvido('Estoque regularizado automaticamente');
            });

        // Create new alerts if needed
        if ($this->isEstoqueZerado()) {
            AlertaEstoque::criarAlerta(
                $this,
                'estoque_zerado',
                'Estoque Zerado',
                "O item {$this->item->descricao} está sem estoque na localização {$this->localizacao->descricao}.",
                ['criticidade' => 'critica']
            );
        } elseif ($this->isEstoqueBaixo()) {
            AlertaEstoque::criarAlerta(
                $this,
                'estoque_baixo',
                'Estoque Baixo',
                "O item {$this->item->descricao} está com estoque baixo ({$this->quantidade_atual} un). Mínimo: {$this->quantidade_minima} un.",
                ['criticidade' => 'alta']
            );
        }

        if ($this->isEstoqueExcedente()) {
            AlertaEstoque::criarAlerta(
                $this,
                'estoque_excedente',
                'Estoque Excedente',
                "O item {$this->item->descricao} está acima do estoque máximo ({$this->quantidade_atual} un). Máximo: {$this->quantidade_maxima} un.",
                ['criticidade' => 'media']
            );
        }

        if ($this->isVencido()) {
            AlertaEstoque::criarAlerta(
                $this,
                'validade_vencida',
                'Validade Vencida',
                "O item {$this->item->descricao} na localização {$this->localizacao->descricao} está vencido desde {$this->data_validade->format('d/m/Y')}.",
                ['criticidade' => 'critica']
            );
        } elseif ($this->isProximoVencimento()) {
            $diasVencimento = $this->data_validade->diffInDays(now());
            AlertaEstoque::criarAlerta(
                $this,
                'validade_proxima',
                'Validade Próxima',
                "O item {$this->item->descricao} vencerá em {$diasVencimento} dias ({$this->data_validade->format('d/m/Y')}).",
                ['criticidade' => 'media']
            );
        }
    }

    /**
     * Check if needs replenishment and create suggestion.
     */
    public function verificarReposicao(): void
    {
        if (!$this->precisaReposicao()) {
            return;
        }

        // Check if there's already an open replenishment
        $temReposicaoAberta = $this->reposicoes()
            ->whereIn('status', ['sugerida', 'aprovada', 'solicitada', 'em_transito'])
            ->exists();

        if ($temReposicaoAberta) {
            return;
        }

        // Calculate suggested quantity
        $quantidadeSugerida = $this->quantidade_maxima - $this->quantidade_atual;
        $dataSugerida = now()->addDays($this->lead_time_reposicao);

        // Create replenishment suggestion
        ReposicaoEstoque::create([
            'item_id' => $this->item_id,
            'estoque_id' => $this->id,
            'tipo_reposicao' => 'automatica',
            'quantidade_sugerida' => $quantidadeSugerida,
            'data_sugerida' => $dataSugerida,
            'prioridade' => $this->isEstoqueZerado() ? 'urgente' : 'normal',
            'motivo' => 'Reposição automática - estoque abaixo do ponto de pedido',
        ]);
    }

    /**
     * Update average cost.
     */
    public function atualizarCustoMedio(float $novoCusto, float $quantidade): void
    {
        $valorTotalAtual = $this->quantidade_atual * $this->custo_unitario_medio;
        $valorNovo = $quantidade * $novoCusto;

        $novaQuantidade = $this->quantidade_atual + $quantidade;
        $novoCustoMedio = $novaQuantidade > 0 ? ($valorTotalAtual + $valorNovo) / $novaQuantidade : 0;

        $this->update([
            'custo_unitario_medio' => $novoCustoMedio,
            'valor_total_estoque' => $novaQuantidade * $novoCustoMedio,
        ]);
    }

    /**
     * Scope for active stock.
     */
    public function scopeAtivo(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ATIVO);
    }

    /**
     * Scope for low stock.
     */
    public function scopeEstoqueBaixo(Builder $query): Builder
    {
        return $query->whereRaw('quantidade_atual <= quantidade_minima');
    }

    /**
     * Scope for zero stock.
     */
    public function scopeEstoqueZerado(Builder $query): Builder
    {
        return $query->where('quantidade_atual', '<=', 0);
    }

    /**
     * Scope for items needing replenishment.
     */
    public function scopePrecisaReposicao(Builder $query): Builder
    {
        return $query->whereRaw('quantidade_atual <= ponto_reposicao');
    }

    /**
     * Scope for expired items.
     */
    public function scopeVencido(Builder $query): Builder
    {
        return $query->where('data_validade', '<', now());
    }

    /**
     * Scope for items near expiration.
     */
    public function scopeProximoVencimento(Builder $query, int $dias = 30): Builder
    {
        return $query->where('data_validade', '<=', now()->addDays($dias))
                      ->where('data_validade', '>', now());
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Update total value when quantity or cost changes
        static::saved(function ($estoque) {
            $estoque->update([
                'valor_total_estoque' => $estoque->quantidade_atual * $estoque->custo_unitario_medio,
            ]);
        });
    }
}
