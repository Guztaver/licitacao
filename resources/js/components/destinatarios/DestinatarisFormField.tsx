import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DestinatarisFormFieldProps {
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    required: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    transform?: 'uppercase' | 'lowercase';
    grid?: string;
    rows?: number;
    prefix?: string;
}

const generateFieldId = (fieldName: string, prefix?: string): string => {
    return prefix ? `${prefix}-${fieldName}` : `destinatario-${fieldName}`;
};

const generateErrorId = (fieldName: string, prefix?: string): string => {
    return `${generateFieldId(fieldName, prefix)}-error`;
};

export default function DestinatarisFormField({
    name,
    label,
    placeholder,
    type,
    required,
    value,
    onChange,
    error,
    disabled = false,
    transform,
    grid = '',
    rows = 3,
    prefix,
}: DestinatarisFormFieldProps) {
    const fieldId = generateFieldId(name, prefix);
    const errorId = generateErrorId(name, prefix);
    const hasError = Boolean(error);

    const handleChange = (newValue: string) => {
        if (!disabled) {
            let processedValue = newValue;

            if (transform === 'uppercase') {
                processedValue = newValue.toUpperCase();
            } else if (transform === 'lowercase') {
                processedValue = newValue.toLowerCase();
            }

            onChange(processedValue);
        }
    };

    const commonInputProps: ComponentProps<typeof Input> = {
        id: fieldId,
        value,
        onChange: (e) => handleChange(e.target.value),
        placeholder,
        disabled,
        required,
        className: hasError ? 'border-red-500 focus:border-red-500' : '',
        'aria-invalid': hasError,
        'aria-describedby': hasError ? errorId : undefined,
    };

    const commonTextareaProps: ComponentProps<typeof Textarea> = {
        id: fieldId,
        value,
        onChange: (e) => handleChange(e.target.value),
        placeholder,
        disabled,
        required,
        className: hasError ? 'border-red-500 focus:border-red-500' : '',
        'aria-invalid': hasError,
        'aria-describedby': hasError ? errorId : undefined,
    };

    const renderField = () => {
        switch (type) {
            case 'textarea':
                return <Textarea {...commonTextareaProps} rows={rows} className={`resize-none ${commonTextareaProps.className}`} />;
            case 'email':
                return <Input {...commonInputProps} type="email" />;
            case 'tel':
                return <Input {...commonInputProps} type="tel" />;
            default:
                return <Input {...commonInputProps} type="text" />;
        }
    };

    return (
        <div className={`space-y-2 ${grid}`}>
            <Label htmlFor={fieldId} className={`text-sm font-medium ${hasError ? 'text-red-700' : 'text-gray-700 dark:text-gray-300'}`}>
                {label}
                {required && (
                    <span className="ml-1 text-red-500" title="obrigatório">
                        *
                    </span>
                )}
            </Label>

            {renderField()}

            {hasError && (
                <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">
                    {error}
                </p>
            )}
        </div>
    );
}
