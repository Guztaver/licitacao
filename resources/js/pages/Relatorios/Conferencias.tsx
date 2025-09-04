import { Head, Link, useForm } from "@inertiajs/react";
import {
	ArrowLeft,
	BarChart3,
	Calendar,
	CheckCircle,
	DollarSign,
	Download,
	Filter,
	Search,
	TrendingUp,
} from "lucide-react";
import type { FormEventHandler } from "react";
import { useId } from "react";

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
import type { BreadcrumbItem, Fornecedor } from "@/types";
import { formatters, reportUtils } from "@/utils/relatorios/formatters";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Relatórios",
		href: "/relatorios",
	},
	{
		title: "Conferências",
		href: "/relatorios/conferencias",
	},
];

interface ConferenciaRelatorio {
	id: number;
	periodo: string;
	total_requisicoes: number;
	total_pedidos_manuais: number;
	total_geral: number;
	data_conferencia: string;
	observacoes?: string;
	fornecedor?: {
		id: number;
		razao_social: string;
		cnpj_formatado: string;
	};
	created_at: string;
}

interface ConferenciaStats {
	total_conferencias: number;
	valor_total_geral: number;
	valor_total_requisicoes: number;
	valor_total_pedidos_manuais: number;
	conferencias_por_fornecedor: Record<
		string,
		{ count: number; valor_total: number }
	>;
	conferencias_por_mes: Record<string, { count: number; valor_total: number }>;
}

interface RelatorioConferenciasProps {
	conferencias: ConferenciaRelatorio[];
	stats: ConferenciaStats;
	filters: {
		data_inicio?: string;
		data_fim?: string;
		fornecedor_id?: string;
	};
	fornecedores?: Pick<Fornecedor, "id" | "razao_social">[];
}

