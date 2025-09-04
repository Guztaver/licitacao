import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, CheckSquare, Save } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { conferencias } from "@/routes";
import type { BreadcrumbItem, Fornecedor } from "@/types";

// Types
interface CreateProps {
	fornecedores: Fornecedor[];
}

interface FormData {
	fornecedor_id: string;
	periodo: string;
	observacoes: string;
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
	{
		title: "Conferências",
		href: conferencias.index(),
	},
	{
		title: "Nova Conferência",
		href: conferencias.create(),
	},
];

const FORM_FIELDS = [
	{
		name: "fornecedor_id" as const,
		label: "Fornecedor",
		type: "select",
		placeholder: "Selecione um fornecedor",
		required: true,
		helper: undefined,
	},
	{
		name: "periodo" as const,
		label: "Período",
		type: "text",
		placeholder: "Ex: 01/2024",
		required: true,
		helper: "Formato: MM/AAAA",
	},
] as const;

const INFO_CARDS = [
	{
		type: "info" as const,
		title: "Informação",
		content:
			"Os totais (requisições, pedidos manuais e total geral) serão calculados automaticamente com base no fornecedor selecionado no momento da criação da conferência.",
		bgColor: "bg-blue-50 dark:bg-blue-900/20",
		textColor: "text-blue-900 dark:text-blue-100",
		contentColor: "text-blue-700 dark:text-blue-300",
	},
	{
		type: "detailed" as const,
		title: "Conferência Detalhada",
		content:
			"Para adicionar valores manualmente e fazer conferência detalhada, acesse diretamente a conferência por fornecedor.",
		bgColor: "bg-green-50 dark:bg-green-900/20",
		textColor: "text-green-900 dark:text-green-100",
		contentColor: "text-green-700 dark:text-green-300",
		examples: [
			"Janeiro 2024: /conferencias/fornecedor/1/2024-01",
			"Dezembro 2023: /conferencias/fornecedor/2/2023-12",
			"Formato: /conferencias/fornecedor/[ID]/[ANO-MES]",
		],
	},
];

const MESSAGES = {
	noFornecedores: "Nenhum fornecedor disponível",
	maxChars: "Máximo de 1000 caracteres",
	observacoesPlaceholder: "Observações adicionais sobre a conferência...",
} as const;

// Utility Functions
const getInitialFormData = (): FormData => ({
	fornecedor_id: "",
	periodo: "",
	observacoes: "",
});

// Components
interface InputFieldProps {
	field: (typeof FORM_FIELDS)[number];
	value: string;
	onChange: (name: string, value: string) => void;
	error?: string;
	children?: React.ReactNode;
}

function InputField({
	field,
	value,
	onChange,
	error,
	children,
}: InputFieldProps) {
	const handleChange = useMemo(
		() => (newValue: string) => {
			onChange(field.name, newValue);
		},
		[field.name, onChange],
	);

	return (
		<div className="space-y-2">
			<Label htmlFor={field.name}>
				{field.label} {field.required && "*"}
			</Label>
			{field.type === "select" ? (
				<Select
					value={value}
					onValueChange={handleChange}
					required={field.required}
				>
					<SelectTrigger className={error ? "border-red-500" : ""}>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					{children}
				</Select>
			) : (
				<Input
					type={field.type}
					value={value}
					onChange={(e) => handleChange(e.target.value)}
					placeholder={field.placeholder}
					required={field.required}
					className={error ? "border-red-500" : ""}
				/>
			)}
			{error && <p className="text-sm text-red-500">{error}</p>}
			{field.helper && <p className="text-xs text-gray-500">{field.helper}</p>}
		</div>
	);
}

interface FornecedorSelectOptionsProps {
	fornecedores: Fornecedor[];
}

function FornecedorSelectOptions({
	fornecedores,
}: FornecedorSelectOptionsProps) {
	if (!fornecedores || fornecedores.length === 0) {
		return (
			<SelectItem value="no-fornecedor" disabled>
				{MESSAGES.noFornecedores}
			</SelectItem>
		);
	}

	return (
		<SelectContent>
			{fornecedores.map((fornecedor) => (
				<SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
					{fornecedor.razao_social}
				</SelectItem>
			))}
		</SelectContent>
	);
}

interface InfoCardProps {
	card: (typeof INFO_CARDS)[number];
}

function InfoCard({ card }: InfoCardProps) {
	return (
		<div className={`rounded-lg p-4 ${card.bgColor}`}>
			<h4 className={`font-medium ${card.textColor}`}>{card.title}</h4>
			<p className={`text-sm ${card.contentColor}`}>{card.content}</p>
			{card.examples && (
				<>
					<p className="mb-3 text-sm font-medium text-green-600 dark:text-green-400">
						Exemplos de acesso direto:
					</p>
					<div className="space-y-1 text-xs text-green-600 dark:text-green-400">
						{card.examples.map((example) => (
							<p key={example}>
								• {example.split(": ")[0]}:{" "}
								<code className="rounded bg-green-100 px-1 dark:bg-green-800">
									{example.split(": ")[1] || example.split(": ")[0]}
								</code>
							</p>
						))}
					</div>
				</>
			)}
		</div>
	);
}

// Main Component
export default function ConferenciaCreate({ fornecedores }: CreateProps) {
	const { data, setData, post, processing, errors, reset } = useForm<FormData>(
		getInitialFormData(),
	);

	// Event handlers
	const handleFieldChange = useMemo(
		() => (name: string, value: string) => {
			setData(name as keyof FormData, value);
		},
		[setData],
	);

	const handleSubmit = useMemo(
		() => (e: React.FormEvent) => {
			e.preventDefault();
			post(conferencias.index());
		},
		[post],
	);

	const handleObservacoesChange = useMemo(
		() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setData("observacoes", e.target.value);
		},
		[setData],
	);

	const handleReset = useMemo(
		() => () => {
			reset();
		},
		[reset],
	);

	return (
		<AppLayout breadcrumbs={BREADCRUMBS}>
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
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
							Nova Conferência
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Realizar conferência de fornecedor
						</p>
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
							<CardDescription>
								Preencha as informações da conferência. Campos marcados com *
								são obrigatórios.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Form Fields */}
							{FORM_FIELDS.map((field) => (
								<InputField
									key={field.name}
									field={field}
									value={data[field.name]}
									onChange={handleFieldChange}
									error={errors[field.name]}
								>
									{field.name === "fornecedor_id" && (
										<FornecedorSelectOptions fornecedores={fornecedores} />
									)}
								</InputField>
							))}

							<Separator />

							{/* Observações */}
							<div className="space-y-2">
								<Label htmlFor="observacoes">Observações</Label>
								<Textarea
									value={data.observacoes}
									onChange={handleObservacoesChange}
									placeholder={MESSAGES.observacoesPlaceholder}
									rows={4}
									className={errors.observacoes ? "border-red-500" : ""}
								/>
								{errors.observacoes && (
									<p className="text-sm text-red-500">{errors.observacoes}</p>
								)}
								<p className="text-xs text-gray-500">{MESSAGES.maxChars}</p>
							</div>

							{/* Information Cards */}
							<div className="space-y-4">
								{INFO_CARDS.map((card) => (
									<InfoCard key={card.title} card={card} />
								))}
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleReset}
							disabled={processing}
						>
							Limpar
						</Button>
						<Button type="button" variant="outline" asChild>
							<Link href={conferencias.index()}>Cancelar</Link>
						</Button>
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Criar Conferência"}
						</Button>
					</div>
				</form>
			</div>
		</AppLayout>
	);
}
