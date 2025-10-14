<?php

namespace App\Http\Controllers;

use App\Models\PriceResearchEntry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AveragePriceReportController extends Controller
{
    /**
     * Generate average price research report
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Only authenticated users can access the report
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Não autorizado',
            ], 401);
        }

        // Validate request parameters
        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'item_description' => 'nullable|string|max:255',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'export' => 'nullable|in:csv'
        ]);

        // Build filters array
        $filters = [
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'item_description' => $validated['item_description'] ?? null,
            'min_price' => $validated['min_price'] ? floatval($validated['min_price']) : null,
            'max_price' => $validated['max_price'] ? floatval($validated['max_price']) : null,
        ];

        // Get aggregation data
        $averagePriceStats = PriceResearchEntry::getAveragePriceStats($filters);
        $priceTrends = PriceResearchEntry::getPriceTrends($filters);
        $topSuppliers = PriceResearchEntry::getTopSuppliers($filters);
        $geographicalDistribution = PriceResearchEntry::getGeographicalDistribution($filters);

        // Handle CSV export
        if ($request->get('export') === 'csv') {
            return $this->exportCsv($averagePriceStats);
        }

        // Get summary statistics
        $totalItems = count($averagePriceStats);
        $totalProposals = array_sum(array_column($averagePriceStats, 'proposalCount'));
        $totalQuantity = array_sum(array_column($averagePriceStats, 'totalQuantity'));
        $averagePriceOverall = $totalItems > 0
            ? array_sum(array_column($averagePriceStats, 'averagePrice')) / $totalItems
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'averagePriceStats' => $averagePriceStats,
                'priceTrends' => $priceTrends,
                'topSuppliers' => $topSuppliers,
                'geographicalDistribution' => $geographicalDistribution,
                'summary' => [
                    'totalItems' => $totalItems,
                    'totalProposals' => $totalProposals,
                    'totalQuantity' => $totalQuantity,
                    'averagePriceOverall' => round($averagePriceOverall, 2),
                ],
                'filters' => $filters,
            ],
        ]);
    }

    /**
     * Export average price statistics to CSV
     */
    private function exportCsv(array $stats): JsonResponse
    {
        $filename = 'average_price_research_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($stats) {
            $file = fopen('php://output', 'w');

            // Add BOM to ensure proper UTF-8 encoding
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV headers in Portuguese
            fputcsv($file, [
                'Descrição do Item',
                'Preço Médio (R$)',
                'Preço Mínimo (R$)',
                'Preço Máximo (R$)',
                'Variação (%)',
                'Quantidade de Propostas',
                'Quantidade Total',
                'Valor Total Estimado (R$)'
            ]);

            // CSV data
            foreach ($stats as $item) {
                $estimatedTotalValue = $item['averagePrice'] * $item['totalQuantity'];

                fputcsv($file, [
                    $item['itemDescription'],
                    number_format($item['averagePrice'], 2, ',', '.'),
                    number_format($item['minPrice'], 2, ',', '.'),
                    number_format($item['maxPrice'], 2, ',', '.'),
                    number_format($item['priceVariation'], 2, ',', '.') . '%',
                    $item['proposalCount'],
                    $item['totalQuantity'],
                    number_format($estimatedTotalValue, 2, ',', '.'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get available filter options
     */
    public function filterOptions(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Não autorizado',
            ], 401);
        }

        // Get unique item descriptions for autocomplete
        $itemDescriptions = PriceResearchEntry::active()
            ->select('item_description')
            ->distinct()
            ->where('item_description', '!=', '')
            ->orderBy('item_description')
            ->pluck('item_description')
            ->take(100) // Limit to prevent large responses
            ->toArray();

        // Get price range
        $priceRange = PriceResearchEntry::active()
            ->selectRaw('MIN(supplier_price) as min_price, MAX(supplier_price) as max_price')
            ->first();

        // Get date range
        $dateRange = PriceResearchEntry::active()
            ->selectRaw('MIN(created_at) as earliest_date, MAX(created_at) as latest_date')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'itemDescriptions' => $itemDescriptions,
                'priceRange' => [
                    'min' => $priceRange->min_price ? floatval($priceRange->min_price) : 0,
                    'max' => $priceRange->max_price ? floatval($priceRange->max_price) : 0,
                ],
                'dateRange' => [
                    'earliest' => $dateRange->earliest_date ? $dateRange->earliest_date->format('Y-m-d') : null,
                    'latest' => $dateRange->latest_date ? $dateRange->latest_date->format('Y-m-d') : null,
                ],
            ],
        ]);
    }
}