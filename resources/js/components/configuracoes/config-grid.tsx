import { cn } from '@/lib/utils';

interface ConfigGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3;
    className?: string;
}

export default function ConfigGrid({ children, columns = 2, className }: ConfigGridProps) {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
    };

    return <div className={cn('grid gap-4', gridClasses[columns], className)}>{children}</div>;
}
