import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    BellIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { dashboardService, biddingUtils } from '@/services/bidding';
import type { LimitesDashboard } from '@/types/bidding';

interface Props {
    className?: string;
}

export default function BiddingDashboardWidget({ className }: Props) {
    const [dashboardData, setDashboardData] = useState<LimitesDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDadosDashboard();
    }, []);

    const carregarDadosDashboard = async () => {
        try {
            const data = await dashboardService.obterDados();
            setDashboardData(data);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <Alert>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>Não foi possível carregar os dados do dashboard de limites de dispensa.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Controle de Limites de Dispensa</h2>
                    <p className="text-gray-600">Acompanhe em tempo real o uso dos limites de dispensa de licitação</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route('categorias.index')}>
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Ver Categorias
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('dispensas.index')}>
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Ver Dispensas
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
                        <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.total_categorias}</div>
                        <p className="text-xs text-muted-foreground">{dashboardData.categorias_ativas} ativas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
                        <BellIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{dashboardData.alertas_ativos}</div>
                        <p className="text-xs text-muted-foreground">Requerem atenção</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dispensas este Mês</CardTitle>
                        <DocumentArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.dispensas_este_mes}</div>
                        <p className="text-xs text-muted-foreground">Total: {biddingUtils.formatarMoeda(dashboardData.valor_total_este_mes)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorias Críticas</CardTitle>
                        <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{dashboardData.categorias_criticas.length}</div>
                        <p className="text-xs text-muted-foreground">Próximas ou acima do limite</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categorias Críticas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                            Categorias Críticas
                        </CardTitle>
                        <CardDescription>Categorias que estão próximas ou acima dos limites de dispensa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.categorias_criticas.length === 0 ? (
                            <div className="text-center py-6">
                                <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-500" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Todas as categorias OK</h3>
                                <p className="mt-1 text-sm text-gray-500">Nenhuma categoria ultrapassou os limites de alerta.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.categorias_criticas.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">{item.categoria.nome}</span>
                                                <Badge
                                                    variant={item.status === 'bloqueio' ? 'destructive' : 'secondary'}
                                                    className={item.status === 'alerta' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                >
                                                    {item.status === 'bloqueio' ? 'Bloqueio' : 'Alerta'}
                                                </Badge>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${item.status === 'bloqueio' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${Math.min(item.percentual_uso, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>{item.percentual_uso.toFixed(1)}% utilizado</span>
                                                <span>
                                                    {biddingUtils.formatarMoeda((item.percentual_uso / 100) * item.categoria.limite_dispensa_anual)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={route('dispensas.index', { tab: 'alertas' })}>Ver todos os alertas</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Alertas Recentes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BellIcon className="h-5 w-5 mr-2 text-yellow-600" />
                            Alertas Recentes
                        </CardTitle>
                        <CardDescription>Últimos alertas gerados pelo sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.alertas_recentes.length === 0 ? (
                            <div className="text-center py-6">
                                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum alerta recente</h3>
                                <p className="mt-1 text-sm text-gray-500">Os alertas aparecerão aqui quando os limites forem aproximados.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dashboardData.alertas_recentes.slice(0, 5).map((alerta) => (
                                    <div key={alerta.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div
                                            className={`p-1 rounded-full ${
                                                alerta.tipo_alerta === 'critical'
                                                    ? 'bg-red-100'
                                                    : alerta.tipo_alerta === 'error'
                                                      ? 'bg-orange-100'
                                                      : 'bg-yellow-100'
                                            }`}
                                        >
                                            <ExclamationTriangleIcon
                                                className={`h-4 w-4 ${
                                                    alerta.tipo_alerta === 'critical'
                                                        ? 'text-red-600'
                                                        : alerta.tipo_alerta === 'error'
                                                          ? 'text-orange-600'
                                                          : 'text-yellow-600'
                                                }`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{alerta.categoria_material?.nome}</p>
                                            <p className="text-sm text-gray-500 truncate">{alerta.mensagem}</p>
                                            <p className="text-xs text-gray-400">{biddingUtils.formatarData(alerta.created_at)}</p>
                                        </div>
                                    </div>
                                ))}
                                {dashboardData.alertas_recentes.length > 5 && (
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link href={route('dispensas.index', { tab: 'alertas' })}>Ver todos os alertas</Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dispensas Recentes */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Dispensas Recentes
                            </CardTitle>
                            <CardDescription>Últimas dispensas de licitação registradas</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('dispensas.index')}>Ver todas</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {dashboardData.dispensas_recentes.length === 0 ? (
                        <div className="text-center py-6">
                            <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma dispensa registrada</h3>
                            <p className="mt-1 text-sm text-gray-500">As dispensas aparecerão aqui assim que forem criadas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dashboardData.dispensas_recentes.slice(0, 5).map((dispensa) => (
                                <div key={dispensa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{dispensa.numero}</span>
                                            <Badge variant={dispensa.status === 'ativa' ? 'default' : 'secondary'}>
                                                {dispensa.status === 'ativa' ? 'Ativa' : dispensa.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {dispensa.categoria_material?.nome} •{biddingUtils.formatarData(dispensa.data_dispensa)} •
                                            {dispensa.responsavel}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">{biddingUtils.formatarMoeda(dispensa.valor)}</div>
                                    </div>
                                </div>
                            ))}
                            {dashboardData.dispensas_recentes.length > 5 && (
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={route('dispensas.index')}>Ver todas as dispensas</Link>
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
