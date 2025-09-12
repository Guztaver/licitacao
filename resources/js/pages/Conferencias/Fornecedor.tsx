import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, DollarSign, Edit3, FileText, Plus, Save, Trash2 } from 'lucide-react';
import { type FormEventHandler, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

// Types
interface Requisicao {
    id: number;
    numero_completo: string;
    solicitante: string;
    valor_final: number;
    numero_pedido_real?: string;
    data_concretizacao: string;
    emitente?: {
        nome: string;
        sigla: string;
    };
    destinatario?: {
        nome: string;
    };
}

interface PedidoManual {
    id: number;
    descricao: string;
    valor: number;
    numero_pedido?: string;
    data_pedido: string;
}

interface Fornecedor {
    id: number;
    razao_social: string;
    cnpj_formatado?: string;
    telefone_formatado?: string;
    email?: string;
    endereco_completo?: string;
}

interface Totals {
    requisicoes: number;
    pedidos_manuais: number;
    geral: number;
}

interface ConferenciaFornecedorProps {
    fornecedor: Fornecedor;
    periodo: string;
    periodo_display: string;
    requisicoes: Requisicao[];
    pedidos_manuais: PedidoManual[];
    totals: Totals;
}

interface PedidoManualForm {
    descricao: string;
    valor: string;
    numero_pedido: string;
    data_pedido: string;
    observacoes: string;
}

interface RequisicaoEditForm {
    valor_final: string;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: '/conferencias',
    },
    {
        title: 'Detalhes da Conferência',
        href: '#',
    },
];

const TOTALS_CONFIG = [
    {
        key: 'requisicoes' as const,
        title: 'Total Requisições',
        color: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-800 dark:text-blue-400',
        valueColor: 'text-blue-900 dark:text-blue-100',
        countLabel: (count: number) => `${count} requisições`,
    },
    {
        key: 'pedidos_manuais' as const,
        title: 'Total Pedidos Manuais',
        color: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-600 dark:text-green-400',
        valueColor: 'text-green-900 dark:text-green-100',
        countLabel: (count: number) => `${count} pedidos`,
    },
    {
        key: 'geral' as const,
        title: 'Total Geral',
        color: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-600 dark:text-purple-400',
        valueColor: 'text-purple-900 dark:text-purple-100',
        countLabel: () => 'Valor final da conferência',
    },
];

const FORNECEDOR_FIELDS = [
    { key: 'razao_social' as const, label: 'Razão Social', isBold: true },
    { key: 'cnpj_formatado' as const, label: 'CNPJ', isMonospace: true },
    { key: 'telefone_formatado' as const, label: 'Telefone' },
    { key: 'email' as const, label: 'Email' },
];

const PEDIDO_FORM_FIELDS = [
    {
        name: 'descricao' as const,
        label: 'Descrição',
        type: 'text',
        placeholder: 'Descreva o pedido...',
        required: true,
        gridClass: 'md:col-span-1',
    },
    {
        name: 'valor' as const,
        label: 'Valor (R$)',
        type: 'number',
        placeholder: '0,00',
        required: true,
        gridClass: 'md:col-span-1',
        props: { step: '0.01', min: '0' },
    },
    {
        name: 'numero_pedido' as const,
        label: 'Número do Pedido',
        type: 'text',
        placeholder: 'Ex: PED-001',
        required: false,
        gridClass: 'md:col-span-1',
    },
    {
        name: 'data_pedido' as const,
        label: 'Data do Pedido',
        type: 'date',
        placeholder: '',
        required: true,
        gridClass: 'md:col-span-1',
    },
];

const INSTRUCTIONS = [
    'Revise as requisições e ajuste valores se necessário',
    'Adicione pedidos manuais com justificativa obrigatória',
    'Clique em "Finalizar Conferência" quando terminar',
];

