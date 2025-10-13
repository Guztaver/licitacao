import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { categoriaService, biddingUtils } from '@/services/bidding';
import type { CategoriaMaterial, CategoriaFilters } from '@/types/bidding';

interface PageProps {
    categorias: CategoriaMaterial[];
    filtros: CategoriaFilters;
    toast?: string;
    tipo?: string;
}

export default function CategoriaMaterialIndex({
    categorias: initialCategorias,
    filtros: initialFiltros,
    toast: toastMessage,
    tipo: toastType,
}: PageProps) {
    const [categorias, setCategorias] = useState<CategoriaMaterial[]>(initialCategorias);
    const [filtros, setFiltros] = useState<CategoriaFilters>(initialFiltros);
    const [searchTerm, setSearchTerm] = useState(initialFiltros.search || '');
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategorias, setSelectedCategorias] = useState<number[]>([]);

    useEffect(() => {
        if (toastMessage) {
            toast[toastType as 'success' | 'error'](toastMessage);
        }
    }, [toastMessage, toastType]);

    const aplicarFiltros = (novosFiltros: CategoriaFilters) => {
        setLoading(true);
        const params = new URLSearchParams();

        Object.entries(novosFiltros).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, value.toString());
            }
        });

        router.get('/categoria-materiais', Object.fromEntries(params), {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        aplicarFiltros({ ...filtros, search: term });
    };

    const handleTipoFilter = (tipo: string) => {
        const novosFiltros = {
            ...filtros,
            tipo: tipo === '' ? undefined : (tipo as 'material' | 'servico'),
        };
        setFiltros(novosFiltros);
        aplicarFiltros(novosFiltros);
    };

    const handleAtivoFilter = (ativo: string) => {
        const novosFiltros = {
            ...filtros,
            ativo: ativo === '' ? undefined : ativo === 'true',
        };
        setFiltros(novosFiltros);
        aplicarFiltros(novosFiltros);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            await categoriaService.excluir(id);
            toast.success('Categoria excluída com sucesso!');
            setCategorias(categorias.filter((cat) => cat.id !== id));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao excluir categoria');
        }
    };

    const toggleSelectAll = () => {
        if (selectedCategorias.length === categorias.length) {
            setSelectedCategorias([]);
        } else {
            setSelectedCategorias(categorias.map((cat) => cat.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedCategorias((prev) => (prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]));
    };

    const getStatusBadge = (categoria: CategoriaMaterial) => {
        if (!categoria.ativo) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inativa
                </span>
            );
        }

        if (!categoria.status || categoria.status === 'normal') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Normal
                </span>
            );
        }

        const color = categoria.status === 'bloqueio' ? 'red' : 'yellow';
        const Icon = categoria.status === 'bloqueio' ? XCircle : AlertTriangle;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                <Icon className="w-3 h-3 mr-1" />
                {categoria.status === 'bloqueio' ? 'Bloqueio' : 'Alerta'}
            </span>
        );
    };

    const getUsoBar = (categoria: CategoriaMaterial) => {
        const percentualAnual = categoria.percentual_uso_anual || 0;
        const percentualMensal = categoria.percentual_uso_mensal || 0;
        const alerta = categoria.alerta_percentual;
        const bloqueio = categoria.bloqueio_percentual;

        const getBarColor = (percentual: number) => {
            if (percentual >= bloqueio) return 'bg-red-500';
            if (percentual >= alerta) return 'bg-yellow-500';
            return 'bg-green-500';
        };

        return (
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uso Anual</span>
                        <span>{biddingUtils.formatarPercentual(percentualAnual)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${getBarColor(percentualAnual)}`}
                            style={{ width: `${Math.min(percentualAnual, 100)}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uso Mensal</span>
                        <span>{biddingUtils.formatarPercentual(percentualMensal)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${getBarColor(percentualMensal)}`}
                            style={{ width: `${Math.min(percentualMensal, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Categorias de Materiais</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Categorias de Materiais</h2>
                                    <p className="text-gray-600">Gerencie categorias e limites de dispensa de licitação</p>
                                </div>
                                <Link
                                    href="/categoria-materiais/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nova Categoria
                                </Link>
                            </div>

                            {/* Filtros e Busca */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Buscar categorias..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                </button>
                            </div>

                            {/* Filtros Expandidos */}
                            {showFilters && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={filtros.tipo || ''}
                                            onChange={(e) => handleTipoFilter(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        >
                                            <option value="">Todos</option>
                                            <option value="material">Material</option>
                                            <option value="servico">Serviço</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={filtros.ativo !== undefined ? filtros.ativo.toString() : ''}
                                            onChange={(e) => handleAtivoFilter(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        >
                                            <option value="">Todos</option>
                                            <option value="true">Ativas</option>
                                            <option value="false">Inativas</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setFiltros({});
                                                setSearchTerm('');
                                                router.get('/categoria-materiais');
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Limpar Filtros
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tabela de Categorias */}
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-gray-600">Carregando...</p>
                                </div>
                            ) : categorias.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Filter className="w-12 h-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
                                    <p className="text-gray-600 mb-4">
                                        {filtros.search || filtros.tipo || filtros.ativo !== undefined
                                            ? 'Tente ajustar os filtros ou a busca.'
                                            : 'Comece criando sua primeira categoria de material.'}
                                    </p>
                                    {!filtros.search && !filtros.tipo && filtros.ativo === undefined && (
                                        <Link
                                            href="/categoria-materiais/create"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Criar Categoria
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategorias.length === categorias.length}
                                                        onChange={toggleSelectAll}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Categoria
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Limites
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Uso Atual
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categorias.map((categoria) => (
                                                <tr key={categoria.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategorias.includes(categoria.id)}
                                                            onChange={() => toggleSelect(categoria.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{categoria.nome}</div>
                                                            <div className="text-sm text-gray-500">{categoria.descricao}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {categoria.tipo === 'material' ? 'Material' : 'Serviço'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            <div>Anual: {biddingUtils.formatarMoeda(categoria.limite_dispensa_anual)}</div>
                                                            <div>Mensal: {biddingUtils.formatarMoeda(categoria.limite_dispensa_mensal)}</div>
                                                            <div className="text-xs text-gray-500">
                                                                Alerta: {categoria.alerta_percentual}% | Bloqueio: {categoria.bloqueio_percentual}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-48">
                                                            {getUsoBar(categoria)}
                                                            {categoria.percentual_uso_anual && (
                                                                <div className="text-xs text-gray-600 mt-1">
                                                                    {biddingUtils.formatarMoeda(categoria.uso_anual || 0)} usados este ano
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">{getStatusBadge(categoria)}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={`/categoria-materiais/${categoria.id}`}
                                                                className="text-gray-600 hover:text-blue-600"
                                                                title="Visualizar"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={`/categoria-materiais/${categoria.id}/edit`}
                                                                className="text-gray-600 hover:text-blue-600"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(categoria.id)}
                                                                className="text-gray-600 hover:text-red-600"
                                                                title="Excluir"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
