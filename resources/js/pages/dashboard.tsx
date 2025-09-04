import { Head, Link, router } from "@inertiajs/react";
import {
	ArrowRight,
	Building,
	Calendar,
	CheckSquare,
	DollarSign,
	FileText,
	TrendingUp,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";
import CreateFornecedorModal from "@/components/modals/CreateFornecedorModal";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { conferencias, dashboard, fornecedores, requisicoes } from "@/routes";
import type {
	BreadcrumbItem,
	Conferencia,
	DashboardStats,
	Fornecedor,
	Requisicao,
} from "@/types";

// Constants
const STATUS_COLORS = {
	autorizada: "bg-blue-100 text-blue-900 border-blue-200",
	concretizada: "bg-green-100 text-green-800 border-green-200",
	cancelada: "bg-yellow-100 text-yellow-800 border-yellow-200",
	excluida: "bg-red-100 text-red-800 border-red-200",
	default: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

const EMPTY_MESSAGES = {
	noValue: "Não possui",
	noActive: "Nenhum ativo",
	noPending: "Nenhuma pendente",
	noCompleted: "Nenhuma concretizada",
	noConferences: "Nenhuma conferência",
	noRequests: "Sem req. este mês",
	noMovement: "Sem movimentação",
	noRequisitions: "Nenhuma requisição encontrada",
	noSuppliers: "Nenhum fornecedor ativo encontrado",
	noConferencesFound: "Nenhuma conferência encontrada",
} as const;

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Dashboard",
		href: dashboard(),
	},
];

interface DashboardProps {
	stats: DashboardStats;
	recent_requisicoes: Requisicao[];
	fornecedores_ativos: Fornecedor[];
	conferencias_recentes: Conferencia[];
}

// Utility Functions
const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};

const getStatusColor = (status: string): string => {
	return (
		STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
	);
};

const displayValue = (value: number, emptyMessage: string): string | number => {
	return value === 0 ? emptyMessage : value;
};

const displayCount = (
	count: number,
	singular: string,
	plural: string,
	emptyMessage: string,
): string => {
	if (count === 0) return emptyMessage;
	return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
};

const displayCurrency = (value: number, emptyMessage: string): string => {
	return value === 0 ? emptyMessage : formatCurrency(value);
};

// Components
interface StatCardProps {
	title: string;
	icon: ReactNode;
	value: number | string;
	subtitle: string;
}

const StatCard = ({ title, icon, value, subtitle }: StatCardProps) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			{icon}
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{value}</div>
			<p className="text-xs text-muted-foreground">{subtitle}</p>
		</CardContent>
	</Card>
);

interface SectionHeaderProps {
	title: string;
	description: string;
	linkHref: string;
	linkText: string;
}

const SectionHeader = ({
	title,
	description,
	linkHref,
	linkText,
}: SectionHeaderProps) => (
	<CardHeader className="flex flex-row items-center justify-between">
		<div>
			<CardTitle className="text-lg">{title}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</div>
		<Link
			href={linkHref}
			className="inline-flex items-center text-sm text-blue-900 hover:text-blue-900"
		>
			{linkText}
			<ArrowRight className="ml-1 h-4 w-4" />
		</Link>
	</CardHeader>
);

interface QuickActionProps {
	href?: string;
	onClick?: () => void;
	icon: ReactNode;
	title: string;
	description: string;
	trigger?: ReactNode;
}

const QuickAction = ({
	href,
	onClick,
	icon,
	title,
	description,
	trigger,
}: QuickActionProps) => {
	const content = (
		<div className="flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50">
			{icon}
			<div className="ml-3">
				<p className="font-medium">{title}</p>
				<p className="text-sm text-gray-600">{description}</p>
			</div>
		</div>
	);

	if (trigger) {
		return <div>{trigger}</div>;
	}

	if (href) {
		return <Link href={href}>{content}</Link>;
	}

	return (
		<button type="button" onClick={onClick} className="w-full text-left">
			{content}
		</button>
	);
};

