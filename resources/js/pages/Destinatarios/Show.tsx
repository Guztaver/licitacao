import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DESTINATARIOS_LABELS, useDestinatarisActions, useDestinatarisUtils } from '@/hooks/use-destinatarios';
import AppLayout from '@/layouts/app-layout';
import { destinatarios } from '@/routes';
import type { BreadcrumbItem, Destinatario, Requisicao } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, FileText, Mail, MapPin, Phone, Trash2 } from 'lucide-react';

interface DestinatariosShowProps {
    destinatario: Destinatario & {
        requisicoes_count: number;
    };
    requisicoes: Requisicao[];
    stats: {
        total_requisicoes: number;
        requisicoes_concretizadas: number;
        valor_total: number;
        requisicoes_mes_atual: number;
    };
}

export default function DestinatariosShow({ destinatario, requisicoes, stats }: DestinatariosShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: DESTINATARIOS_LABELS.destinatarios,
            href: destinatarios.index(),
        },
        {
            title: destinatario.nome,
            href: destinatarios.show(destinatario.id),
        },
    ];

    const { deleteDestinatario } = useDestinatarisActions({
        onSuccess: () => router.get(destinatarios.index()),
    });

    const { formatCurrency, formatDate, getStatusConfig } = useDestinatarisUtils();

    const handleDelete = () => {
        deleteDestinatario(destinatario.id, destinatario.nome);
    };

    const statsConfig = [
        {
            value: stats.total_requisicoes === 0 ? 'Nenhuma' : stats.total_requisicoes,
            label: 'Requisições totais',
            color: 'text-grey-600',
        },
        {
            value: stats.requisicoes_concretizadas === 0 ? 'Nenhuma' : stats.requisicoes_concretizadas,
            label: 'Concretizadas',
            color: 'text-grey-600',
        },
        {
            value: stats.valor_total === 0 ? 'R$ 0,00' : formatCurrency(stats.valor_total),
            label: 'Valor total',
            color: 'text-grey-600',
        },
        {
            value: stats.requisicoes_mes_atual === 0 ? 'Nenhuma' : stats.requisicoes_mes_atual,
            label: 'Este mês',
            color: 'text-grey-800',
        },
    ];

    const infoFields = [
        {
            label: 'Nome',
            value: destinatario.nome,
            span: 'md:col-span-1',
            size: 'text-lg font-semibold',
        },
        {
            label: 'Sigla',
            value: destinatario.sigla,
            span: 'md:col-span-1',
            font: 'font-mono text-sm',
        },
        ...(destinatario.endereco
            ? [
                  {
                      label: 'Endereço',
                      value: destinatario.endereco,
                      icon: MapPin,
                      span: 'md:col-span-2',
                  },
              ]
            : []),
        ...(destinatario.telefone
            ? [
                  {
                      label: 'Telefone',
                      value: destinatario.telefone,
                      icon: Phone,
                      span: 'md:col-span-1',
                  },
              ]
            : []),
        ...(destinatario.email
            ? [
                  {
                      label: 'E-mail',
                      value: destinatario.email,
                      icon: Mail,
                      span: 'md:col-span-1',
                  },
              ]
            : []),
        {
            label: 'Criado em',
            value: formatDate(destinatario.created_at),
            span: 'md:col-span-1',
        },
        {
            label: 'Última atualização',
            value: formatDate(destinatario.updated_at),
            span: 'md:col-span-1',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${DESTINATARIOS_LABELS.showTitle}: ${destinatario.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {DESTINATARIOS_LABELS.showTitle}: {destinatario.nome}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{DESTINATARIOS_LABELS.showSubtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={destinatarios.index()}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {DESTINATARIOS_LABELS.voltar}
                            </Button>
                        </Link>
                        <Link href={destinatarios.edit(destinatario.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                {DESTINATARIOS_LABELS.editar}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Destinatario Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    {DESTINATARIOS_LABELS.informacoesDestinatario}
                                </CardTitle>
                                <CardDescription>Dados cadastrais do órgão destinatário</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {infoFields.map((field) => (
                                        <div key={field.label} className={field.span}>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {field.icon && <field.icon className="mr-1 inline h-4 w-4" />}
                                                {field.label}
                                            </h3>
                                            <p className={`mt-1 text-gray-900 dark:text-gray-100 ${field.size || field.font || 'text-sm'}`}>
                                                {field.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requisitions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Requisições ({stats.total_requisicoes})
                                </CardTitle>
                                <CardDescription>Últimas requisições recebidas por este órgão</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {requisicoes && requisicoes.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Número</TableHead>
                                                        <TableHead>Solicitante</TableHead>
                                                        <TableHead>Data</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Valor</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {requisicoes.slice(0, 10).map((requisicao) => {
                                                        const statusConfig = getStatusConfig(requisicao.status);
                                                        return (
                                                            <TableRow key={requisicao.id}>
                                                                <TableCell>
                                                                    <div className="font-medium text-blue-800">{requisicao.numero_completo}</div>
                                                                </TableCell>
                                                                <TableCell>{requisicao.solicitante}</TableCell>
                                                                <TableCell>{formatDate(requisicao.data_recebimento)}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant={statusConfig.variant}>
                                                                        {requisicao.status_display || statusConfig.label}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {requisicao.valor_final ? formatCurrency(Number(requisicao.valor_final)) : '-'}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        {stats.total_requisicoes > 10 && (
                                            <div className="text-center">
                                                <Link href={`/requisicoes?destinatario_id=${destinatario.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Ver todas as requisições ({stats.total_requisicoes})
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {DESTINATARIOS_LABELS.nenhumaRequisicao}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{DESTINATARIOS_LABELS.nenhumaRequisicaoDesc}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{DESTINATARIOS_LABELS.estatisticas}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {statsConfig.map((stat, index) => (
                                    <div key={stat.label} className={`text-center ${index > 0 ? 'border-t pt-4' : ''}`}>
                                        <div className={`text-2xl font-bold ${stat.color}`}>
                                            {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
                                        </div>
                                        <div className="text-sm text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{DESTINATARIOS_LABELS.acoesTitulo}</CardTitle>
                                <CardDescription>{DESTINATARIOS_LABELS.acoesDesc}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={destinatarios.edit(destinatario.id)}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar destinatário
                                    </Button>
                                </Link>
                                <Link href={`/requisicoes?destinatario_id=${destinatario.id}`}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Ver requisições
                                    </Button>
                                </Link>
                                <Button variant="destructive" className="w-full justify-start" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir destinatário
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
