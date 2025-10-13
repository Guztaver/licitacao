import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentArrowDownIcon,
    BellIcon,
} from '@heroicons/react/24/outline';
import { dispensaService, categoryService, alertaService, biddingUtils } from '@/services/bidding';
import type {
    DispensaLicitacao,
    CategoriaMaterial,
    LimiteDispensaAlerta,
    CreateDispensaData,
    DispensaFilters,
    AlertaFilters,
    DispensaValidation,
} from '@/types/bidding';
import Layout from '@/layouts/MainLayout';

interface Props {
    dispensas: DispensaLicitacao[];
    categorias: CategoriaMaterial[];
    alertas: LimiteDispensaAlerta[];
}

export default function DispensasPage({ dispensas: initialDispensas, categorias: initialCategorias, alertas: initialAlertas }: Props) {
    const [dispensas, setDispensas] = useState<DispensaLicitacao[]>(initialDispensas);
    const [categorias, setCategorias] = useState<CategoriaMaterial[]>(initialCategorias);
    const [alertas, setAlertas] = useState<LimiteDispensaAlerta[]>(initialAlertas);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<DispensaFilters>({});
    const [alertaFilters, setAlertaFilters] = useState<AlertaFilters>({});
    const [activeTab, setActiveTab] = useState('dispensas');

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [selectedDispensa, setSelectedDispensa] = useState<DispensaLicitacao | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    // Form data
    const [formData, setFormData] = useState<CreateDispensaData>({
        numero: '',
        categoria_material_id: 0,
        valor: 0,
        objeto: '',
        fundamentacao_legal: '',
        data_dispensa: new Date().toISOString().split('T')[0],
        responsavel: '',
        unidade_administrativa: '',
        periodo: 'mensal',
        referencia_mes: new Date().getMonth() + 1,
        referencia_ano: new Date().getFullYear(),
    });

    // Validation state
    const [validation, setValidation] = useState<DispensaValidation | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        carregarDados();
    }, [filters, activeTab]);

    useEffect(() => {
        if (activeTab === 'alertas') {
            carregarAlertas();
        }
    }, [alertaFilters, activeTab]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [dispensasData, categoriasData] = await Promise.all([dispensaService.listar(filters), categoryService.listar()]);
            setDispensas(dispensasData);
            setCategorias(categoriasData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarAlertas = async () => {
        try {
            const alertasData = await alertaService.listar(alertaFilters);
            setAlertas(alertasData);
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
        }
    };

    const validarDispensa = async () => {
        if (!formData.categoria_material_id || !formData.valor) return;

        setIsValidating(true);
        try {
            const validationData = await dispensaService.validar(formData);
            setValidation(validationData);
        } catch (error) {
            console.error('Erro na validação:', error);
            setValidation(null);
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        if (formData.categoria_material_id && formData.valor > 0) {
            validarDispensa();
        } else {
            setValidation(null);
        }
    }, [formData.categoria_material_id, formData.valor, formData.periodo, formData.referencia_ano, formData.referencia_mes]);

    const handleCreate = async () => {
        if (validation?.pode_gerar === false) {
            alert('Não é possível gerar esta dispensa: ' + validation?.mensagem);
            return;
        }

        try {
            const novaDispensa = await dispensaService.criar(formData);
            setDispensas([...dispensas, novaDispensa]);
            setIsCreateDialogOpen(false);
            resetForm();

            // Recarregar dados para atualizar alertas
            carregarDados();
            carregarAlertas();
        } catch (error) {
            console.error('Erro ao criar dispensa:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedDispensa) return;

        try {
            const dispensaAtualizada = await dispensaService.atualizar(selectedDispensa.id, formData);
            setDispensas(dispensas.map((disp) => (disp.id === dispensaAtualizada.id ? dispensaAtualizada : disp)));
            setIsEditDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error('Erro ao atualizar dispensa:', error);
        }
    };

    const handleCancel = async () => {
        if (!selectedDispensa || !cancelReason.trim()) return;

        try {
            const dispensaCancelada = await dispensaService.cancelar(selectedDispensa.id, cancelReason);
            setDispensas(dispensas.map((disp) => (disp.id === dispensaCancelada.id ? dispensaCancelada : disp)));
            setIsCancelDialogOpen(false);
            setCancelReason('');
        } catch (error) {
            console.error('Erro ao cancelar dispensa:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta dispensa?')) return;

        try {
            await dispensaService.excluir(id);
            setDispensas(dispensas.filter((disp) => disp.id !== id));
        } catch (error) {
            console.error('Erro ao excluir dispensa:', error);
        }
    };

    const handleView = (dispensa: DispensaLicitacao) => {
        setSelectedDispensa(dispensa);
        setIsViewDialogOpen(true);
    };

    const handleEdit = (dispensa: DispensaLicitacao) => {
        setSelectedDispensa(dispensa);
        setFormData({
            numero: dispensa.numero,
            categoria_material_id: dispensa.categoria_material_id,
            valor: dispensa.valor,
            objeto: dispensa.objeto,
            fundamentacao_legal: dispensa.fundamentacao_legal,
            data_dispensa: dispensa.data_dispensa,
            responsavel: dispensa.responsavel,
            unidade_administrativa: dispensa.unidade_administrativa,
            periodo: dispensa.periodo,
            referencia_mes: dispensa.referencia_mes,
            referencia_ano: dispensa.referencia_ano,
        });
        setIsEditDialogOpen(true);
    };

    const handleCancelClick = (dispensa: DispensaLicitacao) => {
        setSelectedDispensa(dispensa);
        setIsCancelDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            numero: '',
            categoria_material_id: 0,
            valor: 0,
            objeto: '',
            fundamentacao_legal: '',
            data_dispensa: new Date().toISOString().split('T')[0],
            responsavel: '',
            unidade_administrativa: '',
            periodo: 'mensal',
            referencia_mes: new Date().getMonth() + 1,
            referencia_ano: new Date().getFullYear(),
        });
        setSelectedDispensa(null);
        setValidation(null);
    };

    const getStatusBadge = (dispensa: DispensaLicitacao) => {
        switch (dispensa.status) {
            case 'ativa':
                return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
            case 'cancelada':
                return <Badge variant="destructive">Cancelada</Badge>;
            case 'suspensa':
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Suspensa
                    </Badge>
                );
            default:
                return <Badge variant="outline">Desconhecido</Badge>;
        }
    };

    const getAlertaBadge = (alerta: LimiteDispensaAlerta) => {
        const baseClasses = 'text-white';
        switch (alerta.tipo_alerta) {
            case 'critical':
                return <Badge className={`${baseClasses} bg-red-600`}>Crítico</Badge>;
            case 'error':
                return <Badge className={`${baseClasses} bg-orange-600`}>Erro</Badge>;
            case 'warning':
                return <Badge className={`${baseClasses} bg-yellow-600`}>Alerta</Badge>;
            default:
                return <Badge variant="outline">Info</Badge>;
        }
    };

    const marcarAlertaComoLida = async (id: number) => {
        try {
            await alertaService.marcarComoLida(id);
            setAlertas(alertas.map((alerta) => (alerta.id === id ? { ...alerta, lida: true } : alerta)));
        } catch (error) {
            console.error('Erro ao marcar alerta como lida:', error);
        }
    };

    const marcarTodosAlertasComoLidos = async () => {
        try {
            await alertaService.marcarTodasComoLidas();
            carregarAlertas();
        } catch (error) {
            console.error('Erro ao marcar todos os alertas como lidos:', error);
        }
    };

    return (
        <Layout>
            <Head title="Dispensas de Licitação" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dispensas de Licitação</h1>
                        <p className="text-gray-600 mt-2">Gerencie as dispensas e monitore os limites de uso por categoria</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Nova Dispensa
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Nova Dispensa de Licitação</DialogTitle>
                                <DialogDescription>Preencha os dados da dispensa. O sistema validará os limites automaticamente.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="numero">Número</Label>
                                        <Input
                                            id="numero"
                                            value={formData.numero}
                                            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                            placeholder="Ex: 001/2024"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="data_dispensa">Data da Dispensa</Label>
                                        <Input
                                            id="data_dispensa"
                                            type="date"
                                            value={formData.data_dispensa}
                                            onChange={(e) => setFormData({ ...formData, data_dispensa: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="valor">Valor (R$)</Label>
                                        <Input
                                            id="valor"
                                            type="number"
                                            step="0.01"
                                            value={formData.valor}
                                            onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="categoria_material_id">Categoria</Label>
                                        <Select
                                            value={formData.categoria_material_id.toString()}
                                            onValueChange={(value) => setFormData({ ...formData, categoria_material_id: Number(value) })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                        {categoria.nome} ({categoria.tipo})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="periodo">Período de Referência</Label>
                                        <Select
                                            value={formData.periodo}
                                            onValueChange={(value: 'anual' | 'mensal') => setFormData({ ...formData, periodo: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mensal">Mensal</SelectItem>
                                                <SelectItem value="anual">Anual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {formData.periodo === 'mensal' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="referencia_mes">Mês de Referência</Label>
                                            <Select
                                                value={formData.referencia_mes?.toString()}
                                                onValueChange={(value) => setFormData({ ...formData, referencia_mes: Number(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                            {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="referencia_ano">Ano de Referência</Label>
                                            <Input
                                                id="referencia_ano"
                                                type="number"
                                                value={formData.referencia_ano}
                                                onChange={(e) => setFormData({ ...formData, referencia_ano: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="objeto">Objeto</Label>
                                    <Textarea
                                        id="objeto"
                                        value={formData.objeto}
                                        onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
                                        placeholder="Descreva o objeto da dispensa..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="fundamentacao_legal">Fundamentação Legal</Label>
                                    <Textarea
                                        id="fundamentacao_legal"
                                        value={formData.fundamentacao_legal}
                                        onChange={(e) => setFormData({ ...formData, fundamentacao_legal: e.target.value })}
                                        placeholder="Informe a fundamentação legal (ex: Lei 14.133/21, Art. 75, inciso II)..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="responsavel">Responsável</Label>
                                        <Input
                                            id="responsavel"
                                            value={formData.responsavel}
                                            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                                            placeholder="Nome do responsável"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="unidade_administrativa">Unidade Administrativa</Label>
                                        <Input
                                            id="unidade_administrativa"
                                            value={formData.unidade_administrativa}
                                            onChange={(e) => setFormData({ ...formData, unidade_administrativa: e.target.value })}
                                            placeholder="Setor/unidade solicitante"
                                        />
                                    </div>
                                </div>

                                {/* Validation Result */}
                                {validation && (
                                    <Alert className={validation.pode_gerar ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                                        <div className="flex items-center">
                                            {validation.pode_gerar ? (
                                                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                                            ) : (
                                                <XCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                                            )}
                                            <AlertTitle className={validation.pode_gerar ? 'text-green-800' : 'text-red-800'}>
                                                {validation.pode_gerar ? 'Validação Aprovada' : 'Validação Reprovada'}
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className={validation.pode_gerar ? 'text-green-700' : 'text-red-700'}>
                                            {validation.pode_gerar ? (
                                                <div>
                                                    • A dispensa pode ser gerada
                                                    <br />
                                                    {validation.atingira_alerta && (
                                                        <span className="text-yellow-700 font-medium">
                                                            ⚠️ Atenção: Esta dispensa irá gerar um alerta de limite
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    • {validation.mensagem || 'Esta dispensa excede os limites permitidos'}
                                                    <br />• Valor excedido: {biddingUtils.formatarMoeda(validation.valor_excedido)}
                                                    <br />• Verifique os limites da categoria selecionada
                                                </div>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreate} disabled={!validation?.pode_gerar || isValidating}>
                                    {isValidating ? 'Validando...' : 'Criar Dispensa'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="dispensas">Dispensas ({dispensas.length})</TabsTrigger>
                        <TabsTrigger value="alertas">Alertas ({alertas.filter((a) => !a.lida).length} não lidos)</TabsTrigger>
                        <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dispensas" className="space-y-4">
                        {/* Filtros de Dispensas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 items-end flex-wrap">
                                    <div className="flex-1 min-w-48">
                                        <Label htmlFor="search_dispensa">Buscar</Label>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="search_dispensa"
                                                placeholder="Número, objeto..."
                                                value={filters.search || ''}
                                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="categoria_filtro">Categoria</Label>
                                        <Select
                                            value={filters.categoria_id?.toString() || ''}
                                            onValueChange={(value) => setFilters({ ...filters, categoria_id: value ? Number(value) : undefined })}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Todas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todas</SelectItem>
                                                {categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                        {categoria.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="status_filtro">Status</Label>
                                        <Select
                                            value={filters.status || ''}
                                            onValueChange={(value) => setFilters({ ...filters, status: (value as any) || undefined })}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="ativa">Ativas</SelectItem>
                                                <SelectItem value="cancelada">Canceladas</SelectItem>
                                                <SelectItem value="suspensa">Suspensas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button variant="outline" onClick={() => setFilters({})}>
                                        Limpar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lista de Dispensas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dispensas Cadastradas</CardTitle>
                                <CardDescription>{dispensas.length} dispensas encontradas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Número</TableHead>
                                                <TableHead>Categoria</TableHead>
                                                <TableHead>Valor</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Responsável</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dispensas.map((dispensa) => (
                                                <TableRow key={dispensa.id}>
                                                    <TableCell className="font-medium">{dispensa.numero}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{dispensa.categoria_material?.nome}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {dispensa.periodo === 'mensal'
                                                                    ? `Mês: ${dispensa.referencia_mes}/${dispensa.referencia_ano}`
                                                                    : `Ano: ${dispensa.referencia_ano}`}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{biddingUtils.formatarMoeda(dispensa.valor)}</TableCell>
                                                    <TableCell>{biddingUtils.formatarData(dispensa.data_dispensa)}</TableCell>
                                                    <TableCell>{dispensa.responsavel}</TableCell>
                                                    <TableCell>{getStatusBadge(dispensa)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="sm" onClick={() => handleView(dispensa)}>
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(dispensa)}
                                                                disabled={dispensa.status !== 'ativa'}
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleCancelClick(dispensa)}
                                                                disabled={dispensa.status !== 'ativa'}
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                <XCircleIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(dispensa.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alertas" className="space-y-4">
                        {/* Filtros de Alertas */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Alertas de Limites</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={marcarTodosAlertasComoLidos}
                                        disabled={alertas.filter((a) => !a.lida).length === 0}
                                    >
                                        <BellIcon className="h-4 w-4 mr-2" />
                                        Marcar todos como lidos
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 items-end flex-wrap">
                                    <div>
                                        <Label htmlFor="tipo_alerta_filtro">Tipo</Label>
                                        <Select
                                            value={alertaFilters.tipo_alerta || ''}
                                            onValueChange={(value) =>
                                                setAlertaFilters({ ...alertaFilters, tipo_alerta: (value as any) || undefined })
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="warning">Alerta</SelectItem>
                                                <SelectItem value="error">Erro</SelectItem>
                                                <SelectItem value="critical">Crítico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="lida_filtro">Status</Label>
                                        <Select
                                            value={alertaFilters.lida === undefined ? '' : alertaFilters.lida.toString()}
                                            onValueChange={(value) =>
                                                setAlertaFilters({ ...alertaFilters, lida: value === '' ? undefined : value === 'true' })
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="false">Não lidos</SelectItem>
                                                <SelectItem value="true">Lidos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="periodo_filtro">Período</Label>
                                        <Select
                                            value={alertaFilters.periodo || ''}
                                            onValueChange={(value) => setAlertaFilters({ ...alertaFilters, periodo: (value as any) || undefined })}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="mensal">Mensal</SelectItem>
                                                <SelectItem value="anual">Anual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lista de Alertas */}
                        <Card>
                            <CardContent className="p-0">
                                {alertas.length === 0 ? (
                                    <div className="text-center py-12">
                                        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum alerta encontrado</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Os alertas aparecerão aqui quando os limites forem aproximados ou excedidos.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {alertas.map((alerta) => (
                                            <div
                                                key={alerta.id}
                                                className={`p-4 ${!alerta.lida ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {getAlertaBadge(alerta)}
                                                            <span className="text-sm text-gray-500">
                                                                {biddingUtils.formatarData(alerta.created_at)}
                                                            </span>
                                                            {!alerta.lida && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Novo
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-sm font-medium text-gray-900 mb-1">{alerta.categoria_material?.nome}</h4>
                                                        <p className="text-sm text-gray-600 mb-2">{alerta.mensagem}</p>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-500">Período:</span>
                                                                <span className="ml-2 font-medium">
                                                                    {alerta.periodo === 'mensal'
                                                                        ? `${alerta.referencia_mes}/${alerta.referencia_ano}`
                                                                        : alerta.referencia_ano}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Uso:</span>
                                                                <span className="ml-2 font-medium">
                                                                    {alerta.percentual_usado.toFixed(1)}% (
                                                                    {biddingUtils.formatarMoeda(alerta.valor_usado)})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex flex-col gap-2">
                                                        {!alerta.lida && (
                                                            <Button variant="outline" size="sm" onClick={() => marcarAlertaComoLida(alerta.id)}>
                                                                Marcar lido
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="relatorios" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                        Relatório de Limites
                                    </CardTitle>
                                    <CardDescription>Gere relatórios detalhados sobre o uso dos limites de dispensa</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Tipo de Relatório</Label>
                                            <Select defaultValue="mensal">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mensal">Mensal</SelectItem>
                                                    <SelectItem value="anual">Anual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Ano</Label>
                                            <Input type="number" defaultValue={new Date().getFullYear()} />
                                        </div>
                                        <Button className="w-full">
                                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                            Gerar Relatório
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                        Relatório de Alertas
                                    </CardTitle>
                                    <CardDescription>Exporte todos os alertas gerados em um período</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Período</Label>
                                            <Input type="date" />
                                        </div>
                                        <div>
                                            <Label>até</Label>
                                            <Input type="date" />
                                        </div>
                                        <Button className="w-full">
                                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                            Gerar Relatório
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                        Relatório de Dispensas
                                    </CardTitle>
                                    <CardDescription>Exporte todas as dispensas com filtros personalizados</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full">
                                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                        Configurar Relatório
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialog de Visualização */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Dispensa</DialogTitle>
                        <DialogDescription>Informações completas da dispensa de licitação</DialogDescription>
                    </DialogHeader>

                    {selectedDispensa && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Número</Label>
                                    <p className="text-sm font-medium">{selectedDispensa.numero}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <p className="text-sm font-medium">{getStatusBadge(selectedDispensa)}</p>
                                </div>
                                <div>
                                    <Label>Data da Dispensa</Label>
                                    <p className="text-sm font-medium">{biddingUtils.formatarData(selectedDispensa.data_dispensa)}</p>
                                </div>
                                <div>
                                    <Label>Valor</Label>
                                    <p className="text-sm font-medium">{biddingUtils.formatarMoeda(selectedDispensa.valor)}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Categoria</Label>
                                    <p className="text-sm font-medium">{selectedDispensa.categoria_material?.nome}</p>
                                    <p className="text-xs text-gray-500">
                                        Tipo: {selectedDispensa.categoria_material?.tipo === 'material' ? 'Material' : 'Serviço'}
                                    </p>
                                </div>
                                <div>
                                    <Label>Período de Referência</Label>
                                    <p className="text-sm font-medium">
                                        {selectedDispensa.periodo === 'mensal'
                                            ? `${selectedDispensa.referencia_mes}/${selectedDispensa.referencia_ano}`
                                            : selectedDispensa.referencia_ano}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label>Objeto</Label>
                                <p className="text-sm">{selectedDispensa.objeto}</p>
                            </div>

                            <div>
                                <Label>Fundamentação Legal</Label>
                                <p className="text-sm">{selectedDispensa.fundamentacao_legal}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Responsável</Label>
                                    <p className="text-sm font-medium">{selectedDispensa.responsavel}</p>
                                </div>
                                <div>
                                    <Label>Unidade Administrativa</Label>
                                    <p className="text-sm font-medium">{selectedDispensa.unidade_administrativa}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de Cancelamento */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar Dispensa</DialogTitle>
                        <DialogDescription>Informe o motivo do cancelamento da dispensa {selectedDispensa?.numero}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Label htmlFor="motivo_cancelamento">Motivo do Cancelamento</Label>
                        <Textarea
                            id="motivo_cancelamento"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Descreva detalhadamente o motivo do cancelamento..."
                            rows={4}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                            Voltar
                        </Button>
                        <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason.trim()}>
                            Confirmar Cancelamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
