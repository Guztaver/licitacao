import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Save, Upload, Plus, Trash2 } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId, useState, } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { requisicoes } from '@/routes';
import type { BreadcrumbItem, Destinatario, Emitente, Item, RequisicaoItem } from '@/types';

interface EditRequisicao {
    id: number;
    numero: string;
    emitente_id: number;
    destinatario_id: number;
    solicitante: string;
    numero_oficio?: string;
    data_recebimento?: string;
    descricao: string;
    anexo?: string;
    items?: RequisicaoItem[];
}

interface EditProps {
    requisicao: EditRequisicao;
    emitentes: Emitente[];
    destinatarios: Destinatario[];
    items: Item[];
}

interface FormData {
    numero: string;
    emitente_id: string;
    destinatario_id: string;
    solicitante: string;
    numero_oficio: string;
    data_recebimento: string;
    descricao: string;
    anexo: File | null;
    items: RequisicaoItem[];
}

export default function RequisicaoEdit({ requisicao, emitentes, destinatarios, items }: EditProps) {
    const numeroId = useId();
    const emitenteId = useId();
    const destinatarioId = useId();
    const solicitanteId = useId();
    const numeroOficioId = useId();
    const dataRecebimentoId = useId();
    const descricaoId = useId();
    const anexoId = useId();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Requisições',
            href: requisicoes.index(),
        },
        {
            title: `Editar Requisição ${requisicao.numero}`,
            href: requisicoes.edit(requisicao.id),
        },
    ];

    const { data, setData, post, processing, errors } = useForm<FormData>({
        numero: requisicao.numero || '',
        emitente_id: requisicao.emitente_id?.toString() || '',
        destinatario_id: requisicao.destinatario_id?.toString() || '',
        solicitante: requisicao.solicitante || '',
        numero_oficio: requisicao.numero_oficio || '',
        data_recebimento: requisicao.data_recebimento || '',
        descricao: requisicao.descricao || '',
        anexo: null,
        items: requisicao.items || [],
    });

    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantidade, setQuantidade] = useState<string>('');
    const [valorUnitario, setValorUnitario] = useState<string>('');
    const [observacao, setObservacao] = useState<string>('');

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(requisicoes.update(requisicao.id));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('anexo', file);
    };

    const addItem = () => {
        if (!selectedItemId || !quantidade || !valorUnitario) {
            return;
        }

        const itemExists = data.items.some((item) => item.item_id.toString() === selectedItemId);
        if (itemExists) {
            alert('Este item já foi adicionado à requisição.');
            return;
        }

        const newItem: RequisicaoItem = {
            item_id: parseInt(selectedItemId, 10),
            quantidade_solicitada: parseInt(quantidade, 10),
            valor_unitario_maximo: parseFloat(valorUnitario),
            observacao: observacao || undefined,
        };

        setData('items', [...data.items, newItem]);
        setSelectedItemId('');
        setQuantidade('');
        setValorUnitario('');
        setObservacao('');
    };

    const removeItem = (itemId: number) => {
        setData(
            'items',
            data.items.filter((item) => item.item_id !== itemId)
        );
    };

    const getItemById = (itemId: number) => {
        return items.find((item) => item.id === itemId);
    };

    const getTotalValue = (item: RequisicaoItem) => {
        return item.quantidade_solicitada * item.valor_unitario_maximo;
    };

    const getTotalRequisicao = () => {
        return data.items.reduce((total, item) => total + getTotalValue(item), 0);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Requisição ${requisicao.numero}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={requisicoes.show(requisicao.id)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Editar Requisição {requisicao.numero}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Atualize as informações da requisição</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Informações da Requisição
                            </CardTitle>
                            <CardDescription>Atualize as informações da requisição. Campos marcados com * são obrigatórios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Número da Requisição */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={numeroId}>Número da Requisição *</Label>
                                    <Input
                                        id={numeroId}
                                        type="text"
                                        value={data.numero}
                                        onChange={(e) => setData('numero', e.target.value)}
                                        placeholder="Ex: 001/2024"
                                        required
                                        className={errors.numero ? 'border-red-500' : ''}
                                    />
                                    {errors.numero && <p className="text-sm text-red-500">{errors.numero}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={dataRecebimentoId}>Data de Recebimento *</Label>
                                    <Input
                                        id={dataRecebimentoId}
                                        type="date"
                                        value={data.data_recebimento}
                                        onChange={(e) => setData('data_recebimento', e.target.value)}
                                        required
                                        className={errors.data_recebimento ? 'border-red-500' : ''}
                                    />
                                    {errors.data_recebimento && <p className="text-sm text-red-500">{errors.data_recebimento}</p>}
                                </div>
                            </div>

                            {/* Emitente e Destinatário */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={emitenteId}>Emitente *</Label>
                                    <Select value={data.emitente_id} onValueChange={(value) => setData('emitente_id', value)} required>
                                        <SelectTrigger className={errors.emitente_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecione um emitente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {emitentes && emitentes.length > 0 ? (
                                                emitentes.map((emitente) => (
                                                    <SelectItem key={emitente.id} value={emitente.id.toString()}>
                                                        {emitente.sigla} - {emitente.nome}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-emitente" disabled>
                                                    Nenhum emitente disponível
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.emitente_id && <p className="text-sm text-red-500">{errors.emitente_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={destinatarioId}>Destinatário *</Label>
                                    <Select value={data.destinatario_id} onValueChange={(value) => setData('destinatario_id', value)} required>
                                        <SelectTrigger className={errors.destinatario_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecione um destinatário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {destinatarios && destinatarios.length > 0 ? (
                                                destinatarios.map((destinatario) => (
                                                    <SelectItem key={destinatario.id} value={destinatario.id.toString()}>
                                                        {destinatario.sigla} - {destinatario.nome}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-destinatario" disabled>
                                                    Nenhum destinatário disponível
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.destinatario_id && <p className="text-sm text-red-500">{errors.destinatario_id}</p>}
                                </div>
                            </div>

                            {/* Solicitante e Número do Ofício */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={solicitanteId}>Solicitante *</Label>
                                    <Input
                                        id={solicitanteId}
                                        type="text"
                                        value={data.solicitante}
                                        onChange={(e) => setData('solicitante', e.target.value)}
                                        placeholder="Nome do solicitante"
                                        required
                                        className={errors.solicitante ? 'border-red-500' : ''}
                                    />
                                    {errors.solicitante && <p className="text-sm text-red-500">{errors.solicitante}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={numeroOficioId}>Número do Ofício</Label>
                                    <Input
                                        id={numeroOficioId}
                                        type="text"
                                        value={data.numero_oficio}
                                        onChange={(e) => setData('numero_oficio', e.target.value)}
                                        placeholder="Ex: OF-001/2024"
                                        className={errors.numero_oficio ? 'border-red-500' : ''}
                                    />
                                    {errors.numero_oficio && <p className="text-sm text-red-500">{errors.numero_oficio}</p>}
                                </div>
                            </div>

                            <Separator />

                            {/* Descrição */}
                            <div className="space-y-2">
                                <Label htmlFor={descricaoId}>Descrição *</Label>
                                <Textarea
                                    id={descricaoId}
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                    placeholder="Descreva detalhadamente o que está sendo solicitado..."
                                    rows={4}
                                    required
                                    className={errors.descricao ? 'border-red-500' : ''}
                                />
                                {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                            </div>

                            {/* Anexo */}
                            <div className="space-y-2">
                                <Label htmlFor={anexoId}>Anexo</Label>
                                {requisicao.anexo && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Anexo atual: {requisicao.anexo.split('/').pop()}</p>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id={anexoId}
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className={errors.anexo ? 'border-red-500' : ''}
                                    />
                                    <Upload className="h-4 w-4 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500">Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamanho máximo: 10MB</p>
                                {data.anexo && <p className="text-sm text-green-600">Novo arquivo selecionado: {data.anexo.name}</p>}
                                {errors.anexo && <p className="text-sm text-red-500">{errors.anexo}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Itens da Requisição *
                            </CardTitle>
                            <CardDescription>
                                Gerencie os itens que serão solicitados nesta requisição com suas quantidades e valores máximos permitidos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add Item Form */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Adicionar Item</h3>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label>Item *</Label>
                                        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {items && items.length > 0 ? (
                                                    items.map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>
                                                            {item.code} - {item.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-item" disabled>
                                                        Nenhum item disponível
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Quantidade *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={quantidade}
                                            onChange={(e) => setQuantidade(e.target.value)}
                                            placeholder="Ex: 10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Valor Unitário Máximo *</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={valorUnitario}
                                            onChange={(e) => setValorUnitario(e.target.value)}
                                            placeholder="Ex: 15.50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Observação</Label>
                                        <Input
                                            type="text"
                                            value={observacao}
                                            onChange={(e) => setObservacao(e.target.value)}
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Button type="button" onClick={addItem} size="sm" disabled={!selectedItemId || !quantidade || !valorUnitario}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar Item
                                    </Button>
                                </div>
                            </div>

                            {errors.items && typeof errors.items === 'string' && <p className="text-sm text-red-500">{errors.items}</p>}

                            {/* Items List */}
                            {data.items.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Itens Adicionados ({data.items.length})</h3>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">Código</th>
                                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">Nome</th>
                                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">Un. Medida</th>
                                                    <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">Quantidade</th>
                                                    <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                        Valor Unitário
                                                    </th>
                                                    <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">Valor Total</th>
                                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">Observação</th>
                                                    <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {data.items.map((item) => {
                                                    const itemDetails = getItemById(item.item_id);
                                                    return (
                                                        <tr key={item.item_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{itemDetails?.code}</td>
                                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{itemDetails?.name}</td>
                                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                                {itemDetails?.unit_of_measurement}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                                                {item.quantidade_solicitada}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                                                {formatCurrency(item.valor_unitario_maximo)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                                {formatCurrency(getTotalValue(item))}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.observacao || '-'}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeItem(item.item_id)}
                                                                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="border-t-2 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100">
                                                        Total da Requisição:
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(getTotalRequisicao())}
                                                    </td>
                                                    <td colSpan={2}></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Nenhum item adicionado ainda. Adicione pelo menos um item para continuar.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={requisicoes.show(requisicao.id)}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
