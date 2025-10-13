<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Secretaria extends Model
{
    use HasFactory;

    protected $table = 'secretarias';

    protected $fillable = [
        'nome',
        'sigla',
        'descricao',
        'responsavel',
        'email_responsavel',
        'ativa',
    ];

    protected $casts = [
        'ativa' => 'boolean',
    ];

    /**
     * Get the pedidos compras for the secretaria.
     *
     * @return HasMany<PedidoCompra>
     */
    public function pedidosCompras(): HasMany
    {
        return $this->hasMany(PedidoCompra::class);
    }

    /**
     * Get display text for lists.
     */
    public function getDisplayTextAttribute(): string
    {
        return "{$this->sigla} - {$this->nome}";
    }

    /**
     * Get formatted status.
     */
    public function getStatusDisplayAttribute(): string
    {
        return $this->ativa ? 'Ativa' : 'Inativa';
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return $this->ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    /**
     * Scope a query to only include active secretarias.
     */
    public function scopeAtivas($query)
    {
        return $query->where('ativa', true);
    }

    /**
     * Scope a query to search secretarias.
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function($q) use ($term) {
            $q->where('nome', 'like', "%{$term}%")
              ->orWhere('sigla', 'like', "%{$term}%")
              ->orWhere('responsavel', 'like', "%{$term}%");
        });
    }
}
