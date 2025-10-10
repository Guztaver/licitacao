import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2, Power, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Contrato {
    id: number;
    numero_contrato: string;
    fornecedor?: {
        id: number;
        razao_social: string;
        cnpj_formatado: string;
    };
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: number | null;
    limite_conferencias: number | null;
    status: 'ativo' | 'inativo' | 'expirado';
    status_display: string;
    status_color: string;
    descricao?: string;
    created_at: string;
}

interface Stats {
    requisicoes: {
        total: number;
        limite: number | null;
        restantes: number | null;
    };
    conferencias: {
        total: number;
        limite: number | null;
        restantes: number | null;
    };
}

interface Requisicao {
    id: number;
    numero_completo: string;
    data_recebimento: string;
    valor_final: number;
}

interface Conferencia {
    id: number;
    periodo_display: string;
    total_geral: number;
}

interface ContratoShowProps {
    contrato: Contrato;
    stats: Stats;
    requisicoes: Requisicao[];
    conferencias: Conferencia[];
}

const breadcrumbs = (contratoId: number): BreadcrumbItem[] => [
    {
        title: 'Contratos',
        href: '/contratos',
    },
    {
        title: 'Detalhes',
        href: `/contratos/${contratoId}`,
    },
];

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const calculateProgress = (total: number, limite: number | null): number => {
    if (limite === null) return 0;
    return Math.min((total / limite) * 100, 100);
};

export default function ContratoShow({ contrato, stats, requisicoes, conferencias }: ContratoShowProps) {
    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este contrato?')) {
            router.delete(`/contratos/${contrato.id}`);
        }
    };

    const handleToggleStatus = () => {
        router.post(`/contratos/${contrato.id}/toggle-status`);
    };

    const requisitionalProgress = calculateProgress(stats.requisicoes.total, stats.requisicoes.limite);
    const conferenciasProgress = calculateProgress(stats.conferencias.total, stats.conferencias.limite);

    const requisicoesAtingido = stats.requisicoes.limite !== null && stats.requisicoes.total >= stats.requisicoes.limite;
    const conferenciasAtingido = stats.conferencias.limite !== null && stats.conferencias.total >= stats.conferencias.limite;

    return (
        <AppLayout breadcrumbs={breadcrumbs(contrato.id)}>
            <Head title={`Contrato ${contrato.numero_contrato}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contrato {contrato.numero_contrato}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Detalhes e estatísticas do contrato</p>
                    </div>
                    <div className="flex gap-2">
                        {contrato.status !== 'expirado' && (
                            <Button variant="outline" onClick={handleToggleStatus}>
                                <Power className="mr-2 h-4 w-4" />
                                {contrato.status === 'ativo' ? 'Desativar' : 'Ativar'}
                            </Button>
                        )}
                        <Link href={`/contratos/${contrato.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                </div>

                {/* Alerts */}
                {requisicoesAtingido && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Limite de Requisições Atingido</AlertTitle>
                        <AlertDescription>
                            O limite de {stats.requisicoes.limite} requisições foi atingido. Não é possível criar novas requisições para este
                            contrato.
                        </AlertDescription>
                    </Alert>
                )}

                {conferenciasAtingido && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Limite de Conferências Atingido</AlertTitle>
                        <AlertDescription>
                            O limite de {stats.conferencias.limite} conferências foi atingido. Não é possível criar novas conferências para este
                            contrato.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Info Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Contrato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Número</p>
                                <p className="text-lg font-semibold">{contrato.numero_contrato}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fornecedor</p>
                                <p className="text-lg">{contrato.fornecedor ? contrato.fornecedor.razao_social : 'Contrato Geral'}</p>
                                {contrato.fornecedor && <p className="text-sm text-gray-500">{contrato.fornecedor.cnpj_formatado}</p>}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vigência</p>
                                <p className="text-lg">
                                    {contrato.data_inicio} a {contrato.data_fim}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                <Badge
                                    className={
                                        contrato.status === 'ativo'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : contrato.status === 'inativo'
                                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }
                                >
                                    {contrato.status_display}
                                </Badge>
                            </div>
                            {contrato.descricao && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</p>
                                    <p className="text-sm">{contrato.descricao}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Requisições</span>
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                </CardTitle>
                                <CardDescription>Uso do limite de requisições</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Utilizadas: {stats.requisicoes.total}</span>
                                    <span>Limite: {stats.requisicoes.limite !== null ? stats.requisicoes.limite : 'Ilimitado'}</span>
                                </div>
                                {stats.requisicoes.limite !== null && (
                                    <>
                                        <Progress value={requisitionalProgress} className="h-2" />
                                        <p className="text-xs text-gray-500">
                                            {stats.requisicoes.restantes !== null
                                                ? `${stats.requisicoes.restantes} requisições restantes`
                                                : 'Limite atingido'}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Conferências</span>
                                    <FileText className="h-5 w-5 text-purple-500" />
                                </CardTitle>
                                <CardDescription>Uso do limite de conferências</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Utilizadas: {stats.conferencias.total}</span>
                                    <span>Limite: {stats.conferencias.limite !== null ? stats.conferencias.limite : 'Ilimitado'}</span>
                                </div>
                                {stats.conferencias.limite !== null && (
                                    <>
                                        <Progress value={conferenciasProgress} className="h-2" />
                                        <p className="text-xs text-gray-500">
                                            {stats.conferencias.restantes !== null
                                                ? `${stats.conferencias.restantes} conferências restantes`
                                                : 'Limite atingido'}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Requisitions */}
                {requisicoes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Requisições Recentes</CardTitle>
                            <CardDescription>Últimas requisições vinculadas a este contrato</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Data Recebimento</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requisicoes.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>
                                                <Link href={`/requisicoes/${req.id}`} className="text-blue-600 hover:underline">
                                                    {req.numero_completo}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{req.data_recebimento}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(req.valor_final)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Conferences */}
                {conferencias.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Conferências Recentes</CardTitle>
                            <CardDescription>Últimas conferências vinculadas a este contrato</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Período</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conferencias.map((conf) => (
                                        <TableRow key={conf.id}>
                                            <TableCell>
                                                <Link href={`/conferencias/${conf.id}`} className="text-blue-600 hover:underline">
                                                    {conf.periodo_display}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(conf.total_geral)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
