<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IntegracaoPatrimonio extends Model
{
    use HasFactory;

    protected $table = 'integracoes_patrimonio';

    protected $fillable = [
        'requisicao_id',
        'contrato_item_id',
        'item_id',
        'patrimonio_id',
        'codigo_tombamento',
        'status',
        'nome_bem',
        'valor_aquisicao',
        'data_aquisicao',
        'localizacao',
        'responsavel',
        'setor',
        'marca',
        'modelo',
        'numero_serie',
        'placa',
        'caracteristicas',
        'dados_integracao',
        'resposta_integracao',
        'erro_integracao',
        'tentativas',
        'usuario_solicitacao_id',
        'data_solicitacao',
        'data_integracao',
        'proxima_tentativa',
    ];

    protected $casts = [
        'valor_aquisicao' => 'decimal:2',
        'data_aquisicao' => 'date',
        'data_solicitacao' => 'datetime',
        'data_integracao' => 'datetime',
        'proxima_tentativa' => 'datetime',
        'dados_integracao' => 'array',
        'resposta_integracao' => 'array',
        'tentativas' => 'integer',
    ];

    /**
     * Get the requisicao that owns the integracao.
     */
    public function requisicao(): BelongsTo
    {
        return $this->belongsTo(Requisicao::class);
    }

    /**
     * Get the contrato_item that owns the integracao.
     */
    public function contratoItem(): BelongsTo
    {
        return $this->belongsTo(ContratoItem::class);
    }

    /**
     * Get the item that owns the integracao.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the usuario that owns the integracao.
     */
    public function usuarioSolicitacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_solicitacao_id');
    }

    /**
     * Scope a query to only include pending integrations.
     */
    public function scopePendente($query)
    {
        return $query->where('status', 'pendente');
    }

    /**
     * Scope a query to only include integrating integrations.
     */
    public function scopeIntegrando($query)
    {
        return $query->where('status', 'integrando');
    }

    /**
     * Scope a query to only include integrated integrations.
     */
    public function scopeIntegrado($query)
    {
        return $query->where('status', 'integrado');
    }

    /**
     * Scope a query to only include failed integrations.
     */
    public function scopeComErro($query)
    {
        return $query->where('status', 'erro');
    }

    /**
     * Scope a query to only include integrations ready for retry.
     */
    public function scopeProntoParaRetentar($query)
    {
        return $query->whereIn('status', ['pendente', 'erro'])
                    ->whereNotNull('proxima_tentativa')
                    ->where('proxima_tentativa', '<=', now());
    }

    /**
     * Check if integration can be retried.
     */
    public function podeRetentar(): bool
    {
        return in_array($this->status, ['pendente', 'erro']) &&
               $this->tentativas < 5 && // Maximum 5 attempts
               (!$this->proxima_tentativa || $this->proxima_tentativa <= now());
    }

    /**
     * Check if integration is successful.
     */
    public function isIntegrado(): bool
    {
        return $this->status === 'integrado' && !empty($this->patrimonio_id);
    }

    /**
     * Mark integration as successful.
     */
    public function marcarComoIntegrado(string $patrimonioId, string $codigoTombamento = null, array $resposta = []): void
    {
        $this->update([
            'status' => 'integrado',
            'patrimonio_id' => $patrimonioId,
            'codigo_tombamento' => $codigoTombamento,
            'resposta_integracao' => $resposta,
            'data_integracao' => now(),
            'proxima_tentativa' => null,
        ]);
    }

    /**
     * Mark integration as failed.
     */
    public function marcarComoErro(string $mensagemErro, array $resposta = []): void
    {
        $this->increment('tentativas');

        $proximaTentativa = null;
        if ($this->tentativas < 5) {
            // Exponential backoff: 5min, 15min, 45min, 2h, 6h
            $minutos = min(5 * pow(3, $this->tentativas - 1), 360);
            $proximaTentativa = now()->addMinutes($minutos);
        }

        $this->update([
            'status' => $this->tentativas >= 5 ? 'rejeitado' : 'erro',
            'erro_integracao' => $mensagemErro,
            'resposta_integracao' => $resposta,
            'proxima_tentativa' => $proximaTentativa,
        ]);
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'pendente' => 'Pendente',
            'integrando' => 'Integrando',
            'integrado' => 'Integrado',
            'erro' => 'Erro',
            'rejeitado' => 'Rejeitado',
            default => $this->status,
        };
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pendente' => 'bg-yellow-100 text-yellow-800',
            'integrando' => 'bg-blue-100 text-blue-800',
            'integrado' => 'bg-green-100 text-green-800',
            'erro' => 'bg-red-100 text-red-800',
            'rejeitado' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Prepare data for patrimonio integration.
     */
    public function prepararDadosIntegracao(): array
    {
        return [
            'id_origem' => $this->id,
            'nome_bem' => $this->nome_bem,
            'descricao' => $this->caracteristicas,
            'valor_aquisicao' => $this->valor_aquisicao,
            'data_aquisicao' => $this->data_aquisicao->format('Y-m-d'),
            'numero_processo' => $this->requisicao->numero_completo ?? null,
            'fornecedor' => $this->requisicao->fornecedor->razao_social ?? null,
            'localizacao' => $this->localizacao,
            'responsavel' => $this->responsavel,
            'setor' => $this->setor,
            'marca' => $this->marca,
            'modelo' => $this->modelo,
            'numero_serie' => $this->numero_serie,
            'placa' => $this->placa,
            'especificacoes' => $this->caracteristicas,
            'usuario_solicitante' => $this->usuarioSolicitacao->name ?? null,
            'data_solicitacao' => $this->data_solicitacao->format('Y-m-d H:i:s'),
            'requisicao_id' => $this->requisicao_id,
            'contrato_id' => $this->requisicao->contrato_id ?? null,
        ];
    }
}