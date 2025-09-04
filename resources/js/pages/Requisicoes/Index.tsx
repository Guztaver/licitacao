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

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Requisições",
		href: requisicoes.index(),
	},
];

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

interface RequisicoesIndexProps {
	requisicoes: {
		data: Requisicao[];
		links: PaginationLink[];
		meta: PaginationMeta;
	};
	emitentes: Emitente[];
	stats: {
		total_requisicoes: number;
		autorizadas: number;
		concretizadas: number;
		canceladas: number;
		valor_total: number;
	};
	filters: {
		search?: string;
		status?: string;
		emitente_id?: string;
		data_inicio?: string;
		data_fim?: string;
	};
}

export default function RequisicoesIndex({
	requisicoes: requisicoesPaginated,
	emitentes,
	stats,
	filters,
}: RequisicoesIndexProps) {
	// Add safety checks for data
	const safeRequisicoes = requisicoesPaginated || {
		data: [],
		links: [],
		meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
	};
	const safeData = safeRequisicoes.data || [];
	const safeLinks = safeRequisicoes.links || [];
	const safeMeta = safeRequisicoes.meta || {
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

	const handleSearch: FormEventHandler = (e) => {
		e.preventDefault();
		get(requisicoes.index(), {
			preserveState: true,
			replace: true,
		});
	};

	const handleReset = () => {
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
	};

	const formatCurrency = (value: number | null) => {
		if (value === null || value === undefined) return "-";
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const getStatusBadge = (status: string, statusColor?: string) => {
		return (
			<Badge
				variant="outline"
				className={statusColor || "border-gray-200 bg-gray-100 text-gray-800"}
			>
				{status}
			</Badge>
		);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Requisições" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
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
						<Button
							variant="outline"
							onClick={() => {
								const params = new URLSearchParams(
									filters as Record<string, string>,
								);
								window.location.href = `${requisicoes.export()}?${params.toString()}`;
							}}
						>
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
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{safeStats.total_requisicoes}
							</div>
							<p className="text-xs text-muted-foreground">
								{data.search ||
								data.status ||
								data.emitente_id ||
								data.data_inicio ||
								data.data_fim
									? "encontradas com filtros"
									: "requisições cadastradas"}
							</p>
							{safeData.length > 0 &&
								safeMeta.total !== safeStats.total_requisicoes && (
									<p className="mt-1 text-xs text-gray-400">
										Mostrando {safeData.length} de {safeMeta.total} na página
									</p>
								)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{safeStats.autorizadas}</div>
							<p className="text-xs text-muted-foreground">
								{data.search ||
								data.status ||
								data.emitente_id ||
								data.data_inicio ||
								data.data_fim
									? "autorizadas nos resultados"
									: "aguardando processamento"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Concretizadas
							</CardTitle>
							<CheckCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{safeStats.concretizadas}
							</div>
							<p className="text-xs text-muted-foreground">
								{data.search ||
								data.status ||
								data.emitente_id ||
								data.data_inicio ||
								data.data_fim
									? "concretizadas nos resultados"
									: "finalizadas"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{formatCurrency(safeStats.valor_total)}
							</div>
							<p className="text-xs text-muted-foreground">
								{data.search ||
								data.status ||
								data.emitente_id ||
								data.data_inicio ||
								data.data_fim
									? "valor dos resultados"
									: "valor concretizado"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Canceladas</CardTitle>
							<X className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{safeStats.canceladas}</div>
							<p className="text-xs text-muted-foreground">
								{data.search ||
								data.status ||
								data.emitente_id ||
								data.data_inicio ||
								data.data_fim
									? "canceladas nos resultados"
									: "canceladas no sistema"}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Filter Summary */}
				{(data.search ||
					data.status ||
					data.emitente_id ||
					data.data_inicio ||
					data.data_fim) &&
					safeStats.total_requisicoes > 0 && (
						<div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-green-800 dark:text-green-200">
										Filtros aplicados
									</h3>
									<p className="mt-1 text-sm text-green-700 dark:text-green-300">
										Mostrando {safeStats.total_requisicoes} requisições que
										correspondem aos critérios de busca
									</p>
								</div>
								<Button variant="outline" size="sm" onClick={handleReset}>
									Limpar Filtros
								</Button>
							</div>
						</div>
					)}

				{/* Empty State Message */}
				{safeStats.total_requisicoes === 0 &&
					(data.search ||
						data.status ||
						data.emitente_id ||
						data.data_inicio ||
						data.data_fim) && (
						<div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
							<div className="flex">
								<div className="ml-3">
									<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
										Nenhuma requisição encontrada
									</h3>
									<p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
										Não foram encontradas requisições que correspondam aos
										filtros aplicados. Tente ajustar os critérios de busca.
									</p>
									<div className="mt-3">
										<Button variant="outline" size="sm" onClick={handleReset}>
											Limpar Filtros
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

				{/* Low Data Notice */}
				{safeStats.total_requisicoes > 0 &&
					safeStats.concretizadas === 0 &&
					!data.search &&
					!data.status &&
					!data.emitente_id &&
					!data.data_inicio &&
					!data.data_fim && (
						<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
							<div className="flex">
								<div className="ml-3">
									<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
										Requisições sem concretização
									</h3>
									<p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
										Existem {safeStats.total_requisicoes} requisições
										cadastradas, sendo {safeStats.autorizadas} autorizadas, mas
										nenhuma foi concretizada ainda. Para gerar valor
										movimentado, concretize algumas requisições autorizadas.
									</p>
								</div>
							</div>
						</div>
					)}

				{/* No Data Notice */}
				{safeStats.total_requisicoes === 0 &&
					!data.search &&
					!data.status &&
					!data.emitente_id &&
					!data.data_inicio &&
					!data.data_fim && (
						<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/20">
							<div className="flex">
								<div className="ml-3">
									<h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
										Nenhuma requisição cadastrada
									</h3>
									<p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
										Não há requisições no sistema ainda. Clique em "Nova
										Requisição" para começar.
									</p>
									<div className="mt-3">
										<Button asChild>
											<Link href={requisicoes.create()}>
												<Plus className="mr-2 h-4 w-4" />
												Nova Requisição
											</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>
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
									<option value="">Todos os status</option>
									<option value="autorizada">Autorizada</option>
									<option value="concretizada">Concretizada</option>
									<option value="cancelada">Cancelada</option>
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
							Mostrando {requisicoesPaginated.data.length} de{" "}
							{requisicoesPaginated.meta?.total || 0} requisições
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
												<TableCell>{requisicao.solicitante}</TableCell>
												<TableCell>
													{requisicao.emitente && (
														<div className="text-sm">
															<p className="font-medium">
																{requisicao.emitente.sigla}
															</p>
															<p className="text-gray-500">
																{requisicao.emitente.nome}
															</p>
														</div>
													)}
												</TableCell>
												<TableCell>{requisicao.data_recebimento}</TableCell>
												<TableCell>
													{getStatusBadge(
														requisicao.status_display || requisicao.status,
														requisicao.status_color,
													)}
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
										<TableRow>
											<TableCell colSpan={7} className="py-8 text-center">
												<div className="flex flex-col items-center space-y-2">
													<FileText className="h-8 w-8 text-gray-400" />
													<p className="text-gray-500">
														Nenhuma requisição encontrada
													</p>
													<Link href={requisicoes.create()}>
														<Button size="sm">
															<Plus className="mr-2 h-4 w-4" />
															Adicionar Requisição
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						{requisicoesPaginated.meta?.last_page > 1 && (
							<div className="flex items-center justify-between px-2 py-4">
								<div className="text-sm text-gray-700">
									Mostrando {requisicoesPaginated.meta?.from || 0} até{" "}
									{requisicoesPaginated.meta?.to || 0} de {safeMeta.total}{" "}
									resultados
								</div>
								<div className="flex items-center space-x-2">
									{safeLinks.map((link) => (
										<Button
											key={link.label}
											variant={link.active ? "default" : "outline"}
											size="sm"
											disabled={!link.url}
											onClick={() => link.url && router.get(link.url)}
										>
											{link.label.includes("&laquo;")
												? "«"
												: link.label.includes("&raquo;")
													? "»"
													: link.label.includes("&hellip;")
														? "..."
														: link.label}
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
