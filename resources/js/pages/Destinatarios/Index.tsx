import CreateDestinatarioModal from '@/components/modals/CreateDestinatarioModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { destinatarios } from '@/routes';
import type { BreadcrumbItem, Destinatario } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileDown, MapPin, Plus, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Destinatários',
        href: destinatarios.index(),
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

interface DestinatariosIndexProps {
    destinatarios: {
        data: Destinatario[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
    };
}

export default function DestinatariosIndex({ destinatarios: destinatariosPaginated, filters }: DestinatariosIndexProps) {
    // Add safety checks for data
    const safeDestinatarios = destinatariosPaginated || { data: [], links: [], meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 } };
    const safeData = safeDestinatarios.data || [];
    const safeLinks = safeDestinatarios.links || [];
    const safeMeta = safeDestinatarios.meta || { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 };

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(destinatarios.index(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
        });
        get(destinatarios.index(), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Destinatários" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Destinatários</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os órgãos destinatários de requisições</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.get('/destinatarios-export', { ...filters })}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <CreateDestinatarioModal onSuccess={() => router.reload()} />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeMeta.total}</div>
                            <p className="text-xs text-muted-foreground">destinatários cadastrados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Com Requisições</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeData.filter((d) => d.requisicoes_count && d.requisicoes_count > 0).length}</div>
                            <p className="text-xs text-muted-foreground">com atividade</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Requisições Total</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeData.reduce((acc, d) => acc + (d.requisicoes_count || 0), 0)}</div>
                            <p className="text-xs text-muted-foreground">requisições recebidas</p>
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
                                        placeholder="Buscar por nome ou sigla..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
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
                        <CardTitle className="text-lg">Lista de Destinatários</CardTitle>
                        <CardDescription>
                            Mostrando {destinatariosPaginated.data.length} de {destinatariosPaginated.meta?.total || 0} destinatários
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome / Sigla</TableHead>
                                        <TableHead>Contato</TableHead>
                                        <TableHead>Requisições</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {safeData.length > 0 ? (
                                        safeData.map((destinatario) => (
                                            <TableRow key={destinatario.id}>
                                                <TableCell>
                                                    <div>
                                                        <Link
                                                            href={destinatarios.show(destinatario.id)}
                                                            className="font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            {destinatario.nome}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            Sigla: <span className="font-mono">{destinatario.sigla}</span>
                                                        </p>
                                                        {destinatario.endereco && <p className="text-sm text-gray-500">{destinatario.endereco}</p>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {destinatario.telefone && <p>{destinatario.telefone}</p>}
                                                        {destinatario.email && <p className="text-gray-500">{destinatario.email}</p>}
                                                        {!destinatario.telefone && !destinatario.email && <span className="text-gray-400">-</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <span className="font-medium">{destinatario.requisicoes_count || 0}</span>
                                                        <span className="text-gray-500"> requisições</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={destinatarios.show(destinatario.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Ver
                                                            </Button>
                                                        </Link>
                                                        <Link href={destinatarios.edit(destinatario.id)}>
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
                                            <TableCell colSpan={4} className="py-8 text-center">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <MapPin className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500">Nenhum destinatário encontrado</p>
                                                    <CreateDestinatarioModal
                                                        trigger={
                                                            <Button size="sm">
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Adicionar Destinatário
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
                        {destinatariosPaginated.meta?.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {destinatariosPaginated.meta?.from || 0} até {destinatariosPaginated.meta?.to || 0} de{' '}
                                    {destinatariosPaginated.meta?.total || 0} resultados
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
