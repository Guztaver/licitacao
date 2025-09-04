import { Head, Link, useForm } from "@inertiajs/react";
import {
	ArrowLeft,
	BarChart3,
	Calendar,
	DollarSign,
	Download,
	FileText,
	Filter,
	Search,
} from "lucide-react";
import { type FormEventHandler, useId } from "react";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem, Emitente, Fornecedor, Requisicao } from "@/types";
import { formatters, reportUtils } from "@/utils/relatorios/formatters";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Relatórios",
		href: "/relatorios",
	},
	{
		title: "Requisições",
		href: "/relatorios/requisicoes",
	},
];

interface RequisicaoExtended extends Omit<Requisicao, "emitente"> {
	emitente?: Pick<Emitente, "nome" | "sigla">;
	destinatario?: { nome: string };
	fornecedor?: Pick<Fornecedor, "razao_social">;
}

interface RequisicoesStats {
	total_requisicoes: number;
	valor_total: number;
	requisicoes_por_status: Record<string, number>;
	valor_por_emitente: Record<string, number>;
	valor_por_fornecedor: Record<string, number>;
}

interface RelatorioRequisicoesProps {
	requisicoes: RequisicaoExtended[];
	stats: RequisicoesStats;
	filters: {
		data_inicio?: string;
		data_fim?: string;
		status?: string;
		emitente_id?: string;
		fornecedor_id?: string;
	};
	emitentes?: Pick<Emitente, "id" | "nome" | "sigla">[];
	fornecedores?: Pick<Fornecedor, "id" | "razao_social">[];
}

