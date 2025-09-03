import CreateFornecedorModal from '@/components/modals/CreateFornecedorModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { conferencias, dashboard, fornecedores, requisicoes } from '@/routes';
import type { BreadcrumbItem, Conferencia, DashboardStats, Fornecedor, Requisicao } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building, Calendar, CheckSquare, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface DashboardProps {
    stats: DashboardStats;
    recent_requisicoes: Requisicao[];
    fornecedores_ativos: Fornecedor[];
    conferencias_recentes: Conferencia[];
}

export default function Dashboard({ stats, recent_requisicoes, fornecedores_ativos, conferencias_recentes }: DashboardProps) {
    // Add safety checks for data
    const safeStats = stats || {
        total_fornecedores: 0,
        fornecedores_ativos: 0,
        total_requisicoes: 0,
        requisicoes_pendentes: 0,
        requisicoes_concretizadas: 0,
        valor_total_requisicoes: 0,
        requisicoes_mes_atual: 0,
        conferencias_mes_atual: 0,
    };
    const safeRecentRequisicoes = recent_requisicoes || [];
    const safeFornecedoresAtivos = fornecedores_ativos || [];
    const safeConferenciasRecentes = conferencias_recentes || [];
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'autorizada':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'concretizada':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelada':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'excluida':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema de licitações</p>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.total_fornecedores}</div>
                            <p className="text-xs text-muted-foreground">{safeStats.fornecedores_ativos} ativos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Requisições</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.total_requisicoes}</div>
                            <p className="text-xs text-muted-foreground">{safeStats.requisicoes_pendentes} pendentes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(safeStats.valor_total_requisicoes)}</div>
                            <p className="text-xs text-muted-foreground">{safeStats.requisicoes_concretizadas} concretizadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.requisicoes_mes_atual}</div>
                            <p className="text-xs text-muted-foreground">{safeStats.conferencias_mes_atual} conferências</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Requisições */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Requisições Recentes</CardTitle>
                                <CardDescription>Últimas requisições adicionadas ao sistema</CardDescription>
                            </div>
                            <Link href={requisicoes.index()} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                Ver todas
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeRecentRequisicoes.length > 0 ? (
                                    safeRecentRequisicoes.map((requisicao) => (
                                        <div key={requisicao.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={requisicoes.show(requisicao.id)}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        {requisicao.numero_completo}
                                                    </Link>
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(requisicao.status)}`}
                                                    >
                                                        {requisicao.status_display}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{requisicao.solicitante}</p>
                                                <p className="text-xs text-gray-500">
                                                    {requisicao.emitente?.sigla} • {requisicao.data_recebimento}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">Nenhuma requisição encontrada</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Fornecedores */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Fornecedores Ativos</CardTitle>
                                <CardDescription>Fornecedores com maior atividade recente</CardDescription>
                            </div>
                            <Link href={fornecedores.index()} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                Ver todos
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeFornecedoresAtivos.length > 0 ? (
                                    safeFornecedoresAtivos.map((fornecedor) => (
                                        <div key={fornecedor.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                            <div className="flex-1">
                                                <Link
                                                    href={fornecedores.show(fornecedor.id)}
                                                    className="font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    {fornecedor.razao_social}
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{fornecedor.cnpj_formatado}</p>
                                                <div className="mt-1 flex items-center space-x-4">
                                                    <span className="text-xs text-gray-500">{fornecedor.requisicoes_mes_atual} req. este mês</span>
                                                    <span className="text-xs text-gray-500">{formatCurrency(fornecedor.total_geral || 0)} total</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">Nenhum fornecedor ativo encontrado</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Conferências */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href={requisicoes.create()}
                                className="flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                                <FileText className="mr-3 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Nova Requisição</p>
                                    <p className="text-sm text-gray-600">Criar nova requisição</p>
                                </div>
                            </Link>

                            <CreateFornecedorModal
                                trigger={
                                    <div className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50">
                                        <Building className="mr-3 h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium">Novo Fornecedor</p>
                                            <p className="text-sm text-gray-600">Cadastrar fornecedor</p>
                                        </div>
                                    </div>
                                }
                                onSuccess={() => router.reload()}
                            />

                            <Link
                                href={conferencias.create()}
                                className="flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                                <CheckSquare className="mr-3 h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium">Nova Conferência</p>
                                    <p className="text-sm text-gray-600">Iniciar conferência</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Recent Conferências */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Conferências Recentes</CardTitle>
                                <CardDescription>Últimas conferências realizadas</CardDescription>
                            </div>
                            <Link href={conferencias.index()} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                Ver todas
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeConferenciasRecentes.length > 0 ? (
                                    safeConferenciasRecentes.map((conferencia) => (
                                        <div key={conferencia.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">Período: {conferencia.periodo}</span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {conferencia.fornecedor?.razao_social}
                                                </p>
                                                <div className="mt-1 flex items-center space-x-4">
                                                    <span className="text-xs text-gray-500">{formatCurrency(conferencia.total_geral)}</span>
                                                    <span className="text-xs text-gray-500">{conferencia.data_conferencia}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">Nenhuma conferência encontrada</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
