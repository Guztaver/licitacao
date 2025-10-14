import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock, Edit2, Eye, FileText, Plus, Search, Trash2, User, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import ConsolidateConfirmationModal from '@/components/ConsolidateConfirmationModal';

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
    items?: Array<{
        id: number;
        descricao_material: string;
        quantidade_solicitada: number;
        unidade_medida: string;
        valor_unitario_estimado: number;
        valor_total_estimado: number;
    }>;
}

interface ConsolidatedItem {
    itemDescription: string;
    unitOfMeasure: string;
    totalQuantity: number;
    sourceRequestIds: number[];
    valorUnitarioEstimado: number;
    especificacoes?: string;
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
        in_bidding_process: 'Em Processo Licitatório',
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
        in_bidding_process: 'outline',
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
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'rejected':
            return <XCircle className="h-4 w-4 text-red-600" />;
        case 'price_research_completed':
        case 'in_bidding_process':
        case 'bidding':
        case 'awaiting_supply_authorization':
            return <Clock className="h-4 w-4 text-blue-600" />;
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
    {
        title: 'Consolidar Pedidos',
        href: '/bidding-processes/consolidate',
    },
];

const MESSAGES = {
    noResults: 'Nenhum pedido disponível para consolidação encontrado',
    noData: 'Nenhum pedido disponível para consolidação',
    searchPlaceholder: 'Buscar por título ou secretaria...',
    consolidationSuccess: 'Processo licitatório criado com sucesso!',
    consolidationError: 'Erro ao consolidar pedidos. Tente novamente.',
    noSelection: 'Por favor, selecione ao menos um pedido para consolidar.',
    invalidStatus: 'Apenas pedidos com status "Pesquisa de Preço Concluída" podem ser consolidados.',
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
                            ? 'Tente ajustar os filtros para encontrar pedidos disponíveis para consolidação.'
                            : 'Não há pedidos com status "Pesquisa de Preço Concluída" disponíveis para consolidação no momento.'}
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/bidding-processes">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Ver Processos Licitatórios
                    </Link>
                </Button>
            </div>
        </div>
    );
}

interface ConsolidationSummaryProps {
    selectedRequests: PurchaseRequest[];
    onClearSelection: () => void;
}

function ConsolidationSummary({ selectedRequests, onClearSelection }: ConsolidationSummaryProps) {
    const [showModal, setShowModal] = useState(false);

    // Calculate summary statistics
    const totalRequests = selectedRequests.length;
    const totalEstimatedValue = selectedRequests.reduce((sum, req) => sum + (req.estimated_total || 0), 0);
    const totalItems = selectedRequests.reduce((sum, req) => sum + (req.items?.length || 0), 0);

    // Calculate unique items by description and unit
    const uniqueItemsMap = new Map<string, ConsolidatedItem>();
    selectedRequests.forEach((request) => {
        request.items?.forEach((item) => {
            const key = `${item.descricao_material.toLowerCase()}|${item.unidade_medida.toLowerCase()}`;
            if (uniqueItemsMap.has(key)) {
                const existing = uniqueItemsMap.get(key)!;
                existing.totalQuantity += item.quantidade_solicitada;
                existing.sourceRequestIds.push(request.id);
            } else {
                uniqueItemsMap.set(key, {
                    itemDescription: item.descricao_material,
                    unitOfMeasure: item.unidade_medida,
                    totalQuantity: item.quantidade_solicitada,
                    sourceRequestIds: [request.id],
                    valorUnitarioEstimado: item.valor_unitario_estimado,
                });
            }
        });
    });
    const uniqueItemsCount = uniqueItemsMap.size;

    const handleConsolidate = (title: string, observations?: string) => {
        const purchaseRequestIds = selectedRequests.map((req) => req.id);

        router.post(
            '/api/bidding-processes/consolidate',
            {
                purchaseRequestIds,
                title,
                observations,
            },
            {
                onSuccess: (page) => {
                    setShowModal(false);
                    alert(MESSAGES.consolidationSuccess);
                    // Redirect to the newly created bidding process
                    if (page.props.data?.biddingProcess?.id) {
                        router.visit(`/bidding-processes/${page.props.data.biddingProcess.id}`);
                    } else {
                        router.visit('/bidding-processes');
                    }
                },
                onError: (errors) => {
                    console.error('Consolidation errors:', errors);
                    alert(MESSAGES.consolidationError);
                },
            }
        );
    };

    if (selectedRequests.length === 0) return null;

    return (
        <>
            <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-900">Resumo da Consolidação</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClearSelection}>
                            Limpar Seleção
                        </Button>
                    </div>
                    <CardDescription className="text-blue-700">{totalRequests} pedido(s) selecionado(s) para consolidação</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{totalRequests}</div>
                            <div className="text-sm text-blue-700">Pedidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{uniqueItemsCount}</div>
                            <div className="text-sm text-blue-700">Itens Únicos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{totalItems}</div>
                            <div className="text-sm text-blue-700">Total de Itens</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalEstimatedValue)}</div>
                            <div className="text-sm text-blue-700">Valor Estimado</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">Pedidos selecionados:</h4>
                        {selectedRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                                <div>
                                    <span className="font-medium">#{request.id}</span> - {request.title}
                                    <span className="text-gray-500 ml-2">({request.secretaria?.sigla})</span>
                                </div>
                                <span className="text-blue-600 font-medium">{formatCurrency(request.estimated_total)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700" size="lg">
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Consolidar Selecionados
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ConsolidateConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConsolidate}
                summary={{
                    totalRequests,
                    totalUniqueItems: uniqueItemsCount,
                    totalEstimatedValue,
                }}
            />
        </>
    );
}

