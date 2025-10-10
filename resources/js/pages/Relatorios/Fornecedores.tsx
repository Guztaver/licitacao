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
                <div className="text-2xl font-bold">{stats.total_fornecedores}</div>
                <p className="text-xs text-muted-foreground">{stats.total_fornecedores === 0 ? 'Nenhum cadastrado' : 'fornecedores cadastrados'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.fornecedores_ativos}</div>
                <p className="text-xs text-muted-foreground">{stats.fornecedores_ativos === 0 ? 'Nenhum ativo' : 'fornecedores ativos'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inativos</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.fornecedores_inativos}</div>
                <p className="text-xs text-muted-foreground">{stats.fornecedores_inativos === 0 ? 'Nenhum inativo' : 'fornecedores inativos'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Movimento</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.fornecedores_com_movimento}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.fornecedores_com_movimento === 0 ? 'Nenhum com movimento' : 'com requisições no período'}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requisições</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total_requisicoes}</div>
                <p className="text-xs text-muted-foreground">{stats.total_requisicoes === 0 ? 'Nenhuma requisição' : 'requisições concretizadas'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatters.currency(stats.valor_total_geral, 'R$ 0,00')}</div>
                <p className="text-xs text-muted-foreground">{stats.valor_total_geral === 0 ? 'Sem movimentação' : 'em requisições'}</p>
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
                <CardDescription>Use os filtros para refinar o relatório de fornecedores</CardDescription>
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
                                    <SelectItem value="1">Ativos</SelectItem>
                                    <SelectItem value="0">Inativos</SelectItem>
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

// Component for Status Badge
const FornecedorStatusBadge = ({ status, statusDisplay }: { status: boolean; statusDisplay: string }) => (
    <Badge variant={status ? 'default' : 'secondary'} className={status ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
        {statusDisplay}
    </Badge>
);

// Component for Fornecedor Table Row
const FornecedorTableRow = ({ fornecedor }: { fornecedor: FornecedorRelatorio }) => (
    <TableRow>
        <TableCell>
            <div className="font-medium">{fornecedor.razao_social}</div>
        </TableCell>
        <TableCell className="font-mono text-sm">{fornecedor.cnpj_formatado || '-'}</TableCell>
        <TableCell>
            <div className="text-sm">
                {fornecedor.telefone_formatado || fornecedor.email ? (
                    <>
                        {fornecedor.telefone_formatado && <div>{fornecedor.telefone_formatado}</div>}
                        {fornecedor.email && <div className="text-muted-foreground">{fornecedor.email}</div>}
                    </>
                ) : (
                    <span className="text-gray-400 italic">Não informado</span>
                )}
            </div>
        </TableCell>
        <TableCell>
            <FornecedorStatusBadge status={fornecedor.status} statusDisplay={fornecedor.status_display || ''} />
        </TableCell>
        <TableCell className="text-center">
            {fornecedor.total_requisicoes > 0 ? (
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {fornecedor.total_requisicoes}
                </span>
            ) : (
                <span className="text-sm text-gray-400 italic">0</span>
            )}
        </TableCell>
        <TableCell className="text-right">
            {fornecedor.valor_total > 0 ? (
                <span className="font-medium text-green-600">{formatters.currency(fornecedor.valor_total)}</span>
            ) : (
                <span className="text-sm text-gray-400 italic">R$ 0,00</span>
            )}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{fornecedor.created_at}</TableCell>
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
                {stats.total_fornecedores} {stats.total_fornecedores === 1 ? 'fornecedor encontrado' : 'fornecedores encontrados'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {fornecedores.length === 0 ? (
                <div className="py-12 text-center">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                        {reportUtils.getEmptyStateMessage('fornecedores', hasFilters)}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        {hasFilters ? 'Tente ajustar os filtros para encontrar mais resultados.' : 'Comece cadastrando um novo fornecedor.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Razão Social</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Requisições</TableHead>
                                <TableHead className="text-right">Valor Total</TableHead>
                                <TableHead>Data Cadastro</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fornecedores.map((fornecedor) => (
                                <FornecedorTableRow key={fornecedor.id} fornecedor={fornecedor} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
    </Card>
);

// Component for Top Performers Cards
const TopPerformersCards = ({ fornecedores }: { fornecedores: FornecedorRelatorio[] }) => {
    const topByValue = fornecedores.filter((f) => f.valor_total > 0).slice(0, 5);
    const topByRequests = [...fornecedores]
        .sort((a, b) => b.total_requisicoes - a.total_requisicoes)
        .filter((f) => f.total_requisicoes > 0)
        .slice(0, 5);

    if (topByValue.length === 0 && topByRequests.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {topByValue.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top 5 - Maior Valor</CardTitle>
                        <CardDescription>Fornecedores com maior valor total em requisições</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topByValue.map((fornecedor, index) => (
                                <div key={fornecedor.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{formatters.truncateText(fornecedor.razao_social, 30)}</div>
                                            <div className="text-xs text-muted-foreground">{fornecedor.total_requisicoes} requisições</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-green-600">{formatters.currency(fornecedor.valor_total)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {topByRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top 5 - Mais Requisições</CardTitle>
                        <CardDescription>Fornecedores com maior número de requisições</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topByRequests.map((fornecedor, index) => (
                                <div key={fornecedor.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{formatters.truncateText(fornecedor.razao_social, 30)}</div>
                                            <div className="text-xs text-muted-foreground">{formatters.currency(fornecedor.valor_total)}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-blue-600">{fornecedor.total_requisicoes}</div>
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
        const params = new URLSearchParams();
        if (data.data_inicio) params.append('data_inicio', data.data_inicio);
        if (data.data_fim) params.append('data_fim', data.data_fim);
        if (data.status) params.append('status', data.status);
        params.append('formato', format);

        window.location.href = `/relatorios/fornecedores/export?${params.toString()}`;
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
                            <p className="text-gray-600 dark:text-gray-400">Análise detalhada dos fornecedores do sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => handleExport('excel')} disabled={fornecedores.length === 0}>
                            <Download className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('csv')} disabled={fornecedores.length === 0}>
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

                {/* Top Performers Cards */}
                {fornecedores.length > 0 && <TopPerformersCards fornecedores={fornecedores} />}
            </div>
        </AppLayout>
    );
}
