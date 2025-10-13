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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { categoryService, biddingUtils } from '@/services/bidding';
import type { CategoriaMaterial, CreateCategoriaData, UpdateCategoriaData, CategoriaFilters } from '@/types/bidding';
import Layout from '@/layouts/MainLayout';

interface Props {
    categorias: CategoriaMaterial[];
}

export default function CategoriasPage({ categorias: initialCategorias }: Props) {
    const [categorias, setCategorias] = useState<CategoriaMaterial[]>(initialCategorias);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<CategoriaFilters>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<CategoriaMaterial | null>(null);
    const [formData, setFormData] = useState<CreateCategoriaData>({
        nome: '',
        descricao: '',
        tipo: 'material',
        limite_dispensa_anual: 0,
        limite_dispensa_mensal: 0,
        alerta_percentual: 80,
        bloqueio_percentual: 100,
    });

    useEffect(() => {
        carregarCategorias();
    }, [filters]);

    const carregarCategorias = async () => {
        setLoading(true);
        try {
            const data = await categoryService.listar(filters);
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const novaCategoria = await categoryService.criar(formData);
            setCategorias([...categorias, novaCategoria]);
            setIsCreateDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedCategoria) return;

        try {
            const categoriaAtualizada = await categoryService.atualizar(selectedCategoria.id, formData as UpdateCategoriaData);
            setCategorias(categorias.map((cat) => (cat.id === categoriaAtualizada.id ? categoriaAtualizada : cat)));
            setIsEditDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await categoryService.excluir(id);
            setCategorias(categorias.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    };

    const handleView = async (categoria: CategoriaMaterial) => {
        try {
            const categoriaComUso = await categoryService.obterComUso(categoria.id);
            setSelectedCategoria(categoriaComUso);
            setIsViewDialogOpen(true);
        } catch (error) {
            setSelectedCategoria(categoria);
            setIsViewDialogOpen(true);
        }
    };

    const handleEdit = (categoria: CategoriaMaterial) => {
        setSelectedCategoria(categoria);
        setFormData({
            nome: categoria.nome,
            descricao: categoria.descricao,
            tipo: categoria.tipo,
            limite_dispensa_anual: categoria.limite_dispensa_anual,
            limite_dispensa_mensal: categoria.limite_dispensa_mensal,
            alerta_percentual: categoria.alerta_percentual,
            bloqueio_percentual: categoria.bloqueio_percentual,
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            tipo: 'material',
            limite_dispensa_anual: 0,
            limite_dispensa_mensal: 0,
            alerta_percentual: 80,
            bloqueio_percentual: 100,
        });
        setSelectedCategoria(null);
    };

    const getStatusBadge = (categoria: CategoriaMaterial) => {
        const percentualAnual = categoria.percentual_uso_anual || 0;
        const percentualMensal = categoria.percentual_uso_mensal || 0;
        const maiorPercentual = Math.max(percentualAnual, percentualMensal);

        if (maiorPercentual >= categoria.bloqueio_percentual) {
            return <Badge variant="destructive">Bloqueio</Badge>;
        }
        if (maiorPercentual >= categoria.alerta_percentual) {
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Alerta
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="bg-green-100 text-green-800">
                Normal
            </Badge>
        );
    };

    const getProgressColor = (categoria: CategoriaMaterial, tipo: 'anual' | 'mensal') => {
        const percentual = tipo === 'anual' ? categoria.percentual_uso_anual || 0 : categoria.percentual_uso_mensal || 0;

        if (percentual >= categoria.bloqueio_percentual) return 'bg-red-500';
        if (percentual >= categoria.alerta_percentual) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <Layout>
            <Head title="Categorias de Materiais e Serviços" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Categorias de Materiais e Serviços</h1>
                        <p className="text-gray-600 mt-2">Gerencie as categorias e seus limites de dispensa de licitação</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Nova Categoria
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Criar Nova Categoria</DialogTitle>
                                <DialogDescription>Defina os limites de dispensa para esta categoria de material ou serviço</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="nome">Nome da Categoria</Label>
                                        <Input
                                            id="nome"
                                            value={formData.nome}
                                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                            placeholder="Ex: Material de Escritório"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tipo">Tipo</Label>
                                        <Select
                                            value={formData.tipo}
                                            onValueChange={(value: 'material' | 'servico') => setFormData({ ...formData, tipo: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="material">Material</SelectItem>
                                                <SelectItem value="servico">Serviço</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Textarea
                                        id="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                        placeholder="Descreva detalhadamente esta categoria..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="limite_anual">Limite Anual (R$)</Label>
                                        <Input
                                            id="limite_anual"
                                            type="number"
                                            value={formData.limite_dispensa_anual}
                                            onChange={(e) => setFormData({ ...formData, limite_dispensa_anual: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="limite_mensal">Limite Mensal (R$)</Label>
                                        <Input
                                            id="limite_mensal"
                                            type="number"
                                            value={formData.limite_dispensa_mensal}
                                            onChange={(e) => setFormData({ ...formData, limite_dispensa_mensal: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="alerta_percentual">Alerta (%)</Label>
                                        <Input
                                            id="alerta_percentual"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.alerta_percentual}
                                            onChange={(e) => setFormData({ ...formData, alerta_percentual: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bloqueio_percentual">Bloqueio (%)</Label>
                                        <Input
                                            id="bloqueio_percentual"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.bloqueio_percentual}
                                            onChange={(e) => setFormData({ ...formData, bloqueio_percentual: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreate}>Criar Categoria</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="search">Buscar</Label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder="Buscar categorias..."
                                        value={filters.search || ''}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="tipo_filtro">Tipo</Label>
                                <Select
                                    value={filters.tipo || ''}
                                    onValueChange={(value) => setFilters({ ...filters, tipo: value as 'material' | 'servico' | '' })}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos</SelectItem>
                                        <SelectItem value="material">Material</SelectItem>
                                        <SelectItem value="servico">Serviço</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="ativo_filtro">Status</Label>
                                <Select
                                    value={filters.ativo === undefined ? '' : filters.ativo.toString()}
                                    onValueChange={(value) => setFilters({ ...filters, ativo: value === '' ? undefined : value === 'true' })}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos</SelectItem>
                                        <SelectItem value="true">Ativos</SelectItem>
                                        <SelectItem value="false">Inativos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" onClick={() => setFilters({})}>
                                Limpar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Categorias */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categorias Cadastradas</CardTitle>
                        <CardDescription>{categorias.length} categorias encontradas</CardDescription>
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
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Limite Anual</TableHead>
                                        <TableHead>Uso Anual</TableHead>
                                        <TableHead>Limite Mensal</TableHead>
                                        <TableHead>Uso Mensal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categorias.map((categoria) => (
                                        <TableRow key={categoria.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{categoria.nome}</div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">{categoria.descricao}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={categoria.tipo === 'material' ? 'default' : 'secondary'}>
                                                    {categoria.tipo === 'material' ? 'Material' : 'Serviço'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{biddingUtils.formatarMoeda(categoria.limite_dispensa_anual)}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{biddingUtils.formatarMoeda(categoria.uso_anual || 0)}</div>
                                                    <Progress
                                                        value={categoria.percentual_uso_anual || 0}
                                                        className="h-2"
                                                        indicatorClassName={getProgressColor(categoria, 'anual')}
                                                    />
                                                    <div className="text-xs text-gray-500">{categoria.percentual_uso_anual?.toFixed(1)}%</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{biddingUtils.formatarMoeda(categoria.limite_dispensa_mensal)}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{biddingUtils.formatarMoeda(categoria.uso_mensal || 0)}</div>
                                                    <Progress
                                                        value={categoria.percentual_uso_mensal || 0}
                                                        className="h-2"
                                                        indicatorClassName={getProgressColor(categoria, 'mensal')}
                                                    />
                                                    <div className="text-xs text-gray-500">{categoria.percentual_uso_mensal?.toFixed(1)}%</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(categoria)}
                                                    {!categoria.ativo && (
                                                        <Badge variant="outline" className="text-gray-500">
                                                            Inativo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => handleView(categoria)}>
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(categoria.id)}
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
            </div>

            {/* Dialog de Visualização */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Categoria</DialogTitle>
                        <DialogDescription>Informações completas e limites de uso</DialogDescription>
                    </DialogHeader>

                    {selectedCategoria && (
                        <Tabs defaultValue="detalhes" className="w-full">
                            <TabsList>
                                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                                <TabsTrigger value="limites">Limites e Uso</TabsTrigger>
                                <TabsTrigger value="alertas">Alertas</TabsTrigger>
                            </TabsList>

                            <TabsContent value="detalhes" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nome</Label>
                                        <p className="text-sm font-medium">{selectedCategoria.nome}</p>
                                    </div>
                                    <div>
                                        <Label>Tipo</Label>
                                        <p className="text-sm font-medium">
                                            <Badge variant={selectedCategoria.tipo === 'material' ? 'default' : 'secondary'}>
                                                {selectedCategoria.tipo === 'material' ? 'Material' : 'Serviço'}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Descrição</Label>
                                        <p className="text-sm">{selectedCategoria.descricao}</p>
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <p className="text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(selectedCategoria)}
                                                <span>{selectedCategoria.ativo ? 'Ativo' : 'Inativo'}</span>
                                            </div>
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Cadastrado em</Label>
                                        <p className="text-sm">{biddingUtils.formatarData(selectedCategoria.created_at)}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="limites" className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Limite Anual</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Valor Utilizado</span>
                                                    <span className="font-medium">
                                                        {biddingUtils.formatarMoeda(selectedCategoria.uso_anual || 0)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Limite Total</span>
                                                    <span className="font-medium">
                                                        {biddingUtils.formatarMoeda(selectedCategoria.limite_dispensa_anual)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress
                                                value={selectedCategoria.percentual_uso_anual || 0}
                                                className="h-3"
                                                indicatorClassName={getProgressColor(selectedCategoria, 'anual')}
                                            />
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{(selectedCategoria.percentual_uso_anual || 0).toFixed(1)}%</div>
                                                <div className="text-sm text-gray-500">do limite utilizado</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Limite Mensal</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Valor Utilizado</span>
                                                    <span className="font-medium">
                                                        {biddingUtils.formatarMoeda(selectedCategoria.uso_mensal || 0)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Limite Total</span>
                                                    <span className="font-medium">
                                                        {biddingUtils.formatarMoeda(selectedCategoria.limite_dispensa_mensal)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress
                                                value={selectedCategoria.percentual_uso_mensal || 0}
                                                className="h-3"
                                                indicatorClassName={getProgressColor(selectedCategoria, 'mensal')}
                                            />
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{(selectedCategoria.percentual_uso_mensal || 0).toFixed(1)}%</div>
                                                <div className="text-sm text-gray-500">do limite utilizado</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Alert>
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>Configurações de Alerta</AlertTitle>
                                    <AlertDescription>
                                        • Alerta gerado ao atingir {selectedCategoria.alerta_percentual}% do limite
                                        <br />• Bloqueio impede novas dispensas ao atingir {selectedCategoria.bloqueio_percentual}% do limite
                                    </AlertDescription>
                                </Alert>
                            </TabsContent>

                            <TabsContent value="alertas" className="space-y-4">
                                <Alert>
                                    <AlertTitle>Gerenciamento de Alertas</AlertTitle>
                                    <AlertDescription>
                                        Os alertas são gerados automaticamente quando os limites são aproximados ou excedidos. Você pode visualizar e
                                        gerenciar todos os alertas na página de Dispensas.
                                    </AlertDescription>
                                </Alert>

                                <div className="text-center py-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsViewDialogOpen(false);
                                            window.location.href = route('dispensas.index');
                                        }}
                                    >
                                        Ver Alertas de Dispensa
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de Edição */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogDescription>Atualize as informações da categoria</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_nome">Nome da Categoria</Label>
                                <Input id="edit_nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit_tipo">Tipo</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value: 'material' | 'servico') => setFormData({ ...formData, tipo: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="material">Material</SelectItem>
                                        <SelectItem value="servico">Serviço</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit_descricao">Descrição</Label>
                            <Textarea
                                id="edit_descricao"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_limite_anual">Limite Anual (R$)</Label>
                                <Input
                                    id="edit_limite_anual"
                                    type="number"
                                    value={formData.limite_dispensa_anual}
                                    onChange={(e) => setFormData({ ...formData, limite_dispensa_anual: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_limite_mensal">Limite Mensal (R$)</Label>
                                <Input
                                    id="edit_limite_mensal"
                                    type="number"
                                    value={formData.limite_dispensa_mensal}
                                    onChange={(e) => setFormData({ ...formData, limite_dispensa_mensal: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_alerta_percentual">Alerta (%)</Label>
                                <Input
                                    id="edit_alerta_percentual"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.alerta_percentual}
                                    onChange={(e) => setFormData({ ...formData, alerta_percentual: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_bloqueio_percentual">Bloqueio (%)</Label>
                                <Input
                                    id="edit_bloqueio_percentual"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.bloqueio_percentual}
                                    onChange={(e) => setFormData({ ...formData, bloqueio_percentual: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {selectedCategoria && (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit_ativo"
                                    checked={formData.ativo !== undefined ? formData.ativo : selectedCategoria.ativo}
                                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                                />
                                <Label htmlFor="edit_ativo">Categoria Ativa</Label>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdate}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
