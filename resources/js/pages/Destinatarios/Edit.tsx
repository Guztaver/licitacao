import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { destinatarios } from '@/routes';
import type { BreadcrumbItem, Destinatario } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
import type { FormEventHandler } from 'react';

interface DestinatariosEditProps {
    destinatario: Destinatario;
}

export default function DestinatariosEdit({ destinatario }: DestinatariosEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Destinatários',
            href: destinatarios.index(),
        },
        {
            title: destinatario.nome,
            href: destinatarios.show(destinatario.id),
        },
        {
            title: 'Editar',
            href: destinatarios.edit(destinatario.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nome: destinatario.nome || '',
        sigla: destinatario.sigla || '',
        endereco: destinatario.endereco || '',
        telefone: destinatario.telefone || '',
        email: destinatario.email || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(destinatarios.update(destinatario.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${destinatario.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Destinatário</h1>
                        <p className="text-gray-600 dark:text-gray-400">Atualize as informações do órgão destinatário</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={destinatarios.show(destinatario.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                Informações do Destinatário
                            </CardTitle>
                            <CardDescription>Atualize os dados básicos do órgão destinatário</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome *</Label>
                                    <Input
                                        id="nome"
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        placeholder="Nome completo do órgão"
                                        required
                                        className={errors.nome ? 'border-red-500' : ''}
                                    />
                                    {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sigla">Sigla *</Label>
                                    <Input
                                        id="sigla"
                                        type="text"
                                        value={data.sigla}
                                        onChange={(e) => setData('sigla', e.target.value.toUpperCase())}
                                        placeholder="Ex: SECOM, SEMEC, etc."
                                        required
                                        className={errors.sigla ? 'border-red-500' : ''}
                                    />
                                    {errors.sigla && <p className="text-sm text-red-500">{errors.sigla}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    type="text"
                                    value={data.endereco}
                                    onChange={(e) => setData('endereco', e.target.value)}
                                    placeholder="Endereço completo do órgão"
                                    className={errors.endereco ? 'border-red-500' : ''}
                                />
                                {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        type="tel"
                                        value={data.telefone}
                                        onChange={(e) => setData('telefone', e.target.value)}
                                        placeholder="(XX) XXXXX-XXXX"
                                        className={errors.telefone ? 'border-red-500' : ''}
                                    />
                                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contato@orgao.gov.br"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end space-x-4">
                        <Link href={destinatarios.show(destinatario.id)}>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>

                <Card className="bg-blue-50 dark:bg-blue-950/20">
                    <CardContent className="pt-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <MapPin className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Informações</h3>
                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    <p>
                                        • Alterações nos dados do destinatário podem afetar relatórios existentes
                                        <br />
                                        • A sigla é usada para identificação rápida em listas e relatórios
                                        <br />• Requisições vinculadas a este destinatário não serão alteradas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
