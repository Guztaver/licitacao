import CreateFornecedorModal from '@/components/modals/CreateFornecedorModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { fornecedores } from '@/routes';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Building, FileDown, Plus, Search, Users } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fornecedores',
        href: fornecedores.index(),
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

interface FornecedoresIndexProps {
    fornecedores: {
        data: Fornecedor[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: {
        total_fornecedores: number;
        fornecedores_ativos: number;
        com_requisicoes: number;
        valor_total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function FornecedoresIndex({ fornecedores: fornecedoresPaginated, stats, filters }: FornecedoresIndexProps) {
    // Add safety checks for data
    const safeFornecedores = fornecedoresPaginated || { data: [], links: [], meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 } };
    const safeData = safeFornecedores.data || [];
    const safeLinks = safeFornecedores.links || [];
    const safeMeta = safeFornecedores.meta || { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 };
    const safeStats = stats || { total_fornecedores: 0, fornecedores_ativos: 0, com_requisicoes: 0, valor_total: 0 };

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(fornecedores.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
        });
        get(fornecedores.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleAutoSearch = () => {
        if (data.search === '' && data.status === '') {
            get(fornecedores.index(), {
                preserveState: true,
                replace: true,
            });
        }
    };

    useEffect(() => {
        handleAutoSearch();
    }, [data.search, data.status]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getStatusBadge = (status: boolean) => {
        return (
            <Badge
                variant={status ? 'default' : 'secondary'}
                className={status ? 'border-green-200 bg-green-100 text-green-800' : 'border-red-200 bg-red-100 text-red-800'}
            >
                {status ? 'Ativo' : 'Inativo'}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fornecedores" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fornecedores</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os fornecedores do sistema</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const params = new URLSearchParams(filters as Record<string, string>);
                                window.location.href = `/fornecedores-export?${params.toString()}`;
                            }}
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <CreateFornecedorModal onSuccess={() => router.reload()} />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.total_fornecedores}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.search || data.status ? 'encontrados com filtros' : 'fornecedores cadastrados'}
                            </p>
                            {safeData.length > 0 && safeMeta.total !== safeStats.total_fornecedores && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Mostrando {safeData.length} de {safeMeta.total} na página
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.fornecedores_ativos}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.search || data.status ? 'ativos nos resultados' : 'fornecedores ativos'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Com Movimentação</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.com_requisicoes}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.search || data.status ? 'com requisições nos resultados' : 'possuem requisições/pedidos'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(safeStats.valor_total)}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.search || data.status ? 'valor dos resultados' : 'requisições concretizadas'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Empty State Message */}
                {safeStats.total_fornecedores === 0 && (data.search || data.status) && (
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Nenhum fornecedor encontrado</h3>
                                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                    Não foram encontrados fornecedores que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.
                                </p>
                                <div className="mt-3">
                                    <Button variant="outline" size="sm" onClick={handleReset}>
                                        Limpar Filtros
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Low Data Notice */}
                {safeStats.total_fornecedores > 0 && safeStats.com_requisicoes === 0 && !data.search && !data.status && (
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Fornecedores sem movimentação</h3>
                                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    Existem fornecedores cadastrados, mas nenhum possui requisições ou pedidos manuais associados. Para gerar
                                    movimentação, associe requisições aos fornecedores.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                                        placeholder="Buscar por razão social ou CNPJ..."
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
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos</option>
                                    <option value="ativo">Ativos</option>
                                    <option value="inativo">Inativos</option>
                                </select>
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
                        <CardTitle className="text-lg">Lista de Fornecedores</CardTitle>
                        <CardDescription>
                            Mostrando {fornecedoresPaginated.data.length} de {fornecedoresPaginated.meta?.total || 0} fornecedores
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
                                        <TableHead>Requisições</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {safeData.length > 0 ? (
                                        safeData.map((fornecedor) => (
                                            <TableRow key={fornecedor.id}>
                                                <TableCell>
                                                    <div>
                                                        <Link
                                                            href={fornecedores.show(fornecedor.id)}
                                                            className="font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            {fornecedor.razao_social}
                                                        </Link>
                                                        {fornecedor.endereco_completo && (
                                                            <p className="text-sm text-gray-500">{fornecedor.endereco_completo}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm">{fornecedor.cnpj_formatado}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {fornecedor.telefone_formatado && <p>{fornecedor.telefone_formatado}</p>}
                                                        {fornecedor.email && <p className="text-gray-500">{fornecedor.email}</p>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(fornecedor.status)}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <span className="font-medium">{fornecedor.requisicoes_count || 0}</span>
                                                        {fornecedor.conferencias_count && fornecedor.conferencias_count > 0 && (
                                                            <p className="text-gray-500">{fornecedor.conferencias_count} conferências</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{fornecedor.total_geral ? formatCurrency(fornecedor.total_geral) : '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={fornecedores.show(fornecedor.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                        <Link href={fornecedores.edit(fornecedor.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Editar
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
                                                    <Users className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500">Nenhum fornecedor encontrado</p>
                                                    <CreateFornecedorModal
                                                        trigger={
                                                            <Button size="sm">
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Adicionar Fornecedor
                                                            </Button>
                                                        }
                                                        onSuccess={() => router.reload()}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {fornecedoresPaginated.meta?.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {fornecedoresPaginated.meta?.from || 0} até {fornecedoresPaginated.meta?.to || 0} de{' '}
                                    {fornecedoresPaginated.meta?.total || 0} resultados
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
