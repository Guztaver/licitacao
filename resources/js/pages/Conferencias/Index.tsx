import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { conferencias } from '@/routes';
import type { BreadcrumbItem, Conferencia, Fornecedor } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, CheckSquare, FileDown, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: conferencias.index(),
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    from: number;
    to: number;
    last_page: number;
    current_page: number;
}

interface ConferenciasIndexProps {
    conferencias: {
        data: Conferencia[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    fornecedores: Fornecedor[];
    filters: {
        search?: string;
        fornecedor_id?: string;
        data_inicio?: string;
        data_fim?: string;
    };
}

export default function ConferenciasIndex({ conferencias: conferenciasPaginated, fornecedores, filters }: ConferenciasIndexProps) {
    // Add safety checks for data
    const safeConferencias = conferenciasPaginated || { data: [], links: [], meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 } };
    const safeData = safeConferencias.data || [];
    const safeLinks = safeConferencias.links || [];
    const safeMeta = safeConferencias.meta || { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 };
    const safeFornecedores = fornecedores || [];

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        fornecedor_id: filters?.fornecedor_id || '',
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(conferencias.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            fornecedor_id: '',
            data_inicio: '',
            data_fim: '',
        });
        get(conferencias.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conferências" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Conferências</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie as conferências de fornecedores</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.get(conferencias.export(), { ...filters })}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <Link href={conferencias.create()}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Conferência
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeMeta.total}</div>
                            <p className="text-xs text-muted-foreground">conferências realizadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {conferenciasPaginated.data.filter((c) => new Date(c.data_conferencia).getMonth() === new Date().getMonth()).length}
                            </div>
                            <p className="text-xs text-muted-foreground">conferências no mês</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{new Set(safeData.map((c) => c.fornecedor?.id)).size}</div>
                            <p className="text-xs text-muted-foreground">únicos conferidos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(safeData.reduce((acc, c) => acc + (c.total_geral || 0), 0))}</div>
                            <p className="text-xs text-muted-foreground">valor conferido</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                        <CardDescription>Use os filtros abaixo para refinar sua busca</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="min-w-[200px] flex-1">
                                <div className="relative">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por período ou fornecedor..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="min-w-[200px]">
                                <select
                                    value={data.fornecedor_id}
                                    onChange={(e) => setData('fornecedor_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos os fornecedores</option>
                                    {safeFornecedores.map((fornecedor) => (
                                        <option key={fornecedor.id} value={fornecedor.id}>
                                            {fornecedor.razao_social}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    placeholder="Data início"
                                    value={data.data_inicio}
                                    onChange={(e) => setData('data_inicio', e.target.value)}
                                />
                                <Input
                                    type="date"
                                    placeholder="Data fim"
                                    value={data.data_fim}
                                    onChange={(e) => setData('data_fim', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>
                                <Button type="button" variant="outline" onClick={handleReset}>
                                    Limpar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Lista de Conferências</CardTitle>
                        <CardDescription>
                            Mostrando {conferenciasPaginated.data.length} de {conferenciasPaginated.meta?.total || 0} conferências
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fornecedor</TableHead>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Data Conferência</TableHead>
                                        <TableHead>Requisições</TableHead>
                                        <TableHead>Pedidos Manuais</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {safeData.length > 0 ? (
                                        safeData.map((conferencia) => (
                                            <TableRow key={conferencia.id}>
                                                <TableCell>
                                                    {conferencia.fornecedor && (
                                                        <div>
                                                            <p className="font-medium">{conferencia.fornecedor.razao_social}</p>
                                                            {conferencia.fornecedor.cnpj_formatado && (
                                                                <p className="text-sm text-gray-500">{conferencia.fornecedor.cnpj_formatado}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{conferencia.periodo}</Badge>
                                                </TableCell>
                                                <TableCell>{conferencia.data_conferencia}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="font-medium">{conferencia.total_requisicoes || 0}</p>
                                                        <p className="text-gray-500">{formatCurrency(conferencia.total_requisicoes || 0)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="font-medium">{conferencia.total_pedidos_manuais || 0}</p>
                                                        <p className="text-gray-500">{formatCurrency(conferencia.total_pedidos_manuais || 0)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-semibold">{formatCurrency(conferencia.total_geral || 0)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={conferencias.show(conferencia.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <CheckSquare className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500">Nenhuma conferência encontrada</p>
                                                    <Link href={conferencias.create()}>
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Adicionar Conferência
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {conferenciasPaginated.meta?.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {conferenciasPaginated.meta?.from || 0} até {conferenciasPaginated.meta?.to || 0} de{' '}
                                    {conferenciasPaginated.meta?.total || 0} resultados
                                </div>
                                <div className="flex items-center space-x-2">
                                    {safeLinks.map((link) => (
                                        <Button
                                            key={link.label}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            {link.label.includes('&laquo;')
                                                ? '«'
                                                : link.label.includes('&raquo;')
                                                  ? '»'
                                                  : link.label.includes('&hellip;')
                                                    ? '...'
                                                    : link.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