// Component for Statistics Cards
const StatisticsCards = ({ stats }: { stats: ConferenciaStats }) => (
	<div className="grid gap-4 md:grid-cols-4">
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Total Conferências
				</CardTitle>
				<CheckCircle className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{formatters.number(stats.total_conferencias, "Nenhuma conferência")}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.total_conferencias === 0
						? "Nenhuma conferência realizada"
						: "conferências realizadas"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Valor Total Geral</CardTitle>
				<DollarSign className="h-4 w-4 text-green-600" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-green-600">
					{formatters.currency(stats.valor_total_geral, "Sem valor conferido")}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.valor_total_geral === 0
						? "Nenhum valor foi conferido"
						: "valor total conferido"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Requisições</CardTitle>
				<BarChart3 className="h-4 w-4 text-blue-800" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-blue-800">
					{formatters.currency(
						stats.valor_total_requisicoes,
						"Sem requisições conferidas",
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.valor_total_requisicoes === 0
						? "Nenhuma requisição conferida"
						: "valor em requisições"}
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Pedidos Manuais</CardTitle>
				<TrendingUp className="h-4 w-4 text-purple-600" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-purple-600">
					{formatters.currency(
						stats.valor_total_pedidos_manuais,
						"Sem pedidos manuais",
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{stats.valor_total_pedidos_manuais === 0
						? "Nenhum pedido manual conferido"
						: "valor em pedidos manuais"}
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
	fornecedores,
	onFilter,
	onReset,
}: {
	data: {
		data_inicio: string;
		data_fim: string;
		fornecedor_id: string;
	};
	setData: (field: string, value: string) => void;
	processing: boolean;
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
					Use os filtros para refinar o relatório de conferências
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onFilter} className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
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
							<Label htmlFor="fornecedor_id">Fornecedor</Label>
							<Select
								value={data.fornecedor_id}
								onValueChange={(value) => setData("fornecedor_id", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todos os fornecedores" />
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

// Component for Conference Table Row
const ConferenceTableRow = ({
	conferencia,
}: {
	conferencia: ConferenciaRelatorio;
}) => (
	<TableRow key={conferencia.id}>
		<TableCell>
			<div className="font-medium">{conferencia.periodo}</div>
		</TableCell>
		<TableCell>
			{conferencia.fornecedor ? (
				<div>
					<div className="font-medium">
						{conferencia.fornecedor.razao_social}
					</div>
					<div className="font-mono text-sm text-gray-500">
						{conferencia.fornecedor.cnpj_formatado}
					</div>
				</div>
			) : (
				<span className="text-gray-400 italic">Fornecedor não informado</span>
			)}
		</TableCell>
		<TableCell>
			<div className="flex items-center space-x-2">
				<Calendar className="h-4 w-4 text-gray-400" />
				<span>{formatters.date(conferencia.data_conferencia)}</span>
			</div>
		</TableCell>
		<TableCell className="text-right">
			<span className="font-medium text-blue-800">
				{formatters.currency(conferencia.total_requisicoes, "Sem valor")}
			</span>
		</TableCell>
		<TableCell className="text-right">
			<span className="font-medium text-purple-600">
				{formatters.currency(conferencia.total_pedidos_manuais, "Sem valor")}
			</span>
		</TableCell>
		<TableCell className="text-right">
			<span className="font-medium text-green-600">
				{formatters.currency(conferencia.total_geral, "Sem valor")}
			</span>
		</TableCell>
		<TableCell>
			{conferencia.observacoes ? (
				<div
					className="max-w-xs truncate text-sm text-gray-600"
					title={conferencia.observacoes}
				>
					{formatters.truncateText(conferencia.observacoes)}
				</div>
			) : (
				<span className="text-gray-400 italic">Sem observações</span>
			)}
		</TableCell>
	</TableRow>
);

// Component for Results Table
const ResultsTable = ({
	conferencias,
	stats,
	hasFilters,
}: {
	conferencias: ConferenciaRelatorio[];
	stats: ConferenciaStats;
	hasFilters: boolean;
}) => (
	<Card>
		<CardHeader>
			<CardTitle>Conferências Encontradas</CardTitle>
			<CardDescription>
				{formatters.number(stats.total_conferencias, "Nenhuma conferência")}{" "}
				encontradas (ordenadas por data)
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Período</TableHead>
							<TableHead>Fornecedor</TableHead>
							<TableHead>Data Conferência</TableHead>
							<TableHead className="text-right">Requisições</TableHead>
							<TableHead className="text-right">Pedidos Manuais</TableHead>
							<TableHead className="text-right">Total Geral</TableHead>
							<TableHead>Observações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{conferencias.length > 0 ? (
							conferencias.map((conferencia) => (
								<ConferenceTableRow
									key={conferencia.id}
									conferencia={conferencia}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center">
									<CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
									<p className="mt-2 text-gray-500">
										{reportUtils.getEmptyStateMessage(
											"conferencias",
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

// Component for Summary Charts
const SummaryCharts = ({ stats }: { stats: ConferenciaStats }) => {
	if (Object.keys(stats.conferencias_por_fornecedor).length === 0) {
		return null;
	}

	const topFornecedores = reportUtils.getTopEntries(
		stats.conferencias_por_fornecedor,
		(data) => data.valor_total,
		5,
	);

	const topMeses = reportUtils.getTopEntries(
		stats.conferencias_por_mes,
		(data) => data.valor_total,
		6,
	);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Top 5 Fornecedores</CardTitle>
					<CardDescription>
						Fornecedores com maior valor em conferências
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{topFornecedores.length > 0 ? (
							topFornecedores.map(([fornecedor, data]) => (
								<div
									key={fornecedor}
									className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
								>
									<div>
										<div className="text-sm font-medium">{fornecedor}</div>
										<div className="text-xs text-gray-500">
											{formatters.number(data.count, "Nenhuma")} conferências
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium text-green-600">
											{formatters.currency(data.valor_total, "Sem valor")}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-4 text-gray-500">
								<p>Nenhum fornecedor com conferências registradas</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Últimos 6 Meses</CardTitle>
					<CardDescription>Conferências e valores por mês</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{topMeses.length > 0 ? (
							topMeses.map(([mes, data]) => (
								<div
									key={mes}
									className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
								>
									<div>
										<div className="text-sm font-medium capitalize">
											{formatters.monthYear(mes)}
										</div>
										<div className="text-xs text-gray-500">
											{formatters.number(data.count, "Nenhuma")} conferências
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium text-blue-800">
											{formatters.currency(data.valor_total, "Sem valor")}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-4 text-gray-500">
								<p>Nenhuma conferência registrada no período</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default function RelatorioConferencias({
	conferencias,
	stats,
	filters,
	fornecedores = [],
}: RelatorioConferenciasProps) {
	const { data, setData, get, processing } = useForm({
		data_inicio: filters?.data_inicio || "",
		data_fim: filters?.data_fim || "",
		fornecedor_id: filters?.fornecedor_id || "",
	});

	const hasActiveFilters = reportUtils.hasActiveFilters(data);

	const handleFilter: FormEventHandler = (e) => {
		e.preventDefault();
		get("/relatorios/conferencias", {
			preserveState: true,
			replace: true,
		});
	};

	const handleReset = () => {
		setData({
			data_inicio: "",
			data_fim: "",
			fornecedor_id: "",
		});
		get("/relatorios/conferencias", {
			preserveState: true,
			replace: true,
		});
	};

	const handleExport = (format: string) => {
		const exportUrl = reportUtils.buildExportUrl(
			"/relatorios/conferencias/export",
			data as Record<string, string>,
			format,
		);
		window.location.href = exportUrl;
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Relatório de Conferências" />

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
								Relatório de Conferências
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								Análise detalhada das conferências realizadas no sistema
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
					fornecedores={fornecedores}
					onFilter={handleFilter}
					onReset={handleReset}
				/>

				{/* Results Table */}
				<ResultsTable
					conferencias={conferencias}
					stats={stats}
					hasFilters={hasActiveFilters}
				/>

				{/* Summary Charts */}
				<SummaryCharts stats={stats} />
			</div>
		</AppLayout>
	);
}
