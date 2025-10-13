<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvaliacaoFornecedor extends Model
{
    use HasFactory;

    protected $fillable = [
        'fornecedor_id',
        'contrato_id',
        'requisicao_id',
        'avaliador_id',
        'tipo_avaliacao',
        'nota_qualidade',
        'nota_prazo',
        'nota_atendimento',
        'nota_preco',
        'nota_comunicacao',
        'nota_flexibilidade',
        'nota_documentacao',
        'nota_geral',
        'recomendacao',
        'data_inicio_avaliacao',
        'data_fim_avaliacao',
        'data_avaliacao',
        'descricao_servico',
        'valor_contrato',
        'documento_referencia',
        'pontos_positivos',
        'pontos_negativos',
        'sugestoes_melhoria',
        'observacoes',
        'acoes_corretivas',
        'data_seguimento',
        'requer_acao_corretiva',
        'status_acoes',
        'aprovador_id',
        'data_aprovacao',
        'status_aprovacao',
    ];

    protected $casts = [
        'nota_qualidade' => 'decimal:1',
        'nota_prazo' => 'decimal:1',
        'nota_atendimento' => 'decimal:1',
        'nota_preco' => 'decimal:1',
        'nota_comunicacao' => 'decimal:1',
        'nota_flexibilidade' => 'decimal:1',
        'nota_documentacao' => 'decimal:1',
        'nota_geral' => 'decimal:2',
        'valor_contrato' => 'decimal:2',
        'data_inicio_avaliacao' => 'date',
        'data_fim_avaliacao' => 'date',
        'data_avaliacao' => 'datetime',
        'data_seguimento' => 'date',
        'data_aprovacao' => 'datetime',
        'acoes_corretivas' => 'array',
    ];

    protected $dates = [
        'data_inicio_avaliacao',
        'data_fim_avaliacao',
        'data_avaliacao',
        'data_seguimento',
        'data_aprovacao',
    ];

    // Tipo avaliação constants
    const TIPO_CONTRATO = 'contrato';
    const TIPO_ENTREGA = 'entrega';
    const TIPO_PERIODICA = 'periodica';
    const TIPO_QUALIFICACAO = 'qualificacao';
    const TIPO_REAVALIACAO = 'reavaliacao';
    const TIPO_EMERGENCIAL = 'emergencial';

    // Recomendação constants
    const RECOMENDADO = 'recomendado';
    const RECOMENDADO_RESERVA = 'recomendado_reserva';
    const NAO_RECOMENDADO = 'nao_recomendado';
    const AVALIAR_NOVAMENTE = 'avaliar_novamente';

    // Status aprovação constants
    const STATUS_RASCUNHO = 'rascunho';
    const STATUS_AGUARDANDO_APROVACAO = 'aguardando_aprovacao';
    const STATUS_APROVADA = 'aprovada';
    const STATUS_REJEITADA = 'rejeitada';
    const STATUS_CANCELADA = 'cancelada';

    // Status ações constants
    const STATUS_PENDENTE = 'pendente';
    const STATUS_EM_ANDAMENTO = 'em_andamento';
    const STATUS_CONCLUIDA = 'concluida';
    const STATUS_NAO_APLICAVEL = 'nao_aplicavel';

    /**
     * Get the fornecedor that owns the avaliacao.
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the contrato that owns the avaliacao.
     */
    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }

    /**
     * Get the requisicao that owns the avaliacao.
     */
    public function requisicao(): BelongsTo
    {
        return $this->belongsTo(Requisicao::class);
    }

    /**
     * Get the avaliador that owns the avaliacao.
     */
    public function avaliador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'avaliador_id');
    }

    /**
     * Get the aprovador that owns the avaliacao.
     */
    public function aprovador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'aprovador_id');
    }

    /**
     * Get evaluation type display name.
     */
    public function getTipoAvaliacaoDisplayAttribute(): string
    {
        $tipos = [
            self::TIPO_CONTRATO => 'Avaliação de Contrato',
            self::TIPO_ENTREGA => 'Avaliação de Entrega',
            self::TIPO_PERIODICA => 'Avaliação Periódica',
            self::TIPO_QUALIFICACAO => 'Avaliação de Qualificação',
            self::TIPO_REAVALIACAO => 'Reavaliação',
            self::TIPO_EMERGENCIAL => 'Avaliação Emergencial',
        ];

        return $tipos[$this->tipo_avaliacao] ?? $this->tipo_avaliacao;
    }

    /**
     * Get recommendation display name.
     */
    public function getRecomendacaoDisplayAttribute(): string
    {
        $recomendacoes = [
            self::RECOMENDADO => 'Recomendado',
            self::RECOMENDADO_RESERVA => 'Recomendado com Ressalvas',
            self::NAO_RECOMENDADO => 'Não Recomendado',
            self::AVALIAR_NOVAMENTE => 'Requer Nova Avaliação',
        ];

        return $recomendacoes[$this->recomendacao] ?? $this->recomendacao;
    }

    /**
     * Get status approval display name.
     */
    public function getStatusAprovacaoDisplayAttribute(): string
    {
        $status = [
            self::STATUS_RASCUNHO => 'Rascunho',
            self::STATUS_AGUARDANDO_APROVACAO => 'Aguardando Aprovação',
            self::STATUS_APROVADA => 'Aprovada',
            self::STATUS_REJEITADA => 'Rejeitada',
            self::STATUS_CANCELADA => 'Cancelada',
        ];

        return $status[$this->status_aprovacao] ?? $this->status_aprovacao;
    }

    /**
     * Get recommendation color class.
     */
    public function getRecomendacaoColorAttribute(): string
    {
        $colors = [
            self::RECOMENDADO => 'bg-green-100 text-green-800',
            self::RECOMENDADO_RESERVA => 'bg-yellow-100 text-yellow-800',
            self::NAO_RECOMENDADO => 'bg-red-100 text-red-800',
            self::AVALIAR_NOVAMENTE => 'bg-blue-100 text-blue-800',
        ];

        return $colors[$this->recomendacao] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get overall rating display.
     */
    public function getNotaGeralDisplayAttribute(): string
    {
        if ($this->nota_geral >= 90) {
            return 'Excelente';
        } elseif ($this->nota_geral >= 75) {
            return 'Bom';
        } elseif ($this->nota_geral >= 60) {
            return 'Regular';
        } elseif ($this->nota_geral >= 40) {
            return 'Ruim';
        } else {
            return 'Crítico';
        }
    }

    /**
     * Get rating color based on score.
     */
    public function getRatingColor(float $nota): string
    {
        if ($nota >= 4.5) {
            return 'text-green-600';
        } elseif ($nota >= 3.5) {
            return 'text-blue-600';
        } elseif ($nota >= 2.5) {
            return 'text-yellow-600';
        } elseif ($nota >= 1.5) {
            return 'text-orange-600';
        } else {
            return 'text-red-600';
        }
    }

    /**
     * Calculate overall score based on individual criteria.
     */
    public function calcularNotaGeral(): float
    {
        $pesos = [
            'qualidade' => 0.30,
            'prazo' => 0.25,
            'atendimento' => 0.20,
            'preco' => 0.15,
            'comunicacao' => 0.10,
        ];

        $notas = [
            'qualidade' => $this->nota_qualidade,
            'prazo' => $this->nota_prazo,
            'atendimento' => $this->nota_atendimento,
            'preco' => $this->nota_preco,
            'comunicacao' => $this->nota_comunicacao,
        ];

        $notaTotal = 0;
        $pesoTotal = 0;

        foreach ($pesos as $criterio => $peso) {
            if ($notas[$criterio] !== null && $notas[$criterio] > 0) {
                $notaTotal += $notas[$criterio] * $peso;
                $pesoTotal += $peso;
            }
        }

        return $pesoTotal > 0 ? round($notaTotal / $pesoTotal, 2) : 0;
    }

    /**
     * Update supplier average scores after evaluation.
     */
    public function atualizarMediasFornecedor(): void
    {
        $fornecedor = $this->fornecedor;
        if (!$fornecedor) return;

        // Get all approved evaluations for this supplier
        $avaliacoes = self::where('fornecedor_id', $fornecedor->id)
            ->where('status_aprovacao', self::STATUS_APROVADA)
            ->get();

        if ($avaliacoes->isEmpty()) {
            return;
        }

        $count = $avaliacoes->count();

        // Calculate averages
        $fornecedor->update([
            'total_avaliacoes' => $count,
            'media_qualidade' => round($avaliacoes->avg('nota_qualidade'), 2),
            'media_prazo' => round($avaliacoes->avg('nota_prazo'), 2),
            'media_atendimento' => round($avaliacoes->avg('nota_atendimento'), 2),
            'media_preco' => round($avaliacoes->avg('nota_preco'), 2),
            'classificacao_geral' => round($avaliacoes->avg('nota_geral'), 2),
            'data_ultima_avaliacao' => now(),
            'data_proxima_avaliacao' => now()->addMonths(6),
        ]);

        // Update supplier status based on classification
        $this->atualizarStatusFornecedor($fornecedor);
    }

    /**
     * Update supplier status based on latest evaluation.
     */
    private function atualizarStatusFornecedor(Fornecedor $fornecedor): void
    {
        $classificacao = $fornecedor->classificacao_geral;

        if ($classificacao >= 85) {
            $status = 'ativo';
            $nivelRisco = 'baixo';
        } elseif ($classificacao >= 70) {
            $status = 'ativo';
            $nivelRisco = 'medio';
        } elseif ($classificacao >= 50) {
            $status = 'ativo';
            $nivelRisco = 'alto';
        } else {
            $status = 'em_analise';
            $nivelRisco = 'critico';
        }

        $fornecedor->update([
            'status_fornecedor' => $status,
            'nivel_risco' => $nivelRisco,
        ]);
    }

    /**
     * Determine recommendation based on scores.
     */
    public function determinarRecomendacao(): string
    {
        $nota = $this->nota_geral;

        if ($nota >= 85) {
            return self::RECOMENDADO;
        } elseif ($nota >= 60) {
            return self::RECOMENDADO_RESERVA;
        } elseif ($nota >= 40) {
            return self::AVALIAR_NOVAMENTE;
        } else {
            return self::NAO_RECOMENDADO;
        }
    }

    /**
     * Check if corrective actions are needed.
     */
    public function requerAcoesCorretivas(): bool
    {
        return $this->nota_qualidade < 3 ||
               $this->nota_prazo < 3 ||
               $this->nota_atendimento < 3 ||
               $this->getRecomendacao() === self::NAO_RECOMENDADO;
    }

    /**
     * Submit evaluation for approval.
     */
    public function enviarParaAprovacao(): bool
    {
        if ($this->status_aprovacao !== self::STATUS_RASCUNHO) {
            return false;
        }

        // Calculate overall score if not set
        if ($this->nota_geral === 0) {
            $this->nota_geral = $this->calcularNotaGeral();
        }

        // Determine recommendation if not set
        if (!$this->recomendacao) {
            $this->recomendacao = $this->determinarRecomendacao();
        }

        // Check if corrective actions are needed
        $this->requer_acao_corretiva = $this->requerAcoesCorretivas();
        if ($this->requer_acao_corretiva) {
            $this->data_seguimento = now()->addDays(30);
            $this->status_acoes = self::STATUS_PENDENTE;
        }

        return $this->update([
            'status_aprovacao' => self::STATUS_AGUARDANDO_APROVACAO,
            'nota_geral' => $this->nota_geral,
            'recomendacao' => $this->recomendacao,
            'requer_acao_corretiva' => $this->requer_acao_corretiva,
            'data_seguimento' => $this->data_seguimento,
            'status_acoes' => $this->status_acoes,
        ]);
    }

    /**
     * Approve evaluation.
     */
    public function aprovar(int $aprovadorId = null): bool
    {
        if ($this->status_aprovacao !== self::STATUS_AGUARDANDO_APROVACAO) {
            return false;
        }

        $this->update([
            'status_aprovacao' => self::STATUS_APROVADA,
            'aprovador_id' => $aprovadorId ?? auth()->id(),
            'data_aprovacao' => now(),
        ]);

        // Update supplier averages
        $this->atualizarMediasFornecedor();

        return true;
    }

    /**
     * Reject evaluation.
     */
    public function rejeitar(string $motivo, int $aprovadorId = null): bool
    {
        if ($this->status_aprovacao !== self::STATUS_AGUARDANDO_APROVACAO) {
            return false;
        }

        return $this->update([
            'status_aprovacao' => self::STATUS_REJEITADA,
            'aprovador_id' => $aprovadorId ?? auth()->id(),
            'data_aprovacao' => now(),
            'observacoes' => ($this->observacoes ?? '') . "\n\nREJEITADA: {$motivo}",
        ]);
    }

    /**
     * Update corrective actions status.
     */
    public function atualizarStatusAcoes(string $status): bool
    {
        if (!$this->requer_acao_corretiva) {
            return false;
        }

        return $this->update([
            'status_acoes' => $status,
        ]);
    }

    /**
     * Get evaluation summary.
     */
    public function getResumoAvaliacao(): array
    {
        return [
            'id' => $this->id,
            'fornecedor' => $this->fornecedor->razao_social,
            'tipo' => $this->tipo_avaliacao_display,
            'nota_geral' => $this->nota_geral,
            'classificacao' => $this->nota_geral_display,
            'recomendacao' => $this->recomendacao_display,
            'data_avaliacao' => $this->data_avaliacao->format('d/m/Y'),
            'avaliador' => $this->avaliador->name,
            'status' => $this->status_aprovacao_display,
            'requer_acao' => $this->requer_acao_corretiva,
            'cores' => [
                'classificacao' => $this->getRatingColor($this->nota_geral),
                'recomendacao' => $this->recomendacao_color,
            ],
        ];
    }

    /**
     * Scope for approved evaluations.
     */
    public function scopeAprovada($query)
    {
        return $query->where('status_aprovacao', self::STATUS_APROVADA);
    }

    /**
     * Scope by evaluation type.
     */
    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo_avaliacao', $tipo);
    }

    /**
     * Scope by period.
     */
    public function scopePeriodo($query, $dataInicio, $dataFim)
    {
        return $query->whereBetween('data_avaliacao', [$dataInicio, $dataFim]);
    }

    /**
     * Scope by supplier.
     */
    public function scopeFornecedor($query, $fornecedorId)
    {
        return $query->where('fornecedor_id', $fornecedorId);
    }

    /**
     * Scope by evaluator.
     */
    public function scopeAvaliador($query, $avaliadorId)
    {
        return $query->where('avaliador_id', $avaliadorId);
    }

    /**
     * Scope by recommendation.
     */
    public function scopeRecomendacao($query, $recomendacao)
    {
        return $query->where('recomendacao', $recomendacao);
    }

    /**
     * Scope needing corrective actions.
     */
    public function scopeRequerAcao($query)
    {
        return $query->where('requer_acao_corretiva', true);
    }

    /**
     * Get evaluation period display.
     */
    public function getPeriodoDisplayAttribute(): string
    {
        if ($this->data_inicio_avaliacao->format('d/m/Y') === $this->data_fim_avaliacao->format('d/m/Y')) {
            return $this->data_inicio_avaliacao->format('d/m/Y');
        }

        return $this->data_inicio_avaliacao->format('d/m/Y') . ' a ' . $this->data_fim_avaliacao->format('d/m/Y');
    }
}
