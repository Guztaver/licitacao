import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FilterOption {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'checkbox';
    options?: Array<{ value: string; label: string }>;
    defaultValue?: any;
}

interface AdvancedFiltersProps {
    title?: string;
    description?: string;
    filters: FilterOption[];
    onFiltersChange: (filters: Record<string, any>) => void;
    onReset?: () => void;
    className?: string;
}

export function AdvancedFilters({
    title = 'Filtros Avançados',
    description = 'Refine sua busca usando múltiplos critérios',
    filters,
    onFiltersChange,
    onReset,
    className = '',
}: AdvancedFiltersProps) {
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [isExpanded, setIsExpanded] = useState(false);

    const updateFilter = (filterId: string, value: any) => {
        const newFilters = { ...activeFilters };

        if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
            delete newFilters[filterId];
        } else {
            newFilters[filterId] = value;
        }

        setActiveFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const resetFilters = () => {
        setActiveFilters({});
        onFiltersChange({});
        onReset?.();
    };

    const getActiveFilterCount = () => {
        return Object.keys(activeFilters).length;
    };

    const renderFilter = (filter: FilterOption) => {
        const value = activeFilters[filter.id] ?? filter.defaultValue ?? '';

        switch (filter.type) {
            case 'text':
                return (
                    <div key={filter.id} className="space-y-2">
                        <Label htmlFor={filter.id}>{filter.label}</Label>
                        <Input
                            id={filter.id}
                            value={value}
                            onChange={(e) => updateFilter(filter.id, e.target.value)}
                            placeholder={`Buscar por ${filter.label.toLowerCase()}...`}
                        />
                    </div>
                );

            case 'number':
                return (
                    <div key={filter.id} className="space-y-2">
                        <Label htmlFor={filter.id}>{filter.label}</Label>
                        <Input
                            id={filter.id}
                            type="number"
                            value={value}
                            onChange={(e) => updateFilter(filter.id, Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={filter.id} className="space-y-2">
                        <Label htmlFor={filter.id}>{filter.label}</Label>
                        <Select value={value} onValueChange={(newValue) => updateFilter(filter.id, newValue)}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}...`} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'date':
                return (
                    <div key={filter.id} className="space-y-2">
                        <Label htmlFor={filter.id}>{filter.label}</Label>
                        <Input id={filter.id} type="date" value={value} onChange={(e) => updateFilter(filter.id, e.target.value)} />
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={filter.id} className="flex items-center space-x-2">
                        <Checkbox id={filter.id} checked={value} onCheckedChange={(checked) => updateFilter(filter.id, checked)} />
                        <Label
                            htmlFor={filter.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {filter.label}
                        </Label>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center">
                            <FunnelIcon className="h-5 w-5 mr-2" />
                            {title}
                        </CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    <div className="flex items-center gap-2">
                        {getActiveFilterCount() > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getActiveFilterCount()} filtro{getActiveFilterCount() !== 1 ? 's' : ''} ativo
                                {getActiveFilterCount() !== 1 ? 's' : ''}
                            </span>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filters.map(renderFilter)}</div>

                    <Separator />

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {getActiveFilterCount() > 0
                                ? `${getActiveFilterCount()} filtro${getActiveFilterCount() !== 1 ? 's' : ''} aplicado${getActiveFilterCount() !== 1 ? 's' : ''}`
                                : 'Nenhum filtro aplicado'}
                        </div>

                        <div className="flex gap-2">
                            {getActiveFilterCount() > 0 && (
                                <Button variant="outline" size="sm" onClick={resetFilters}>
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    Limpar Filtros
                                </Button>
                            )}
                            <Button size="sm" onClick={() => setIsExpanded(false)}>
                                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

// Predefined filter configurations
export const materialFilters: FilterOption[] = [
    {
        id: 'codigo',
        label: 'Código do Material',
        type: 'text',
    },
    {
        id: 'descricao',
        label: 'Descrição',
        type: 'text',
    },
    {
        id: 'categoria_id',
        label: 'Categoria',
        type: 'select',
        options: [], // Will be populated dynamically
    },
    {
        id: 'valor_min',
        label: 'Valor Mínimo',
        type: 'number',
    },
    {
        id: 'valor_max',
        label: 'Valor Máximo',
        type: 'number',
    },
    {
        id: 'data_inicio',
        label: 'Data Início',
        type: 'date',
    },
    {
        id: 'data_fim',
        label: 'Data Fim',
        type: 'date',
    },
    {
        id: 'apenas_congelados',
        label: 'Apenas Materiais Congelados',
        type: 'checkbox',
    },
];

export const contractFilters: FilterOption[] = [
    {
        id: 'numero_contrato',
        label: 'Número do Contrato',
        type: 'text',
    },
    {
        id: 'fornecedor_id',
        label: 'Fornecedor',
        type: 'select',
        options: [], // Will be populated dynamically
    },
    {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'ativo', label: 'Ativo' },
            { value: 'inativo', label: 'Inativo' },
            { value: 'expirado', label: 'Expirado' },
        ],
    },
    {
        id: 'valor_min',
        label: 'Valor Mínimo',
        type: 'number',
    },
    {
        id: 'valor_max',
        label: 'Valor Máximo',
        type: 'number',
    },
    {
        id: 'data_inicio_inicio',
        label: 'Data Início (a partir de)',
        type: 'date',
    },
    {
        id: 'data_inicio_fim',
        label: 'Data Início (até)',
        type: 'date',
    },
    {
        id: 'data_fim_inicio',
        label: 'Data Fim (a partir de)',
        type: 'date',
    },
    {
        id: 'data_fim_fim',
        label: 'Data Fim (até)',
        type: 'date',
    },
];

export const dispensaFilters: FilterOption[] = [
    {
        id: 'numero',
        label: 'Número da Dispensa',
        type: 'text',
    },
    {
        id: 'categoria_material_id',
        label: 'Categoria',
        type: 'select',
        options: [], // Will be populated dynamically
    },
    {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'ativa', label: 'Ativa' },
            { value: 'cancelada', label: 'Cancelada' },
            { value: 'suspensa', label: 'Suspensa' },
        ],
    },
    {
        id: 'valor_min',
        label: 'Valor Mínimo',
        type: 'number',
    },
    {
        id: 'valor_max',
        label: 'Valor Máximo',
        type: 'number',
    },
    {
        id: 'periodo',
        label: 'Período',
        type: 'select',
        options: [
            { value: 'mensal', label: 'Mensal' },
            { value: 'anual', label: 'Anual' },
        ],
    },
    {
        id: 'data_dispensa_inicio',
        label: 'Data Dispensa (a partir de)',
        type: 'date',
    },
    {
        id: 'data_dispensa_fim',
        label: 'Data Dispensa (até)',
        type: 'date',
    },
    {
        id: 'responsavel',
        label: 'Responsável',
        type: 'text',
    },
];
