<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContratoValorMensal extends Model
{
    use HasFactory;

    protected $table = 'contrato_valores_mensais';

    protected $fillable = [
        'contrato_id',
        'requisicao_id',
        'usuario_id',
        'ano',
        'mes',
        'valor',
        'excedeu_limite',
        'valor_excedente',
    ];

    protected $casts = [
        'ano' => 'integer',
        'mes' => 'integer',
        'valor' => 'decimal:2',
        'excedeu_limite' => 'boolean',
        'valor_excedente' => 'decimal:2',
    ];

    /**
     * Get the contrato that owns the valor mensal.
     *
     * @return BelongsTo<Contrato, ContratoValorMensal>
     */
    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }

    /**
     * Get the requisicao that owns the valor mensal.
     *
     * @return BelongsTo<Requisicao, ContratoValorMensal>
     */
    public function requisicao(): BelongsTo
    {
        return $this->belongsTo(Requisicao::class);
    }

    /**
     * Get the usuario that created the valor mensal.
     *
     * @return BelongsTo<User, ContratoValorMensal>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Get formatted month/year display.
     */
    public function getMesAnoDisplayAttribute(): string
    {
        return sprintf('%02d/%d', $this->mes, $this->ano);
    }

    /**
     * Get formatted valor.
     */
    public function getValorFormatadoAttribute(): string
    {
        return number_format((float) ($this->valor ?? 0), 2, ',', '.');
    }

    /**
     * Get formatted valor excedente.
     */
    public function getValorExcedenteFormatadoAttribute(): string
    {
        return number_format(
            (float) ($this->valor_excedente ?? 0),
            2,
            ',',
            '.',
        );
    }
}
