import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Save, Upload } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { requisicoes } from '@/routes';
import type { BreadcrumbItem, Destinatario, Emitente } from '@/types';

interface EditRequisicao {
    id: number;
    numero: string;
    emitente_id: number;
    destinatario_id: number;
    solicitante: string;
    numero_oficio?: string;
    data_recebimento?: string;
    descricao: string;
    anexo?: string;
}

interface EditProps {
    requisicao: EditRequisicao;
    emitentes: Emitente[];
    destinatarios: Destinatario[];
}

interface FormData {
    numero: string;
    emitente_id: string;
    destinatario_id: string;
    solicitante: string;
    numero_oficio: string;
    data_recebimento: string;
    descricao: string;
    anexo: File | null;
}

export default function RequisicaoEdit({ requisicao, emitentes, destinatarios }: EditProps) {
    const numeroId = useId();
    const emitenteId = useId();
    const destinatarioId = useId();
    const solicitanteId = useId();
    const numeroOficioId = useId();
    const dataRecebimentoId = useId();
    const descricaoId = useId();
    const anexoId = useId();

    const { data, setData, put, processing, errors, reset } = useForm<FormData>({
        numero: requisicao.numero || '',
        emitente_id: requisicao.emitente_id?.toString() || '',
        destinatario_id: requisicao.destinatario_id?.toString() || '',
        solicitante: requisicao.solicitante || '',
        numero_oficio: requisicao.numero_oficio || '',
        data_recebimento: requisicao.data_recebimento || '',
        descricao: requisicao.descricao || '',
        anexo: null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Requisições',
            href: requisicoes.index(),
        },
        {
            title: `Requisição ${requisicao.numero}`,
            href: requisicoes.show(requisicao.id),
        },
        {
            title: 'Editar',
            href: requisicoes.edit(requisicao.id),
        },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(requisicoes.update(requisicao.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('anexo', file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Requisição ${requisicao.numero}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Requisição</h1>
                        <p className="text-gray-600 dark:text-gray-400">Modificar os dados da requisição {requisicao.numero}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={requisicoes.show(requisicao.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Informações da Requisição
                                    </CardTitle>
                                    <CardDescription>Preencha os dados da requisição que está sendo editada.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Número e Emitente */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor={numeroId}>
                                                Número da Requisição <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={numeroId}
                                                type="text"
                                                value={data.numero}
                                                onChange={(e) => setData('numero', e.target.value)}
                                                placeholder="Ex: 001"
                                                required
                                                className={errors.numero ? 'border-red-500' : ''}
                                            />
                                            {errors.numero && <p className="text-sm text-red-500">{errors.numero}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={emitenteId}>
                                                Emitente <span className="text-red-500">*</span>
                                            </Label>
                                            <Select value={data.emitente_id} onValueChange={(value) => setData('emitente_id', value)} required>
                                                <SelectTrigger id={emitenteId} className={errors.emitente_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Selecione um emitente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {emitentes.map((emitente) => (
                                                        <SelectItem key={emitente.id} value={emitente.id.toString()}>
                                                            {emitente.nome} ({emitente.sigla})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.emitente_id && <p className="text-sm text-red-500">{errors.emitente_id}</p>}
                                        </div>
                                    </div>

                                    {/* Destinatário e Solicitante */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor={destinatarioId}>
                                                Destinatário <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.destinatario_id}
                                                onValueChange={(value) => setData('destinatario_id', value)}
                                                required
                                            >
                                                <SelectTrigger id={destinatarioId} className={errors.destinatario_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Selecione um destinatário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {destinatarios.map((destinatario) => (
                                                        <SelectItem key={destinatario.id} value={destinatario.id.toString()}>
                                                            {destinatario.nome} ({destinatario.sigla})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.destinatario_id && <p className="text-sm text-red-500">{errors.destinatario_id}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={solicitanteId}>
                                                Solicitante <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={solicitanteId}
                                                type="text"
                                                value={data.solicitante}
                                                onChange={(e) => setData('solicitante', e.target.value)}
                                                placeholder="Nome do solicitante"
                                                required
                                                className={errors.solicitante ? 'border-red-500' : ''}
                                            />
                                            {errors.solicitante && <p className="text-sm text-red-500">{errors.solicitante}</p>}
                                        </div>
                                    </div>

                                    {/* Número do Ofício e Data de Recebimento */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor={numeroOficioId}>Número do Ofício</Label>
                                            <Input
                                                id={numeroOficioId}
                                                type="text"
                                                value={data.numero_oficio}
                                                onChange={(e) => setData('numero_oficio', e.target.value)}
                                                placeholder="Ex: OF-001/2025"
                                                className={errors.numero_oficio ? 'border-red-500' : ''}
                                            />
                                            {errors.numero_oficio && <p className="text-sm text-red-500">{errors.numero_oficio}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={dataRecebimentoId}>
                                                Data de Recebimento <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={dataRecebimentoId}
                                                type="date"
                                                value={data.data_recebimento}
                                                onChange={(e) => setData('data_recebimento', e.target.value)}
                                                required
                                                className={errors.data_recebimento ? 'border-red-500' : ''}
                                            />
                                            {errors.data_recebimento && <p className="text-sm text-red-500">{errors.data_recebimento}</p>}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Descrição */}
                                    <div className="space-y-2">
                                        <Label htmlFor={descricaoId}>
                                            Descrição <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id={descricaoId}
                                            value={data.descricao}
                                            onChange={(e) => setData('descricao', e.target.value)}
                                            placeholder="Descreva detalhadamente a requisição..."
                                            rows={4}
                                            required
                                            className={errors.descricao ? 'border-red-500' : ''}
                                        />
                                        {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                                    </div>

                                    {/* Anexo */}
                                    <div className="space-y-2">
                                        <Label htmlFor={anexoId}>Anexo</Label>
                                        <div className="space-y-2">
                                            {requisicao.anexo && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FileText className="h-4 w-4" />
                                                    <span>Arquivo atual: {requisicao.anexo.split('/').pop()}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id={anexoId}
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    className={errors.anexo ? 'border-red-500' : ''}
                                                />
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamanho máximo: 10MB
                                                {requisicao.anexo && ' (deixe em branco para manter o arquivo atual)'}
                                            </p>
                                            {errors.anexo && <p className="text-sm text-red-500">{errors.anexo}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar with additional info */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações Adicionais</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID da Requisição</p>
                                        <p className="text-sm">#{requisicao.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Atual</p>
                                        <p className="text-sm">Autorizada</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-xs text-muted-foreground">
                                            Apenas requisições com status "Autorizada" podem ser editadas.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 border-t pt-6">
                        <Link href={requisicoes.show(requisicao.id)}>
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
            </div>
        </AppLayout>
    );
}
