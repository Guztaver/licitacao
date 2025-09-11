import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { destinatarios } from '@/routes';
import { useForm } from '@inertiajs/react';
import { Building, Plus, Save } from 'lucide-react';
import { type FormEventHandler, type ReactNode, useState } from 'react';

interface CreateDestinatarioModalProps {
    trigger?: ReactNode;
    onSuccess?: () => void;
}

export default function CreateDestinatarioModal({ trigger, onSuccess }: CreateDestinatarioModalProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        nome: '',
        sigla: '',
        endereco: '',
        telefone: '',
        email: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(destinatarios.store(), {
            onSuccess: () => {
                reset();
                setOpen(false);
                onSuccess?.();
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Destinatário
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        Novo Destinatário
                    </DialogTitle>
                    <DialogDescription>Cadastre um novo órgão destinatário de requisições</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
