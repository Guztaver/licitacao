import { Head, Link, router } from '@inertiajs/react';
import { FileDown, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Fornecedor {
    id: number;
    razao_social: string;
}

interface Contrato {
    id: number;
    numero_contrato: string;
    fornecedor?: {
        id: number;
        razao_social: string;
    };
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: number | null;
    limite_conferencias: number | null;
    status: 'ativo' | 'inativo' | 'expirado';
    status_display: string;
    status_color: string;
    descricao?: string;
}

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

interface ContratosIndexProps {
    contratos: {
        data: Contrato[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    fornecedores: Fornecedor[];
    filters: {
        search?: string;
        status?: string;
        fornecedor_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contratos',
        href: '/contratos',
    },
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'Todos os status' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'expirado', label: 'Expirado' },
];

export default function ContratosIndex({ contratos, fornecedores, filters }: ContratosIndexProps) {
    // Safe data extraction
    const safeContratos = contratos || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safeContratos.data || [];
    const safeLinks = safeContratos.links || [];
    const safeMeta = safeContratos.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeFornecedores = fornecedores || [];
    const safeFilters = filters || {};

    const [search, setSearch] = useState(safeFilters.search || '');
    const [status, setStatus] = useState(safeFilters.status || 'all');
    const [fornecedorId, setFornecedorId] = useState(safeFilters.fornecedor_id || 'all');

    const handleSearch = () => {
        router.get(
            '/contratos',
            {
                search,
                status: status === 'all' ? undefined : status,
                fornecedor_id: fornecedorId === 'all' ? undefined : fornecedorId,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setFornecedorId('all');
        router.get('/contratos', {}, { preserveState: true });
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contratos</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie contratos e limites de requisições e conferências</p>
                    </div>
                    <Link href="/contratos/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Contrato
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por número ou descrição..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={fornecedorId} onValueChange={setFornecedorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Fornecedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os fornecedores</SelectItem>
                                    {safeFornecedores.map((fornecedor) => (
                                        <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                            {fornecedor.razao_social}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>
                                <Button onClick={handleClearFilters} variant="outline">
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        {safeData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileDown className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nenhum contrato encontrado</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {safeFilters.search || safeFilters.status || safeFilters.fornecedor_id
                                        ? 'Tente ajustar os filtros de busca.'
                                        : 'Comece criando um novo contrato.'}
                                </p>
                                <Link href="/contratos/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar Primeiro Contrato
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Número</TableHead>
                                            <TableHead>Fornecedor</TableHead>
                                            <TableHead>Vigência</TableHead>
                                            <TableHead>Limite Requisições</TableHead>
                                            <TableHead>Limite Conferências</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safeData.map((contrato) => (
                                            <TableRow key={contrato.id}>
                                                <TableCell className="font-medium">{contrato.numero_contrato}</TableCell>
                                                <TableCell>{contrato.fornecedor?.razao_social || 'Geral'}</TableCell>
                                                <TableCell>
                                                    {contrato.data_inicio} a {contrato.data_fim}
                                                </TableCell>
                                                <TableCell>
                                                    {contrato.limite_requisicoes !== null ? contrato.limite_requisicoes : 'Ilimitado'}
                                                </TableCell>
                                                <TableCell>
                                                    {contrato.limite_conferencias !== null ? contrato.limite_conferencias : 'Ilimitado'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            contrato.status === 'ativo'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : contrato.status === 'inativo'
                                                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }
                                                    >
                                                        {contrato.status_display}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/contratos/${contrato.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            Ver Detalhes
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {safeMeta.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t px-6 py-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Mostrando {safeMeta.from} a {safeMeta.to} de {safeMeta.total} resultados
                                        </div>
                                        <div className="flex gap-2">
                                            {safeLinks.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(link.url)}
                                                    disabled={!link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
