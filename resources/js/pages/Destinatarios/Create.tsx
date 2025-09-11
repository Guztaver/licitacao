import { DestinatarisFormField, DestinatarisFormSection, DestinatarisInfoCard } from '@/components/destinatarios';
import { Button } from '@/components/ui/button';
import { DESTINATARIOS_LABELS, DESTINATARIOS_MESSAGES, useDestinatarisForm } from '@/hooks/use-destinatarios';
import AppLayout from '@/layouts/app-layout';
import { destinatarios } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: DESTINATARIOS_LABELS.destinatarios,
        href: destinatarios.index(),
    },
    {
        title: DESTINATARIOS_LABELS.novoDestinatario,
        href: destinatarios.create(),
    },
];

export default function DestinatariosCreate() {
    const { formFields, processing, handleSubmit } = useDestinatarisForm({
        onSuccess: () => router.get(destinatarios.index()),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={DESTINATARIOS_LABELS.createTitle} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{DESTINATARIOS_LABELS.createTitle}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{DESTINATARIOS_LABELS.createSubtitle}</p>
                    </div>
                    <Link href={destinatarios.index()}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {DESTINATARIOS_LABELS.voltar}
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Form Section */}
                    <DestinatarisFormSection
                        title={DESTINATARIOS_LABELS.informacoesDestinatario}
                        description={DESTINATARIOS_LABELS.informacoesDestinatarioDesc}
                        icon={Building}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {formFields.map((field) => (
                                <DestinatarisFormField
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    type={field.type}
                                    required={field.required}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={field.error}
                                    transform={field.transform}
                                    grid={field.grid}
                                    rows={field.rows}
                                    disabled={processing}
                                />
                            ))}
                        </div>
                    </DestinatarisFormSection>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link href={destinatarios.index()}>
                            <Button type="button" variant="outline">
                                {DESTINATARIOS_LABELS.cancelar}
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? DESTINATARIOS_MESSAGES.salvando : DESTINATARIOS_LABELS.salvar}
                        </Button>
                    </div>
                </form>

                {/* Info Card */}
                <DestinatarisInfoCard
                    title={DESTINATARIOS_MESSAGES.dicaTitulo}
                    content={DESTINATARIOS_MESSAGES.dicaConteudo}
                    icon={Building}
                    variant="tip"
                />
            </div>
        </AppLayout>
    );
}