const MESSAGES = {
    noRequisicoes: 'Nenhuma requisição encontrada',
    noRequisicoesDescription: 'Não há requisições concretizadas para este fornecedor no período selecionado.',
    noPedidosManuais: 'Nenhum pedido manual',
    noPedidosManuaisDescription: 'Clique em "Adicionar Pedido" para incluir pedidos manuais nesta conferência.',
    noValue: '-',
    confirmDelete: 'Tem certeza que deseja excluir este pedido manual?',
    confirmFinalize: 'Tem certeza que deseja finalizar esta conferência? Esta ação não pode ser desfeita.',
} as const;

// Utility Functions
const formatCurrency = (value: number): string => {
    if (!value || value === 0) return MESSAGES.noValue;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const formatEmitenteInfo = (emitente: Requisicao['emitente']) => {
    if (!emitente) return MESSAGES.noValue;
    return `${emitente.nome} (${emitente.sigla})`;
};

const getInitialPedidoData = (): PedidoManualForm => ({
    descricao: '',
    valor: '',
    numero_pedido: '',
    data_pedido: '',
    observacoes: '',
});

const getInitialRequisicaoData = (): RequisicaoEditForm => ({
    valor_final: '',
});

// Components
interface FinancialSummaryProps {
    totals: Totals;
    requisicoes: Requisicao[];
    pedidos_manuais: PedidoManual[];
}

function FinancialSummary({ totals, requisicoes, pedidos_manuais }: FinancialSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Resumo Financeiro
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {TOTALS_CONFIG.map(({ key, title, color, textColor, valueColor, countLabel }) => {
                        const count = key === 'requisicoes' ? requisicoes.length : key === 'pedidos_manuais' ? pedidos_manuais.length : 0;

                        return (
                            <div key={key} className={`rounded-lg p-4 ${color}`}>
                                <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                                <p className={`text-2xl font-bold ${valueColor}`}>{formatCurrency(totals[key])}</p>
                                <p className={`text-xs ${textColor}`}>{countLabel(count)}</p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

interface RequisicaoRowProps {
    requisicao: Requisicao;
    isEditing: boolean;
    editValue: string;
    processing: boolean;
    onEdit: (id: number, currentValue: number) => void;
    onSave: (id: number) => void;
    onCancel: () => void;
    onValueChange: (value: string) => void;
}

function RequisicaoRow({ requisicao, isEditing, editValue, processing, onEdit, onSave, onCancel, onValueChange }: RequisicaoRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">{requisicao.numero_completo}</TableCell>
            <TableCell>{requisicao.solicitante}</TableCell>
            <TableCell>{formatEmitenteInfo(requisicao.emitente)}</TableCell>
            <TableCell>
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <Input type="number" step="0.01" value={editValue} onChange={(e) => onValueChange(e.target.value)} className="w-24" />
                        <Button size="sm" onClick={() => onSave(requisicao.id)} disabled={processing}>
                            <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                ) : (
                    formatCurrency(requisicao.valor_final)
                )}
            </TableCell>
            <TableCell>{requisicao.data_concretizacao}</TableCell>
            <TableCell>
                {!isEditing && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(requisicao.id, requisicao.valor_final)}>
                        <Edit3 className="mr-1 h-3 w-3" />
                        Editar
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}

interface RequisicoesTableProps {
    requisicoes: Requisicao[];
    editingRequisicao: number | null;
    editValue: string;
    processing: boolean;
    onEdit: (id: number, currentValue: number) => void;
    onSave: (id: number) => void;
    onCancel: () => void;
    onValueChange: (value: string) => void;
}

function RequisicoesTable({ requisicoes, editingRequisicao, editValue, processing, onEdit, onSave, onCancel, onValueChange }: RequisicoesTableProps) {
    if (requisicoes.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{MESSAGES.noRequisicoes}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{MESSAGES.noRequisicoesDescription}</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Requisição</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Emitente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requisicoes.map((requisicao) => (
                        <RequisicaoRow
                            key={requisicao.id}
                            requisicao={requisicao}
                            isEditing={editingRequisicao === requisicao.id}
                            editValue={editValue}
                            processing={processing}
                            onEdit={onEdit}
                            onSave={onSave}
                            onCancel={onCancel}
                            onValueChange={onValueChange}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

interface InputFieldProps {
    field: (typeof PEDIDO_FORM_FIELDS)[number];
    value: string;
    onChange: (name: string, value: string) => void;
    error?: string;
}

function InputField({ field, value, onChange, error }: InputFieldProps) {
    const handleChange = useMemo(
        () => (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(field.name, e.target.value);
        },
        [field.name, onChange]
    );

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>
                {field.label} {field.required && '*'}
            </Label>
            <Input
                type={field.type}
                value={value}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className={error ? 'border-red-500' : ''}
                {...(field.props || {})}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

interface PedidoManualFormProps {
    data: PedidoManualForm;
    errors: Record<string, string>;
    processing: boolean;
    onChange: (name: string, value: string) => void;
    onSubmit: FormEventHandler;
    onCancel: () => void;
}

function PedidoManualForm({ data, errors, processing, onChange, onSubmit, onCancel }: PedidoManualFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">Novo Pedido Manual</h4>
            <div className="grid gap-4 md:grid-cols-2">
                {PEDIDO_FORM_FIELDS.map((field) => (
                    <InputField key={field.name} field={field} value={data[field.name]} onChange={onChange} error={errors[field.name]} />
                ))}
            </div>
            <div className="space-y-2">
                <Label htmlFor="observacoes">Justificativa *</Label>
                <Textarea
                    value={data.observacoes}
                    onChange={(e) => onChange('observacoes', e.target.value)}
                    placeholder="Justifique a necessidade deste pedido manual..."
                    required
                    rows={3}
                    className={errors.observacoes ? 'border-red-500' : ''}
                />
                {errors.observacoes && <p className="text-sm text-red-500">{errors.observacoes}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Button type="submit" disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? 'Salvando...' : 'Salvar Pedido'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
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
            <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900">
                <Plus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{MESSAGES.noPedidosManuais}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{MESSAGES.noPedidosManuaisDescription}</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pedidos_manuais.map((pedido) => (
                        <TableRow key={pedido.id}>
                            <TableCell className="font-medium">{pedido.descricao}</TableCell>
                            <TableCell>{pedido.numero_pedido || MESSAGES.noValue}</TableCell>
                            <TableCell>{pedido.data_pedido}</TableCell>
                            <TableCell className="font-semibold text-green-600">{formatCurrency(pedido.valor)}</TableCell>
                            <TableCell>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(pedido.id)}>
                                    <Trash2 className="h-3 w-3" />
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
    fornecedor: Fornecedor;
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
            <CardContent className="space-y-4">
                {FORNECEDOR_FIELDS.map(({ key, label, isBold, isMonospace }) => {
                    const value = fornecedor[key];
                    if (!value) return null;

                    return (
                        <div key={key}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                            <p className={`${isBold ? 'font-semibold' : ''} ${isMonospace ? 'font-mono text-sm' : ''}`}>{value}</p>
                        </div>
                    );
                })}

                <Separator />

                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/fornecedores/${fornecedor.id}`}>Ver Fornecedor</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

interface PeriodInfoProps {
    periodo_display: string;
}

function PeriodInfo({ periodo_display }: PeriodInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Período
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Período da Conferência</p>
                    <p className="text-lg font-semibold">{periodo_display}</p>
                </div>
            </CardContent>
        </Card>
    );
}

interface InstructionsCardProps {
    instructions: string[];
}

function InstructionsCard({ instructions }: InstructionsCardProps) {
    return (
        <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Instruções</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>
                                {instructions.map((instruction) => (
                                    <span key={instruction}>
                                        • {instruction}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Main Component
export default function ConferenciaFornecedor({
    fornecedor,
    periodo,
    periodo_display,
    requisicoes,
    pedidos_manuais,
    totals,
}: ConferenciaFornecedorProps) {
    const [showAddPedidoForm, setShowAddPedidoForm] = useState(false);
    const [editingRequisicao, setEditingRequisicao] = useState<number | null>(null);

    const {
        data: pedidoData,
        setData: setPedidoData,
        post: postPedido,
        processing: processingPedido,
        errors: pedidoErrors,
        reset: resetPedido,
    } = useForm<PedidoManualForm>(getInitialPedidoData());

    const {
        data: requisicaoData,
        setData: setRequisicaoData,
        patch: patchRequisicao,
        processing: processingRequisicao,
    } = useForm<RequisicaoEditForm>(getInitialRequisicaoData());

    // Event handlers
    const handlePedidoFieldChange = useMemo(
        () => (name: string, value: string) => {
            setPedidoData(name as keyof PedidoManualForm, value);
        },
        [setPedidoData]
    );

    const handleAddPedidoManual: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            postPedido(`/conferencias/fornecedor/${fornecedor.id}/${periodo}/pedidos-manuais`, {
                onSuccess: () => {
                    resetPedido();
                    setShowAddPedidoForm(false);
                },
            });
        },
        [postPedido, fornecedor.id, periodo, resetPedido]
    );

    const handleEditRequisicao = useMemo(
        () => (requisicaoId: number, valorAtual: number) => {
            setEditingRequisicao(requisicaoId);
            setRequisicaoData('valor_final', valorAtual.toString());
        },
        [setRequisicaoData]
    );

    const handleSaveRequisicao = useMemo(
        () => (requisicaoId: number) => {
            patchRequisicao(`/requisicoes/${requisicaoId}`, {
                onSuccess: () => {
                    setEditingRequisicao(null);
                },
            });
        },
        [patchRequisicao]
    );

    const handleCancelEditRequisicao = useMemo(
        () => () => {
            setEditingRequisicao(null);
        },
        []
    );

    const handleRequisicaoValueChange = useMemo(
        () => (value: string) => {
            setRequisicaoData('valor_final', value);
        },
        [setRequisicaoData]
    );

    const handleDeletePedidoManual = useMemo(
        () => (pedidoId: number) => {
            if (confirm(MESSAGES.confirmDelete)) {
                router.delete(`/conferencias/fornecedor/${fornecedor.id}/${periodo}/pedidos-manuais/${pedidoId}`);
            }
        },
        [fornecedor.id, periodo]
    );

    const handleFinalizarConferencia = useMemo(
        () => () => {
            if (confirm(MESSAGES.confirmFinalize)) {
                router.post(`/conferencias/fornecedor/${fornecedor.id}/${periodo}/finalizar`);
            }
        },
        [fornecedor.id, periodo]
    );

    const handleCancelPedidoForm = useMemo(
        () => () => {
            setShowAddPedidoForm(false);
            resetPedido();
        },
        [resetPedido]
    );

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`Conferência - ${fornecedor.razao_social} - ${periodo_display}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/conferencias">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Conferência - {periodo_display}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{fornecedor.razao_social}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={handleFinalizarConferencia} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Finalizar Conferência
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Financial Summary */}
                        <FinancialSummary totals={totals} requisicoes={requisicoes} pedidos_manuais={pedidos_manuais} />

                        {/* Requisições */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Requisições do Período
                                </CardTitle>
                                <CardDescription>
                                    Lista de requisições concretizadas. Clique em "Editar" para ajustar valores se necessário.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RequisicoesTable
                                    requisicoes={requisicoes}
                                    editingRequisicao={editingRequisicao}
                                    editValue={requisicaoData.valor_final}
                                    processing={processingRequisicao}
                                    onEdit={handleEditRequisicao}
                                    onSave={handleSaveRequisicao}
                                    onCancel={handleCancelEditRequisicao}
                                    onValueChange={handleRequisicaoValueChange}
                                />
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
                                    <Button onClick={() => setShowAddPedidoForm(true)} disabled={showAddPedidoForm}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar Pedido
                                    </Button>
                                </CardTitle>
                                <CardDescription>
                                    Pedidos informais (sem requisição) realizados no período. Aqui você pode adicionar valores extras.
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
                        <FornecedorInfo fornecedor={fornecedor} />

                        {/* Period Info */}
                        <PeriodInfo periodo_display={periodo_display} />

                        {/* Instructions */}
                        <InstructionsCard instructions={INSTRUCTIONS} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
