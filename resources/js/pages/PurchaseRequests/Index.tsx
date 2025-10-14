import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock, Edit2, Eye, FileText, Plus, Search, Trash2, User, XCircle, AlertTriangle, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import ForwardToContractsModal from '@/components/ForwardToContractsModal';

// Types
interface PurchaseRequest {
    id: number;
    title: string;
    description: string;
    status: string;
    secretaria_id: number;
    user_id: number;
    estimated_total: number | null;
    approved_total: number | null;
    status_history: Array<{
        status: string;
        changed_by: number;
        changed_at: string;
        comment: string | null;
    }> | null;
    rejection_reason: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
    secretaria?: {
        id: number;
        nome: string;
        sigla: string;
    };
    available_actions?: Array<{
        status: string;
        label: string;
        description: string;
    }>;
}

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    purchaseRequest: PurchaseRequest | null;
    action: {
        status: string;
        label: string;
        description: string;
    } | null;
    onConfirm: (comment: string, rejectionReason?: string) => void;
    isLoading: boolean;
}

function StatusChangeModal({ isOpen, onClose, purchaseRequest, action, onConfirm, isLoading }: StatusChangeModalProps) {
    const [comment, setComment] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    if (!isOpen || !purchaseRequest || !action) return null;

    const handleConfirm = () => {
        if (action.status === 'rejected' && !rejectionReason.trim()) {
            alert('Por favor, informe o motivo da rejeição.');
            return;
        }
        onConfirm(comment, rejectionReason);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirmar Alteração de Status</h3>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Pedido: <span className="font-medium">{purchaseRequest.title}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Status atual: <span className="font-medium">{getStatusDisplayText(purchaseRequest.status)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Novo status: <span className="font-medium">{action.label}</span>
                    </p>
                </div>

                {action.status === 'rejected' ? (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da rejeição *</label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Descreva o motivo da rejeição..."
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentário (opcional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Adicione um comentário sobre esta alteração..."
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={action.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {isLoading ? 'Processando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
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
        price_research: 'Em Pesquisa de Preço',
        price_research_completed: 'Pesquisa de Preço Concluída',
        awaiting_contract_analysis: 'Aguardando Análise de Contrato',
        bidding: 'Em Licitação',
        awaiting_supply_authorization: 'Aguardando Autorização',
        approved: 'Aprovado',
        rejected: 'Rejeitado',
    };
    return statusMap[status] || status;
};

const getStatusBadgeColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        draft: 'secondary',
        price_research: 'default',
        price_research_completed: 'default',
        awaiting_contract_analysis: 'secondary',
        bidding: 'outline',
        awaiting_supply_authorization: 'secondary',
        approved: 'default',
        rejected: 'destructive',
    };
    return colorMap[status] || 'secondary';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="h-4 w-4" />;
        case 'rejected':
            return <XCircle className="h-4 w-4" />;
        case 'price_research':
        case 'bidding':
        case 'awaiting_supply_authorization':
            return <Clock className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Pedidos de Compra Simplificados',
        href: '/purchase-requests',
    },
];

const MESSAGES = {
    noResults: 'Nenhum pedido encontrado',
    noData: 'Nenhum pedido cadastrado',
    searchPlaceholder: 'Buscar por título ou secretaria...',
    confirmDelete: 'Tem certeza que deseja excluir este pedido?',
    cannotDelete: 'Este pedido não pode ser excluído.',
    statusChangeSuccess: 'Status alterado com sucesso!',
    statusChangeError: 'Erro ao alterar status. Tente novamente.',
    confirmAction: 'Tem certeza que deseja {action} este pedido?',
    forwardToContractsSuccess: 'Pedido encaminhado para o setor de contratos com sucesso!',
    forwardToContractsError: 'Erro ao encaminhar pedido para o setor de contratos. Tente novamente.',
};

// Components
interface EmptyStateProps {
    hasSearch: boolean;
}

function EmptyState({ hasSearch }: EmptyStateProps) {
    return (
        <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-900/20">
            <div className="flex flex-col items-center space-y-4 text-center">
                <FileText className="h-12 w-12 text-gray-400" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{hasSearch ? MESSAGES.noResults : MESSAGES.noData}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {hasSearch
                            ? 'Tente ajustar os filtros para encontrar o que procura.'
                            : 'Clique em "Novo Pedido" para começar a criar pedidos de compra.'}
                    </p>
                </div>
                {!hasSearch && (
                    <Button asChild>
                        <Link href="/purchase-requests/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Pedido
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

interface PurchaseRequestRowProps {
    purchaseRequest: PurchaseRequest;
    currentUserRole: string;
    onStatusChange: (id: number, newStatus: string, comment?: string, rejectionReason?: string) => void;
    onDelete: (id: number) => void;
    onForwardToContracts: (id: number) => void;
}

function PurchaseRequestRow({ purchaseRequest, currentUserRole, onStatusChange, onDelete, onForwardToContracts }: PurchaseRequestRowProps) {
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [modalAction, setModalAction] = useState<{
        status: string;
        label: string;
        description: string;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [isForwarding, setIsForwarding] = useState(false);

    const availableActions = purchaseRequest.available_actions || [];

    const handleActionClick = (action: (typeof availableActions)[0]) => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleModalConfirm = async (comment: string, rejectionReason?: string) => {
        setIsProcessing(true);
        try {
            await onStatusChange(purchaseRequest.id, modalAction!.status, comment, rejectionReason);
            setIsModalOpen(false);
            setModalAction(null);
        } catch (error) {
            console.error('Error changing status:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = () => {
        if (purchaseRequest.status !== 'draft') {
            alert(MESSAGES.cannotDelete);
            return;
        }

        if (confirm(MESSAGES.confirmDelete)) {
            onDelete(purchaseRequest.id);
        }
    };

    const handleForwardToContracts = () => {
        setShowForwardModal(true);
    };

    const handleForwardConfirm = async () => {
        setIsForwarding(true);
        try {
            await onForwardToContracts(purchaseRequest.id);
            setShowForwardModal(false);
        } catch (error) {
            console.error('Error forwarding to contracts:', error);
        } finally {
            setIsForwarding(false);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">#{purchaseRequest.id}</TableCell>
                <TableCell>
                    <div>
                        <p className="font-medium">{purchaseRequest.title}</p>
                        <p className="text-sm text-gray-500">{purchaseRequest.secretaria?.sigla || '-'}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        {getStatusIcon(purchaseRequest.status)}
                        <Badge className={getStatusBadgeColor(purchaseRequest.status)}>{getStatusDisplayText(purchaseRequest.status)}</Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <p>{formatCurrency(purchaseRequest.estimated_total)}</p>
                        {purchaseRequest.approved_total && (
                            <p className="text-green-600">Aprovado: {formatCurrency(purchaseRequest.approved_total)}</p>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <p>Criado: {new Date(purchaseRequest.created_at).toLocaleDateString('pt-BR')}</p>
                        <p className="text-gray-500">por {purchaseRequest.user?.name || '-'}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Link href={`/purchase-requests/${purchaseRequest.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>

                        {purchaseRequest.status === 'draft' && (
                            <>
                                <Link href={`/purchase-requests/${purchaseRequest.id}/edit`}>
                                    <Button variant="ghost" size="sm">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* Forward to Contracts Button - Only for price_research_completed status and authorized users */}
                        {purchaseRequest.status === 'price_research_completed' &&
                            ['admin', 'purchasing_manager', 'head_of_purchasing'].includes(currentUserRole) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleForwardToContracts}
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                    <Building2 className="h-4 w-4" />
                                </Button>
                            )}

                        {availableActions.length > 0 && (
                            <div className="relative">
                                <Button variant="ghost" size="sm" onClick={() => setShowActionMenu(!showActionMenu)}>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>

                                {showActionMenu && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                                        {availableActions.map((action) => (
                                            <button
                                                key={action.status}
                                                onClick={() => handleActionClick(action)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </TableCell>
            </TableRow>

            <StatusChangeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalAction(null);
                    setShowActionMenu(false);
                }}
                purchaseRequest={purchaseRequest}
                action={modalAction}
                onConfirm={handleModalConfirm}
                isLoading={isProcessing}
            />

            <ForwardToContractsModal
                isOpen={showForwardModal}
                onClose={() => setShowForwardModal(false)}
                purchaseRequest={purchaseRequest}
                onConfirm={handleForwardConfirm}
                isLoading={isForwarding}
            />
        </>
    );
}

// Main Component
export default function PurchaseRequestsIndex() {
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('operacional');

    // Simulate fetching data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API call - in production this would be a real API call
                // For now, let's simulate some data
                const mockData: PurchaseRequest[] = [
                    {
                        id: 1,
                        title: 'Test Purchase Request',
                        description: 'Test description',
                        status: 'bidding',
                        secretaria_id: 1,
                        user_id: 1,
                        estimated_total: 5000.0,
                        approved_total: null,
                        status_history: [
                            {
                                status: 'price_research',
                                changed_by: 1,
                                changed_at: '2025-10-13T16:57:56.035910Z',
                                comment: 'Encaminhando para pesquisa de preço',
                            },
                            {
                                status: 'bidding',
                                changed_by: 1,
                                changed_at: '2025-10-13T16:58:12.989971Z',
                                comment: 'Encaminhando para licitação',
                            },
                        ],
                        rejection_reason: null,
                        observations: null,
                        created_at: '2025-10-13T16:56:19.000000Z',
                        updated_at: '2025-10-13T16:58:12.000000Z',
                        user: {
                            id: 1,
                            name: 'Gustavo G Muniz dos Anjos',
                        },
                        secretaria: {
                            id: 1,
                            nome: 'Secretaria de Teste',
                            sigla: 'SEC-TEST',
                        },
                        available_actions: [
                            {
                                status: 'awaiting_supply_authorization',
                                label: 'Encaminhar para Autorização',
                                description: 'Solicitar autorização de fornecimento',
                            },
                            {
                                status: 'rejected',
                                label: 'Rejeitar',
                                description: 'Rejeitar pedido',
                            },
                        ],
                    },
                    {
                        id: 2,
                        title: 'Material de Escritório',
                        description: 'Compra de material de escritório para o departamento',
                        status: 'price_research_completed',
                        secretaria_id: 1,
                        user_id: 1,
                        estimated_total: 1500.0,
                        approved_total: null,
                        status_history: null,
                        rejection_reason: null,
                        observations: null,
                        created_at: '2025-10-13T17:00:00.000000Z',
                        updated_at: '2025-10-13T17:00:00.000000Z',
                        user: {
                            id: 1,
                            name: 'Maria Silva',
                        },
                        secretaria: {
                            id: 1,
                            nome: 'Secretaria de Teste',
                            sigla: 'SEC-TEST',
                        },
                        items: [
                            {
                                id: 1,
                                descricao_material: 'Papel A4',
                                quantidade_solicitada: 10,
                                unidade_medida: 'resma',
                                valor_total_estimado: 250.0,
                            },
                            {
                                id: 2,
                                descricao_material: 'Canetas esferográficas',
                                quantidade_solicitada: 50,
                                unidade_medida: 'unidade',
                                valor_total_estimado: 75.0,
                            },
                        ],
                        available_actions: [
                            {
                                status: 'awaiting_contract_analysis',
                                label: 'Encaminhar para Contratos',
                                description: 'Encaminhar para análise do setor de contratos',
                            },
                            {
                                status: 'in_bidding_process',
                                label: 'Encaminhar para Licitação',
                                description: 'Iniciar processo licitatório',
                            },
                            {
                                status: 'rejected',
                                label: 'Rejeitar',
                                description: 'Rejeitar pedido',
                            },
                        ],
                    },
                ];

                // Simulate loading delay
                setTimeout(() => {
                    setPurchaseRequests(mockData);
                    setIsLoading(false);
                }, 1000);
            } catch (err) {
                setError('Erro ao carregar os pedidos');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Simulate getting current user role
    useEffect(() => {
        // In production, this would come from the authenticated user
        setCurrentUserRole('purchasing_manager'); // Change this to test different roles
    }, []);

    const handleStatusChange = async (id: number, newStatus: string, comment?: string, rejectionReason?: string) => {
        try {
            // Simulate API call
            console.log('Changing status:', { id, newStatus, comment, rejectionReason });

            // Update local state optimistically
            setPurchaseRequests((prev) =>
                prev.map((pr) => {
                    if (pr.id === id) {
                        const updatedPr = {
                            ...pr,
                            status: newStatus,
                            status_history: [
                                ...(pr.status_history || []),
                                {
                                    status: newStatus,
                                    changed_by: 1, // Current user ID
                                    changed_at: new Date().toISOString(),
                                    comment: comment || null,
                                },
                            ],
                        };

                        // Calculate new available actions based on new status
                        const newActions = calculateAvailableActions(newStatus, currentUserRole);
                        updatedPr.available_actions = newActions;

                        return updatedPr;
                    }
                    return pr;
                })
            );

            alert(MESSAGES.statusChangeSuccess);
        } catch (error) {
            console.error('Error changing status:', error);
            alert(MESSAGES.statusChangeError);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            // Simulate API call
            console.log('Deleting request:', id);
            setPurchaseRequests((prev) => prev.filter((pr) => pr.id !== id));
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const handleForwardToContracts = async (id: number) => {
        try {
            const response = await fetch(`/api/purchase-requests/${id}/forward-to-contracts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setPurchaseRequests((prev) =>
                    prev.map((pr) => {
                        if (pr.id === id) {
                            return {
                                ...pr,
                                status: 'awaiting_contract_analysis',
                                contract_draft_id: data.data.contractDraft.id,
                            };
                        }
                        return pr;
                    })
                );
                alert(MESSAGES.forwardToContractsSuccess);
            } else {
                alert(data.message || MESSAGES.forwardToContractsError);
            }
        } catch (error) {
            console.error('Error forwarding to contracts:', error);
            alert(MESSAGES.forwardToContractsError);
        }
    };

    // Helper function to calculate available actions (simulates backend logic)
    const calculateAvailableActions = (status: string, userRole: string) => {
        const actions = [];

        // This mirrors the backend logic
        const validTransitions: Record<string, string[]> = {
            draft: ['price_research', 'rejected'],
            price_research: ['bidding', 'rejected'],
            bidding: ['awaiting_supply_authorization', 'rejected'],
            awaiting_supply_authorization: ['approved', 'rejected'],
            approved: [],
            rejected: [],
        };

        const rolePermissions: Record<string, Record<string, string[]>> = {
            draft: {
                price_research: ['purchasing_agent', 'purchasing_manager', 'head_of_purchasing', 'admin'],
                rejected: ['purchasing_manager', 'head_of_purchasing', 'admin'],
            },
            price_research: {
                bidding: ['purchasing_manager', 'head_of_purchasing', 'admin'],
                rejected: ['purchasing_manager', 'head_of_purchasing', 'admin'],
            },
            bidding: {
                awaiting_supply_authorization: ['head_of_purchasing', 'admin'],
                rejected: ['head_of_purchasing', 'admin'],
            },
            awaiting_supply_authorization: {
                approved: ['head_of_purchasing', 'admin'],
                rejected: ['head_of_purchasing', 'admin'],
            },
        };

        const validNextStates = validTransitions[status] || [];

        for (const nextState of validNextStates) {
            const allowedRoles = rolePermissions[status]?.[nextState] || [];
            if (allowedRoles.includes(userRole)) {
                actions.push({
                    status: nextState,
                    label: getActionLabel(nextState),
                    description: getActionDescription(nextState),
                });
            }
        }

        return actions;
    };

    const getActionLabel = (status: string): string => {
        const labels: Record<string, string> = {
            price_research: 'Encaminhar para Pesquisa de Preço',
            bidding: 'Encaminhar para Licitação',
            awaiting_supply_authorization: 'Encaminhar para Autorização',
            approved: 'Aprovar',
            rejected: 'Rejeitar',
        };
        return labels[status] || 'Atualizar Status';
    };

    const getActionDescription = (status: string): string => {
        const descriptions: Record<string, string> = {
            price_research: 'Iniciar pesquisa de preços',
            bidding: 'Iniciar processo licitatório',
            awaiting_supply_authorization: 'Solicitar autorização de fornecimento',
            approved: 'Aprovar pedido',
            rejected: 'Rejeitar pedido',
        };
        return descriptions[status] || 'Atualizar status do pedido';
    };

    const filteredRequests = purchaseRequests.filter(
        (pr) => pr.title.toLowerCase().includes(searchTerm.toLowerCase()) || pr.secretaria?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Pedidos de Compra Simplificados" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* User Role Indicator */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Testando com papel: <strong>{currentUserRole}</strong>. As ações disponíveis mudam conforme o papel do usuário e status do
                        pedido.
                    </AlertDescription>
                </Alert>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pedidos de Compra Simplificados</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie o fluxo de aprovação dos pedidos de compra</p>
                    </div>
                    <Button asChild>
                        <Link href="/purchase-requests/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Pedido
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={MESSAGES.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
                        <CardDescription>{isLoading ? 'Carregando...' : `Mostrando ${filteredRequests.length} pedido(s)`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-center py-8 text-red-600">{error}</div>
                        ) : !isLoading && filteredRequests.length === 0 ? (
                            <EmptyState hasSearch={searchTerm.length > 0} />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Título / Secretaria</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Criação</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests.map((purchaseRequest) => (
                                            <PurchaseRequestRow
                                                key={purchaseRequest.id}
                                                purchaseRequest={purchaseRequest}
                                                currentUserRole={currentUserRole}
                                                onStatusChange={handleStatusChange}
                                                onDelete={handleDelete}
                                                onForwardToContracts={handleForwardToContracts}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
