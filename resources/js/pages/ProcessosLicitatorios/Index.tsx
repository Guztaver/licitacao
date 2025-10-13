import { Head, Link, router } from '@inertiajs/react';
import { FileDown, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ProcessoLicitatorio {
    id: number;
    numero_processo: string;
    objeto: string;
    modalidade: string;
    modalidade_display: string;
    tipo_licitacao: string;
    tipo_licitacao_display: string;
    status: string;
    status_display: string;
    status_color: string;
    data_abertura: string | null;
    data_abertura_formatted: string | null;
    data_homologacao: string | null;
    data_adjudicacao: string | null;
    valor_estimado: number | null;
    valor_adjudicado: number | null;
    setor_requisitante: string | null;
    usuario_responsavel: {
        id: number;
        name: string;
    } | null;
    pode_editar: boolean;
    pode_excluir: boolean;
    is_finalizado: boolean;
    economia_percentual: number | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    from: number;
    to: number;
    last_page: number;
    current_page: number;
}

interface ProcessosLicitatoriosIndexProps {
    processos: {
        data: ProcessoLicitatorio[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
        status?: string;
        modalidade?: string;
        data_inicio?: string;
        data_fim?: string;
    };
    modalidades: Record<string, string>;
    status_options: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Processos Licitatórios',
        href: '/processos-licitatorios',
    },
];

export default function ProcessosLicitatoriosIndex({ processos, filters, modalidades, status_options }: ProcessosLicitatoriosIndexProps) {
    // Safe data extraction
    const safeProcessos = processos || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safeProcessos.data || [];
    const safeLinks = safeProcessos.links || [];
    const safeMeta = safeProcessos.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeFilters = filters || {};
    const safeModalidades = modalidades || {};
    const safeStatusOptions = status_options || {};

    const [search, setSearch] = useState(safeFilters.search || '');
    const [status, setStatus] = useState(safeFilters.status || 'all');
    const [modalidade, setModalidade] = useState(safeFilters.modalidade || 'all');
    const [dataInicio, setDataInicio] = useState(safeFilters.data_inicio || '');
    const [dataFim, setDataFim] = useState(safeFilters.data_fim || '');

    const handleSearch = () => {
        router.get(
            '/processos-licitatorios',
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                modalidade: modalidade !== 'all' ? modalidade : undefined,
                data_inicio: dataInicio || undefined,
                data_fim: dataFim || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setModalidade('all');
        setDataInicio('');
        setDataFim('');
        router.get('/processos-licitatorios', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este processo licitatório?')) {
            router.delete(`/processos-licitatorios/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const formatCurrency = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Processos Licitatórios" />

            <div className="space-y-6">
                {/* Header with action buttons */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Processos Licitatórios</h1>
                        <p className="text-muted-foreground">Gerencie e acompanhe os processos licitatórios</p>
                    </div>
                    <Link href="/processos-licitatorios/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Processo
                        </Button>
                    </Link>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pesquisar</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Número ou objeto..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        {Object.entries(safeStatusOptions).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Modalidade</label>
                                <Select value={modalidade} onValueChange={setModalidade}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a modalidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas as modalidades</SelectItem>
                                        {Object.entries(safeModalidades).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Data Início</label>
                                <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Data Fim</label>
                                <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Filtrar
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Limpar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Resultados ({safeMeta.total} {safeMeta.total === 1 ? 'processo' : 'processos'})
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {safeData.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Nenhum processo licitatório encontrado.</p>
                                <Link href="/processos-licitatorios/create">
                                    <Button className="mt-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar primeiro processo
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Número</TableHead>
                                                <TableHead>Objeto</TableHead>
                                                <TableHead>Modalidade</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Data Abertura</TableHead>
                                                <TableHead>Valor Estimado</TableHead>
                                                <TableHead>Valor Adjudicado</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {safeData.map((processo) => (
                                                <TableRow key={processo.id}>
                                                    <TableCell className="font-medium">{processo.numero_processo}</TableCell>
                                                    <TableCell>
                                                        <div className="max-w-md truncate" title={processo.objeto}>
                                                            {processo.objeto}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-muted-foreground">{processo.modalidade_display}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={processo.status_color}>{processo.status_display}</Badge>
                                                    </TableCell>
                                                    <TableCell>{processo.data_abertura_formatted || '-'}</TableCell>
                                                    <TableCell>{formatCurrency(processo.valor_estimado)}</TableCell>
                                                    <TableCell>{formatCurrency(processo.valor_adjudicado)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/processos-licitatorios/${processo.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {processo.pode_editar && (
                                                                <Link href={`/processos-licitatorios/${processo.id}/edit`}>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            {processo.pode_excluir && (
                                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(processo.id)}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {safeMeta.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Mostrando {safeMeta.from} a {safeMeta.to} de {safeMeta.total} resultados
                                        </div>
                                        <div className="flex gap-1">
                                            {safeLinks.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            disabled
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => router.get(link.url as string)}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
