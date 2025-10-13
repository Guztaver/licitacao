import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ChartBarIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    EyeIcon,
    TrashIcon,
    FunnelIcon,
    CalendarIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { MaterialValueChart, MonthlyTrendChart, CategoryDistributionChart, DispensaLimitChart } from '@/components/Charts';
import Layout from '@/layouts/MainLayout';

interface DashboardData {
    top_materiais_valor: Array<{
        item: { descricao: string };
        valor_total: number;
    }>;
    top_materiais_quantidade: Array<{
        item: { descricao: string };
        quantidade_total: number;
    }>;
    resumo_categorias: Array<{
        categoria: { nome: string };
        valor_total: number;
        quantidade_total: number;
    }>;
    top_variacoes: Array<{
        item: { descricao: string };
        variacao_preco_percentual: number;
        variacao_display: any;
    }>;
    tendencia_mensal: Array<{
        periodo: string;
        mes: string;
        valor_total: number;
        quantidade_total: number;
        itens_distintos: number;
    }>;
    distribuicao_contratos: Array<{
        status: string;
        status_display: string;
        total: number;
        valor_total: number;
    }>;
    limites_dispensa: Array<{
        categoria: string;
        valor_usado: number;
        limite_mensal: number;
        percentual_usado: number;
        status: 'normal' | 'alerta' | 'bloqueio';
    }>;
}

interface Relatorio {
    id: number;
    nome: string;
    tipo: string;
    formato: string;
    status: string;
    data_geracao: string;
    tamanho_arquivo: string;
    download_url: string;
    usuario_solicitante: {
        name: string;
    };
}

