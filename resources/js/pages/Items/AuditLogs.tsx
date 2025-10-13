import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Eye, Lock, Search, Shield, User } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { items } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// Types
interface AuditLog {
    id: number;
    action: string;
    action_display: string;
    field_changed: string | null;
    field_display: string | null;
    old_value: string | null;
    new_value: string | null;
    context_type: string | null;
    context_id: number | null;
    user: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    user_ip: string;
}

interface ItemData {
    id: number;
    codigo: string;
    descricao: string;
    is_frozen: boolean;
    frozen_at: string | null;
    frozen_by_user: string | null;
    usage_stats: {
        contratos_count: number;
        pedidos_count: number;
        requisicoes_count: number;
        total_usages: number;
        first_used_at: string | null;
        last_used_at: string | null;
    };
}

interface ItemsAuditLogsProps {
    item: ItemData;
    logs: AuditLog[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Itens',
        href: items.index(),
    },
    {
        title: 'Logs de Auditoria',
        href: '#',
    },
];

const MESSAGES = {
    back: 'Voltar',
    itemDetails: 'Ver Item',
    auditLogs: 'Logs de Auditoria',
    itemInfo: 'Informações do Item',
    itemCode: 'Código',
    description: 'Descrição',
    status: 'Status',
    frozen: 'Congelado',
    active: 'Ativo',
    usageStats: 'Estatísticas de Uso',
    contracts: 'Contratos',
    purchaseOrders: 'Pedidos de Compra',
    requisitions: 'Requisições',
    totalUsage: 'Total de Usos',
    firstUse: 'Primeiro Uso',
    lastUse: 'Último Uso',
    frozenAt: 'Congelado em',
    frozenBy: 'Congelado por',
    actionHistory: 'Histórico de Ações',
    date: 'Data',
    user: 'Usuário',
    action: 'Ação',
    field: 'Campo',
    oldValue: 'Valor Anterior',
    newValue: 'Novo Valor',
    context: 'Contexto',
    ipAddress: 'Endereço IP',
    noLogs: 'Nenhum log encontrado',
    noChanges: 'Sem alterações',
    notFrozen: 'Não congelado',
    neverUsed: 'Nunca utilizado',
};

const ACTION_COLORS = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    frozen: 'bg-red-100 text-red-800',
    attempted_update: 'bg-orange-100 text-orange-800',
};

// Utility Functions
const formatValue = (value: string | null): string => {
    if (!value) return MESSAGES.noChanges;
    if (value.length > 100) return value.substring(0, 100) + '...';
    return value;
};

