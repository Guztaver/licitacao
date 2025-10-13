<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Localizacao extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'descricao',
        'almoxarifado',
        'rua',
        'prateleira',
        'gaveta',
        'tipo',
        'capacidade_maxima',
        'ativa',
        'observacoes',
    ];

    protected $casts = [
        'capacidade_maxima' => 'decimal:3',
        'ativa' => 'boolean',
    ];

    // Tipo constants
    const TIPO_ARMAZENAMENTO = 'armazenamento';
    const TIPO_EXPEDICAO = 'expedicao';
    const TIPO_RECEBIMENTO = 'recebimento';
    const TIPO_QUARENTENA = 'quarentena';
    const TIPO_DEVOLUCAO = 'devolucao';

    /**
     * Get the estoques for the localizacao.
     */
    public function estoques(): HasMany
    {
        return $this->hasMany(Estoque::class);
    }

    /**
     * Get the movimentacoes_origem for the localizacao.
     */
    public function movimentacoesOrigem(): HasMany
    {
        return $this->hasMany(MovimentacaoEstoque::class, 'localizacao_origem_id');
    }

    /**
     * Get the movimentacoes_destino for the localizacao.
     */
    public function movimentacoesDestino(): HasMany
    {
        return $this->hasMany(MovimentacaoEstoque::class, 'localizacao_destino_id');
    }

    /**
     * Get full location code.
     */
    public function getCodigoCompletoAttribute(): string
    {
        $codigo = $this->codigo;

        if ($this->almoxarifado) {
            $codigo .= ' - ' . $this->almoxarifado;
        }

        if ($this->rua) {
            $codigo .= ' | Rua: ' . $this->rua;
        }

        if ($this->prateleira) {
            $codigo .= ' | Prateleira: ' . $this->prateleira;
        }

        if ($this->gaveta) {
            $codigo .= ' | Gaveta: ' . $this->gaveta;
        }

        return $codigo;
    }

    /**
     * Get type display name.
     */
    public function getTipoDisplayAttribute(): string
    {
        $tipos = [
            self::TIPO_ARMAZENAMENTO => 'Armazenamento',
            self::TIPO_EXPEDICAO => 'Expedição',
            self::TIPO_RECEBIMENTO => 'Recebimento',
            self::TIPO_QUARENTENA => 'Quarentena',
            self::TIPO_DEVOLUCAO => 'Devolução',
        ];

        return $tipos[$this->tipo] ?? $this->tipo;
    }

    /**
     * Get total items in location.
     */
    public function getTotalItensAttribute(): int
    {
        return $this->estoques()->count();
    }

    /**
     * Get total value in location.
     */
    public function getValorTotalAttribute(): float
    {
        return (float) $this->estoques()->sum('valor_total_estoque');
    }

    /**
     * Get low stock items count.
     */
    public function getItensEstoqueBaixoAttribute(): int
    {
        return $this->estoques()->estoqueBaixo()->count();
    }

    /**
     * Get zero stock items count.
     */
    public function getItensEstoqueZeradoAttribute(): int
    {
        return $this->estoques()->estoqueZerado()->count();
    }

    /**
     * Get expired items count.
     */
    public function getItensVencidosAttribute(): int
    {
        return $this->estoques()->vencido()->count();
    }

    /**
     * Check if location has capacity for more items.
     */
    public function temCapacidadeDisponivel(float $volumeNecessario): bool
    {
        if (!$this->capacidade_maxima) {
            return true; // No limit defined
        }

        $volumeUsado = $this->estoques()->sum('quantidade_atual'); // Simplified calculation
        $volumeDisponivel = $this->capacidade_maxima - $volumeUsado;

        return $volumeDisponivel >= $volumeNecessario;
    }

    /**
     * Get utilization percentage.
     */
    public function getPercentualUtilizacaoAttribute(): float
    {
        if (!$this->capacidade_maxima) {
            return 0;
        }

        $volumeUsado = $this->estoques()->sum('quantidade_atual'); // Simplified calculation

        return ($volumeUsado / $this->capacidade_maxima) * 100;
    }

    /**
     * Scope for active locations.
     */
    public function scopeAtiva($query)
    {
        return $query->where('ativa', true);
    }

    /**
     * Scope for storage locations.
     */
    public function scopeArmazenamento($query)
    {
        return $query->where('tipo', self::TIPO_ARMAZENAMENTO);
    }

    /**
     * Scope by warehouse.
     */
    public function scopeAlmoxarifado($query, $almoxarifado)
    {
        return $query->where('almoxarifado', $almoxarifado);
    }

    /**
     * Get full description.
     */
    public function getDescricaoCompletaAttribute(): string
    {
        return $this->descricao ?: $this->getCodigoCompletoAttribute();
    }

    /**
     * Generate unique code based on components.
     */
    public static function gerarCodigo(string $almoxarifado, string $rua, string $prateleira, ?string $gaveta = null): string
    {
        $codigo = strtoupper(substr($almoxarifado, 0, 2)) .
                  str_pad($rua, 2, '0', STR_PAD_LEFT) .
                  str_pad($prateleira, 2, '0', STR_PAD_LEFT);

        if ($gaveta) {
            $codigo .= str_pad($gaveta, 2, '0', STR_PAD_LEFT);
        }

        return $codigo;
    }
}
