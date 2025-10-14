import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    BarChart3,
    Building,
    Calendar,
    CheckCircle,
    Download,
    FileBarChart,
    FileText,
    Filter,
    type LucideIcon,
    PieChart,
    TrendingUp,
} from 'lucide-react';
import { type FormEventHandler, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { formatters, reportUtils } from '@/utils/relatorios/formatters';

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

interface RelatoriosStats {
    requisicoes_este_mes: number;
    aprovadas: number;
    pendentes: number;
    rejeitadas: number;
    concretizadas: number;
    valor_total_mes: number;
}

interface RelatoriosIndexProps {
    stats: RelatoriosStats;
    emitentes: Array<{ id: number; nome: string; sigla: string }>;
    fornecedores: Array<{ id: number; razao_social: string; cnpj: string }>;
}

// Component for Quick Statistics Card
const QuickStatsCard = ({ stats }: { stats: RelatoriosStats }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Estatísticas Rápidas</CardTitle>
            <CardDescription>Resumo do mês atual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-center">
                <div className="text-2xl font-bold">{formatters.number(stats.requisicoes_este_mes, 'Nenhuma requisição')}</div>
                <div className="text-sm text-gray-500">
                    {stats.requisicoes_este_mes === 0 ? 'Nenhuma requisição este mês' : 'Requisições este mês'}
                </div>
            </div>
            <div className="border-t pt-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{formatters.number(stats.concretizadas, 'Nenhuma concretizada')}</div>
                    <div className="text-sm text-gray-500">{stats.concretizadas === 0 ? 'Nenhuma requisição concretizada' : 'Concretizadas'}</div>
                </div>
            </div>
            <div className="border-t pt-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{formatters.number(stats.pendentes, 'Nenhuma pendente')}</div>
                    <div className="text-sm text-gray-500">{stats.pendentes === 0 ? 'Todas as requisições foram processadas' : 'Pendentes'}</div>
                </div>
            </div>
            <div className="border-t pt-4">
                <div className="text-center">
                    <div className="text-grey-800 text-2xl font-bold">{formatters.number(stats.rejeitadas, 'Nenhuma cancelada')}</div>
                    <div className="text-sm text-gray-500">{stats.rejeitadas === 0 ? 'Nenhuma requisição cancelada' : 'Canceladas'}</div>
                </div>
            </div>
            <div className="border-t pt-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                        {formatters.currency(stats.valor_total_mes, 'Sem movimentação financeira')}
                    </div>
                    <div className="text-sm text-gray-500">{stats.valor_total_mes === 0 ? 'Nenhum valor movimentado' : 'Valor total'}</div>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Component for Report Types Selection
const ReportTypesCard = ({
    tiposRelatorio,
    selectedType,
    onTypeSelect,
}: {
    tiposRelatorio: Array<{
        id: string;
        nome: string;
        descricao: string;
        icon: LucideIcon;
    }>;
    selectedType: string;
    onTypeSelect: (type: string) => void;
}) => (
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
                    <button
                        key={tipo.id}
                        type="button"
                        className={`cursor-pointer rounded-lg border p-4 text-left transition-colors ${
                            selectedType === tipo.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                        onClick={() => onTypeSelect(tipo.id)}
                    >
                        <div className="flex items-start space-x-3">
                            <tipo.icon className="mt-1 h-6 w-6 text-blue-800" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{tipo.nome}</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tipo.descricao}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </CardContent>
    </Card>
);

// Component for Report Filters
const ReportFiltersCard = ({
    data,
    setData,
    processing,
    emitentes,
    fornecedores,
    formatosDisponiveis,
    selectedReportType,
    onSubmit,
    onExport,
}: {
    data: RelatorioFiltros;
    setData: (field: keyof RelatorioFiltros, value: string) => void;
    processing: boolean;
    emitentes: Array<{ id: number; nome: string; sigla: string }>;
    fornecedores: Array<{ id: number; razao_social: string; cnpj: string }>;
    formatosDisponiveis: Array<{ value: string; label: string }>;
    selectedReportType: string;
    onSubmit: FormEventHandler;
    onExport: () => void;
}) => {
    const dataInicioId = useId();
    const dataFimId = useId();

    const showEmitenteFilter = ['requisicoes_periodo', 'requisicoes_status', 'emitentes_ranking', 'valores_mensais', 'aprovacoes_tempo'].includes(
        selectedReportType
    );

    const showFornecedorFilter = [
        'requisicoes_periodo',
        'requisicoes_status',
        'fornecedores_ranking',
        'valores_mensais',
        'aprovacoes_tempo',
    ].includes(selectedReportType);

    const showStatusFilter = ['requisicoes_periodo', 'requisicoes_status', 'aprovacoes_tempo', 'valores_mensais'].includes(selectedReportType);

    if (!selectedReportType) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtros do Relatório
                </CardTitle>
                <CardDescription>Configure os filtros para personalizar o relatório</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Período */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={dataInicioId}>Data de Início</Label>
                            <Input id={dataInicioId} type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={dataFimId}>Data de Fim</Label>
                            <Input id={dataFimId} type="date" value={data.data_fim} onChange={(e) => setData('data_fim', e.target.value)} />
                        </div>
                    </div>

                    {/* Emitente */}
                    {showEmitenteFilter && (
                        <div className="space-y-2">
                            <Label htmlFor="emitente_id">Emitente</Label>
                            <Select value={data.emitente_id} onValueChange={(value) => setData('emitente_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os emitentes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os emitentes</SelectItem>
                                    {emitentes.map((emitente) => (
                                        <SelectItem key={emitente.id} value={emitente.id.toString()}>
                                            {emitente.nome} ({emitente.sigla})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Fornecedor */}
                    {showFornecedorFilter && (
                        <div className="space-y-2">
                            <Label htmlFor="fornecedor_id">Fornecedor</Label>
                            <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os fornecedores" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os fornecedores</SelectItem>
                                    {fornecedores.map((fornecedor) => (
                                        <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                            {formatters.truncateText(fornecedor.razao_social, 50)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Status */}
                    {showStatusFilter && (
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="autorizada">Autorizada</SelectItem>
                                    <SelectItem value="concretizada">Concretizada</SelectItem>
                                    <SelectItem value="cancelada">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Formato */}
                    <div className="space-y-2">
                        <Label htmlFor="formato">Formato de Saída</Label>
                        <Select value={data.formato} onValueChange={(value) => setData('formato', value)}>
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
                        <Button type="submit" disabled={processing} variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            {processing ? 'Carregando...' : 'Ver Relatório'}
                        </Button>
                        <Button type="button" onClick={onExport} disabled={processing}>
                            <Download className="mr-2 h-4 w-4" />
                            {processing ? 'Exportando...' : 'Exportar'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

// Component for Quick Access Reports
const QuickAccessCard = () => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Relatórios Disponíveis</CardTitle>
            <CardDescription>Acesso rápido aos principais relatórios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="text-sm">
                <div className="font-medium">Requisições</div>
                <div className="text-gray-500">Relatório detalhado de requisições</div>
                <Link href="/relatorios/requisicoes">
                    <Button variant="outline" size="sm" className="mt-1">
                        <FileText className="mr-1 h-3 w-3" />
                        Acessar
                    </Button>
                </Link>
            </div>
            <div className="border-t pt-3 text-sm">
                <div className="font-medium">Pesquisa de Preços Médios</div>
                <div className="text-gray-500">Análise de preços médios por item</div>
                <Link href="/relatorios/average-price-research">
                    <Button variant="outline" size="sm" className="mt-1">
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Acessar
                    </Button>
                </Link>
            </div>
            <div className="border-t pt-3 text-sm">
                <div className="font-medium">Fornecedores</div>
                <div className="text-gray-500">Análise de desempenho de fornecedores</div>
                <Link href="/relatorios/fornecedores">
                    <Button variant="outline" size="sm" className="mt-1">
                        <Building className="mr-1 h-3 w-3" />
                        Acessar
                    </Button>
                </Link>
            </div>
            <div className="border-t pt-3 text-sm">
                <div className="font-medium">Conferências</div>
                <div className="text-gray-500">Relatório de conferências realizadas</div>
                <Link href="/relatorios/conferencias">
                    <Button variant="outline" size="sm" className="mt-1">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Acessar
                    </Button>
                </Link>
            </div>
        </CardContent>
    </Card>
);

// Component for Tips Card
const TipsCard = () => (
    <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FileBarChart className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Dicas de Uso</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="space-y-1">
                            <li>• Selecione um tipo de relatório para filtrar os dados</li>
                            <li>• Use "Ver Relatório" para visualizar na tela</li>
                            <li>• Use "Exportar" para baixar o arquivo</li>
                            <li>• CSV é ideal para importação em outros sistemas</li>
                            <li>• PDF mantém a formatação para impressão</li>
                            <li>• Excel permite análises avançadas</li>
                        </ul>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function RelatoriosIndex({ stats, emitentes = [], fornecedores = [] }: RelatoriosIndexProps) {
    const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>('');

    const { data, setData, processing } = useForm<RelatorioFiltros>({
        tipo_relatorio: '',
        data_inicio: '',
        data_fim: '',
        emitente_id: 'all',
        fornecedor_id: 'all',
        status: 'all',
        formato: 'csv',
    });

    const tiposRelatorio: Array<{
        id: string;
        nome: string;
        descricao: string;
        icon: LucideIcon;
    }> = [
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
            descricao: 'Fornecedores com mais requisições concretizadas',
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
        { value: 'csv', label: 'CSV' },
        { value: 'excel', label: 'Excel (XLSX)' },
        { value: 'pdf', label: 'PDF' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.tipo_relatorio) {
            alert('Por favor, selecione um tipo de relatório.');
            return;
        }

        const reportRoutes: Record<string, string> = {
            requisicoes_periodo: '/relatorios/requisicoes',
            requisicoes_status: '/relatorios/requisicoes',
            emitentes_ranking: '/relatorios/requisicoes',
            fornecedores_ranking: '/relatorios/fornecedores',
            valores_mensais: '/relatorios/requisicoes',
            aprovacoes_tempo: '/relatorios/requisicoes',
        };

        const routePath = reportRoutes[data.tipo_relatorio] || '/relatorios/requisicoes';

        const params: Record<string, string> = {};
        if (data.data_inicio) params.data_inicio = data.data_inicio;
        if (data.data_fim) params.data_fim = data.data_fim;
        if (data.emitente_id && data.emitente_id !== 'all') params.emitente_id = data.emitente_id;
        if (data.fornecedor_id && data.fornecedor_id !== 'all') params.fornecedor_id = data.fornecedor_id;
        if (data.status && data.status !== 'all') params.status = data.status;

        router.get(routePath, params);
    };

    const handleExportReport = () => {
        if (!data.tipo_relatorio) {
            alert('Por favor, selecione um tipo de relatório.');
            return;
        }

        const exportRoutes: Record<string, string> = {
            requisicoes_periodo: '/relatorios/requisicoes/export',
            requisicoes_status: '/relatorios/requisicoes/export',
            emitentes_ranking: '/relatorios/requisicoes/export',
            fornecedores_ranking: '/relatorios/fornecedores/export',
            valores_mensais: '/relatorios/requisicoes/export',
            aprovacoes_tempo: '/relatorios/requisicoes/export',
        };

        const exportRoutePath = exportRoutes[data.tipo_relatorio];

        if (!exportRoutePath) {
            alert('Export não disponível para este tipo de relatório.');
            return;
        }

        const params: Record<string, string> = { formato: data.formato };
        if (data.data_inicio) params.data_inicio = data.data_inicio;
        if (data.data_fim) params.data_fim = data.data_fim;
        if (data.emitente_id && data.emitente_id !== 'all') params.emitente_id = data.emitente_id;
        if (data.fornecedor_id && data.fornecedor_id !== 'all') params.fornecedor_id = data.fornecedor_id;
        if (data.status && data.status !== 'all') params.status = data.status;

        const exportUrl = reportUtils.buildExportUrl(exportRoutePath, params, '');
        window.location.href = exportUrl;
    };

    const handleTypeSelect = (type: string) => {
        setData('tipo_relatorio', type);
        setRelatorioSelecionado(type);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatórios" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gere relatórios personalizados sobre requisições e licitações</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - Report Selection and Filters */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Report Types Selection */}
                        <ReportTypesCard tiposRelatorio={tiposRelatorio} selectedType={relatorioSelecionado} onTypeSelect={handleTypeSelect} />

                        {/* Report Filters */}
                        <ReportFiltersCard
                            data={data}
                            setData={setData}
                            processing={processing}
                            emitentes={emitentes}
                            fornecedores={fornecedores}
                            formatosDisponiveis={formatosDisponiveis}
                            selectedReportType={relatorioSelecionado}
                            onSubmit={handleSubmit}
                            onExport={handleExportReport}
                        />
                    </div>

                    {/* Sidebar - Statistics and Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Statistics */}
                        <QuickStatsCard stats={stats} />

                        {/* Quick Access to Reports */}
                        <QuickAccessCard />

                        {/* Tips Card */}
                        <TipsCard />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
