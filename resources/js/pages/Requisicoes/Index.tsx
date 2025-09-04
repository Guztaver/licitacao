import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { requisicoes } from "@/routes";
import type { BreadcrumbItem, Emitente, Requisicao } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
	CheckCircle,
	Clock,
	DollarSign,
	FileDown,
	FileText,
	Plus,
	Search,
	X,
} from "lucide-react";
import react from "react";

// Constants
const EMPTY_MESSAGES = {
	noRequisitions: "Nenhuma requisição encontrada",
	addFirstRequisition: "Adicionar Requisição",
	noDataWithFilters:
		"Não foram encontradas requisições que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.",
	noConcreteRequisitions:
		"Existem requisições cadastradas, mas nenhuma foi concretizada ainda. Para gerar valor movimentado, concretize algumas requisições autorizadas.",
	noRequisitionsAtAll:
		'Não há requisições no sistema ainda. Clique em "Nova Requisição" para começar.',
	noValue: "Não possui",
	noAuthorized: "Nenhuma autorizada",
	noCompleted: "Nenhuma concretizada",
	noCanceled: "Nenhuma cancelada",
} as const;

const STATUS_OPTIONS = [
	{ value: "", label: "Todos os status" },
	{ value: "autorizada", label: "Autorizada" },
	{ value: "concretizada", label: "Concretizada" },
	{ value: "cancelada", label: "Cancelada" },
] as const;

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Requisições",
		href: requisicoes.index(),
	},
];

// Types
interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface PaginationMeta {
	total: number;
	from: number;
	to: number;
	last_page: number;
	current_page: number;
}

interface RequisicoesStats {
	total_requisicoes: number;
	autorizadas: number;
	concretizadas: number;
	canceladas: number;
	valor_total: number;
}

interface RequisicoesIndexProps {
	requisicoes: {
		data: Requisicao[];
		links: PaginationLink[];
		meta: PaginationMeta;
	};
	emitentes: Emitente[];
	stats: RequisicoesStats;
	filters: {
		search?: string;
		status?: string;
		emitente_id?: string;
		data_inicio?: string;
		data_fim?: string;
	};
}

interface StatCardProps {
	title: string;
	icon: react.ReactNode;
	value: string | number;
	subtitle: string;
}

interface AlertCardProps {
	type: "warning" | "info" | "success" | "neutral";
	title: string;
	message: string;
	action?: react.ReactNode;
}

// Utility Functions
const formatCurrency = (value: number | null): string => {
	if (value === null || value === undefined || value === 0) return "Sem valor";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
};

const displayValue = (value: number, emptyMessage: string): string | number => {
	return value === 0 ? emptyMessage : value;
};

const formatPaginationLabel = (label: string): string => {
	if (label.includes("&laquo;")) return "«";
	if (label.includes("&raquo;")) return "»";
	if (label.includes("&hellip;")) return "...";
	return label;
};

const buildExportUrl = (filters: Record<string, string>): string => {
	const params = new URLSearchParams(filters);
	return `${requisicoes.export()}?${params.toString()}`;
};

// Components
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

const AlertCard = ({ type, title, message, action }: AlertCardProps) => {
	const getColorClasses = () => {
		switch (type) {
			case "warning":
				return {
					bg: "bg-yellow-50 dark:bg-yellow-900/20",
					title: "text-yellow-800 dark:text-yellow-200",
					message: "text-yellow-700 dark:text-yellow-300",
				};
			case "info":
				return {
					bg: "bg-blue-50 dark:bg-blue-900/20",
					title: "text-blue-800 dark:text-blue-200",
					message: "text-blue-700 dark:text-blue-300",
				};
			case "success":
				return {
					bg: "bg-green-50 dark:bg-green-900/20",
					title: "text-green-800 dark:text-green-200",
					message: "text-green-700 dark:text-green-300",
				};
			default:
				return {
					bg: "bg-gray-50 dark:bg-gray-900/20",
					title: "text-gray-800 dark:text-gray-200",
					message: "text-gray-700 dark:text-gray-300",
				};
		}
	};

	const colors = getColorClasses();

	return (
		<div className={`rounded-lg p-4 ${colors.bg}`}>
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<h3 className={`text-sm font-medium ${colors.title}`}>{title}</h3>
					<p className={`mt-2 text-sm ${colors.message}`}>{message}</p>
				</div>
				{action && <div className="ml-4">{action}</div>}
			</div>
		</div>
	);
};

const EmitenteInfo = ({
	emitente,
}: {
	emitente?: { sigla: string; nome: string };
}) => (
	<div className="text-sm">
		{emitente ? (
			<>
				<p className="font-medium">{emitente.sigla}</p>
				<p className="text-gray-500">{emitente.nome}</p>
			</>
		) : (
			<span className="text-gray-400">Sem emitente</span>
		)}
	</div>
);

const StatusBadge = ({
	status,
	statusColor,
}: {
	status: string;
	statusColor?: string;
}) => (
	<Badge
		variant="outline"
		className={statusColor || "border-gray-200 bg-gray-100 text-gray-800"}
	>
		{status}
	</Badge>
);

