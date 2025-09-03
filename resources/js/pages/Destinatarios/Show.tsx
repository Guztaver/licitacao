import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { destinatarios, requisicoes } from '@/routes';
import type { BreadcrumbItem, Destinatario, Requisicao } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Edit, FileText, Mail, MapPin, Phone, Trash2 } from 'lucide-react';

interface DestinatariosShowProps {
    destinatario: Destinatario & {
        requisicoes?: Requisicao[];
        requisicoes_count: number;
    };
}

export default function DestinatariosShow({ destinatario }: DestinatariosShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Destinatários',
            href: destinatarios.index(),
        },
        {
            title: destinatario.nome,
            href: destinatarios.show(destinatario.id),
        },
    ];

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este destinatário?')) {
            router.delete(destinatarios.destroy(destinatario.id));
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pendente: { label: 'Pendente', variant: 'secondary' as const },
            aprovado: { label: 'Aprovado', variant: 'default' as const },
            rejeitado: { label: 'Rejeitado', variant: 'destructive' as const },
        };

        return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Destinatário: ${destinatario.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Destinatário: {destinatario.nome}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Detalhes do órgão destinatário</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={destinatarios.index()}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                        <Link href={destinatarios.edit(destinatario.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Informações do Destinatário */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    Informações do Destinatário
                                </CardTitle>
                                <CardDescription>Dados cadastrais do órgão destinatário</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</h3>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{destinatario.nome}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sigla</h3>
                                        <p className="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100">{destinatario.sigla}</p>
                                    </div>
                                </div>

                                {destinatario.endereco && (
                                    <div>
                                        <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <MapPin className="mr-1 h-4 w-4" />
                                            Endereço
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{destinatario.endereco}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {destinatario.telefone && (
                                        <div>
                                            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <Phone className="mr-1 h-4 w-4" />
                                                Telefone
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{destinatario.telefone}</p>
                                        </div>
                                    )}
                                    {destinatario.email && (
                                        <div>
                                            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <Mail className="mr-1 h-4 w-4" />
                                                E-mail
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{destinatario.email}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de cadastro</h3>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {format(new Date(destinatario.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Última atualização</h3>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {format(new Date(destinatario.updated_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                                                locale: ptBR,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requisições */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Requisições Recentes
                                </CardTitle>
                                <CardDescription>Últimas requisições recebidas por este órgão</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {destinatario.requisicoes && destinatario.requisicoes.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Número</TableHead>
                                                        <TableHead>Data</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Valor</TableHead>
                                                        <TableHead>Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {destinatario.requisicoes.slice(0, 5).map((requisicao) => {
                                                        const statusConfig = getStatusBadge(requisicao.status);
                                                        return (
                                                            <TableRow key={requisicao.id}>
                                                                <TableCell>
                                                                    <Link
                                                                        href={requisicoes.show(requisicao.id)}
                                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {requisicao.numero_completo}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell>{requisicao.data_recebimento}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {requisicao.valor_final
                                                                        ? new Intl.NumberFormat('pt-BR', {
                                                                              style: 'currency',
                                                                              currency: 'BRL',
                                                                          }).format(Number(requisicao.valor_final))
                                                                        : '-'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link href={requisicoes.show(requisicao.id)}>
                                                                        <Button variant="outline" size="sm">
                                                                            Ver
                                                                        </Button>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        {emitente.requisicoes_count > 5 && (
                                            <div className="text-center">
                                                <Link href={`${requisicoes.index()}?emitente_id=${emitente.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Ver todas as requisições ({emitente.requisicoes_count})
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhuma requisição</h3>
                                        <p className="mt-1 text-sm text-gray-500">Este destinatário ainda não possui requisições registradas.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{emitente.requisicoes_count}</div>
                                    <div className="text-sm text-gray-500">Requisições totais</div>
                                </div>

                                {emitente.requisicoes && (
                                    <>
                                        <div className="border-t pt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {emitente.requisicoes.filter((r) => r.status === 'aprovado').length}
                                                </div>
                                                <div className="text-sm text-gray-500">Aprovadas</div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {destinatario.requisicoes.filter((r) => r.status === 'pendente').length}
                                                </div>
                                                <div className="text-sm text-gray-500">Pendentes</div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {destinatario.requisicoes.filter((r) => r.status === 'rejeitado').length}
                                                </div>
                                                <div className="text-sm text-gray-500">Rejeitadas</div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }).format(destinatario.requisicoes.reduce((acc, r) => acc + (Number(r.valor_final) || 0), 0))}
                                                </div>
                                                <div className="text-sm text-gray-500">Valor total</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ações</CardTitle>
                                <CardDescription>Gerenciar este destinatário</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={destinatarios.edit(destinatario.id)}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar destinatário
                                    </Button>
                                </Link>
                                <Link href={`${requisicoes.index()}?destinatario_id=${destinatario.id}`}>
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
