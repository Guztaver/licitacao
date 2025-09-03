import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Download,
    FileBarChart,
    FileText,
    Filter,
    PieChart,
    TrendingUp,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Relatórios',
        href: '/relatorios',
    },
];

interface RelatorioFiltros {
    tipo_relatorio: string;
    data_inicio: string;
    data_fim: string;
    emitente_id: string;
    fornecedor_id: string;
    status: string;
    formato: string;
}

export default function RelatoriosIndex() {
    const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>('');

    const { data, setData, post, processing } = useForm<RelatorioFiltros>({
        tipo_relatorio: '',
        data_inicio: '',
        data_fim: '',
        emitente_id: '',
        fornecedor_id: '',
        status: '',
        formato: 'pdf',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/relatorios/gerar', {
            preserveScroll: true,
        });
    };

    const tiposRelatorio = [
        {
            id: 'requisicoes_periodo',
            nome: 'Requisições por Período',
            descricao: 'Lista de todas as requisições em um período específico',
            icon: FileText,
        },
        {
            id: 'requisicoes_status',
            nome: 'Requisições por Status',
            descricao: 'Relatório agrupado por status das requisições',
            icon: BarChart3,
        },
        {
            id: 'emitentes_ranking',
            nome: 'Ranking de Emitentes',
            descricao: 'Emitentes ordenados por número de requisições',
            icon: TrendingUp,
        },
        {
            id: 'fornecedores_ranking',
            nome: 'Ranking de Fornecedores',
            descricao: 'Fornecedores mais solicitados em requisições',
            icon: PieChart,
        },
        {
            id: 'valores_mensais',
            nome: 'Valores por Mês',
            descricao: 'Evolução dos valores das requisições por mês',
            icon: BarChart3,
        },
        {
            id: 'aprovacoes_tempo',
            nome: 'Tempo de Aprovação',
            descricao: 'Análise do tempo médio para aprovação',
            icon: Calendar,
        },
    ];

    const formatosDisponiveis = [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel (XLSX)' },
        { value: 'csv', label: 'CSV' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatórios" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gere relatórios personalizados sobre requisições e licitações
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Seleção de Relatório */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileBarChart className="mr-2 h-5 w-5" />
                                    Tipos de Relatório
                                </CardTitle>
                                <CardDescription>Selecione o tipo de relatório que deseja gerar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {tiposRelatorio.map((tipo) => (
                                        <div
                                            key={tipo.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                                data.tipo_relatorio === tipo.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                            }`}
                                            onClick={() => {
                                                setData('tipo_relatorio', tipo.id);
                                                setRelatorioSelecionado(tipo.id);
                                            }}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <tipo.icon className="h-6 w-6 text-blue-600 mt-1" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {tipo.nome}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {tipo.descricao}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Filtros */}
                        {relatorioSelecionado && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Filter className="mr-2 h-5 w-5" />
                                        Filtros do Relatório
                                    </CardTitle>
                                    <CardDescription>Configure os filtros para personalizar o relatório</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Período */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="data_inicio">Data de Início</Label>
                                                <Input
                                                    id="data_inicio"
                                                    type="date"
                                                    value={data.data_inicio}
                                                    onChange={(e) => setData('data_inicio', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="data_fim">Data de Fim</Label>
                                                <Input
                                                    id="data_fim"
                                                    type="date"
                                                    value={data.data_fim}
                                                    onChange={(e) => setData('data_fim', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Emitente e Fornecedor */}
                                        {(relatorioSelecionado === 'requisicoes_periodo' ||
                                          relatorioSelecionado === 'requisicoes_status') && (
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="emitente_id">Emitente</Label>
                                                    <Select
                                                        value={data.emitente_id}
                                                        onValueChange={(value) => setData('emitente_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Todos os emitentes" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">Todos os emitentes</SelectItem>
                                                            <SelectItem value="1">SECOM</SelectItem>
                                                            <SelectItem value="2">SEMEC</SelectItem>
                                                            <SelectItem value="3">SESAU</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="fornecedor_id">Fornecedor</Label>
                                                    <Select
                                                        value={data.fornecedor_id}
                                                        onValueChange={(value) => setData('fornecedor_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Todos os fornecedores" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">Todos os fornecedores</SelectItem>
                                                            <SelectItem value="1">Empresa A Ltda</SelectItem>
                                                            <SelectItem value="2">Fornecedor B SA</SelectItem>
                                                            <SelectItem value="3">Comercial C</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status */}
                                        {(relatorioSelecionado === 'requisicoes_periodo' ||
                                          relatorioSelecionado === 'aprovacoes_tempo') && (
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => setData('status', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Todos os status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">Todos os status</SelectItem>
                                                        <SelectItem value="pendente">Pendente</SelectItem>
                                                        <SelectItem value="aprovado">Aprovado</SelectItem>
                                                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Formato */}
                                        <div className="space-y-2">
                                            <Label htmlFor="formato">Formato de Saída</Label>
                                            <Select
                                                value={data.formato}
                                                onValueChange={(value) => setData('formato', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formatosDisponiveis.map((formato) => (
                                                        <SelectItem key={formato.value} value={formato.value}>
                                                            {formato.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button type="submit" disabled={processing}>
                                                <Download className="mr-2 h-4 w-4" />
                                                {processing ? 'Gerando...' : 'Gerar Relatório'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Resumo e Ações Rápidas */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">156</div>
                                    <div className="text-sm text-gray-500">Requisições este mês</div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">89</div>
                                        <div className="text-sm text-gray-500">Aprovadas</div>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">52</div>
                                        <div className="text-sm text-gray-500">Pendentes</div>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">15</div>
                                        <div className="text-sm text-gray-500">Rejeitadas</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Relatórios Recentes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm">
                                    <div className="font-medium">Requisições Janeiro 2024</div>
                                    <div className="text-gray-500">Gerado em 15/01/2024</div>
                                    <Button variant="outline" size="sm" className="mt-1">
                                        <Download className="mr-1 h-3 w-3" />
                                        Baixar
                                    </Button>
                                </div>
                                <div className="text-sm border-t pt-3">
                                    <div className="font-medium">Ranking Emitentes</div>
                                    <div className="text-gray-500">Gerado em 10/01/2024</div>
                                    <Button variant="outline" size="sm" className="mt-1">
                                        <Download className="mr-1 h-3 w-3" />
                                        Baixar
                                    </Button>
                                </div>
                                <div className="text-sm border-t pt-3">
                                    <div className="font-medium">Valores Dezembro</div>
                                    <div className="text-gray-500">Gerado em 05/01/2024</div>
                                    <Button variant="outline" size="sm" className="mt-1">
                                        <Download className="mr-1 h-3 w-3" />
                                        Baixar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 dark:bg-blue-950/20">
                            <CardContent className="pt-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FileBarChart className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Dicas</h3>
                                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                            <p>
                                                • Use filtros de período para análises específicas
                                                <br />
                                                • Relatórios em Excel permitem análises avançadas
                                                <br />
                                                • CSV é ideal para importação em outros sistemas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
