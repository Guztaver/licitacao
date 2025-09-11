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
import react from 'react';

// Constants
const EMPTY_MESSAGES = {
    noSuppliers: 'Nenhum fornecedor encontrado',
    addFirstSupplier: 'Adicionar Fornecedor',
    noDataWithFilters: 'Não foram encontrados fornecedores que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.',
    noMovement:
        'Existem fornecedores cadastrados, mas nenhum possui requisições ou pedidos manuais associados. Para gerar movimentação, associe requisições aos fornecedores.',
} as const;

const STATUS_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'ativo', label: 'Ativos' },
    { value: 'inativo', label: 'Inativos' },
] as const;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fornecedores',
        href: fornecedores.index(),
    },
];

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

interface FornecedoresStats {
    total_fornecedores: number;
    fornecedores_ativos: number;
    com_requisicoes: number;
    valor_total: number;
}

interface FornecedoresIndexProps {
    fornecedores: {
        data: Fornecedor[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: FornecedoresStats;
    filters: {
        search?: string;
        status?: string;
    };
}

interface StatCardProps {
    title: string;
    icon: react.ReactNode;
    value: string | number;
    subtitle: string;
}

interface AlertCardProps {
    type: 'warning' | 'info';
    title: string;
    message: string;
    action?: react.ReactNode;
}

// Utility Functions
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const getStatusBadge = (status: boolean): React.JSX.Element => (
    <Badge
        variant={status ? 'default' : 'secondary'}
        className={status ? 'border-green-200 bg-green-100 text-green-800' : 'border-red-200 bg-red-100 text-red-800'}
    >
        {status ? 'Ativo' : 'Inativo'}
    </Badge>
);

const formatPaginationLabel = (label: string): string => {
    if (label.includes('&laquo;')) return '«';
    if (label.includes('&raquo;')) return '»';
    if (label.includes('&hellip;')) return '...';
    return label;
};

const buildExportUrl = (filters: Record<string, string>): string => {
    const params = new URLSearchParams(filters);
    return `${fornecedores.export()}?${params.toString()}`;
};

// Components
const StatCard = ({ title, icon, value, subtitle }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
    </Card>
);

const AlertCard = ({ type, title, message, action }: AlertCardProps) => {
    const bgColor = type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-blue-50 dark:bg-blue-900/20';
    const titleColor = type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-900 dark:text-blue-200';
    const messageColor = type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : 'text-blue-700 dark:text-blue-300';

    return (
        <div className={`rounded-lg p-4 ${bgColor}`}>
            <div className="flex">
                <div className="ml-3">
                    <h3 className={`text-sm font-medium ${titleColor}`}>{title}</h3>
                    <p className={`mt-2 text-sm ${messageColor}`}>{message}</p>
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
        </div>
    );
};

const ContactInfo = ({ telefone, email }: { telefone?: string; email?: string }) => (
    <div className="text-sm">
        {telefone && <p>{telefone}</p>}
        {email && <p className="text-gray-500">{email}</p>}
    </div>
);

const RequisicoesInfo = ({ count, conferencias }: { count: number; conferencias?: number }) => (
    <div className="space-y-1 text-sm">
        <div className="font-medium">
            {count === 0 ? <span className="text-gray-500">Sem requisições</span> : <span className="text-gray-600">{count} requisições</span>}
        </div>
        <div className="text-xs text-gray-500">{conferencias === 0 || !conferencias ? 'Sem conferências' : `${conferencias} conferências`}</div>
    </div>
);

const EmptyTableRow = () => (
    <TableRow>
        <TableCell colSpan={7} className="py-8 text-center">
            <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 text-gray-400" />
                <p className="text-gray-500">{EMPTY_MESSAGES.noSuppliers}</p>
                <CreateFornecedorModal
                    trigger={
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            {EMPTY_MESSAGES.addFirstSupplier}
                        </Button>
                    }
                    onSuccess={() => router.reload()}
                />
            </div>
        </TableCell>
    </TableRow>
);

export default function FornecedoresIndex({ fornecedores: fornecedoresPaginated, stats, filters }: FornecedoresIndexProps) {
    // Safe data with defaults
    const safeData = fornecedoresPaginated?.data || [];
    const safeLinks = fornecedoresPaginated?.links || [];
    const safeMeta = fornecedoresPaginated?.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeStats = stats || {
        total_fornecedores: 0,
        fornecedores_ativos: 0,
        com_requisicoes: 0,
        valor_total: 0,
    };

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    // Handlers
    const handleSearch: react.FormEventHandler = react.useCallback(
        (e) => {
            e.preventDefault();
            get(fornecedores.index(), {
                preserveState: true,
                replace: true,
            });
        },
        [get],
    );

    const handleReset = react.useCallback(() => {
        setData({
            search: '',
            status: '',
        });
        get(fornecedores.index(), {
            preserveState: true,
            replace: true,
        });
    }, [setData, get]);

    const handleAutoSearch = react.useCallback(() => {
        if (data.search === '' && data.status === '') {
            get(fornecedores.index(), {
                preserveState: true,
                replace: true,
            });
        }
    }, [data.search, data.status, get]);

    const handleExport = react.useCallback(() => {
        window.location.href = buildExportUrl(filters as Record<string, string>);
    }, [filters]);

    const handlePaginationClick = react.useCallback((url: string) => {
        router.get(url);
    }, []);

    // Effects
    react.useEffect(() => {
        handleAutoSearch();
    }, [handleAutoSearch]);

    // Statistics data
    const hasFilters = data.search || data.status;
    const statisticsData = [
        {
            title: 'Total',
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            value: safeStats.total_fornecedores,
            subtitle: hasFilters ? 'encontrados com filtros' : 'fornecedores cadastrados',
        },
        {
            title: 'Ativos',
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
            value: safeStats.fornecedores_ativos,
            subtitle: hasFilters ? 'ativos nos resultados' : 'fornecedores ativos',
        },
        {
            title: 'Com Movimentação',
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
            value: safeStats.com_requisicoes,
            subtitle: hasFilters ? 'com requisições nos resultados' : 'possuem requisições/pedidos',
        },
        {
            title: 'Valor Total',
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
            value: formatCurrency(safeStats.valor_total),
            subtitle: hasFilters ? 'valor dos resultados' : 'requisições concretizadas',
        },
    ];

    // Conditional messages
    const showEmptyFiltersAlert = safeStats.total_fornecedores === 0 && hasFilters;
    const showNoMovementAlert = safeStats.total_fornecedores > 0 && safeStats.com_requisicoes === 0 && !hasFilters;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fornecedores" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fornecedores</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os fornecedores do sistema</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleExport}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <CreateFornecedorModal onSuccess={() => router.reload()} />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    {statisticsData.map((stat) => (
                        <StatCard key={`stat-${stat.title}`} {...stat} />
                    ))}
                </div>

                {/* Alert Messages */}
                {showEmptyFiltersAlert && (
                    <AlertCard
                        type="warning"
                        title="Nenhum fornecedor encontrado"
                        message={EMPTY_MESSAGES.noDataWithFilters}
                        action={
                            <Button variant="outline" size="sm" onClick={handleReset}>
                                Limpar Filtros
                            </Button>
                        }
                    />
                )}

                {showNoMovementAlert && <AlertCard type="info" title="Fornecedores sem movimentação" message={EMPTY_MESSAGES.noMovement} />}

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
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
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
                        <CardTitle className="text-lg">Lista de Fornecedores</CardTitle>
                        <CardDescription>
                            Mostrando {safeData.length} de {safeMeta.total} fornecedores
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
                                                            className="font-medium text-blue-800 hover:text-blue-900"
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
                                                    <ContactInfo telefone={fornecedor.telefone_formatado} email={fornecedor.email} />
                                                </TableCell>
                                                <TableCell>{getStatusBadge(fornecedor.status)}</TableCell>
                                                <TableCell>
                                                    <RequisicoesInfo
                                                        count={fornecedor.requisicoes_count || 0}
                                                        conferencias={fornecedor.conferencias_count}
                                                    />
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
                                    {safeLinks.map((link, index) => (
                                        <Button
                                            key={`${link.label}-${index}`}
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
