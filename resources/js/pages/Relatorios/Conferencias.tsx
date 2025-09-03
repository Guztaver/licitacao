import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BarChart3, Calendar, CheckCircle, DollarSign, Download, Filter, Search, TrendingUp } from 'lucide-react';
import type { FormEventHandler } from 'react';

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

interface RelatorioConferenciasProps {
    conferencias: ConferenciaRelatorio[];
    stats: {
        total_conferencias: number;
        valor_total_geral: number;
        valor_total_requisicoes: number;
        valor_total_pedidos_manuais: number;
        conferencias_por_fornecedor: Record<string, { count: number; valor_total: number }>;
        conferencias_por_mes: Record<string, { count: number; valor_total: number }>;
    };
    filters: {
        data_inicio?: string;
        data_fim?: string;
        fornecedor_id?: string;
    };
    fornecedores?: Pick<Fornecedor, 'id' | 'razao_social'>[];
}

export default function RelatorioConferencias({
    conferencias,
    stats,
    filters,
    fornecedores = []
}: RelatorioConferenciasProps) {
    const { data, setData, get, processing } = useForm({
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
        fornecedor_id: filters?.fornecedor_id || '',
    });

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
        const params = new URLSearchParams(data as Record<string, string>);
        params.append('formato', format);
        window.location.href = `/relatorios/conferencias/export?${params.toString()}`;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de Conferências" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
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
                            <p className="text-gray-600 dark:text-gray-400">
                                Análise detalhada das conferências realizadas
                            </p>
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
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Conferências</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_conferencias}</div>
                            <p className="text-xs text-muted-foreground">conferências realizadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total Geral</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.valor_total_geral)}</div>
                            <p className="text-xs text-muted-foreground">valor total conferido</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Requisições</CardTitle>
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.valor_total_requisicoes)}</div>
                            <p className="text-xs text-muted-foreground">valor em requisições</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Manuais</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.valor_total_pedidos_manuais)}</div>
                            <p className="text-xs text-muted-foreground">valor em pedidos manuais</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="mr-2 h-5 w-5" />
                            Filtros
                        </CardTitle>
                        <CardDescription>Use os filtros para refinar o relatório de conferências</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="data_inicio">Data Início</Label>
                                    <Input
                                        id="data_inicio"
                                        type="date"
                                        value={data.data_inicio}
                                        onChange={(e) => setData('data_inicio', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="data_fim">Data Fim</Label>
                                    <Input
                                        id="data_fim"
                                        type="date"
                                        value={data.data_fim}
                                        onChange={(e) => setData('data_fim', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fornecedor_id">Fornecedor</Label>
                                    <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os fornecedores" />
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
                                <Button type="button" variant="outline" onClick={handleReset}>
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

                {/* Results Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conferências Encontradas</CardTitle>
                        <CardDescription>
                            {stats.total_conferencias} conferências encontradas (ordenadas por data)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Fornecedor</TableHead>
                                        <TableHead>Data Conferência</TableHead>
                                        <TableHead className="text-right">Requisições</TableHead>
                                        <TableHead className="text-right">Pedidos Manuais</TableHead>
                                        <TableHead className="text-right">Total Geral</TableHead>
                                        <TableHead>Observações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conferencias.length > 0 ? (
                                        conferencias.map((conferencia) => (
                                            <TableRow key={conferencia.id}>
                                                <TableCell>
                                                    <div className="font-medium">{conferencia.periodo}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {conferencia.fornecedor ? (
                                                        <div>
                                                            <div className="font-medium">{conferencia.fornecedor.razao_social}</div>
                                                            <div className="text-sm text-gray-500 font-mono">{conferencia.fornecedor.cnpj_formatado}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span>{formatDate(conferencia.data_conferencia)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-medium text-blue-600">
                                                        {formatCurrency(conferencia.total_requisicoes)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-medium text-purple-600">
                                                        {formatCurrency(conferencia.total_pedidos_manuais)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-medium text-green-600">
                                                        {formatCurrency(conferencia.total_geral)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {conferencia.observacoes ? (
                                                        <div className="max-w-xs truncate text-sm text-gray-600" title={conferencia.observacoes}>
                                                            {conferencia.observacoes}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center">
                                                <CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
                                                <p className="mt-2 text-gray-500">Nenhuma conferência encontrada com os filtros aplicados</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Charts */}
                {Object.keys(stats.conferencias_por_fornecedor).length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Por Fornecedor</CardTitle>
                                <CardDescription>Conferências e valores por fornecedor</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(stats.conferencias_por_fornecedor)
                                        .sort(([,a], [,b]) => b.valor_total - a.valor_total)
                                        .slice(0, 5)
                                        .map(([fornecedor, data]) => (
                                            <div key={fornecedor} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-sm">{fornecedor}</div>
                                                    <div className="text-xs text-gray-500">{data.count} conferências</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium text-green-600">{formatCurrency(data.valor_total)}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Por Mês</CardTitle>
                                <CardDescription>Conferências e valores por mês</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(stats.conferencias_por_mes)
                                        .sort(([a], [b]) => b.localeCompare(a))
                                        .slice(0, 6)
                                        .map(([mes, data]) => {
                                            const [ano, mesNum] = mes.split('-');
                                            const mesNome = new Date(parseInt(ano), parseInt(mesNum) - 1).toLocaleDateString('pt-BR', {
                                                month: 'long',
                                                year: 'numeric'
                                            });

                                            return (
                                                <div key={mes} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div>
                                                        <div className="font-medium text-sm capitalize">{mesNome}</div>
                                                        <div className="text-xs text-gray-500">{data.count} conferências</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-blue-600">{formatCurrency(data.valor_total)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
