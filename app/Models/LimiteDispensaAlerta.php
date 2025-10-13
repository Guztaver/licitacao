<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LimiteDispensaAlerta extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_material_id',
        'dispensa_licitacao_id',
        'secretaria_id',
        'tipo_alerta',
        'nivel_severidade',
        'status',
        'valor_acumulado',
        'limite_aplicavel',
        'percentual_utilizado',
        'valor_excedido',
        'periodo_inicio',
        'periodo_fim',
        'periodo_tipo',
        'titulo',
        'mensagem',
        'recomendacao',
        'acao_requerida',
        'notificado',
        'data_notificacao',
        'destinatarios_notificados',
        'created_by_user_id',
        'resolved_by_user_id',
        'resolucao',
        'data_resolucao',
    ];

    protected $casts = [
        'valor_acumulado' => 'decimal:2',
        'limite_aplicavel' => 'decimal:2',
        'percentual_utilizado' => 'decimal:2',
        'valor_excedido' => 'decimal:2',
        'periodo_inicio' => 'date',
        'periodo_fim' => 'date',
        'notificado' => 'boolean',
        'data_notificacao' => 'datetime',
        'data_resolucao' => 'datetime',
        'destinatarios_notificados' => 'array',
    ];

    protected $dates = [
        'periodo_inicio',
        'periodo_fim',
        'data_notificacao',
        'data_resolucao',
    ];

    /**
     * Get the categoria material for the alert.
     */
    public function categoriaMaterial(): BelongsTo
    {
        return $this->belongsTo(CategoriaMaterial::class);
    }

    /**
     * Get the dispensa licitacao for the alert.
     */
    public function dispensaLicita(): BelongsTo
    {
        return $this->belongsTo(DispensaLicitacao::class);
    }

    /**
     * Get the secretaria for the alert.
     */
    public function secretaria(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class);
    }

    /**
     * Get the user who created the alert.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Get the user who resolved the alert.
     */
    public function resolvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by_user_id');
    }

    /**
     * Get formatted valor acumulado.
     */
    public function getValorAcumuladoFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->valor_acumulado, 2, ',', '.');
    }

    /**
     * Get formatted limite aplicavel.
     */
    public function getLimiteAplicavelFormatadoAttribute(): string
    {
        return 'R$ ' . number_format($this->limite_aplicavel, 2, ',', '.');
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
     * Get formatted percentual utilizado.
     */
    public function getPercentualUtilizadoFormatadoAttribute(): string
    {
        return number_format($this->percentual_utilizado, 1, ',', '.') . '%';
    }

    /**
     * Get tipo alerta display text.
     */
    public function getTipoAlertaDisplayAttribute(): string
    {
        $tipos = [
            'limite_atingido' => 'Limite Atingido',
            'limite_excedido' => 'Limite Excedido',
            'bloqueio' => 'Bloqueio de Operação',
            'aviso_previo' => 'Aviso Prévio',
        ];

        return $tipos[$this->tipo_alerta] ?? $this->tipo_alerta;
    }

    /**
     * Get nivel severidade display text.
     */
    public function getNivelSeveridadeDisplayAttribute(): string
    {
        $niveis = [
            'baixo' => 'Baixa',
            'medio' => 'Média',
            'alto' => 'Alta',
            'critico' => 'Crítica',
        ];

        return $niveis[$this->nivel_severidade] ?? $this->nivel_severidade;
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'ativo' => 'Ativo',
            'visualizado' => 'Visualizado',
            'resolvido' => 'Resolvido',
            'ignorado' => 'Ignorado',
        ];

        return $statuses[$this->status] ?? $this->status;
    }

    /**
     * Get period description.
     */
    public function getPeriodoDescricaoAttribute(): string
    {
        $inicio = $this->periodo_inicio->format('m/Y');
        $fim = $this->periodo_fim->format('m/Y');
        $tipo = $this->periodo_tipo === 'anual' ? 'Anual' : 'Mensal';

        return "{$tipo}: {$inicio} - {$fim}";
    }

    /**
     * Get severity color for UI.
     */
    public function getSeverityColorAttribute(): string
    {
        $colors = [
            'baixo' => 'bg-blue-100 text-blue-800',
            'medio' => 'bg-yellow-100 text-yellow-800',
            'alto' => 'bg-orange-100 text-orange-800',
            'critico' => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->nivel_severidade] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            'ativo' => 'bg-green-100 text-green-800',
            'visualizado' => 'bg-blue-100 text-blue-800',
            'resolvido' => 'bg-gray-100 text-gray-800',
            'ignorado' => 'bg-gray-100 text-gray-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if alert can be marked as resolved.
     */
    public function podeResolver(): bool
    {
        return $this->status === 'ativo' || $this->status === 'visualizado';
    }

    /**
     * Mark alert as resolved.
     */
    public function resolver(string $resolucao, int $usuarioId): void
    {
        if ($this->podeResolver()) {
            $this->status = 'resolvido';
            $this->resolucao = $resolucao;
            $this->resolved_by_user_id = $usuarioId;
            $this->data_resolucao = now();
            $this->save();
        }
    }

    /**
     * Mark alert as viewed.
     */
    public function marcarComoVisualizado(): void
    {
        if ($this->status === 'ativo') {
            $this->status = 'visualizado';
            $this->save();
        }
    }

    /**
     * Send notification for the alert.
     */
    public function enviarNotificacao(): bool
    {
        if ($this->notificado) {
            return false;
        }

        // Aqui você implementaria a lógica de notificação
        // Por exemplo, enviar email, notificação no sistema, etc.

        $destinatarios = $this->getDestinatarios();

        $this->destinatarios_notificados = $destinatarios;
        $this->notificado = true;
        $this->data_notificacao = now();
        $this->save();

        return true;
    }

    /**
     * Get notification recipients.
     */
    private function getDestinatarios(): array
    {
        $destinatarios = [];

        // Adicionar gestor de compras se o alerta for crítico ou alto
        if (in_array($this->nivel_severidade, ['critico', 'alto'])) {
            $destinatarios[] = [
                'tipo' => 'gestor_compras',
                'email' => 'gestor.compras@dominio.gov.br',
                'nome' => 'Gestor de Compras'
            ];
        }

        // Adicionar secretaria da dispensa
        if ($this->secretaria) {
            $destinatarios[] = [
                'tipo' => 'secretaria',
                'id' => $this->secretaria_id,
                'email' => $this->secretaria->email_responsavel ?? null,
                'nome' => $this->secretaria->responsavel ?? $this->secretaria->nome
            ];
        }

        // Adicionar solicitante se houver dispensa
        if ($this->dispensaLicita && $this->dispensaLicita->usuarioSolicitante) {
            $destinatarios[] = [
                'tipo' => 'solicitante',
                'id' => $this->dispensaLicita->usuario_solicitante_id,
                'email' => $this->dispensaLicita->usuarioSolicitante->email,
                'nome' => $this->dispensaLicita->usuarioSolicitante->name
            ];
        }

        return $destinatarios;
    }

    /**
     * Get alert summary for dashboard.
     */
    public function getResumoAlerta(): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'tipo_alerta' => $this->tipo_alerta,
            'tipo_alerta_display' => $this->tipo_alerta_display,
            'nivel_severidade' => $this->nivel_severidade,
            'nivel_severidade_display' => $this->nivel_severidade_display,
            'valor_acumulado' => $this->valor_acumulado,
            'valor_acumulado_formatado' => $this->valor_acumulado_formatado,
            'limite_aplicavel' => $this->limite_aplicavel,
            'percentual_utilizado' => $this->percentual_utilizado,
            'percentual_utilizado_formatado' => $this->percentual_utilizado_formatado,
            'valor_excedido' => $this->valor_excedido,
            'valor_excedido_formatado' => $this->valor_excedido_formatado,
            'periodo_descricao' => $this->periodo_descricao,
            'status' => $this->status,
            'status_display' => $this->status_display,
            'severity_color' => $this->severity_color,
            'status_color' => $this->status_color,
            'categoria' => $this->categoriaMaterial,
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'notificado' => $this->notificado,
            'data_notificacao' => $this->data_notificacao?->format('d/m/Y H:i'),
        ];
    }

    /**
     * Scope to get active alerts.
     */
    public function scopeAtivos($query)
    {
        return $query->where('status', 'ativo');
    }

    /**
     * Scope to get alerts by severity level.
     */
    public function scopeSeveridade($query, string $severidade)
    {
        return $query->where('nivel_severidade', $severidade);
    }

    /**
     * Scope to get alerts by type.
     */
    public function scopeTipo($query, string $tipo)
    {
        return $query->where('tipo_alerta', $tipo);
    }

    /**
     * Scope to get alerts in a date range.
     */
    public function scopePeriodo($query, $inicio, $fim)
    {
        return $query->whereDate('periodo_inicio', '>=', $inicio)
                   ->whereDate('periodo_fim', '<=', $fim);
    }

    /**
     * Scope to get not notified alerts.
     */
    public function scopeNotificados($query, $notificado = true)
    {
        return $query->where('notificado', $notificado);
    }

    /**
     * Get alert statistics for reports.
     */
    public static function getEstatisticas(): array
    {
        $query = self::query();

        return [
            'total' => $query->count(),
            'ativos' => $query->ativos()->count(),
            'visualizados' => $query->where('status', 'visualizado')->count(),
            'resolvidos' => $query->where('status', 'resolvido')->count(),
            'ignorados' => $query->where('status', 'ignorado')->count(),
            'notificados' => $query->where('notificado', true)->count(),
            'nao_notificados' => $query->where('notificado', false)->count(),
            'por_severidade' => [
                'baixo' => $query->severidade('baixo')->count(),
                'medio' => $query->severidade('medio')->count(),
                'alto' => $query->severidade('alto')->count(),
                'critico' => $query->severidade('critico')->count(),
            ],
            'por_tipo' => [
                'limite_atingido' => $query->tipo('limite_atingido')->count(),
                'limite_excedido' => $query->tipo('limite_excedido')->count(),
                'bloqueio' => $query->tipo('bloqueio')->count(),
                'aviso_previo' => $query->tipo('aviso_previo')->count(),
            ],
        ];
    }

    /**
     * Generate periodic alerts for all categories.
     */
    public static function gerarAlertasPeriodicas(): array
    {
        $alertasGeradas = [];
        $categorias = CategoriaMaterial::comAlertas()->get();

        foreach ($categorias as $categoria) {
            // Gerar alerta mensal
            $alertaMensal = $categoria->gerarAlertaSeNecessario('mensal', now()->year, now()->month);
            if ($alertaMensal) {
                $alertasGeradas[] = $alertaMensal;
            }

            // Gerar alerta anual
            $alertaAnual = $categoria->gerarAlertaSeNecessario('anual', now()->year);
            if ($alertaAnual) {
                $alertasGeradas[] = $alertaAnual;
            }
        }

        return $alertasGeradas;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Send notification when alert is created
        static::created(function ($alerta) {
            if ($alerta->nivel_severidade === 'critico' || $alerta->nivel_severidade === 'alto') {
                $alerta->enviarNotificacao();
            }
        });
    }
}
