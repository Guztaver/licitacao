import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, DollarSign, Edit2, FileText, Package, ToggleLeft, ToggleRight, Users, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { contratos } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// Types
interface ContratoItem {
    id: number;
    item: {
        id: number;
        codigo: string;
        descricao: string;
    };
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    marca: string;
    unidade_medida: string;
    especificacao: string;
    observacoes: string;
}

interface ContratoData {
    id: number;
    numero_contrato: string;
    fornecedor: {
        id: number;
        razao_social: string;
        cnpj_formatado: string;
    } | null;
    processo_licitatorio: {
        id: number;
        numero_processo: string;
        objeto: string;
        modalidade_display: string;
    } | null;
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: number | null;
    limite_conferencias: number | null;
    limite_valor_mensal: number | null;
    valor_total: number | null;
    status: string;
    status_display: string;
    status_color: string;
    descricao: string;
    fiscal: {
        id: number;
        name: string;
    } | null;
    data_designacao_fiscal: string | null;
    observacoes_fiscal: string | null;
    created_at: string;
    items: ContratoItem[];
    total_itens: number;
}

interface ContratoStats {
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

interface HistoricoLimite {
    id: number;
    tipo_display: string;
    campo_display: string;
    valor_anterior: string;
    valor_novo: string;
    mensagem: string;
    usuario: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    created_at_diff: string;
}

interface ContratosShowProps {
    contrato: ContratoData;
    stats: ContratoStats;
    valores_mensais: any[];
    requisicoes: any[];
    conferencias: any[];
    historico_limites: HistoricoLimite[];
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Contratos',
        href: contratos.index(),
    },
    {
        title: 'Detalhes do Contrato',
        href: '#',
    },
];

const MESSAGES = {
    back: 'Voltar',
    edit: 'Editar',
    toggleStatus: 'Alternar Status',
    contractInfo: 'Informações do Contrato',
    supplier: 'Fornecedor',
    generalContract: 'Contrato Geral',
    biddingProcess: 'Processo Licitatório',
    validity: 'Vigência',
    description: 'Descrição',
    fiscal: 'Fiscal do Contrato',
    fiscalDesignation: 'Data de Designação',
    fiscalNotes: 'Observações do Fiscal',
    items: 'Itens do Contrato',
    usageStats: 'Estatísticas de Uso',
    requests: 'Requisições',
    conferences: 'Conferências',
    monthlyValues: 'Valores Mensais',
    history: 'Histórico de Alterações',
    total: 'Total',
    remaining: 'Restantes',
    used: 'Utilizados',
    monthlyLimit: 'Limite Mensal',
    usedThisMonth: 'Usado no Mês',
    remainingThisMonth: 'Restante no Mês',
    noItems: 'Nenhuma informação disponível',
    noHistory: 'Nenhuma alteração registrada',
    createdBy: 'Criado em',
    cannotEdit: 'Este contrato não pode ser editado',
};

// Utility Functions
const formatCurrency = (value: number | null | undefined) => {
    if (!value || value === 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const calculatePercentage = (used: number, total: number | null) => {
    if (!total || total === 0) return 0;
    return Math.min((used / total) * 100, 100);
};

const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'ativo':
            return <CheckCircle className="h-4 w-4" />;
        case 'inativo':
            return <ToggleLeft className="h-4 w-4" />;
        case 'expirado':
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <CheckCircle className="h-4 w-4" />;
    }
};

// Components
interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    progress?: number;
    progressColor?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, progress, progressColor }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
                {progress !== undefined && (
                    <div className="mt-2">
                        <Progress value={progress} className="h-2" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface ContratoItemRowProps {
    item: ContratoItem;
}

function ContratoItemRow({ item }: ContratoItemRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.item.codigo}</Badge>
                    <div>
                        <p className="font-medium">{item.item.descricao}</p>
                        <p className="text-sm text-gray-500">Un: {item.unidade_medida}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-right">{item.quantidade}</TableCell>
            <TableCell className="text-right">{formatCurrency(item.valor_unitario)}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(item.valor_total)}</TableCell>
            <TableCell>{item.marca || '-'}</TableCell>
            <TableCell className="max-w-xs">
                {item.especificacao ? (
                    <p className="text-sm truncate" title={item.especificacao}>
                        {item.especificacao}
                    </p>
                ) : (
                    '-'
                )}
            </TableCell>
        </TableRow>
    );
}

interface HistoricoRowProps {
    item: HistoricoLimite;
}

function HistoricoRow({ item }: HistoricoRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.tipo_display}</Badge>
                    <span className="text-sm">{item.campo_display}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    {item.valor_anterior && <span className="line-through text-gray-500">{item.valor_anterior}</span>}
                    {item.valor_anterior && item.valor_novo && ' → '}
                    <span className="font-medium">{item.valor_novo}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm">{item.usuario ? item.usuario.name : 'Sistema'}</div>
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <div>{item.created_at}</div>
                    <div className="text-gray-500">{item.created_at_diff}</div>
                </div>
            </TableCell>
            <TableCell>{item.mensagem && <p className="text-sm text-gray-600">{item.mensagem}</p>}</TableCell>
        </TableRow>
    );
}

