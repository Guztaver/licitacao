import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building, DollarSign, Download, Filter, Search, TrendingUp, Users } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId } from 'react';
import { Badge } from '@/components/ui/badge';
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
        title: 'Fornecedores',
        href: '/relatorios/fornecedores',
    },
];

interface FornecedorRelatorio
    extends Pick<Fornecedor, 'id' | 'razao_social' | 'cnpj_formatado' | 'telefone_formatado' | 'email' | 'status' | 'status_display' | 'created_at'> {
    total_requisicoes: number;
    valor_total: number;
}

interface FornecedoresStats {
    total_fornecedores: number;
    fornecedores_ativos: number;
    fornecedores_inativos: number;
    valor_total_geral: number;
    total_requisicoes: number;
    fornecedores_com_movimento: number;
}

interface RelatorioFornecedoresProps {
    fornecedores: FornecedorRelatorio[];
    stats: FornecedoresStats;
    filters: {
        data_inicio?: string;
        data_fim?: string;
        status?: string;
    };
}

// Component for Statistics Cards
const StatisticsCards = ({ stats }: { stats: FornecedoresStats }) => (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fornecedores</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatters.number(stats.total_fornecedores, 'Nenhum fornecedor')}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.total_fornecedores === 0 ? 'Nenhum fornecedor cadastrado' : 'fornecedores cadastrados'}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatters.number(stats.fornecedores_ativos, 'Nenhum ativo')}</div>
                <p className="text-xs text-muted-foreground">{stats.fornecedores_ativos === 0 ? 'Nenhum fornecedor ativo' : 'fornecedores ativos'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inativos</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatters.number(stats.fornecedores_inativos, 'Nenhum inativo')}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.fornecedores_inativos === 0 ? 'Nenhum fornecedor inativo' : 'fornecedores inativos'}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Movimento</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-800" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-800">{formatters.number(stats.fornecedores_com_movimento, 'Nenhum com movimento')}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.fornecedores_com_movimento === 0 ? 'Nenhum fornecedor com requisições' : 'com requisições'}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requisições</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatters.number(stats.total_requisicoes, 'Nenhuma requisição')}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.total_requisicoes === 0 ? 'Nenhuma requisição atendida' : 'requisições atendidas'}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{formatters.currency(stats.valor_total_geral, 'Sem movimento financeiro')}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.valor_total_geral === 0 ? 'Nenhum valor foi movimentado' : 'valor movimentado'}
                </p>
            </CardContent>
        </Card>
    </div>
);

