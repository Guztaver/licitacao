import { Head, Link, useForm } from "@inertiajs/react";
import {
	ArrowLeft,
	Building,
	DollarSign,
	Download,
	Filter,
	Search,
	TrendingUp,
	Users,
} from "lucide-react";
import type { FormEventHandler } from "react";
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
import type { BreadcrumbItem, Fornecedor } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Relatórios",
		href: "/relatorios",
	},
	{
		title: "Fornecedores",
		href: "/relatorios/fornecedores",
	},
];

interface FornecedorRelatorio
	extends Pick<
		Fornecedor,
		| "id"
		| "razao_social"
		| "cnpj_formatado"
		| "telefone_formatado"
		| "email"
		| "status"
		| "status_display"
		| "created_at"
	> {
	total_requisicoes: number;
	valor_total: number;
}

interface RelatorioFornecedoresProps {
	fornecedores: FornecedorRelatorio[];
	stats: {
		total_fornecedores: number;
		fornecedores_ativos: number;
		fornecedores_inativos: number;
		valor_total_geral: number;
		total_requisicoes: number;
		fornecedores_com_movimento: number;
	};
	filters: {
		data_inicio?: string;
		data_fim?: string;
		status?: string;
	};
}

export default function RelatorioFornecedores({
	fornecedores,
	stats,
	filters,
}: RelatorioFornecedoresProps) {
	const { data, setData, get, processing } = useForm({
		data_inicio: filters?.data_inicio || "",
		data_fim: filters?.data_fim || "",
		status: filters?.status || "",
	});

	const handleFilter: FormEventHandler = (e) => {
		e.preventDefault();
		get("/relatorios/fornecedores", {
			preserveState: true,
			replace: true,
		});
	};

	const handleReset = () => {
		setData({
			data_inicio: "",
			data_fim: "",
			status: "",
		});
		get("/relatorios/fornecedores", {
			preserveState: true,
			replace: true,
		});
	};

	const handleExport = (format: string) => {
		const params = new URLSearchParams(data as Record<string, string>);
		params.append("formato", format);
		window.location.href = `/relatorios/fornecedores/export?${params.toString()}`;
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const getStatusBadge = (status: boolean, statusDisplay: string) => {
		return (
			<Badge
				variant={status ? "default" : "secondary"}
				className={
					status
						? "border-green-200 bg-green-100 text-green-800"
						: "border-red-200 bg-red-100 text-red-800"
				}
			>
				{statusDisplay}
			</Badge>
		);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Relatório de Fornecedores" />

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
								Relatório de Fornecedores
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								Análise detalhada dos fornecedores e desempenho
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
				<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Fornecedores
							</CardTitle>
							<Building className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.total_fornecedores}
							</div>
							<p className="text-xs text-muted-foreground">
								fornecedores cadastrados
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Ativos</CardTitle>
							<Users className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{stats.fornecedores_ativos}
							</div>
							<p className="text-xs text-muted-foreground">
								fornecedores ativos
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Inativos</CardTitle>
							<Users className="h-4 w-4 text-red-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">
								{stats.fornecedores_inativos}
							</div>
							<p className="text-xs text-muted-foreground">
								fornecedores inativos
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Com Movimento
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-blue-800" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-800">
								{stats.fornecedores_com_movimento}
							</div>
							<p className="text-xs text-muted-foreground">com requisições</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Requisições
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-600">
								{stats.total_requisicoes}
							</div>
							<p className="text-xs text-muted-foreground">
								requisições atendidas
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
							<DollarSign className="h-4 w-4 text-emerald-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-emerald-600">
								{formatCurrency(stats.valor_total_geral)}
							</div>
							<p className="text-xs text-muted-foreground">valor movimentado</p>
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
							Use os filtros para refinar o relatório por período e status
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleFilter} className="space-y-4">
							<div className="grid gap-4 md:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="data_inicio">Data Início</Label>
									<Input
										id="data_inicio"
										type="date"
										value={data.data_inicio}
										onChange={(e) => setData("data_inicio", e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="data_fim">Data Fim</Label>
									<Input
										id="data_fim"
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
											<SelectItem value="1">Ativo</SelectItem>
											<SelectItem value="0">Inativo</SelectItem>
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
						<CardTitle>Fornecedores Encontrados</CardTitle>
						<CardDescription>
							{stats.total_fornecedores} fornecedores encontrados (ordenados por
							valor total)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Razão Social</TableHead>
										<TableHead>CNPJ</TableHead>
										<TableHead>Contato</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-center">Requisições</TableHead>
										<TableHead className="text-right">Valor Total</TableHead>
										<TableHead>Cadastro</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{fornecedores.length > 0 ? (
										fornecedores.map((fornecedor) => (
											<TableRow key={fornecedor.id}>
												<TableCell>
													<div className="font-medium">
														{fornecedor.razao_social}
													</div>
												</TableCell>
												<TableCell className="font-mono text-sm">
													{fornecedor.cnpj_formatado}
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{fornecedor.telefone_formatado && (
															<div>{fornecedor.telefone_formatado}</div>
														)}
														{fornecedor.email && (
															<div className="text-gray-500">
																{fornecedor.email}
															</div>
														)}
														{!fornecedor.telefone_formatado &&
															!fornecedor.email && (
																<span className="text-gray-400">-</span>
															)}
													</div>
												</TableCell>
												<TableCell>
													{getStatusBadge(
														fornecedor.status,
														fornecedor.status_display,
													)}
												</TableCell>
												<TableCell className="text-center">
													<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
														{fornecedor.total_requisicoes}
													</span>
												</TableCell>
												<TableCell className="text-right">
													{fornecedor.valor_total > 0 ? (
														<span className="font-medium text-green-600">
															{formatCurrency(fornecedor.valor_total)}
														</span>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</TableCell>
												<TableCell className="text-sm text-gray-500">
													{fornecedor.created_at}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} className="py-8 text-center">
												<Building className="mx-auto h-8 w-8 text-gray-400" />
												<p className="mt-2 text-gray-500">
													Nenhum fornecedor encontrado com os filtros aplicados
												</p>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				{/* Top Performers */}
				{fornecedores.length > 0 && (
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Top 5 - Maior Valor</CardTitle>
								<CardDescription>
									Fornecedores com maior valor total em requisições
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{fornecedores
										.filter((f) => f.valor_total > 0)
										.slice(0, 5)
										.map((fornecedor, index) => (
											<div
												key={fornecedor.id}
												className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
											>
												<div className="flex items-center space-x-3">
													<div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
														{index + 1}
													</div>
													<div>
														<div className="font-medium text-sm">
															{fornecedor.razao_social}
														</div>
														<div className="text-xs text-gray-500">
															{fornecedor.total_requisicoes} requisições
														</div>
													</div>
												</div>
												<div className="text-right">
													<div className="font-medium text-green-600">
														{formatCurrency(fornecedor.valor_total)}
													</div>
												</div>
											</div>
										))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Top 5 - Mais Requisições</CardTitle>
								<CardDescription>
									Fornecedores com maior número de requisições
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{fornecedores
										.sort((a, b) => b.total_requisicoes - a.total_requisicoes)
										.filter((f) => f.total_requisicoes > 0)
										.slice(0, 5)
										.map((fornecedor, index) => (
											<div
												key={fornecedor.id}
												className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
											>
												<div className="flex items-center space-x-3">
													<div className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
														{index + 1}
													</div>
													<div>
														<div className="font-medium text-sm">
															{fornecedor.razao_social}
														</div>
														<div className="text-xs text-gray-500">
															{formatCurrency(fornecedor.valor_total)}
														</div>
													</div>
												</div>
												<div className="text-right">
													<div className="font-medium text-purple-600">
														{fornecedor.total_requisicoes} req.
													</div>
												</div>
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
