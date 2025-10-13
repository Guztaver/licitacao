<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReposicaoEstoque extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'estoque_id',
        'tipo_reposicao',
        'quantidade_sugerida',
        'quantidade_solicitada',
        'quantidade_atendida',
        'prioridade',
        'data_sugerida',
        'data_solicitacao',
        'data_prevista_entrega',
        'data_efetiva_entrega',
        'fornecedor_id',
        'status',
        'valor_unitario_estimado',
        'valor_total_estimado',
        'usuario_solicitante_id',
        'usuario_aprovador_id',
        'data_aprovacao',
        'motivo',
        'observacoes',
    ];

    protected $casts = [
        'quantidade_sugerida' => 'decimal:3',
        'quantidade_solicitada' => 'decimal:3',
        'quantidade_atendida' => 'decimal:3',
        'data_sugerida' => 'date',
        'data_solicitacao' => 'date',
        'data_prevista_entrega' => 'date',
        'data_efetiva_entrega' => 'date',
        'valor_unitario_estimado' => 'decimal:2',
        'valor_total_estimado' => 'decimal:2',
        'data_aprovacao' => 'datetime',
    ];

    protected $dates = [
        'data_sugerida',
        'data_solicitacao',
        'data_prevista_entrega',
        'data_efetiva_entrega',
        'data_aprovacao',
    ];

    // Tipo reposição constants
    const TIPO_AUTOMATICA = 'automatica';
    const TIPO_MANUAL = 'manual';
    const TIPO_PREVENTIVA = 'preventiva';
    const TIPO_EMERGENCIAL = 'emergencial';

    // Prioridade constants
    const PRIORIDADE_BAIXA = 'baixa';
    const PRIORIDADE_NORMAL = 'normal';
    const PRIORIDADE_ALTA = 'alta';
    const PRIORIDADE_URGENTE = 'urgente';

    // Status constants
    const STATUS_SUGERIDA = 'sugerida';
    const STATUS_APROVADA = 'aprovada';
    const STATUS_SOLICITADA = 'solicitada';
    const STATUS_EM_TRANSITO = 'em_transito';
    const STATUS_RECEBIDA_PARCIAL = 'recebida_parcial';
    const STATUS_RECEBIDA = 'recebida';
    const STATUS_CANCELADA = 'cancelada';
    const STATUS_ATRASADA = 'atrasada';

    /**
     * Get the item that owns the reposicao.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the estoque that owns the reposicao.
     */
    public function estoque(): BelongsTo
    {
        return $this->belongsTo(Estoque::class);
    }

    /**
     * Get the fornecedor that owns the reposicao.
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the usuario_solicitante that owns the reposicao.
     */
    public function usuarioSolicitante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_solicitante_id');
    }

    /**
     * Get the usuario_aprovador that owns the reposicao.
     */
    public function usuarioAprovador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_aprovador_id');
    }

    /**
     * Get reposição type display name.
     */
    public function getTipoReposicaoDisplayAttribute(): string
    {
        $tipos = [
            self::TIPO_AUTOMATICA => 'Automática',
            self::TIPO_MANUAL => 'Manual',
            self::TIPO_PREVENTIVA => 'Preventiva',
            self::TIPO_EMERGENCIAL => 'Emergencial',
        ];

        return $tipos[$this->tipo_reposicao] ?? $this->tipo_reposicao;
    }

    /**
     * Get priority display name.
     */
    public function getPrioridadeDisplayAttribute(): string
    {
        $prioridades = [
            self::PRIORIDADE_BAIXA => 'Baixa',
            self::PRIORIDADE_NORMAL => 'Normal',
            self::PRIORIDADE_ALTA => 'Alta',
            self::PRIORIDADE_URGENTE => 'Urgente',
        ];

        return $prioridades[$this->prioridade] ?? $this->prioridade;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            self::STATUS_SUGERIDA => 'Sugerida',
            self::STATUS_APROVADA => 'Aprovada',
            self::STATUS_SOLICITADA => 'Solicitada',
            self::STATUS_EM_TRANSITO => 'Em Trânsito',
            self::STATUS_RECEBIDA_PARCIAL => 'Recebida Parcial',
            self::STATUS_RECEBIDA => 'Recebida',
            self::STATUS_CANCELADA => 'Cancelada',
            self::STATUS_ATRASADA => 'Atrasada',
        ];

        return $status[$this->status] ?? $this->status;
    }

    /**
     * Get priority color class.
     */
    public function getPrioridadeColorAttribute(): string
    {
        $colors = [
            self::PRIORIDADE_BAIXA => 'bg-blue-100 text-blue-800',
            self::PRIORIDADE_NORMAL => 'bg-green-100 text-green-800',
            self::PRIORIDADE_ALTA => 'bg-yellow-100 text-yellow-800',
            self::PRIORIDADE_URGENTE => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->prioridade] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            self::STATUS_SUGERIDA => 'bg-gray-100 text-gray-800',
            self::STATUS_APROVADA => 'bg-blue-100 text-blue-800',
            self::STATUS_SOLICITADA => 'bg-yellow-100 text-yellow-800',
            self::STATUS_EM_TRANSITO => 'bg-purple-100 text-purple-800',
            self::STATUS_RECEBIDA_PARCIAL => 'bg-orange-100 text-orange-800',
            self::STATUS_RECEBIDA => 'bg-green-100 text-green-800',
            self::STATUS_CANCELADA => 'bg-red-100 text-red-800',
            self::STATUS_ATRASADA => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get remaining quantity to receive.
     */
    public function getQuantidadeRestanteAttribute(): float
    {
        return (float) ($this->quantidade_solicitada ?? $this->quantidade_sugerida) - (float) $this->quantidade_atendida;
    }

    /**
     * Get percentage completed.
     */
    public function getPercentualConcluidoAttribute(): float
    {
        $quantidadeTotal = $this->quantidade_solicitada ?? $this->quantidade_sugerida;

        if ($quantidadeTotal <= 0) {
            return 0;
        }

        return ($this->quantidade_atendida / $quantidadeTotal) * 100;
    }

    /**
     * Check if replenishment is overdue.
     */
    public function isAtrasada(): bool
    {
        if (!in_array($this->status, [self::STATUS_SOLICITADA, self::STATUS_EM_TRANSITO])) {
            return false;
        }

        if (!$this->data_prevista_entrega) {
            return false;
        }

        return now()->isAfter($this->data_prevista_entrega);
    }

    /**
     * Check if replenishment is urgent.
     */
    public function isUrgente(): bool
    {
        return $this->prioridade === self::PRIORIDADE_URGENTE ||
               ($this->prioridade === self::PRIORIDADE_ALTA && $this->isAtrasada());
    }

    /**
     * Approve replenishment suggestion.
     */
    public function aprovar(int $usuarioId = null, float $quantidadeSolicitada = null): bool
    {
        if ($this->status !== self::STATUS_SUGERIDA) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_APROVADA,
            'quantidade_solicitada' => $quantidadeSolicitada ?? $this->quantidade_sugerida,
            'usuario_aprovador_id' => $usuarioId ?? auth()->id(),
            'data_aprovacao' => now(),
        ]);

        return true;
    }

    /**
     * Request replenishment from supplier.
     */
    public function solicitar(int $fornecedorId = null, \DateTime $dataPrevista = null): bool
    {
        if (!in_array($this->status, [self::STATUS_APROVADA, self::STATUS_SUGERIDA])) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_SOLICITADA,
            'fornecedor_id' => $fornecedorId,
            'data_solicitacao' => now(),
            'data_prevista_entrega' => $dataPrevista ?? now()->addDays($this->estoque->lead_time_reposicao ?? 7),
        ]);

        return true;
    }

    /**
     * Mark as in transit.
     */
    public function marcarEmTransito(): bool
    {
        if ($this->status !== self::STATUS_SOLICITADA) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_EM_TRANSITO,
        ]);

        return true;
    }

    /**
     * Record partial receipt.
     */
    public function registrarRecebimentoParcial(float $quantidade): bool
    {
        if (!in_array($this->status, [self::STATUS_EM_TRANSITO, self::STATUS_RECEBIDA_PARCIAL])) {
            return false;
        }

        $novaQuantidade = $this->quantidade_atendida + $quantidade;
        $quantidadeRestante = ($this->quantidade_solicitada ?? $this->quantidade_sugerida) - $novaQuantidade;

        $this->update([
            'quantidade_atendida' => $novaQuantidade,
            'status' => $quantidadeRestante > 0 ? self::STATUS_RECEBIDA_PARCIAL : self::STATUS_RECEBIDA,
            'data_efetiva_entrega' => $quantidadeRestante > 0 ? $this->data_efetiva_entrega : now(),
        ]);

        // Create stock entry movement
        if ($this->estoque) {
            MovimentacaoEstoque::criarEntrada(
                $this->estoque,
                $quantidade,
                'REPOSICAO-' . str_pad($this->id, 6, '0', STR_PAD_LEFT),
                [
                    'motivo' => 'Reposição de estoque - ' . $this->getPrioridadeDisplayAttribute(),
                    'documento_tipo' => 'REPOSICAO',
                ]
            );
        }

        return true;
    }

    /**
     * Record complete receipt.
     */
    public function registrarRecebimentoCompleto(float $quantidade = null): bool
    {
        $quantidadeReceber = $quantidade ?? $this->getQuantidadeRestante();

        if ($quantidadeReceber <= 0) {
            return false;
        }

        return $this->registrarRecebimentoParcial($quantidadeReceber);
    }

    /**
     * Cancel replenishment.
     */
    public function cancelar(string $motivo): bool
    {
        $this->update([
            'status' => self::STATUS_CANCELADA,
            'observacoes' => ($this->observacoes ?? '') . "\n\nCANCELADO: {$motivo}",
        ]);

        return true;
    }

    /**
     * Auto-generate replenishment suggestions.
     */
    public static function gerarSugestoesAutomaticas(): int
    {
        $sugestoesCriadas = 0;

        // Get items needing replenishment
        $itensParaReposicao = Estoque::ativo()
            ->precisaReposicao()
            ->with(['item', 'localizacao'])
            ->get();

        foreach ($itensParaReposicao as $estoque) {
            // Check if there's already an open replenishment
            $temReposicaoAberta = $estoque->reposicoes()
                ->whereIn('status', [self::STATUS_SUGERIDA, self::STATUS_APROVADA, self::STATUS_SOLICITADA, self::STATUS_EM_TRANSITO])
                ->exists();

            if (!$temReposicaoAberta) {
                // Calculate suggested quantity
                $quantidadeSugerida = $estoque->quantidade_maxima - $estoque->quantidade_atual;
                $dataSugerida = now()->addDays($estoque->lead_time_reposicao);

                // Determine priority based on stock level
                $prioridade = self::PRIORIDADE_NORMAL;
                if ($estoque->isEstoqueZerado()) {
                    $prioridade = self::PRIORIDADE_URGENTE;
                } elseif ($estoque->isEstoqueBaixo()) {
                    $prioridade = self::PRIORIDADE_ALTA;
                }

                self::create([
                    'item_id' => $estoque->item_id,
                    'estoque_id' => $estoque->id,
                    'tipo_reposicao' => self::TIPO_AUTOMATICA,
                    'quantidade_sugerida' => $quantidadeSugerida,
                    'data_sugerida' => $dataSugerida,
                    'prioridade' => $prioridade,
                    'motivo' => 'Reposição automática - estoque abaixo do ponto de pedido',
                ]);

                $sugestoesCriadas++;
            }
        }

        return $sugestoesCriadas;
    }

    /**
     * Check for overdue replenishments and create alerts.
     */
    public static function verificarReposicoesAtrasadas(): int
    {
        $alertasCriadas = 0;

        $reposicoesAtrasadas = self::whereIn('status', [self::STATUS_SOLICITADA, self::STATUS_EM_TRANSITO])
            ->where('data_prevista_entrega', '<', now())
            ->whereDoesntHave('alertas', function ($query) {
                $query->where('tipo_alerta', AlertaEstoque::TIPO_REPOSICAO_ATRASADA)
                      ->where('status', AlertaEstoque::STATUS_ABERTO);
            })
            ->with(['item', 'estoque'])
            ->get();

        foreach ($reposicoesAtrasadas as $reposicao) {
            AlertaEstoque::criarAlerta(
                $reposicao->estoque,
                AlertaEstoque::TIPO_REPOSICAO_ATRASADA,
                'Reposição Atrasada',
                "A reposição do item {$reposicao->item->descricao} está atrasada. Data prevista: {$reposicao->data_prevista_entrega->format('d/m/Y')}.",
                [
                    'criticidade' => $reposicao->prioridade === self::PRIORIDADE_URGENTE ? 'critica' : 'alta',
                    'reposicao_id' => $reposicao->id,
                ]
            );

            $alertasCriadas++;
        }

        return $alertasCriadas;
    }

    /**
     * Scope for active replenishments.
     */
    public function scopeAtiva($query)
    {
        return $query->whereIn('status', [
            self::STATUS_SUGERIDA,
            self::STATUS_APROVADA,
            self::STATUS_SOLICITADA,
            self::STATUS_EM_TRANSITO,
            self::STATUS_RECEBIDA_PARCIAL,
        ]);
    }

    /**
     * Scope by priority.
     */
    public function scopePrioridade($query, $nivel)
    {
        return $query->where('prioridade', $nivel);
    }

    /**
     * Scope for overdue.
     */
    public function scopeAtrasada($query)
    {
        return $query->where('data_prevista_entrega', '<', now())
                    ->whereIn('status', [self::STATUS_SOLICITADA, self::STATUS_EM_TRANSITO]);
    }

    /**
     * Scope by type.
     */
    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo_reposicao', $tipo);
    }

    /**
     * Get days until delivery.
     */
    public function getDiasAteEntregaAttribute(): int
    {
        if (!$this->data_prevista_entrega) {
            return 0;
        }

        return now()->diffInDays($this->data_prevista_entrega, false);
    }

    /**
     * Check if replenishment needs attention.
     */
    public function precisaAtencao(): bool
    {
        return $this->isUrgente() ||
               $this->isAtrasada() ||
               ($this->status === self::STATUS_SUGERIDA && $this->data_sugerida->isPast());
    }
}
