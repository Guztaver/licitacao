import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Building, Save } from "lucide-react";
import type { FormEventHandler } from "react";
import { useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { emitentes } from "@/routes";
import type { BreadcrumbItem } from "@/types";

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
	{
		title: "Emitentes",
		href: emitentes.index(),
	},
	{
		title: "Novo Emitente",
		href: emitentes.create(),
	},
];

const FORM_FIELDS = [
	{
		name: "nome" as const,
		label: "Nome",
		type: "text",
		placeholder: "Nome completo do órgão",
		required: true,
		gridClass: "md:col-span-1",
		transform: undefined,
	},
	{
		name: "sigla" as const,
		label: "Sigla",
		type: "text",
		placeholder: "Ex: SECOM, SEMEC, etc.",
		required: true,
		gridClass: "md:col-span-1",
		transform: (value: string) => value.toUpperCase(),
	},
	{
		name: "endereco" as const,
		label: "Endereço",
		type: "text",
		placeholder: "Endereço completo do órgão",
		required: false,
		gridClass: "md:col-span-2",
		transform: undefined,
	},
	{
		name: "telefone" as const,
		label: "Telefone",
		type: "tel",
		placeholder: "(XX) XXXXX-XXXX",
		required: false,
		gridClass: "md:col-span-1",
		transform: undefined,
	},
	{
		name: "email" as const,
		label: "E-mail",
		type: "email",
		placeholder: "contato@orgao.gov.br",
		required: false,
		gridClass: "md:col-span-1",
		transform: undefined,
	},
] as const;

const TIPS = [
	"O nome deve ser completo e oficial do órgão",
	"A sigla será usada para identificação rápida nas listas",
	"Informações de contato são opcionais mas recomendadas",
];

// Types
type FormData = {
	nome: string;
	sigla: string;
	endereco: string;
	telefone: string;
	email: string;
	observacoes: string;
};

// Components
interface InputFieldProps {
	field: (typeof FORM_FIELDS)[number];
	value: string;
	onChange: (name: string, value: string) => void;
	error?: string;
	className?: string;
}

function InputField({
	field,
	value,
	onChange,
	error,
	className,
}: InputFieldProps) {
	const handleChange = useMemo(
		() => (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = field.transform
				? field.transform(e.target.value)
				: e.target.value;
			onChange(field.name, newValue);
		},
		[field, onChange],
	);

	return (
		<div className={`space-y-2 ${className || ""}`}>
			<Label htmlFor={field.name}>
				{field.label} {field.required && "*"}
			</Label>
			<Input
				id={field.name}
				type={field.type}
				value={value}
				onChange={handleChange}
				placeholder={field.placeholder}
				required={field.required}
				className={error ? "border-red-500" : ""}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

interface TipCardProps {
	tips: string[];
}

function TipCard({ tips }: TipCardProps) {
	return (
		<Card className="bg-blue-50 dark:bg-blue-950/20">
			<CardContent className="pt-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<Building className="h-5 w-5 text-blue-400" />
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
							Dica
						</h3>
						<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
							<p>
								{tips.map((tip) => (
									<span key={tip}>
										• {tip}
										<br />
									</span>
								))}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Main Component
export default function EmitentesCreate() {
	const { data, setData, post, processing, errors } = useForm<FormData>({
		nome: "",
		sigla: "",
		endereco: "",
		telefone: "",
		email: "",
		observacoes: "",
	});

	// Event handlers
	const handleFieldChange = useMemo(
		() => (name: string, value: string) => {
			setData(name as keyof FormData, value);
		},
		[setData],
	);

	const handleSubmit: FormEventHandler = useMemo(
		() => (e) => {
			e.preventDefault();
			post(emitentes.store());
		},
		[post],
	);

	const handleObservacoesChange = useMemo(
		() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setData("observacoes", e.target.value);
		},
		[setData],
	);

	return (
		<AppLayout breadcrumbs={BREADCRUMBS}>
			<Head title="Novo Emitente" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Novo Emitente
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Cadastre um novo órgão emitente de requisições
						</p>
					</div>
					<Link href={emitentes.index()}>
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar
						</Button>
					</Link>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Building className="mr-2 h-5 w-5" />
								Informações do Emitente
							</CardTitle>
							<CardDescription>
								Preencha os dados básicos do órgão emitente
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Basic Info Grid */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{FORM_FIELDS.filter((field) =>
									["nome", "sigla"].includes(field.name),
								).map((field) => (
									<InputField
										key={field.name}
										field={field}
										value={data[field.name]}
										onChange={handleFieldChange}
										error={errors[field.name]}
									/>
								))}
							</div>

							{/* Address */}
							{FORM_FIELDS.filter((field) => field.name === "endereco").map(
								(field) => (
									<InputField
										key={field.name}
										field={field}
										value={data[field.name]}
										onChange={handleFieldChange}
										error={errors[field.name]}
									/>
								),
							)}

							{/* Contact Info Grid */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{FORM_FIELDS.filter((field) =>
									["telefone", "email"].includes(field.name),
								).map((field) => (
									<InputField
										key={field.name}
										field={field}
										value={data[field.name]}
										onChange={handleFieldChange}
										error={errors[field.name]}
									/>
								))}
							</div>

							{/* Observations */}
							<div className="space-y-2">
								<Label htmlFor="observacoes">Observações</Label>
								<Textarea
									value={data.observacoes}
									onChange={handleObservacoesChange}
									placeholder="Informações adicionais sobre o órgão emitente..."
									rows={4}
									className={errors.observacoes ? "border-red-500" : ""}
								/>
								{errors.observacoes && (
									<p className="text-sm text-red-500">{errors.observacoes}</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4">
						<Link href={emitentes.index()}>
							<Button type="button" variant="outline">
								Cancelar
							</Button>
						</Link>
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar Emitente"}
						</Button>
					</div>
				</form>

				{/* Tips */}
				<TipCard tips={TIPS} />
			</div>
		</AppLayout>
	);
}
