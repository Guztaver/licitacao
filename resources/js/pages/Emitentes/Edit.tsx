import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { EmitentePageHeader } from '@/components/emitentes/filter-components';
import { EmitenteFormActions, EmitenteFormCard, EmitenteInfoCard } from '@/components/emitentes/form-components';
import { EMITENTE_LABELS, EMITENTE_MESSAGES, EMITENTE_TIPS } from '@/constants/emitentes';
import { useEmitenteBreadcrumbs, useEmitenteEdit } from '@/hooks/emitentes';
import AppLayout from '@/layouts/app-layout';
import { emitentes } from '@/routes';
import type { Emitente } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

interface EmitentesEditProps {
    emitente: Emitente;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EmitentesEdit({ emitente }: EmitentesEditProps) {
    const breadcrumbs = useEmitenteBreadcrumbs('edit', emitente);
    const { data, processing, errors, handleFieldChange, handleObservationsChange, handleSubmit, handleCancel } = useEmitenteEdit(emitente);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${EMITENTE_LABELS.edit}: ${emitente.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <EmitentePageHeader
                    title={EMITENTE_LABELS.edit}
                    description={EMITENTE_MESSAGES.editDescription}
                    backButton={{
                        href: emitentes.show(emitente.id),
                    }}
                    actions={<ArrowLeft className="mr-2 h-4 w-4" />}
                />

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <EmitenteFormCard
                        data={data}
                        onChange={handleFieldChange}
                        onObservationsChange={handleObservationsChange}
                        errors={errors}
                        disabled={processing}
                        isEdit={true}
                    />

                    {/* Actions */}
                    <EmitenteFormActions
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        processing={processing}
                        isEdit={true}
                        cancelLabel={EMITENTE_LABELS.cancel}
                    />
                </form>

                {/* Info */}
                <EmitenteInfoCard tips={[...EMITENTE_TIPS.edit]} />
            </div>
        </AppLayout>
    );
}
