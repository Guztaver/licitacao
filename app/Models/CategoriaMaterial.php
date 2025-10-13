<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoriaMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'codigo',
        'descricao',
        'tipo',
        'ativo',
        'limite_dispensa_anual',
        'limite_dispensa_mensal',
        'limite_dispensa_quantidade',
        'periodo_limite',
        'alerta_percentual',
        'bloqueio_percentual',
        'alerta_ativo',
        'created_by_user_id',
    ];

    protected $casts = [
        'limite_dispensa_anual' => 'decimal:2',
        'limite_dispensa_mensal' => 'decimal:2',
        'limite_dispensa_quantidade' => 'integer',
        'alerta_percentual' => 'integer',
        'bloqueio_percentual' => 'integer',
        'alerta_ativo' => 'boolean',
        'ativo' => 'boolean',
    ];

    /**
     * Get the dispensa licitacoes for the categoria.
     */
    public function dispensaLicacoes(): HasMany
    {
        return $this->hasMany(DispensaLicitacao::class);
    }

    /**
     * Get the limite dispensa alertas for the categoria.
     */
    public function limiteDispensaAlertas(): HasMany
    {
        return $this->hasMany(LimiteDispensaAlerta::class);
    }

    /**
     * Get the user who created the categoria.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Get the applicable limit for a given period.
     */
    public function getLimiteAplicavel(string $periodo): float
    {
        return $this->periodo_limite === 'anual' && $periodo === 'anual'
            ? $this->limite_dispensa_anual
            : $this->limite_dispensa_mensal;
    }

    /**
     * Get the alert threshold for a given period.
     */
    public function getLimiteAlerta(string $periodo): float
    {
        $limite = $this->getLimiteAplicavel($periodo);
        return $limite * ($this->alerta_percentual / 100);
    }

    /**
     * Get the block threshold for a given period.
     */
    public function getLimiteBloqueio(string $periodo): float
    {
        $limite = $this->getLimiteAplicavel($periodo);
        return $limite * ($this->bloqueio_percentual / 100);
    }

    /**
     * Calculate current usage for a given period.
     */
    public function calcularUsoAtual(string $periodo, ?int $year = null, ?int $month = null): array
    {
        $query = $this->dispensaLicacoes()->where('status', '!=', 'cancelada');

        if ($periodo === 'anual') {
            $year = $year ?? now()->year;
            $query->whereYear('data_dispensa', $year);
        } else {
            $year = $year ?? now()->year;
            $month = $month ?? now()->month;
            $query->whereYear('data_dispensa', $year)
                  ->whereMonth('data_dispensa', $month);
        }

        $valorAcumulado = $query->sum('valor_total');
        $quantidadeAcumulada = $query->sum('quantidade');
        $totalDispensas = $query->count();

        $limiteAplicavel = $this->getLimiteAplicavel($periodo);
        $limiteAlerta = $this->getLimiteAlerta($periodo);
        $limiteBloqueio = $this->getLimiteBloqueio($periodo);

        $percentualUtilizado = $limiteAplicavel > 0 ? ($valorAcumulado / $limiteAplicavel) * 100 : 0;
        $valorExcedido = max(0, $valorAcumulado - $limiteAplicavel);

        return [
            'valor_acumulado' => $valorAcumulado,
            'quantidade_acumulada' => $quantidadeAcumulada,
            'total_dispensas' => $totalDispensas,
            'limite_aplicavel' => $limiteAplicavel,
            'limite_alerta' => $limiteAlerta,
            'limite_bloqueio' => $limiteBloqueio,
            'percentual_utilizado' => $percentualUtilizado,
            'valor_excedido' => $valorExcedido,
            'atingiu_limite' => $valorAcumulado >= $limiteAplicavel,
            'atingiu_alerta' => $valorAcumulado >= $limiteAlerta,
            'atingiu_bloqueio' => $valorAcumulado >= $limiteBloqueio,
            'pode_gerar_dispensa' => $valorAcumulado < $limiteBloqueio,
            'status_uso' => $this->getStatusUso($percentualUtilizado, $valorAcumulado, $limiteAplicavel),
        ];
    }

    /**
     * Get usage status based on percentage used.
     */
    public function getStatusUso(float $percentual, float $valorAcumulado, float $limite): string
    {
        if ($valorAcumulado >= $limite) {
            return 'excedido';
        } elseif ($percentual >= $this->bloqueio_percentual) {
            return 'bloqueado';
        } elseif ($percentual >= $this->alerta_percentual) {
            return 'alerta';
        } elseif ($percentual >= 50) {
            return 'atencao';
        } else {
            return 'normal';
        }
    }

    /**
     * Check if a new dispensa would exceed limits.
     */
    public function podeGerarDispensa(float $valor, string $periodo, ?int $year = null, ?int $month = null): array
    {
        $usoAtual = $this->calcularUsoAtual($periodo, $year, $month);
        $novoTotal = $usoAtual['valor_acumulado'] + $valor;
        $novoPercentual = $novoTotal > 0 ? ($novoTotal / $usoAtual['limite_aplicavel']) * 100 : 0;

        return [
            'pode_gerar' => $novoTotal <= $usoAtual['limite_bloqueio'],
            'valor_adicional' => $valor,
            'valor_total' => $novoTotal,
            'percentual_total' => $novoPercentual,
            'valor_excedido' => max(0, $novoTotal - $usoAtual['limite_aplicavel']),
            'atingira_alerta' => $novoTotal >= $usoAtual['limite_alerta'],
            'atingira_bloqueio' => $novoTotal >= $usoAtual['limite_bloqueio'],
            'atingira_limite' => $novoTotal >= $usoAtual['limite_aplicavel'],
            'mensagem' => $this->getMensagemValidacao($novoPercentual, $usoAtual),
        ];
    }

    /**
     * Get validation message for a new dispensa.
     */
    public function getMensagemValidacao(float $percentual, array $usoAtual): string
    {
        if ($percentual >= $usoAtual['bloqueio_percentual']) {
            return "Valor excede o limite de {$this->bloqueio_percentual}% (R$ " . number_format($usoAtual['limite_bloqueio'], 2, ',', '.') . "). Operação bloqueada.";
        } elseif ($percentual >= $this->alerta_percentual) {
            return "Atenção: Valor atingirá {$this->alerta_percentual}% do limite mensal/anal. Recomendado aguardar próximo período.";
        } else {
            return "Valor dentro dos limites permitidos.";
        }
    }

    /**
     * Generate alert if needed.
     */
    public function gerarAlertaSeNecessario(string $periodo, ?int $year = null, ?int $month = null): ?LimiteDispensaAlerta
    {
        if (!$this->alerta_ativo) {
            return null;
        }

        $usoAtual = $this->calcularUsoAtual($periodo, $year, $month);

        if (!$usoAtual['atingiu_alerta']) {
            return null;
        }

        $tipoAlerta = $usoAtual['atingiu_limite'] ? 'limite_excedido' : 'limite_atingido';
        $severidade = $this->getNivelSeveridade($usoAtual['percentual_utilizado']);

        return LimiteDispensaAlerta::create([
            'categoria_material_id' => $this->id,
            'tipo_alerta' => $tipoAlerta,
            'nivel_severidade' => $severidade,
            'valor_acumulado' => $usoAtual['valor_acumulado'],
            'limite_aplicavel' => $usoAtual['limite_aplicavel'],
            'percentual_utilizado' => $usoAtual['percentual_utilizado'],
            'valor_excedido' => $usoAtual['valor_excedido'],
            'periodo_inicio' => $periodo === 'anual'
                ? ($year ?? now()->year) . '-01-01'
                : ($year ?? now()->year) . '-' . sprintf('%02d', $month ?? now()->month) . '-01',
            'periodo_fim' => $periodo === 'anual'
                ? ($year ?? now()->year) . '-12-31'
                : ($year ?? now()->year) . '-' . sprintf('%02d', $month ?? now()->month) . '-01',
            'periodo_tipo' => $periodo,
            'titulo' => $this->getTituloAlerta($usoAtual, $periodo),
            'mensagem' => $this->getMensagemAlerta($usoAtual, $periodo),
            'recomendacao' => $this->getRecomendacaoAlerta($usoAtual),
            'acao_requerida' => $this->getAcaoRequerida($usoAtual),
        ]);
    }

    /**
     * Get alert severity level.
     */
    private function getNivelSeveridade(float $percentual): string
    {
        if ($percentual >= 100) return 'critico';
        if ($percentual >= $this->bloqueio_percentual) return 'alto';
        if ($percentual >= $this->alerta_percentual) return 'medio';
        return 'baixo';
    }

    /**
     * Get alert title.
     */
    private function getTituloAlerta(array $usoAtual, string $periodo): string
    {
        $periodoFormatado = $periodo === 'anual' ? 'Anual' : 'Mensal';
        return "Alerta de Limite - {$periodoFormatado}: {$this->nome}";
    }

    /**
     * Get alert message.
     */
    private function getMensagemAlerta(array $usoAtual, string $periodo): string
    {
        $periodoFormatado = $periodo === 'anual' ? 'ano' : 'mês';

        if ($usoAtual['atingiu_limite']) {
            return "Limite de dispensa de licitação {$periodoFormatado} excedido. Valor utilizado: R$ " .
                   number_format($usoAtual['valor_acumulado'], 2, ',', '.') .
                   " de R$ " . number_format($usoAtual['limite_aplicavel'], 2, ',', '.') .
                   " (" . number_format($usoAtual['percentual_utilizado'], 1, ',', '.') . "%).";
        } else {
            return "Alerta de proximidade ao limite de dispensa {$periodoFormatado}. Valor utilizado: R$ " .
                   number_format($usoAtual['valor_acumulado'], 2, ',', '.') .
                   " de R$ " . number_format($usoAtual['limite_aplicavel'], 2, ',', '.') .
                   " (" . number_format($usoAtual['percentual_utilizado'], 1, ',', '.') . "%).";
        }
    }

    /**
     * Get alert recommendation.
     */
    private function getRecomendacaoAlerta(array $usoAtual): string
    {
        if ($usoAtual['atingiu_limite']) {
            return "Solicitar autorização para processo licitatório formal ou aguardar o próximo período.";
        } else {
            return "Monitorar o consumo e planejar as próximas dispensas para não exceder o limite.";
        }
    }

    /**
     * Get required action.
     */
    private function getAcaoRequerida(array $usoAtual): string
    {
        if ($usoAtual['atingiu_limite']) {
            return "Solicitar processo licitatório";
        } else {
            return "Monitorar consumo";
        }
    }

    /**
     * Scope to get active categories.
     */
    public function scopeAtivas($query)
    {
        return $query->where('ativo', true);
    }

    /**
     * Scope to get categories by type.
     */
    public function scopeTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Scope to get categories with alerts enabled.
     */
    public function scopeComAlertas($query)
    {
        return $query->where('alerta_ativo', true);
    }

    /**
     * Get display text for lists.
     */
    public function getDisplayTextAttribute(): string
    {
        return "{$this->codigo} - {$this->nome}";
    }

    /**
     * Get type display text.
     */
    public function getTipoDisplayAttribute(): string
    {
        $tipos = [
            'material' => 'Material',
            'servico' => 'Serviço',
            'obra' => 'Obra',
        ];

        return $tipos[$this->tipo] ?? $this->tipo;
    }
}
