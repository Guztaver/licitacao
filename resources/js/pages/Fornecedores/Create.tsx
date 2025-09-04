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
import AppLayout from "@/layouts/app-layout";
import { fornecedores } from "@/routes";
import type { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Building, Save, Users } from "lucide-react";
import react from "react";

// Constants
const PLACEHOLDERS = {
	razaoSocial: "Ex: Empresa ABC Ltda",
	cnpj: "00.000.000/0000-00",
	telefone: "(00) 00000-0000",
	email: "contato@empresa.com",
	tipoPrincipal: "Ex: Alimentício, Material de Escritório, Equipamentos",
} as const;

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Fornecedores",
		href: fornecedores.index(),
	},
	{
		title: "Novo Fornecedor",
		href: "#",
	},
];

// Types
interface FormData {
	razao_social: string;
	cnpj: string;
	telefone: string;
	email: string;
	tipo_principal: string;
}

interface InputFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	type?: "text" | "email" | "tel";
	maxLength?: number;
	error?: string;
}

// Utility Functions
const formatCNPJ = (value: string): string => {
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

const formatPhone = (value: string): string => {
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

// Components
const InputField = ({
	id,
	label,
	value,
	onChange,
	placeholder,
	required = false,
	type = "text",
	maxLength,
	error,
}: InputFieldProps) => (
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
			className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
		/>
		{error && <p className="text-sm text-red-500">{error}</p>}
	</div>
);

const ActionButtons = ({
	onReset,
	processing,
}: {
	onReset: () => void;
	processing: boolean;
}) => (
	<div className="flex items-center justify-end space-x-4">
		<Button
			type="button"
			variant="outline"
			onClick={onReset}
			disabled={processing}
			className="min-w-[100px]"
		>
			Limpar
		</Button>
		<Button type="button" variant="outline" asChild>
			<Link href={fornecedores.index()}>Cancelar</Link>
		</Button>
		<Button type="submit" disabled={processing} className="min-w-[150px]">
			<Save className="mr-2 h-4 w-4" />
			{processing ? "Salvando..." : "Salvar Fornecedor"}
		</Button>
	</div>
);

const InfoCard = () => (
	<Card className="bg-blue-50 dark:bg-blue-950/20">
		<CardContent className="pt-6">
			<div className="flex">
				<div className="flex-shrink-0">
					<Building className="h-5 w-5 text-blue-400" />
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
						Informações importantes
					</h3>
					<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
						<ul className="list-disc list-inside space-y-1">
							<li>Apenas a Razão Social é obrigatória</li>
							<li>CNPJ e telefone são formatados automaticamente</li>
							<li>Você pode editar essas informações depois</li>
						</ul>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

export default function FornecedorCreate() {
	const { data, setData, post, processing, errors, reset } = useForm<FormData>({
		razao_social: "",
		cnpj: "",
		telefone: "",
		email: "",
		tipo_principal: "",
	});

	// Handlers
	const handleSubmit = react.useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			post(fornecedores.index(), {
				onSuccess: () => {
					// Form will redirect automatically on success
				},
				onError: (errors) => {
					console.error("Validation errors:", errors);
				},
			});
		},
		[post],
	);

	const handleCNPJChange = react.useCallback(
		(value: string) => {
			const formatted = formatCNPJ(value);
			setData("cnpj", formatted);
		},
		[setData],
	);

	const handlePhoneChange = react.useCallback(
		(value: string) => {
			const formatted = formatPhone(value);
			setData("telefone", formatted);
		},
		[setData],
	);

	const handleReset = react.useCallback(() => {
		reset();
	}, [reset]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Novo Fornecedor" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center space-x-4">
					<Button variant="outline" size="icon" asChild>
						<Link href={fornecedores.index()}>
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Novo Fornecedor
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Cadastre um novo fornecedor no sistema
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Users className="mr-2 h-5 w-5" />
								Informações Básicas
							</CardTitle>
							<CardDescription>
								Preencha as informações do fornecedor. Campos marcados com * são
								obrigatórios.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Company Name */}
							<InputField
								id="razao_social"
								label="Razão Social"
								value={data.razao_social}
								onChange={(value) => setData("razao_social", value)}
								placeholder={PLACEHOLDERS.razaoSocial}
								required
								error={errors.razao_social}
							/>

							<div className="grid gap-4 md:grid-cols-2">
								{/* CNPJ */}
								<InputField
									id="cnpj"
									label="CNPJ"
									value={data.cnpj}
									onChange={handleCNPJChange}
									placeholder={PLACEHOLDERS.cnpj}
									maxLength={18}
									error={errors.cnpj}
								/>

								{/* Main Type */}
								<InputField
									id="tipo_principal"
									label="Tipo Principal de Fornecimento"
									value={data.tipo_principal}
									onChange={(value) => setData("tipo_principal", value)}
									placeholder={PLACEHOLDERS.tipoPrincipal}
									error={errors.tipo_principal}
								/>
							</div>

							<Separator />

							{/* Contact Information */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
									Informações de Contato
								</h3>

								<div className="grid gap-4 md:grid-cols-2">
									{/* Phone */}
									<InputField
										id="telefone"
										label="Telefone"
										value={data.telefone}
										onChange={handlePhoneChange}
										placeholder={PLACEHOLDERS.telefone}
										type="tel"
										maxLength={15}
										error={errors.telefone}
									/>

									{/* Email */}
									<InputField
										id="email"
										label="E-mail"
										value={data.email}
										onChange={(value) => setData("email", value)}
										placeholder={PLACEHOLDERS.email}
										type="email"
										error={errors.email}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<ActionButtons onReset={handleReset} processing={processing} />
				</form>

				{/* Information Card */}
				<InfoCard />
			</div>
		</AppLayout>
	);
}
