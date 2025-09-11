import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

interface AuthSubmitButtonProps {
    children: React.ReactNode;
    processing?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    type?: 'button' | 'submit' | 'reset';
}

export default function AuthSubmitButton({
    children,
    processing = false,
    disabled = false,
    className,
    variant = 'default',
    type = 'submit',
}: AuthSubmitButtonProps) {
    return (
        <Button type={type} variant={variant} className={cn('w-full', className)} disabled={processing || disabled}>
            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}
