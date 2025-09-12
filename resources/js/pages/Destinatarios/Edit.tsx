import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
import { DestinatarisFormField, DestinatarisFormSection, DestinatarisInfoCard } from '@/components/destinatarios';
import { Button } from '@/components/ui/button';
import { DESTINATARIOS_LABELS, DESTINATARIOS_MESSAGES, useDestinatarisForm } from '@/hooks/use-destinatarios';
import AppLayout from '@/layouts/app-layout';
import { destinatarios } from '@/routes';
import type { BreadcrumbItem, Destinatario } from '@/types';

interface DestinatariosEditProps {
    destinatario: Destinatario;
}

export default function DestinatariosEdit({ destinatario }: DestinatariosEditProps) {
    const { formFields, processing, handleSubmit } = useDestinatarisForm({
        initialData: {
            nome: destinatario.nome || '',
            sigla: destinatario.sigla || '',
            endereco: destinatario.endereco || '',
            telefone: destinatario.telefone || '',
            email: destinatario.email || '',
            observacoes: destinatario.observacoes || '',
        },
        destinatarioId: destinatario.id,
        onSuccess: () => router.get(destinatarios.show(destinatario.id)),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: DESTINATARIOS_LABELS.destinatarios,
            href: destinatarios.index(),
        },
        {
            title: destinatario.nome,
            href: destinatarios.show(destinatario.id),
        },
        {
            title: DESTINATARIOS_LABELS.editar,
            href: destinatarios.edit(destinatario.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${DESTINATARIOS_LABELS.editTitle}: ${destinatario.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{DESTINATARIOS_LABELS.editTitle}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{DESTINATARIOS_LABELS.editSubtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={destinatarios.show(destinatario.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {DESTINATARIOS_LABELS.voltar}
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Form Section */}
                    <DestinatarisFormSection
                        title={DESTINATARIOS_LABELS.informacoesDestinatario}
                        description={DESTINATARIOS_LABELS.informacoesDestinatarioDescUpdate}
                        icon={MapPin}
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
                                    prefix="edit"
                                />
                            ))}
                        </div>
                    </DestinatarisFormSection>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link href={destinatarios.show(destinatario.id)}>
                            <Button type="button" variant="outline">
                                {DESTINATARIOS_LABELS.cancelar}
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? DESTINATARIOS_MESSAGES.salvando : DESTINATARIOS_LABELS.salvarAlteracoes}
                        </Button>
                    </div>
                </form>

                {/* Info Card */}
                <DestinatarisInfoCard
                    title={DESTINATARIOS_MESSAGES.infoTitulo}
                    content={DESTINATARIOS_MESSAGES.infoConteudo}
                    icon={MapPin}
                    variant="info"
                />
            </div>
        </AppLayout>
    );
}
