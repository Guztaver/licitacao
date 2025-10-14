import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    Edit2,
    Eye,
    FileText,
    Plus,
    Search,
    Trash2,
    AlertTriangle,
    Play,
    Square,
    Package,
    DollarSign,
    Calendar,
    User,
    XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// Types
interface BiddingProcess {
    id: number;
    title: string;
    status: string;
    consolidated_items: Array<{
        itemDescription: string;
        unitOfMeasure: string;
        totalQuantity: number;
        sourceRequestIds: number[];
        valorUnitarioEstimado: number;
        especificacoes?: string;
    }>;
    created_by: number;
    observations: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    purchase_requests?: Array<{
        id: number;
        title: string;
        description: string;
        status: string;
        estimated_total: number;
        secretaria?: {
            id: number;
            nome: string;
            sigla: string;
        };
        user?: {
            id: number;
            name: string;
        };
        created_at: string;
        status_history?: Array<{
            status: string;
            changed_at: string;
            comment: string;
        }>;
    }>;
}

// Utility Functions
const formatCurrency = (value: number | null | undefined) => {
    if (!value || value === 0) return '-';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const getStatusDisplayText = (status: string): string => {
    const statusMap: Record<string, string> = {
        draft: 'Rascunho',
        opened: 'Aberto',
        closed: 'Encerrado',
        cancelled: 'Cancelado',
    };
    return statusMap[status] || status;
};

const getStatusBadgeColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        draft: 'secondary',
        opened: 'default',
        closed: 'outline',
        cancelled: 'destructive',
    };
    return colorMap[status] || 'secondary';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'opened':
            return <Play className="h-5 w-5 text-green-600" />;
        case 'closed':
            return <Square className="h-5 w-5 text-blue-600" />;
        case 'cancelled':
            return <XCircle className="h-5 w-5 text-red-600" />;
        default:
            return <FileText className="h-5 w-5 text-gray-600" />;
    }
};

// Constants
const getBreadcrumbs = (id: number): BreadcrumbItem[] => [
    {
        title: 'Processos Licitatórios',
        href: '/bidding-processes',
    },
    {
        title: `Processo #${id}`,
        href: `/bidding-processes/${id}`,
    },
];

// Components
interface ConsolidatedItemRowProps {
    item: BiddingProcess['consolidated_items'][0];
    index: number;
}

