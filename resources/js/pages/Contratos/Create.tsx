import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { contratos } from '@/routes';
import type { BreadcrumbItem, Fornecedor, ProcessoLicitatorio, Item } from '@/types';

// Types
interface ContratoItemForm {
    id?: string;
    item_id: string;
    quantidade: string;
    valor_unitario: string;
    marca: string;
    especificacao: string;
    observacoes: string;
}

interface ContratosCreateProps {
    fornecedores: Fornecedor[];
    processos: ProcessoLicitatorio[];
    items: Item[];
    users: Array<{ id: number; name: string }>;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Contratos',
        href: contratos.index(),
    },
    {
        title: 'Novo Contrato',
        href: contratos.create(),
    },
];

const MESSAGES = {
    required: 'Este campo é obrigatório',
    positiveNumber: 'Este valor deve ser maior que zero',
    selectItem: 'Selecione um item',
    addItem: 'Adicionar Item',
    removeItem: 'Remover',
    save: 'Salvar Contrato',
    cancel: 'Cancelar',
    contractNumber: 'Número do Contrato',
    supplier: 'Fornecedor',
    generalContract: 'Contrato Geral',
    biddingProcess: 'Processo Licitatório',
    startDate: 'Data de Início',
    endDate: 'Data de Término',
    description: 'Descrição',
    items: 'Itens do Contrato',
    itemCode: 'Código',
    itemDescription: 'Descrição',
    quantity: 'Quantidade',
    unitValue: 'Valor Unitário',
    totalValue: 'Valor Total',
    brand: 'Marca',
    specification: 'Especificação',
    observations: 'Observações',
    noItems: 'Nenhum item adicionado',
    contractLimits: 'Limites do Contrato',
    requestLimit: 'Limite de Requisições',
    conferenceLimit: 'Limite de Conferências',
    monthlyLimit: 'Limite Mensal (R$)',
    status: 'Status',
    active: 'Ativo',
    inactive: 'Inativo',
    fiscal: 'Fiscal do Contrato',
    fiscalDesignation: 'Data de Designação',
    fiscalNotes: 'Observações do Fiscal',
};

// Utility Functions
const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(num);
};

const calculateItemTotal = (quantidade: string, valorUnitario: string) => {
    const qty = parseFloat(quantidade) || 0;
    const value = parseFloat(valorUnitario) || 0;
    return qty * value;
};

const calculateContractTotal = (items: ContratoItemForm[]) => {
    return items.reduce((total, item) => {
        return total + calculateItemTotal(item.quantidade, item.valor_unitario);
    }, 0);
};

// Components
interface ContratoItemFormProps {
    item: ContratoItemForm;
    availableItems: Item[];
    onChange: (field: keyof ContratoItemForm, value: string) => void;
    onRemove: () => void;
}

