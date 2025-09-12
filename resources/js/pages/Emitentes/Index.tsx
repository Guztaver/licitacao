import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { EmitenteFiltersCard, EmitenteHeaderActions, EmitentePageHeader } from '@/components/emitentes/filter-components';
import { EmitenteListCard, EmitenteTable } from '@/components/emitentes/table-components';
import { EmitenteFilterSummary, EmitentePagination, EmitenteStatsGrid } from '@/components/emitentes/ui-components';
import { EMITENTE_LABELS, EMITENTE_MESSAGES } from '@/constants/emitentes';
import { useEmitenteActions, useEmitenteBreadcrumbs, useEmitenteFilters, useEmitentePagination, useEmitenteStats } from '@/hooks/emitentes';
import AppLayout from '@/layouts/app-layout';
import type { Emitente } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

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

interface EmitentesIndexProps {
    emitentes: {
        data: Emitente[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: {
        total_emitentes: number;
        com_requisicoes: number;
        total_requisicoes: number;
        sem_atividade: number;
    };
    filters: {
        search?: string;
    };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EmitentesIndex({ emitentes: emitentesPaginated, stats, filters }: EmitentesIndexProps) {
    // Hooks
    const breadcrumbs = useEmitenteBreadcrumbs('index');
    const { handleExport, handleReload } = useEmitenteActions();
    const { handlePaginationClick } = useEmitentePagination();
    const { filters: filterData, processing, isFiltered, handleSearch, handleReset, handleSearchChange } = useEmitenteFilters(filters);

    // Safe data extraction
    const safeEmitentes = emitentesPaginated || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safeEmitentes.data || [];
    const safeLinks = safeEmitentes.links || [];
    const safeMeta = useMemo(
        () =>
            safeEmitentes.meta || {
                total: 0,
                from: 0,
                to: 0,
                last_page: 1,
                current_page: 1,
            },
        [safeEmitentes.meta]
    );
    const safeStats = useEmitenteStats(stats);

    // Computed descriptions
    const tableDescription = useMemo(() => {
        if (isFiltered) {
            const resultText = safeStats.total_emitentes === 0 ? ' (nenhum resultado encontrado)' : '';
            return `Mostrando ${safeMeta.from || 0} a ${safeMeta.to || 0} de ${safeStats.total_emitentes} emitentes encontrados${resultText}`;
        }
        return `Mostrando ${safeMeta.from || 0} a ${safeMeta.to || 0} de ${safeMeta.total || 0} emitentes`;
    }, [isFiltered, safeMeta, safeStats.total_emitentes]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={EMITENTE_LABELS.index} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <EmitentePageHeader
                    title={EMITENTE_LABELS.index}
                    description={EMITENTE_MESSAGES.indexDescription}
                    actions={<EmitenteHeaderActions onExport={() => handleExport(filters as Record<string, string>)} onSuccess={handleReload} />}
                />

                {/* Statistics Cards */}
                <EmitenteStatsGrid stats={safeStats} isFiltered={isFiltered} />

                {/* Filters */}
                <EmitenteFiltersCard
                    searchValue={filterData.search}
                    onSearchChange={handleSearchChange}
                    onSubmit={handleSearch}
                    onClear={handleReset}
                    processing={processing}
                />

                {/* Table */}
                <EmitenteListCard
                    title="Lista de Emitentes"
                    description={tableDescription}
                    filterSummary={<EmitenteFilterSummary isFiltered={isFiltered} searchValue={filterData.search} onClear={handleReset} />}
                    pagination={
                        <EmitentePagination
                            links={safeLinks}
                            meta={safeMeta}
                            onPageChange={handlePaginationClick}
                            isFiltered={isFiltered}
                            filteredTotal={safeStats.total_emitentes}
                        />
                    }
                >
                    <EmitenteTable emitentes={safeData} isFiltered={isFiltered} onClearFilters={handleReset} onSuccess={handleReload} />
                </EmitenteListCard>
            </div>
        </AppLayout>
    );
}
