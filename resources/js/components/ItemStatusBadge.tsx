import { Badge } from '@/components/ui/badge';
import { Lock, Eye, AlertTriangle } from 'lucide-react';
import type { Item } from '@/types';

interface ItemStatusBadgeProps {
    item: Item;
    showDetails?: boolean;
}

export function ItemStatusBadge({ item, showDetails = false }: ItemStatusBadgeProps) {
    if (item.is_frozen) {
        return (
            <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-red-500" />
                <Badge className="bg-red-100 text-red-800">Congelado</Badge>
                {showDetails && item.frozen_at && (
                    <span className="text-xs text-gray-500">desde {new Date(item.frozen_at).toLocaleDateString('pt-BR')}</span>
                )}
            </div>
        );
    }

    if (item.foi_utilizado) {
        return (
            <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <Badge className="bg-orange-100 text-orange-800">Utilizado</Badge>
                {showDetails && item.last_used_at && (
                    <span className="text-xs text-gray-500">usado em {new Date(item.last_used_at).toLocaleDateString('pt-BR')}</span>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-green-500" />
            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
        </div>
    );
}
