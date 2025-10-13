<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class DispensaLicitacao extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'categoria_material_id',
        'numero_processo',
        'numero_dispensa',
        'objeto',
        'valor_total',
        'data_dispensa',
        'data_inicio_vigencia',
        'data_fim_vigencia',
        'quantidade',
        'status',
        'excedeu_limite',
        'motivo_excedimento',
        'justificativa',
        'limite_anual_disponivel',
        'limite_mensal_disponivel',
        'valor_excedido',
        'fornecedor_id',
        'secretaria_id',
        'usuario_solicitante_id',
        'usuario_aprovador_id',
        'observacoes',
        'documentos',
    ];

    protected $casts = [
        'valor_total' => 'decimal:2',
        'limite_anual_disponivel' => 'decimal:2',
        'limite_mensal_disponivel' => 'decimal:2',
        'valor_excedido' => 'decimal:2',
        'data_dispensa' => 'date',
        'data_inicio_vigencia' => 'date',
        'data_fim_vigencia' => 'date',
        'quantidade' => 'integer',
        'excedeu_limite' => 'boolean',
        'documentos' => 'array',
    ];

    protected $dates = [
        'data_dispensa',
        'data_inicio_vigencia',
        'data_fim_vigencia',
    ];

    /**
     * Get the item for the dispensa.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the categoria material for the dispensa.
     */
    public function categoriaMaterial(): BelongsTo
    {
        return $this->belongsTo(CategoriaMaterial::class);
    }

    /**
     * Get the fornecedor for the dispensa.
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the secretaria for the dispensa.
     */
    public function secretaria(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class);
    }

    /**
     * Get the usuario solicitante for the dispensa.
     */
    public function usuarioSolicitante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_solicitante_id');
    }

    /**
     * Get the usuario aprovador for the dispensa.
     */
    public function usuarioAprovador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_aprovador_id');
    }

    /**
     * Get the limite dispensa alertas for the dispensa.
     */
    public function limiteDispensaAlertas(): HasMany
    {
        return $this->hasMany(LimiteDispensaAlerta::class);
    }

    /**
     * Get formatted valor total.
     */
    public function getValorTotalFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->valor_total, 2, ',', '.');
    }

    /**
     * Get formatted valor excedido.
     */
    public function getValorExcedidoFormatadoAttribute(): string
    {
        if (!$this->valor_excedido || $this->valor_excedido == 0) {
            return 'R$ 0,00';
        }
        return 'R$ ' . number_format($this->valor_excedido, 2, ',', '.');
    }

    /**
     * Get formatted data dispensa.
     */
    public function getDataDispensaFormatadaAttribute(): string
    {
        return $this->data_dispensa ? $this->data_dispensa->format('d/m/Y') : '';
    }

    /**
     * Get formatted data inicio vigencia.
     */
    public function getDataInicioVigenciaFormatadaAttribute(): string
    {
        return $this->data_inicio_vigencia ? $this->data_inicio_vigencia->format('d/m/Y') : '';
    }

    /**
     * Get formatted data fim vigencia.
     */
    public function getDataFimVigenciaFormatadaAttribute(): string
    {
        return $this->data_fim_vigencia ? $this->data_fim_vigencia->format('d/m/Y') : '';
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'rascunho' => 'Rascunho',
            'aprovada' => 'Aprovada',
            'rejeitada' => 'Rejeitada',
            'executada' => 'Em Execução',
            'concluida' => 'Concluída',
            'cancelada' => 'Cancelada',
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
            'aprovada' => 'bg-green-100 text-green-800',
            'rejeitada' => 'bg-red-100 text-red-800',
            'executada' => 'bg-blue-100 text-blue-800',
            'concluida' => 'bg-green-100 text-green-800',
            'cancelada' => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if dispensa can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, ['rascunho', 'rejeitada']);
    }

    /**
     * Check if dispensa can be approved.
     */
    public function podeAprovar(): bool
    {
        return $this->status === 'rascunho';
    }

    /**
     * Check if dispensa can be rejected.
     */
    public function podeRejeitar(): bool
    {
        return $this->status === 'rascunho';
    }

    /**
     * Check if dispensa can be executed.
     */
    public function podeExecutar(): bool
    {
        return $this->status === 'aprovada';
    }

    /**
     * Check if dispensa can be concluded.
     */
    public function podeConcluir(): bool
    {
        return $this->status === 'executada';
    }

    /**
     * Check if dispensa can be cancelled.
     */
    public function podeCancelar(): bool
    {
        return !in_array($this->status, ['concluida', 'cancelada']);
    }

    /**
     * Check if dispensa is within validity period.
     */
    public function estaVigente(): bool
    {
        if (!$this->data_inicio_vigencia || !$this->data_fim_vigencia) {
            return false;
        }

        $hoje = now();
        return $hoje->between($this->data_inicio_vigencia, $this->data_fim_vigencia);
    }

    /**
     * Validate limits before creating or updating dispensa.
     */
    public function validarLimites(): array
    {
        $errors = [];

        if (!$this->categoriaMaterial) {
            return $errors;
        }

        $periodo = 'mensal'; // Default to monthly for validation
        $validacao = $this->categoriaMaterial->podeGerarDispensa(
            $this->valor_total,
            $periodo,
            now()->year,
            now()->month
        );

        if (!$validacao['pode_gerar']) {
            $errors['limite_excedido'] = $validacao['mensagem'];
            $this->excedeu_limite = true;
            $this->motivo_excedimento = $validacao['mensagem'];
        }

        return $errors;
    }

    /**
     * Approve the dispensa.
     */
    public function aprovar(int $usuarioAprovadorId): void
    {
        if ($this->podeAprovar()) {
            $this->status = 'aprovada';
            $this->usuario_aprovador_id = $usuarioAprovadorId;
            $this->save();

            // Generate alerts if needed
            if ($this->categoriaMaterial) {
                $this->categoriaMaterial->gerarAlertaSeNecessario('mensal');
            }
        }
    }

    /**
     * Reject the dispensa.
     */
    public function rejeitar(int $usuarioAprovadorId, string $motivo): void
    {
        if ($this->podeRejeitar()) {
            $this->status = 'rejeitada';
            $this->usuario_aprovador_id = $usuarioAprovadorId;
            $this->observacoes = ($this->observacoes ? $this->observacoes . "\n\n" : '') .
                               "REJEITADO: {$motivo}";
            $this->save();
        }
    }

    /**
     * Start execution of the dispensa.
     */
    public function iniciarExecucao(): void
    {
        if ($this->podeExecutar()) {
            $this->status = 'executada';
            $this->save();
        }
    }

    /**
     * Conclude the dispensa.
     */
    public function concluir(): void
    {
        if ($this->podeConcluir()) {
            $this->status = 'concluida';
            $this->save();
        }
    }

    /**
     * Cancel the dispensa.
     */
    public function cancelar(string $motivo): void
    {
        if ($this->podeCancelar()) {
            $this->status = 'cancelada';
            $this->observacoes = ($this->observacoes ? $this->observacoes . "\n\n" : '') .
                               "CANCELADO: {$motivo}";
            $this->save();
        }
    }

    /**
     * Get usage summary for reports.
     */
    public function getResumoUso(): array
    {
        return [
            'valor_total' => $this->valor_total,
            'valor_excedido' => $this->valor_excedido,
            'percentual_excedido' => $this->limite_mensal_disponivel > 0
                ? ($this->valor_excedido / $this->limite_mensal_disponivel) * 100
                : 0,
            'excedeu_limite' => $this->excedeu_limite,
            'categoria' => $this->categoriaMaterial,
            'secretaria' => $this->secretaria,
            'fornecedor' => $this->fornecedor,
        ];
    }

    /**
     * Scope to get dispensas by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get dispensas that exceeded limits.
     */
    public function scopeExcedeuLimite($query)
    {
        return $query->where('excedeu_limite', true);
    }

    /**
     * Scope to get dispensas in a date range.
     */
    public function scopePeriodo($query, $inicio, $fim)
    {
        return $query->whereBetween('data_dispensa', [$inicio, $fim]);
    }

    /**
     * Scope to get dispensas by categoria.
     */
    public function scopeCategoria($query, int $categoriaId)
    {
        return $query->where('categoria_material_id', $categoriaId);
    }

    /**
     * Scope to get dispensas by secretaria.
     */
    public function scopeSecretaria($query, int $secretariaId)
    {
        return $query->where('secretaria_id', $secretariaId);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Validate limits before saving
        static::saving(function ($dispensa) {
            if ($dispensa->status === 'aprovada') {
                $errors = $dispensa->validarLimites();
                if (!empty($errors)) {
                    throw new \InvalidArgumentException($errors['limite_excedido'] ?? 'Erro de validação de limites');
                }
            }
        });
    }
}