export default function Dashboard({
	stats,
	recent_requisicoes,
	fornecedores_ativos,
	conferencias_recentes,
}: DashboardProps) {
	// Safe data with defaults
	const safeStats = stats || {
		total_fornecedores: 0,
		fornecedores_ativos: 0,
		total_requisicoes: 0,
		requisicoes_pendentes: 0,
		requisicoes_concretizadas: 0,
		valor_total_requisicoes: 0,
		requisicoes_mes_atual: 0,
		conferencias_mes_atual: 0,
		periodo: 0,
	};

	const safeRecentRequisicoes = recent_requisicoes || [];
	const safeFornecedoresAtivos = fornecedores_ativos || [];
	const safeConferenciasRecentes = conferencias_recentes || [];

	// Statistics data
	const statisticsData = [
		{
			id: "fornecedores",
			title: "Fornecedores",
			icon: <Users className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.total_fornecedores, EMPTY_MESSAGES.noValue),
			subtitle: displayCount(
				safeStats.fornecedores_ativos,
				"ativo",
				"ativos",
				EMPTY_MESSAGES.noActive,
			),
		},
		{
			id: "requisicoes",
			title: "Requisições",
			icon: <FileText className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.total_requisicoes, EMPTY_MESSAGES.noValue),
			subtitle: displayCount(
				safeStats.requisicoes_pendentes,
				"pendente",
				"pendentes",
				EMPTY_MESSAGES.noPending,
			),
		},
		{
			id: "valor-total",
			title: "Valor Total",
			icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
			value: displayCurrency(
				safeStats.valor_total_requisicoes,
				EMPTY_MESSAGES.noValue,
			),
			subtitle: displayCount(
				safeStats.requisicoes_concretizadas,
				"concretizada",
				"concretizadas",
				EMPTY_MESSAGES.noCompleted,
			),
		},
		{
			id: "este-mes",
			title: "Este Mês",
			icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(
				safeStats.requisicoes_mes_atual,
				EMPTY_MESSAGES.noValue,
			),
			subtitle: displayCount(
				safeStats.conferencias_mes_atual,
				"conferência",
				"conferências",
				EMPTY_MESSAGES.noConferences,
			),
		},
	];

	// Quick actions data
	const quickActions = [
		{
			id: "nova-requisicao",
			href: requisicoes.create(),
			icon: <FileText className="h-5 w-5 text-blue-900" />,
			title: "Nova Requisição",
			description: "Criar nova requisição",
		},
		{
			id: "novo-fornecedor",
			icon: <Building className="h-5 w-5 text-green-600" />,
			title: "Novo Fornecedor",
			description: "Cadastrar fornecedor",
			isModal: true,
		},
		{
			id: "nova-conferencia",
			href: conferencias.create(),
			icon: <CheckSquare className="h-5 w-5 text-purple-600" />,
			title: "Nova Conferência",
			description: "Iniciar conferência",
		},
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Dashboard" />
			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Dashboard
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Visão geral do sistema de licitações
						</p>
					</div>
				</div>

				{/* Statistics Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{statisticsData.map((stat) => (
						<StatCard key={stat.id} {...stat} />
					))}
				</div>

				{/* Main Content Grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Recent Requisições */}
					<Card>
						<SectionHeader
							title="Requisições Recentes"
							description="Últimas requisições adicionadas ao sistema"
							linkHref={requisicoes.index()}
							linkText="Ver todas"
						/>
						<CardContent>
							<div className="space-y-4">
								{safeRecentRequisicoes.length > 0 ? (
									safeRecentRequisicoes.map((requisicao) => (
										<div
											key={requisicao.id}
											className="flex items-center justify-between border-b pb-3 last:border-b-0"
										>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<Link
														href={requisicoes.show(requisicao.id)}
														className="font-medium text-blue-900 hover:text-blue-900"
													>
														{requisicao.numero_completo}
													</Link>
													<span
														className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(requisicao.status)}`}
													>
														{requisicao.status_display}
													</span>
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{requisicao.solicitante}
												</p>
												<p className="text-xs text-gray-500">
													{requisicao.emitente?.sigla} •{" "}
													{requisicao.data_recebimento}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="py-4 text-center text-gray-500">
										{EMPTY_MESSAGES.noRequisitions}
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Active Fornecedores */}
					<Card>
						<SectionHeader
							title="Fornecedores Ativos"
							description="Fornecedores com maior atividade recente"
							linkHref={fornecedores.index()}
							linkText="Ver todos"
						/>
						<CardContent>
							<div className="space-y-4">
								{safeFornecedoresAtivos.length > 0 ? (
									safeFornecedoresAtivos.map((fornecedor) => (
										<div
											key={fornecedor.id}
											className="flex items-center justify-between border-b pb-3 last:border-b-0"
										>
											<div className="flex-1">
												<Link
													href={fornecedores.show(fornecedor.id)}
													className="font-medium text-blue-900 hover:text-blue-900"
												>
													{fornecedor.razao_social}
												</Link>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{fornecedor.cnpj_formatado}
												</p>
												<div className="mt-1 flex items-center space-x-4">
													<span className="text-xs text-gray-500">
														{displayCount(
															fornecedor.requisicoes_mes_atual || 0,
															"req. este mês",
															"req. este mês",
															EMPTY_MESSAGES.noRequests,
														)}
													</span>
													<span className="text-xs text-gray-500">
														{displayCurrency(
															fornecedor.total_geral || 0,
															EMPTY_MESSAGES.noMovement,
														)}{" "}
														total
													</span>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="py-4 text-center text-gray-500">
										{EMPTY_MESSAGES.noSuppliers}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions & Conferências */}
				<div className="grid gap-6 md:grid-cols-3">
					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Ações Rápidas</CardTitle>
							<CardDescription>
								Acesso rápido às principais funcionalidades
							</CardDescription>
						</CardHeader>
						<CardContent>
							{quickActions.map((action, index) => {
								const isLast = index === quickActions.length - 1;
								const marginClass = isLast ? "" : "mb-3";

								if (action.isModal) {
									return (
										<div key={action.id} className={marginClass}>
											<CreateFornecedorModal
												trigger={
													<div className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50">
														{action.icon}
														<div className="ml-3">
															<p className="font-medium">{action.title}</p>
															<p className="text-sm text-gray-600">
																{action.description}
															</p>
														</div>
													</div>
												}
												onSuccess={() => router.reload()}
											/>
										</div>
									);
								}

								return (
									<div key={action.id} className={marginClass}>
										<QuickAction
											href={action.href}
											icon={action.icon}
											title={action.title}
											description={action.description}
										/>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Recent Conferências */}
					<Card className="md:col-span-2">
						<SectionHeader
							title="Conferências Recentes"
							description="Últimas conferências realizadas"
							linkHref={conferencias.index()}
							linkText="Ver todas"
						/>
						<CardContent>
							<div className="space-y-4">
								{safeConferenciasRecentes.length > 0 ? (
									safeConferenciasRecentes.map((conferencia) => (
										<div
											key={conferencia.id}
											className="flex items-center justify-between border-b pb-3 last:border-b-0"
										>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<Calendar className="h-4 w-4 text-gray-400" />
													<span className="font-medium">
														Período:{" "}
														<span className="text-sm font-thin">
															{conferencia.periodo}
														</span>
													</span>
												</div>
												<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
													{conferencia.fornecedor?.razao_social}
												</p>
												<div className="mt-1 flex items-center space-x-4">
													<span className="text-xs text-gray-500">
														{displayCurrency(
															conferencia.total_geral,
															EMPTY_MESSAGES.noMovement,
														)}
													</span>
													<span className="text-xs text-gray-500">
														{conferencia.data_conferencia}
													</span>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="py-4 text-center text-gray-500">
										{EMPTY_MESSAGES.noConferencesFound}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AppLayout>
	);
}