const getActionIcon = (action: string) => {
    switch (action) {
        case 'created':
            return <Eye className="h-4 w-4" />;
        case 'updated':
            return <Search className="h-4 w-4" />;
        case 'frozen':
            return <Lock className="h-4 w-4" />;
        case 'attempted_update':
            return <Shield className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

// Components
interface UsageStatsCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
}

function UsageStatsCard({ title, value, icon: Icon }: UsageStatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

interface AuditLogRowProps {
    log: AuditLog;
}

function AuditLogRow({ log }: AuditLogRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    <Badge className={ACTION_COLORS[log.action as keyof typeof ACTION_COLORS]}>{log.action_display}</Badge>
                </div>
            </TableCell>
            <TableCell>
                {log.field_display ? <Badge variant="outline">{log.field_display}</Badge> : <span className="text-gray-500">-</span>}
            </TableCell>
            <TableCell className="max-w-xs">
                <div className="space-y-1">
                    {log.old_value && (
                        <div className="text-sm">
                            <span className="text-red-600 line-through">{formatValue(log.old_value)}</span>
                        </div>
                    )}
                    {log.new_value && (
                        <div className="text-sm">
                            <span className="text-green-600">{formatValue(log.new_value)}</span>
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    {log.user ? (
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{log.user.name}</span>
                        </div>
                    ) : (
                        <span className="text-gray-500">Sistema</span>
                    )}
                    <div className="text-xs text-gray-500">{log.user_ip}</div>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    {log.context_type ? (
                        <Badge variant="outline">
                            {log.context_type} #{log.context_id}
                        </Badge>
                    ) : (
                        <span className="text-gray-500">-</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-sm">
                <div>
                    <div>{log.created_at}</div>
                    {log.field_changed === 'descricao' && <div className="text-xs text-orange-600 font-medium">Alteração de descrição</div>}
                </div>
            </TableCell>
        </TableRow>
    );
}

// Main Component
export default function ItemsAuditLogs({ item, logs, pagination }: ItemsAuditLogsProps) {
    const totalLogs = pagination.total;

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`Logs de Auditoria - ${item.codigo}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={items.show(item.id)}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {MESSAGES.back}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{MESSAGES.auditLogs}</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {item.codigo} - {item.descricao}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={items.show(item.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {MESSAGES.itemDetails}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Item Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>{MESSAGES.itemInfo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.itemCode}</p>
                                    <p className="font-medium">{item.codigo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.description}</p>
                                    <p className="font-medium">{item.descricao}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.status}</p>
                                    <div className="flex items-center space-x-2">
                                        {item.is_frozen ? (
                                            <>
                                                <Lock className="h-4 w-4 text-red-500" />
                                                <Badge className="bg-red-100 text-red-800">{MESSAGES.frozen}</Badge>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 text-green-500" />
                                                <Badge className="bg-green-100 text-green-800">{MESSAGES.active}</Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.totalUsage}</p>
                                    <p className="font-medium">{item.usage_stats.total_usages}</p>
                                </div>
                            </div>

                            {item.is_frozen && (
                                <div className="p-4 bg-red-50 rounded-md">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Lock className="h-4 w-4 text-red-500" />
                                        <p className="text-sm font-medium text-red-900">{MESSAGES.frozen}</p>
                                    </div>
                                    <div className="text-sm text-red-700">
                                        <p>
                                            {MESSAGES.frozenAt}: {item.frozen_at || MESSAGES.noChanges}
                                        </p>
                                        <p>
                                            {MESSAGES.frozenBy}: {item.frozen_by_user || MESSAGES.noChanges}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Usage Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{MESSAGES.usageStats}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <UsageStatsCard
                                title={MESSAGES.contracts}
                                value={item.usage_stats.contratos_count}
                                icon={() => <div className="h-4 w-4 bg-blue-500 rounded" />}
                            />
                            <UsageStatsCard
                                title={MESSAGES.purchaseOrders}
                                value={item.usage_stats.pedidos_count}
                                icon={() => <div className="h-4 w-4 bg-green-500 rounded" />}
                            />
                            <UsageStatsCard
                                title={MESSAGES.requisitions}
                                value={item.usage_stats.requisicoes_count}
                                icon={() => <div className="h-4 w-4 bg-orange-500 rounded" />}
                            />
                            <UsageStatsCard
                                title={MESSAGES.totalUsage}
                                value={item.usage_stats.total_usages}
                                icon={() => <div className="h-4 w-4 bg-purple-500 rounded" />}
                            />

                            <div className="pt-4 border-t space-y-2">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">{MESSAGES.firstUse}</p>
                                    <p className="text-gray-600">{item.usage_stats.first_used_at || MESSAGES.neverUsed}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">{MESSAGES.lastUse}</p>
                                    <p className="text-gray-600">{item.usage_stats.last_used_at || MESSAGES.neverUsed}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Audit Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{MESSAGES.actionHistory}</CardTitle>
                        <CardDescription>
                            Mostrando {logs.length} de {totalLogs} registros
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logs.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{MESSAGES.action}</TableHead>
                                            <TableHead>{MESSAGES.field}</TableHead>
                                            <TableHead>Alterações</TableHead>
                                            <TableHead>{MESSAGES.user}</TableHead>
                                            <TableHead>{MESSAGES.context}</TableHead>
                                            <TableHead>{MESSAGES.date}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <AuditLogRow key={log.id} log={log} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">{MESSAGES.noLogs}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
