import { Head, Link, router, useForm } from "@inertiajs/react";
import { Building, FileDown, Plus, Search } from "lucide-react";
import type { FormEventHandler } from "react";
import { useMemo } from "react";
import CreateEmitenteModal from "@/components/modals/CreateEmitenteModal";
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
import { emitentes } from "@/routes";
import type { BreadcrumbItem, Emitente } from "@/types";

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

interface EmitentesIndexProps {
	emitentes: {
		data: Emitente[];
		links: PaginationLink[];
		meta: PaginationMeta;
	};
	stats: {
		total_emitentes: number;
		com_requisicoes: number;
		total_requisicoes: number;
		sem_atividade: number;
	};
	filters: {
		search?: string;
	};
}

// Constants
const BREADCRUMBS: BreadcrumbItem[] = [
	{
		title: "Emitentes",
		href: emitentes.index(),
	},
];

const STATS_CONFIG = [
	{
		key: "total_emitentes" as const,
		title: "Total Emitentes",
		icon: Building,
		color: "text-gray-900",
		getDescription: (isFiltered: boolean) =>
			isFiltered ? "nos resultados filtrados" : "cadastrados no sistema",
	},
	{
		key: "com_requisicoes" as const,
		title: "Com Requisições",
		icon: Building,
		color: "text-green-600",
		getDescription: () => "emitentes ativos",
	},
	{
		key: "total_requisicoes" as const,
		title: "Total Requisições",
		icon: Building,
		color: "text-blue-600",
		getDescription: () => "requisições emitidas",
	},
	{
		key: "sem_atividade" as const,
		title: "Sem Atividade",
		icon: Building,
		color: "text-amber-600",
		getDescription: () => "sem requisições",
	},
];

const MESSAGES = {
	noResults: "Nenhum emitente encontrado com os filtros aplicados",
	noData: "Nenhum emitente cadastrado",
	searchPlaceholder: "Buscar por nome ou sigla...",
	contactNotProvided: "-",
} as const;

// Utility Functions
const formatContactInfo = (telefone?: string, email?: string) => {
	if (!telefone && !email) return MESSAGES.contactNotProvided;

	return (
		<div className="text-sm">
			{telefone && <p>{telefone}</p>}
			{email && <p className="text-gray-500">{email}</p>}
		</div>
	);
};

const formatRequisicoesCount = (count: number) => (
	<div className="text-sm">
		<span className="font-medium">{count || 0}</span>
		<span className="text-gray-500"> requisições</span>
	</div>
);

const formatPaginationLabel = (label: string) => {
	if (label.includes("&laquo;")) return "«";
	if (label.includes("&raquo;")) return "»";
	if (label.includes("&hellip;")) return "...";
	return label;
};

