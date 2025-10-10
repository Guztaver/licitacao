<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contrato extends Model
{
    use HasFactory;

    protected $table = 'contratos';

    protected $fillable = [
        'fornecedor_id',
        'numero_contrato',
        'data_inicio',
        'data_fim',
        'limite_requisicoes',
        'limite_conferencias',
        'limite_valor_mensal',
        'descricao',
        'status',
        'usuario_criacao_id',
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'limite_requisicoes' => 'integer',
        'limite_conferencias' => 'integer',
        'limite_valor_mensal' => 'decimal:2',
    ];

    /**
     * Get the fornecedor that owns the contrato.
     *
     * @return BelongsTo<Fornecedor, Contrato>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the user who created the contrato.
     *
     * @return BelongsTo<User, Contrato>
     */
    public function usuarioCriacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_criacao_id');
    }

    /**
     * Get the valores mensais for the contrato.
     *
     * @return HasMany<ContratoValorMensal, Contrato>
     */
    public function valoresMensais(): HasMany
    {
        return $this->hasMany(ContratoValorMensal::class);
    }

    /**
     * Get the historico de limites for the contrato.
     *
     * @return HasMany<ContratoHistoricoLimite, Contrato>
     */
    public function historicoLimites(): HasMany
    {
        return $this->hasMany(ContratoHistoricoLimite::class);
    }

    /**
     * Temporary storage for pending limit changes.
     */
    private static $pendingChanges = [];

    /**
     * Boot the model and register observers.
     */
    protected static function boot()
    {
        parent::boot();

        // Register creation event
        static::created(function ($contrato) {
            ContratoHistoricoLimite::registrarCriacao(
                $contrato,
                $contrato->usuario_criacao_id,
            );
        });

        // Register update event
        static::updating(function ($contrato) {
            $camposMonitorados = [
                'limite_requisicoes',
                'limite_conferencias',
                'limite_valor_mensal',
            ];

            $alteracoes = [];

            foreach ($camposMonitorados as $campo) {
                $original = $contrato->getOriginal($campo);
                $novo = $contrato->getAttribute($campo);

                // Check if value changed
                if ($original != $novo) {
                    $alteracoes[$campo] = [
                        'anterior' => $original,
                        'novo' => $novo,
                    ];
                }
            }

            // Register changes if any
            if (! empty($alteracoes)) {
                // Store changes in static property
                self::$pendingChanges[$contrato->id] = $alteracoes;
            }
        });

        // Register after update to capture user context
        static::updated(function ($contrato) {
            if (isset(self::$pendingChanges[$contrato->id])) {
                ContratoHistoricoLimite::registrarAtualizacao(
                    $contrato,
                    self::$pendingChanges[$contrato->id],
                    auth()->id(),
                    'Atualização dos limites do contrato',
                );
                unset(self::$pendingChanges[$contrato->id]);
            }
        });
    }

    /**
     * Scope a query to only include active contratos.
     */
    public function scopeAtivo(Builder $query): Builder
    {
        return $query->where('status', 'ativo');
    }

    /**
     * Scope a query to only include contratos valid for a specific date.
     */
    public function scopeVigenteEm(
        Builder $query,
        \DateTimeInterface $data,
    ): Builder {
        return $query
            ->where('data_inicio', '<=', $data)
            ->where('data_fim', '>=', $data);
    }

    /**
     * Scope a query for a specific fornecedor.
     */
    public function scopeFornecedor(Builder $query, int $fornecedorId): Builder
    {
        return $query->where('fornecedor_id', $fornecedorId);
    }

    /**
     * Check if contrato is currently valid.
     */
    public function isVigente(): bool
    {
        $hoje = now()->startOfDay();

        return $this->status === 'ativo' &&
            $this->data_inicio <= $hoje &&
            $this->data_fim >= $hoje;
    }

    /**
     * Check if contrato is expired.
     */
    public function isExpirado(): bool
    {
        return $this->data_fim < now()->startOfDay();
    }

    /**
     * Check if contrato can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, ['ativo', 'inativo']);
    }

    /**
     * Check if contrato can be deleted.
     */
    public function podeExcluir(): bool
    {
        // Can only delete if no requisitions or conferences are linked
        $temRequisicoes = $this->getRequisicoes()->count() > 0;
        $temConferencias = $this->getConferencias()->count() > 0;

        return ! $temRequisicoes && ! $temConferencias;
    }

    /**
     * Get requisições linked to this contract.
     */
    public function getRequisicoes()
    {
        if (! $this->fornecedor_id) {
            return collect([]);
        }

        return Requisicao::query()
            ->where('fornecedor_id', $this->fornecedor_id)
            ->whereBetween('data_recebimento', [
                $this->data_inicio,
                $this->data_fim,
            ])
            ->where('status', '!=', 'excluida')
            ->get();
    }

    /**
     * Get conferências linked to this contract.
     */
    public function getConferencias()
    {
        if (! $this->fornecedor_id) {
            return collect([]);
        }

        return Conferencia::query()
            ->where('fornecedor_id', $this->fornecedor_id)
            ->where(function ($query) {
                $query
                    ->whereBetween('periodo_inicio', [
                        $this->data_inicio,
                        $this->data_fim,
                    ])
                    ->orWhereBetween('periodo_fim', [
                        $this->data_inicio,
                        $this->data_fim,
                    ])
                    ->orWhere(function ($q) {
                        $q->where(
                            'periodo_inicio',
                            '<=',
                            $this->data_inicio,
                        )->where('periodo_fim', '>=', $this->data_fim);
                    });
            })
            ->get();
    }

    /**
     * Get count of requisições for this contract.
     */
    public function getCountRequisicoes(): int
    {
        return $this->getRequisicoes()->count();
    }

    /**
     * Get count of conferências for this contract.
     */
    public function getCountConferencias(): int
    {
        return $this->getConferencias()->count();
    }

    /**
     * Check if requisição limit is reached.
     */
    public function limiteRequisioesAtingido(): bool
    {
        // If no limit set, never reached
        if ($this->limite_requisicoes === null) {
            return false;
        }

        return $this->getCountRequisicoes() >= $this->limite_requisicoes;
    }

    /**
     * Check if conferência limit is reached.
     */
    public function limiteConferenciasAtingido(): bool
    {
        // If no limit set, never reached
        if ($this->limite_conferencias === null) {
            return false;
        }

        return $this->getCountConferencias() >= $this->limite_conferencias;
    }

    /**
     * Get remaining requisições count.
     */
    public function getRequisicoesRestantes(): ?int
    {
        if ($this->limite_requisicoes === null) {
            return null; // Unlimited
        }

        $restantes = $this->limite_requisicoes - $this->getCountRequisicoes();

        return max(0, $restantes);
    }

    /**
     * Get remaining conferências count.
     */
    public function getConferenciasRestantes(): ?int
    {
        if ($this->limite_conferencias === null) {
            return null; // Unlimited
        }

        $restantes = $this->limite_conferencias - $this->getCountConferencias();

        return max(0, $restantes);
    }

    /**
     * Get total value used in a specific month.
     */
    public function getValorUsadoNoMes(int $ano, int $mes): float
    {
        return (float) $this->valoresMensais()
            ->where('ano', $ano)
            ->where('mes', $mes)
            ->sum('valor');
    }

    /**
     * Get remaining value for a specific month.
     */
    public function getValorRestanteNoMes(int $ano, int $mes): ?float
    {
        if ($this->limite_valor_mensal === null) {
            return null; // Unlimited
        }

        $usado = $this->getValorUsadoNoMes($ano, $mes);
        $restante = (float) $this->limite_valor_mensal - $usado;

        return max(0, $restante);
    }

    /**
     * Check if adding a value would exceed monthly limit.
     */
    public function excedeLimiteMensal(float $valor, int $ano, int $mes): bool
    {
        if ($this->limite_valor_mensal === null) {
            return false; // No limit
        }

        $valorUsado = $this->getValorUsadoNoMes($ano, $mes);

        return $valorUsado + $valor > (float) $this->limite_valor_mensal;
    }

    /**
     * Get the amount that exceeds the monthly limit.
     */
    public function getValorExcedente(float $valor, int $ano, int $mes): float
    {
        if ($this->limite_valor_mensal === null) {
            return 0;
        }

        $valorUsado = $this->getValorUsadoNoMes($ano, $mes);
        $total = $valorUsado + $valor;
        $limite = (float) $this->limite_valor_mensal;

        if ($total > $limite) {
            return $total - $limite;
        }

        return 0;
    }

    /**
     * Register a monthly value entry.
     */
    public function registrarValorMensal(
        Requisicao $requisicao,
        User $usuario,
    ): ?ContratoValorMensal {
        $dataRecebimento = $requisicao->data_recebimento;
        $ano = $dataRecebimento->year;
        $mes = $dataRecebimento->month;
        $valor = (float) ($requisicao->valor_final ?? 0);

        // Check if already registered
        $existente = ContratoValorMensal::query()
            ->where('contrato_id', $this->id)
            ->where('requisicao_id', $requisicao->id)
            ->first();

        if ($existente) {
            return $existente;
        }

        $excedeuLimite = $this->excedeLimiteMensal($valor, $ano, $mes);
        $valorExcedente = $excedeuLimite
            ? $this->getValorExcedente($valor, $ano, $mes)
            : null;

        return ContratoValorMensal::create([
            'contrato_id' => $this->id,
            'requisicao_id' => $requisicao->id,
            'usuario_id' => $usuario->id,
            'ano' => $ano,
            'mes' => $mes,
            'valor' => $valor,
            'excedeu_limite' => $excedeuLimite,
            'valor_excedente' => $valorExcedente,
        ]);
    }

    /**
     * Get monthly values summary.
     */
    public function getValoresMensaisSummary(): array
    {
        $summary = [];

        $valores = $this->valoresMensais()
            ->orderBy('ano', 'desc')
            ->orderBy('mes', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return $item->ano.
                    '-'.
                    str_pad($item->mes, 2, '0', STR_PAD_LEFT);
            });

        foreach ($valores as $periodo => $items) {
            [$ano, $mes] = explode('-', $periodo);
            $total = $items->sum('valor');
            $excedentes = $items->where('excedeu_limite', true);

            $summary[] = [
                'ano' => (int) $ano,
                'mes' => (int) $mes,
                'periodo_display' => sprintf('%02d/%d', (int) $mes, (int) $ano),
                'total' => $total,
                'limite' => $this->limite_valor_mensal,
                'restante' => $this->getValorRestanteNoMes(
                    (int) $ano,
                    (int) $mes,
                ),
                'excedeu' => $excedentes->count() > 0,
                'quantidade_requisicoes' => $items->count(),
                'valor_total_excedente' => $excedentes->sum('valor_excedente'),
            ];
        }

        return $summary;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statusMap = [
            'ativo' => 'Ativo',
            'inativo' => 'Inativo',
            'expirado' => 'Expirado',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            'ativo' => 'bg-green-100 text-green-800',
            'inativo' => 'bg-gray-100 text-gray-800',
            'expirado' => 'bg-red-100 text-red-800',
        ];

        return $colorMap[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get vigencia display.
     */
    public function getVigenciaDisplayAttribute(): string
    {
        $inicio = $this->data_inicio ? $this->data_inicio->format('d/m/Y') : '';
        $fim = $this->data_fim ? $this->data_fim->format('d/m/Y') : '';

        return $inicio.' a '.$fim;
    }

    /**
     * Update status based on dates.
     */
    public function atualizarStatus(): void
    {
        if ($this->isExpirado() && $this->status === 'ativo') {
            $this->update(['status' => 'expirado']);
        }
    }

    /**
     * Find active contract for fornecedor and date.
     */
    public static function findContratoVigente(
        ?int $fornecedorId,
        \DateTimeInterface $data,
    ): ?self {
        if (! $fornecedorId) {
            return null;
        }

        return self::query()
            ->ativo()
            ->fornecedor($fornecedorId)
            ->vigenteEm($data)
            ->first();
    }

    /**
     * Find active contract for fornecedor (today).
     */
    public static function findContratoVigenteHoje(?int $fornecedorId): ?self
    {
        return self::findContratoVigente($fornecedorId, now());
    }
}
