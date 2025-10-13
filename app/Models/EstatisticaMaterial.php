<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstatisticaMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'categoria_material_id',
        'ano',
        'mes',
        'total_contratos',
        'total_pedidos',
        'total_requisicoes',
        'valor_total_contratos',
        'valor_total_pedidos',
        'valor_total_requisicoes',
        'valor_medio_ponderado',
        'quantidade_total',
        'fornecedores_distintos',
        'variacao_preco_percentual',
    ];

    protected $casts = [
        'valor_total_contratos' => 'decimal:2',
        'valor_total_pedidos' => 'decimal:2',
        'valor_total_requisicoes' => 'decimal:2',
        'valor_medio_ponderado' => 'decimal:2',
        'variacao_preco_percentual' => 'decimal:2',
    ];

    /**
     * Get the item.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the category.
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaMaterial::class, 'categoria_material_id');
    }

    /**
     * Get total value (sum of all types).
     */
    public function getValorTotalAttribute(): float
    {
        return (float) $this->valor_total_contratos +
               (float) $this->valor_total_pedidos +
               (float) $this->valor_total_requisicoes;
    }

    /**
     * Get total operations count.
     */
    public function getTotalOperacoesAttribute(): int
    {
        return $this->total_contratos + $this->total_pedidos + $this->total_requisicoes;
    }

    /**
     * Get period display.
     */
    public function getPeriodoDisplayAttribute(): string
    {
        return sprintf('%02d/%d', $this->mes, $this->ano);
    }

    /**
     * Get variation display with color indication.
     */
    public function getVariacaoDisplayAttribute(): array
    {
        $variacao = (float) $this->variacao_preco_percentual;
        $cor = $variacao > 0 ? 'text-green-600' : ($variacao < 0 ? 'text-red-600' : 'text-gray-600');
        $icone = $variacao > 0 ? '↗' : ($variacao < 0 ? '↘' : '→');
        $texto = $variacao != 0 ? abs($variacao) . '%' : '0%';

        return [
            'valor' => $variacao,
            'cor' => $cor,
            'icone' => $icone,
            'texto' => $texto,
        ];
    }

    /**
     * Calculate or update statistics for an item in a specific period.
     */
    public static function atualizarEstatisticas(int $itemId, int $ano, int $mes): self
    {
        $item = Item::findOrFail($itemId);

        // Get statistics from contracts
        $statsContratos = $item->contratoItems()
            ->whereHas('contrato', function ($query) use ($ano, $mes) {
                $query->whereYear('data_inicio', '<=', $ano)
                      ->whereYear('data_fim', '>=', $ano)
                      ->whereMonth('data_inicio', '<=', $mes)
                      ->whereMonth('data_fim', '>=', $mes);
            })
            ->selectRaw('
                COUNT(*) as total_operacoes,
                SUM(quantidade) as quantidade_total,
                SUM(valor_total) as valor_total,
                COUNT(DISTINCT contrato_id) as fornecedores_distintos
            ')
            ->first();

        // Get statistics from purchase orders (if table exists)
        $statsPedidos = [];
        if (class_exists('App\\Models\\PedidoCompraItem')) {
            $statsPedidos = $item->pedidoCompraItems()
                ->whereHas('pedidoCompra', function ($query) use ($ano, $mes) {
                    $query->whereYear('created_at', $ano)
                          ->whereMonth('created_at', $mes);
                })
                ->selectRaw('
                    COUNT(*) as total_operacoes,
                    SUM(quantidade) as quantidade_total,
                    SUM(valor_total) as valor_total
                ')
                ->first();
        }

        // Get statistics from requisitions (if table exists)
        $statsRequisicoes = [];
        if (class_exists('App\\Models\\RequisicaoItem')) {
            $statsRequisicoes = $item->requisicaoItems()
                ->whereHas('requisicao', function ($query) use ($ano, $mes) {
                    $query->whereYear('created_at', $ano)
                          ->whereMonth('created_at', $mes);
                })
                ->selectRaw('
                    COUNT(*) as total_operacoes,
                    SUM(quantidade) as quantidade_total,
                    SUM(valor_total) as valor_total
                ')
                ->first();
        }

        // Calculate weighted average price
        $quantidadeTotal = ($statsContratos->quantidade_total ?? 0) +
                           ($statsPedidos->quantidade_total ?? 0) +
                           ($statsRequisicoes->quantidade_total ?? 0);

        $valorTotal = ($statsContratos->valor_total ?? 0) +
                     ($statsPedidos->valor_total ?? 0) +
                     ($statsRequisicoes->valor_total ?? 0);

        $valorMedioPonderado = $quantidadeTotal > 0 ? $valorTotal / $quantidadeTotal : 0;

        // Calculate price variation vs previous month
        $dataAnterior = now()->create($ano, $mes, 1)->subMonth();
        $estatisticaAnterior = self::where('item_id', $itemId)
            ->where('ano', $dataAnterior->year)
            ->where('mes', $dataAnterior->month)
            ->first();

        $variacaoPercentual = 0;
        if ($estatisticaAnterior && $estatisticaAnterior->valor_medio_ponderado > 0) {
            $variacaoPercentual = (($valorMedioPonderado - $estatisticaAnterior->valor_medio_ponderado) /
                                 $estatisticaAnterior->valor_medio_ponderado) * 100;
        }

        // Find or create statistic record
        $estatistica = self::updateOrCreate(
            ['item_id' => $itemId, 'ano' => $ano, 'mes' => $mes],
            [
                'categoria_material_id' => $item->categoria_material_id ?? null,
                'total_contratos' => $statsContratos->total_operacoes ?? 0,
                'total_pedidos' => $statsPedidos->total_operacoes ?? 0,
                'total_requisicoes' => $statsRequisicoes->total_operacoes ?? 0,
                'valor_total_contratos' => $statsContratos->valor_total ?? 0,
                'valor_total_pedidos' => $statsPedidos->valor_total ?? 0,
                'valor_total_requisicoes' => $statsRequisicoes->valor_total ?? 0,
                'valor_medio_ponderado' => $valorMedioPonderado,
                'quantidade_total' => $quantidadeTotal,
                'fornecedores_distintos' => $statsContratos->fornecedores_distintos ?? 0,
                'variacao_preco_percentual' => $variacaoPercentual,
            ]
        );

        return $estatistica;
    }

    /**
     * Get top items by value in a period.
     */
    public static function getTopItensPorValor(int $ano, int $mes, int $limit = 10): \Illuminate\Support\Collection
    {
        return self::with(['item', 'categoria'])
            ->where('ano', $ano)
            ->where('mes', $mes)
            ->orderBy('valor_total', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get top items by quantity in a period.
     */
    public static function getTopItensPorQuantidade(int $ano, int $mes, int $limit = 10): \Illuminate\Support\Collection
    {
        return self::with(['item', 'categoria'])
            ->where('ano', $ano)
            ->where('mes', $mes)
            ->orderBy('quantidade_total', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get items with highest price variation.
     */
    public static function getTopVariacoesPreco(int $ano, int $mes, int $limit = 10): \Illuminate\Support\Collection
    {
        return self::with(['item', 'categoria'])
            ->where('ano', $ano)
            ->where('mes', $mes)
            ->whereNotNull('variacao_preco_percentual')
            ->orderByRaw('ABS(variacao_preco_percentual) DESC')
            ->limit($limit)
            ->get();
    }

    /**
     * Get monthly trend for an item.
     */
    public static function getTendenciaMensal(int $itemId, int $meses = 12): \Illuminate\Support\Collection
    {
        $dataInicio = now()->subMonths($meses - 1)->startOfMonth();

        return self::where('item_id', $itemId)
            ->where(function ($query) use ($dataInicio) {
                $query->where('ano', '>', $dataInicio->year)
                      ->orWhere(function ($q) use ($dataInicio) {
                          $q->where('ano', $dataInicio->year)
                            ->where('mes', '>=', $dataInicio->month);
                      });
            })
            ->orderBy('ano')
            ->orderBy('mes')
            ->get();
    }

    /**
     * Get category summary for a period.
     */
    public static function getResumoPorCategoria(int $ano, int $mes): \Illuminate\Support\Collection
    {
        return self::with('categoria')
            ->where('ano', $ano)
            ->where('mes', $mes)
            ->whereNotNull('categoria_material_id')
            ->selectRaw('
                categoria_material_id,
                COUNT(*) as total_itens,
                SUM(valor_total) as valor_total,
                SUM(quantidade_total) as quantidade_total,
                SUM(total_contratos) as total_contratos,
                SUM(total_pedidos) as total_pedidos,
                SUM(total_requisicoes) as total_requisicoes,
                AVG(valor_medio_ponderado) as preco_medio_geral,
                COUNT(DISTINCT item_id) as itens_distintos
            ')
            ->groupBy('categoria_material_id')
            ->get();
    }
}
