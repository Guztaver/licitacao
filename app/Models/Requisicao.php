<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Requisicao extends Model
{
    use HasFactory;

    protected $table = 'requisicoes';

    protected $fillable = [
        'numero',
        'numero_completo',
        'emitente_id',
        'destinatario_id',
        'solicitante',
        'numero_oficio',
        'data_recebimento',
        'descricao',
        'fornecedor_id',
        'anexo',
        'status',
        'numero_pedido_real',
        'valor_final',
        'data_concretizacao',
        'usuario_concretizacao_id',
        'data_exclusao',
        'usuario_exclusao_id',
        'motivo_exclusao',
        'usuario_criacao_id',
    ];

    protected $casts = [
        'data_recebimento' => 'date',
        'data_concretizacao' => 'datetime',
        'data_exclusao' => 'datetime',
        'valor_final' => 'decimal:2',
    ];

    /**
     * Get the emitente that owns the requisicao.
     *
     * @return BelongsTo<Emitente, Requisicao>
     */
    public function emitente(): BelongsTo
    {
        return $this->belongsTo(Emitente::class);
    }

    /**
     * Get the destinatario that owns the requisicao.
     *
     * @return BelongsTo<Destinatario, Requisicao>
     */
    public function destinatario(): BelongsTo
    {
        return $this->belongsTo(Destinatario::class);
    }

    /**
     * Get the fornecedor that owns the requisicao.
     *
     * @return BelongsTo<Fornecedor, Requisicao>
     */
    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    /**
     * Get the user who created the requisicao.
     *
     * @return BelongsTo<User, Requisicao>
     */
    public function usuarioCriacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_criacao_id');
    }

    /**
     * Get the user who finalized the requisicao.
     *
     * @return BelongsTo<User, Requisicao>
     */
    public function usuarioConcretizacao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_concretizacao_id');
    }

    /**
     * Get the user who deleted the requisicao.
     *
     * @return BelongsTo<User, Requisicao>
     */
    public function usuarioExclusao(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_exclusao_id');
    }

    /**
     * Scope a query to only include active requisições.
     */
    public function scopeAtiva(Builder $query): Builder
    {
        return $query->where('status', '!=', 'excluida');
    }

    /**
     * Scope a query to only include finalized requisições.
     */
    public function scopeConcretizada(Builder $query): Builder
    {
        return $query->where('status', 'concretizada');
    }

    /**
     * Scope a query for a specific period.
     */
    public function scopePeriodo(Builder $query, \DateTime $inicio, \DateTime $fim): Builder
    {
        return $query->whereBetween('data_recebimento', [$inicio, $fim]);
    }

    /**
     * Generate next sequential number.
     */
    public static function gerarProximoNumero(): string
    {
        $ultimaRequisicao = self::query()->orderBy('id', 'desc')->first();

        if (! $ultimaRequisicao) {
            return '001';
        }

        $ultimoNumero = (int) $ultimaRequisicao->numero;
        $proximoNumero = $ultimoNumero + 1;

        return str_pad($proximoNumero, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Generate complete number with sigla.
     */
    public function gerarNumeroCompleto(): string
    {
        return $this->numero.'/'.$this->emitente->sigla;
    }

    /**
     * Check if requisicao can be edited.
     */
    public function podeEditar(): bool
    {
        return in_array($this->status, ['autorizada']);
    }

    /**
     * Check if requisicao can be finalized.
     */
    public function podeConcretizar(): bool
    {
        return $this->status === 'autorizada';
    }

    /**
     * Check if requisicao can be deleted.
     */
    public function podeExcluir(): bool
    {
        return in_array($this->status, ['autorizada', 'cancelada']);
    }

    /**
     * Check if requisicao can be cancelled.
     */
    public function podeCancelar(): bool
    {
        return $this->status === 'autorizada';
    }

    /**
     * Concretizar requisição.
     *
     * @param  array<string, mixed>  $dados
     */
    public function concretizar(array $dados, User $usuario): void
    {
        $this->update([
            'status' => 'concretizada',
            'fornecedor_id' => $dados['fornecedor_id'] ?? $this->fornecedor_id,
            'numero_pedido_real' => $dados['numero_pedido_real'],
            'valor_final' => $dados['valor_final'],
            'data_concretizacao' => now(),
            'usuario_concretizacao_id' => $usuario->id,
        ]);
    }

    /**
     * Cancelar requisição.
     */
    public function cancelar(string $motivo, User $usuario): void
    {
        $this->update([
            'status' => 'cancelada',
            'data_exclusao' => now(),
            'usuario_exclusao_id' => $usuario->id,
            'motivo_exclusao' => $motivo,
        ]);
    }

    /**
     * Excluir requisição logicamente.
     */
    public function excluirLogicamente(string $motivo, User $usuario): void
    {
        $this->update([
            'status' => 'excluida',
            'data_exclusao' => now(),
            'usuario_exclusao_id' => $usuario->id,
            'motivo_exclusao' => $motivo,
        ]);
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statusMap = [
            'autorizada' => 'Autorizada',
            'concretizada' => 'Concretizada',
            'cancelada' => 'Cancelada',
            'excluida' => 'Excluída',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            'autorizada' => 'bg-blue-100 text-blue-800',
            'concretizada' => 'bg-green-100 text-green-800',
            'cancelada' => 'bg-yellow-100 text-yellow-800',
            'excluida' => 'bg-red-100 text-red-800',
        ];

        return $colorMap[$this->status] ?? 'bg-gray-100 text-gray-800';
    }
}