const EmptyTableRow = () => (
	<TableRow>
		<TableCell colSpan={7} className="py-8 text-center">
			<div className="flex flex-col items-center space-y-2">
				<FileText className="h-8 w-8 text-gray-400" />
				<p className="text-gray-500">{EMPTY_MESSAGES.noRequisitions}</p>
				<Link href={requisicoes.create()}>
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						{EMPTY_MESSAGES.addFirstRequisition}
					</Button>
				</Link>
			</div>
		</TableCell>
	</TableRow>
);

export default function RequisicoesIndex({
	requisicoes: requisicoesPaginated,
	emitentes,
	stats,
	filters,
}: RequisicoesIndexProps) {
	// Safe data with defaults
	const safeData = requisicoesPaginated?.data || [];
	const safeLinks = requisicoesPaginated?.links || [];
	const safeMeta = requisicoesPaginated?.meta || {
		total: 0,
		from: 0,
		to: 0,
		last_page: 1,
		current_page: 1,
	};
	const safeEmitentes = emitentes || [];
	const safeStats = stats || {
		total_requisicoes: 0,
		autorizadas: 0,
		concretizadas: 0,
		canceladas: 0,
		valor_total: 0,
	};

	const { data, setData, get, processing } = useForm({
		search: filters?.search || "",
		status: filters?.status || "",
		emitente_id: filters?.emitente_id || "",
		data_inicio: filters?.data_inicio || "",
		data_fim: filters?.data_fim || "",
	});

	// Handlers
	const handleSearch: react.FormEventHandler = react.useCallback(
		(e) => {
			e.preventDefault();
			get(requisicoes.index(), {
				preserveState: true,
				replace: true,
			});
		},
		[get],
	);

	const handleReset = react.useCallback(() => {
		setData({
			search: "",
			status: "",
			emitente_id: "",
			data_inicio: "",
			data_fim: "",
		});
		get(requisicoes.index(), {
			preserveState: true,
			replace: true,
		});
	}, [setData, get]);

	const handleExport = react.useCallback(() => {
		window.location.href = buildExportUrl(filters as Record<string, string>);
	}, [filters]);

	const handlePaginationClick = react.useCallback((url: string) => {
		router.get(url);
	}, []);

	// Statistics data
	const hasFilters =
		data.search ||
		data.status ||
		data.emitente_id ||
		data.data_inicio ||
		data.data_fim;
	const statisticsData = [
		{
			title: "Total",
			icon: <FileText className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.total_requisicoes, EMPTY_MESSAGES.noValue),
			subtitle: hasFilters
				? "encontradas com filtros"
				: "requisições cadastradas",
		},
		{
			title: "Autorizadas",
			icon: <Clock className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.autorizadas, EMPTY_MESSAGES.noAuthorized),
			subtitle: hasFilters
				? "autorizadas nos resultados"
				: "aguardando processamento",
		},
		{
			title: "Concretizadas",
			icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.concretizadas, EMPTY_MESSAGES.noCompleted),
			subtitle: hasFilters ? "concretizadas nos resultados" : "finalizadas",
		},
		{
			title: "Valor Total",
			icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
			value:
				safeStats.valor_total === 0
					? EMPTY_MESSAGES.noValue
					: formatCurrency(safeStats.valor_total),
			subtitle: hasFilters ? "valor dos resultados" : "valor concretizado",
		},
		{
			title: "Canceladas",
			icon: <X className="h-4 w-4 text-muted-foreground" />,
			value: displayValue(safeStats.canceladas, EMPTY_MESSAGES.noCanceled),
			subtitle: hasFilters
				? "canceladas nos resultados"
				: "canceladas no sistema",
		},
	];

	// Conditional alerts
	const showFiltersAppliedAlert = hasFilters && safeStats.total_requisicoes > 0;
	const showEmptyFiltersAlert = safeStats.total_requisicoes === 0 && hasFilters;
	const showNoConcreteAlert =
		safeStats.total_requisicoes > 0 &&
		safeStats.concretizadas === 0 &&
		!hasFilters;
	const showNoDataAlert = safeStats.total_requisicoes === 0 && !hasFilters;

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Requisições" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Requisições
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Gerencie as requisições do sistema
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="outline" onClick={handleExport}>
							<FileDown className="mr-2 h-4 w-4" />
							Exportar
						</Button>
						<Link href={requisicoes.create()}>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Nova Requisição
							</Button>
						</Link>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{statisticsData.map((stat) => (
						<StatCard key={`stat-${stat.title}`} {...stat} />
					))}
				</div>

				{/* Alert Messages */}
				{showFiltersAppliedAlert && (
					<AlertCard
						type="success"
						title="Filtros aplicados"
						message={`Mostrando ${safeStats.total_requisicoes} requisições que correspondem aos critérios de busca`}
						action={
							<Button variant="outline" size="sm" onClick={handleReset}>
								Limpar Filtros
							</Button>
						}
					/>
				)}

				{showEmptyFiltersAlert && (
					<AlertCard
						type="warning"
						title="Nenhuma requisição encontrada"
						message={EMPTY_MESSAGES.noDataWithFilters}
						action={
							<Button variant="outline" size="sm" onClick={handleReset}>
								Limpar Filtros
							</Button>
						}
					/>
				)}

				{showNoConcreteAlert && (
					<AlertCard
						type="info"
						title="Requisições sem concretização"
						message={`${EMPTY_MESSAGES.noConcreteRequisitions} Existem ${safeStats.total_requisicoes} requisições cadastradas, sendo ${safeStats.autorizadas} autorizadas.`}
					/>
				)}

				{showNoDataAlert && (
					<AlertCard
						type="neutral"
						title="Nenhuma requisição cadastrada"
						message={EMPTY_MESSAGES.noRequisitionsAtAll}
						action={
							<Button asChild>
								<Link href={requisicoes.create()}>
									<Plus className="mr-2 h-4 w-4" />
									Nova Requisição
								</Link>
							</Button>
						}
					/>
				)}

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Filtros</CardTitle>
						<CardDescription>
							Use os filtros abaixo para refinar sua busca
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSearch} className="flex flex-wrap gap-4">
							<div className="min-w-[200px] flex-1">
								<div className="relative">
									<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Buscar por número, solicitante..."
										value={data.search}
										onChange={(e) => setData("search", e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
							<div className="min-w-[150px]">
								<select
									value={data.status}
									onChange={(e) => setData("status", e.target.value)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								>
									{STATUS_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
							<div className="min-w-[150px]">
								<select
									value={data.emitente_id}
									onChange={(e) => setData("emitente_id", e.target.value)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Todos os emitentes</option>
									{safeEmitentes.map((emitente) => (
										<option key={emitente.id} value={emitente.id}>
											{emitente.sigla} - {emitente.nome}
										</option>
									))}
								</select>
							</div>
							<div className="flex gap-2">
								<Input
									type="date"
									placeholder="Data início"
									value={data.data_inicio}
									onChange={(e) => setData("data_inicio", e.target.value)}
								/>
								<Input
									type="date"
									placeholder="Data fim"
									value={data.data_fim}
									onChange={(e) => setData("data_fim", e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<Button type="submit" disabled={processing}>
									<Search className="mr-2 h-4 w-4" />
									Buscar
								</Button>
								<Button type="button" variant="outline" onClick={handleReset}>
									Limpar
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Lista de Requisições</CardTitle>
						<CardDescription>
							Mostrando {safeData.length} de {safeMeta.total} requisições
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Número</TableHead>
										<TableHead>Solicitante</TableHead>
										<TableHead>Emitente</TableHead>
										<TableHead>Data Recebimento</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Valor</TableHead>
										<TableHead>Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{safeData.length > 0 ? (
										safeData.map((requisicao) => (
											<TableRow key={requisicao.id}>
												<TableCell>
													<div>
														<Link
															href={requisicoes.show(requisicao.id)}
															className="font-medium text-blue-600 hover:text-blue-800"
														>
															{requisicao.numero_completo}
														</Link>
														{requisicao.numero_oficio && (
															<p className="text-sm text-gray-500">
																Ofício: {requisicao.numero_oficio}
															</p>
														)}
													</div>
												</TableCell>
												<TableCell>{requisicao.solicitante || "-"}</TableCell>
												<TableCell>
													<EmitenteInfo emitente={requisicao.emitente} />
												</TableCell>
												<TableCell>
													{requisicao.data_recebimento || "-"}
												</TableCell>
												<TableCell>
													<StatusBadge
														status={
															requisicao.status_display || requisicao.status
														}
														statusColor={requisicao.status_color}
													/>
												</TableCell>
												<TableCell>
													{formatCurrency(requisicao.valor_final || null)}
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-2">
														<Link href={requisicoes.show(requisicao.id)}>
															<Button variant="outline" size="sm">
																Ver
															</Button>
														</Link>
														{requisicao.pode_editar && (
															<Link href={requisicoes.edit(requisicao.id)}>
																<Button variant="outline" size="sm">
																	Editar
																</Button>
															</Link>
														)}
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<EmptyTableRow />
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						{safeMeta.last_page > 1 && (
							<div className="flex items-center justify-between px-2 py-4">
								<div className="text-sm text-gray-700">
									Mostrando {safeMeta.from || 0} até {safeMeta.to || 0} de{" "}
									{safeMeta.total} resultados
								</div>
								<div className="flex items-center space-x-2">
									{safeLinks.map((link, index) => (
										<Button
											key={`${link.label}-${index}`}
											variant={link.active ? "default" : "outline"}
											size="sm"
											disabled={!link.url}
											onClick={() =>
												link.url && handlePaginationClick(link.url)
											}
										>
											{formatPaginationLabel(link.label)}
										</Button>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}
