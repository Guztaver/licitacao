import { useForm } from "@inertiajs/react";
import { Building2, Plus, Save } from "lucide-react";
import { type FormEventHandler, type ReactNode, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CreateFornecedorModalProps {
	trigger?: ReactNode;
	onSuccess?: () => void;
}

interface FormData {
	razao_social: string;
	cnpj: string;
	telefone: string;
	email: string;
	tipo_principal: string;
}

export default function CreateFornecedorModal({
	trigger,
	onSuccess,
}: CreateFornecedorModalProps) {
	const [open, setOpen] = useState(false);
	const razaoSocialId = useId();
	const cnpjId = useId();
	const telefoneId = useId();
	const emailId = useId();
	const tipoPrincipalId = useId();
	const { data, setData, post, processing, errors, reset } = useForm<FormData>({
		razao_social: "",
		cnpj: "",
		telefone: "",
		email: "",
		tipo_principal: "",
	});

	const formatCNPJ = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 14) {
			return numbers
				.replace(/(\d{2})(\d)/, "$1.$2")
				.replace(/(\d{3})(\d)/, "$1.$2")
				.replace(/(\d{3})(\d)/, "$1/$2")
				.replace(/(\d{4})(\d)/, "$1-$2");
		}
		return value;
	};

	const formatPhone = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 11) {
			if (numbers.length <= 10) {
				return numbers
					.replace(/(\d{2})(\d)/, "($1) $2")
					.replace(/(\d{4})(\d)/, "$1-$2");
			} else {
				return numbers
					.replace(/(\d{2})(\d)/, "($1) $2")
					.replace(/(\d{5})(\d)/, "$1-$2");
			}
		}
		return value;
	};

	const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatCNPJ(e.target.value);
		setData("cnpj", formatted);
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatPhone(e.target.value);
		setData("telefone", formatted);
	};

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		post("/fornecedores", {
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
						Novo Fornecedor
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<Building2 className="mr-2 h-5 w-5" />
						Novo Fornecedor
					</DialogTitle>
					<DialogDescription>
						Cadastre um novo fornecedor no sistema
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={razaoSocialId}>Razão Social *</Label>
						<Input
							id={razaoSocialId}
							type="text"
							value={data.razao_social}
							onChange={(e) => setData("razao_social", e.target.value)}
							placeholder="Ex: Empresa ABC Ltda"
							required
							className={errors.razao_social ? "border-red-500" : ""}
						/>
						{errors.razao_social && (
							<p className="text-sm text-red-500">{errors.razao_social}</p>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={cnpjId}>CNPJ *</Label>
							<Input
								id={cnpjId}
								type="text"
								value={data.cnpj}
								onChange={handleCNPJChange}
								placeholder="00.000.000/0000-00"
								maxLength={18}
								className={errors.cnpj ? "border-red-500" : ""}
							/>
							{errors.cnpj && (
								<p className="text-sm text-red-500">{errors.cnpj}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor={tipoPrincipalId}>Tipo Principal</Label>
							<Input
								id={tipoPrincipalId}
								type="text"
								value={data.tipo_principal}
								onChange={(e) => setData("tipo_principal", e.target.value)}
								placeholder="Ex: Alimentício, Material de Escritório"
								className={errors.tipo_principal ? "border-red-500" : ""}
							/>
							{errors.tipo_principal && (
								<p className="text-sm text-red-500">{errors.tipo_principal}</p>
							)}
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={telefoneId}>Telefone</Label>
							<Input
								id={telefoneId}
								type="text"
								value={data.telefone}
								onChange={handlePhoneChange}
								placeholder="(00) 00000-0000"
								maxLength={15}
								className={errors.telefone ? "border-red-500" : ""}
							/>
							{errors.telefone && (
								<p className="text-sm text-red-500">{errors.telefone}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor={emailId}>E-mail</Label>
							<Input
								id={emailId}
								type="email"
								value={data.email}
								onChange={(e) => setData("email", e.target.value)}
								placeholder="contato@empresa.com"
								className={errors.email ? "border-red-500" : ""}
							/>
							{errors.email && (
								<p className="text-sm text-red-500">{errors.email}</p>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
