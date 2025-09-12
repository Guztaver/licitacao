import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    statusDisplay?: string;
    className?: string;
}

const statusStyles = {
    autorizada: 'bg-blue-100 text-blue-800 border-blue-200',
    concretizada: 'bg-green-100 text-green-800 border-green-200',
    cancelada: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    excluida: 'bg-red-100 text-red-800 border-red-200',
    em_andamento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    finalizada: 'bg-green-100 text-green-800 border-green-200',
    ativo: 'bg-green-100 text-green-800 border-green-200',
    inativo: 'bg-red-100 text-red-800 border-red-200',
};

export function StatusBadge({ status, statusDisplay, className }: StatusBadgeProps) {
    const normalizedStatus = status?.toLowerCase() || '';
    const style = statusStyles[normalizedStatus as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', style, className)}>
            {statusDisplay || status}
        </span>
    );
}
