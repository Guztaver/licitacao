import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { conferencias } from '@/routes';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, DollarSign, FileText, Trash2, User } from 'lucide-react';

interface ShowConferencia {
    id: number;
    periodo_inicio: string;
    periodo_fim: string;
    periodo_display: string;
    total_requisicoes: number;
    total_pedidos_manuais: number;
    total_geral: number;
    status: 'em_andamento' | 'finalizada';
    status_display: string;
    status_color: string;
    observacoes?: string;
    created_at: string;
    updated_at: string;
}

interface ConferenciaShowProps {
    conferencia: ShowConferencia;
    fornecedor: Pick<
        Fornecedor,
        'id' | 'razao_social' | 'cnpj' | 'cnpj_formatado' | 'telefone' | 'telefone_formatado' | 'email' | 'endereco_completo'
    > | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: conferencias.index(),
    },
];

export default function ConferenciaShow({ conferencia, fornecedor }: ConferenciaShowProps) {
    const dynamicBreadcrumbs: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: `Conferência #${conferencia.id}`,
            href: conferencias.show(conferencia.id),
        },
    ];

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta conferência?')) {
            router.delete(conferencias.destroy(conferencia.id));
        }
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={dynamicBreadcrumbs}>
            <Head title={`Conferência #${conferencia.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={conferencias.index()}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Conferência #{conferencia.id}</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {conferencia.periodo_display} • {fornecedor?.razao_social}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {conferencia.status === 'em_andamento' && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div>
                    <Badge className={conferencia.status_color}>{conferencia.status_display}</Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Period Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Informações do Período
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Período Início</p>
                                        <p className="text-lg font-semibold">{conferencia.periodo_inicio}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Período Fim</p>
                                        <p className="text-lg font-semibold">{conferencia.periodo_fim}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Período Completo</p>
                                    <p className="text-lg font-semibold">{conferencia.periodo_display}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <DollarSign className="mr-2 h-5 w-5" />
                                    Resumo Financeiro
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Requisições</p>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                            {formatCurrency(conferencia.total_requisicoes)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Pedidos Manuais</p>
                                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                            {formatCurrency(conferencia.total_pedidos_manuais)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Geral</p>
                                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                            {formatCurrency(conferencia.total_geral)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Observations */}
                        {conferencia.observacoes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Observações
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{conferencia.observacoes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Fornecedor Information */}
                        {fornecedor && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Building2 className="mr-2 h-5 w-5" />
                                        Fornecedor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Razão Social</p>
                                        <p className="font-semibold">{fornecedor.razao_social}</p>
                                    </div>

                                    {fornecedor.cnpj_formatado && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CNPJ</p>
                                            <p className="font-mono text-sm">{fornecedor.cnpj_formatado}</p>
                                        </div>
                                    )}

                                    {fornecedor.telefone_formatado && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</p>
                                            <p className="text-sm">{fornecedor.telefone_formatado}</p>
                                        </div>
                                    )}

                                    {fornecedor.email && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-sm">{fornecedor.email}</p>
                                        </div>
                                    )}

                                    {fornecedor.endereco_completo && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço</p>
                                            <p className="text-sm">{fornecedor.endereco_completo}</p>
                                        </div>
                                    )}

                                    <Separator />

                                    <Button variant="outline" size="sm" asChild className="w-full">
                                        <Link href={`/fornecedores/${fornecedor.id}`}>Ver Fornecedor</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* System Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Informações do Sistema
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</p>
                                    <p className="text-sm">{conferencia.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Atualização</p>
                                    <p className="text-sm">{conferencia.updated_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID da Conferência</p>
                                    <p className="font-mono text-sm">#{conferencia.id}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
