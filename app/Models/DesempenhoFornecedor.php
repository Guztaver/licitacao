<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class DesempenhoFornecedor extends Model
{
    use HasFactory;

    protected $fillable = [
        'fornecedor_id',
        'ano',
        'mes',
        'total_entregas',
        'entregas_no_prazo',
        'entregas_adiantadas',
        'entregas_atrasadas',
        'entregas_canceladas',
        'entregas_rejeitadas',
        'dias_medio_entrega',
        'dias_minimo_entrega',
        'dias_maximo_entrega',
        'total_dias_atraso',
        'total_dias_adianto',
        'total_itens_entregues',
        'itens_conformes',
        'itens_nao_conformes',
        'percentual_conformidade',
        'devolucoes_cliente',
        'retrabalhos_internos',
        'valor_total_faturado',
        'valor_medio_contrato',
        'valor_descontos_concedidos',
        'valor_multas_atraso',
        'valor_garantias',
        'total_contratos_periodo',
        'contratos_ativos',
        'contratos_encerrados',
        'contratos_renovados',
        'contratos_cancelados',
        'total_reclamacoes',
        'reclamacoes_resolvidas',
        'reclamacoes_pendentes',
        'tempo_medio_resposta_cl',
        'visitas_tecnicas',
        'possui_nao_conformidades',
        'nao_conformidades',
        'nao_conformidades_resolvidas',
        'certificacoes_atualizadas',
        'data_ultima_auditoria',
        'indice_desempenho_geral',
        'indice_confianca',
        'rentabilidade_media',
        'nivel_desempenho',
        'variacao_desempenho',
        'variacao_entregas',
        'variacao_valor',
    ];

    protected $casts = [
        'dias_medio_entrega' => 'integer',
        'dias_minimo_entrega' => 'integer',
        'dias_maximo_entrega' => 'integer',
        'total_dias_atraso' => 'integer',
        'total_dias_adianto' => 'integer',
        'percentual_conformidade' => 'decimal:2',
        'valor_total_faturado' => 'decimal:2',
        'valor_medio_contrato' => 'decimal:2',
        'valor_descontos_concedidos' => 'decimal:2',
        'valor_multas_atraso' => 'decimal:2',
        'valor_garantias' => 'decimal:2',
        'tempo_medio_resposta_cl' => 'decimal:2',
        'certificacoes_atualizadas' => 'boolean',
        'data_ultima_auditoria' => 'date',
        'indice_desempenho_geral' => 'decimal:2',
        'indice_confianca' => 'decimal:2',
        'rentabilidade_media' => 'decimal:2',
        'variacao_desempenho' => 'decimal:2',
        'variacao_entregas' => 'decimal:2',
        'variacao_valor' => 'decimal:2',
    ];

    protected $dates = ['data_ultima_auditoria'];

    // Nível desempenho constants
    const NIVEL_EXCELENTE = 'excelente';
    const NIVEL_BOM = 'bom';
    const NIVEL_REGULAR = 'regular';
    const NIVEL_RUIM = 'ruim';
    const NIVEL_CRITICO = 'critico';

    /**
     * Get the fornecedor that owns the desempenho.
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get performance level display name.
     */
    public function getNivelDesempenhoDisplayAttribute(): string
    {
        $niveis = [
            self::NIVEL_EXCELENTE => 'Excelente',
            self::NIVEL_BOM => 'Bom',
            self::NIVEL_REGULAR => 'Regular',
            self::NIVEL_RUIM => 'Ruim',
            self::NIVEL_CRITICO => 'Crítico',
        ];

        return $niveis[$this->nivel_desempenho] ?? 'Não avaliado';
    }

    /**
     * Get performance level color class.
     */
    public function getNivelDesempenhoColorAttribute(): string
    {
        $colors = [
            self::NIVEL_EXCELENTE => 'text-green-600 bg-green-50',
            self::NIVEL_BOM => 'text-blue-600 bg-blue-50',
            self::NIVEL_REGULAR => 'text-yellow-600 bg-yellow-50',
            self::NIVEL_RUIM => 'text-orange-600 bg-orange-50',
            self::NIVEL_CRITICO => 'text-red-600 bg-red-50',
        ];

        return $colors[$this->nivel_desempenho] ?? 'text-gray-600 bg-gray-50';
    }

    /**
     * Get delivery performance percentage.
     */
    public function getPercentualCumprimentoPrazoAttribute(): float
    {
        if ($this->total_entregas === 0) {
            return 0;
        }

        return round(($this->entregas_no_prazo / $this->total_entregas) * 100, 2);
    }

    /**
     * Get quality compliance percentage.
     */
    public function getPercentualConformidadeCalculadoAttribute(): float
    {
        if ($this->total_itens_entregues === 0) {
            return 100; // No items delivered, assume 100% compliance
        }

        return round(($this->itens_conformes / $this->total_itens_entregues) * 100, 2);
    }

    /**
     * Get complaint resolution rate.
     */
    public function getTaxaResolucaoReclamacoesAttribute(): float
    {
        if ($this->total_reclamacoes === 0) {
            return 100; // No complaints, assume 100% resolution
        }

        return round(($this->reclamacoes_resolvidas / $this->total_reclamacoes) * 100, 2);
    }

    /**
     * Get non-conformity resolution rate.
     */
    public function getTaxaResolucaoNaoConformidadesAttribute(): float
    {
        if ($this->nao_conformidades === 0) {
            return 100; // No non-conformities, assume 100% resolution
        }

        return round(($this->nao_conformidades_resolvidas / $this->nao_conformidades) * 100, 2);
    }

    /**
     * Calculate overall performance index.
     */
    public function calcularIndiceDesempenhoGeral(): float
    {
        $pesos = [
            'prazo' => 0.30,
            'qualidade' => 0.25,
            'comunicacao' => 0.20,
            'financeiro' => 0.15,
            'conformidade' => 0.10,
        ];

        $indices = [
            'prazo' => $this->getPercentualCumprimentoPrazo(),
            'qualidade' => $this->getPercentualConformidadeCalculado(),
            'comunicacao' => $this->getTaxaResolucaoReclamacoes(),
            'financeiro' => min(100, 100 - (($this->valor_multas_atraso / max(1, $this->valor_total_faturado)) * 100)),
            'conformidade' => $this->getTaxaResolucaoNaoConformidades(),
        ];

        $indiceTotal = 0;
        $pesoTotal = 0;

        foreach ($pesos as $criterio => $peso) {
            if (isset($indices[$criterio])) {
                $indiceTotal += $indices[$criterio] * $peso;
                $pesoTotal += $peso;
            }
        }

        return $pesoTotal > 0 ? round($indiceTotal / $pesoTotal, 2) : 0;
    }

    /**
     * Calculate confidence index.
     */
    public function calcularIndiceConfianca(): float
    {
        // Base confidence from performance index
        $confiancaBase = $this->calcularIndiceDesempenhoGeral();

        // Adjust based on consistency (variation from previous period)
        $fatorConsistencia = 1.0;
        if ($this->variacao_desempenho !== null) {
            $variacao = abs($this->variacao_desempenho);
            if ($variacao > 20) {
                $fatorConsistencia = 0.8; // High variation reduces confidence
            } elseif ($variacao > 10) {
                $fatorConsistencia = 0.9; // Medium variation slightly reduces confidence
            }
        }

        // Adjust based on certification status
        $fatorCertificacao = 1.0;
        if (!$this->certificacoes_atualizadas) {
            $fatorCertificacao = 0.9; // Outdated certifications reduce confidence
        }

        // Adjust based on non-conformities
        $fatorConformidade = 1.0;
        if ($this->possui_nao_conformidades && $this->nao_conformidades > 0) {
            $taxaResolucao = $this->getTaxaResolucaoNaoConformidades();
            if ($taxaResolucao < 80) {
                $fatorConformidade = 0.85; // Unresolved issues reduce confidence
            }
        }

        return round($confiancaBase * $fatorConsistencia * $fatorCertificacao * $fatorConformidade, 2);
    }

    /**
     * Determine performance level based on index.
     */
    public function determinarNivelDesempenho(): string
    {
        $indice = $this->indice_desempenho_geral;

        if ($indice >= 90) {
            return self::NIVEL_EXCELENTE;
        } elseif ($indice >= 75) {
            return self::NIVEL_BOM;
        } elseif ($indice >= 60) {
            return self::NIVEL_REGULAR;
        } elseif ($indice >= 40) {
            return self::NIVEL_RUIM;
        } else {
            return self::NIVEL_CRITICO;
        }
    }

    /**
     * Generate performance recommendations.
     */
    public function gerarRecomendacoes(): array
    {
        $recomendacoes = [];

        // Prazo recommendations
        if ($this->getPercentualCumprimentoPrazo() < 80) {
            $recomendacoes[] = [
                'area' => 'Prazo',
                'problema' => 'Baixo cumprimento de prazos (' . $this->getPercentualCumprimentoPrazo() . '%)',
                'sugestao' => 'Implementar sistema de acompanhamento e planejamento antecipado',
                'prioridade' => $this->getPercentualCumprimentoPrazo() < 60 ? 'alta' : 'media',
            ];
        }

        // Quality recommendations
        if ($this->getPercentualConformidadeCalculado() < 95) {
            $recomendacoes[] = [
                'area' => 'Qualidade',
                'problema' => 'Conformidade abaixo do esperado (' . $this->getPercentualConformidadeCalculado() . '%)',
                'sugestao' => 'Revisar processos de controle de qualidade e implementar checklists',
                'prioridade' => $this->getPercentualConformidadeCalculado() < 90 ? 'alta' : 'media',
            ];
        }

        // Customer service recommendations
        if ($this->getTaxaResolucaoReclamacoes() < 90) {
            $recomendacoes[] = [
                'area' => 'Atendimento',
                'problema' => 'Baixa taxa de resolução de reclamações (' . $this->getTaxaResolucaoReclamacoes() . '%)',
                'sugestao' => 'Melhorar processo de atendimento e estabelecer SLAs claros',
                'prioridade' => $this->getTaxaResolucaoReclamacoes() < 80 ? 'alta' : 'media',
            ];
        }

        // Financial recommendations
        if ($this->valor_multas_atraso > 0) {
            $recomendacoes[] = [
                'area' => 'Financeiro',
                'problema' => 'Multa por atraso no valor de R$ ' . number_format($this->valor_multas_atraso, 2, ',', '.'),
                'sugestao' => 'Melhorar planejamento financeiro e capacidade de entrega',
                'prioridade' => $this->valor_multas_atraso > ($this->valor_total_faturado * 0.05) ? 'alta' : 'media',
            ];
        }

        // Certification recommendations
        if (!$this->certificacoes_atualizadas) {
            $recomendacoes[] = [
                'area' => 'Certificação',
                'problema' => 'Certificações desatualizadas',
                'sugestao' => 'Agendar auditoria de recertificação',
                'prioridade' => 'media',
            ];
        }

        return $recomendacoes;
    }

    /**
     * Update performance metrics.
     */
    public function atualizarMetricas(): void
    {
        // Recalculate derived metrics
        $this->percentual_conformidade = $this->getPercentualConformidadeCalculado();

        // Calculate performance indices
        $this->indice_desempenho_geral = $this->calcularIndiceDesempenhoGeral();
        $this->indice_confianca = $this->calcularIndiceConfianca();

        // Determine performance level
        $this->nivel_desempenho = $this->determinarNivelDesempenho();

        // Calculate compliance rate
        $this->percentual_cumprimento_prazo = $this->getPercentualCumprimentoPrazo();

        $this->save();
    }

    /**
     * Get KPI summary.
     */
    public function getResumoKPIs(): array
    {
        return [
            'entregas' => [
                'total' => $this->total_entregas,
                'no_prazo' => $this->entregas_no_prazo,
                'atrasadas' => $this->entregas_atrasadas,
                'percentual_cumprimento' => $this->getPercentualCumprimentoPrazo(),
                'dias_medio' => $this->dias_medio_entrega,
            ],
            'qualidade' => [
                'total_itens' => $this->total_itens_entregues,
                'conformes' => $this->itens_conformes,
                'nao_conformes' => $this->itens_nao_conformes,
                'percentual_conformidade' => $this->getPercentualConformidadeCalculado(),
                'devolucoes' => $this->devolucoes_cliente,
            ],
            'financeiro' => [
                'valor_faturado' => $this->valor_total_faturado,
                'valor_medio_contrato' => $this->valor_medio_contrato,
                'multas_atraso' => $this->valor_multas_atraso,
                'garantias' => $this->valor_garantias,
            ],
            'contratos' => [
                'total_periodo' => $this->total_contratos_periodo,
                'ativos' => $this->contratos_ativos,
                'renovados' => $this->contratos_renovados,
                'cancelados' => $this->contratos_cancelados,
            ],
            'atendimento' => [
                'total_reclamacoes' => $this->total_reclamacoes,
                'resolvidas' => $this->reclamacoes_resolvidas,
                'pendentes' => $this->reclamacoes_pendentes,
                'taxa_resolucao' => $this->getTaxaResolucaoReclamacoes(),
                'tempo_medio_resposta' => $this->tempo_medio_resposta_cl . ' horas',
            ],
            'desempenho' => [
                'indice_geral' => $this->indice_desempenho_geral,
                'indice_confianca' => $this->indice_confianca,
                'nivel' => $this->nivel_desempenho_display,
                'cor_nivel' => $this->nivel_desempenho_color,
            ],
        ];
    }

    /**
     * Calculate performance trend vs previous period.
     */
    public function calcularTendenciaPeriodoAnterior(): array
    {
        $periodoAnterior = $this->mes > 1
            ? self::where('fornecedor_id', $this->fornecedor_id)
                  ->where('ano', $this->ano)
                  ->where('mes', $this->mes - 1)
                  ->first()
            : self::where('fornecedor_id', $this->fornecedor_id)
                  ->where('ano', $this->ano - 1)
                  ->where('mes', 12)
                  ->first();

        if (!$periodoAnterior) {
            return [
                'tendencia' => 'estavel',
                'variacao' => 0,
                'descricao' => 'Sem dados do período anterior',
            ];
        }

        $variacaoDesempenho = $this->indice_desempenho_geral - $periodoAnterior->indice_desempenho_geral;
        $variacaoEntregas = $this->total_entregas - $periodoAnterior->total_entregas;
        $variacaoValor = $this->valor_total_faturado - $periodoAnterior->valor_total_faturado;

        // Determine overall trend
        if ($variacaoDesempenho > 5) {
            $tendencia = 'melhorando';
            $descricao = 'Desempenho em melhoria';
        } elseif ($variacaoDesempenho < -5) {
            $tendencia = 'piorando';
            $descricao = 'Desempenho em deterioração';
        } else {
            $tendencia = 'estavel';
            $descricao = 'Desempenho estável';
        }

        return [
            'tendencia' => $tendencia,
            'descricao' => $descricao,
            'variacoes' => [
                'desempenho' => $variacaoDesempenho,
                'entregas' => $variacaoEntregas,
                'valor' => $variacaoValor,
            ],
            'comparacao' => [
                'periodo_atual' => $this->getResumoKPIs(),
                'periodo_anterior' => $periodoAnterior->getResumoKPIs(),
            ],
        ];
    }

    /**
     * Create or update performance record.
     */
    public static function atualizarDesempenhoPeriodo(
        int $fornecedorId,
        int $ano,
        int $mes = 0
    ): self {

        $desempenho = self::updateOrCreate(
            ['fornecedor_id' => $fornecedorId, 'ano' => $ano, 'mes' => $mes],
            []
        );

        // Calculate metrics from contracts, requisitions, etc.
        // This would integrate with existing systems to gather real data

        // For now, simulate some calculations
        $desempenho->atualizarMetricas();

        return $desempenho;
    }

    /**
     * Scope by year.
     */
    public function scopeAno($query, $ano)
    {
        return $query->where('ano', $ano);
    }

    /**
     * Scope by month.
     */
    public function scopeMes($query, $mes)
    {
        return $query->where('mes', $mes);
    }

    /**
     * Scope by performance level.
     */
    public function scopeNivel($query, $nivel)
    {
        return $query->where('nivel_desempenho', $nivel);
    }

    /**
     * Scope by performance index range.
     */
    public function scopeIndiceRange($query, float $min, float $max)
    {
        return $query->whereBetween('indice_desempenho_geral', [$min, $max]);
    }

    /**
     * Scope for suppliers with delivery issues.
     */
    public function scopeProblemasPrazo($query)
    {
        return $query->whereRaw('(entregas_no_prazo / total_entregas) < 0.8');
    }

    /**
     * Scope for suppliers with quality issues.
     */
    public function scopeProblemasQualidade($query)
    {
        return $query->whereRaw('(itens_conformes / total_itens_entregues) < 0.95');
    }

    /**
     * Get period display.
     */
    public function getPeriodoDisplayAttribute(): string
    {
        if ($this->mes === 0) {
            return $this->ano;
        }

        return sprintf('%02d/%d', $this->mes, $this->ano);
    }
}
