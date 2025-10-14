import { Head, Link } from '@inertiajs/react';
import {
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
    Pause,
    Square,
    XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    }>;
    created_by: number;
    observations: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
    purchase_requests?: Array<{
        id: number;
        title: string;
        status: string;
        secretaria?: {
            sigla: string;
        };
    }>;
    unique_items_count?: number;
    source_requests_count?: number;
    total_quantity?: number;
}

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    biddingProcess: BiddingProcess | null;
    newStatus: string;
    onConfirm: (comment: string) => void;
    isLoading: boolean;
}

function StatusChangeModal({ isOpen, onClose, biddingProcess, newStatus, onConfirm, isLoading }: StatusChangeModalProps) {
    const [comment, setComment] = useState('');

    if (!isOpen || !biddingProcess) return null;

    const handleConfirm = () => {
        onConfirm(comment);
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            draft: 'Rascunho',
            opened: 'Aberto',
            closed: 'Encerrado',
            cancelled: 'Cancelado',
        };
        return statusMap[status] || status;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirmar Alteração de Status</h3>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Processo: <span className="font-medium">{biddingProcess.title}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Status atual: <span className="font-medium">{getStatusText(biddingProcess.status)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Novo status: <span className="font-medium">{getStatusText(newStatus)}</span>
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comentário (opcional)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Adicione um comentário sobre esta alteração..."
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={
                            newStatus === 'cancelled'
                                ? 'bg-red-600 hover:bg-red-700'
                                : newStatus === 'opened'
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                        }
                    >
                        {isLoading ? 'Processando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Utility Functions
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
            return <Play className="h-4 w-4 text-green-600" />;
        case 'closed':
            return <Square className="h-4 w-4 text-blue-600" />;
        case 'cancelled':
            return <XCircle className="h-4 w-4 text-red-600" />;
        default:
            return <FileText className="h-4 w-4 text-gray-600" />;
    }
};

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Processos Licitatórios',
        href: '/bidding-processes',
    },
];

