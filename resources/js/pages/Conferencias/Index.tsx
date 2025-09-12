import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, CheckSquare, Clock, DollarSign, FileDown, Plus, Search, Users } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { conferencias } from '@/routes';
import type { BreadcrumbItem, Conferencia, Fornecedor } from '@/types';

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

interface ConferenciasIndexProps {
    conferencias: {
        data: Conferencia[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    fornecedores: Fornecedor[];
    stats: {
        total_conferencias: number;
        em_andamento: number;
        finalizadas: number;
        este_mes: number;
        fornecedores_unicos: number;
        valor_total: number;
    };
    filters: {
        search?: string;
        fornecedor_id?: string;
        data_inicio?: string;
        data_fim?: string;
    };
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: conferencias.index(),
    },
];

const STATS_CONFIG = [
    {
        key: 'total_conferencias' as const,
        title: 'Total',
        icon: CheckCircle,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'encontradas com filtros' : 'conferências realizadas'),
    },
    {
        key: 'este_mes' as const,
        title: 'Este Mês',
        icon: Calendar,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'deste mês nos resultados' : 'conferências no mês'),
    },
    {
        key: 'fornecedores_unicos' as const,
        title: 'Fornecedores',
        icon: Users,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'únicos nos resultados' : 'únicos conferidos'),
    },
    {
        key: 'valor_total' as const,
        title: 'Valor Total',
        icon: DollarSign,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'valor dos resultados' : 'valor conferido'),
        format: (value: number) => formatCurrency(value),
    },
    {
        key: 'em_andamento' as const,
        title: 'Em Andamento',
        icon: Clock,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'em andamento nos resultados' : 'aguardando finalização'),
    },
];

const MESSAGES = {
    noResults: 'Nenhuma conferência encontrada com os filtros aplicados',
    noData: 'Nenhuma conferência cadastrada',
    searchPlaceholder: 'Buscar por período ou fornecedor...',
    allFornecedores: 'Todos os fornecedores',
    noValue: '-',
} as const;

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

const formatFornecedorInfo = (fornecedor: Fornecedor | null | undefined) => {
    if (!fornecedor) return null;
    return (
        <div>
            <p className="font-medium">{fornecedor.razao_social}</p>
            {fornecedor.cnpj_formatado && <p className="text-sm text-gray-500">{fornecedor.cnpj_formatado}</p>}
        </div>
    );
};

const formatRequisicaoInfo = (count: number, value: number) => (
    <div className="text-sm">
        <p className="font-medium">{count || 0}</p>
        <p className="text-gray-500">{formatCurrency(value)}</p>
    </div>
);

// Components
interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    formatter?: (value: number) => string;
}

