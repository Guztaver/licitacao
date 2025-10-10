import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2, Power, AlertCircle, TrendingUp, FileText, Clock, Plus, ArrowUp, ArrowDown } from 'lucide-react';
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
    limite_valor_mensal: number | null;
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
    valores: {
        limite_mensal: number | null;
        usado_mes_atual: number;
        restante_mes_atual: number | null;
        mes_atual: string;
    };
}

interface ValorMensal {
    ano: number;
    mes: number;
    periodo_display: string;
    total: number;
    limite: number | null;
    restante: number | null;
    excedeu: boolean;
    quantidade_requisicoes: number;
    valor_total_excedente: number;
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

interface HistoricoLimite {
    id: number;
    tipo_alteracao: 'criacao' | 'atualizacao';
    tipo_display: string;
    campo_alterado: string;
    campo_display: string;
    valor_anterior: number | null;
    valor_novo: number | null;
    diferenca: number | null;
    mensagem: string;
    descricao: string | null;
    icon_color: string;
    badge_color: string;
    usuario: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    created_at_diff: string;
}

interface ContratoShowProps {
    contrato: Contrato;
    stats: Stats;
    requisicoes: Requisicao[];
    conferencias: Conferencia[];
    valores_mensais: ValorMensal[];
    historico_limites: HistoricoLimite[];
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

export default function ContratoShow({ contrato, stats, requisicoes, conferencias, valores_mensais, historico_limites }: ContratoShowProps) {
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
    const valoresProgress = calculateProgress(stats.valores.usado_mes_atual, stats.valores.limite_mensal);

    const requisicoesAtingido = stats.requisicoes.limite !== null && stats.requisicoes.total >= stats.requisicoes.limite;
    const conferenciasAtingido = stats.conferencias.limite !== null && stats.conferencias.total >= stats.conferencias.limite;
    const valoresExcedidos = stats.valores.limite_mensal !== null && stats.valores.usado_mes_atual > stats.valores.limite_mensal;

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

                {valoresExcedidos && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Limite de Valor Mensal Excedido</AlertTitle>
                        <AlertDescription>
                            O limite mensal de {formatCurrency(stats.valores.limite_mensal || 0)} foi excedido em {stats.valores.mes_atual}. Valor
                            utilizado: {formatCurrency(stats.valores.usado_mes_atual)}. As requisições foram adicionadas mas estão marcadas como
                            excedentes.
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

                        {stats.valores.limite_mensal !== null && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Valores Mensais</span>
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    </CardTitle>
                                    <CardDescription>Uso do limite de valor mensal ({stats.valores.mes_atual})</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Utilizado: {formatCurrency(stats.valores.usado_mes_atual)}</span>
                                        <span>Limite: {formatCurrency(stats.valores.limite_mensal)}</span>
                                    </div>
                                    <Progress value={valoresProgress} className="h-2" />
                                    <p className="text-xs text-gray-500">
                                        {stats.valores.restante_mes_atual !== null
                                            ? `Restante: ${formatCurrency(stats.valores.restante_mes_atual)}`
                                            : 'Limite excedido'}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Limit Changes Timeline */}
                {historico_limites.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Histórico de Alterações de Limites
                            </CardTitle>
                            <CardDescription>Linha do tempo de todas as alterações nos limites do contrato</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-4">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                                {historico_limites.map((historico, index) => (
                                    <div key={historico.id} className="relative flex gap-4 pb-4">
                                        {/* Timeline dot */}
                                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
                                            {historico.tipo_alteracao === 'criacao' ? (
                                                <Plus className={`h-4 w-4 ${historico.icon_color}`} />
                                            ) : historico.diferenca && historico.diferenca > 0 ? (
                                                <ArrowUp className={`h-4 w-4 ${historico.icon_color}`} />
                                            ) : historico.diferenca && historico.diferenca < 0 ? (
                                                <ArrowDown className={`h-4 w-4 ${historico.icon_color}`} />
                                            ) : (
                                                <Clock className={`h-4 w-4 ${historico.icon_color}`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={historico.badge_color}>{historico.campo_display}</Badge>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {historico.tipo_display}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{historico.created_at}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{historico.created_at_diff}</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{historico.mensagem}</p>

                                            {historico.descricao && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{historico.descricao}</p>
                                            )}

                                            {historico.usuario && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">Por:</span>
                                                    <span>{historico.usuario.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Monthly Values History */}
                {valores_mensais.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Valores Mensais</CardTitle>
                            <CardDescription>Acompanhamento detalhado do uso mensal do contrato</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Requisições</TableHead>
                                        <TableHead className="text-right">Valor Utilizado</TableHead>
                                        <TableHead className="text-right">Limite</TableHead>
                                        <TableHead className="text-right">Restante</TableHead>
                                        <TableHead className="text-right">Excedente</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {valores_mensais.map((valor, index) => (
                                        <TableRow key={index} className={valor.excedeu ? 'bg-red-50 dark:bg-red-950' : ''}>
                                            <TableCell className="font-medium">{valor.periodo_display}</TableCell>
                                            <TableCell>{valor.quantidade_requisicoes}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(valor.total)}</TableCell>
                                            <TableCell className="text-right">
                                                {valor.limite !== null ? formatCurrency(valor.limite) : 'Ilimitado'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {valor.restante !== null ? formatCurrency(valor.restante) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {valor.excedeu ? (
                                                    <span className="text-red-600 font-semibold">{formatCurrency(valor.valor_total_excedente)}</span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        valor.excedeu
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }
                                                >
                                                    {valor.excedeu ? 'Excedido' : 'Normal'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

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