// Component for Filters Card
const FiltersCard = ({
    data,
    setData,
    processing,
    onFilter,
    onReset,
}: {
    data: {
        data_inicio: string;
        data_fim: string;
        status: string;
    };
    setData: (field: string, value: string) => void;
    processing: boolean;
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
                <CardDescription>Use os filtros para refinar o relatório por período e status</CardDescription>
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
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos os status</SelectItem>
                                    <SelectItem value="1">Ativo</SelectItem>
                                    <SelectItem value="0">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onReset}>
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

// Component for Status Badge
const FornecedorStatusBadge = ({ status, statusDisplay }: { status: boolean; statusDisplay: string }) => (
    <Badge variant={status ? 'default' : 'secondary'} className={status ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
        {statusDisplay}
    </Badge>
);

// Component for Fornecedor Table Row
const FornecedorTableRow = ({ fornecedor }: { fornecedor: FornecedorRelatorio }) => (
    <TableRow key={fornecedor.id}>
        <TableCell>
            <div className="font-medium">{fornecedor.razao_social}</div>
        </TableCell>
        <TableCell className="font-mono text-sm">{formatters.cnpj(fornecedor.cnpj_formatado || '')}</TableCell>
        <TableCell>
            <div className="text-sm">
                {fornecedor.telefone_formatado || fornecedor.email ? (
                    <>
                        {fornecedor.telefone_formatado && <div>{fornecedor.telefone_formatado}</div>}
                        {fornecedor.email && <div className="text-gray-500">{fornecedor.email}</div>}
                    </>
                ) : (
                    <span className="text-gray-400 italic">Contato não informado</span>
                )}
            </div>
        </TableCell>
        <TableCell>
            <FornecedorStatusBadge status={fornecedor.status} statusDisplay={fornecedor.status_display || ''} />
        </TableCell>
        <TableCell className="text-center">
            {fornecedor.total_requisicoes > 0 ? (
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {formatters.number(fornecedor.total_requisicoes)}
                </span>
            ) : (
                <span className="text-sm text-gray-400 italic">Sem requisições</span>
            )}
        </TableCell>
        <TableCell className="text-right">
            {fornecedor.valor_total > 0 ? (
                <span className="font-medium text-green-600">{formatters.currency(fornecedor.valor_total)}</span>
            ) : (
                <span className="text-sm text-gray-400 italic">Sem movimento</span>
            )}
        </TableCell>
        <TableCell className="text-sm text-gray-500">{formatters.date(fornecedor.created_at, 'Data não informada')}</TableCell>
    </TableRow>
);

// Component for Results Table
const ResultsTable = ({
    fornecedores,
    stats,
    hasFilters,
}: {
    fornecedores: FornecedorRelatorio[];
    stats: FornecedoresStats;
    hasFilters: boolean;
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Fornecedores Encontrados</CardTitle>
            <CardDescription>
                {formatters.number(stats.total_fornecedores, 'Nenhum fornecedor')} encontrados (ordenados por valor total)
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Razão Social</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Requisições</TableHead>
                            <TableHead className="text-right">Valor Total</TableHead>
                            <TableHead>Cadastro</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fornecedores.length > 0 ? (
                            fornecedores.map((fornecedor) => <FornecedorTableRow key={fornecedor.id} fornecedor={fornecedor} />)
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-8 text-center">
                                    <Building className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-gray-500">{reportUtils.getEmptyStateMessage('fornecedores', hasFilters)}</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

// Component for Top Performers Cards
const TopPerformersCards = ({ fornecedores }: { fornecedores: FornecedorRelatorio[] }) => {
    if (fornecedores.length === 0) return null;

    const topByValue = fornecedores.filter((f) => f.valor_total > 0).slice(0, 5);

    const topByRequests = fornecedores
        .sort((a, b) => b.total_requisicoes - a.total_requisicoes)
        .filter((f) => f.total_requisicoes > 0)
        .slice(0, 5);

    if (topByValue.length === 0 && topByRequests.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center">
                    <Building className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-gray-500">Nenhum fornecedor possui movimentação no período selecionado</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {topByValue.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 - Maior Valor</CardTitle>
                        <CardDescription>Fornecedores com maior valor total em requisições</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topByValue.map((fornecedor, index) => (
                                <div key={fornecedor.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{formatters.truncateText(fornecedor.razao_social, 30)}</div>
                                            <div className="text-xs text-gray-500">{formatters.number(fornecedor.total_requisicoes)} requisições</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-green-600">{formatters.currency(fornecedor.valor_total)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {topByRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 - Mais Requisições</CardTitle>
                        <CardDescription>Fornecedores com maior número de requisições</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topByRequests.map((fornecedor, index) => (
                                <div key={fornecedor.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-600">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{formatters.truncateText(fornecedor.razao_social, 30)}</div>
                                            <div className="text-xs text-gray-500">{formatters.currency(fornecedor.valor_total, 'Sem valor')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-purple-600">{formatters.number(fornecedor.total_requisicoes)} req.</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default function RelatorioFornecedores({ fornecedores, stats, filters }: RelatorioFornecedoresProps) {
    const { data, setData, get, processing } = useForm({
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
        status: filters?.status || '',
    });

    const hasActiveFilters = reportUtils.hasActiveFilters(data);

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        get('/relatorios/fornecedores', {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            data_inicio: '',
            data_fim: '',
            status: '',
        });
        get('/relatorios/fornecedores', {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (format: string) => {
        const exportUrl = reportUtils.buildExportUrl('/relatorios/fornecedores/export', data as Record<string, string>, format);
        window.location.href = exportUrl;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de Fornecedores" />

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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatório de Fornecedores</h1>
                            <p className="text-gray-600 dark:text-gray-400">Análise detalhada dos fornecedores e seu desempenho no sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => handleExport('pdf')}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('excel')}>
                            <Download className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('csv')}>
                            <Download className="mr-2 h-4 w-4" />
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <StatisticsCards stats={stats} />

                {/* Filters */}
                <FiltersCard data={data} setData={setData} processing={processing} onFilter={handleFilter} onReset={handleReset} />

                {/* Results Table */}
                <ResultsTable fornecedores={fornecedores} stats={stats} hasFilters={hasActiveFilters} />

                {/* Top Performers */}
                <TopPerformersCards fornecedores={fornecedores} />
            </div>
        </AppLayout>
    );
}