// Components
interface StatCardProps {
	title: string;
	value: number;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color?: string;
}

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	color = "text-gray-900",
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon
					className={`h-4 w-4 ${color === "text-gray-900" ? "text-muted-foreground" : color}`}
				/>
			</CardHeader>
			<CardContent>
				<div className={`text-2xl font-bold ${color}`}>{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

interface EmptyStateProps {
	isFiltered: boolean;
	onClearFilters: () => void;
	onSuccess: () => void;
}

function EmptyState({
	isFiltered,
	onClearFilters,
	onSuccess,
}: EmptyStateProps) {
	return (
		<TableRow>
			<TableCell colSpan={4} className="py-8 text-center">
				<div className="flex flex-col items-center space-y-2">
					<Building className="h-8 w-8 text-gray-400" />
					{isFiltered ? (
						<>
							<p className="text-gray-500">{MESSAGES.noResults}</p>
							<Button variant="outline" size="sm" onClick={onClearFilters}>
								Limpar filtros
							</Button>
						</>
					) : (
						<>
							<p className="text-gray-500">{MESSAGES.noData}</p>
							<CreateEmitenteModal
								trigger={
									<Button size="sm">
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Primeiro Emitente
									</Button>
								}
								onSuccess={onSuccess}
							/>
						</>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
}

// Main Component
export default function EmitentesIndex({
	emitentes: emitentesPaginated,
	stats,
	filters,
}: EmitentesIndexProps) {
	// Safe data extraction
	const safeEmitentes = emitentesPaginated || {
		data: [],
		links: [],
		meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
	};
	const safeData = safeEmitentes.data || [];
	const safeLinks = safeEmitentes.links || [];
	const safeMeta = safeEmitentes.meta || {
		total: 0,
		from: 0,
		to: 0,
		last_page: 1,
		current_page: 1,
	};
	const safeStats = stats || {
		total_emitentes: 0,
		com_requisicoes: 0,
		total_requisicoes: 0,
		sem_atividade: 0,
	};

	const { data, setData, get, processing } = useForm({
		search: filters?.search || "",
	});

	// Memoized values
	const isFiltered = useMemo(() => data.search !== "", [data.search]);
	const hasResults = useMemo(() => safeData.length > 0, [safeData.length]);

	// Event handlers
	const handleSearch: FormEventHandler = useMemo(
		() => (e) => {
			e.preventDefault();
			get(emitentes.index(), {
				preserveState: true,
				replace: true,
			});
		},
		[get],
	);

	const handleReset = useMemo(
		() => () => {
			setData({ search: "" });
			get(emitentes.index(), {
				preserveState: true,
				replace: true,
			});
		},
		[setData, get],
	);

	const handleExport = useMemo(
		() => () => {
			const params = new URLSearchParams(filters as Record<string, string>);
			window.location.href = `${emitentes.export()}?${params.toString()}`;
		},
		[filters],
	);

	const handleReload = useMemo(() => () => router.reload(), []);

	const handlePaginationClick = useMemo(
		() => (url: string) => {
			router.get(url);
		},
		[],
	);

	return (
		<AppLayout breadcrumbs={BREADCRUMBS}>
			<Head title="Emitentes" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Emitentes
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Gerencie os órgãos emitentes de requisições
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="outline" onClick={handleExport}>
							<FileDown className="mr-2 h-4 w-4" />
							Exportar
						</Button>
						<CreateEmitenteModal onSuccess={handleReload} />
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					{STATS_CONFIG.map(({ key, title, icon, color, getDescription }) => (
						<StatCard
							key={key}
							title={title}
							value={safeStats[key]}
							description={getDescription(isFiltered)}
							icon={icon}
							color={color}
						/>
					))}
				</div>

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
										placeholder={MESSAGES.searchPlaceholder}
										value={data.search}
										onChange={(e) => setData("search", e.target.value)}
										className="pl-10"
									/>
								</div>
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
						<CardTitle className="text-lg">Lista de Emitentes</CardTitle>
						<CardDescription>
							{isFiltered ? (
								<>
									Mostrando {safeMeta.from || 0} a {safeMeta.to || 0} de{" "}
									{safeStats.total_emitentes} emitentes encontrados
									{safeStats.total_emitentes === 0 &&
										" (nenhum resultado encontrado)"}
								</>
							) : (
								<>
									Mostrando {safeMeta.from || 0} a {safeMeta.to || 0} de{" "}
									{safeMeta.total || 0} emitentes
								</>
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome / Sigla</TableHead>
										<TableHead>Contato</TableHead>
										<TableHead>Requisições</TableHead>
										<TableHead>Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{hasResults ? (
										safeData.map((emitente) => (
											<TableRow key={emitente.id}>
												<TableCell>
													<div>
														<Link
															href={emitentes.show(emitente.id)}
															className="font-medium text-blue-600 hover:text-blue-800"
														>
															{emitente.nome}
														</Link>
														<p className="text-sm text-gray-500">
															Sigla:{" "}
															<span className="font-mono">
																{emitente.sigla}
															</span>
														</p>
														{emitente.endereco && (
															<p className="text-sm text-gray-500">
																{emitente.endereco}
															</p>
														)}
													</div>
												</TableCell>
												<TableCell>
													{formatContactInfo(emitente.telefone, emitente.email)}
												</TableCell>
												<TableCell>
													{formatRequisicoesCount(
														emitente.requisicoes_count || 0,
													)}
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-2">
														<Link href={emitentes.show(emitente.id)}>
															<Button variant="outline" size="sm">
																Ver
															</Button>
														</Link>
														<Link href={emitentes.edit(emitente.id)}>
															<Button variant="outline" size="sm">
																Editar
															</Button>
														</Link>
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<EmptyState
											isFiltered={isFiltered}
											onClearFilters={handleReset}
											onSuccess={handleReload}
										/>
									)}
								</TableBody>
							</Table>
						</div>

						{/* Filter Summary */}
						{isFiltered && hasResults && (
							<div className="border-t px-4 py-3">
								<div className="flex items-center justify-between text-sm text-gray-600">
									<div>
										Filtros ativos:{" "}
										<span className="font-medium">"{data.search}"</span>
									</div>
									<Button variant="ghost" size="sm" onClick={handleReset}>
										Limpar filtros
									</Button>
								</div>
							</div>
						)}

						{/* Pagination */}
						{safeMeta.last_page > 1 && (
							<div className="flex items-center justify-between px-2 py-4">
								<div className="text-sm text-gray-700">
									Mostrando {safeMeta.from || 0} até {safeMeta.to || 0} de{" "}
									{isFiltered ? safeStats.total_emitentes : safeMeta.total || 0}{" "}
									resultados
								</div>
								<div className="flex items-center space-x-2">
									{safeLinks.map((link) => (
										<Button
											key={link.label}
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
