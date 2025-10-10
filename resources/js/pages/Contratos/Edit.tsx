import { Head, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Fornecedor {
    id: number;
    razao_social: string;
}

interface Contrato {
    id: number;
    fornecedor_id: number | null;
    numero_contrato: string;
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: number | null;
    limite_conferencias: number | null;
    descricao: string;
    status: 'ativo' | 'inativo' | 'expirado';
}

interface ContratoEditProps {
    contrato: Contrato;
    fornecedores: Fornecedor[];
}

interface ContratoFormData {
    fornecedor_id: string;
    numero_contrato: string;
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: string;
    limite_conferencias: string;
    descricao: string;
    status: 'ativo' | 'inativo' | 'expirado';
}

const breadcrumbs = (contratoId: number): BreadcrumbItem[] => [
    {
        title: 'Contratos',
        href: '/contratos',
    },
    {
        title: 'Editar',
        href: `/contratos/${contratoId}/edit`,
    },
];

export default function ContratoEdit({ contrato, fornecedores }: ContratoEditProps) {
    const { data, setData, put, processing, errors } = useForm<ContratoFormData>({
        fornecedor_id: contrato.fornecedor_id?.toString() || '',
        numero_contrato: contrato.numero_contrato,
        data_inicio: contrato.data_inicio,
        data_fim: contrato.data_fim,
        limite_requisicoes: contrato.limite_requisicoes?.toString() || '',
        limite_conferencias: contrato.limite_conferencias?.toString() || '',
        descricao: contrato.descricao || '',
        status: contrato.status,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/contratos/${contrato.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(contrato.id)}>
            <Head title={`Editar Contrato ${contrato.numero_contrato}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Contrato</h1>
                        <p className="text-gray-600 dark:text-gray-400">Atualize as informações do contrato {contrato.numero_contrato}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                                <CardDescription>Atualize os dados principais do contrato</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="numero_contrato">
                                            Número do Contrato <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="numero_contrato"
                                            value={data.numero_contrato}
                                            onChange={(e) => setData('numero_contrato', e.target.value)}
                                            placeholder="Ex: 001/2024"
                                            required
                                        />
                                        {errors.numero_contrato && <p className="text-sm text-red-500">{errors.numero_contrato}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fornecedor_id">Fornecedor</Label>
                                        <Select value={data.fornecedor_id} onValueChange={(value) => setData('fornecedor_id', value)}>
                                            <SelectTrigger id="fornecedor_id">
                                                <SelectValue placeholder="Selecione um fornecedor (opcional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Contrato Geral (sem fornecedor)</SelectItem>
                                                {fornecedores.map((fornecedor) => (
                                                    <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                                                        {fornecedor.razao_social}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.fornecedor_id && <p className="text-sm text-red-500">{errors.fornecedor_id}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="data_inicio">
                                            Data de Início <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="data_inicio"
                                            type="date"
                                            value={data.data_inicio}
                                            onChange={(e) => setData('data_inicio', e.target.value)}
                                            required
                                        />
                                        {errors.data_inicio && <p className="text-sm text-red-500">{errors.data_inicio}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="data_fim">
                                            Data de Fim <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="data_fim"
                                            type="date"
                                            value={data.data_fim}
                                            onChange={(e) => setData('data_fim', e.target.value)}
                                            required
                                        />
                                        {errors.data_fim && <p className="text-sm text-red-500">{errors.data_fim}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        placeholder="Descrição opcional do contrato..."
                                        rows={3}
                                    />
                                    {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.status} onValueChange={(value: 'ativo' | 'inativo' | 'expirado') => setData('status', value)}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="inativo">Inativo</SelectItem>
                                            <SelectItem value="expirado">Expirado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Limites</CardTitle>
                                <CardDescription>Atualize os limites de requisições e conferências. Deixe em branco para ilimitado.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="limite_requisicoes">Limite de Requisições</Label>
                                        <Input
                                            id="limite_requisicoes"
                                            type="number"
                                            min="0"
                                            value={data.limite_requisicoes}
                                            onChange={(e) => setData('limite_requisicoes', e.target.value)}
                                            placeholder="Deixe vazio para ilimitado"
                                        />
                                        {errors.limite_requisicoes && <p className="text-sm text-red-500">{errors.limite_requisicoes}</p>}
                                        <p className="text-xs text-gray-500">Número máximo de requisições permitidas neste contrato</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="limite_conferencias">Limite de Conferências</Label>
                                        <Input
                                            id="limite_conferencias"
                                            type="number"
                                            min="0"
                                            value={data.limite_conferencias}
                                            onChange={(e) => setData('limite_conferencias', e.target.value)}
                                            placeholder="Deixe vazio para ilimitado"
                                        />
                                        {errors.limite_conferencias && <p className="text-sm text-red-500">{errors.limite_conferencias}</p>}
                                        <p className="text-xs text-gray-500">Número máximo de conferências permitidas neste contrato</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
