import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { requisicoes } from '@/routes';
import type { BreadcrumbItem, Emitente, Requisicao } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileDown, FileText, Plus, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requisições',
        href: requisicoes.index(),
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

interface RequisicoesIndexProps {
    requisicoes: {
        data: Requisicao[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    emitentes: Emitente[];
    filters: {
        search?: string;
        status?: string;
        emitente_id?: string;
        data_inicio?: string;
        data_fim?: string;
    };
}

export default function RequisicoesIndex({ requisicoes: requisicoesPaginated, emitentes, filters }: RequisicoesIndexProps) {
    // Add safety checks for data
    const safeRequisicoes = requisicoesPaginated || { data: [], links: [], meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 } };
    const safeData = safeRequisicoes.data || [];
    const safeLinks = safeRequisicoes.links || [];
    const safeMeta = safeRequisicoes.meta || { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 };
    const safeEmitentes = emitentes || [];

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        emitente_id: filters?.emitente_id || '',
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(requisicoes.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            emitente_id: '',
            data_inicio: '',
            data_fim: '',
        });
        get(requisicoes.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getStatusBadge = (status: string, statusColor?: string) => {
        return (
            <Badge variant="outline" className={statusColor || 'border-gray-200 bg-gray-100 text-gray-800'}>
                {status}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requisições" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Requisições</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie as requisições do sistema</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.get(requisicoes.export(), { ...filters })}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <Link href={requisicoes.create()}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Requisição
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeMeta.total}</div>
                            <p className="text-xs text-muted-foreground">requisições cadastradas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{requisicoesPaginated.data.filter((r) => r.status === 'autorizada').length}</div>
                            <p className="text-xs text-muted-foreground">aguardando processamento</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Concretizadas</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{requisicoesPaginated.data.filter((r) => r.status === 'concretizada').length}</div>
                            <p className="text-xs text-muted-foreground">finalizadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    safeData.filter((r) => r.status === 'concretizada').reduce((acc, r) => acc + (r.valor_final || 0), 0),
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">valor concretizado</p>
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
                                        placeholder="Buscar por número, solicitante..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="min-w-[150px]">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos os status</option>
                                    <option value="autorizada">Autorizada</option>
                                    <option value="concretizada">Concretizada</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>
                            <div className="min-w-[150px]">
                                <select
                                    value={data.emitente_id}
                                    onChange={(e) => setData('emitente_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos os emitentes</option>
                                    {safeEmitentes.map((emitente) => (
                                        <option key={emitente.id} value={emitente.id}>
                                            {emitente.sigla} - {emitente.nome}
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
                        <CardTitle className="text-lg">Lista de Requisições</CardTitle>
                        <CardDescription>
                            Mostrando {requisicoesPaginated.data.length} de {requisicoesPaginated.meta?.total || 0} requisições
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Solicitante</TableHead>
                                        <TableHead>Emitente</TableHead>
                                        <TableHead>Data Recebimento</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {safeData.length > 0 ? (
                                        safeData.map((requisicao) => (
                                            <TableRow key={requisicao.id}>
                                                <TableCell>
                                                    <div>
                                                        <Link
                                                            href={requisicoes.show(requisicao.id)}
                                                            className="font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            {requisicao.numero_completo}
                                                        </Link>
                                                        {requisicao.numero_oficio && (
                                                            <p className="text-sm text-gray-500">Ofício: {requisicao.numero_oficio}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{requisicao.solicitante}</TableCell>
                                                <TableCell>
                                                    {requisicao.emitente && (
                                                        <div className="text-sm">
                                                            <p className="font-medium">{requisicao.emitente.sigla}</p>
                                                            <p className="text-gray-500">{requisicao.emitente.nome}</p>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>{requisicao.data_recebimento}</TableCell>
                                                <TableCell>
                                                    {getStatusBadge(requisicao.status_display || requisicao.status, requisicao.status_color)}
                                                </TableCell>
                                                <TableCell>{formatCurrency(requisicao.valor_final || null)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={requisicoes.show(requisicao.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                        {requisicao.pode_editar && (
                                                            <Link href={requisicoes.edit(requisicao.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    Editar
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <FileText className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500">Nenhuma requisição encontrada</p>
                                                    <Link href={requisicoes.create()}>
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Adicionar Requisição
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
                        {requisicoesPaginated.meta?.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {requisicoesPaginated.meta?.from || 0} até {requisicoesPaginated.meta?.to || 0} de {safeMeta.total}{' '}
                                    resultados
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
