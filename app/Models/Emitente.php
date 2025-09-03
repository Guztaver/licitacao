<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Emitente extends Model
{
    use HasFactory;

    protected $table = 'emitentes';

    protected $fillable = [
        'nome',
        'sigla',
        'endereco',
        'telefone',
        'email',
    ];

    /**
     * Get the requisições for the emitente.
     */
    public function requisicoes(): HasMany
    {
        return $this->hasMany(Requisicao::class);
    }



    /**
     * Scope a query to search by name or sigla.
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nome', 'like', "%{$search}%")
              ->orWhere('sigla', 'like', "%{$search}%");
        });
    }



    /**
     * Get formatted telefone.
     */
    public function getTelefoneFormatadoAttribute(): string
    {
        if (empty($this->telefone)) {
            return '';
        }

        $telefone = preg_replace('/\D/', '', $this->telefone);

        if (strlen($telefone) === 11) {
            return '(' . substr($telefone, 0, 2) . ') ' .
                   substr($telefone, 2, 5) . '-' .
                   substr($telefone, 7, 4);
        } elseif (strlen($telefone) === 10) {
            return '(' . substr($telefone, 0, 2) . ') ' .
                   substr($telefone, 2, 4) . '-' .
                   substr($telefone, 6, 4);
        }

        return $this->telefone ?? '';
    }


}
