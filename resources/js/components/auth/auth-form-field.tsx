import { useId } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormFieldConfig } from '@/constants/auth/constants';
import { cn } from '@/lib/utils';

interface AuthFormFieldProps {
    config: FormFieldConfig;
    error?: string;
    value?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function AuthFormField({ config, error, value, className, children }: AuthFormFieldProps) {
    const fieldId = useId();

    return (
        <div className={cn('grid gap-2', className)}>
            <div className="flex items-center">
                <Label htmlFor={fieldId}>{config.label}</Label>
                {children}
            </div>
            <Input
                id={fieldId}
                type={config.type}
                name={config.name}
                placeholder={config.placeholder}
                autoComplete={config.autoComplete}
                required={config.required}
                autoFocus={config.autoFocus}
                readOnly={config.readOnly}
                value={value}
                tabIndex={0}
            />
            <InputError message={error} />
        </div>
    );
}
