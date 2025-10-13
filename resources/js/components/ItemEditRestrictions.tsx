import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Info, AlertTriangle } from 'lucide-react';
import type { Item } from '@/types';

interface ItemEditRestrictionsProps {
    item: Item;
    field?: string;
}

export function ItemEditRestrictions({ item, field = 'descricao' }: ItemEditRestrictionsProps) {
    if (!item.is_frozen && !item.foi_utilizado) {
        return null;
    }

    const isFieldRestricted = field === 'descricao' || field === 'codigo';
    const isFieldFrozen = item.is_frozen && isFieldRestricted;

    if (isFieldFrozen) {
        return (
            <Alert className="bg-red-50 border-red-200">
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                    <strong>Campo bloqueado:</strong> Este campo não pode ser alterado porque o material já foi utilizado em transações.
                    {item.frozen_description && field === 'descricao' && (
                        <div className="mt-2 text-sm">
                            <strong>Descrição congelada:</strong> {item.frozen_description}
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    if (item.foi_utilizado && !item.is_frozen) {
        return (
            <Alert className="bg-orange-50 border-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-orange-800">
                    <strong>Atenção:</strong> Este material já foi utilizado. Alterações nos campos de identificação podem ser bloqueadas após a
                    primeira utilização em um contrato ou pedido.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
                <strong>Informação:</strong> Materiais utilizados em contratos, pedidos ou requisições terão suas descrições congeladas para manter a
                integridade dos dados.
            </AlertDescription>
        </Alert>
    );
}