const MESSAGES = {
    noResults: 'Nenhum processo licitatório encontrado',
    noData: 'Nenhum processo licitatório cadastrado',
    searchPlaceholder: 'Buscar por título...',
    confirmDelete: 'Tem certeza que deseja excluir este processo licitatório?',
    cannotDelete: 'Este processo não pode ser excluído.',
    statusChangeSuccess: 'Status alterado com sucesso!',
    statusChangeError: 'Erro ao alterar status. Tente novamente.',
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
                            : 'Comece criando um novo processo licitatório ou consolidando pedidos existentes.'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button asChild variant="outline">
                        <Link href="/bidding-processes/consolidate">
                            <Plus className="mr-2 h-4 w-4" />
                            Consolidar Pedidos
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface BiddingProcessRowProps {
    biddingProcess: BiddingProcess;
    currentUserRole: string;
    onStatusChange: (id: number, newStatus: string, comment?: string) => void;
    onDelete: (id: number) => void;
}

function BiddingProcessRow({ biddingProcess, currentUserRole, onStatusChange, onDelete }: BiddingProcessRowProps) {
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [modalStatus, setModalStatus] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const canEdit = biddingProcess.status === 'draft';
    const canOpen = biddingProcess.status === 'draft';
    const canClose = biddingProcess.status === 'opened';
    const canCancel = ['draft', 'opened'].includes(biddingProcess.status);

    const handleStatusAction = (newStatus: string) => {
        setModalStatus(newStatus);
        setIsModalOpen(true);
        setShowActionMenu(false);
    };

    const handleModalConfirm = async (comment: string) => {
        setIsProcessing(true);
        try {
            await onStatusChange(biddingProcess.id, modalStatus, comment);
            setIsModalOpen(false);
            setModalStatus('');
        } catch (error) {
            console.error('Error changing status:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = () => {
        if (!canEdit) {
            alert(MESSAGES.cannotDelete);
            return;
        }

        if (confirm(MESSAGES.confirmDelete)) {
            onDelete(biddingProcess.id);
        }
    };

    const getAvailableActions = () => {
        const actions = [];

        if (canOpen && ['admin', 'purchasing_manager', 'head_of_purchasing'].includes(currentUserRole)) {
            actions.push({
                status: 'opened',
                label: 'Abrir Processo',
                description: 'Iniciar o processo licitatório',
                icon: <Play className="h-4 w-4" />,
            });
        }

        if (canClose && ['admin', 'head_of_purchasing'].includes(currentUserRole)) {
            actions.push({
                status: 'closed',
                label: 'Encerrar Processo',
                description: 'Finalizar o processo licitatório',
                icon: <Square className="h-4 w-4" />,
            });
        }

        if (canCancel && ['admin', 'purchasing_manager', 'head_of_purchasing'].includes(currentUserRole)) {
            actions.push({
                status: 'cancelled',
                label: 'Cancelar Processo',
                description: 'Cancelar o processo licitatório',
                icon: <XCircle className="h-4 w-4" />,
            });
        }

        return actions;
    };

    const availableActions = getAvailableActions();

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">#{biddingProcess.id}</TableCell>
                <TableCell>
                    <div>
                        <p className="font-medium">{biddingProcess.title}</p>
                        <p className="text-sm text-gray-500">por {biddingProcess.user?.name || '-'}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        {getStatusIcon(biddingProcess.status)}
                        <Badge className={getStatusBadgeColor(biddingProcess.status)}>{getStatusDisplayText(biddingProcess.status)}</Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <p>
                            <strong>{biddingProcess.unique_items_count || biddingProcess.consolidated_items?.length || 0}</strong> itens únicos
                        </p>
                        <p className="text-gray-500">
                            <strong>{biddingProcess.source_requests_count || 0}</strong> pedidos origem
                        </p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <p>Criado: {new Date(biddingProcess.created_at).toLocaleDateString('pt-BR')}</p>
                        <p className="text-gray-500">
                            {new Date(biddingProcess.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Link href={`/bidding-processes/${biddingProcess.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>

                        {canEdit && (
                            <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4" />
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
                                                onClick={() => handleStatusAction(action.status)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md flex items-center space-x-2"
                                            >
                                                {action.icon}
                                                <span>{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {canEdit && (
                            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </TableCell>
            </TableRow>

            <StatusChangeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalStatus('');
                    setShowActionMenu(false);
                }}
                biddingProcess={biddingProcess}
                newStatus={modalStatus}
                onConfirm={handleModalConfirm}
                isLoading={isProcessing}
            />
        </>
    );
}

// Main Component
export default function BiddingProcessesIndex() {
    const [biddingProcesses, setBiddingProcesses] = useState<BiddingProcess[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('operacional');

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/bidding-processes');
                const data = await response.json();

                if (data.success) {
                    setBiddingProcesses(data.data.data || data.data || []);
                } else {
                    setError('Erro ao carregar os processos licitatórios');
                }
            } catch (err) {
                console.error('Error fetching processes:', err);
                setError('Erro ao carregar os processos licitatórios');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Simulate getting current user role
    useEffect(() => {
        // In production, this would come from the authenticated user
        setCurrentUserRole('head_of_purchasing');
    }, []);

    const handleStatusChange = async (id: number, newStatus: string, comment?: string) => {
        try {
            const response = await fetch(`/api/bidding-processes/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    newStatus,
                    comment,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setBiddingProcesses((prev) => prev.map((bp) => (bp.id === id ? data.data : bp)));
                alert(MESSAGES.statusChangeSuccess);
            } else {
                alert(data.message || MESSAGES.statusChangeError);
            }
        } catch (error) {
            console.error('Error changing status:', error);
            alert(MESSAGES.statusChangeError);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/bidding-processes/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setBiddingProcesses((prev) => prev.filter((bp) => bp.id !== id));
            } else {
                alert(data.message || 'Erro ao excluir processo');
            }
        } catch (error) {
            console.error('Error deleting process:', error);
            alert('Erro ao excluir processo');
        }
    };

    const filteredProcesses = biddingProcesses.filter((bp) => bp.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Processos Licitatórios" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Processos Licitatórios</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie os processos licitatórios criados a partir da consolidação de pedidos
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/bidding-processes/consolidate">
                            <Plus className="mr-2 h-4 w-4" />
                            Consolidar Pedidos
                        </Link>
                    </Button>
                </div>

                {/* Info Alert */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Testando com papel: <strong>{currentUserRole}</strong>. As ações disponíveis mudam conforme o papel do usuário e status do
                        processo.
                    </AlertDescription>
                </Alert>

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
                        <CardTitle className="text-lg">Lista de Processos Licitatórios</CardTitle>
                        <CardDescription>{isLoading ? 'Carregando...' : `Mostrando ${filteredProcesses.length} processo(s)`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-center py-8 text-red-600">{error}</div>
                        ) : !isLoading && filteredProcesses.length === 0 ? (
                            <EmptyState hasSearch={searchTerm.length > 0} />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Título / Responsável</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Estatísticas</TableHead>
                                            <TableHead>Criação</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProcesses.map((biddingProcess) => (
                                            <BiddingProcessRow
                                                key={biddingProcess.id}
                                                biddingProcess={biddingProcess}
                                                currentUserRole={currentUserRole}
                                                onStatusChange={handleStatusChange}
                                                onDelete={handleDelete}
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