function ConsolidatedItemRow({ item, index }: ConsolidatedItemRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{item.itemDescription}</p>
                    {item.especificacoes && <p className="text-sm text-gray-500 mt-1">{item.especificacoes}</p>}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{item.unitOfMeasure}</Badge>
            </TableCell>
            <TableCell className="text-center">
                <span className="font-medium">{item.totalQuantity.toLocaleString('pt-BR')}</span>
            </TableCell>
            <TableCell className="text-right">{formatCurrency(item.valorUnitarioEstimado)}</TableCell>
            <TableCell className="text-right">{formatCurrency(item.totalQuantity * item.valorUnitarioEstimado)}</TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1">
                    {item.sourceRequestIds.map((requestId) => (
                        <Link key={requestId} href={`/purchase-requests/${requestId}`}>
                            <Badge variant="secondary" className="text-xs">
                                #{requestId}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </TableCell>
        </TableRow>
    );
}

interface SourceRequestCardProps {
    request: BiddingProcess['purchase_requests'][0];
}

function SourceRequestCard({ request }: SourceRequestCardProps) {
    const statusHistory = request.status_history || [];
    const lastStatusChange = statusHistory[statusHistory.length - 1];

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base">{request.title}</CardTitle>
                        <CardDescription className="mt-1">{request.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        #{request.id}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Secretaria</p>
                        <p className="font-medium">{request.secretaria?.sigla || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Valor Estimado</p>
                        <p className="font-medium">{formatCurrency(request.estimated_total)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Criado por</p>
                        <p className="font-medium">{request.user?.name || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Data</p>
                        <p className="font-medium">{new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {lastStatusChange && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-500">Última alteração:</p>
                        <p className="text-gray-700">
                            <strong>{getStatusDisplayText(lastStatusChange.status)}</strong> - {lastStatusChange.comment}
                        </p>
                        <p className="text-gray-500 text-xs">{new Date(lastStatusChange.changed_at).toLocaleString('pt-BR')}</p>
                    </div>
                )}

                <div className="mt-3 flex justify-end">
                    <Link href={`/purchase-requests/${request.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Pedido
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

// Main Component
export default function BiddingProcessShow({ process }: { process: BiddingProcess }) {
    const [isLoading, setIsLoading] = useState(false);

    // Calculate totals
    const totalItems = process.consolidated_items.length;
    const totalQuantity = process.consolidated_items.reduce((sum, item) => sum + item.totalQuantity, 0);
    const totalEstimatedValue = process.consolidated_items.reduce((sum, item) => sum + item.totalQuantity * item.valorUnitarioEstimado, 0);

    const handleStatusAction = async (newStatus: string) => {
        if (!confirm(`Tem certeza que deseja alterar o status para "${getStatusDisplayText(newStatus)}"?`)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/bidding-processes/${process.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ newStatus }),
            });

            const data = await response.json();

            if (data.success) {
                router.reload();
            } else {
                alert(data.message || 'Erro ao alterar status');
            }
        } catch (error) {
            console.error('Error changing status:', error);
            alert('Erro ao alterar status');
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailableActions = () => {
        const actions = [];

        if (process.status === 'draft') {
            actions.push({
                status: 'opened',
                label: 'Abrir Processo',
                description: 'Iniciar o processo licitatório',
                icon: <Play className="h-4 w-4" />,
                className: 'bg-green-600 hover:bg-green-700',
            });
        }

        if (process.status === 'opened') {
            actions.push({
                status: 'closed',
                label: 'Encerrar Processo',
                description: 'Finalizar o processo licitatório',
                icon: <Square className="h-4 w-4" />,
                className: 'bg-blue-600 hover:bg-blue-700',
            });
        }

        if (['draft', 'opened'].includes(process.status)) {
            actions.push({
                status: 'cancelled',
                label: 'Cancelar Processo',
                description: 'Cancelar o processo licitatório',
                icon: <XCircle className="h-4 w-4" />,
                className: 'bg-red-600 hover:bg-red-700',
            });
        }

        return actions;
    };

    const availableActions = getAvailableActions();

    return (
        <AppLayout breadcrumbs={getBreadcrumbs(process.id)}>
            <Head title={`Processo Licitatório #${process.id} - ${process.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" asChild>
                            <Link href="/bidding-processes">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Processo Licitatório #{process.id}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{process.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {availableActions.map((action) => (
                            <Button
                                key={action.status}
                                onClick={() => handleStatusAction(action.status)}
                                disabled={isLoading}
                                className={action.className}
                            >
                                {action.icon}
                                <span className="ml-2">{action.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Status and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                                {getStatusIcon(process.status)}
                                <span>Status</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge className={getStatusBadgeColor(process.status)} variant="outline">
                                {getStatusDisplayText(process.status)}
                            </Badge>
                            {process.observations && <p className="text-sm text-gray-600 mt-2">{process.observations}</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                <span>Estatísticas</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Itens Únicos:</span>
                                    <span className="font-medium">{totalItems}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Quantidade Total:</span>
                                    <span className="font-medium">{totalQuantity.toLocaleString('pt-BR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pedidos Origem:</span>
                                    <span className="font-medium">{process.purchase_requests?.length || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <span>Criação</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Responsável:</span>
                                    <span className="font-medium">{process.user?.name || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Data:</span>
                                    <span className="font-medium">{new Date(process.created_at).toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Value Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-amber-600" />
                            <span>Resumo de Valores</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
                                <div className="text-sm text-gray-600">Tipos de Item</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-900">{totalQuantity.toLocaleString('pt-BR')}</div>
                                <div className="text-sm text-blue-600">Unidades Totais</div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                <div className="text-2xl font-bold text-amber-900">{formatCurrency(totalEstimatedValue)}</div>
                                <div className="text-sm text-amber-600">Valor Estimado Total</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Consolidated Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Itens Consolidados</CardTitle>
                        <CardDescription>Itens agrupados a partir dos pedidos de compra origem</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {process.consolidated_items.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Nenhum item consolidado neste processo.</div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">#</TableHead>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Unidade</TableHead>
                                            <TableHead className="text-center">Quantidade</TableHead>
                                            <TableHead className="text-right">Valor Unit.</TableHead>
                                            <TableHead className="text-right">Valor Total</TableHead>
                                            <TableHead>Pedidos Origem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {process.consolidated_items.map((item, index) => (
                                            <ConsolidatedItemRow key={index} item={item} index={index} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Source Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos de Compra Origem</CardTitle>
                        <CardDescription>Pedidos que foram consolidados para criar este processo licitatório</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!process.purchase_requests || process.purchase_requests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Nenhum pedido de compra origem encontrado.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {process.purchase_requests.map((request) => (
                                    <SourceRequestCard key={request.id} request={request} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
