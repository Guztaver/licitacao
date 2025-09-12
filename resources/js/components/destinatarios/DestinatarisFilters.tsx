import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DESTINATARIOS_LABELS, DESTINATARIOS_MESSAGES } from '@/hooks/use-destinatarios';

interface DestinatarisFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    onReset: () => void;
    processing: boolean;
}

export default function DestinatarisFilters({ search, onSearchChange, onSubmit, onReset, processing }: DestinatarisFiltersProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{DESTINATARIOS_LABELS.filtros}</CardTitle>
                <CardDescription>{DESTINATARIOS_MESSAGES.filtrosDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
                    <div className="min-w-[200px] flex-1">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por nome ou sigla..."
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            <Search className="mr-2 h-4 w-4" />
                            {DESTINATARIOS_LABELS.buscar}
                        </Button>
                        <Button type="button" variant="outline" onClick={onReset}>
                            {DESTINATARIOS_LABELS.limpar}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
