import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, DollarSign, Edit2, FileText, Plus, Save, Trash2, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { conferencias } from '@/routes';
import type { BreadcrumbItem, Conferencia, Fornecedor, PedidoManual } from '@/types';

// Types
interface Requisicao {
    id: number;
    numero_completo: string;
    descricao: string;
    valor_final: number;
    data_concretizacao: string | null;
    status: string;
    emitente: {
        nome: string;
        sigla: string;
    } | null;
}

interface ConferenciaEditProps {
    conferencia: Conferencia & {
        pode_editar: boolean;
        pode_finalizar: boolean;
    };
    fornecedor: Pick<
        Fornecedor,
        'id' | 'razao_social' | 'cnpj' | 'cnpj_formatado' | 'telefone' | 'telefone_formatado' | 'email' | 'endereco_completo'
    > | null;
    requisicoes: Requisicao[];
    pedidos_manuais: PedidoManual[];
    totals: {
        total_requisicoes: number;
        total_pedidos_manuais: number;
        total_geral: number;
    };
}

interface PedidoManualForm {
    conferencia_id: number;
    descricao: string;
    valor: string;
    numero_pedido: string;
    data_pedido: string;
    observacoes: string;
}

interface ConferenciaUpdateForm {
    observacoes: string;
    status: string;
}

// Constants
const BASE_BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: conferencias.index(),
    },
];

const TOTALS_CONFIG = [
    {
        key: 'total_requisicoes' as const,
        title: 'Total Requisições',
        color: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        valueColor: 'text-blue-900 dark:text-blue-100',
    },
    {
        key: 'total_pedidos_manuais' as const,
        title: 'Total Pedidos Manuais',
        color: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-600 dark:text-green-400',
        valueColor: 'text-green-900 dark:text-green-100',
    },
    {
        key: 'total_geral' as const,
        title: 'Total Geral',
        color: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-600 dark:text-purple-400',
        valueColor: 'text-purple-900 dark:text-purple-100',
    },
];

const MESSAGES = {
    noValue: '-',
    confirmDelete: 'Tem certeza que deseja excluir este pedido manual?',
    confirmFinalize: 'Tem certeza que deseja finalizar esta conferência? Após finalizada, não poderá mais ser editada.',
    noPedidos: 'Nenhum pedido manual cadastrado.',
    noRequisicoes: 'Nenhuma requisição encontrada para este período.',
} as const;

// Utility Functions
const getBreadcrumbs = (conferencia: Conferencia): BreadcrumbItem[] => [
    ...BASE_BREADCRUMBS,
    {
        title: `Conferência #${conferencia.id}`,
        href: conferencias.show(conferencia.id),
    },
    {
        title: 'Editar',
        href: conferencias.show(conferencia.id) + '/edit',
    },
];

