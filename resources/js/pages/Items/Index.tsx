import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileDown, FileUp, Package, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { type FormEventHandler, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { items } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// Types
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

interface Item {
    id: number;
    code: string;
    name: string;
    unit_of_measurement: string;
    medium_price: number;
    created_at: string;
    updated_at: string;
}

interface ItemsStats {
    total_items: number;
    average_price: number;
    highest_price: number;
    lowest_price: number;
}

interface ItemsIndexProps {
    items: {
        data: Item[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    units: string[];
    stats: ItemsStats;
    filters: {
        search?: string;
        unit_of_measurement?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        direction?: string;
    };
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Referências',
        href: items.index(),
    },
];

const EMPTY_MESSAGES = {
    noItems: 'Nenhum item cadastrado',
    addFirstItem: 'Adicionar o primeiro item',
    noDataWithFilters: 'Não foram encontrados itens que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.',
} as const;

// Utility Functions
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const formatPaginationLabel = (label: string): string => {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
};

// Components
interface StatCardProps {
    title: string;
    icon: React.ReactNode;
    value: string | number;
    subtitle: string;
}

function StatCard({ title, icon, value, subtitle }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

interface EmptyStateProps {
    isFiltered: boolean;
    onReset: () => void;
}

function EmptyState({ isFiltered, onReset }: EmptyStateProps) {
    if (isFiltered) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{EMPTY_MESSAGES.noDataWithFilters}</p>
                            <Button variant="link" onClick={onReset} className="mt-2 h-auto p-0">
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">{EMPTY_MESSAGES.noItems}</p>
                        <Button variant="link" asChild className="mt-2 h-auto p-0">
                            <Link href={items.create()}>{EMPTY_MESSAGES.addFirstItem}</Link>
                        </Button>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}

interface ItemRowProps {
    item: Item;
}

function ItemRow({ item }: ItemRowProps) {
    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            router.delete(items.destroy(item.id));
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{item.code}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>
                <Badge variant="outline">{item.unit_of_measurement}</Badge>
            </TableCell>
            <TableCell className="font-semibold">{formatCurrency(item.medium_price)}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={items.edit(item.id)}>Editar</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        Excluir
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function ItemsIndex({ items: itemsPaginated, units, stats, filters }: ItemsIndexProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    // Safe data extraction
    const safeItems = itemsPaginated || {
        data: [],
        links: [],
        meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
    };
    const safeData = safeItems.data || [];
    const safeLinks = safeItems.links || [];
    const safeMeta = safeItems.meta || {
        total: 0,
        from: 0,
        to: 0,
        last_page: 1,
        current_page: 1,
    };
    const safeUnits = units || [];
    const safeStats = stats || {
        total_items: 0,
        average_price: 0,
        highest_price: 0,
        lowest_price: 0,
    };

    const { data, setData, processing } = useForm({
        search: filters?.search || '',
        unit_of_measurement: filters?.unit_of_measurement || 'all',
        min_price: filters?.min_price || '',
        max_price: filters?.max_price || '',
        sort: filters?.sort || 'name',
        direction: filters?.direction || 'asc',
    });

    // Memoized values
    const isFiltered = useMemo(
        () => Boolean(data.search || (data.unit_of_measurement && data.unit_of_measurement !== 'all') || data.min_price || data.max_price),
        [data.search, data.unit_of_measurement, data.min_price, data.max_price]
    );
    const hasResults = useMemo(() => safeData.length > 0, [safeData.length]);

    // Event handlers
    const handleSearch: FormEventHandler = useMemo(
        () => (e) => {
            e.preventDefault();
            const submitData = { ...data };
            if (submitData.unit_of_measurement === 'all') {
                submitData.unit_of_measurement = '';
            }
            router.get(items.index(), submitData, {
                preserveState: true,
                replace: true,
            });
        },
        [data]
    );

    const handleReset = useMemo(
        () => () => {
            const resetData = {
                search: '',
                unit_of_measurement: '',
                min_price: '',
                max_price: '',
                sort: 'name',
                direction: 'asc',
            };
            setData({
                ...resetData,
                unit_of_measurement: 'all',
            });
            router.get(items.index(), resetData, {
                preserveState: true,
                replace: true,
            });
        },
        [setData]
    );

    const handleSort = (field: string) => {
        const newDirection = data.sort === field && data.direction === 'asc' ? 'desc' : 'asc';
        setData((prev) => ({ ...prev, sort: field, direction: newDirection }));
        const submitData = { ...data, sort: field, direction: newDirection };
        if (submitData.unit_of_measurement === 'all') {
            submitData.unit_of_measurement = '';
        }
        router.get(items.index(), submitData, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = () => {
        const exportData = { ...data };
        if (exportData.unit_of_measurement === 'all') {
            exportData.unit_of_measurement = '';
        }
        window.location.href = `${items.export()}?${new URLSearchParams(exportData as Record<string, string>).toString()}`;
    };

    const handleDownloadTemplate = () => {
        window.location.href = items.template();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImporting(true);
            const formData = new FormData();
            formData.append('file', file);

            router.post(items.import(), formData, {
                onFinish: () => {
                    setImporting(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Itens - Referências" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total de Itens"
                        icon={<Package className="h-4 w-4 text-muted-foreground" />}
                        value={safeStats.total_items}
                        subtitle="Itens cadastrados"
                    />
                    <StatCard
                        title="Preço Médio"
                        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                        value={formatCurrency(safeStats.average_price || 0)}
                        subtitle="Média geral"
                    />
                    <StatCard
                        title="Maior Preço"
                        icon={<TrendingUp className="h-4 w-4 text-green-600" />}
                        value={formatCurrency(safeStats.highest_price || 0)}
                        subtitle="Item mais caro"
                    />
                    <StatCard
                        title="Menor Preço"
                        icon={<TrendingDown className="h-4 w-4 text-blue-600" />}
                        value={formatCurrency(safeStats.lowest_price || 0)}
                        subtitle="Item mais barato"
                    />
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Itens de Referência</CardTitle>
                                <CardDescription>Gerencie os itens e seus preços médios</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
                                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Template
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    {importing ? 'Importando...' : 'Importar'}
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Exportar
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={items.create()}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Novo Item
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <form onSubmit={handleSearch} className="mb-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Buscar</Label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Código ou nome..."
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unidade</Label>
                                    <Select value={data.unit_of_measurement} onValueChange={(value) => setData('unit_of_measurement', value)}>
                                        <SelectTrigger id="unit">
                                            <SelectValue placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas</SelectItem>
                                            {safeUnits.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_price">Preço Mínimo</Label>
                                    <Input
                                        id="min_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.min_price}
                                        onChange={(e) => setData('min_price', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_price">Preço Máximo</Label>
                                    <Input
                                        id="max_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.max_price}
                                        onChange={(e) => setData('max_price', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>
                                {isFiltered && (
                                    <Button type="button" variant="outline" onClick={handleReset}>
                                        Limpar Filtros
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                                            Código {data.sort === 'code' && (data.direction === 'asc' ? '↑' : '↓')}
                                        </TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                                            Nome {data.sort === 'name' && (data.direction === 'asc' ? '↑' : '↓')}
                                        </TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('medium_price')}>
                                            Preço Médio {data.sort === 'medium_price' && (data.direction === 'asc' ? '↑' : '↓')}
                                        </TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hasResults ? (
                                        safeData.map((item) => <ItemRow key={item.id} item={item} />)
                                    ) : (
                                        <EmptyState isFiltered={isFiltered} onReset={handleReset} />
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {hasResults && safeMeta.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {safeMeta.from} a {safeMeta.to} de {safeMeta.total} itens
                                </div>
                                <div className="flex gap-1">
                                    {safeLinks.map((link) => (
                                        <Button
                                            key={link.label}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            {formatPaginationLabel(link.label)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
