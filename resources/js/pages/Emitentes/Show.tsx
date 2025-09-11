import { EmitentePageHeader } from '@/components/emitentes/filter-components';
import { EmitenteRequisicoesTable } from '@/components/emitentes/table-components';
import { EmitenteActionsCard, EmitenteDetailStatsCard, EmitenteInfoCard } from '@/components/emitentes/ui-components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EMITENTE_LABELS, EMITENTE_MESSAGES } from '@/constants/emitentes';
import { useEmitenteActions, useEmitenteBreadcrumbs, useEmitenteStats } from '@/hooks/emitentes';
import AppLayout from '@/layouts/app-layout';
import { emitentes } from '@/routes';
import type { Emitente, Requisicao } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface EmitentesShowProps {
    emitente: Emitente & {
        requisicoes?: Requisicao[];
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EmitentesShow({ emitente, requisicoes, stats }: EmitentesShowProps) {
    // Hooks
    const breadcrumbs = useEmitenteBreadcrumbs('show', emitente);
    const { handleDelete } = useEmitenteActions();
    const safeStats = useEmitenteStats(stats);

    // Event handlers
    const handleDeleteClick = useMemo(() => () => handleDelete(emitente), [handleDelete, emitente]);

    // Computed values
    const requisicoesDescription = useMemo(() => {
        if (safeStats.total_requisicoes > 0) {
            return 'Últimas requisições emitidas por este órgão';
        }
        return 'Nenhuma requisição encontrada para este órgão';
    }, [safeStats.total_requisicoes]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${EMITENTE_LABELS.show}: ${emitente.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <EmitentePageHeader
                    title={emitente.nome}
                    description={EMITENTE_MESSAGES.showDescription}
                    backButton={{
                        href: emitentes.index(),
                    }}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Informações do Emitente */}
                    <div className="space-y-6 lg:col-span-2">
                        <EmitenteInfoCard emitente={emitente} />

                        {/* Requisições */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5" />
                                    {EMITENTE_LABELS.requisicoes} ({safeStats.total_requisicoes})
                                </CardTitle>
                                <CardDescription>{requisicoesDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmitenteRequisicoesTable
                                    requisicoes={requisicoes}
                                    totalCount={safeStats.total_requisicoes}
                                    emitenteId={emitente.id}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estatísticas e Ações */}
                    <div className="space-y-6">
                        <EmitenteDetailStatsCard stats={safeStats} />
                        <EmitenteActionsCard emitente={emitente} onDelete={handleDeleteClick} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
