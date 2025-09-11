/**
 * Utility functions for reports formatting and data handling
 */

export const formatters = {
    /**
     * Format currency value with proper handling of zero values
     */
    currency: (value: number, emptyText: string = 'Sem valor informado'): string => {
        if (value === 0 || value == null) {
            return emptyText;
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    },

    /**
     * Format date string to Brazilian format
     */
    date: (dateString: string, emptyText: string = 'Data não informada'): string => {
        if (!dateString) {
            return emptyText;
        }
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    },

    /**
     * Format number with proper handling of zero values
     */
    number: (value: number, emptyText: string = 'Nenhum registro'): string => {
        if (value === 0 || value == null) {
            return emptyText;
        }
        return value.toLocaleString('pt-BR');
    },

    /**
     * Format percentage with proper handling of zero values
     */
    percentage: (value: number, total: number, emptyText: string = '0%'): string => {
        if (total === 0 || value === 0) {
            return emptyText;
        }
        const percentage = (value / total) * 100;
        return `${percentage.toFixed(1)}%`;
    },

    /**
     * Format month-year string to readable format
     */
    monthYear: (monthYearString: string): string => {
        if (!monthYearString) {
            return 'Período não informado';
        }

        const [ano, mesNum] = monthYearString.split('-');
        try {
            return new Date(parseInt(ano, 10), parseInt(mesNum, 10) - 1).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return monthYearString;
        }
    },

    /**
     * Truncate text with ellipsis
     */
    truncateText: (text: string, maxLength: number = 50): string => {
        if (!text) return 'Não informado';
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    },

    /**
     * Format CNPJ with proper display
     */
    cnpj: (cnpj: string | null): string => {
        if (!cnpj) return 'CNPJ não informado';
        return cnpj;
    },

    /**
     * Format phone with proper display
     */
    phone: (phone: string | null): string => {
        if (!phone) return 'Telefone não informado';
        return phone;
    },

    /**
     * Format email with proper display
     */
    email: (email: string | null): string => {
        if (!email) return 'E-mail não informado';
        return email;
    },
};

export const statusConfig = {
    pendente: {
        label: 'Pendente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Aguardando análise',
    },
    autorizada: {
        label: 'Autorizada',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Aprovada para execução',
    },
    concretizada: {
        label: 'Concretizada',
        className: 'bg-green-100 text-green-800 border-green-200',
        description: 'Finalizada com sucesso',
    },
    cancelada: {
        label: 'Cancelada',
        className: 'bg-red-100 text-red-800 border-red-200',
        description: 'Cancelada pelo sistema',
    },
};

export const reportUtils = {
    /**
     * Get status configuration
     */
    getStatusConfig: (status: string) => {
        return (
            statusConfig[status as keyof typeof statusConfig] || {
                label: status || 'Status desconhecido',
                className: 'bg-gray-100 text-gray-800 border-gray-200',
                description: 'Status não identificado',
            }
        );
    },

    /**
     * Build export URL with parameters
     */
    buildExportUrl: (baseUrl: string, params: Record<string, string>, format: string): string => {
        const urlParams = new URLSearchParams(params);
        urlParams.append('formato', format);
        return `${baseUrl}?${urlParams.toString()}`;
    },

    /**
     * Get empty state message based on context
     */
    getEmptyStateMessage: (context: string, filterActive: boolean = false): string => {
        const messages = {
            requisicoes: filterActive ? 'Nenhuma requisição encontrada com os filtros aplicados' : 'Nenhuma requisição cadastrada no sistema',
            fornecedores: filterActive ? 'Nenhum fornecedor encontrado com os filtros aplicados' : 'Nenhum fornecedor cadastrado no sistema',
            conferencias: filterActive ? 'Nenhuma conferência encontrada com os filtros aplicados' : 'Nenhuma conferência realizada no período',
        };

        return (
            messages[context as keyof typeof messages] ||
            (filterActive ? 'Nenhum registro encontrado com os filtros aplicados' : 'Nenhum registro encontrado')
        );
    },

    /**
     * Sort entries by value descending
     */
    sortByValue: <T>(entries: [string, T][], getValue: (item: T) => number): [string, T][] => {
        return entries.sort(([, a], [, b]) => getValue(b) - getValue(a));
    },

    /**
     * Get top N entries from sorted data
     */
    getTopEntries: <T>(data: Record<string, T>, getValue: (item: T) => number, limit: number = 5): [string, T][] => {
        return reportUtils.sortByValue(Object.entries(data), getValue).slice(0, limit);
    },

    /**
     * Check if any filters are active
     */
    hasActiveFilters: (filters: Record<string, unknown>): boolean => {
        return Object.values(filters).some((value) => value !== null && value !== undefined && value !== '');
    },

    /**
     * Format contact information
     */
    formatContact: (phone?: string | null, email?: string | null): string => {
        const parts = [];
        if (phone) parts.push(phone);
        if (email) parts.push(email);
        return parts.length > 0 ? parts.join(' • ') : 'Contato não informado';
    },

    /**
     * Calculate growth percentage between two values
     */
    calculateGrowth: (current: number, previous: number): string => {
        if (previous === 0) {
            return current > 0 ? '+100%' : '0%';
        }
        const growth = ((current - previous) / previous) * 100;
        const sign = growth > 0 ? '+' : '';
        return `${sign}${growth.toFixed(1)}%`;
    },
};

export const cardMetrics = {
    /**
     * Generate metric card data with proper zero handling
     */
    createMetricCard: (title: string, value: number, subtitle: string, emptyText?: string, formatter: 'currency' | 'number' = 'number') => ({
        title,
        value: formatter === 'currency' ? formatters.currency(value, emptyText) : formatters.number(value, emptyText),
        subtitle,
        isEmpty: value === 0,
    }),
};
