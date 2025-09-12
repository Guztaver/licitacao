import { Building } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EMITENTE_FORM_FIELDS, EMITENTE_LABELS, EMITENTE_MESSAGES, type EmitenteFormData, type EmitenteFormField } from '@/constants/emitentes';

// =============================================================================
// FORM FIELD COMPONENT
// =============================================================================

interface EmitenteInputFieldProps {
    field: EmitenteFormField;
    value: string;
    onChange: (name: string, value: string) => void;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export function EmitenteInputField({ field, value, onChange, error, className, disabled = false }: EmitenteInputFieldProps) {
    const handleChange = useMemo(
        () => (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = field.transform ? field.transform(e.target.value) : e.target.value;
            onChange(field.name, newValue);
        },
        [field, onChange]
    );

    return (
        <div className={`space-y-2 ${className || ''}`}>
            <Label htmlFor={field.name}>
                {field.label} {field.required && '*'}
            </Label>
            <Input
                id={field.name}
                type={field.type}
                value={value}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                disabled={disabled}
                className={error ? 'border-red-500' : ''}
                aria-describedby={error ? `${field.name}-error` : undefined}
                aria-invalid={!!error}
            />
            {error && (
                <p id={`${field.name}-error`} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

// =============================================================================
// FORM SECTIONS
// =============================================================================

interface EmitenteBasicInfoSectionProps {
    data: EmitenteFormData;
    onChange: (name: string, value: string) => void;
    errors: Partial<Record<keyof EmitenteFormData, string>>;
    disabled?: boolean;
}

export function EmitenteBasicInfoSection({ data, onChange, errors, disabled = false }: EmitenteBasicInfoSectionProps) {
    const basicFields = EMITENTE_FORM_FIELDS.filter((field) => ['nome', 'sigla'].includes(field.name));

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {basicFields.map((field) => (
                <EmitenteInputField
                    key={field.name}
                    field={field}
                    value={data[field.name]}
                    onChange={onChange}
                    error={errors[field.name]}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}

interface EmitenteAddressSectionProps {
    data: EmitenteFormData;
    onChange: (name: string, value: string) => void;
    errors: Partial<Record<keyof EmitenteFormData, string>>;
    disabled?: boolean;
}

export function EmitenteAddressSection({ data, onChange, errors, disabled = false }: EmitenteAddressSectionProps) {
    const addressField = EMITENTE_FORM_FIELDS.find((field) => field.name === 'endereco');

    if (!addressField) return null;

    return (
        <EmitenteInputField
            field={addressField}
            value={data[addressField.name]}
            onChange={onChange}
            error={errors[addressField.name]}
            disabled={disabled}
        />
    );
}

interface EmitenteContactSectionProps {
    data: EmitenteFormData;
    onChange: (name: string, value: string) => void;
    errors: Partial<Record<keyof EmitenteFormData, string>>;
    disabled?: boolean;
}

export function EmitenteContactSection({ data, onChange, errors, disabled = false }: EmitenteContactSectionProps) {
    const contactFields = EMITENTE_FORM_FIELDS.filter((field) => ['telefone', 'email'].includes(field.name));

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {contactFields.map((field) => (
                <EmitenteInputField
                    key={field.name}
                    field={field}
                    value={data[field.name]}
                    onChange={onChange}
                    error={errors[field.name]}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}

// =============================================================================
// OBSERVATIONS SECTION
// =============================================================================

interface EmitenteObservationsSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    disabled?: boolean;
}

export function EmitenteObservationsSection({ value, onChange, error, disabled = false }: EmitenteObservationsSectionProps) {
    const observacoesId = useId();
    const errorId = useId();

    return (
        <div className="space-y-2">
            <Label htmlFor={observacoesId}>{EMITENTE_LABELS.observacoes}</Label>
            <Textarea
                id={observacoesId}
                value={value}
                onChange={onChange}
                placeholder={EMITENTE_LABELS.observacoesPlaceholder}
                rows={4}
                disabled={disabled}
                className={error ? 'border-red-500' : ''}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
            />
            {error && (
                <p id={errorId} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

// =============================================================================
// COMPLETE FORM CARD
// =============================================================================

interface EmitenteFormCardProps {
    data: EmitenteFormData;
    onChange: (name: string, value: string) => void;
    onObservationsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errors: Partial<Record<keyof EmitenteFormData, string>>;
    disabled?: boolean;
    isEdit?: boolean;
}

export function EmitenteFormCard({ data, onChange, onObservationsChange, errors, disabled = false, isEdit = false }: EmitenteFormCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    {EMITENTE_LABELS.information}
                </CardTitle>
                <CardDescription>{isEdit ? EMITENTE_MESSAGES.editFormDescription : EMITENTE_MESSAGES.formDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Basic Info */}
                <EmitenteBasicInfoSection data={data} onChange={onChange} errors={errors} disabled={disabled} />

                {/* Address */}
                <EmitenteAddressSection data={data} onChange={onChange} errors={errors} disabled={disabled} />

                {/* Contact Info */}
                <EmitenteContactSection data={data} onChange={onChange} errors={errors} disabled={disabled} />

                {/* Observations */}
                <EmitenteObservationsSection
                    value={data.observacoes}
                    onChange={onObservationsChange}
                    error={errors.observacoes}
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
}

// =============================================================================
// FORM ACTIONS
// =============================================================================

interface EmitenteFormActionsProps {
    onSubmit: FormEventHandler;
    onCancel: () => void;
    processing: boolean;
    isEdit?: boolean;
    cancelLabel?: string;
}

export function EmitenteFormActions({
    onSubmit,
    onCancel,
    processing,
    isEdit = false,
    cancelLabel = EMITENTE_LABELS.cancel,
}: EmitenteFormActionsProps) {
    return (
        <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                {cancelLabel}
            </Button>
            <Button type="submit" disabled={processing} onClick={onSubmit}>
                <Building className="mr-2 h-4 w-4" />
                {processing ? EMITENTE_LABELS.saving : isEdit ? EMITENTE_LABELS.saveChanges : EMITENTE_LABELS.save}
            </Button>
        </div>
    );
}

// =============================================================================
// TIP CARD COMPONENT
// =============================================================================

interface EmitenteTipCardProps {
    tips: string[];
}

export function EmitenteTipCard({ tips }: EmitenteTipCardProps) {
    return (
        <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Building className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Dica</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>
                                {tips.map((tip) => (
                                    <span key={tip}>
                                        • {tip}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// =============================================================================
// INFO CARD COMPONENT
// =============================================================================

interface EmitenteInfoCardProps {
    tips: string[];
}

export function EmitenteInfoCard({ tips }: EmitenteInfoCardProps) {
    return (
        <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Building className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Informações</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>
                                {tips.map((tip) => (
                                    <span key={tip}>
                                        • {tip}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
