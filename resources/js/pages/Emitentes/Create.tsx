import { EmitentePageHeader } from '@/components/emitentes/filter-components';
import { EmitenteFormActions, EmitenteFormCard, EmitenteTipCard } from '@/components/emitentes/form-components';
import { EMITENTE_LABELS, EMITENTE_MESSAGES, EMITENTE_TIPS } from '@/constants/emitentes';
import { useEmitenteBreadcrumbs, useEmitenteCreate } from '@/hooks/emitentes';
import AppLayout from '@/layouts/app-layout';
import { emitentes } from '@/routes';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EmitentesCreate() {
    const breadcrumbs = useEmitenteBreadcrumbs('create');
    const { data, processing, errors, handleFieldChange, handleObservationsChange, handleSubmit, handleCancel } = useEmitenteCreate();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={EMITENTE_LABELS.create} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <EmitentePageHeader
                    title={EMITENTE_LABELS.create}
                    description={EMITENTE_MESSAGES.createDescription}
                    backButton={{
                        href: emitentes.index(),
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
                        isEdit={false}
                    />

                    {/* Actions */}
                    <EmitenteFormActions onSubmit={handleSubmit} onCancel={handleCancel} processing={processing} isEdit={false} />
                </form>

                {/* Tips */}
                <EmitenteTipCard tips={[...EMITENTE_TIPS.create]} />
            </div>
        </AppLayout>
    );
}
