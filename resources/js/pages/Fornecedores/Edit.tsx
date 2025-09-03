import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { fornecedores } from '@/routes';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

interface FornecedoresEditProps {
    fornecedor: Fornecedor;
}

export default function FornecedoresEdit({ fornecedor }: FornecedoresEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fornecedores',
            href: fornecedores.index(),
        },
        {
            title: fornecedor.nome,
            href: fornecedores.show(fornecedor.id),
        },
        {
            title: 'Editar',
            href: fornecedores.edit(fornecedor.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nome: fornecedor.nome || '',
        cnpj_cpf: fornecedor.cnpj_cpf || '',
        endereco: fornecedor.endereco || '',
        telefone: fornecedor.telefone || '',
        email: fornecedor.email || '',
        observacoes: fornecedor.observacoes || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(fornecedores.update(fornecedor.id));
    };

    const formatCnpjCpf = (value: string) => {
        // Remove non-numeric characters
        const cleanValue = value.replace(/\D/g, '');

        // Format as CPF (11 digits) or CNPJ (14 digits)
        if (cleanValue.length <= 11) {
            // CPF format: 000.000.000-00
            return cleanValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2');
        } else {
            // CNPJ format: 00.000.000/0000-00
            return cleanValue
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})/, '$1-$2');
        }
    };

    const handleCnpjCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCnpjCpf(e.target.value);
        setData('cnpj_cpf', formatted);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${fornecedor.nome}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Fornecedor</h1>
                        <p className="text-gray-600 dark:text-gray-400">Atualize as informações do fornecedor</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={fornecedores.show(fornecedor.id)}>
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
                                <Users className="mr-2 h-5 w-5" />
                                Informações do Fornecedor
                            </CardTitle>
                            <CardDescription>Atualize os dados básicos do fornecedor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome / Razão Social *</Label>
                                    <Input
                                        id="nome"
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        placeholder="Nome completo ou razão social"
                                        required
                                        className={errors.nome ? 'border-red-500' : ''}
                                    />
                                    {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cnpj_cpf">CNPJ / CPF</Label>
                                    <Input
                                        id="cnpj_cpf"
                                        type="text"
                                        value={data.cnpj_cpf}
                                        onChange={handleCnpjCpfChange}
                                        placeholder="00.000.000/0000-00 ou 000.000.000-00"
                                        maxLength={18}
                                        className={errors.cnpj_cpf ? 'border-red-500' : ''}
                                    />
                                    {errors.cnpj_cpf && <p className="text-sm text-red-500">{errors.cnpj_cpf}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    type="text"
                                    value={data.endereco}
                                    onChange={(e) => setData('endereco', e.target.value)}
                                    placeholder="Endereço completo"
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
                                        placeholder="email@exemplo.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observacoes">Observações</Label>
                                <Textarea
                                    id="observacoes"
                                    value={data.observacoes}
                                    onChange={(e) => setData('observacoes', e.target.value)}
                                    placeholder="Informações adicionais sobre o fornecedor..."
                                    rows={4}
                                    className={errors.observacoes ? 'border-red-500' : ''}
                                />
                                {errors.observacoes && <p className="text-sm text-red-500">{errors.observacoes}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end space-x-4">
                        <Link href={fornecedores.show(fornecedor.id)}>
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
                                <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Informações</h3>
                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    <p>
                                        • Alterações nos dados do fornecedor podem afetar relatórios existentes
                                        <br />
                                        • CNPJ/CPF é formatado automaticamente durante a digitação
                                        <br />
                                        • Requisições vinculadas a este fornecedor não serão alteradas
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
