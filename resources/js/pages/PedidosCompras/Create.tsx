import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calculator, Plus, Save, Trash2, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PriceResearchModal from '@/components/ui/price-research-modal';
import AppLayout from '@/layouts/app-layout';
import { pedidosCompras } from '@/routes';
import type { BreadcrumbItem, Secretaria, Fornecedor, Contrato, Item } from '@/types';

// Types
interface PedidoItemForm {
    id?: string;
    item_id: string;
    descricao_material: string;
    quantidade: string;
    unidade_medida: string;
    valor_unitario_estimado: string;
    especificacoes: string;
    observacoes: string;
}

interface PedidosComprasCreateProps {
    secretarias: Secretaria[];
    fornecedores: Fornecedor[];
    contratos: Contrato[];
    items: Item[];
    numero_pedido: string;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Pedidos de Compra',
        href: pedidosCompras.index(),
    },
    {
        title: 'Novo Pedido',
        href: pedidosCompras.create(),
    },
];

const MESSAGES = {
    required: 'Este campo é obrigatório',
    positiveNumber: 'Este valor deve ser maior que zero',
    selectItem: 'Selecione um item',
    addItem: 'Adicionar Item',
    removeItem: 'Remover',
    save: 'Salvar Pedido',
    saveDraft: 'Salvar Rascunho',
    cancel: 'Cancelar',
    pedidoNumber: 'Número do Pedido',
    secretaria: 'Secretaria',
    fornecedor: 'Fornecedor',
    contrato: 'Contrato Vinculado',
    title: 'Título do Pedido',
    description: 'Descrição Detalhada',
    justification: 'Justificativa',
    necessityDate: 'Data da Necessidade',
    priority: 'Prioridade',
    observations: 'Observações',
    items: 'Itens do Pedido',
    itemCode: 'Código',
    itemDescription: 'Descrição do Material',
    quantity: 'Quantidade',
    unitMeasure: 'Unidade',
    unitValue: 'Valor Unitário Estimado',
    totalValue: 'Valor Total',
    specifications: 'Especificações',
    itemObservations: 'Observações do Item',
    noItems: 'Nenhum item adicionado',
    estimatedTotal: 'Valor Total Estimado',
    sendForApproval: 'Enviar para Aprovação',
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
    allFornecedores: 'Selecione um fornecedor (opcional)',
    noContract: 'Sem contrato',
    allSecretarias: 'Selecione uma secretaria',
};

const PRIORIDADE_OPTIONS = [
    { value: 'baixa', label: MESSAGES.low },
    { value: 'normal', label: MESSAGES.normal },
    { value: 'alta', label: MESSAGES.high },
    { value: 'urgente', label: MESSAGES.urgent },
];

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

const calculateContractTotal = (items: PedidoItemForm[]) => {
    return items.reduce((total, item) => {
        return total + calculateItemTotal(item.quantidade, item.valor_unitario_estimado);
    }, 0);
};

// Components
interface PedidoItemFormProps {
    item: PedidoItemForm;
    availableItems: Item[];
    onChange: (field: keyof PedidoItemForm, value: string) => void;
    onRemove: () => void;
}

