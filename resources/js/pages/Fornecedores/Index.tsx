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
    filters: {
        search?: string;
        status?: string;
    };
}

export default function FornecedoresIndex({ fornecedores: fornecedoresPaginated, filters }: FornecedoresIndexProps) {
    // Add safety checks for data
    const safeFornecedores = fornecedoresPaginated || { data: [], links: [], meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 } };
    const safeData = safeFornecedores.data || [];
    const safeLinks = safeFornecedores.links || [];
    const safeMeta = safeFornecedores.meta || { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 };

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
                            <div className="text-2xl font-bold">{safeMeta.total}</div>
                            <p className="text-xs text-muted-foreground">fornecedores cadastrados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fornecedoresPaginated.data.filter((f) => f.status).length}</div>
                            <p className="text-xs text-muted-foreground">fornecedores ativos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Com Requisições</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {fornecedoresPaginated.data.filter((f) => f.requisicoes_count && f.requisicoes_count > 0).length}
                            </div>
                            <p className="text-xs text-muted-foreground">com movimento</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(safeData.reduce((acc, f) => acc + (f.total_geral || 0), 0))}</div>
                            <p className="text-xs text-muted-foreground">valor movimentado</p>
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
