import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { requisicoes } from '@/routes';
import type { BreadcrumbItem, Destinatario, Emitente, Fornecedor, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Download, Edit, Trash2 } from 'lucide-react';

interface ShowRequisicao {
    id: number;
    numero: string;
    numero_completo: string;
    solicitante: string;
    numero_oficio?: string;
    data_recebimento?: string;
    descricao: string;
    anexo?: string;
    status: 'autorizada' | 'concretizada' | 'cancelada' | 'excluida';
    status_display?: string;
    status_color?: string;
    numero_pedido_real?: string;
    valor_final?: number;
    data_concretizacao?: string;
    data_exclusao?: string;
    motivo_exclusao?: string;
    pode_editar?: boolean;
    pode_concretizar?: boolean;
    pode_excluir?: boolean;
    created_at: string;
    updated_at: string;
}

interface ShowRelations {
    emitente?: Pick<Emitente, 'id' | 'nome' | 'sigla' | 'endereco' | 'telefone' | 'email'>;
    destinatario?: Pick<Destinatario, 'id' | 'nome' | 'sigla' | 'endereco' | 'telefone' | 'email'>;
    fornecedor?: Pick<
        Fornecedor,
        'id' | 'razao_social' | 'cnpj' | 'cnpj_formatado' | 'telefone' | 'telefone_formatado' | 'email' | 'endereco_completo'
    >;
    usuario_criacao?: Pick<User, 'name' | 'email'>;
    usuario_concretizacao?: Pick<User, 'name' | 'email'>;
    usuario_exclusao?: Pick<User, 'name' | 'email'>;
}

interface RequisicaoShowProps {
    requisicao: ShowRequisicao;
    relations: ShowRelations;
}