// Component for Statistics Cards
const StatisticsCards = ({ stats }: { stats: RequisicoesStats }) => (
	<div className="grid gap-4 md:grid-cols-4">
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Total de Requisições
				</CardTitle>
				<FileText className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{formatters.number(stats.total_requisicoes, "Nenhuma requisição")}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.total_requisicoes === 0
						? "Nenhuma requisição no período"
						: "requisições no período"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
				<DollarSign className="h-4 w-4 text-gray-600" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-gray-600">
					{formatters.currency(stats.valor_total, "Sem valor movimentado")}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.valor_total === 0
						? "Nenhum valor foi concretizado"
						: "requisições concretizadas"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Concretizadas</CardTitle>
				<BarChart3 className="h-4 w-4 text-gray-800" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-gray-800">
					{formatters.number(
						stats.requisicoes_por_status.concretizada || 0,
						"Nenhuma concretizada",
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{(stats.requisicoes_por_status.concretizada || 0) === 0
						? "Nenhuma requisição finalizada"
						: "finalizadas com sucesso"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
				<Calendar className="h-4 w-4 text-gray-600" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-gray-600">
					{formatters.number(
						stats.requisicoes_por_status.pendente || 0,
						"Nenhuma pendente",
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{(stats.requisicoes_por_status.pendente || 0) === 0
						? "Todas as requisições foram processadas"
						: "aguardando processamento"}
				</p>
			</CardContent>
		</Card>
	</div>
);

// Component for Filters Card
const FiltersCard = ({
	data,
	setData,
	processing,
	emitentes,
	fornecedores,
	onFilter,
	onReset,
}: {
	data: {
		data_inicio: string;
		data_fim: string;
		status: string;
		emitente_id: string;
		fornecedor_id: string;
	};
	setData: (field: string, value: string) => void;
	processing: boolean;
	emitentes: Pick<Emitente, "id" | "nome" | "sigla">[];
	fornecedores: Pick<Fornecedor, "id" | "razao_social">[];
	onFilter: FormEventHandler;
	onReset: () => void;
}) => {
	const dataInicioId = useId();
	const dataFimId = useId();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Filter className="mr-2 h-5 w-5" />
					Filtros
				</CardTitle>
				<CardDescription>
					Use os filtros para refinar o relatório de requisições
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onFilter} className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
						<div className="space-y-2">
							<Label htmlFor={dataInicioId}>Data Início</Label>
							<Input
								id={dataInicioId}
								type="date"
								value={data.data_inicio}
								onChange={(e) => setData("data_inicio", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={dataFimId}>Data Fim</Label>
							<Input
								id={dataFimId}
								type="date"
								value={data.data_fim}
								onChange={(e) => setData("data_fim", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={data.status}
								onValueChange={(value) => setData("status", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todos" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Todos os status</SelectItem>
									<SelectItem value="pendente">Pendente</SelectItem>
									<SelectItem value="autorizada">Autorizada</SelectItem>
									<SelectItem value="concretizada">Concretizada</SelectItem>
									<SelectItem value="cancelada">Cancelada</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="emitente_id">Emitente</Label>
							<Select
								value={data.emitente_id}
								onValueChange={(value) => setData("emitente_id", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todos" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Todos os emitentes</SelectItem>
									{emitentes.map((emitente) => (
										<SelectItem
											key={emitente.id}
											value={emitente.id.toString()}
										>
											{emitente.nome} ({emitente.sigla})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="fornecedor_id">Fornecedor</Label>
							<Select
								value={data.fornecedor_id}
								onValueChange={(value) => setData("fornecedor_id", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todos" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Todos os fornecedores</SelectItem>
									{fornecedores.map((fornecedor) => (
										<SelectItem
											key={fornecedor.id}
											value={fornecedor.id.toString()}
										>
											{fornecedor.razao_social}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onReset}>
							Limpar
						</Button>
						<Button type="submit" disabled={processing}>
							<Search className="mr-2 h-4 w-4" />
							Filtrar
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

// Component for Status Badge
const StatusBadge = ({ status }: { status: string }) => {
	const config = reportUtils.getStatusConfig(status);
	return (
		<Badge variant="outline" className={config.className}>
			{config.label}
		</Badge>
	);
};

// Component for Requisicao Table Row
const RequisicaoTableRow = ({
	requisicao,
}: {
	requisicao: RequisicaoExtended;
}) => (
	<TableRow key={requisicao.id}>
		<TableCell className="font-medium">{requisicao.numero_completo}</TableCell>
		<TableCell>
			{requisicao.solicitante || (
				<span className="text-gray-400 italic">Solicitante não informado</span>
			)}
		</TableCell>
		<TableCell>
			{requisicao.emitente ? (
				<div>
					<div className="font-medium">{requisicao.emitente.nome}</div>
					<div className="text-sm text-gray-500">
						{requisicao.emitente.sigla}
					</div>
				</div>
			) : (
				<span className="text-gray-400 italic">Emitente não informado</span>
			)}
		</TableCell>
		<TableCell>{formatters.date(requisicao.data_recebimento)}</TableCell>
		<TableCell>
			<StatusBadge status={requisicao.status} />
		</TableCell>
		<TableCell>
			{requisicao.fornecedor ? (
				<div className="font-medium">
					{formatters.truncateText(requisicao.fornecedor.razao_social, 40)}
				</div>
			) : (
				<span className="text-gray-400 italic">Fornecedor não definido</span>
			)}
		</TableCell>
		<TableCell className="text-right">
			{requisicao.valor_final ? (
				<span className="font-medium text-green-600">
					{formatters.currency(requisicao.valor_final)}
				</span>
			) : (
				<span className="text-gray-400 italic text-sm">Valor não definido</span>
			)}
		</TableCell>
	</TableRow>
);

// Component for Results Table
const ResultsTable = ({
	requisicoes,
	stats,
	hasFilters,
}: {
	requisicoes: RequisicaoExtended[];
	stats: RequisicoesStats;
	hasFilters: boolean;
}) => (
	<Card>
		<CardHeader>
			<CardTitle>Requisições Encontradas</CardTitle>
			<CardDescription>
				{formatters.number(stats.total_requisicoes, "Nenhuma requisição")}{" "}
				encontradas (ordenadas por data de recebimento)
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
							<TableHead>Fornecedor</TableHead>
							<TableHead className="text-right">Valor</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{requisicoes.length > 0 ? (
							requisicoes.map((requisicao) => (
								<RequisicaoTableRow
									key={requisicao.id}
									requisicao={requisicao}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center">
									<FileText className="mx-auto h-8 w-8 text-gray-400" />
									<p className="mt-2 text-gray-500">
										{reportUtils.getEmptyStateMessage(
											"requisicoes",
											hasFilters,
										)}
									</p>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</CardContent>
	</Card>
);

// Component for Summary Cards
const SummaryCards = ({ stats }: { stats: RequisicoesStats }) => {
	const hasStatusData = Object.keys(stats.requisicoes_por_status).length > 0;
	const hasEmitenteData = Object.keys(stats.valor_por_emitente).length > 0;

	if (!hasStatusData && !hasEmitenteData) {
		return null;
	}

	const topEmitentes = reportUtils.getTopEntries(
		stats.valor_por_emitente,
		(value) => Number(value),
		5,
	);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{hasStatusData && (
				<Card>
					<CardHeader>
						<CardTitle>Resumo por Status</CardTitle>
						<CardDescription>
							Distribuição das requisições por status atual
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(stats.requisicoes_por_status).length > 0 ? (
								Object.entries(stats.requisicoes_por_status).map(
									([status, count]) => (
										<div
											key={status}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
										>
											<div className="flex items-center space-x-2">
												<StatusBadge status={status} />
											</div>
											<span className="font-medium">
												{formatters.number(count, "0")}
											</span>
										</div>
									),
								)
							) : (
								<div className="text-center py-4 text-gray-500">
									<p>Nenhum dado de status disponível</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{hasEmitenteData && (
				<Card>
					<CardHeader>
						<CardTitle>Top 5 Emitentes por Valor</CardTitle>
						<CardDescription>
							Emitentes com maior valor total em requisições
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{topEmitentes.length > 0 ? (
								topEmitentes.map(([emitente, valor]) => (
									<div
										key={emitente}
										className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
									>
										<span className="text-sm font-medium">
											{formatters.truncateText(emitente, 30)}
										</span>
										<span className="text-sm font-medium text-green-600">
											{formatters.currency(Number(valor), "R$ 0,00")}
										</span>
									</div>
								))
							) : (
								<div className="text-center py-4 text-gray-500">
									<p>Nenhum emitente com valor registrado</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default function RelatorioRequisicoes({
	requisicoes,
	stats,
	filters,
	emitentes = [],
	fornecedores = [],
}: RelatorioRequisicoesProps) {
	const { data, setData, get, processing } = useForm({
		data_inicio: filters?.data_inicio || "",
		data_fim: filters?.data_fim || "",
		status: filters?.status || "",
		emitente_id: filters?.emitente_id || "",
		fornecedor_id: filters?.fornecedor_id || "",
	});

	const hasActiveFilters = reportUtils.hasActiveFilters(data);

	const handleFilter: FormEventHandler = (e) => {
		e.preventDefault();
		get("/relatorios/requisicoes", {
			preserveState: true,
			replace: true,
		});
	};

	const handleReset = () => {
		setData({
			data_inicio: "",
			data_fim: "",
			status: "",
			emitente_id: "",
			fornecedor_id: "",
		});
		get("/relatorios/requisicoes", {
			preserveState: true,
			replace: true,
		});
	};

	const handleExport = (format: string) => {
		const exportUrl = reportUtils.buildExportUrl(
			"/relatorios/requisicoes/export",
			data as Record<string, string>,
			format,
		);
		window.location.href = exportUrl;
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Relatório de Requisições" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link href="/relatorios">
							<Button variant="outline" size="sm">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Voltar
							</Button>
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
								Relatório de Requisições
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								Análise detalhada das requisições do sistema
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="outline" onClick={() => handleExport("pdf")}>
							<Download className="mr-2 h-4 w-4" />
							PDF
						</Button>
						<Button variant="outline" onClick={() => handleExport("excel")}>
							<Download className="mr-2 h-4 w-4" />
							Excel
						</Button>
						<Button variant="outline" onClick={() => handleExport("csv")}>
							<Download className="mr-2 h-4 w-4" />
							CSV
						</Button>
					</div>
				</div>

				{/* Statistics Cards */}
				<StatisticsCards stats={stats} />

				{/* Filters */}
				<FiltersCard
					data={data}
					setData={setData}
					processing={processing}
					emitentes={emitentes}
					fornecedores={fornecedores}
					onFilter={handleFilter}
					onReset={handleReset}
				/>

				{/* Results Table */}
				<ResultsTable
					requisicoes={requisicoes}
					stats={stats}
					hasFilters={hasActiveFilters}
				/>

				{/* Summary Cards */}
				<SummaryCards stats={stats} />
			</div>
		</AppLayout>
	);
}
