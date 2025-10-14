<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class PriceResearchEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_description',
        'supplier_name',
        'supplier_price',
        'quantity',
        'unit',
        'uf',
        'municipio',
        'proposal_date',
        'numero_processo',
        'orgao',
        'modalidade',
        'situacao',
        'purchase_request_id',
        'user_id',
        'source_data',
    ];

    protected $casts = [
        'supplier_price' => 'decimal:2',
        'quantity' => 'integer',
        'proposal_date' => 'date',
        'source_data' => 'array',
    ];

    protected $dates = ['proposal_date', 'created_at', 'updated_at'];

    /**
     * Get the purchase request that owns this research entry
     */
    public function purchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class);
    }

    /**
     * Get the user that created this research entry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeDateRange(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('created_at', '<=', $endDate . ' 23:59:59');
        }

        return $query;
    }

    /**
     * Scope to filter by item description
     */
    public function scopeItemDescription(Builder $query, ?string $itemDescription): Builder
    {
        if ($itemDescription) {
            $query->where('item_description', 'LIKE', '%' . $itemDescription . '%');
        }

        return $query;
    }

    /**
     * Scope to get active proposals only
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('situacao', 'Ativa');
    }

    /**
     * Scope to filter by price range
     */
    public function scopePriceRange(Builder $query, ?float $minPrice, ?float $maxPrice): Builder
    {
        if ($minPrice) {
            $query->where('supplier_price', '>=', $minPrice);
        }

        if ($maxPrice) {
            $query->where('supplier_price', '<=', $maxPrice);
        }

        return $query;
    }

    /**
     * Get average price statistics for item descriptions
     */
    public static function getAveragePriceStats(array $filters = []): array
    {
        $query = self::active()
            ->selectRaw('
                item_description,
                AVG(supplier_price) as average_price,
                MIN(supplier_price) as min_price,
                MAX(supplier_price) as max_price,
                COUNT(*) as proposal_count,
                SUM(quantity) as total_quantity
            ')
            ->groupBy('item_description');

        // Apply filters
        if (isset($filters['start_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date'] ?? null);
        }

        if (isset($filters['item_description'])) {
            $query->itemDescription($filters['item_description']);
        }

        if (isset($filters['min_price'])) {
            $query->priceRange($filters['min_price'], $filters['max_price'] ?? null);
        }

        $results = $query->orderBy('average_price', 'desc')->get();

        // Format the results
        return $results->map(function ($result) {
            return [
                'itemDescription' => $result->item_description,
                'averagePrice' => (float) $result->average_price,
                'minPrice' => (float) $result->min_price,
                'maxPrice' => (float) $result->max_price,
                'proposalCount' => (int) $result->proposal_count,
                'totalQuantity' => (int) $result->total_quantity,
                'priceVariation' => $result->max_price > 0
                    ? (($result->max_price - $result->min_price) / $result->min_price) * 100
                    : 0,
            ];
        })->toArray();
    }

    /**
     * Get price trends over time
     */
    public static function getPriceTrends(array $filters = []): array
    {
        $query = self::active()
            ->selectRaw('
                DATE(created_at) as date,
                item_description,
                AVG(supplier_price) as average_price,
                COUNT(*) as proposal_count
            ')
            ->groupBy('date', 'item_description');

        // Apply filters
        if (isset($filters['start_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date'] ?? null);
        }

        if (isset($filters['item_description'])) {
            $query->itemDescription($filters['item_description']);
        }

        return $query->orderBy('date', 'asc')->get()->toArray();
    }

    /**
     * Get top suppliers by proposal count
     */
    public static function getTopSuppliers(array $filters = []): array
    {
        $query = self::active()
            ->selectRaw('
                supplier_name,
                AVG(supplier_price) as average_price,
                COUNT(*) as proposal_count,
                COUNT(DISTINCT item_description) as unique_items
            ')
            ->groupBy('supplier_name');

        // Apply filters
        if (isset($filters['start_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date'] ?? null);
        }

        return $query->orderBy('proposal_count', 'desc')->limit(20)->get()->toArray();
    }

    /**
     * Get geographical price distribution
     */
    public static function getGeographicalDistribution(array $filters = []): array
    {
        $query = self::active()
            ->selectRaw('
                uf,
                AVG(supplier_price) as average_price,
                COUNT(*) as proposal_count
            ')
            ->groupBy('uf');

        // Apply filters
        if (isset($filters['start_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date'] ?? null);
        }

        return $query->orderBy('average_price', 'asc')->get()->toArray();
    }

    /**
     * Get formatted supplier price
     */
    public function getFormattedSupplierPriceAttribute(): string
    {
        return 'R$ ' . number_format($this->supplier_price, 2, ',', '.');
    }

    /**
     * Get formatted proposal date
     */
    public function getFormattedProposalDateAttribute(): string
    {
        return $this->proposal_date ? $this->proposal_date->format('d/m/Y') : 'N/A';
    }
}