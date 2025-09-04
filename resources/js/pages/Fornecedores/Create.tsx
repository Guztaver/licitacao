import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { fornecedores } from "@/routes";

interface FormData {
	razao_social: string;
	cnpj: string;
	telefone: string;
	email: string;
	tipo_principal: string;
}

export default function FornecedorCreate() {
	const { data, setData, post, processing, errors, reset } = useForm<FormData>({
		razao_social: "",
		cnpj: "",
		telefone: "",
		email: "",
		tipo_principal: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(fornecedores.index());
	};

	const formatCNPJ = (value: string) => {
		// Remove tudo que não for número
		const numbers = value.replace(/\D/g, "");

		// Aplica a máscara de CNPJ
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
		// Remove tudo que não for número
		const numbers = value.replace(/\D/g, "");

		// Aplica a máscara de telefone
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

	return (
		<>
			<Head title="Novo Fornecedor - Gestor de Requisições" />

			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center space-x-4">
					<Button variant="outline" size="icon" asChild>
						<Link href={fornecedores.index()}>
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Novo Fornecedor
						</h1>
						<p className="text-muted-foreground">
							Cadastre um novo fornecedor no sistema
						</p>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Informações Básicas</CardTitle>
							<CardDescription>
								Preencha as informações do fornecedor. Campos marcados com * são
								obrigatórios.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Razão Social */}
							<div className="space-y-2">
								<Label htmlFor="razao_social">Razão Social *</Label>
								<Input
									id="razao_social"
									type="text"
									value={data.razao_social}
									onChange={(e) => setData("razao_social", e.target.value)}
									placeholder="Ex: Empresa ABC Ltda"
									required
								/>
								{errors.razao_social && (
									<p className="text-sm text-destructive">
										{errors.razao_social}
									</p>
								)}
							</div>

							{/* CNPJ */}
							<div className="space-y-2">
								<Label htmlFor="cnpj">CNPJ</Label>
								<Input
									id="cnpj"
									type="text"
									value={data.cnpj}
									onChange={handleCNPJChange}
									placeholder="00.000.000/0000-00"
									maxLength={18}
								/>
								{errors.cnpj && (
									<p className="text-sm text-destructive">{errors.cnpj}</p>
								)}
							</div>

							{/* Tipo Principal */}
							<div className="space-y-2">
								<Label htmlFor="tipo_principal">
									Tipo Principal de Fornecimento
								</Label>
								<Input
									id="tipo_principal"
									type="text"
									value={data.tipo_principal}
									onChange={(e) => setData("tipo_principal", e.target.value)}
									placeholder="Ex: Alimentício, Material de Escritório, Equipamentos"
								/>
								{errors.tipo_principal && (
									<p className="text-sm text-destructive">
										{errors.tipo_principal}
									</p>
								)}
							</div>

							<Separator />

							{/* Informações de Contato */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Informações de Contato</h3>

								<div className="grid gap-4 md:grid-cols-2">
									{/* Telefone */}
									<div className="space-y-2">
										<Label htmlFor="telefone">Telefone</Label>
										<Input
											id="telefone"
											type="text"
											value={data.telefone}
											onChange={handlePhoneChange}
											placeholder="(00) 00000-0000"
											maxLength={15}
										/>
										{errors.telefone && (
											<p className="text-sm text-destructive">
												{errors.telefone}
											</p>
										)}
									</div>

									{/* Email */}
									<div className="space-y-2">
										<Label htmlFor="email">E-mail</Label>
										<Input
											id="email"
											type="email"
											value={data.email}
											onChange={(e) => setData("email", e.target.value)}
											placeholder="contato@empresa.com"
										/>
										{errors.email && (
											<p className="text-sm text-destructive">{errors.email}</p>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => reset()}
							disabled={processing}
						>
							Limpar
						</Button>
						<Button type="button" variant="outline" asChild>
							<Link href={fornecedores.index()}>Cancelar</Link>
						</Button>
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar Fornecedor"}
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}
