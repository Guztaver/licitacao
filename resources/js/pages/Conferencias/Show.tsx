import { Head, Link, router } from "@inertiajs/react";
import {
	ArrowLeft,
	Building2,
	Calendar,
	DollarSign,
	FileText,
	Trash2,
	User,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { conferencias } from "@/routes";
import type { BreadcrumbItem, Fornecedor } from "@/types";

// Types
interface ShowConferencia {
	id: number;
	periodo_inicio: string;
	periodo_fim: string;
	periodo_display: string;
	total_requisicoes: number;
	total_pedidos_manuais: number;
	total_geral: number;
	status: "em_andamento" | "finalizada";
	status_display: string;
	status_color: string;
	observacoes?: string;
	created_at: string;
	updated_at: string;
}

interface ConferenciaShowProps {
	conferencia: ShowConferencia;
	fornecedor: Pick<
		Fornecedor,
		| "id"
		| "razao_social"
		| "cnpj"
		| "cnpj_formatado"
		| "telefone"
		| "telefone_formatado"
		| "email"
		| "endereco_completo"
	> | null;
}

// Constants
const BASE_BREADCRUMBS: BreadcrumbItem[] = [
	{
		title: "Conferências",
		href: conferencias.index(),
	},
];

const SUMMARY_CONFIG = [
	{
		key: "total_requisicoes" as const,
		title: "Total Requisições",
		color: "bg-blue-50 dark:bg-blue-900/20",
		textColor: "text-blue-800 dark:text-blue-400",
		valueColor: "text-blue-900 dark:text-blue-100",
	},
	{
		key: "total_pedidos_manuais" as const,
		title: "Total Pedidos Manuais",
		color: "bg-green-50 dark:bg-green-900/20",
		textColor: "text-green-600 dark:text-green-400",
		valueColor: "text-green-900 dark:text-green-100",
	},
	{
		key: "total_geral" as const,
		title: "Total Geral",
		color: "bg-purple-50 dark:bg-purple-900/20",
		textColor: "text-purple-600 dark:text-purple-400",
		valueColor: "text-purple-900 dark:text-purple-100",
	},
];

const FORNECEDOR_FIELDS = [
	{
		key: "razao_social" as const,
		label: "Razão Social",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
		isBold: true,
	},
	{
		key: "cnpj_formatado" as const,
		label: "CNPJ",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
		isMonospace: true,
	},
	{
		key: "telefone_formatado" as const,
		label: "Telefone",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
	},
	{
		key: "email" as const,
		label: "Email",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
	},
	{
		key: "endereco_completo" as const,
		label: "Endereço",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
	},
];

const SYSTEM_FIELDS = [
	{
		key: "created_at" as const,
		label: "Data de Criação",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
	},
	{
		key: "updated_at" as const,
		label: "Última Atualização",
		format: (value: string | number | null | undefined) =>
			value?.toString() || MESSAGES.noValue,
	},
	{
		key: "id" as const,
		label: "ID da Conferência",
		format: (value: string | number | null | undefined) => `#${value}`,
		isMonospace: true,
	},
];

const MESSAGES = {
	noValue: "-",
} as const;

// Utility Functions
const getBreadcrumbs = (conferencia: ShowConferencia): BreadcrumbItem[] => [
	...BASE_BREADCRUMBS,
	{
		title: `Conferência #${conferencia.id}`,
		href: conferencias.show(conferencia.id),
	},
];

const formatCurrency = (value: number): string => {
	if (!value || value === 0) return MESSAGES.noValue;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};

// Components
interface InfoFieldProps {
	label: string;
	value: string | number | undefined | null;
	format?: (value: string | number | null | undefined) => string;
	isBold?: boolean;
	isMonospace?: boolean;
}

function InfoField({
	label,
	value,
	format = (v: string | number | null | undefined) =>
		v?.toString() || MESSAGES.noValue,
	isBold = false,
	isMonospace = false,
}: InfoFieldProps) {
	if (!value) return null;

	const formattedValue = format(value);
	const valueClasses = `text-sm ${isBold ? "font-semibold" : ""} ${
		isMonospace ? "font-mono" : ""
	}`;

	return (
		<div>
			<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
				{label}
			</p>
			<p className={valueClasses}>{formattedValue}</p>
		</div>
	);
}

interface FinancialSummaryProps {
	conferencia: ShowConferencia;
}

function FinancialSummary({ conferencia }: FinancialSummaryProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<DollarSign className="mr-2 h-5 w-5" />
					Resumo Financeiro
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 md:grid-cols-3">
					{SUMMARY_CONFIG.map(
						({ key, title, color, textColor, valueColor }) => (
							<div key={key} className={`rounded-lg p-4 ${color}`}>
								<p className={`text-sm font-medium ${textColor}`}>{title}</p>
								<p className={`text-2xl font-bold ${valueColor}`}>
									{formatCurrency(conferencia[key])}
								</p>
							</div>
						),
					)}
				</div>
			</CardContent>
		</Card>
	);
}

