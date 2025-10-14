import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/core';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  MapPin,
  Users,
  Calendar,
  X
} from 'lucide-react';

interface PriceStat {
  itemDescription: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  priceVariation: number;
  proposalCount: number;
  totalQuantity: number;
}

interface PriceTrend {
  date: string;
  item_description: string;
  average_price: number;
  proposal_count: number;
}

interface TopSupplier {
  supplier_name: string;
  average_price: number;
  proposal_count: number;
  unique_items: number;
}

interface GeoDistribution {
  uf: string;
  average_price: number;
  proposal_count: number;
}

interface SummaryStats {
  totalItems: number;
  totalProposals: number;
  totalQuantity: number;
  averagePriceOverall: number;
}

interface FilterOptions {
  itemDescriptions: string[];
  priceRange: { min: number; max: number };
  dateRange: { earliest: string | null; latest: string | null };
}

interface Filters {
  start_date: string;
  end_date: string;
  item_description: string;
  min_price: string;
  max_price: string;
}

export default function AveragePriceReportPage() {
  const [filters, setFilters] = useState<Filters>({
    start_date: '',
    end_date: '',
    item_description: '',
    min_price: '',
    max_price: '',
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    itemDescriptions: [],
    priceRange: { min: 0, max: 0 },
    dateRange: { earliest: null, latest: null },
  });

  const [reportData, setReportData] = useState<{
    averagePriceStats: PriceStat[];
    priceTrends: PriceTrend[];
    topSuppliers: TopSupplier[];
    geographicalDistribution: GeoDistribution[];
    summary: SummaryStats;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch report data when filters change
  useEffect(() => {
    if (!loading) {
      fetchReportData();
    }
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/reports/average-price-research/filter-options', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFilterOptions(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/reports/average-price-research?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReportData(data.data);
        } else {
          setError('Erro ao carregar dados do relatório');
        }
      } else {
        setError('Erro ao carregar dados do relatório');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      item_description: '',
      min_price: '',
      max_price: '',
    });
  };

  const exportToCsv = () => {
    const queryParams = new URLSearchParams();
    queryParams.append('export', 'csv');
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = `/api/reports/average-price-research?${queryParams}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_precos_medios_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <AppLayout>
      <Head>
        <title>Relatório de Pesquisa de Preços Médios</title>
        <meta name="description" content="Relatório de pesquisa de preços médios com filtros e exportação" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Relatório de Pesquisa de Preços Médios
            </h1>
            <p className="text-gray-600 mt-2">
              Análise de preços médios por item com filtros avançados e exportação CSV
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button onClick={exportToCsv}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Filtros</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start_date">Data Inicial</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    min={filterOptions.dateRange.earliest || ''}
                    max={filterOptions.dateRange.latest || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Data Final</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    min={filterOptions.dateRange.earliest || ''}
                    max={filterOptions.dateRange.latest || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="item_description">Descrição do Item</Label>
                  <Input
                    id="item_description"
                    type="text"
                    value={filters.item_description}
                    onChange={(e) => handleFilterChange('item_description', e.target.value)}
                    placeholder="Buscar item..."
                    list="item-suggestions"
                  />
                  <datalist id="item-suggestions">
                    {filterOptions.itemDescriptions.slice(0, 50).map((item, index) => (
                      <option key={index} value={item} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="min_price">Preço Mínimo (R$)</Label>
                  <Input
                    id="min_price"
                    type="number"
                    step="0.01"
                    min={filterOptions.priceRange.min}
                    max={filterOptions.priceRange.max}
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    placeholder={formatCurrency(filterOptions.priceRange.min)}
                  />
                </div>
                <div>
                  <Label htmlFor="max_price">Preço Máximo (R$)</Label>
                  <Input
                    id="max_price"
                    type="number"
                    step="0.01"
                    min={filterOptions.priceRange.min}
                    max={filterOptions.priceRange.max}
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    placeholder={formatCurrency(filterOptions.priceRange.max)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Report Data */}
        {reportData && !loading && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalProposals}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quantidade Total</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalQuantity}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Preço Médio Geral</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(reportData.summary.averagePriceOverall)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Results Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Resultados da Pesquisa de Preços</CardTitle>
                <CardDescription>
                  Análise detalhada dos preços médios por item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left">Descrição do Item</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Preço Médio</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Preço Mínimo</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Preço Máximo</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Variação</th>
                        <th className="border border-gray-200 px-4 py-2 text-center">Propostas</th>
                        <th className="border border-gray-200 px-4 py-2 text-center">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.averagePriceStats.map((stat, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 px-4 py-2 font-medium">
                            {stat.itemDescription}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right">
                            {formatCurrency(stat.averagePrice)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right">
                            {formatCurrency(stat.minPrice)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right">
                            {formatCurrency(stat.maxPrice)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right">
                            <div className="flex items-center justify-end">
                              {stat.priceVariation > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                              )}
                              {stat.priceVariation.toFixed(1)}%
                            </div>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-center">
                            <Badge variant="secondary">{stat.proposalCount}</Badge>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-center">
                            {stat.totalQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportData.averagePriceStats.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum resultado encontrado para os filtros selecionados.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Suppliers */}
            {reportData.topSuppliers.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Principais Fornecedores</CardTitle>
                  <CardDescription>
                    Fornecedores com mais propostas no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportData.topSuppliers.map((supplier, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{supplier.supplier_name}</h4>
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Propostas:</span>
                            <Badge variant="outline">{supplier.proposal_count}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Itens Únicos:</span>
                            <span>{supplier.unique_items}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Preço Médio:</span>
                            <span className="font-medium">
                              {formatCurrency(supplier.average_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Geographical Distribution */}
            {reportData.geographicalDistribution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Geográfica</CardTitle>
                  <CardDescription>
                    Preços médios por estado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportData.geographicalDistribution.map((geo, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{geo.uf}</h4>
                          <MapPin className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Propostas:</span>
                            <Badge variant="outline">{geo.proposal_count}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Preço Médio:</span>
                            <span className="font-medium">
                              {formatCurrency(geo.average_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}