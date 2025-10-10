import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, DollarSign, Download, FileText, Filter, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { formatters, reportUtils } from '@/utils/relatorios/formatters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Relatórios',
        href: '/relatorios',
    },
    {
        title: 'Conferências',
        href: '/relatorios/conferencias',
    },
];

interface ConferenciaRelatorio {
    id: number;
    periodo: string;
    total_requisicoes: number;
    total_pedidos_manuais: number;
    total_geral: number;
    data_conferencia: string;
    observacoes?: string;
    fornecedor?: {
        id: number;
        razao_social: string;
        cnpj_formatado: string;
    };
    created_at: string;
}

interface ConferenciasStats {
    total_conferencias: number;
    valor_total_geral: number;
    valor_total_requisicoes: number;
    valor_total_pedidos_manuais: number;
    conferencias_por_fornecedor: Record<string, { count: number; valor_total: number }>;
    conferencias_por_mes: Record<string, { count: number; valor_total: number }>;
}

interface RelatorioConferenciasProps {
    conferencias: ConferenciaRelatorio[];
    stats: ConferenciasStats;
    filters: {
        data_inicio?: string;
        data_fim?: string;
        fornecedor_id?: string;
    };
    fornecedores: Pick<Fornecedor, 'id' | 'razao_social'>[];
}

// Component for Statistics Cards
const StatisticsCards = ({ stats }: { stats: ConferenciasStats }) => (
    <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Conferências</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total_conferencias}</div>
                <p className="text-xs text-muted-foreground">{stats.total_conferencias === 0 ? 'Nenhuma conferência' : 'conferências realizadas'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total Geral</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatters.currency(stats.valor_total_geral, 'R$ 0,00')}</div>
                <p className="text-xs text-muted-foreground">{stats.valor_total_geral === 0 ? 'Sem movimentação' : 'valor total conferido'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requisições</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatters.currency(stats.valor_total_requisicoes, 'R$ 0,00')}</div>
                <p className="text-xs text-muted-foreground">{stats.valor_total_requisicoes === 0 ? 'Sem requisições' : 'de requisições'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Manuais</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatters.currency(stats.valor_total_pedidos_manuais, 'R$ 0,00')}</div>
                <p className="text-xs text-muted-foreground">{stats.valor_total_pedidos_manuais === 0 ? 'Sem pedidos' : 'de pedidos manuais'}</p>
            </CardContent>
        </Card>
    </div>
);

