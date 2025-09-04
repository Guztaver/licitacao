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
import { useId, type FormEventHandler } from "react";

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

interface RelatorioRequisicoesProps {
	requisicoes: (Requisicao & {
		emitente?: Pick<Emitente, "nome" | "sigla">;
		destinatario?: { nome: string };
		fornecedor?: Pick<Fornecedor, "razao_social">;
	})[];
	stats: {
		total_requisicoes: number;
		valor_total: number;
		requisicoes_por_status: Record<string, number>;
		valor_por_emitente: Record<string, number>;
		valor_por_fornecedor: Record<string, number>;
	};
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
		const params = new URLSearchParams(data as Record<string, string>);
		params.append("formato", format);
		window.location.href = `/relatorios/requisicoes/export?${params.toString()}`;
	};

	const dataInicioId = useId();
	const dataFimId = useId();

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pendente: {
				label: "Pendente",
				className: "bg-yellow-100 text-yellow-800 border-yellow-200",
			},
			autorizada: {
				label: "Autorizada",
				className: "bg-blue-100 text-blue-800 border-blue-200",
			},
			concretizada: {
				label: "Concretizada",
				className: "bg-green-100 text-green-800 border-green-200",
			},
			cancelada: {
				label: "Cancelada",
				className: "bg-red-100 text-red-800 border-red-200",
			},
		};

		const config = statusConfig[status as keyof typeof statusConfig] || {
			label: status,
			className: "bg-gray-100 text-gray-800 border-gray-200",
		};

		return (
			<Badge variant="outline" className={config.className}>
				{config.label}
			</Badge>
		);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Relatório de Requisições" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
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
								{stats.total_requisicoes}
							</div>
							<p className="text-xs text-muted-foreground">
								requisições no período
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
							<DollarSign className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{formatCurrency(stats.valor_total)}
							</div>
							<p className="text-xs text-muted-foreground">
								requisições concretizadas
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Concretizadas
							</CardTitle>
							<BarChart3 className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{stats.requisicoes_por_status.concretizada || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								finalizadas com sucesso
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
							<Calendar className="h-4 w-4 text-amber-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-amber-600">
								{stats.requisicoes_por_status.pendente || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								aguardando processamento
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Filter className="mr-2 h-5 w-5" />
							Filtros
						</CardTitle>
						<CardDescription>
							Use os filtros para refinar o relatório
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleFilter} className="space-y-4">
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
								<Button type="button" variant="outline" onClick={handleReset}>
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

				{/* Results Table */}
				<Card>
					<CardHeader>
						<CardTitle>Requisições Encontradas</CardTitle>
						<CardDescription>
							{stats.total_requisicoes} requisições encontradas
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
											<TableRow key={requisicao.id}>
												<TableCell className="font-medium">
													{requisicao.numero_completo}
												</TableCell>
												<TableCell>{requisicao.solicitante}</TableCell>
												<TableCell>
													{requisicao.emitente ? (
														<div>
															<div className="font-medium">
																{requisicao.emitente.nome}
															</div>
															<div className="text-sm text-gray-500">
																{requisicao.emitente.sigla}
															</div>
														</div>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</TableCell>
												<TableCell>{requisicao.data_recebimento}</TableCell>
												<TableCell>
													{getStatusBadge(requisicao.status)}
												</TableCell>
												<TableCell>
													{requisicao.fornecedor ? (
														<div className="font-medium">
															{requisicao.fornecedor.razao_social}
														</div>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													{requisicao.valor_final ? (
														<span className="font-medium">
															{formatCurrency(requisicao.valor_final)}
														</span>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} className="py-8 text-center">
												<FileText className="mx-auto h-8 w-8 text-gray-400" />
												<p className="mt-2 text-gray-500">
													Nenhuma requisição encontrada com os filtros aplicados
												</p>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				{/* Summary by Status */}
				{Object.keys(stats.requisicoes_por_status).length > 0 && (
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Por Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{Object.entries(stats.requisicoes_por_status).map(
										([status, count]) => (
											<div
												key={status}
												className="flex items-center justify-between"
											>
												<div className="flex items-center space-x-2">
													{getStatusBadge(status)}
												</div>
												<span className="font-medium">{count}</span>
											</div>
										),
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Top Emitentes (Valor)</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{Object.entries(stats.valor_por_emitente)
										.sort(([, a], [, b]) => Number(b) - Number(a))
										.slice(0, 5)
										.map(([emitente, valor]) => (
											<div
												key={emitente}
												className="flex items-center justify-between"
											>
												<span className="text-sm font-medium">{emitente}</span>
												<span className="text-sm text-green-600">
													{formatCurrency(Number(valor))}
												</span>
											</div>
										))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