function StatCard({ title, value, description, icon: Icon, color = 'text-gray-900', formatter = (v) => v.toString() }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{formatter(value)}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

interface FilterSummaryProps {
    isFiltered: boolean;
    hasResults: boolean;
    totalCount: number;
    onClearFilters: () => void;
}

function FilterSummary({ isFiltered, hasResults, totalCount, onClearFilters }: FilterSummaryProps) {
    if (!isFiltered) return null;

    if (!hasResults) {
        return (
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Nenhuma conferência encontrada</h3>
                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            Não foram encontradas conferências que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.
                        </p>
                        <div className="mt-3">
                            <Button variant="outline" size="sm" onClick={onClearFilters}>
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Filtros aplicados</h3>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        Mostrando {totalCount} conferências que correspondem aos critérios de busca
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}

interface EmptyStateProps {
    isFiltered: boolean;
    stats: {
        total_conferencias: number;
        finalizadas: number;
        em_andamento: number;
    };
}

function EmptyState({ isFiltered, stats }: EmptyStateProps) {
    if (isFiltered) return null;

    if (stats.total_conferencias === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/20">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Nenhuma conferência cadastrada</h3>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Não há conferências no sistema ainda. Clique em "Nova Conferência" para começar.
                        </p>
                        <div className="mt-3">
                            <Button asChild>
                                <Link href={conferencias.create()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Conferência
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stats.finalizadas === 0) {
        return (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Conferências em andamento</h3>
                        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            Existem {stats.total_conferencias} conferências cadastradas, sendo {stats.em_andamento} em andamento. Finalize as
                            conferências para consolidar os dados.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

interface ConferenciaRowProps {
    conferencia: Conferencia;
}

function ConferenciaRow({ conferencia }: ConferenciaRowProps) {
    const extendedConferencia = conferencia as Conferencia & {
        periodo_display?: string;
        status_color?: string;
        status_display?: string;
    };

    return (
        <TableRow>
            <TableCell>{formatFornecedorInfo(conferencia.fornecedor)}</TableCell>
            <TableCell>
                <Badge variant="outline">{extendedConferencia.periodo_display}</Badge>
            </TableCell>
            <TableCell>
                <Badge className={extendedConferencia.status_color}>{extendedConferencia.status_display}</Badge>
            </TableCell>
            <TableCell>{formatRequisicaoInfo(conferencia.total_requisicoes || 0, conferencia.total_requisicoes || 0)}</TableCell>
            <TableCell>{formatRequisicaoInfo(conferencia.total_pedidos_manuais || 0, conferencia.total_pedidos_manuais || 0)}</TableCell>
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
    );
}

function EmptyTableRow() {
    return (
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
    );
}

// Main Component
export default function ConferenciasIndex({ conferencias: conferenciasPaginated, fornecedores, stats, filters }: ConferenciasIndexProps) {
    // Safe data extraction
    const safeConferencias = conferenciasPaginated || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safeConferencias.data || [];
    const safeLinks = safeConferencias.links || [];
    const safeMeta = safeConferencias.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeFornecedores = fornecedores || [];
    const safeStats = stats || {
        total_conferencias: 0,
        em_andamento: 0,
        finalizadas: 0,
        este_mes: 0,
        fornecedores_unicos: 0,
        valor_total: 0,
    };

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        fornecedor_id: filters?.fornecedor_id || '',
        data_inicio: filters?.data_inicio || '',
        data_fim: filters?.data_fim || '',
    });

    // Memoized values
    const isFiltered = useMemo(() => Boolean(data.search || data.fornecedor_id || data.data_inicio || data.data_fim), [data]);
    const hasResults = useMemo(() => safeData.length > 0, [safeData.length]);

    // Event handlers
    const handleSearch: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            get(conferencias.index(), {
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
                fornecedor_id: '',
                data_inicio: '',
                data_fim: '',
            });
            get(conferencias.index(), {
                preserveState: true,
                replace: true,
            });
        },
        [setData, get]
    );

    const handleExport = useMemo(
        () => () => {
            const params = new URLSearchParams(filters as Record<string, string>);
            window.location.href = `${conferencias.export()}?${params.toString()}`;
        },
        [filters]
    );

    const handlePaginationClick = useMemo(
        () => (url: string) => {
            router.get(url);
        },
        []
    );

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Conferências" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Conferências</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie as conferências de fornecedores</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleExport}>
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
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {STATS_CONFIG.map(({ key, title, icon, color, getDescription, format }) => (
                        <StatCard
                            key={key}
                            title={title}
                            value={safeStats[key]}
                            description={getDescription(isFiltered)}
                            icon={icon}
                            color={color}
                            formatter={format}
                        />
                    ))}
                </div>

                {/* Filter Summary and Empty States */}
                <FilterSummary
                    isFiltered={isFiltered}
                    hasResults={hasResults}
                    totalCount={safeStats.total_conferencias}
                    onClearFilters={handleReset}
                />

                <EmptyState isFiltered={isFiltered} stats={safeStats} />

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
                            Mostrando {safeData.length} de {safeMeta.total || 0} conferências
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fornecedor</TableHead>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Requisições</TableHead>
                                        <TableHead>Pedidos Manuais</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hasResults ? (
                                        safeData.map((conferencia) => <ConferenciaRow key={conferencia.id} conferencia={conferencia} />)
                                    ) : (
                                        <EmptyTableRow />
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {safeMeta.last_page > 1 && (
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
