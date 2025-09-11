import CreateEmitenteModal from '@/components/modals/CreateEmitenteModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMITENTE_LABELS, EMITENTE_MESSAGES, EMITENTE_STATUS_CONFIG, EMITENTE_TABLE_COLUMNS, type EmitenteStatus } from '@/constants/emitentes';
import { emitentes } from '@/routes';
import type { Emitente, Requisicao } from '@/types';
import { Link } from '@inertiajs/react';
import { Building, FileText } from 'lucide-react';
import { useMemo } from 'react';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatContactInfo = (telefone?: string, email?: string) => {
    if (!telefone && !email) return EMITENTE_MESSAGES.contactNotProvided;

    return (
        <div className="text-sm">
            {telefone && <p>{telefone}</p>}
            {email && <p className="text-gray-500">{email}</p>}
        </div>
    );
};

const formatRequisicoesCount = (count: number) => (
    <div className="text-sm">
        <span className="font-medium">{count || 0}</span>
        <span className="text-gray-500"> requisições</span>
    </div>
);

const getStatusBadge = (status: string) => {
    return (
        EMITENTE_STATUS_CONFIG[status as EmitenteStatus] || {
            label: status,
            variant: 'secondary' as const,
        }
    );
};

const formatCurrency = (value: string | number | null | undefined) => {
    if (!value || Number(value) === 0) return EMITENTE_MESSAGES.noValue;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(value));
};

const formatDate = (date: string | null | undefined) => {
    return date || EMITENTE_MESSAGES.noValue;
};

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

interface EmitenteEmptyStateProps {
    isFiltered: boolean;
    onClearFilters: () => void;
    onSuccess: () => void;
}

export function EmitenteEmptyState({ isFiltered, onClearFilters, onSuccess }: EmitenteEmptyStateProps) {
    return (
        <TableRow>
            <TableCell colSpan={4} className="py-8 text-center">
                <div className="flex flex-col items-center space-y-2">
                    <Building className="h-8 w-8 text-gray-400" />
                    {isFiltered ? (
                        <>
                            <p className="text-gray-500">{EMITENTE_MESSAGES.noResults}</p>
                            <Button variant="outline" size="sm" onClick={onClearFilters}>
                                {EMITENTE_LABELS.clearFilters}
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500">{EMITENTE_MESSAGES.noData}</p>
                            <CreateEmitenteModal
                                trigger={
                                    <Button size="sm">
                                        <Building className="mr-2 h-4 w-4" />
                                        {EMITENTE_LABELS.addFirst}
                                    </Button>
                                }
                                onSuccess={onSuccess}
                            />
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

// =============================================================================
// TABLE ROW COMPONENT
// =============================================================================

interface EmitenteTableRowProps {
    emitente: Emitente;
}

export function EmitenteTableRow({ emitente }: EmitenteTableRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div>
                    <Link href={emitentes.show(emitente.id)} className="font-medium text-blue-800 hover:text-blue-900">
                        {emitente.nome}
                    </Link>
                    <p className="text-sm text-gray-500">
                        Sigla: <span className="font-mono">{emitente.sigla}</span>
                    </p>
                    {emitente.endereco && <p className="text-sm text-gray-500">{emitente.endereco}</p>}
                </div>
            </TableCell>
            <TableCell>{formatContactInfo(emitente.telefone, emitente.email)}</TableCell>
            <TableCell>{formatRequisicoesCount(emitente.requisicoes_count || 0)}</TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Link href={emitentes.show(emitente.id)}>
                        <Button variant="outline" size="sm">
                            {EMITENTE_LABELS.view}
                        </Button>
                    </Link>
                    <Link href={emitentes.edit(emitente.id)}>
                        <Button variant="outline" size="sm">
                            {EMITENTE_LABELS.edit}
                        </Button>
                    </Link>
                </div>
            </TableCell>
        </TableRow>
    );
}

// =============================================================================
// TABLE HEADER COMPONENT
// =============================================================================

export function EmitenteTableHeader() {
    return (
        <TableHeader>
            <TableRow>
                {EMITENTE_TABLE_COLUMNS.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                ))}
            </TableRow>
        </TableHeader>
    );
}

// =============================================================================
// COMPLETE TABLE COMPONENT
// =============================================================================

interface EmitenteTableProps {
    emitentes: Emitente[];
    isFiltered: boolean;
    onClearFilters: () => void;
    onSuccess: () => void;
}

export function EmitenteTable({ emitentes, isFiltered, onClearFilters, onSuccess }: EmitenteTableProps) {
    const hasResults = useMemo(() => emitentes.length > 0, [emitentes.length]);

    return (
        <div className="rounded-md border">
            <Table>
                <EmitenteTableHeader />
                <TableBody>
                    {hasResults ? (
                        emitentes.map((emitente) => <EmitenteTableRow key={emitente.id} emitente={emitente} />)
                    ) : (
                        <EmitenteEmptyState isFiltered={isFiltered} onClearFilters={onClearFilters} onSuccess={onSuccess} />
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

// =============================================================================
// REQUISICOES TABLE COMPONENT
// =============================================================================

interface EmitenteRequisicoesTableProps {
    requisicoes: Requisicao[];
    totalCount: number;
    emitenteId: number;
}

export function EmitenteRequisicoesTable({ requisicoes, totalCount, emitenteId }: EmitenteRequisicoesTableProps) {
    if (!requisicoes || requisicoes.length === 0) {
        return (
            <div className="py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{EMITENTE_MESSAGES.noRequisicoes}</h3>
                <p className="mt-1 text-sm text-gray-500">{EMITENTE_MESSAGES.noRequisicoesDescription}</p>
            </div>
        );
    }

    return (
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
                            const statusConfig = getStatusBadge(requisicao.status);
                            return (
                                <TableRow key={requisicao.id}>
                                    <TableCell>
                                        <div className="font-medium text-blue-800">{requisicao.numero_completo}</div>
                                    </TableCell>
                                    <TableCell>{requisicao.solicitante}</TableCell>
                                    <TableCell>{formatDate(requisicao.data_recebimento)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusConfig.variant}
                                            className={
                                                requisicao.status_color
                                                    ? `bg-${requisicao.status_color}-100 text-${requisicao.status_color}-800 border-${requisicao.status_color}-200`
                                                    : ''
                                            }
                                        >
                                            {requisicao.status_display}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(requisicao.valor_final)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            {totalCount > 10 && (
                <div className="text-center">
                    <Link href={`/requisicoes?emitente_id=${emitenteId}`}>
                        <Button variant="outline" size="sm">
                            Ver todas as requisições ({totalCount})
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

// =============================================================================
// LIST CARD COMPONENT
// =============================================================================

interface EmitenteListCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    filterSummary?: React.ReactNode;
    pagination?: React.ReactNode;
}

export function EmitenteListCard({ title, description, children, filterSummary, pagination }: EmitenteListCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
                {filterSummary}
                {pagination}
            </CardContent>
        </Card>
    );
}