// Component for Filters Card
const FiltersCard = ({
    data,
    setData,
    processing,
    fornecedores,
    onFilter,
    onReset,
}: {
    data: {
        data_inicio: string;
        data_fim: string;
        fornecedor_id: string;
    };
    setData: (field: string, value: string) => void;
    processing: boolean;
    fornecedores: Pick<Fornecedor, 'id' | 'razao_social'>[];
    onFilter: FormEventHandler;
    onReset: () => void;
}) => {
    const dataInicioId = useId();
    const dataFimId = useId();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtros
                </CardTitle>
                <CardDescription>Use os filtros para refinar o relatório de conferências</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onFilter} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor={dataInicioId}>Data Início</Label>
                            <Input id={dataInicioId} type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={dataFimId}>Data Fim</Label>
                            <Input id={dataFimId} type="date" value={data.data_fim} onChange={(e) => setData('data_fim', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fornecedor_id">Fornecedor</Label>
                            <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos os fornecedores</SelectItem>
                                    {fornecedores.map((fornecedor) => (
                                        <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                            {fornecedor.razao_social}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onReset} disabled={processing}>
                            Limpar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Search className="mr-2 h-4 w-4" />
                            Filtrar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

// Component for Conferencia Table Row
const ConferenciaTableRow = ({ conferencia }: { conferencia: ConferenciaRelatorio }) => (
    <TableRow>
        <TableCell className="font-medium">{conferencia.periodo}</TableCell>
        <TableCell>
            {conferencia.fornecedor ? (
                <div>
                    <div className="font-medium">{formatters.truncateText(conferencia.fornecedor.razao_social, 40)}</div>
                    <div className="text-xs text-muted-foreground">{conferencia.fornecedor.cnpj_formatado}</div>
                </div>
            ) : (
                <span className="text-gray-400 italic">Não informado</span>
            )}
        </TableCell>
        <TableCell className="text-right">
            <span className="font-medium text-blue-600">{formatters.currency(conferencia.total_requisicoes)}</span>
        </TableCell>
        <TableCell className="text-right">
            <span className="font-medium text-purple-600">{formatters.currency(conferencia.total_pedidos_manuais)}</span>
        </TableCell>
        <TableCell className="text-right">
            <span className="font-medium text-green-600">{formatters.currency(conferencia.total_geral)}</span>
        </TableCell>
        <TableCell>{conferencia.data_conferencia}</TableCell>
        <TableCell className="max-w-xs">
            {conferencia.observacoes ? (
                <span className="text-sm">{formatters.truncateText(conferencia.observacoes, 50)}</span>
            ) : (
                <span className="text-sm text-gray-400 italic">-</span>
            )}
        </TableCell>
    </TableRow>
);

// Component for Results Table
const ResultsTable = ({
    conferencias,
    stats,
    hasFilters,
}: {
    conferencias: ConferenciaRelatorio[];
    stats: ConferenciasStats;
    hasFilters: boolean;
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Conferências Encontradas</CardTitle>
            <CardDescription>
                {stats.total_conferencias} {stats.total_conferencias === 1 ? 'conferência encontrada' : 'conferências encontradas'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {conferencias.length === 0 ? (
                <div className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                        {reportUtils.getEmptyStateMessage('conferencias', hasFilters)}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        {hasFilters ? 'Tente ajustar os filtros para encontrar mais resultados.' : 'Comece criando uma nova conferência.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Período</TableHead>
                                <TableHead>Fornecedor</TableHead>
                                <TableHead className="text-right">Total Requisições</TableHead>
                                <TableHead className="text-right">Pedidos Manuais</TableHead>
                                <TableHead className="text-right">Total Geral</TableHead>
                                <TableHead>Data Conferência</TableHead>
                                <TableHead>Observações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {conferencias.map((conferencia) => (
                                <ConferenciaTableRow key={conferencia.id} conferencia={conferencia} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
    </Card>
);

// Component for Summary Cards
const SummaryCards = ({ stats }: { stats: ConferenciasStats }) => {
    const topFornecedores = reportUtils.getTopEntries(
        stats.conferencias_por_fornecedor,
        (value) => (value as { count: number; valor_total: number }).valor_total,
        5
    );

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Top 5 Fornecedores por Valor</CardTitle>
                    <CardDescription>Fornecedores com maior valor total em conferências</CardDescription>
                </CardHeader>
                <CardContent>
                    {topFornecedores.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">Nenhum dado disponível</p>
                    ) : (
                        <div className="space-y-3">
                            {topFornecedores.map(([nome, dados]) => {
                                const info = dados as { count: number; valor_total: number };
                                return (
                                    <div key={nome} className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium">{formatters.truncateText(nome, 30)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {info.count} {info.count === 1 ? 'conferência' : 'conferências'}
                                            </div>
                                        </div>
                                        <span className="text-sm text-green-600">{formatters.currency(info.valor_total)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Conferências por Mês</CardTitle>
                    <CardDescription>Distribuição mensal de conferências e valores</CardDescription>
                </CardHeader>
                <CardContent>
                    {Object.keys(stats.conferencias_por_mes).length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">Nenhum dado disponível</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(stats.conferencias_por_mes)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .slice(0, 5)
                                .map(([mes, dados]) => {
                                    const info = dados as { count: number; valor_total: number };
                                    return (
                                        <div key={mes} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium">{formatters.monthYear(mes)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {info.count} {info.count === 1 ? 'conferência' : 'conferências'}
                                                </div>
                                            </div>
                                            <span className="text-sm text-green-600">{formatters.currency(info.valor_total)}</span>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default function RelatorioConferencias({ conferencias, stats, filters, fornecedores = [] }: RelatorioConferenciasProps) {
    const { data, setData, get, processing } = useForm({
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
        fornecedor_id: filters?.fornecedor_id || '',
    });

    const hasActiveFilters = reportUtils.hasActiveFilters(data);

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        get('/relatorios/conferencias', {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            data_inicio: '',
            data_fim: '',
            fornecedor_id: '',
        });
        get('/relatorios/conferencias', {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (format: string) => {
        const params = new URLSearchParams();
        if (data.data_inicio) params.append('data_inicio', data.data_inicio);
        if (data.data_fim) params.append('data_fim', data.data_fim);
        if (data.fornecedor_id) params.append('fornecedor_id', data.fornecedor_id);
        params.append('formato', format);

        window.location.href = `/relatorios/conferencias/export?${params.toString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de Conferências" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/relatorios">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatório de Conferências</h1>
                            <p className="text-gray-600 dark:text-gray-400">Análise detalhada das conferências do sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => handleExport('excel')} disabled={conferencias.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('csv')} disabled={conferencias.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <StatisticsCards stats={stats} />

                {/* Filters */}
                <FiltersCard
                    data={data}
                    setData={setData}
                    processing={processing}
                    fornecedores={fornecedores}
                    onFilter={handleFilter}
                    onReset={handleReset}
                />

                {/* Results Table */}
                <ResultsTable conferencias={conferencias} stats={stats} hasFilters={hasActiveFilters} />

                {/* Summary Cards */}
                {conferencias.length > 0 && <SummaryCards stats={stats} />}
            </div>
        </AppLayout>
    );
}
