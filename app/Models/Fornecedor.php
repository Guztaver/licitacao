<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Fornecedor extends Model
{
    use HasFactory;

    protected $table = 'fornecedores';

    protected $fillable = [
        'razao_social',
        'cnpj',
        'telefone',
        'email',
        'endereco',
        'cidade',
        'estado',
        'cep',
        'contato',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    /**
     * Get the requisicoes for the fornecedor.
     *
     * @return HasMany<Requisicao, Fornecedor>
     */
    public function requisicoes(): HasMany
    {
        return $this->hasMany(Requisicao::class);
    }

    /**
     * Get the pedidos manuais for the fornecedor.
     *
     * @return HasMany<PedidoManual, Fornecedor>
     */
    public function pedidosManuais(): HasMany
    {
        return $this->hasMany(PedidoManual::class);
    }

    /**
     * Get the conferencias for the fornecedor.
     *
     * @return HasMany<Conferencia, Fornecedor>
     */
    public function conferencias(): HasMany
    {
        return $this->hasMany(Conferencia::class);
    }

    /**
     * Scope a query to only include active fornecedores.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeAtivo(Builder $query): Builder
    {
        return $query->where('status', true);
    }

    /**
     * Scope a query to search by name or CNPJ.
     *
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('razao_social', 'like', "%{$search}%")
              ->orWhere('cnpj', 'like', "%{$search}%");
        });
    }

    /**
     * Get formatted CNPJ.
     */
    public function getCnpjFormatadoAttribute(): string
    {
        if (empty($this->cnpj)) {
            return '';
        }

        $cnpj = preg_replace('/\D/', '', $this->cnpj);

        if (strlen($cnpj) === 14) {
            return substr($cnpj, 0, 2) . '.' .
                   substr($cnpj, 2, 3) . '.' .
                   substr($cnpj, 5, 3) . '/' .
                   substr($cnpj, 8, 4) . '-' .
                   substr($cnpj, 12, 2);
        }

        return $this->cnpj ?? '';
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return $this->status ? 'Ativo' : 'Inativo';
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        return $this->status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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

    /**
     * Get full address.
     */
    public function getEnderecoCompletoAttribute(): string
    {
        $parts = array_filter([
            $this->endereco,
            $this->cidade,
            $this->estado,
            $this->cep
        ]);

        return implode(', ', $parts);
    }

    /**
     * Check if fornecedor can be deleted.
     */
    public function podeExcluir(): bool
    {
        return $this->requisicoes()->count() === 0 &&
               $this->pedidosManuais()->count() === 0 &&
               $this->conferencias()->count() === 0;
    }

    /**
     * Get total value of requisições.
     */
    public function getTotalRequisicoes(): float
    {
        return $this->requisicoes()
                    ->where('status', 'concretizada')
                    ->sum('valor_final') ?? 0;
    }

    /**
     * Get total value of pedidos manuais.
     */
    public function getTotalPedidosManuais(): float
    {
        return $this->pedidosManuais()->sum('valor') ?? 0;
    }

    /**
     * Get total value (requisições + pedidos manuais).
     */
    public function getTotalGeral(): float
    {
        return $this->getTotalRequisicoes() + $this->getTotalPedidosManuais();
    }
}
