import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { conferencias } from '@/routes';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Save } from 'lucide-react';
import { useId } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conferências',
        href: conferencias.index(),
    },
    {
        title: 'Nova Conferência',
        href: conferencias.create(),
    },
];

interface CreateProps {
    fornecedores: Fornecedor[];
}

interface FormData {
    fornecedor_id: string;
    periodo: string;
    observacoes: string;
}

export default function ConferenciaCreate({ fornecedores }: CreateProps) {
    const fornecedorId = useId();
    const periodoId = useId();

    const observacoesId = useId();

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        fornecedor_id: '',
        periodo: '',
        observacoes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(conferencias.index());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Conferência" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={conferencias.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Nova Conferência</h1>
                        <p className="text-gray-600 dark:text-gray-400">Realizar conferência de fornecedor</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckSquare className="mr-2 h-5 w-5" />
                                Informações da Conferência
                            </CardTitle>
                            <CardDescription>Preencha as informações da conferência. Campos marcados com * são obrigatórios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Fornecedor */}
                            <div className="space-y-2">
                                <Label htmlFor={fornecedorId}>Fornecedor *</Label>
                                <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)} required>
                                    <SelectTrigger className={errors.fornecedor_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Selecione um fornecedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fornecedores && fornecedores.length > 0 ? (
                                            fornecedores.map((fornecedor) => (
                                                <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                                    {fornecedor.razao_social}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-fornecedor" disabled>
                                                Nenhum fornecedor disponível
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.fornecedor_id && <p className="text-sm text-red-500">{errors.fornecedor_id}</p>}
                            </div>

                            {/* Período */}
                            <div className="space-y-2">
                                <Label htmlFor={periodoId}>Período *</Label>
                                <Input
                                    id={periodoId}
                                    type="text"
                                    value={data.periodo}
                                    onChange={(e) => setData('periodo', e.target.value)}
                                    placeholder="Ex: 01/2024"
                                    required
                                    className={errors.periodo ? 'border-red-500' : ''}
                                />
                                {errors.periodo && <p className="text-sm text-red-500">{errors.periodo}</p>}
                                <p className="text-xs text-gray-500">Formato: MM/AAAA</p>
                            </div>

                            <Separator />

                            {/* Observações */}
                            <div className="space-y-2">
                                <Label htmlFor={observacoesId}>Observações</Label>
                                <Textarea
                                    id={observacoesId}
                                    value={data.observacoes}
                                    onChange={(e) => setData('observacoes', e.target.value)}
                                    placeholder="Observações adicionais sobre a conferência..."
                                    rows={4}
                                    className={errors.observacoes ? 'border-red-500' : ''}
                                />
                                {errors.observacoes && <p className="text-sm text-red-500">{errors.observacoes}</p>}
                                <p className="text-xs text-gray-500">Máximo de 1000 caracteres</p>
                            </div>

                            {/* Information about totals */}
                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                <h4 className="font-medium text-blue-900 dark:text-blue-100">Informação</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Os totais (requisições, pedidos manuais e total geral) serão calculados automaticamente com base no fornecedor
                                    selecionado no momento da criação da conferência.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => reset()} disabled={processing}>
                            Limpar
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={conferencias.index()}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Criar Conferência'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