function PedidoItemForm({ item, availableItems, onChange, onRemove }: PedidoItemFormProps) {
    const [showPriceModal, setShowPriceModal] = useState(false);
    const selectedItem = availableItems.find((i) => i.id.toString() === item.item_id);
    const totalValue = calculateItemTotal(item.quantidade, item.valor_unitario_estimado);

    // Auto-fill fields when item is selected
    const handleItemChange = (value: string) => {
        onChange('item_id', value);
        const selected = availableItems.find((i) => i.id.toString() === value);
        if (selected) {
            onChange('descricao_material', selected.descricao);
            onChange('unidade_medida', selected.unidade_medida);
        }
    };

    // Handle proposal selection from price research
    const handleSelectProposal = (proposal: any) => {
        // Fill form with data from selected proposal
        onChange('descricao_material', proposal.itemDescription);
        onChange('valor_unitario_estimado', proposal.unitPrice.toString());
        onChange('especificacoes', `Fornecedor: ${proposal.supplierName}`);

        // Try to find a matching item from available items
        const matchingItem = availableItems.find(availableItem =>
            availableItem.descricao.toLowerCase().includes(proposal.itemDescription.toLowerCase().split(' ').slice(0, 2).join(' '))
        );

        if (matchingItem) {
            onChange('item_id', matchingItem.id.toString());
            onChange('unidade_medida', matchingItem.unidade_medida);
        } else {
            // Use data from proposal if no matching item found
            onChange('unidade_medida', 'UN'); // Default unit
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Item do Pedido</CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}`}>{MESSAGES.itemDescription}</Label>
                            <Select value={item.item_id} onValueChange={handleItemChange}>
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
                                step="0.001"
                                min="0"
                                value={item.quantidade}
                                onChange={(e) => onChange('quantidade', e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`valor-${item.id}`}>{MESSAGES.unitValue}</Label>
                            <div className="flex gap-2">
                                <Input
                                    id={`valor-${item.id}`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.valor_unitario_estimado}
                                    onChange={(e) => onChange('valor_unitario_estimado', e.target.value)}
                                    placeholder="0,00"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPriceModal(true)}
                                    className="whitespace-nowrap"
                                    title="Pesquisar preços no PNCP"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`unidade-medida-${item.id}`}>{MESSAGES.unitMeasure}</Label>
                            <Input
                                id={`unidade-medida-${item.id}`}
                                value={item.unidade_medida}
                                onChange={(e) => onChange('unidade_medida', e.target.value)}
                                placeholder="Unidade de medida"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`especificacoes-${item.id}`}>{MESSAGES.specifications}</Label>
                            <Input
                                id={`especificacoes-${item.id}`}
                                value={item.especificacoes}
                                onChange={(e) => onChange('especificacoes', e.target.value)}
                                placeholder="Especificações técnicas"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`observacoes-item-${item.id}`}>{MESSAGES.itemObservations}</Label>
                            <Input
                                id={`observacoes-item-${item.id}`}
                                value={item.observacoes}
                                onChange={(e) => onChange('observacoes', e.target.value)}
                                placeholder="Observações do item"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <Label htmlFor={`descricao-material-${item.id}`}>{MESSAGES.itemDescription}</Label>
                            <Textarea
                                id={`descricao-material-${item.id}`}
                                value={item.descricao_material}
                                onChange={(e) => onChange('descricao_material', e.target.value)}
                                placeholder="Descrição detalhada do material"
                                rows={2}
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

            {/* Price Research Modal */}
            <PriceResearchModal
                open={showPriceModal}
                onOpenChange={setShowPriceModal}
                onSelectProposal={handleSelectProposal}
            />
        </>
    );
}

// Main Component
export default function PedidosComprasCreate({ secretarias, fornecedores, contratos, items, numero_pedido }: PedidosComprasCreateProps) {
    const [pedidoItems, setPedidoItems] = useState<PedidoItemForm[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        secretaria_id: '',
        fornecedor_id: '',
        contrato_id: '',
        titulo: '',
        descricao: '',
        justificativa: '',
        data_necessidade: '',
        prioridade: 'normal',
        observacoes: '',
        items: [] as PedidoItemForm[],
    });

    // Event handlers
    const handleAddItem = () => {
        const newItem: PedidoItemForm = {
            id: Date.now().toString(),
            item_id: '',
            descricao_material: '',
            quantidade: '',
            unidade_medida: '',
            valor_unitario_estimado: '',
            especificacoes: '',
            observacoes: '',
        };
        setPedidoItems([...pedidoItems, newItem]);
    };

    const handleUpdateItem = (index: number, field: keyof PedidoItemForm, value: string) => {
        const updatedItems = [...pedidoItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setPedidoItems(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        setPedidoItems(pedidoItems.filter((_, i) => i !== index));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Filter out empty items
        const validItems = pedidoItems.filter(
            (item) => item.item_id && item.quantidade && item.valor_unitario_estimado && item.descricao_material
        );

        post(pedidosCompras.store(), {
            ...data,
            items: validItems,
        }, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const contractTotal = calculateContractTotal(pedidoItems);
    const hasValidItems = pedidoItems.some(
        (item) => item.item_id && item.quantidade && item.valor_unitario_estimado && item.descricao_material
    );

    // Filter fornecedores based on selected contract
    const availableFornecedores = data.contrato_id
        ? fornecedores.filter((f) => {
              const contrato = contratos.find((c) => c.id.toString() === data.contrato_id);
              return contrato && contrato.fornecedor_id === f.id;
          })
        : fornecedores;

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Novo Pedido de Compra" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Success Message */}
                {showSuccess && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Pedido criado com sucesso!</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={pedidosCompras.index()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Novo Pedido de Compra</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {MESSAGES.pedidoNumber}: {numero_pedido}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Informações do Pedido</CardTitle>
                                <CardDescription>Dados básicos do pedido de compra</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="secretaria_id">{MESSAGES.secretaria} *</Label>
                                    <Select value={data.secretaria_id} onValueChange={(value) => setData('secretaria_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={MESSAGES.allSecretarias} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {secretarias.map((secretaria) => (
                                                <SelectItem key={secretaria.id} value={secretaria.id.toString()}>
                                                    {secretaria.sigla} - {secretaria.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.secretaria_id && <p className="text-sm text-red-600">{errors.secretaria_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="titulo">{MESSAGES.title} *</Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        placeholder="Título descritivo do pedido"
                                    />
                                    {errors.titulo && <p className="text-sm text-red-600">{errors.titulo}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descricao">{MESSAGES.description} *</Label>
                                    <Textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        placeholder="Descrição detalhada do pedido..."
                                        rows={3}
                                    />
                                    {errors.descricao && <p className="text-sm text-red-600">{errors.descricao}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="justificativa">{MESSAGES.justification}</Label>
                                    <Textarea
                                        id="justificativa"
                                        value={data.justificativa}
                                        onChange={(e) => setData('justificativa', e.target.value)}
                                        placeholder="Justificativa para a compra..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="data_necessidade">{MESSAGES.necessityDate}</Label>
                                        <Input
                                            id="data_necessidade"
                                            type="date"
                                            value={data.data_necessidade}
                                            onChange={(e) => setData('data_necessidade', e.target.value)}
                                        />
                                        {errors.data_necessidade && <p className="text-sm text-red-600">{errors.data_necessidade}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prioridade">{MESSAGES.priority}</Label>
                                        <Select value={data.prioridade} onValueChange={(value) => setData('prioridade', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRIORIDADE_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observacoes">{MESSAGES.observations}</Label>
                                    <Textarea
                                        id="observacoes"
                                        value={data.observacoes}
                                        onChange={(e) => setData('observacoes', e.target.value)}
                                        placeholder="Observações adicionais..."
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Supplier and Contract Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fornecedor e Contrato</CardTitle>
                                <CardDescription>Informações de fornecimento</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contrato_id">{MESSAGES.contrato}</Label>
                                    <Select
                                        value={data.contrato_id}
                                        onValueChange={(value) => {
                                            setData('contrato_id', value);
                                            setData('fornecedor_id', '');
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={MESSAGES.noContract} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{MESSAGES.noContract}</SelectItem>
                                            {contratos.map((contrato) => (
                                                <SelectItem key={contrato.id} value={contrato.id.toString()}>
                                                    {contrato.numero_contrato}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fornecedor_id">{MESSAGES.fornecedor}</Label>
                                    <Select
                                        value={data.fornecedor_id}
                                        onValueChange={(value) => setData('fornecedor_id', value)}
                                        disabled={!!data.contrato_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={MESSAGES.allFornecedores} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableFornecedores.map((fornecedor) => (
                                                <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                                    {fornecedor.razao_social}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {data.contrato_id && <p className="text-xs text-gray-500">Fornecedor definido pelo contrato selecionado</p>}
                                </div>

                                {contractTotal > 0 && (
                                    <div className="p-4 bg-blue-50 rounded-md">
                                        <div className="text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calculator className="h-4 w-4" />
                                                <p className="font-medium text-blue-900">{MESSAGES.estimatedTotal}</p>
                                            </div>
                                            <p className="text-lg font-bold text-blue-900">{formatCurrency(contractTotal)}</p>
                                            <p className="text-xs text-blue-700">{pedidoItems.length} item(s) adicionado(s)</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{MESSAGES.items}</CardTitle>
                                    <CardDescription>Adicione os itens que fazem parte do pedido</CardDescription>
                                </div>
                                <Button type="button" onClick={handleAddItem} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {MESSAGES.addItem}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {pedidoItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>{MESSAGES.noItems}</p>
                                    <p className="text-sm">Clique em "Adicionar Item" para incluir itens no pedido</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pedidoItems.map((item, index) => (
                                        <PedidoItemForm
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
                            <Link href={pedidosCompras.index()}>{MESSAGES.cancel}</Link>
                        </Button>
                        <Button type="submit" disabled={processing || !hasValidItems}>
                            <Save className="mr-2 h-4 w-4" />
                            {MESSAGES.saveDraft}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
