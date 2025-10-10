import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { items } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const BREADCRUMBS: BreadcrumbItem[] = [
    {
        title: 'Referências',
        href: items.index(),
    },
    {
        title: 'Novo Item',
        href: items.create(),
    },
];

export default function CreateItem() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        unit_of_measurement: '',
        medium_price: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(items.store());
    };

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Novo Item - Referências" />

            <div className="mx-auto max-w-3xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Novo Item</CardTitle>
                                <CardDescription>Cadastre um novo item de referência com seu preço médio</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={items.index()}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Código <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="code"
                                        placeholder="Ex: ITEM001"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        className={errors.code ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_of_measurement">
                                        Unidade de Medida <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="unit_of_measurement"
                                        placeholder="Ex: UN, KG, L, M"
                                        value={data.unit_of_measurement}
                                        onChange={(e) => setData('unit_of_measurement', e.target.value)}
                                        className={errors.unit_of_measurement ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.unit_of_measurement && <p className="text-sm text-red-500">{errors.unit_of_measurement}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nome do Item <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Papel Sulfite A4"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="medium_price">
                                    Preço Médio (R$) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="medium_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={data.medium_price}
                                    onChange={(e) => setData('medium_price', e.target.value)}
                                    className={errors.medium_price ? 'border-red-500' : ''}
                                    required
                                />
                                {errors.medium_price && <p className="text-sm text-red-500">{errors.medium_price}</p>}
                                <p className="text-sm text-muted-foreground">Informe o preço médio praticado no mercado</p>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t pt-6">
                                <Button type="button" variant="outline" asChild disabled={processing}>
                                    <Link href={items.index()}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Salvando...' : 'Salvar Item'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
