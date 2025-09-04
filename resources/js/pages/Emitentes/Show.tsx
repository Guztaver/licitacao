import { Head, Link, router } from "@inertiajs/react";
import {
	ArrowLeft,
	Building,
	Edit,
	FileText,
	Mail,
	MapPin,
	Phone,
	Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { emitentes } from "@/routes";
import type { BreadcrumbItem, Emitente, Requisicao } from "@/types";

// Types
interface EmitentesShowProps {
	emitente: Emitente & {
		requisicoes?: Requisicao[];
		requisicoes_count: number;
	};
	requisicoes: Requisicao[];
	stats: {
		total_requisicoes: number;
		requisicoes_concretizadas: number;
		valor_total: number;
		requisicoes_mes_atual: number;
	};
}

// Constants
const STATUS_CONFIG = {
	pendente: { label: "Pendente", variant: "secondary" as const },
	aprovado: { label: "Aprovado", variant: "default" as const },
	rejeitado: { label: "Rejeitado", variant: "destructive" as const },
};

const STAT_CARDS = [
	{
		key: "total_requisicoes" as const,
		title: "Requisições totais",
		color: "text-blue-600",
		format: (value: number) => value.toString(),
	},
	{
		key: "requisicoes_concretizadas" as const,
		title: "Concretizadas",
		color: "text-green-600",
		format: (value: number) => value.toString(),
	},
	{
		key: "valor_total" as const,
		title: "Valor total",
		color: "text-purple-600",
		format: (value: number) =>
			new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(value),
	},
	{
		key: "requisicoes_mes_atual" as const,
		title: "Este mês",
		color: "text-amber-600",
		format: (value: number) => value.toString(),
	},
];

const MESSAGES = {
	noValue: "-",
	noRequisicoes: "Nenhuma requisição",
	noRequisicoesDescription:
		"Este emitente ainda não possui requisições registradas.",
} as const;

// Utility Functions
const getBreadcrumbs = (emitente: Emitente): BreadcrumbItem[] => [
	{
		title: "Emitentes",
		href: emitentes.index(),
	},
	{
		title: emitente.nome,
		href: emitentes.show(emitente.id),
	},
];

const getStatusBadge = (status: string) => {
	return (
		STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
			label: status,
			variant: "secondary" as const,
		}
	);
};

const formatCurrency = (value: string | number | null | undefined) => {
	if (!value || Number(value) === 0) return MESSAGES.noValue;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(Number(value));
};

const formatDate = (date: string | null | undefined) => {
	return date || MESSAGES.noValue;
};

// Components
interface InfoFieldProps {
	label: string;
	value: string | undefined | null;
	icon?: React.ComponentType<{ className?: string }>;
	fallback?: string;
}