function ContratoItemForm({ item, availableItems, onChange, onRemove }: ContratoItemFormProps) {
    const selectedItem = availableItems.find((i) => i.id.toString() === item.item_id);
    const totalValue = calculateItemTotal(item.quantidade, item.valor_unitario);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Item do Contrato</CardTitle>
                    <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`item-${item.id}`}>{MESSAGES.itemDescription}</Label>
                        <Select value={item.item_id} onValueChange={(value) => onChange('item_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder={MESSAGES.selectItem} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableItems.map((availableItem) => (
                                    <SelectItem key={availableItem.id} value={availableItem.id.toString()}>
                                        {availableItem.codigo} - {availableItem.descricao}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`quantidade-${item.id}`}>{MESSAGES.quantity}</Label>
                        <Input
                            id={`quantidade-${item.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.quantidade}
                            onChange={(e) => onChange('quantidade', e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`valor-${item.id}`}>{MESSAGES.unitValue}</Label>
                        <Input
                            id={`valor-${item.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.valor_unitario}
                            onChange={(e) => onChange('valor_unitario', e.target.value)}
                            placeholder="0,00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`marca-${item.id}`}>{MESSAGES.brand}</Label>
                        <Input
                            id={`marca-${item.id}`}
                            value={item.marca}
                            onChange={(e) => onChange('marca', e.target.value)}
                            placeholder="Marca do produto"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`especificacao-${item.id}`}>{MESSAGES.specification}</Label>
                        <Input
                            id={`especificacao-${item.id}`}
                            value={item.especificacao}
                            onChange={(e) => onChange('especificacao', e.target.value)}
                            placeholder="Especificações técnicas"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`observacoes-${item.id}`}>{MESSAGES.observations}</Label>
                        <Input
                            id={`observacoes-${item.id}`}
                            value={item.observacoes}
                            onChange={(e) => onChange('observacoes', e.target.value)}
                            placeholder="Observações adicionais"
                        />
                    </div>

                    {selectedItem && (
                        <div className="md:col-span-2 lg:col-span-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div className="flex items-center space-x-4">
                                    <Badge variant="outline">{selectedItem.codigo}</Badge>
                                    <span className="text-sm text-gray-600">{selectedItem.descricao}</span>
                                    <span className="text-sm text-gray-500">Un: {selectedItem.unidade_medida}</span>
                                </div>
                                <div className="text-sm font-medium">
                                    {MESSAGES.totalValue}: {formatCurrency(totalValue)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Main Component
export default function ContratosCreate({ fornecedores, processos, items, users }: ContratosCreateProps) {
    const [contratoItems, setContratoItems] = useState<ContratoItemForm[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        fornecedor_id: '',
        processo_licitatorio_id: '',
        numero_contrato: '',
        data_inicio: '',
        data_fim: '',
        limite_requisicoes: '',
        limite_conferencias: '',
        limite_valor_mensal: '',
        descricao: '',
        status: 'ativo',
        fiscal_id: '',
        data_designacao_fiscal: '',
        observacoes_fiscal: '',
        items: [] as ContratoItemForm[],
    });

    // Event handlers
    const handleAddItem = () => {
        const newItem: ContratoItemForm = {
            id: Date.now().toString(),
            item_id: '',
            quantidade: '',
            valor_unitario: '',
            marca: '',
            especificacao: '',
            observacoes: '',
        };
        setContratoItems([...contratoItems, newItem]);
    };

    const handleUpdateItem = (index: number, field: keyof ContratoItemForm, value: string) => {
        const updatedItems = [...contratoItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setContratoItems(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        setContratoItems(contratoItems.filter((_, i) => i !== index));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Filter out empty items
        const validItems = contratoItems.filter((item) => item.item_id && item.quantidade && item.valor_unitario);

        post(contratos.store(), {
            data: {
                ...data,
                items: validItems,
            },
        });
    };

    const contractTotal = calculateContractTotal(contratoItems);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Novo Contrato" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={contratos.index()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Novo Contrato</h1>
                            <p className="text-gray-600 dark:text-gray-400">Cadastre um novo contrato ou convênio</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contract Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Contrato</CardTitle>
                                <CardDescription>Dados básicos do contrato</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="numero_contrato">{MESSAGES.contractNumber} *</Label>
                                    <Input
                                        id="numero_contrato"
                                        value={data.numero_contrato}
                                        onChange={(e) => setData('numero_contrato', e.target.value)}
                                        placeholder="Ex: 001/2024"
                                        required
                                    />
                                    {errors.numero_contrato && <p className="text-sm text-red-600">{errors.numero_contrato}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fornecedor_id">{MESSAGES.supplier}</Label>
                                    <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um fornecedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">{MESSAGES.generalContract}</SelectItem>
                                            {fornecedores.map((fornecedor) => (
                                                <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                                    {fornecedor.razao_social}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fornecedor_id && <p className="text-sm text-red-600">{errors.fornecedor_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="processo_licitatorio_id">{MESSAGES.biddingProcess}</Label>
                                    <Select value={data.processo_licitatorio_id} onValueChange={(value) => setData('processo_licitatorio_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um processo (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {processos.map((processo) => (
                                                <SelectItem key={processo.id} value={processo.id.toString()}>
                                                    {processo.numero_processo} - {processo.objeto}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="data_inicio">{MESSAGES.startDate} *</Label>
                                        <Input
                                            id="data_inicio"
                                            type="date"
                                            value={data.data_inicio}
                                            onChange={(e) => setData('data_inicio', e.target.value)}
                                            required
                                        />
                                        {errors.data_inicio && <p className="text-sm text-red-600">{errors.data_inicio}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="data_fim">{MESSAGES.endDate} *</Label>
                                        <Input
                                            id="data_fim"
                                            type="date"
                                            value={data.data_fim}
                                            onChange={(e) => setData('data_fim', e.target.value)}
                                            required
                                        />
                                        {errors.data_fim && <p className="text-sm text-red-600">{errors.data_fim}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descricao">{MESSAGES.description}</Label>
                                    <Textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        placeholder="Descrição detalhada do contrato..."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">{MESSAGES.status}</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ativo">{MESSAGES.active}</SelectItem>
                                            <SelectItem value="inativo">{MESSAGES.inactive}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fiscal_id">{MESSAGES.fiscal}</Label>
                                    <Select value={data.fiscal_id} onValueChange={(value) => setData('fiscal_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um fiscal (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fiscal_id && <p className="text-sm text-red-600">{errors.fiscal_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data_designacao_fiscal">{MESSAGES.fiscalDesignation}</Label>
                                    <Input
                                        id="data_designacao_fiscal"
                                        type="date"
                                        value={data.data_designacao_fiscal}
                                        onChange={(e) => setData('data_designacao_fiscal', e.target.value)}
                                    />
                                    {errors.data_designacao_fiscal && <p className="text-sm text-red-600">{errors.data_designacao_fiscal}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observacoes_fiscal">{MESSAGES.fiscalNotes}</Label>
                                    <Textarea
                                        id="observacoes_fiscal"
                                        value={data.observacoes_fiscal}
                                        onChange={(e) => setData('observacoes_fiscal', e.target.value)}
                                        placeholder="Observações do fiscal do contrato..."
                                        rows={3}
                                    />
                                    {errors.observacoes_fiscal && <p className="text-sm text-red-600">{errors.observacoes_fiscal}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contract Limits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{MESSAGES.contractLimits}</CardTitle>
                                <CardDescription>Limites e restrições do contrato</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="limite_requisicoes">{MESSAGES.requestLimit}</Label>
                                    <Input
                                        id="limite_requisicoes"
                                        type="number"
                                        min="0"
                                        value={data.limite_requisicoes}
                                        onChange={(e) => setData('limite_requisicoes', e.target.value)}
                                        placeholder="Número máximo de requisições"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="limite_conferencias">{MESSAGES.conferenceLimit}</Label>
                                    <Input
                                        id="limite_conferencias"
                                        type="number"
                                        min="0"
                                        value={data.limite_conferencias}
                                        onChange={(e) => setData('limite_conferencias', e.target.value)}
                                        placeholder="Número máximo de conferências"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="limite_valor_mensal">{MESSAGES.monthlyLimit}</Label>
                                    <Input
                                        id="limite_valor_mensal"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.limite_valor_mensal}
                                        onChange={(e) => setData('limite_valor_mensal', e.target.value)}
                                        placeholder="0,00"
                                    />
                                </div>

                                {contractTotal > 0 && (
                                    <div className="p-4 bg-blue-50 rounded-md">
                                        <div className="text-sm">
                                            <p className="font-medium text-blue-900">Valor Total do Contrato</p>
                                            <p className="text-lg font-bold text-blue-900">{formatCurrency(contractTotal)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contract Items */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{MESSAGES.items}</CardTitle>
                                    <CardDescription>Adicione os itens que fazem parte do contrato</CardDescription>
                                </div>
                                <Button type="button" onClick={handleAddItem} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {MESSAGES.addItem}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {contratoItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>{MESSAGES.noItems}</p>
                                    <p className="text-sm">Clique em "Adicionar Item" para incluir itens no contrato</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {contratoItems.map((item, index) => (
                                        <ContratoItemForm
                                            key={item.id}
                                            item={item}
                                            availableItems={items}
                                            onChange={(field, value) => handleUpdateItem(index, field, value)}
                                            onRemove={() => handleRemoveItem(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" asChild>
                            <Link href={contratos.index()}>{MESSAGES.cancel}</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {MESSAGES.save}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
