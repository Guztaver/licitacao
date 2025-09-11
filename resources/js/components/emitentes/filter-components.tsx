import CreateEmitenteModal from '@/components/modals/CreateEmitenteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EMITENTE_LABELS, EMITENTE_MESSAGES } from '@/constants/emitentes';
import { Link } from '@inertiajs/react';
import { FileDown, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId, useMemo } from 'react';

// =============================================================================
// SEARCH INPUT COMPONENT
// =============================================================================

interface EmitenteSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: FormEventHandler;
    onClear: () => void;
    processing?: boolean;
    placeholder?: string;
}

export function EmitenteSearchInput({
    value,
    onChange,
    onSubmit,
    onClear,
    processing = false,
    placeholder = EMITENTE_MESSAGES.searchPlaceholder,
}: EmitenteSearchInputProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
                <div className="relative">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar emitentes"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                    <Search className="mr-2 h-4 w-4" />
                    {EMITENTE_LABELS.search}
                </Button>
                <Button type="button" variant="outline" onClick={onClear}>
                    {EMITENTE_LABELS.clear}
                </Button>
            </div>
        </form>
    );
}

// =============================================================================
// FILTERS CARD COMPONENT
// =============================================================================

interface EmitenteFiltersCardProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSubmit: FormEventHandler;
    onClear: () => void;
    processing?: boolean;
}

export function EmitenteFiltersCard({ searchValue, onSearchChange, onSubmit, onClear, processing = false }: EmitenteFiltersCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{EMITENTE_LABELS.filters}</CardTitle>
                <CardDescription>{EMITENTE_MESSAGES.filtersDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <EmitenteSearchInput value={searchValue} onChange={onSearchChange} onSubmit={onSubmit} onClear={onClear} processing={processing} />
            </CardContent>
        </Card>
    );
}

// =============================================================================
// HEADER ACTIONS COMPONENT
// =============================================================================

interface EmitenteHeaderActionsProps {
    onExport: () => void;
    onSuccess: () => void;
}

export function EmitenteHeaderActions({ onExport, onSuccess }: EmitenteHeaderActionsProps) {
    return (
        <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onExport}>
                <FileDown className="mr-2 h-4 w-4" />
                {EMITENTE_LABELS.export}
            </Button>
            <CreateEmitenteModal onSuccess={onSuccess} />
        </div>
    );
}

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================

interface EmitentePageHeaderProps {
    title: string;
    description: string;
    actions?: React.ReactNode;
    backButton?: {
        href: string;
        label?: string;
    };
}

export function EmitentePageHeader({ title, description, actions, backButton }: EmitentePageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
                {backButton && (
                    <Link href={backButton.href}>
                        <Button variant="outline">{backButton.label || EMITENTE_LABELS.back}</Button>
                    </Link>
                )}
                {actions}
            </div>
        </div>
    );
}

// =============================================================================
// ADVANCED FILTERS COMPONENT (for future use)
// =============================================================================

interface EmitenteAdvancedFiltersProps {
    filters: {
        search: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
    };
    onChange: (filters: Partial<EmitenteAdvancedFiltersProps['filters']>) => void;
    onSubmit: FormEventHandler;
    onClear: () => void;
    processing: boolean;
}

export function EmitenteAdvancedFilters({ filters, onChange, onSubmit, onClear, processing }: EmitenteAdvancedFiltersProps) {
    const searchId = useId();
    const dateFromId = useId();
    const dateToId = useId();
    const handleChange = useMemo(
        () => (field: keyof typeof filters) => (value: string) => {
            onChange({ [field]: value });
        },
        [onChange],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Filtros Avançados</CardTitle>
                <CardDescription>Use múltiplos filtros para refinar sua busca</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Search Input */}
                    <div>
                        <label htmlFor={searchId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Buscar
                        </label>
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                            <Input
                                id={searchId}
                                placeholder={EMITENTE_MESSAGES.searchPlaceholder}
                                value={filters.search}
                                onChange={(e) => handleChange('search')(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor={dateFromId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Data inicial
                            </label>
                            <Input
                                id={dateFromId}
                                type="date"
                                value={filters.dateFrom || ''}
                                onChange={(e) => handleChange('dateFrom')(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor={dateToId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Data final
                            </label>
                            <Input id={dateToId} type="date" value={filters.dateTo || ''} onChange={(e) => handleChange('dateTo')(e.target.value)} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            <Search className="mr-2 h-4 w-4" />
                            {EMITENTE_LABELS.search}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClear}>
                            {EMITENTE_LABELS.clear}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// =============================================================================
// BULK ACTIONS COMPONENT (for future use)
// =============================================================================

interface EmitenteBulkActionsProps {
    selectedCount: number;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onBulkDelete: () => void;
    onBulkExport: () => void;
    totalCount: number;
}

export function EmitenteBulkActions({
    selectedCount,
    onSelectAll,
    onClearSelection,
    onBulkDelete,
    onBulkExport,
    totalCount,
}: EmitenteBulkActionsProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="rounded-md bg-blue-50 px-4 py-3 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selecionado
                        {selectedCount !== 1 ? 's' : ''}
                    </span>
                    <Button variant="ghost" size="sm" onClick={onSelectAll}>
                        Selecionar todos ({totalCount})
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClearSelection}>
                        Limpar seleção
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={onBulkExport}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Exportar selecionados
                    </Button>
                    <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                        Excluir selecionados
                    </Button>
                </div>
            </div>
        </div>
    );
}
