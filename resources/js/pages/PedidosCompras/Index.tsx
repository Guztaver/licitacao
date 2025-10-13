import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock, Edit2, Eye, FileText, Plus, Search, Trash2, User, XCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { pedidosCompras } from '@/routes';
import type { BreadcrumbItem, PedidoCompra, Secretaria } from '@/types';

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

interface PedidosComprasIndexProps {
    pedidos: {
        data: PedidoCompra[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    secretarias: Secretaria[];
    filters: {
        search?: string;
        status?: string;
        secretaria_id?: string;
        prioridade?: string;
    };
    is_gestor_compras: boolean;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Pedidos de Compra',
        href: pedidosCompras.index(),
    },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Todos os status' },
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'pendente_aprovacao', label: 'Pendente de Aprovação' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'rejeitado', label: 'Rejeitado' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'em_execucao', label: 'Em Execução' },
    { value: 'concluido', label: 'Concluído' },
];

const PRIORIDADE_OPTIONS = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'baixa', label: 'Baixa' },
    { value: 'normal', label: 'Normal' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
];

const MESSAGES = {
    noResults: 'Nenhum pedido encontrado com os filtros aplicados',
    noData: 'Nenhum pedido cadastrado',
    searchPlaceholder: 'Buscar por número, título ou secretaria...',
    allSecretarias: 'Todas as secretarias',
    noValue: '-',
    confirmDelete: 'Tem certeza que deseja excluir este pedido?',
    cannotDelete: 'Este pedido não pode ser excluído.',
    approveSuccess: 'Pedido aprovado com sucesso!',
    rejectSuccess: 'Pedido rejeitado com sucesso!',
    cancelSuccess: 'Pedido cancelado com sucesso!',
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
        case 'aprovado':
            return <CheckCircle className="h-4 w-4" />;
        case 'rejeitado':
        case 'cancelado':
            return <XCircle className="h-4 w-4" />;
        case 'pendente_aprovacao':
            return <Clock className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
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
                <FileText className="h-12 w-12 text-gray-400" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{isFiltered ? MESSAGES.noResults : MESSAGES.noData}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {isFiltered
                            ? 'Tente ajustar os filtros para encontrar o que procura.'
                            : 'Clique em "Novo Pedido" para começar a criar pedidos de compra.'}
                    </p>
                </div>
                {!isFiltered && (
                    <Button asChild>
                        <Link href={pedidosCompras.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Pedido
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

interface PedidoRowProps {
    pedido: PedidoCompra & {
        secretaria?: { id: number; nome: string; sigla: string } | null;
        fornecedor?: { id: number; razao_social: string } | null;
        usuario_solicitante?: { id: number; name: string } | null;
        usuario_autorizador?: { id: number; name: string } | null;
        status_display?: string;
        status_color?: string;
        prioridade_display?: string;
        prioridade_color?: string;
        pode_editar?: boolean;
        pode_aprovar?: boolean;
        pode_rejeitar?: boolean;
        pode_cancelar?: boolean;
        total_items?: number;
    };
    isGestorCompras: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onCancel: (id: number) => void;
    onDelete: (id: number) => void;
}

function PedidoRow({ pedido, isGestorCompras, onApprove, onReject, onCancel, onDelete }: PedidoRowProps) {
    const handleApprove = () => {
        if (confirm('Deseja aprovar este pedido?')) {
            onApprove(pedido.id);
        }
    };

    const handleReject = () => {
        const motivo = prompt('Qual o motivo da rejeição?');
        if (motivo) {
            router.post(pedidosCompras.rejeitar(pedido.id), { motivo });
        }
    };

    const handleCancel = () => {
        const motivo = prompt('Qual o motivo do cancelamento?');
        if (motivo) {
            router.post(pedidosCompras.cancelar(pedido.id), { motivo });
        }
    };

    const handleDelete = () => {
        if (confirm(MESSAGES.confirmDelete)) {
            onDelete(pedido.id);
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{pedido.numero_pedido}</TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{pedido.titulo}</p>
                    <p className="text-sm text-gray-500">{pedido.secretaria?.nome || MESSAGES.noValue}</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {getStatusIcon(pedido.status)}
                    <Badge className={pedido.status_color}>{pedido.status_display || pedido.status}</Badge>
                </div>
            </TableCell>
            <TableCell>
                <Badge className={pedido.prioridade_color}>{pedido.prioridade_display || pedido.prioridade}</Badge>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>{formatCurrency(pedido.valor_total_estimado)}</p>
                    <p className="text-gray-500">{pedido.total_items} item(s)</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>{pedido.data_solicitacao}</p>
                    {pedido.data_necessidade && <p className="text-gray-500">Necessidade: {pedido.data_necessidade}</p>}
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p className="font-medium">{pedido.usuario_solicitante?.name || MESSAGES.noValue}</p>
                    {pedido.usuario_autorizador && <p className="text-gray-500">Por: {pedido.usuario_autorizador.name}</p>}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Link href={pedidosCompras.show(pedido.id)}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>

                    {pedido.pode_editar && (
                        <Link href={pedidosCompras.edit(pedido.id)}>
                            <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    {isGestorCompras && pedido.pode_aprovar && (
                        <Button variant="ghost" size="sm" onClick={handleApprove} className="text-green-600 hover:text-green-700">
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}

                    {isGestorCompras && pedido.pode_rejeitar && (
                        <Button variant="ghost" size="sm" onClick={handleReject} className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}

                    {pedido.pode_cancelar && (
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-orange-600 hover:text-orange-700">
                            <Clock className="h-4 w-4" />
                        </Button>
                    )}

                    {pedido.pode_editar && (
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

// Main Component
export default function PedidosComprasIndex({ pedidos: pedidosPaginados, secretarias, filters, is_gestor_compras }: PedidosComprasIndexProps) {
    // Safe data extraction
    const safePedidos = pedidosPaginados || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safePedidos.data || [];
    const safeLinks = safePedidos.links || [];
    const safeMeta = safePedidos.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeSecretarias = secretarias || [];

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        secretaria_id: filters?.secretaria_id || '',
        prioridade: filters?.prioridade || '',
    });

    // Memoized values
    const isFiltered = useMemo(() => Boolean(data.search || data.status || data.secretaria_id || data.prioridade), [data]);
    const hasResults = useMemo(() => safeData.length > 0, [safeData.length]);

    // Event handlers
    const handleSearch: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            get(pedidosCompras.index(), {
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
                secretaria_id: '',
                prioridade: '',
            });
            get(pedidosCompras.index(), {
                preserveState: true,
                replace: true,
            });
        },
        [setData, get]
    );

    const handleDelete = useMemo(
        () => (id: number) => {
            router.delete(pedidosCompras.destroy(id));
        },
        []
    );

    const handleApprove = useMemo(
        () => (id: number) => {
            router.post(pedidosCompras.aprovar(id));
        },
        []
    );

    const handleReject = useMemo(
        () => (id: number) => {
            router.post(pedidosCompras.rejeitar(id));
        },
        []
    );

    const handleCancel = useMemo(
        () => (id: number) => {
            router.post(pedidosCompras.cancelar(id));
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
            <Head title="Pedidos de Compra" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pedidos de Compra</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os pedidos de compra e aprovações</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {is_gestor_compras && (
                            <Button variant="outline" asChild>
                                <Link href={pedidosCompras.pendentesAprovacao()}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Pedidos Pendentes
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={pedidosCompras.create()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Pedido
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
                                    value={data.secretaria_id}
                                    onChange={(e) => setData('secretaria_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">{MESSAGES.allSecretarias}</option>
                                    {safeSecretarias.map((secretaria) => (
                                        <option key={secretaria.id} value={secretaria.id}>
                                            {secretaria.sigla} - {secretaria.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="min-w-[200px]">
                                <select
                                    value={data.prioridade}
                                    onChange={(e) => setData('prioridade', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {PRIORIDADE_OPTIONS.map((option) => (
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
                        <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
                        <CardDescription>
                            Mostrando {safeData.length} de {safeMeta.total || 0} pedidos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasResults ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Número</TableHead>
                                            <TableHead>Título / Secretaria</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Prioridade</TableHead>
                                            <TableHead>Valor Total</TableHead>
                                            <TableHead>Datas</TableHead>
                                            <TableHead>Responsáveis</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safeData.map((pedido) => (
                                            <PedidoRow
                                                key={pedido.id}
                                                pedido={pedido}
                                                isGestorCompras={is_gestor_compras}
                                                onApprove={handleApprove}
                                                onReject={handleReject}
                                                onCancel={handleCancel}
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
