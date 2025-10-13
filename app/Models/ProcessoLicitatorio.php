<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class ProcessoLicitatorio extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "processos_licitatorios";

    protected $fillable = [
        "numero_processo",
        "objeto",
        "descricao",
        "modalidade",
        "tipo_licitacao",
        "status",
        "data_abertura",
        "data_homologacao",
        "data_adjudicacao",
        "valor_estimado",
        "valor_adjudicado",
        "setor_requisitante",
        "usuario_responsavel_id",
        "usuario_criacao_id",
        "observacoes",
    ];

    protected $casts = [
        "data_abertura" => "date",
        "data_homologacao" => "date",
        "data_adjudicacao" => "date",
        "valor_estimado" => "decimal:2",
        "valor_adjudicado" => "decimal:2",
    ];

    /**
     * Get the responsible user for the processo.
     */
    public function usuarioResponsavel(): BelongsTo
    {
        return $this->belongsTo(User::class, "usuario_responsavel_id");
    }

    /**
     * Get the user who created the processo.
     */
    public function usuarioCriacao(): BelongsTo
    {
        return $this->belongsTo(User::class, "usuario_criacao_id");
    }

    /**
     * Get the contratos for the processo.
     */
    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class, "processo_licitatorio_id");
    }

    /**
     * Get modalidade display name.
     */
    public function getModalidadeDisplayAttribute(): string
    {
        $modalidades = [
            "pregao_eletronico" => "Pregão Eletrônico",
            "pregao_presencial" => "Pregão Presencial",
            "concorrencia" => "Concorrência",
            "tomada_precos" => "Tomada de Preços",
            "convite" => "Convite",
            "dispensa" => "Dispensa de Licitação",
            "inexigibilidade" => "Inexigibilidade",
        ];

        return $modalidades[$this->modalidade] ?? $this->modalidade;
    }

    /**
     * Get tipo licitacao display name.
     */
    public function getTipoLicitacaoDisplayAttribute(): string
    {
        $tipos = [
            "menor_preco" => "Menor Preço",
            "melhor_tecnica" => "Melhor Técnica",
            "tecnica_preco" => "Técnica e Preço",
            "maior_lance" => "Maior Lance",
        ];

        return $tipos[$this->tipo_licitacao] ?? $this->tipo_licitacao;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            "em_elaboracao" => "Em Elaboração",
            "publicado" => "Publicado",
            "em_andamento" => "Em Andamento",
            "homologado" => "Homologado",
            "adjudicado" => "Adjudicado",
            "deserto" => "Deserto",
            "fracassado" => "Fracassado",
            "revogado" => "Revogado",
            "anulado" => "Anulado",
            "suspenso" => "Suspenso",
        ];

        return $status[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            "em_elaboracao" => "bg-gray-100 text-gray-800",
            "publicado" => "bg-blue-100 text-blue-800",
            "em_andamento" => "bg-yellow-100 text-yellow-800",
            "homologado" => "bg-green-100 text-green-800",
            "adjudicado" => "bg-green-100 text-green-800",
            "deserto" => "bg-red-100 text-red-800",
            "fracassado" => "bg-red-100 text-red-800",
            "revogado" => "bg-red-100 text-red-800",
            "anulado" => "bg-red-100 text-red-800",
            "suspenso" => "bg-orange-100 text-orange-800",
        ];

        return $colors[$this->status] ?? "bg-gray-100 text-gray-800";
    }

    /**
     * Check if processo can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, [
            "em_elaboracao",
            "publicado",
            "em_andamento",
            "suspenso",
        ]);
    }

    /**
     * Check if processo can be deleted.
     */
    public function podeExcluir(): bool
    {
        // Can only delete if in draft and no contracts linked
        return $this->status === "em_elaboracao" &&
            $this->contratos()->count() === 0;
    }

    /**
     * Check if processo is finalized.
     */
    public function isFinalizado(): bool
    {
        return in_array($this->status, [
            "homologado",
            "adjudicado",
            "deserto",
            "fracassado",
            "revogado",
            "anulado",
        ]);
    }

    /**
     * Check if processo is in dispensa or inexigibilidade.
     */
    public function isDispensaOuInexigibilidade(): bool
    {
        return in_array($this->modalidade, ["dispensa", "inexigibilidade"]);
    }

    /**
     * Scope for filtering by status.
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where("status", $status);
    }

    /**
     * Scope for filtering by modalidade.
     */
    public function scopeModalidade(Builder $query, string $modalidade): Builder
    {
        return $query->where("modalidade", $modalidade);
    }

    /**
     * Scope for active processos (not finalized).
     */
    public function scopeAtivos(Builder $query): Builder
    {
        return $query->whereNotIn("status", [
            "deserto",
            "fracassado",
            "revogado",
            "anulado",
        ]);
    }

    /**
     * Scope for finalized processos.
     */
    public function scopeFinalizados(Builder $query): Builder
    {
        return $query->whereIn("status", [
            "homologado",
            "adjudicado",
            "deserto",
            "fracassado",
            "revogado",
            "anulado",
        ]);
    }

    /**
     * Scope for searching by numero_processo or objeto.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where("numero_processo", "like", "%{$search}%")
                ->orWhere("objeto", "like", "%{$search}%")
                ->orWhere("setor_requisitante", "like", "%{$search}%");
        });
    }

    /**
     * Scope for filtering by date range.
     */
    public function scopeDateRange(
        Builder $query,
        ?string $startDate,
        ?string $endDate,
    ): Builder {
        if ($startDate) {
            $query->where("data_abertura", ">=", $startDate);
        }

        if ($endDate) {
            $query->where("data_abertura", "<=", $endDate);
        }

        return $query;
    }

    /**
     * Get all available modalidades.
     */
    public static function getModalidades(): array
    {
        return [
            "pregao_eletronico" => "Pregão Eletrônico",
            "pregao_presencial" => "Pregão Presencial",
            "concorrencia" => "Concorrência",
            "tomada_precos" => "Tomada de Preços",
            "convite" => "Convite",
            "dispensa" => "Dispensa de Licitação",
            "inexigibilidade" => "Inexigibilidade",
        ];
    }

    /**
     * Get all available tipos de licitacao.
     */
    public static function getTiposLicitacao(): array
    {
        return [
            "menor_preco" => "Menor Preço",
            "melhor_tecnica" => "Melhor Técnica",
            "tecnica_preco" => "Técnica e Preço",
            "maior_lance" => "Maior Lance",
        ];
    }

    /**
     * Get all available status.
     */
    public static function getStatus(): array
    {
        return [
            "em_elaboracao" => "Em Elaboração",
            "publicado" => "Publicado",
            "em_andamento" => "Em Andamento",
            "homologado" => "Homologado",
            "adjudicado" => "Adjudicado",
            "deserto" => "Deserto",
            "fracassado" => "Fracassado",
            "revogado" => "Revogado",
            "anulado" => "Anulado",
            "suspenso" => "Suspenso",
        ];
    }

    /**
     * Get duration in days.
     */
    public function getDuracaoEmDiasAttribute(): ?int
    {
        if (!$this->data_abertura) {
            return null;
        }

        $dataFim =
            $this->data_adjudicacao ?? ($this->data_homologacao ?? now());

        return $this->data_abertura->diffInDays($dataFim);
    }

    /**
     * Get economia percentage.
     */
    public function getEconomiaPercentualAttribute(): ?float
    {
        if (!$this->valor_estimado || !$this->valor_adjudicado) {
            return null;
        }

        if ($this->valor_estimado == 0) {
            return 0;
        }

        $economia = $this->valor_estimado - $this->valor_adjudicado;
        return ($economia / (float) $this->valor_estimado) * 100;
    }

    /**
     * Get economia value.
     */
    public function getEconomiaValorAttribute(): ?float
    {
        if (!$this->valor_estimado || !$this->valor_adjudicado) {
            return null;
        }

        return (float) $this->valor_estimado - (float) $this->valor_adjudicado;
    }
}
