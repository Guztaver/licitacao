import { Head, router } from "@inertiajs/react";
import { FileDown, MapPin } from "lucide-react";
import CreateDestinatarioModal from "@/components/modals/CreateDestinatarioModal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { destinatarios } from "@/routes";
import type { BreadcrumbItem, Destinatario } from "@/types";
import {
	DestinatarisStatsCard,
	DestinatarisFilters,
	DestinatarisTable,
	DestinatarissPagination,
} from "@/components/destinatarios";
import {
	useDestinatarisFilters,
	useDestinatarisActions,
	DESTINATARIOS_LABELS,
	DESTINATARIOS_MESSAGES,
} from "@/hooks/use-destinatarios";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: DESTINATARIOS_LABELS.destinatarios,
		href: destinatarios.index(),
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

interface DestinatariosIndexProps {
	destinatarios: {
		data: Destinatario[];
		links: PaginationLink[];
		meta: PaginationMeta;
	};
	stats: {
		total_destinatarios: number;
		com_requisicoes: number;
		total_requisicoes: number;
		sem_atividade: number;
	};
	filters: {
		search?: string;
	};
}

const statsConfig = [
	{
		key: "total_destinatarios" as const,
		title: DESTINATARIOS_LABELS.totalDestinatarios,
		icon: MapPin,
		description: DESTINATARIOS_MESSAGES.cadastradosNoSistema,
		color: "blue",
	},
	{
		key: "com_requisicoes" as const,
		title: DESTINATARIOS_LABELS.comRequisicoes,
		icon: MapPin,
		description: DESTINATARIOS_LABELS.destinatariosAtivos,
		color: "green",
	},
	{
		key: "total_requisicoes" as const,
		title: DESTINATARIOS_LABELS.totalRequisicoes,
		icon: MapPin,
		description: DESTINATARIOS_LABELS.requisicoesRecebidas,
		color: "purple",
	},
	{
		key: "sem_atividade" as const,
		title: DESTINATARIOS_LABELS.semAtividade,
		icon: MapPin,
		description: DESTINATARIOS_LABELS.semRequisicoes,
		color: "gray",
	},
];

export default function DestinatariosIndex({
	destinatarios: destinatariosPaginated,
	stats,
	filters,
}: DestinatariosIndexProps) {
	// Add safety checks for data
	const safeDestinatarios = destinatariosPaginated || {
		data: [],
		links: [],
		meta: { total: 0, from: 0, to: 0, last_page: 1, current_page: 1 },
	};
	const safeData = safeDestinatarios.data || [];
	const safeLinks = safeDestinatarios.links || [];
	const safeMeta = safeDestinatarios.meta || {
		total: 0,
		from: 0,
		to: 0,
		last_page: 1,
		current_page: 1,
	};
	const safeStats = stats || {
		total_destinatarios: 0,
		com_requisicoes: 0,
		total_requisicoes: 0,
		sem_atividade: 0,
	};

	const {
		filters: currentFilters,
		setFilters,
		applyFilters,
		resetFilters,
		isFiltered,
		processing,
	} = useDestinatarisFilters({
		initialFilters: filters,
	});

	const { exportDestinatarios } = useDestinatarisActions();

	const handleExport = () => {
		exportDestinatarios(currentFilters);
	};

	const handleReload = () => {
		router.reload();
	};

	const handlePageClick = (url: string) => {
		router.get(url);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={DESTINATARIOS_LABELS.pageTitle} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{DESTINATARIOS_LABELS.pageTitle}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{DESTINATARIOS_LABELS.pageSubtitle}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="outline" onClick={handleExport}>
							<FileDown className="mr-2 h-4 w-4" />
							{DESTINATARIOS_LABELS.exportar}
						</Button>
						<CreateDestinatarioModal onSuccess={handleReload} />
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					{statsConfig.map((config) => (
						<DestinatarisStatsCard
							key={config.key}
							title={config.title}
							value={safeStats[config.key]}
							description={
								isFiltered && config.key === "total_destinatarios"
									? DESTINATARIOS_MESSAGES.resultadosFiltrados
									: config.description
							}
							icon={config.icon}
							color={config.color}
						/>
					))}
				</div>

				{/* Filters */}
				<DestinatarisFilters
					search={currentFilters.search}
					onSearchChange={(value) => setFilters({ search: value })}
					onSubmit={applyFilters}
					onReset={resetFilters}
					processing={processing}
				/>

				{/* Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							{DESTINATARIOS_MESSAGES.listaDestinatarios}
						</CardTitle>
						<CardDescription>
							{isFiltered ? (
								<>
									{DESTINATARIOS_MESSAGES.mostrando} {safeMeta.from || 0}{" "}
									{DESTINATARIOS_MESSAGES.ate} {safeMeta.to || 0}{" "}
									{DESTINATARIOS_MESSAGES.de} {safeStats.total_destinatarios}{" "}
									{DESTINATARIOS_MESSAGES.destinatariosEncontrados}
									{safeStats.total_destinatarios === 0 &&
										` ${DESTINATARIOS_MESSAGES.nenhumResultadoEncontrado}`}
								</>
							) : (
								<>
									{DESTINATARIOS_MESSAGES.mostrando} {safeMeta.from || 0}{" "}
									{DESTINATARIOS_MESSAGES.ate} {safeMeta.to || 0}{" "}
									{DESTINATARIOS_MESSAGES.de} {safeMeta.total || 0}{" "}
									{DESTINATARIOS_LABELS.destinatarios.toLowerCase()}
								</>
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DestinatarisTable
							destinatarios={safeData}
							isFiltered={isFiltered}
							onReset={resetFilters}
							onReload={handleReload}
						/>

						{/* Pagination */}
						<DestinatarissPagination
							links={safeLinks}
							meta={safeMeta}
							isFiltered={isFiltered}
							totalFiltered={safeStats.total_destinatarios}
							onPageClick={handlePageClick}
							onReset={resetFilters}
						/>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}
