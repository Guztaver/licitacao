import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, DollarSign, Edit2, FileText, Plus, Send, Trash2, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { pedidosCompras } from '@/routes';
import type { BreadcrumbItem, PedidoCompra } from '@/types';

// Types
interface PedidosComprasShowProps {
    pedido: PedidoCompra & {
        secretaria?: { id: number; nome: string; sigla: string } | null;
        fornecedor?: { id: number; razao_social: string; cnpj_formatado: string } | null;
        contrato?: { id: number; numero_contrato: string } | null;
        usuario_solicitante?: { id: number; name: string; email: string } | null;
        usuario_autorizador?: { id: number; name: string; email: string } | null;
        items?: Array<{
            id: number;
            item?: { id: number; codigo: string; descricao: string } | null;
            descricao_material: string;
            quantidade_solicitada: number;
            quantidade_solicitada_formatada: string;
            unidade_medida: string;
            valor_unitario_estimado: number;
            valor_unitario_estimado_formatado: string;
            valor_total_estimado: number;
            valor_total_estimado_formatado: string;
            especificacoes: string | null;
            observacoes: string | null;
        }>;
    };
    is_gestor_compras: boolean;
    can_authorize: boolean;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Pedidos de Compra',
        href: pedidosCompras.index(),
    },
    {
        title: 'Detalhes do Pedido',
        href: '#',
    },
];

const MESSAGES = {
    back: 'Voltar',
    edit: 'Editar',
    sendForApproval: 'Enviar para Aprovação',
    approve: 'Aprovar',
    reject: 'Rejeitar',
    cancel: 'Cancelado',
    cancelOrder: 'Cancelar Pedido',
    deleteOrder: 'Excluir Pedido',
    orderNumber: 'Número do Pedido',
    department: 'Secretaria',
    supplier: 'Fornecedor',
    contract: 'Contrato Vinculado',
    requestDate: 'Data da Solicitação',
    necessityDate: 'Data da Necessidade',
    priority: 'Prioridade',
    status: 'Status',
    description: 'Descrição',
    justification: 'Justificativa',
    observations: 'Observações',
    items: 'Itens do Pedido',
    item: 'Item',
    quantity: 'Quantidade',
    unitValue: 'Valor Unitário',
    totalValue: 'Valor Total',
    specifications: 'Especificações',
    itemObservations: 'Observações',
    requester: 'Solicitante',
    authorizer: 'Autorizador',
    rejectionReason: 'Motivo da Rejeição',
    approvalDate: 'Data de Aprovação',
    rejectionDate: 'Data da Rejeição',
    estimatedTotal: 'Valor Total Estimado',
    confirmApprove: 'Deseja aprovar este pedido?',
    confirmReject: 'Deseja rejeitar este pedido?',
    confirmCancel: 'Deseja cancelar este pedido?',
    confirmDelete: 'Deseja excluir este pedido?',
    enterRejectionReason: 'Digite o motivo da rejeição',
    enterCancellationReason: 'Digite o motivo do cancelamento',
    noItems: 'Nenhum item no pedido',
    noDescription: 'Não informada',
    noJustification: 'Não informada',
    noObservations: 'Não informadas',
    noSpecifications: 'Não informadas',
    noItemObservations: 'Não informadas',
    noRejectionReason: 'Não informado',
    noContract: 'Sem contrato',
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
    draft: 'Rascunho',
    pendingApproval: 'Pendente de Aprovação',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
    inExecution: 'Em Execução',
    completed: 'Concluído',
};

// Utility Functions
const formatCurrency = (value: number | null | undefined) => {
    if (!value || value === 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'aprovado':
            return <CheckCircle className="h-4 w-4" />;
        case 'rejeitado':
        case 'cancelado':
            return <XCircle className="h-4 w-4" />;
        case 'pendente_aprovacao':
            return <Calendar className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

// Components
interface ActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'outline' | 'destructive' | 'ghost';
    children: React.ReactNode;
}

function ActionButton({ onClick, disabled = false, variant = 'default', children }: ActionButtonProps) {
    return (
        <Button variant={variant} size="sm" onClick={onClick} disabled={disabled}>
            {children}
        </Button>
    );
}

interface RejectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (motivo: string) => void;
    title: string;
    description: string;
    placeholder: string;
}

