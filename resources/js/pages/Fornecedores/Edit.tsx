import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { fornecedores } from '@/routes';
import type { BreadcrumbItem, Fornecedor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building, Save, Users } from 'lucide-react';
import react from 'react';

// Constants
const PLACEHOLDERS = {
    nome: 'Nome completo ou razão social',
    cnpjCpf: '00.000.000/0000-00 ou 000.000.000-00',
    endereco: 'Endereço completo',
    telefone: '(XX) XXXXX-XXXX',
    email: 'email@exemplo.com',
    observacoes: 'Informações adicionais sobre o fornecedor...',
} as const;

// Types
interface FormData {
    nome: string;
    cnpj_cpf: string;
    endereco: string;
    telefone: string;
    email: string;
    observacoes: string;
}

interface FornecedoresEditProps {
    fornecedor: Fornecedor;
}

interface InputFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'tel';
    maxLength?: number;
    error?: string;
    className?: string;
}

interface TextareaFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    error?: string;
    className?: string;
}

// Utility Functions
const formatCnpjCpf = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');

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

// Components
const InputField = ({ id, label, value, onChange, placeholder, required = false, type = 'text', maxLength, error, className }: InputFieldProps) => (
    <div className="space-y-2">
        <Label htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            className={`${error ? 'border-red-500' : ''} ${className || ''}`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);

const TextareaField = ({ id, label, value, onChange, placeholder, rows = 4, error, className }: TextareaFieldProps) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`${error ? 'border-red-500' : ''} ${className || ''}`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);

const ActionButtons = ({ processing, onCancel }: { processing: boolean; onCancel: string }) => (
    <div className="flex items-center justify-end space-x-4">
        <Link href={onCancel}>
            <Button type="button" variant="outline" disabled={processing}>
                Cancelar
            </Button>
        </Link>
        <Button type="submit" disabled={processing} className="min-w-[150px]">
            <Save className="mr-2 h-4 w-4" />
            {processing ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
    </div>
);

const InfoCard = () => (
    <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Informações importantes</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-inside list-disc space-y-1">
                            <li>Alterações nos dados do fornecedor podem afetar relatórios existentes</li>
                            <li>CNPJ/CPF é formatado automaticamente durante a digitação</li>
                            <li>Requisições vinculadas a este fornecedor não serão alteradas</li>
                        </ul>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function FornecedoresEdit({ fornecedor }: FornecedoresEditProps) {
    const nomeId = react.useId();
    const cnpjCpfId = react.useId();
    const enderecoId = react.useId();
    const telefoneId = react.useId();
    const emailId = react.useId();
    const observacoesId = react.useId();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fornecedores',
            href: fornecedores.index(),
        },
        {
            title: fornecedor.razao_social || 'Fornecedor',
            href: fornecedores.show(fornecedor.id),
        },
        {
            title: 'Editar',
            href: fornecedores.edit(fornecedor.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        nome: fornecedor.razao_social || '',
        cnpj_cpf: fornecedor.cnpj || '',
        endereco: fornecedor.endereco || '',
        telefone: fornecedor.telefone || '',
        email: fornecedor.email || '',
        observacoes: fornecedor.observacoes || '',
    });

    // Handlers
    const handleSubmit = react.useCallback(
        (e: react.FormEvent) => {
            e.preventDefault();
            put(fornecedores.show(fornecedor.id), {
                onSuccess: () => {
                    // Will redirect automatically on success
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        },
        [put, fornecedor.id],
    );

    const handleCnpjCpfChange = react.useCallback(
        (value: string) => {
            const formatted = formatCnpjCpf(value);
            setData('cnpj_cpf', formatted);
        },
        [setData],
    );

    const fornecedorName = fornecedor.razao_social || 'Fornecedor';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${fornecedorName}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
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
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Building className="mr-2 h-5 w-5" />
                                Informações do Fornecedor
                            </CardTitle>
                            <CardDescription>Atualize os dados básicos do fornecedor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Name */}
                                <InputField
                                    id={nomeId}
                                    label="Nome / Razão Social"
                                    value={data.nome}
                                    onChange={(value) => setData('nome', value)}
                                    placeholder={PLACEHOLDERS.nome}
                                    required
                                    error={errors.nome}
                                />

                                {/* CNPJ/CPF */}
                                <InputField
                                    id={cnpjCpfId}
                                    label="CNPJ / CPF"
                                    value={data.cnpj_cpf}
                                    onChange={handleCnpjCpfChange}
                                    placeholder={PLACEHOLDERS.cnpjCpf}
                                    maxLength={18}
                                    error={errors.cnpj_cpf}
                                />
                            </div>

                            {/* Address */}
                            <InputField
                                id={enderecoId}
                                label="Endereço"
                                value={data.endereco}
                                onChange={(value) => setData('endereco', value)}
                                placeholder={PLACEHOLDERS.endereco}
                                error={errors.endereco}
                            />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Phone */}
                                <InputField
                                    id={telefoneId}
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(value) => setData('telefone', value)}
                                    placeholder={PLACEHOLDERS.telefone}
                                    type="tel"
                                    error={errors.telefone}
                                />

                                {/* Email */}
                                <InputField
                                    id={emailId}
                                    label="E-mail"
                                    value={data.email}
                                    onChange={(value) => setData('email', value)}
                                    placeholder={PLACEHOLDERS.email}
                                    type="email"
                                    error={errors.email}
                                />
                            </div>

                            {/* Observations */}
                            <TextareaField
                                id={observacoesId}
                                label="Observações"
                                value={data.observacoes}
                                onChange={(value) => setData('observacoes', value)}
                                placeholder={PLACEHOLDERS.observacoes}
                                rows={4}
                                error={errors.observacoes}
                            />
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <ActionButtons processing={processing} onCancel={fornecedores.show(fornecedor.id)} />
                </form>

                {/* Information Card */}
                <InfoCard />
            </div>
        </AppLayout>
    );
}