interface PurchaseRequestRowProps {
    request: PurchaseRequest;
    isSelected: boolean;
    onSelectionChange: (selected: boolean) => void;
}

function PurchaseRequestRow({ request, isSelected, onSelectionChange }: PurchaseRequestRowProps) {
    return (
        <TableRow className={isSelected ? 'bg-blue-50' : ''}>
            <TableCell>
                <Checkbox checked={isSelected} onCheckedChange={onSelectionChange} aria-label={`Selecionar pedido ${request.id}`} />
            </TableCell>
            <TableCell className="font-medium">#{request.id}</TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-gray-500">{request.secretaria?.sigla || '-'}</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <Badge className={getStatusBadgeColor(request.status)}>{getStatusDisplayText(request.status)}</Badge>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>{formatCurrency(request.estimated_total)}</p>
                    <p className="text-gray-500">{request.items?.length || 0} item(ns)</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <p>Criado: {new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                    <p className="text-gray-500">por {request.user?.name || '-'}</p>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Link href={`/purchase-requests/${request.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </TableCell>
        </TableRow>
    );
}

// Main Component
export default function ConsolidateRequestsPage() {
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [selectedRequestIds, setSelectedRequestIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch available requests for consolidation
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/bidding-processes/available-requests');
                const data = await response.json();

                if (data.success) {
                    setPurchaseRequests(data.data.data || data.data || []);
                } else {
                    setError('Erro ao carregar os pedidos disponíveis');
                }
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Erro ao carregar os pedidos disponíveis');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSelectionChange = (requestId: number, selected: boolean) => {
        setSelectedRequestIds((prev) => {
            if (selected) {
                return [...prev, requestId];
            } else {
                return prev.filter((id) => id !== requestId);
            }
        });
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedRequestIds(purchaseRequests.map((req) => req.id));
        } else {
            setSelectedRequestIds([]);
        }
    };

    const clearSelection = () => {
        setSelectedRequestIds([]);
    };

    const selectedRequests = purchaseRequests.filter((req) => selectedRequestIds.includes(req.id));
    const filteredRequests = purchaseRequests.filter(
        (req) => req.title.toLowerCase().includes(searchTerm.toLowerCase()) || req.secretaria?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAllSelected = filteredRequests.length > 0 && filteredRequests.every((req) => selectedRequestIds.includes(req.id));
    const isPartiallySelected = selectedRequestIds.length > 0 && !isAllSelected;

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Consolidar Pedidos de Compra" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Consolidar Pedidos de Compra</h1>
                        <p className="text-gray-600 dark:text-gray-400">Selecione múltiplos pedidos para criar um único processo licitatório</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/bidding-processes">
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Ver Processos Licitatórios
                        </Link>
                    </Button>
                </div>

                {/* Info Alert */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Apenas pedidos com status <strong>"Pesquisa de Preço Concluída"</strong> podem ser consolidados. Pedidos consolidados terão
                        seu status alterado para "Em Processo Licitatório".
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

                {/* Consolidation Summary */}
                <ConsolidationSummary selectedRequests={selectedRequests} onClearSelection={clearSelection} />

                {/* Available Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Pedidos Disponíveis para Consolidação</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? 'Carregando...'
                                : `Mostrando ${filteredRequests.length} pedido(s) disponível(is) de ${purchaseRequests.length} no total`}
                        </CardDescription>
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
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Selecionar todos"
                                                    ref={
                                                        isPartiallySelected
                                                            ? (el) => {
                                                                  if (el) el.indeterminate = true;
                                                              }
                                                            : undefined
                                                    }
                                                />
                                            </TableHead>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Título / Secretaria</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Valor / Itens</TableHead>
                                            <TableHead>Criação</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests.map((request) => (
                                            <PurchaseRequestRow
                                                key={request.id}
                                                request={request}
                                                isSelected={selectedRequestIds.includes(request.id)}
                                                onSelectionChange={(selected) => handleSelectionChange(request.id, selected)}
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