function RejectDialog({ isOpen, onClose, onConfirm, title, description, placeholder }: RejectDialogProps) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = () => {
        if (motivo.trim()) {
            onConfirm(motivo);
            setMotivo('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="motivo">{MESSAGES.rejectionReason}</Label>
                        <Textarea id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder={placeholder} rows={3} />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={!motivo.trim()}>
                            Confirmar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface PedidoItemRowProps {
    item: any;
}

function PedidoItemRow({ item }: PedidoItemRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {item.item && <Badge variant="outline">{item.item.codigo}</Badge>}
                    <div>
                        <p className="font-medium">{item.descricao_material}</p>
                        <p className="text-sm text-gray-500">
                            {item.item?.descricao && item.item.descricao !== item.descricao_material && <>Original: {item.item.descricao}</>}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div>
                    <p className="font-medium">{item.quantidade_solicitada_formatada}</p>
                    <p className="text-sm text-gray-500">{item.unidade_medida}</p>
                </div>
            </TableCell>
            <TableCell className="text-right">{formatCurrency(item.valor_unitario_estimado)}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(item.valor_total_estimado)}</TableCell>
            <TableCell className="max-w-xs">
                <p className="text-sm truncate" title={item.especificacoes || ''}>
                    {item.especificacoes || MESSAGES.noSpecifications}
                </p>
            </TableCell>
            <TableCell className="max-w-xs">
                <p className="text-sm truncate" title={item.observacoes || ''}>
                    {item.observacoes || MESSAGES.noItemObservations}
                </p>
            </TableCell>
        </TableRow>
    );
}

// Main Component
export default function PedidosComprasShow({ pedido, is_gestor_compras, can_authorize }: PedidosComprasShowProps) {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const handleSendForApproval = () => {
        if (confirm('Deseja enviar este pedido para aprovação?')) {
            router.post(pedidosCompras.enviarParaAprovacao(pedido.id));
        }
    };

    const handleApprove = () => {
        if (confirm(MESSAGES.confirmApprove)) {
            router.post(pedidosCompras.aprovar(pedido.id));
        }
    };

    const handleReject = (motivo: string) => {
        router.post(pedidosCompras.rejeitar(pedido.id), { motivo });
    };

    const handleCancel = (motivo: string) => {
        router.post(pedidosCompras.cancelar(pedido.id), { motivo });
    };

    const handleDelete = () => {
        if (confirm(MESSAGES.confirmDelete)) {
            router.delete(pedidosCompras.destroy(pedido.id));
        }
    };

    const items = pedido.items || [];

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`Pedido ${pedido.numero_pedido}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Status Alert */}
                {pedido.status === 'pendente_aprovacao' && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                        <Calendar className="h-4 w-4" />
                        <AlertDescription className="text-yellow-800">
                            <strong>Pedido aguardando aprovação</strong> - Este pedido foi enviado para análise e está pendente de aprovação pelo
                            gestor de compras.
                        </AlertDescription>
                    </Alert>
                )}

                {pedido.status === 'rejeitado' && pedido.motivo_rejeicao && (
                    <Alert className="bg-red-50 border-red-200">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                            <strong>Pedido rejeitado</strong> - Motivo: {pedido.motivo_rejeicao}
                        </AlertDescription>
                    </Alert>
                )}

                {pedido.status === 'aprovado' && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                            <strong>Pedido aprovado</strong> - Este pedido foi aprovado e pode ser executado.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={pedidosCompras.index()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {MESSAGES.back}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {MESSAGES.orderNumber} {pedido.numero_pedido}
                            </h1>
                            <div className="flex items-center space-x-2 mt-1">
                                {getStatusIcon(pedido.status)}
                                <Badge className={pedido.status_color}>{pedido.status_display || pedido.status}</Badge>
                                <Badge className={pedido.prioridade_color}>{pedido.prioridade_display || pedido.prioridade}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Edit Button - Only for draft/rejected */}
                        {pedido.pode_editar && (
                            <Button variant="outline" asChild>
                                <Link href={pedidosCompras.edit(pedido.id)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    {MESSAGES.edit}
                                </Link>
                            </Button>
                        )}

                        {/* Send for Approval - Only for draft */}
                        {pedido.pode_enviar_aprovacao && (
                            <ActionButton onClick={handleSendForApproval}>
                                <Send className="mr-2 h-4 w-4" />
                                {MESSAGES.sendForApproval}
                            </ActionButton>
                        )}

                        {/* Approve Button - Only for managers */}
                        {is_gestor_compras && pedido.pode_aprovar && (
                            <ActionButton onClick={handleApprove} variant="default">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {MESSAGES.approve}
                            </ActionButton>
                        )}

                        {/* Reject Button - Only for managers */}
                        {is_gestor_compras && pedido.pode_rejeitar && (
                            <ActionButton onClick={() => setRejectDialogOpen(true)} variant="destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                {MESSAGES.reject}
                            </ActionButton>
                        )}

                        {/* Cancel Button */}
                        {pedido.pode_cancelar && (
                            <ActionButton onClick={() => setCancelDialogOpen(true)} variant="outline">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {MESSAGES.cancelOrder}
                            </ActionButton>
                        )}

                        {/* Delete Button - Only for draft/rejected */}
                        {pedido.pode_editar && (
                            <ActionButton onClick={handleDelete} variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {MESSAGES.deleteOrder}
                            </ActionButton>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Informações do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.department}</p>
                                    <p className="font-medium">
                                        {pedido.secretaria ? `${pedido.secretaria.sigla} - ${pedido.secretaria.nome}` : MESSAGES.noDescription}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.supplier}</p>
                                    <p className="font-medium">
                                        {pedido.fornecedor ? (
                                            <>
                                                {pedido.fornecedor.razao_social}
                                                {pedido.fornecedor.cnpj_formatado && (
                                                    <p className="text-sm text-gray-500">{pedido.fornecedor.cnpj_formatado}</p>
                                                )}
                                            </>
                                        ) : (
                                            MESSAGES.noDescription
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.contract}</p>
                                    <p className="font-medium">{pedido.contrato ? pedido.contrato.numero_contrato : MESSAGES.noContract}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.priority}</p>
                                    <Badge className={pedido.prioridade_color}>{pedido.prioridade_display || pedido.prioridade}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.requestDate}</p>
                                    <p className="font-medium">{pedido.data_solicitacao}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.necessityDate}</p>
                                    <p className="font-medium">{pedido.data_necessidade || MESSAGES.noDescription}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">{MESSAGES.description}</p>
                                <p className="text-gray-700">{pedido.descricao}</p>
                            </div>

                            {pedido.justificativa && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.justification}</p>
                                    <p className="text-gray-700">{pedido.justificativa}</p>
                                </div>
                            )}

                            {pedido.observacoes && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.observations}</p>
                                    <p className="text-gray-700">{pedido.observacoes}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.requester}</p>
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{pedido.usuario_solicitante?.name || 'Sistema'}</p>
                                            {pedido.usuario_solicitante?.email && (
                                                <p className="text-sm text-gray-500">{pedido.usuario_solicitante.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.authorizer}</p>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{pedido.usuario_autorizador?.name || 'Não autorizado'}</p>
                                            {pedido.usuario_autorizador?.email && (
                                                <p className="text-sm text-gray-500">{pedido.usuario_autorizador.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Approval/Rejection Dates */}
                            {(pedido.data_aprovacao || pedido.data_rejeicao) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                    {pedido.data_aprovacao && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{MESSAGES.approvalDate}</p>
                                            <p className="font-medium">{pedido.data_aprovacao}</p>
                                        </div>
                                    )}
                                    {pedido.data_rejeicao && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{MESSAGES.rejectionDate}</p>
                                            <p className="font-medium">{pedido.data_rejeicao}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-md">
                                <div className="text-sm">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-4 w-4" />
                                        <p className="font-medium text-blue-900">{MESSAGES.estimatedTotal}</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-900">{formatCurrency(pedido.valor_total_estimado)}</p>
                                    <p className="text-xs text-blue-700">{items.length} item(s) no pedido</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <Badge className={pedido.status_color}>{pedido.status_display || pedido.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Prioridade</span>
                                    <Badge className={pedido.prioridade_color}>{pedido.prioridade_display || pedido.prioridade}</Badge>
                                </div>
                            </div>

                            {pedido.motivo_rejeicao && (
                                <div className="p-3 bg-red-50 rounded-md">
                                    <p className="text-sm font-medium text-red-900">{MESSAGES.rejectionReason}</p>
                                    <p className="text-sm text-red-700">{pedido.motivo_rejeicao}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Items Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{MESSAGES.items}</CardTitle>
                        <CardDescription>
                            {items.length} item(s) • Valor total: {formatCurrency(pedido.valor_total_estimado)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{MESSAGES.item}</TableHead>
                                            <TableHead className="text-right">{MESSAGES.quantity}</TableHead>
                                            <TableHead className="text-right">{MESSAGES.unitValue}</TableHead>
                                            <TableHead className="text-right">{MESSAGES.totalValue}</TableHead>
                                            <TableHead>{MESSAGES.specifications}</TableHead>
                                            <TableHead>{MESSAGES.itemObservations}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <PedidoItemRow key={item.id} item={item} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">{MESSAGES.noItems}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Dialogs */}
                <RejectDialog
                    isOpen={rejectDialogOpen}
                    onClose={() => setRejectDialogOpen(false)}
                    onConfirm={handleReject}
                    title={MESSAGES.reject}
                    description={MESSAGES.confirmReject}
                    placeholder={MESSAGES.enterRejectionReason}
                />

                <RejectDialog
                    isOpen={cancelDialogOpen}
                    onClose={() => setCancelDialogOpen(false)}
                    onConfirm={handleCancel}
                    title={MESSAGES.cancelOrder}
                    description={MESSAGES.confirmCancel}
                    placeholder={MESSAGES.enterCancellationReason}
                />
            </div>
        </AppLayout>
    );
}
