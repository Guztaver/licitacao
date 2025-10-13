import type React from 'react';
import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { CategoriaMaterial, CreateCategoriaData, UpdateCategoriaData, CategoriaFilters } from '@/types/bidding';
import { categoriaService, biddingUtils } from '@/services/bidding';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Plus, Edit, Trash2, Search, Filter, AlertTriangle, TrendingUp, Eye, Download, Settings, BarChart3 } from 'lucide-react';

interface Props {
    categorias?: CategoriaMaterial[];
}

export default function CategoriaMateriais({ categorias: initialCategorias = [] }: Props) {
    const [categorias, setCategorias] = useState<CategoriaMaterial[]>(initialCategorias);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<CategoriaFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<CategoriaMaterial | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState<CreateCategoriaData>({
        nome: '',
        descricao: '',
        tipo: 'material',
        limite_dispensa_anual: 0,
        limite_dispensa_mensal: 0,
        alerta_percentual: 80,
        bloqueio_percentual: 100,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const carregarCategorias = async () => {
        setLoading(true);
        try {
            const data = await categoriaService.listar(filtros);
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, [filtros]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingCategoria) {
                const updated = await categoriaService.atualizar(editingCategoria.id, formData);
                setCategorias((prev) => prev.map((cat) => (cat.id === updated.id ? updated : cat)));
                setDialogOpen(false);
            } else {
                const created = await categoriaService.criar(formData);
                setCategorias((prev) => [created, ...prev]);
                setDialogOpen(false);
            }

            resetForm();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
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
        setEditingCategoria(null);
        setErrors({});
    };

    const handleEdit = (categoria: CategoriaMaterial) => {
        setEditingCategoria(categoria);
        setFormData({
            nome: categoria.nome,
            descricao: categoria.descricao,
            tipo: categoria.tipo,
            limite_dispensa_anual: categoria.limite_dispensa_anual,
            limite_dispensa_mensal: categoria.limite_dispensa_mensal,
            alerta_percentual: categoria.alerta_percentual,
            bloqueio_percentual: categoria.bloqueio_percentual,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await categoriaService.excluir(id);
            setCategorias((prev) => prev.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    };

    const handleToggleActive = async (categoria: CategoriaMaterial) => {
        try {
            const updated = await categoriaService.atualizar(categoria.id, { ativo: !categoria.ativo });
            setCategorias((prev) => prev.map((cat) => (cat.id === updated.id ? updated : cat)));
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
        }
    };

    const filteredCategorias = categorias.filter(
        (categoria) =>
            categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) || categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const aplicarFiltros = () => {
        const novosFiltros: CategoriaFilters = {};
        if (filtros.tipo) novosFiltros.tipo = filtros.tipo;
        if (filtros.ativo !== undefined) novosFiltros.ativo = filtros.ativo;
        if (searchTerm) novosFiltros.search = searchTerm;
        setFiltros(novosFiltros);
    };

    const limparFiltros = () => {
        setFiltros({});
        setSearchTerm('');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categorias de Materiais" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Categorias de Materiais</h1>
                        <p className="text-muted-foreground mt-2">Gerencie categorias e limites de dispensa de licitações</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('bidding.dashboard')}>
                            <Button variant="outline">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nova Categoria
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                                    <DialogDescription>Configure os limites de dispensa para esta categoria</DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome">Nome *</Label>
                                            <Input
                                                id="nome"
                                                value={formData.nome}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                                                placeholder="Ex: Material de Escritório"
                                                required
                                            />
                                            {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tipo">Tipo *</Label>
                                            <Select
                                                value={formData.tipo}
                                                onValueChange={(value: 'material' | 'servico') => setFormData((prev) => ({ ...prev, tipo: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="material">Material</SelectItem>
                                                    <SelectItem value="servico">Serviço</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.tipo && <p className="text-sm text-red-600">{errors.tipo}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="descricao">Descrição</Label>
                                        <Textarea
                                            id="descricao"
                                            value={formData.descricao}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                                            placeholder="Descreva esta categoria de material ou serviço"
                                            rows={3}
                                        />
                                    </div>

                                    <Tabs defaultValue="limites" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="limites">Limites</TabsTrigger>
                                            <TabsTrigger value="alertas">Alertas</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="limites" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="limite_anual">Limite Anual (R$)</Label>
                                                    <Input
                                                        id="limite_anual"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.limite_dispensa_anual}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                limite_dispensa_anual: parseFloat(e.target.value) || 0,
                                                            }))
                                                        }
                                                        placeholder="0,00"
                                                    />
                                                    {errors.limite_dispensa_anual && (
                                                        <p className="text-sm text-red-600">{errors.limite_dispensa_anual}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="limite_mensal">Limite Mensal (R$)</Label>
                                                    <Input
                                                        id="limite_mensal"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.limite_dispensa_mensal}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                limite_dispensa_mensal: parseFloat(e.target.value) || 0,
                                                            }))
                                                        }
                                                        placeholder="0,00"
                                                    />
                                                    {errors.limite_dispensa_mensal && (
                                                        <p className="text-sm text-red-600">{errors.limite_dispensa_mensal}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="alertas" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="alerta_percentual">Alerta (% do limite)</Label>
                                                    <Input
                                                        id="alerta_percentual"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={formData.alerta_percentual}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                alerta_percentual: parseInt(e.target.value) || 0,
                                                            }))
                                                        }
                                                        placeholder="80"
                                                    />
                                                    <p className="text-sm text-muted-foreground">Gerar alerta quando o uso atingir este percentual</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bloqueio_percentual">Bloqueio (% do limite)</Label>
                                                    <Input
                                                        id="bloqueio_percentual"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={formData.bloqueio_percentual}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                bloqueio_percentual: parseInt(e.target.value) || 0,
                                                            }))
                                                        }
                                                        placeholder="100"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Bloquear novas dispensas quando atingir este percentual
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Salvando...' : editingCategoria ? 'Atualizar' : 'Criar'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Filtros</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                                <Filter className="w-4 h-4 mr-2" />
                                {showFilters ? 'Ocultar' : 'Mostrar'}
                            </Button>
                        </div>
                    </CardHeader>

                    {showFilters && (
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Buscar</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Nome ou descrição..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <Select
                                        value={filtros.tipo || ''}
                                        onValueChange={(value) =>
                                            setFiltros((prev) => ({
                                                ...prev,
                                                tipo: value as 'material' | 'servico' | '',
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os tipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos os tipos</SelectItem>
                                            <SelectItem value="material">Material</SelectItem>
                                            <SelectItem value="servico">Serviço</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={filtros.ativo === undefined ? '' : filtros.ativo.toString()}
                                        onValueChange={(value) =>
                                            setFiltros((prev) => ({
                                                ...prev,
                                                ativo: value === '' ? undefined : value === 'true',
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos os status</SelectItem>
                                            <SelectItem value="true">Ativas</SelectItem>
                                            <SelectItem value="false">Inativas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end space-x-2">
                                    <Button onClick={aplicarFiltros}>
                                        <Search className="w-4 h-4 mr-2" />
                                        Filtrar
                                    </Button>
                                    <Button variant="outline" onClick={limparFiltros}>
                                        Limpar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Lista de Categorias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredCategorias.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Nenhuma categoria encontrada</p>
                        </div>
                    ) : (
                        filteredCategorias.map((categoria) => (
                            <Card
                                key={categoria.id}
                                className={`relative ${
                                    categoria.status === 'bloqueio'
                                        ? 'border-red-200 bg-red-50'
                                        : categoria.status === 'alerta'
                                          ? 'border-yellow-200 bg-yellow-50'
                                          : ''
                                }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                                                <Badge variant={categoria.tipo === 'material' ? 'default' : 'secondary'}>
                                                    {categoria.tipo === 'material' ? 'Material' : 'Serviço'}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <Switch checked={categoria.ativo} onCheckedChange={() => handleToggleActive(categoria)} />
                                                <span className="text-sm text-gray-600">{categoria.ativo ? 'Ativa' : 'Inativa'}</span>
                                            </div>

                                            {(categoria.status === 'alerta' || categoria.status === 'bloqueio') && (
                                                <Alert
                                                    className={`mb-3 ${
                                                        categoria.status === 'bloqueio'
                                                            ? 'border-red-200 bg-red-50'
                                                            : 'border-yellow-200 bg-yellow-50'
                                                    }`}
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription className="text-sm">
                                                        {categoria.status === 'bloqueio'
                                                            ? 'Limite de dispensa atingido - Novas dispensas bloqueadas'
                                                            : 'Próximo ao limite de dispensa - Atenção redobrada'}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <Link href={route('bidding.categorias.show', categoria.id)}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(categoria.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="text-sm text-gray-600">{categoria.descricao}</div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Limite Anual</span>
                                                <span className="font-medium">{biddingUtils.formatarMoeda(categoria.limite_dispensa_anual)}</span>
                                            </div>
                                            {categoria.percentual_uso_anual !== undefined && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            categoria.percentual_uso_anual >= 100
                                                                ? 'bg-red-500'
                                                                : categoria.percentual_uso_anual >= 80
                                                                  ? 'bg-yellow-500'
                                                                  : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(categoria.percentual_uso_anual, 100)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {categoria.percentual_uso_anual !== undefined && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {biddingUtils.formatarPercentual(categoria.percentual_uso_anual)} utilizado
                                                    {categoria.uso_anual && ` (${biddingUtils.formatarMoeda(categoria.uso_anual)})`}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Limite Mensal</span>
                                                <span className="font-medium">{biddingUtils.formatarMoeda(categoria.limite_dispensa_mensal)}</span>
                                            </div>
                                            {categoria.percentual_uso_mensal !== undefined && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            categoria.percentual_uso_mensal >= 100
                                                                ? 'bg-red-500'
                                                                : categoria.percentual_uso_mensal >= 80
                                                                  ? 'bg-yellow-500'
                                                                  : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(categoria.percentual_uso_mensal, 100)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {categoria.percentual_uso_mensal !== undefined && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {biddingUtils.formatarPercentual(categoria.percentual_uso_mensal)} utilizado
                                                    {categoria.uso_mensal && ` (${biddingUtils.formatarMoeda(categoria.uso_mensal)})`}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Alerta:</span>
                                                <span className="ml-2 font-medium">
                                                    {biddingUtils.formatarPercentual(categoria.alerta_percentual)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Bloqueio:</span>
                                                <span className="ml-2 font-medium">
                                                    {biddingUtils.formatarPercentual(categoria.bloqueio_percentual)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Resumo */}
                {!loading && filteredCategorias.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{filteredCategorias.length}</p>
                                    <p className="text-sm text-gray-600">Total de Categorias</p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-green-600">{filteredCategorias.filter((c) => c.ativo).length}</p>
                                    <p className="text-sm text-gray-600">Categorias Ativas</p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {filteredCategorias.filter((c) => c.status === 'alerta').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Em Alerta</p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-red-600">
                                        {filteredCategorias.filter((c) => c.status === 'bloqueio').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Bloqueadas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