export default function ReportsPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Report generation states
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportType, setReportType] = useState('');
    const [reportFormat, setReportFormat] = useState('pdf');
    const [reportPeriod, setReportPeriod] = useState<'current' | 'last' | 'custom'>('current');
    const [customYear, setCustomYear] = useState(new Date().getFullYear());
    const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter states
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [categoryIdFilter, setCategoryIdFilter] = useState<number | null>(null);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            carregarDadosDashboard();
        } else if (activeTab === 'relatorios') {
            carregarRelatorios();
        }
    }, [activeTab, year, month, categoryIdFilter]);

    const carregarDadosDashboard = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ano: year.toString(),
                mes: month.toString(),
            });

            if (categoryIdFilter) {
                params.append('categoria_id', categoryIdFilter.toString());
            }

            const response = await fetch(`/api/relatorios/dashboard-data?${params}`);
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarRelatorios = async () => {
        try {
            const response = await fetch('/api/relatorios/listar');
            const data = await response.json();
            setRelatorios(data.data);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
        }
    };

    const gerarRelatorio = async () => {
        if (!reportType) return;

        setIsGenerating(true);
        try {
            const parametros: any = {};

            // Configure parameters based on period selection
            if (reportPeriod === 'current') {
                parametros.ano = new Date().getFullYear();
                parametros.mes = new Date().getMonth() + 1;
            } else if (reportPeriod === 'last') {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                parametros.ano = lastMonth.getFullYear();
                parametros.mes = lastMonth.getMonth() + 1;
            } else {
                parametros.ano = customYear;
                if (customMonth) parametros.mes = customMonth;
            }

            if (categoryId) {
                parametros.categoria_id = categoryId;
            }

            const response = await fetch('/relatorios/gerar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    tipo: reportType,
                    formato: reportFormat,
                    parametros,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsReportDialogOpen(false);
                // Reset form
                setReportType('');
                setReportFormat('pdf');
                setReportPeriod('current');
                setCategoryId(null);

                // Show success message
                alert('Relatório iniciado com sucesso! Você será notificado quando estiver pronto.');

                // Reload reports list if on reports tab
                if (activeTab === 'relatorios') {
                    carregarRelatorios();
                }
            } else {
                alert('Erro ao gerar relatório: ' + result.error);
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const excluirRelatorio = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

        try {
            const response = await fetch(`/relatorios/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setRelatorios(relatorios.filter((r) => r.id !== id));
            } else {
                alert('Erro ao excluir relatório');
            }
        } catch (error) {
            console.error('Erro ao excluir relatório:', error);
            alert('Erro ao excluir relatório');
        }
    };

    const getReportTypeLabel = (tipo: string) => {
        const types: { [key: string]: string } = {
            materiais: 'Relatório de Materiais',
            servicos: 'Relatório de Serviços',
            contratos: 'Relatório de Contratos',
            dispensas: 'Relatório de Dispensas',
            uso_categorias: 'Relatório de Uso por Categorias',
            fornecedores: 'Relatório de Fornecedores',
        };
        return types[tipo] || tipo;
    };

    const getReportStatusBadge = (status: string) => {
        switch (status) {
            case 'concluido':
                return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
            case 'gerando':
                return <Badge className="bg-blue-100 text-blue-800">Gerando</Badge>;
            case 'erro':
                return <Badge variant="destructive">Erro</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Layout>
            <Head title="Relatórios e Análises" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
                        <p className="text-gray-600 mt-2">Visualize gráficos e gere relatórios detalhados de materiais e serviços</p>
                    </div>

                    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                Gerar Relatório
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Gerar Novo Relatório</DialogTitle>
                                <DialogDescription>Selecione o tipo e formato do relatório que deseja gerar.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="report_type">Tipo de Relatório</Label>
                                    <Select value={reportType} onValueChange={setReportType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="materiais">Relatório de Materiais</SelectItem>
                                            <SelectItem value="servicos">Relatório de Serviços</SelectItem>
                                            <SelectItem value="contratos">Relatório de Contratos</SelectItem>
                                            <SelectItem value="dispensas">Relatório de Dispensas</SelectItem>
                                            <SelectItem value="uso_categorias">Relatório de Uso por Categorias</SelectItem>
                                            <SelectItem value="fornecedores">Relatório de Fornecedores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="report_format">Formato</Label>
                                    <Select value={reportFormat} onValueChange={setReportFormat}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                            <SelectItem value="csv">CSV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Período</Label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="current_period"
                                                checked={reportPeriod === 'current'}
                                                onCheckedChange={() => setReportPeriod('current')}
                                            />
                                            <Label htmlFor="current_period" className="text-sm">
                                                Mês atual
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="last_period"
                                                checked={reportPeriod === 'last'}
                                                onCheckedChange={() => setReportPeriod('last')}
                                            />
                                            <Label htmlFor="last_period" className="text-sm">
                                                Mês anterior
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="custom_period"
                                                checked={reportPeriod === 'custom'}
                                                onCheckedChange={() => setReportPeriod('custom')}
                                            />
                                            <Label htmlFor="custom_period" className="text-sm">
                                                Personalizado
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {reportPeriod === 'custom' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="custom_year">Ano</Label>
                                            <Input
                                                id="custom_year"
                                                type="number"
                                                value={customYear}
                                                onChange={(e) => setCustomYear(Number(e.target.value))}
                                                min="2020"
                                                max="2030"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="custom_month">Mês (opcional)</Label>
                                            <Select value={customMonth.toString()} onValueChange={(value) => setCustomMonth(Number(value))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Ano inteiro</SelectItem>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                            {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={gerarRelatorio} disabled={!reportType || isGenerating}>
                                    {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="relatorios">Relatórios Gerados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6">
                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FunnelIcon className="h-5 w-5 mr-2" />
                                    Filtros
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 items-end flex-wrap">
                                    <div>
                                        <Label htmlFor="year_filter">Ano</Label>
                                        <Input
                                            id="year_filter"
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            min="2020"
                                            max="2030"
                                            className="w-24"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="month_filter">Mês</Label>
                                        <Select value={month.toString()} onValueChange={(value) => setMonth(Number(value))}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                        {new Date(2000, i).toLocaleString('pt-BR', { month: 'short' })}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setYear(new Date().getFullYear());
                                            setMonth(new Date().getMonth() + 1);
                                            setCategoryIdFilter(null);
                                        }}
                                    >
                                        Limpar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : dashboardData ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Materials by Value */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                                            Top 10 Materiais por Valor
                                        </CardTitle>
                                        <CardDescription>Materiais com maior valor total no período</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <MaterialValueChart data={dashboardData.top_materiais_valor} />
                                    </CardContent>
                                </Card>

                                {/* Monthly Trend */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Tendência Mensal
                                        </CardTitle>
                                        <CardDescription>Evolução de valor e quantidade nos últimos 12 meses</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <MonthlyTrendChart data={dashboardData.tendencia_mensal} />
                                    </CardContent>
                                </Card>

                                {/* Category Distribution */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                                            Distribuição por Categoria
                                        </CardTitle>
                                        <CardDescription>Valor total distribuído por categoria de material</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CategoryDistributionChart data={dashboardData.resumo_categorias} />
                                    </CardContent>
                                </Card>

                                {/* Dispensa Limits */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-600" />
                                            Limites de Dispensa
                                        </CardTitle>
                                        <CardDescription>Uso dos limites de dispensa por categoria</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <DispensaLimitChart data={dashboardData.limites_dispensa} />
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Alert>
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                <AlertDescription>Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="relatorios" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Relatórios Gerados</CardTitle>
                                <CardDescription>Histórico de relatórios solicitados e seus status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {relatorios.length === 0 ? (
                                    <div className="text-center py-12">
                                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum relatório encontrado</h3>
                                        <p className="mt-1 text-sm text-gray-500">Clique em "Gerar Relatório" para criar seu primeiro relatório.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Formato</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Data Geração</TableHead>
                                                <TableHead>Tamanho</TableHead>
                                                <TableHead>Solicitante</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {relatorios.map((relatorio) => (
                                                <TableRow key={relatorio.id}>
                                                    <TableCell className="font-medium">{relatorio.nome}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{getReportTypeLabel(relatorio.tipo)}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{relatorio.formato.toUpperCase()}</Badge>
                                                    </TableCell>
                                                    <TableCell>{getReportStatusBadge(relatorio.status)}</TableCell>
                                                    <TableCell>{new Date(relatorio.data_geracao).toLocaleString('pt-BR')}</TableCell>
                                                    <TableCell>{relatorio.tamanho_arquivo}</TableCell>
                                                    <TableCell>{relatorio.usuario_solicitante.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {relatorio.status === 'concluido' && (
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <a href={relatorio.download_url} target="_blank">
                                                                        <EyeIcon className="h-4 w-4" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => excluirRelatorio(relatorio.id)}
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
                </Tabs>
            </div>
        </Layout>
    );
}