function InfoField({
	label,
	value,
	icon: Icon,
	fallback = MESSAGES.noValue,
}: InfoFieldProps) {
	return (
		<div>
			<h3
				className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${Icon ? "flex items-center" : ""}`}
			>
				{Icon && <Icon className="mr-1 h-4 w-4" />}
				{label}
			</h3>
			<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
				{value || fallback}
			</p>
		</div>
	);
}

interface StatCardProps {
	title: string;
	value: number;
	color: string;
	formatter: (value: number) => string;
}

function StatCard({ title, value, color, formatter }: StatCardProps) {
	return (
		<div className="text-center">
			<div className={`text-2xl font-bold ${color}`}>{formatter(value)}</div>
			<div className="text-sm text-gray-500">{title}</div>
		</div>
	);
}

interface RequisicoesTableProps {
	requisicoes: Requisicao[];
	totalCount: number;
	emitenteId: number;
}

function RequisicoesTable({
	requisicoes,
	totalCount,
	emitenteId,
}: RequisicoesTableProps) {
	if (!requisicoes || requisicoes.length === 0) {
		return (
			<div className="py-8 text-center">
				<FileText className="mx-auto h-12 w-12 text-gray-400" />
				<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
					{MESSAGES.noRequisicoes}
				</h3>
				<p className="mt-1 text-sm text-gray-500">
					{MESSAGES.noRequisicoesDescription}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Número</TableHead>
							<TableHead>Solicitante</TableHead>
							<TableHead>Data</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Valor</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{requisicoes.slice(0, 10).map((requisicao) => {
							const statusConfig = getStatusBadge(requisicao.status);
							return (
								<TableRow key={requisicao.id}>
									<TableCell>
										<div className="font-medium text-blue-600">
											{requisicao.numero_completo}
										</div>
									</TableCell>
									<TableCell>{requisicao.solicitante}</TableCell>
									<TableCell>
										{formatDate(requisicao.data_recebimento)}
									</TableCell>
									<TableCell>
										<Badge
											variant={statusConfig.variant}
											className={
												requisicao.status_color
													? `bg-${requisicao.status_color}-100 text-${requisicao.status_color}-800 border-${requisicao.status_color}-200`
													: ""
											}
										>
											{requisicao.status_display}
										</Badge>
									</TableCell>
									<TableCell>
										{formatCurrency(requisicao.valor_final)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			{totalCount > 10 && (
				<div className="text-center">
					<Link href={`/requisicoes?emitente_id=${emitenteId}`}>
						<Button variant="outline" size="sm">
							Ver todas as requisições ({totalCount})
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}

interface ActionButtonProps {
	href?: string;
	onClick?: () => void;
	variant?: "default" | "outline" | "destructive";
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}

function ActionButton({
	href,
	onClick,
	variant = "outline",
	icon: Icon,
	children,
}: ActionButtonProps) {
	const buttonContent = (
		<Button
			variant={variant}
			className="w-full justify-start"
			onClick={onClick}
		>
			<Icon className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{buttonContent}
			</Link>
		);
	}

	return buttonContent;
}

// Main Component
export default function EmitentesShow({
	emitente,
	requisicoes,
	stats,
}: EmitentesShowProps) {
	const breadcrumbs = useMemo(() => getBreadcrumbs(emitente), [emitente]);

	const handleDelete = useMemo(
		() => () => {
			if (confirm("Tem certeza que deseja excluir este emitente?")) {
				router.delete(emitentes.show(emitente.id));
			}
		},
		[emitente.id],
	);

	const safeStats = useMemo(
		() => ({
			total_requisicoes: stats?.total_requisicoes || 0,
			requisicoes_concretizadas: stats?.requisicoes_concretizadas || 0,
			valor_total: stats?.valor_total || 0,
			requisicoes_mes_atual: stats?.requisicoes_mes_atual || 0,
		}),
		[stats],
	);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Emitente: ${emitente.nome}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{emitente.nome}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Detalhes do órgão emitente
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Link href={emitentes.index()}>
							<Button variant="outline">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Voltar
							</Button>
						</Link>
						<Link href={emitentes.edit(emitente.id)}>
							<Button variant="outline">
								<Edit className="mr-2 h-4 w-4" />
								Editar
							</Button>
						</Link>
						<Button variant="destructive" onClick={handleDelete}>
							<Trash2 className="mr-2 h-4 w-4" />
							Excluir
						</Button>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Informações do Emitente */}
					<div className="space-y-6 lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Building className="mr-2 h-5 w-5" />
									Informações do Emitente
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Basic Info */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<InfoField label="Nome" value={emitente.nome} />
									<InfoField label="Sigla" value={emitente.sigla} />
								</div>

								{/* Address */}
								{emitente.endereco && (
									<InfoField
										label="Endereço"
										value={emitente.endereco}
										icon={MapPin}
									/>
								)}

								{/* Contact Info */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{emitente.telefone && (
										<InfoField
											label="Telefone"
											value={emitente.telefone}
											icon={Phone}
										/>
									)}
									{emitente.email && (
										<InfoField
											label="E-mail"
											value={emitente.email}
											icon={Mail}
										/>
									)}
								</div>

								{/* Observations */}
								{emitente.observacoes && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Observações
										</h3>
										<p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
											{emitente.observacoes}
										</p>
									</div>
								)}

								{/* Timestamps */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<InfoField label="Criado em" value={emitente.created_at} />
									<InfoField
										label="Última atualização"
										value={emitente.updated_at}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Requisições */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<FileText className="mr-2 h-5 w-5" />
									Requisições ({safeStats.total_requisicoes})
								</CardTitle>
								<CardDescription>
									{safeStats.total_requisicoes > 0
										? "Últimas requisições emitidas por este órgão"
										: "Nenhuma requisição encontrada para este órgão"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<RequisicoesTable
									requisicoes={requisicoes}
									totalCount={safeStats.total_requisicoes}
									emitenteId={emitente.id}
								/>
							</CardContent>
						</Card>
					</div>

					{/* Estatísticas */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Estatísticas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{STAT_CARDS.map(({ key, title, color, format }, index) => (
									<div key={key}>
										<StatCard
											title={title}
											value={safeStats[key]}
											color={color}
											formatter={format}
										/>
										{index < STAT_CARDS.length - 1 && (
											<div className="border-t pt-4" />
										)}
									</div>
								))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Ações</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<ActionButton href={emitentes.edit(emitente.id)} icon={Edit}>
									Editar emitente
								</ActionButton>
								<ActionButton
									href={`/requisicoes?emitente_id=${emitente.id}`}
									icon={FileText}
								>
									Ver requisições
								</ActionButton>
								<ActionButton
									onClick={handleDelete}
									variant="destructive"
									icon={Trash2}
								>
									Excluir emitente
								</ActionButton>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
