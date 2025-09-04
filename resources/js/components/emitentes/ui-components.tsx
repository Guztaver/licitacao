import { Link } from "@inertiajs/react";
import { Edit, FileText, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	EMITENTE_DETAIL_STATS,
	EMITENTE_INFO_FIELDS,
	EMITENTE_LABELS,
	EMITENTE_MESSAGES,
	EMITENTE_STATS_CONFIG,
} from "@/constants/emitentes";
import { emitentes } from "@/routes";
import type { Emitente } from "@/types";

// =============================================================================
// STATISTICS CARD COMPONENT
// =============================================================================

interface EmitenteStatCardProps {
	title: string;
	value: number;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color?: string;
}

export function EmitenteStatCard({
	title,
	value,
	description,
	icon: Icon,
	color = "text-gray-900",
}: EmitenteStatCardProps) {
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

// =============================================================================
// STATISTICS GRID COMPONENT
// =============================================================================

interface EmitenteStatsGridProps {
	stats: Record<string, number>;
	isFiltered: boolean;
}

export function EmitenteStatsGrid({
	stats,
	isFiltered,
}: EmitenteStatsGridProps) {
	const safeStats = useMemo(
		() => ({
			total_emitentes: 0,
			com_requisicoes: 0,
			total_requisicoes: 0,
			sem_atividade: 0,
			...stats,
		}),
		[stats],
	);

	return (
		<div className="grid gap-4 md:grid-cols-4">
			{EMITENTE_STATS_CONFIG.map(
				({ key, title, icon, color, getDescription }) => (
					<EmitenteStatCard
						key={key}
						title={title}
						value={safeStats[key]}
						description={getDescription(isFiltered)}
						icon={icon}
						color={color}
					/>
				),
			)}
		</div>
	);
}

// =============================================================================
// DETAIL STAT CARD COMPONENT
// =============================================================================

interface EmitenteDetailStatCardProps {
	title: string;
	value: number;
	color: string;
	formatter: (value: number) => string;
}

export function EmitenteDetailStatCard({
	title,
	value,
	color,
	formatter,
}: EmitenteDetailStatCardProps) {
	return (
		<div className="text-center">
			<div className={`text-2xl font-bold ${color}`}>{formatter(value)}</div>
			<div className="text-sm text-gray-500">{title}</div>
		</div>
	);
}

// =============================================================================
// DETAIL STATS CARD COMPONENT
// =============================================================================

interface EmitenteDetailStatsCardProps {
	stats: Record<string, number>;
}

export function EmitenteDetailStatsCard({
	stats,
}: EmitenteDetailStatsCardProps) {
	const safeStats = useMemo(
		() => ({
			total_requisicoes: 0,
			requisicoes_concretizadas: 0,
			valor_total: 0,
			requisicoes_mes_atual: 0,
			...stats,
		}),
		[stats],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{EMITENTE_LABELS.statistics}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{EMITENTE_DETAIL_STATS.map(({ key, title, color, format }, index) => (
					<div key={key}>
						<EmitenteDetailStatCard
							title={title}
							value={safeStats[key]}
							color={color}
							formatter={format}
						/>
						{index < EMITENTE_DETAIL_STATS.length - 1 && (
							<div className="border-t pt-4" />
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}

// =============================================================================
// INFO FIELD COMPONENT
// =============================================================================

interface EmitenteInfoFieldProps {
	label: string;
	value: string | undefined | null;
	icon?: React.ComponentType<{ className?: string }>;
	fallback?: string;
}

export function EmitenteInfoField({
	label,
	value,
	icon: Icon,
	fallback = EMITENTE_MESSAGES.noValue,
}: EmitenteInfoFieldProps) {
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

// =============================================================================
// INFO SECTION COMPONENT
// =============================================================================

interface EmitenteInfoSectionProps {
	emitente: Emitente;
	fields: string[];
	gridClass?: string;
}

export function EmitenteInfoSection({
	emitente,
	fields,
	gridClass = "grid-cols-1 gap-6 md:grid-cols-2",
}: EmitenteInfoSectionProps) {
	const filteredFields = EMITENTE_INFO_FIELDS.filter((field) =>
		fields.includes(field.key),
	);

	if (filteredFields.length === 0) return null;

	return (
		<div className={`grid ${gridClass}`}>
			{filteredFields.map((field) => (
				<EmitenteInfoField
					key={field.key}
					label={field.label}
					value={emitente[field.key as keyof Emitente] as string}
					icon={field.icon}
				/>
			))}
		</div>
	);
}

// =============================================================================
// COMPLETE INFO CARD COMPONENT
// =============================================================================

interface EmitenteInfoCardProps {
	emitente: Emitente;
}

export function EmitenteInfoCard({ emitente }: EmitenteInfoCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<FileText className="mr-2 h-5 w-5" />
					{EMITENTE_LABELS.information}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Basic Info */}
				<EmitenteInfoSection
					emitente={emitente}
					fields={["nome", "sigla"]}
					gridClass="grid-cols-1 gap-6 md:grid-cols-2"
				/>

				{/* Address */}
				{emitente.endereco && (
					<EmitenteInfoField
						label="Endereço"
						value={emitente.endereco}
						icon={MapPin}
					/>
				)}

				{/* Contact Info */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{emitente.telefone && (
						<EmitenteInfoField
							label="Telefone"
							value={emitente.telefone}
							icon={Phone}
						/>
					)}
					{emitente.email && (
						<EmitenteInfoField
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
							{EMITENTE_LABELS.observacoes}
						</h3>
						<p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
							{emitente.observacoes}
						</p>
					</div>
				)}

				{/* Timestamps */}
				<EmitenteInfoSection
					emitente={emitente}
					fields={["created_at", "updated_at"]}
					gridClass="grid-cols-1 gap-6 md:grid-cols-2"
				/>
			</CardContent>
		</Card>
	);
}

// =============================================================================
// ACTION BUTTON COMPONENT
// =============================================================================

interface EmitenteActionButtonProps {
	href?: string;
	onClick?: () => void;
	variant?: "default" | "outline" | "destructive";
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	disabled?: boolean;
}

export function EmitenteActionButton({
	href,
	onClick,
	variant = "outline",
	icon: Icon,
	children,
	disabled = false,
}: EmitenteActionButtonProps) {
	const buttonContent = (
		<Button
			variant={variant}
			className="w-full justify-start"
			onClick={onClick}
			disabled={disabled}
		>
			<Icon className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);

	if (href && !disabled) {
		return (
			<Link href={href} className="block">
				{buttonContent}
			</Link>
		);
	}

	return buttonContent;
}

// =============================================================================
// ACTIONS CARD COMPONENT
// =============================================================================

interface EmitenteActionsCardProps {
	emitente: Emitente;
	onDelete: () => void;
}

export function EmitenteActionsCard({
	emitente,
	onDelete,
}: EmitenteActionsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{EMITENTE_LABELS.actions}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<EmitenteActionButton href={emitentes.edit(emitente.id)} icon={Edit}>
					{EMITENTE_LABELS.edit} emitente
				</EmitenteActionButton>
				<EmitenteActionButton
					href={`/requisicoes?emitente_id=${emitente.id}`}
					icon={FileText}
				>
					Ver {EMITENTE_LABELS.requisicoes}
				</EmitenteActionButton>
				<EmitenteActionButton
					onClick={onDelete}
					variant="destructive"
					icon={Trash2}
				>
					{EMITENTE_LABELS.delete} emitente
				</EmitenteActionButton>
			</CardContent>
		</Card>
	);
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================

interface EmitentePaginationProps {
	links: Array<{ url: string | null; label: string; active: boolean }>;
	meta: {
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
	onPageChange: (url: string) => void;
	isFiltered?: boolean;
	filteredTotal?: number;
}

export function EmitentePagination({
	links,
	meta,
	onPageChange,
	isFiltered = false,
	filteredTotal,
}: EmitentePaginationProps) {
	const formatPaginationLabel = (label: string) => {
		if (label.includes("&laquo;")) return "«";
		if (label.includes("&raquo;")) return "»";
		if (label.includes("&hellip;")) return "...";
		return label;
	};

	const displayTotal = isFiltered ? filteredTotal : meta.total;

	if (meta.last_page <= 1) return null;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="text-sm text-gray-700">
				Mostrando {meta.from || 0} até {meta.to || 0} de {displayTotal || 0}{" "}
				resultados
			</div>
			<div className="flex items-center space-x-2">
				{links.map((link) => (
					<Button
						key={link.label}
						variant={link.active ? "default" : "outline"}
						size="sm"
						disabled={!link.url}
						onClick={() => link.url && onPageChange(link.url)}
					>
						{formatPaginationLabel(link.label)}
					</Button>
				))}
			</div>
		</div>
	);
}

// =============================================================================
// FILTER SUMMARY COMPONENT
// =============================================================================

interface EmitenteFilterSummaryProps {
	isFiltered: boolean;
	searchValue: string;
	onClear: () => void;
}

export function EmitenteFilterSummary({
	isFiltered,
	searchValue,
	onClear,
}: EmitenteFilterSummaryProps) {
	if (!isFiltered) return null;

	return (
		<div className="border-t px-4 py-3">
			<div className="flex items-center justify-between text-sm text-gray-600">
				<div>
					Filtros ativos: <span className="font-medium">"{searchValue}"</span>
				</div>
				<Button variant="ghost" size="sm" onClick={onClear}>
					{EMITENTE_LABELS.clearFilters}
				</Button>
			</div>
		</div>
	);
}