// Main Component
export default function ContratosShow({ contrato, stats, historico_limites }: ContratosShowProps) {
    const { requisicoesProgress, conferenciasProgress, valoresProgress } = useMemo(
        () => ({
            requisicoesProgress: calculatePercentage(stats.requisicoes.total, stats.requisicoes.limite),
            conferenciasProgress: calculatePercentage(stats.conferencias.total, stats.conferencias.limite),
            valoresProgress: calculatePercentage(stats.valores.usado_mes_atual, stats.valores.limite_mensal),
        }),
        [stats]
    );

    const handleToggleStatus = () => {
        if (contrato.status === 'expirado') return;
        router.post(contratos.toggleStatus(contrato.id));
    };

    const handleEdit = () => {
        router.get(contratos.edit(contrato.id));
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`Contrato ${contrato.numero_contrato}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={contratos.index()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {MESSAGES.back}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contrato {contrato.numero_contrato}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                {getStatusIcon(contrato.status)}
                                <Badge className={contrato.status_color}>{contrato.status_display}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleEdit}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            {MESSAGES.edit}
                        </Button>
                        <Button variant="outline" onClick={handleToggleStatus} disabled={contrato.status === 'expirado'}>
                            {contrato.status === 'ativo' ? <ToggleRight className="mr-2 h-4 w-4" /> : <ToggleLeft className="mr-2 h-4 w-4" />}
                            {MESSAGES.toggleStatus}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contract Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>{MESSAGES.contractInfo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.supplier}</p>
                                    <p className="font-medium">
                                        {contrato.fornecedor ? (
                                            <>
                                                {contrato.fornecedor.razao_social}
                                                <p className="text-sm text-gray-500">{contrato.fornecedor.cnpj_formatado}</p>
                                            </>
                                        ) : (
                                            MESSAGES.generalContract
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.validity}</p>
                                    <p className="font-medium">
                                        {contrato.data_inicio} até {contrato.data_fim}
                                    </p>
                                </div>
                            </div>

                            {contrato.processo_licitatorio && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.biddingProcess}</p>
                                    <p className="font-medium">{contrato.processo_licitatorio.numero_processo}</p>
                                    <p className="text-sm text-gray-600">{contrato.processo_licitatorio.objeto}</p>
                                    <Badge variant="outline" className="mt-1">
                                        {contrato.processo_licitatorio.modalidade_display}
                                    </Badge>
                                </div>
                            )}

                            {contrato.descricao && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.description}</p>
                                    <p className="text-gray-700">{contrato.descricao}</p>
                                </div>
                            )}

                            {contrato.fiscal && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.fiscal}</p>
                                    <p className="font-medium">{contrato.fiscal.name}</p>
                                    {contrato.data_designacao_fiscal && (
                                        <p className="text-sm text-gray-600">
                                            {MESSAGES.fiscalDesignation}: {contrato.data_designacao_fiscal}
                                        </p>
                                    )}
                                </div>
                            )}

                            {contrato.observacoes_fiscal && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{MESSAGES.fiscalNotes}</p>
                                    <p className="text-gray-700">{contrato.observacoes_fiscal}</p>
                                </div>
                            )}

                            <div className="text-sm text-gray-500">
                                {MESSAGES.createdBy}: {contrato.created_at}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{MESSAGES.usageStats}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <StatCard
                                title={MESSAGES.requests}
                                value={`${stats.requisicoes.total}`}
                                subtitle={`de ${stats.requisicoes.limite || MESSAGES.total}`}
                                icon={Package}
                                progress={requisicoesProgress}
                                progressColor={getProgressColor(requisicoesProgress)}
                            />

                            <StatCard
                                title={MESSAGES.conferences}
                                value={`${stats.conferencias.total}`}
                                subtitle={`de ${stats.conferencias.limite || MESSAGES.total}`}
                                icon={Users}
                                progress={conferenciasProgress}
                                progressColor={getProgressColor(conferenciasProgress)}
                            />

                            {stats.valores.limite_mensal && (
                                <StatCard
                                    title={MESSAGES.monthlyValues}
                                    value={formatCurrency(stats.valores.usado_mes_atual)}
                                    subtitle={`${MESSAGES.usedThisMonth}: ${stats.valores.mes_atual}`}
                                    icon={DollarSign}
                                    progress={valoresProgress}
                                    progressColor={getProgressColor(valoresProgress)}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Contract Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>{MESSAGES.items}</CardTitle>
                        <CardDescription>
                            {contrato.total_itens} itens no contrato • Valor total: {formatCurrency(contrato.valor_total)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {contrato.items.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Quantidade</TableHead>
                                            <TableHead className="text-right">Valor Unitário</TableHead>
                                            <TableHead className="text-right">Valor Total</TableHead>
                                            <TableHead>Marca</TableHead>
                                            <TableHead>Especificação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contrato.items.map((item) => (
                                            <ContratoItemRow key={item.id} item={item} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">{MESSAGES.noItems}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* History */}
                <Card>
                    <CardHeader>
                        <CardTitle>{MESSAGES.history}</CardTitle>
                        <CardDescription>Alterações nos limites e configurações do contrato</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {historico_limites.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Alteração</TableHead>
                                            <TableHead>Valores</TableHead>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Observações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historico_limites.map((item) => (
                                            <HistoricoRow key={item.id} item={item} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">{MESSAGES.noHistory}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