export default function RequisicaoShow({ requisicao, relations }: RequisicaoShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Requisições',
            href: requisicoes.index(),
        },
        {
            title: `Requisição ${requisicao.numero_completo}`,
            href: requisicoes.show(requisicao.id),
        },
    ];

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'autorizada':
                return 'default';
            case 'concretizada':
                return 'secondary';
            case 'cancelada':
                return 'secondary';
            case 'excluida':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleConcretizar = () => {
        if (confirm('Tem certeza que deseja concretizar esta requisição?')) {
            router.post(requisicoes.concretizar(requisicao.id));
        }
    };

    const handleExcluir = () => {
        if (confirm('Tem certeza que deseja excluir esta requisição?')) {
            router.delete(requisicoes.destroy(requisicao.id));
        }
    };

    const formatCurrency = (value?: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Requisição ${requisicao.numero_completo}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Requisição {requisicao.numero_completo}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Criada em {requisicao.created_at}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={requisicoes.index()}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                        {requisicao.anexo && requisicao.anexo.trim() !== '' && (
                            <a href={requisicoes.anexo(requisicao.id)} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar Anexo
                                </Button>
                            </a>
                        )}

                        {requisicao.pode_editar && (
                            <Link href={requisicoes.edit(requisicao.id)}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                            </Link>
                        )}

                        {requisicao.pode_concretizar && (
                            <Button onClick={handleConcretizar} variant="default">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Concretizar
                            </Button>
                        )}

                        {requisicao.pode_excluir && (
                            <Button onClick={handleExcluir} variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Status Badge */}
                    <div className="lg:col-span-3">
                        <Badge variant={getStatusBadgeVariant(requisicao.status)} className="px-3 py-1 text-sm">
                            {requisicao.status_display || requisicao.status}
                        </Badge>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        {/* Informações Básicas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Número</p>
                                        <p className="text-sm">{requisicao.numero}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Número Completo</p>
                                        <p className="text-sm">{requisicao.numero_completo}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Solicitante</p>
                                    <p className="text-sm">{requisicao.solicitante}</p>
                                </div>

                                {requisicao.numero_oficio && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Número do Ofício</p>
                                        <p className="text-sm">{requisicao.numero_oficio}</p>
                                    </div>
                                )}

                                {requisicao.data_recebimento && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Data de Recebimento</p>
                                        <p className="text-sm">{requisicao.data_recebimento}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Anexo</p>
                                    {requisicao.anexo && requisicao.anexo.trim() !== '' ? (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm">{requisicao.anexo.split('/').pop()}</p>
                                            <a href={requisicoes.anexo(requisicao.id)} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-1 h-3 w-3" />
                                                    Baixar
                                                </Button>
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Nenhum anexo</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emitente */}
                        {relations.emitente && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Emitente</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                        <p className="text-sm">{relations.emitente.nome}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Sigla</p>
                                        <p className="text-sm">{relations.emitente.sigla}</p>
                                    </div>
                                    {relations.emitente.endereco && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                                            <p className="text-sm">{relations.emitente.endereco}</p>
                                        </div>
                                    )}
                                    {relations.emitente.telefone && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                                            <p className="text-sm">{relations.emitente.telefone}</p>
                                        </div>
                                    )}
                                    {relations.emitente.email && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                                            <p className="text-sm">{relations.emitente.email}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Destinatário */}
                        {relations.destinatario && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Destinatário</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                        <p className="text-sm">{relations.destinatario.nome}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Sigla</p>
                                        <p className="text-sm">{relations.destinatario.sigla}</p>
                                    </div>
                                    {relations.destinatario.endereco && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                                            <p className="text-sm">{relations.destinatario.endereco}</p>
                                        </div>
                                    )}
                                    {relations.destinatario.telefone && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                                            <p className="text-sm">{relations.destinatario.telefone}</p>
                                        </div>
                                    )}
                                    {relations.destinatario.email && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                                            <p className="text-sm">{relations.destinatario.email}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Fornecedor (se concretizada) */}
                        {relations.fornecedor && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fornecedor</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
                                        <p className="text-sm">{relations.fornecedor.razao_social}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                                        <p className="text-sm">{relations.fornecedor.cnpj_formatado || relations.fornecedor.cnpj}</p>
                                    </div>
                                    {relations.fornecedor.telefone && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                                            <p className="text-sm">{relations.fornecedor.telefone_formatado || relations.fornecedor.telefone}</p>
                                        </div>
                                    )}
                                    {relations.fornecedor.email && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                                            <p className="text-sm">{relations.fornecedor.email}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Descrição */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Descrição</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{requisicao.descricao}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar with additional info */}
                    <div className="space-y-6">
                        {/* Informações de Concretização */}
                        {(requisicao.status === 'concretizada' || requisicao.numero_pedido_real || requisicao.valor_final) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações de Concretização</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {requisicao.numero_pedido_real && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Número do Pedido Real</p>
                                            <p className="text-sm">{requisicao.numero_pedido_real}</p>
                                        </div>
                                    )}
                                    {requisicao.valor_final && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Valor Final</p>
                                            <p className="text-sm">{formatCurrency(requisicao.valor_final)}</p>
                                        </div>
                                    )}
                                    {requisicao.data_concretizacao && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Data de Concretização</p>
                                            <p className="text-sm">{requisicao.data_concretizacao}</p>
                                        </div>
                                    )}
                                    {relations.usuario_concretizacao && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Concretizada por</p>
                                            <p className="text-sm">{relations.usuario_concretizacao.name}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Informações de Exclusão */}
                        {requisicao.status === 'excluida' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações de Exclusão</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {requisicao.data_exclusao && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Data de Exclusão</p>
                                            <p className="text-sm">{requisicao.data_exclusao}</p>
                                        </div>
                                    )}
                                    {requisicao.motivo_exclusao && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Motivo da Exclusão</p>
                                            <p className="text-sm">{requisicao.motivo_exclusao}</p>
                                        </div>
                                    )}
                                    {relations.usuario_exclusao && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Excluída por</p>
                                            <p className="text-sm">{relations.usuario_exclusao.name}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Informações do Sistema */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Sistema</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Criada em</p>
                                        <p className="text-sm">{requisicao.created_at}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Atualizada em</p>
                                        <p className="text-sm">{requisicao.updated_at}</p>
                                    </div>
                                </div>
                                {relations.usuario_criacao && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Criada por</p>
                                        <p className="text-sm">
                                            {relations.usuario_criacao.name} ({relations.usuario_criacao.email})
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
