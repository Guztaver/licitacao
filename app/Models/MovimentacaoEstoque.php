<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimentacaoEstoque extends Model
{
    use HasFactory;

    protected $fillable = [
        'estoque_id',
        'item_id',
        'tipo_movimentacao',
        'quantidade',
        'saldo_anterior',
        'saldo_posterior',
        'documento_origem',
        'documento_tipo',
        'numero_lote',
        'localizacao_origem_id',
        'localizacao_destino_id',
        'usuario_id',
        'motivo',
        'data_movimentacao',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'quantidade' => 'decimal:3',
        'saldo_anterior' => 'decimal:3',
        'saldo_posterior' => 'decimal:3',
        'data_movimentacao' => 'datetime',
    ];

    protected $dates = ['data_movimentacao'];

    // Tipo movimentação constants
    const TIPO_ENTRADA = 'entrada';
    const TIPO_SAIDA = 'saida';
    const TIPO_TRANSFERENCIA = 'transferencia';
    const TIPO_AJUSTE = 'ajuste';
    const TIPO_PERDA = 'perda';
    const TIPO_DEVOLUCAO = 'devolucao';
    const TIPO_RESERVA = 'reserva';
    const TIPO_BAIXA_RESERVA = 'baixa_reserva';

    // Status constants
    const STATUS_PENDENTE = 'pendente';
    const STATUS_CONFIRMADA = 'confirmada';
    const STATUS_CANCELADA = 'cancelada';

    /**
     * Get the estoque that owns the movimentacao.
     */
    public function estoque(): BelongsTo
    {
        return $this->belongsTo(Estoque::class);
    }

    /**
     * Get the item that owns the movimentacao.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the usuario that owns the movimentacao.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the localizacao_origem that owns the movimentacao.
     */
    public function localizacaoOrigem(): BelongsTo
    {
        return $this->belongsTo(Localizacao::class, 'localizacao_origem_id');
    }

    /**
     * Get the localizacao_destino that owns the movimentacao.
     */
    public function localizacaoDestino(): BelongsTo
    {
        return $this->belongsTo(Localizacao::class, 'localizacao_destino_id');
    }

    /**
     * Get movement type display name.
     */
    public function getTipoMovimentacaoDisplayAttribute(): string
    {
        $tipos = [
            self::TIPO_ENTRADA => 'Entrada',
            self::TIPO_SAIDA => 'Saída',
            self::TIPO_TRANSFERENCIA => 'Transferência',
            self::TIPO_AJUSTE => 'Ajuste',
            self::TIPO_PERDA => 'Perda',
            self::TIPO_DEVOLUCAO => 'Devolução',
            self::TIPO_RESERVA => 'Reserva',
            self::TIPO_BAIXA_RESERVA => 'Baixa de Reserva',
        ];

        return $tipos[$this->tipo_movimentacao] ?? $this->tipo_movimentacao;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            self::STATUS_PENDENTE => 'Pendente',
            self::STATUS_CONFIRMADA => 'Confirmada',
            self::STATUS_CANCELADA => 'Cancelada',
        ];

        return $status[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            self::STATUS_PENDENTE => 'bg-yellow-100 text-yellow-800',
            self::STATUS_CONFIRMADA => 'bg-green-100 text-green-800',
            self::STATUS_CANCELADA => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get movement type color class.
     */
    public function getTipoColorAttribute(): string
    {
        $colors = [
            self::TIPO_ENTRADA => 'bg-green-100 text-green-800',
            self::TIPO_SAIDA => 'bg-red-100 text-red-800',
            self::TIPO_TRANSFERENCIA => 'bg-blue-100 text-blue-800',
            self::TIPO_AJUSTE => 'bg-yellow-100 text-yellow-800',
            self::TIPO_PERDA => 'bg-red-100 text-red-800',
            self::TIPO_DEVOLUCAO => 'bg-orange-100 text-orange-800',
            self::TIPO_RESERVA => 'bg-purple-100 text-purple-800',
            self::TIPO_BAIXA_RESERVA => 'bg-gray-100 text-gray-800',
        ];

        return $colors[$this->tipo_movimentacao] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if movement is positive (increases stock).
     */
    public function isPositiva(): bool
    {
        return $this->quantidade > 0;
    }

    /**
     * Check if movement is negative (decreases stock).
     */
    public function isNegativa(): bool
    {
        return $this->quantidade < 0;
    }

    /**
     * Get formatted quantity.
     */
    public function getQuantidadeFormatadaAttribute(): string
    {
        $prefix = $this->isNegativa() ? '-' : '+';
        return $prefix . ' ' . abs($this->quantidade);
    }

    /**
     * Create stock entry movement.
     */
    public static function criarEntrada(
        Estoque $estoque,
        float $quantidade,
        string $documentoOrigem,
        array $dados = []
    ): self {

        $movimentacao = self::create(array_merge([
            'estoque_id' => $estoque->id,
            'item_id' => $estoque->item_id,
            'tipo_movimentacao' => self::TIPO_ENTRADA,
            'quantidade' => $quantidade,
            'documento_origem' => $documentoOrigem,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => self::STATUS_CONFIRMADA,
        ], $dados));

        // Update stock
        $estoque->adicionarEstoque($quantidade, array_merge($dados, [
            'movimentacao_id' => $movimentacao->id,
        ]));

        return $movimentacao;
    }

    /**
     * Create stock exit movement.
     */
    public static function criarSaida(
        Estoque $estoque,
        float $quantidade,
        string $documentoOrigem,
        array $dados = []
    ): self {

        $movimentacao = self::create(array_merge([
            'estoque_id' => $estoque->id,
            'item_id' => $estoque->item_id,
            'tipo_movimentacao' => self::TIPO_SAIDA,
            'quantidade' => -$quantidade,
            'documento_origem' => $documentoOrigem,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => self::STATUS_CONFIRMADA,
        ], $dados));

        // Update stock
        $estoque->removerEstoque($quantidade, array_merge($dados, [
            'movimentacao_id' => $movimentacao->id,
        ]));

        return $movimentacao;
    }

    /**
     * Create transfer movement between locations.
     */
    public static function criarTransferencia(
        Estoque $estoqueOrigem,
        Estoque $estoqueDestino,
        float $quantidade,
        string $documentoOrigem,
        array $dados = []
    ): array {

        // Create exit from origin
        $movimentacaoSaida = self::create(array_merge([
            'estoque_id' => $estoqueOrigem->id,
            'item_id' => $estoqueOrigem->item_id,
            'tipo_movimentacao' => self::TIPO_TRANSFERENCIA,
            'quantidade' => -$quantidade,
            'documento_origem' => $documentoOrigem,
            'localizacao_origem_id' => $estoqueOrigem->localizacao_id,
            'localizacao_destino_id' => $estoqueDestino->localizacao_id,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => self::STATUS_CONFIRMADA,
            'motivo' => 'Transferência para ' . $estoqueDestino->localizacao->descricao,
        ], $dados));

        // Remove from origin
        $estoqueOrigem->removerEstoque($quantidade, array_merge($dados, [
            'movimentacao_id' => $movimentacaoSaida->id,
        ]));

        // Create entry in destination
        $movimentacaoEntrada = self::create(array_merge([
            'estoque_id' => $estoqueDestino->id,
            'item_id' => $estoqueDestino->item_id,
            'tipo_movimentacao' => self::TIPO_TRANSFERENCIA,
            'quantidade' => $quantidade,
            'documento_origem' => $documentoOrigem,
            'localizacao_origem_id' => $estoqueOrigem->localizacao_id,
            'localizacao_destino_id' => $estoqueDestino->localizacao_id,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => self::STATUS_CONFIRMADA,
            'motivo' => 'Transferência de ' . $estoqueOrigem->localizacao->descricao,
        ], $dados));

        // Add to destination
        $estoqueDestino->adicionarEstoque($quantidade, array_merge($dados, [
            'movimentacao_id' => $movimentacaoEntrada->id,
        ]));

        return [$movimentacaoSaida, $movimentacaoEntrada];
    }

    /**
     * Create inventory adjustment movement.
     */
    public static function criarAjuste(
        Estoque $estoque,
        float $quantidadeAjuste,
        string $motivo,
        array $dados = []
    ): self {

        $saldoAnterior = $estoque->quantidade_atual;
        $saldoPosterior = $saldoAnterior + $quantidadeAjuste;

        $movimentacao = self::create(array_merge([
            'estoque_id' => $estoque->id,
            'item_id' => $estoque->item_id,
            'tipo_movimentacao' => self::TIPO_AJUSTE,
            'quantidade' => $quantidadeAjuste,
            'saldo_anterior' => $saldoAnterior,
            'saldo_posterior' => $saldoPosterior,
            'motivo' => $motivo,
            'usuario_id' => auth()->id(),
            'data_movimentacao' => now(),
            'status' => self::STATUS_CONFIRMADA,
        ], $dados));

        // Update stock
        $estoque->update([
            'quantidade_atual' => $saldoPosterior,
            'valor_total_estoque' => $saldoPosterior * $estoque->custo_unitario_medio,
        ]);

        // Check alerts and replenishment
        $estoque->verificarAlertas();
        $estoque->verificarReposicao();

        return $movimentacao;
    }

    /**
     * Cancel movement and revert stock changes.
     */
    public function cancelar(string $motivo): bool
    {
        if ($this->status === self::STATUS_CANCELADA) {
            return false;
        }

        // Revert stock changes
        if ($this->estoque) {
            $quantidadeReverter = -$this->quantidade;

            if ($this->tipo_movimentacao === self::TIPO_AJUSTE) {
                // For adjustments, revert to previous balance
                $this->estoque->update([
                    'quantidade_atual' => $this->saldo_anterior,
                    'valor_total_estoque' => $this->saldo_anterior * $this->estoque->custo_unitario_medio,
                ]);
            } else {
                // For other movements, just add/subtract the quantity
                $this->estoque->update([
                    'quantidade_atual' => $this->estoque->quantidade_atual + $quantidadeReverter,
                    'valor_total_estoque' => ($this->estoque->quantidade_atual + $quantidadeReverter) * $this->estoque->custo_unitario_medio,
                ]);
            }

            // Check alerts after reversal
            $this->estoque->verificarAlertas();
            $this->estoque->verificarReposicao();
        }

        // Update movement status
        $this->update([
            'status' => self::STATUS_CANCELADA,
            'observacoes' => ($this->observacoes ?? '') . "\n\nCANCELADO: {$motivo}",
        ]);

        return true;
    }

    /**
     * Scope for confirmed movements.
     */
    public function scopeConfirmada($query)
    {
        return $query->where('status', self::STATUS_CONFIRMADA);
    }

    /**
     * Scope for movements by type.
     */
    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo_movimentacao', $tipo);
    }

    /**
     * Scope for movements in period.
     */
    public function scopePeriodo($query, $dataInicio, $dataFim)
    {
        return $query->whereBetween('data_movimentacao', [$dataInicio, $dataFim]);
    }

    /**
     * Scope for movements by user.
     */
    public function scopeUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Scope for movements by document.
     */
    public function scopeDocumento($query, $documento)
    {
        return $query->where('documento_origem', 'like', "%{$documento}%");
    }

    /**
     * Get document type display.
     */
    public function getDocumentoTipoDisplayAttribute(): string
    {
        $tipos = [
            'NF' => 'Nota Fiscal',
            'REQ' => 'Requisição',
            'AJUSTE' => 'Ajuste',
            'TRANSF' => 'Transferência',
            'PERDA' => 'Perda',
            'DEVOL' => 'Devolução',
        ];

        return $tipos[$this->documento_tipo] ?? $this->documento_tipo;
    }
}