interface PeriodInfoProps {
	conferencia: ShowConferencia;
}

function PeriodInfo({ conferencia }: PeriodInfoProps) {
	const periodFields = [
		{
			label: "Período Início",
			value: conferencia.periodo_inicio,
		},
		{
			label: "Período Fim",
			value: conferencia.periodo_fim,
		},
		{
			label: "Período Completo",
			value: conferencia.periodo_display,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Calendar className="mr-2 h-5 w-5" />
					Informações do Período
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					{periodFields.slice(0, 2).map((field) => (
						<div key={field.label}>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								{field.label}
							</p>
							<p className="text-lg font-semibold">{field.value}</p>
						</div>
					))}
				</div>
				<div>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{periodFields[2].label}
					</p>
					<p className="text-lg font-semibold">{periodFields[2].value}</p>
				</div>
			</CardContent>
		</Card>
	);
}

interface ObservationsCardProps {
	observacoes: string;
}

function ObservationsCard({ observacoes }: ObservationsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<FileText className="mr-2 h-5 w-5" />
					Observações
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
					{observacoes}
				</p>
			</CardContent>
		</Card>
	);
}

interface FornecedorCardProps {
	fornecedor: NonNullable<ConferenciaShowProps["fornecedor"]>;
}

function FornecedorCard({ fornecedor }: FornecedorCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Building2 className="mr-2 h-5 w-5" />
					Fornecedor
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{FORNECEDOR_FIELDS.map(
					({ key, label, format, isBold, isMonospace }) => (
						<InfoField
							key={key}
							label={label}
							value={fornecedor[key]}
							format={format}
							isBold={isBold}
							isMonospace={isMonospace}
						/>
					),
				)}

				<Separator />

				<Button variant="outline" size="sm" asChild className="w-full">
					<Link href={`/fornecedores/${fornecedor.id}`}>Ver Fornecedor</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

interface SystemInfoCardProps {
	conferencia: ShowConferencia;
}

function SystemInfoCard({ conferencia }: SystemInfoCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<User className="mr-2 h-5 w-5" />
					Informações do Sistema
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{SYSTEM_FIELDS.map(({ key, label, format, isMonospace }) => (
					<InfoField
						key={key}
						label={label}
						value={conferencia[key]}
						format={format}
						isMonospace={isMonospace}
					/>
				))}
			</CardContent>
		</Card>
	);
}

// Main Component
export default function ConferenciaShow({
	conferencia,
	fornecedor,
}: ConferenciaShowProps) {
	const breadcrumbs = useMemo(() => getBreadcrumbs(conferencia), [conferencia]);

	const handleDelete = useMemo(
		() => () => {
			if (confirm("Tem certeza que deseja excluir esta conferência?")) {
				router.delete(conferencias.destroy(conferencia.id));
			}
		},
		[conferencia.id],
	);

	const canDelete = useMemo(
		() => conferencia.status === "em_andamento",
		[conferencia.status],
	);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Conferência #${conferencia.id}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="outline" size="icon" asChild>
							<Link href={conferencias.index()}>
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div>
							<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
								Conferência #{conferencia.id}
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								{conferencia.periodo_display} • {fornecedor?.razao_social}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{canDelete && (
							<Button variant="destructive" onClick={handleDelete}>
								<Trash2 className="mr-2 h-4 w-4" />
								Excluir
							</Button>
						)}
					</div>
				</div>

				{/* Status Badge */}
				<div>
					<Badge className={conferencia.status_color}>
						{conferencia.status_display}
					</Badge>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Information */}
					<div className="space-y-6 lg:col-span-2">
						{/* Period Information */}
						<PeriodInfo conferencia={conferencia} />

						{/* Financial Summary */}
						<FinancialSummary conferencia={conferencia} />

						{/* Observations */}
						{conferencia.observacoes && (
							<ObservationsCard observacoes={conferencia.observacoes} />
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Fornecedor Information */}
						{fornecedor && <FornecedorCard fornecedor={fornecedor} />}

						{/* System Information */}
						<SystemInfoCard conferencia={conferencia} />
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
