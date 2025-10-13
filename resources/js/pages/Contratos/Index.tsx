import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, DollarSign, Edit2, FileDown, Plus, Search, ToggleLeft, ToggleRight, Users, AlertTriangle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { contratos } from '@/routes';
import type { BreadcrumbItem, Contrato, Fornecedor } from '@/types';

// Types
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

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Contratos',
        href: contratos.index(),
    },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Todos os status' },
    { value: 'ativo', label: 'Ativos' },
    { value: 'inativo', label: 'Inativos' },
    { value: 'expirado', label: 'Expirados' },
];

const MESSAGES = {
    noResults: 'Nenhum contrato encontrado com os filtros aplicados',
    noData: 'Nenhum contrato cadastrado',
    searchPlaceholder: 'Buscar por número do contrato ou fornecedor...',
    allFornecedores: 'Todos os fornecedores',
    noValue: '-',
    confirmDelete: 'Tem certeza que deseja excluir este contrato?',
    cannotDelete: 'Este contrato não pode ser excluído pois possui requisições ou conferências vinculadas.',
};

// Utility Functions
const formatCurrency = (value: number | null | undefined) => {
    if (!value || value === 0) return MESSAGES.noValue;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const formatPaginationLabel = (label: string) => {
    if (label.includes('&laquo;')) return '«';
    if (label.includes('&raquo;')) return '»';
    if (label.includes('&hellip;')) return '...';
    return label;
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'ativo':
            return <CheckCircle className="h-4 w-4" />;
        case 'inativo':
            return <ToggleLeft className="h-4 w-4" />;
        case 'expirado':
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

// Components
interface EmptyStateProps {
    isFiltered: boolean;
}

function EmptyState({ isFiltered }: EmptyStateProps) {
    return (
        <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-900/20">
            <div className="flex flex-col items-center space-y-4 text-center">
                <FileDown className="h-12 w-12 text-gray-400" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{isFiltered ? MESSAGES.noResults : MESSAGES.noData}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {isFiltered
                            ? 'Tente ajustar os filtros para encontrar o que procura.'
                            : 'Clique em "Novo Contrato" para começar a cadastrar contratos no sistema.'}
                    </p>
                </div>
                {!isFiltered && (
                    <Button asChild>
                        <Link href={contratos.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Contrato
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

interface ContratoRowProps {
    contrato: Contrato & {
        fornecedor?: { id: number; razao_social: string } | null;
        status_display?: string;
        status_color?: string;
    };
    onToggleStatus: (id: number) => void;
    onDelete: (id: number) => void;
}

function ContratoRow({ contrato, onToggleStatus, onDelete }: ContratoRowProps) {
    const handleToggleStatus = () => {
        onToggleStatus(contrato.id);
    };

    const handleDelete = () => {
        if (confirm(MESSAGES.confirmDelete)) {
            onDelete(contrato.id);
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{contrato.numero_contrato}</TableCell>
            <TableCell>
                {contrato.fornecedor ? (
                    <div>
                        <p className="font-medium">{contrato.fornecedor.razao_social}</p>
                    </div>
                ) : (
                    <span className="text-gray-500">Contrato geral</span>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {getStatusIcon(contrato.status)}
                    <Badge className={contrato.status_color}>{contrato.status_display || contrato.status}</Badge>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>{contrato.data_inicio}</p>
                    <p className="text-gray-500">{contrato.data_fim}</p>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="text-sm">
                    <p>{formatCurrency(contrato.valor_total)}</p>
                    {contrato.limite_valor_mensal && <p className="text-gray-500">Mensal: {formatCurrency(contrato.limite_valor_mensal)}</p>}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="text-sm">
                    <p>Req: {contrato.limite_requisicoes || '-'}</p>
                    <p>Conf: {contrato.limite_conferencias || '-'}</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Link href={contratos.show(contrato.id)}>
                        <Button variant="outline" size="sm">
                            Ver
                        </Button>
                    </Link>
                    <Link href={contratos.edit(contrato.id)}>
                        <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleToggleStatus} disabled={contrato.status === 'expirado'}>
                        {contrato.status === 'ativo' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

// Main Component
export default function ContratosIndex({ contratos: contratosPaginated, fornecedores, filters }: ContratosIndexProps) {
    // Safe data extraction
    const safeContratos = contratosPaginated || {
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

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        fornecedor_id: filters?.fornecedor_id || '',
    });

    // Memoized values
    const isFiltered = useMemo(() => Boolean(data.search || data.status || data.fornecedor_id), [data]);
    const hasResults = useMemo(() => safeData.length > 0, [safeData.length]);

    // Event handlers
    const handleSearch: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            get(contratos.index(), {
                preserveState: true,
                replace: true,
            });
        },
        [get]
    );

    const handleReset = useMemo(
        () => () => {
            setData({
                search: '',
                status: '',
                fornecedor_id: '',
            });
            get(contratos.index(), {
                preserveState: true,
                replace: true,
            });
        },
        [setData, get]
    );

    const handleToggleStatus = useMemo(
        () => (id: number) => {
            router.post(contratos.toggleStatus(id));
        },
        []
    );

    const handleDelete = useMemo(
        () => (id: number) => {
            router.delete(contratos.destroy(id));
        },
        []
    );

    const handlePaginationClick = useMemo(
        () => (url: string) => {
            router.get(url);
        },
        []
    );

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Contratos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contratos</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os contratos e convênios</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild>
                            <Link href={contratos.create()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Contrato
                            </Link>
                        </Button>
                    </div>
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
                                        placeholder={MESSAGES.searchPlaceholder}
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="min-w-[200px]">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="min-w-[200px]">
                                <select
                                    value={data.fornecedor_id}
                                    onChange={(e) => setData('fornecedor_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">{MESSAGES.allFornecedores}</option>
                                    {safeFornecedores.map((fornecedor) => (
                                        <option key={fornecedor.id} value={fornecedor.id}>
                                            {fornecedor.razao_social}
                                        </option>
                                    ))}
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
                        <CardTitle className="text-lg">Lista de Contratos</CardTitle>
                        <CardDescription>
                            Mostrando {safeData.length} de {safeMeta.total || 0} contratos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasResults ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Número do Contrato</TableHead>
                                            <TableHead>Fornecedor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Vigência</TableHead>
                                            <TableHead className="text-right">Valores</TableHead>
                                            <TableHead className="text-right">Limites</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safeData.map((contrato) => (
                                            <ContratoRow
                                                key={contrato.id}
                                                contrato={contrato}
                                                onToggleStatus={handleToggleStatus}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <EmptyState isFiltered={isFiltered} />
                        )}

                        {/* Pagination */}
                        {hasResults && safeMeta.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {safeMeta.from || 0} até {safeMeta.to || 0} de {safeMeta.total || 0} resultados
                                </div>
                                <div className="flex items-center space-x-2">
                                    {safeLinks.map((link) => (
                                        <Button
                                            key={link.label}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && handlePaginationClick(link.url)}
                                        >
                                            {formatPaginationLabel(link.label)}
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