const formatCurrency = (value: number | null | undefined): string => {
    if (!value || value === 0) return MESSAGES.noValue;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const getInitialPedidoData = (conferenciaId: number): PedidoManualForm => ({
    conferencia_id: conferenciaId,
    descricao: '',
    valor: '',
    numero_pedido: '',
    data_pedido: new Date().toISOString().split('T')[0],
    observacoes: '',
});

const getInitialConferenciaData = (conferencia: Conferencia): ConferenciaUpdateForm => ({
    observacoes: conferencia.observacoes || '',
    status: conferencia.status,
});

// Components
interface FinancialSummaryProps {
    totals: ConferenciaEditProps['totals'];
}

function FinancialSummary({ totals }: FinancialSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Resumo Financeiro
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {TOTALS_CONFIG.map(({ key, title, color, textColor, valueColor }) => (
                        <div key={key} className={`rounded-lg p-4 ${color}`}>
                            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                            <p className={`text-2xl font-bold ${valueColor}`}>{formatCurrency(totals[key])}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface RequisicoesTableProps {
    requisicoes: Requisicao[];
}

function RequisicoesTable({ requisicoes }: RequisicoesTableProps) {
    if (requisicoes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">{MESSAGES.noRequisicoes}</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Emitente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requisicoes.map((requisicao) => (
                        <TableRow key={requisicao.id}>
                            <TableCell className="font-mono text-sm">{requisicao.numero_completo}</TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate" title={requisicao.descricao}>
                                    {requisicao.descricao}
                                </div>
                            </TableCell>
                            <TableCell>
                                {requisicao.emitente ? (
                                    <div>
                                        <div className="font-medium">{requisicao.emitente.sigla}</div>
                                        <div className="text-sm text-gray-500">{requisicao.emitente.nome}</div>
                                    </div>
                                ) : (
                                    MESSAGES.noValue
                                )}
                            </TableCell>
                            <TableCell>{requisicao.data_concretizacao || MESSAGES.noValue}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(requisicao.valor_final)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

interface PedidoManualFormProps {
    data: PedidoManualForm;
    errors: Partial<Record<keyof PedidoManualForm, string>>;
    processing: boolean;
    onChange: (name: keyof PedidoManualForm, value: string) => void;
    onSubmit: FormEventHandler;
    onCancel: () => void;
}

function PedidoManualForm({ data, errors, processing, onChange, onSubmit, onCancel }: PedidoManualFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
            <h3 className="font-semibold">Novo Pedido Manual</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                        id="descricao"
                        value={data.descricao}
                        onChange={(e) => onChange('descricao', e.target.value)}
                        placeholder="Descrição do pedido"
                        rows={3}
                        disabled={processing}
                        required
                    />
                    {errors.descricao && <p className="text-sm text-red-600">{errors.descricao}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                        id="observacoes"
                        value={data.observacoes}
                        onChange={(e) => onChange('observacoes', e.target.value)}
                        placeholder="Observações adicionais"
                        rows={3}
                        disabled={processing}
                    />
                    {errors.observacoes && <p className="text-sm text-red-600">{errors.observacoes}</p>}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="valor">Valor *</Label>
                    <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.valor}
                        onChange={(e) => onChange('valor', e.target.value)}
                        placeholder="0.00"
                        disabled={processing}
                        required
                    />
                    {errors.valor && <p className="text-sm text-red-600">{errors.valor}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="numero_pedido">Número do Pedido</Label>
                    <Input
                        id="numero_pedido"
                        value={data.numero_pedido}
                        onChange={(e) => onChange('numero_pedido', e.target.value)}
                        placeholder="Ex: 12345"
                        disabled={processing}
                    />
                    {errors.numero_pedido && <p className="text-sm text-red-600">{errors.numero_pedido}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="data_pedido">Data do Pedido *</Label>
                    <Input
                        id="data_pedido"
                        type="date"
                        value={data.data_pedido}
                        onChange={(e) => onChange('data_pedido', e.target.value)}
                        disabled={processing}
                        required
                    />
                    {errors.data_pedido && <p className="text-sm text-red-600">{errors.data_pedido}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Pedido
                </Button>
            </div>
        </form>
    );
}

interface PedidosManuaisTableProps {
    pedidos_manuais: PedidoManual[];
    onDelete: (id: number) => void;
}

function PedidosManuaisTable({ pedidos_manuais, onDelete }: PedidosManuaisTableProps) {
    if (pedidos_manuais.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Plus className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">{MESSAGES.noPedidos}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Clique em "Adicionar Pedido" para começar.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-24">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pedidos_manuais.map((pedido) => (
                        <TableRow key={pedido.id}>
                            <TableCell>
                                <div className="max-w-xs">
                                    <div className="font-medium">{pedido.descricao}</div>
                                    {pedido.observacoes && <div className="text-sm text-gray-500">{pedido.observacoes}</div>}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{pedido.numero_pedido || MESSAGES.noValue}</TableCell>
                            <TableCell>{pedido.data_pedido}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(pedido.valor)}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(pedido.id)} title="Excluir">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

interface FornecedorInfoProps {
    fornecedor: NonNullable<ConferenciaEditProps['fornecedor']>;
}

function FornecedorInfo({ fornecedor }: FornecedorInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Fornecedor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Razão Social</p>
                    <p className="font-semibold">{fornecedor.razao_social}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CNPJ</p>
                    <p className="font-mono text-sm">{fornecedor.cnpj_formatado || MESSAGES.noValue}</p>
                </div>
                {fornecedor.telefone_formatado && (
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</p>
                        <p className="text-sm">{fornecedor.telefone_formatado}</p>
                    </div>
                )}
                {fornecedor.email && (
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm">{fornecedor.email}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface ConferenciaFormProps {
    data: ConferenciaUpdateForm;
    errors: Partial<Record<keyof ConferenciaUpdateForm, string>>;
    processing: boolean;
    canEdit: boolean;
    canFinalize: boolean;
    onChange: (name: keyof ConferenciaUpdateForm, value: string) => void;
    onSubmit: FormEventHandler;
    onFinalize: () => void;
}

function ConferenciaForm({ data, errors, processing, canEdit, canFinalize, onChange, onSubmit, onFinalize }: ConferenciaFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Edit2 className="mr-2 h-5 w-5" />
                    Editar Conferência
                </CardTitle>
                <CardDescription>Atualize as informações da conferência e gerencie seu status.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={data.observacoes}
                            onChange={(e) => onChange('observacoes', e.target.value)}
                            placeholder="Adicione observações sobre esta conferência..."
                            rows={5}
                            disabled={processing || !canEdit}
                        />
                        {errors.observacoes && <p className="text-sm text-red-600">{errors.observacoes}</p>}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status Atual</Label>
                            <div>
                                <Badge className={data.status === 'finalizada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {data.status === 'finalizada' ? 'Finalizada' : 'Em Andamento'}
                                </Badge>
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex flex-col gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Esta conferência está em andamento</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Você pode continuar editando ou finalizar a conferência. Após finalizar, não será mais possível fazer alterações.
                                </p>
                            </div>
                        )}

                        {!canEdit && (
                            <div className="flex flex-col gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">Esta conferência foi finalizada</p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Conferências finalizadas não podem ser editadas. Para fazer alterações, você precisará criar uma nova conferência.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" asChild disabled={processing}>
                            <Link href={conferencias.index()}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Link>
                        </Button>

                        {canEdit && (
                            <>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Alterações
                                </Button>

                                {canFinalize && (
                                    <Button type="button" onClick={onFinalize} disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Finalizar Conferência
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// Main Component
export default function ConferenciaEdit({ conferencia, fornecedor, requisicoes, pedidos_manuais, totals }: ConferenciaEditProps) {
    const [showAddPedidoForm, setShowAddPedidoForm] = useState(false);

    const breadcrumbs = useMemo(() => getBreadcrumbs(conferencia), [conferencia]);

    const {
        data: conferenciaData,
        setData: setConferenciaData,
        put: putConferencia,
        processing: processingConferencia,
        errors: conferenciaErrors,
    } = useForm<ConferenciaUpdateForm>(getInitialConferenciaData(conferencia));

    const {
        data: pedidoData,
        setData: setPedidoData,
        post: postPedido,
        processing: processingPedido,
        errors: pedidoErrors,
        reset: resetPedido,
    } = useForm<PedidoManualForm>(getInitialPedidoData(conferencia.id));

    // Event handlers
    const handleConferenciaFieldChange = useMemo(
        () => (name: keyof ConferenciaUpdateForm, value: string) => {
            setConferenciaData(name, value);
        },
        [setConferenciaData]
    );

    const handlePedidoFieldChange = useMemo(
        () => (name: keyof PedidoManualForm, value: string) => {
            setPedidoData(name, value);
        },
        [setPedidoData]
    );

    const handleUpdateConferencia: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            putConferencia(conferencias.show(conferencia.id));
        },
        [putConferencia, conferencia.id]
    );

    const handleAddPedidoManual: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            postPedido('/conferencias/pedidos-manuais', {
                onSuccess: () => {
                    resetPedido();
                    setShowAddPedidoForm(false);
                },
            });
        },
        [postPedido, resetPedido]
    );

    const handleDeletePedidoManual = useMemo(
        () => (pedidoId: number) => {
            if (confirm(MESSAGES.confirmDelete)) {
                router.delete(`/conferencias/${conferencia.id}/pedidos-manuais/${pedidoId}`);
            }
        },
        [conferencia.id]
    );

    const handleFinalizarConferencia = useMemo(
        () => () => {
            if (confirm(MESSAGES.confirmFinalize)) {
                setConferenciaData('status', 'finalizada');
                putConferencia(conferencias.show(conferencia.id));
            }
        },
        [putConferencia, conferencia.id, setConferenciaData]
    );

    const handleCancelPedidoForm = useMemo(
        () => () => {
            setShowAddPedidoForm(false);
            resetPedido();
        },
        [resetPedido]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Conferência #${conferencia.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={conferencias.show(conferencia.id)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Editar Conferência #{conferencia.id}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {conferencia.periodo_display} • {fornecedor?.razao_social}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Financial Summary */}
                        <FinancialSummary totals={totals} />

                        {/* Conference Form */}
                        <ConferenciaForm
                            data={conferenciaData}
                            errors={conferenciaErrors}
                            processing={processingConferencia}
                            canEdit={conferencia.pode_editar}
                            canFinalize={conferencia.pode_finalizar}
                            onChange={handleConferenciaFieldChange}
                            onSubmit={handleUpdateConferencia}
                            onFinalize={handleFinalizarConferencia}
                        />

                        {/* Requisições */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Requisições do Período
                                </CardTitle>
                                <CardDescription>Lista de requisições concretizadas incluídas nesta conferência.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RequisicoesTable requisicoes={requisicoes} />
                            </CardContent>
                        </Card>

                        {/* Pedidos Manuais */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Pedidos Manuais
                                    </div>
                                    {conferencia.pode_editar && (
                                        <Button onClick={() => setShowAddPedidoForm(true)} disabled={showAddPedidoForm}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Adicionar Pedido
                                        </Button>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Pedidos informais (sem requisição) realizados no período. Adicione valores extras que não possuem requisição
                                    formal.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Add Pedido Form */}
                                {showAddPedidoForm && (
                                    <PedidoManualForm
                                        data={pedidoData}
                                        errors={pedidoErrors}
                                        processing={processingPedido}
                                        onChange={handlePedidoFieldChange}
                                        onSubmit={handleAddPedidoManual}
                                        onCancel={handleCancelPedidoForm}
                                    />
                                )}

                                {/* Pedidos List */}
                                {!showAddPedidoForm && <PedidosManuaisTable pedidos_manuais={pedidos_manuais} onDelete={handleDeletePedidoManual} />}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Fornecedor Info */}
                        {fornecedor && <FornecedorInfo fornecedor={fornecedor} />}

                        {/* Period Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Período
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold">{conferencia.periodo_display}</p>
                            </CardContent>
                        </Card>

                        {/* Instructions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Instruções</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p>• As requisições são incluídas automaticamente</p>
                                <p>• Adicione pedidos manuais para valores sem requisição</p>
                                <p>• Os totais são calculados automaticamente</p>
                                <p>• Após finalizar, a conferência não poderá ser editada</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
