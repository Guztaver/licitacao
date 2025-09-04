import { Button } from "@/components/ui/button";
import { DESTINATARIOS_MESSAGES } from "@/hooks/use-destinatarios";

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

interface DestinatarissPaginationProps {
	links: PaginationLink[];
	meta: PaginationMeta;
	isFiltered: boolean;
	totalFiltered?: number;
	onPageClick: (url: string) => void;
	onReset?: () => void;
}

const formatPaginationLabel = (label: string): string => {
	return label
		.replace("&laquo;", "«")
		.replace("&raquo;", "»")
		.replace("&hellip;", "...");
};

export default function DestinatarissPagination({
	links,
	meta,
	isFiltered,
	totalFiltered,
	onPageClick,
	onReset,
}: DestinatarissPaginationProps) {
	const showPagination = meta.last_page > 1;
	const hasResults = (meta.to || 0) > 0;

	if (!hasResults && !isFiltered) {
		return null;
	}

	return (
		<div className="space-y-4">
			{/* Filter Summary */}
			{isFiltered && hasResults && onReset && (
				<div className="border-t px-4 py-3">
					<div className="flex items-center justify-between text-sm text-gray-600">
						<div>
							{DESTINATARIOS_MESSAGES.filtrosAtivos}{" "}
							<span className="font-medium">filtros aplicados</span>
						</div>
						<Button variant="ghost" size="sm" onClick={onReset}>
							{DESTINATARIOS_MESSAGES.filtrosAtivos.replace(":", "")} limpar
						</Button>
					</div>
				</div>
			)}

			{/* Pagination */}
			{showPagination && (
				<div className="flex items-center justify-between px-2 py-4">
					<div className="text-sm text-gray-700">
						{DESTINATARIOS_MESSAGES.mostrando} {meta.from || 0}{" "}
						{DESTINATARIOS_MESSAGES.ate} {meta.to || 0}{" "}
						{DESTINATARIOS_MESSAGES.de}{" "}
						{isFiltered && totalFiltered !== undefined
							? totalFiltered
							: meta.total || 0}{" "}
						{DESTINATARIOS_MESSAGES.resultados}
					</div>
					<div className="flex items-center space-x-2">
						{links.map((link, index) => (
							<Button
								key={`${link.label}-${index}`}
								variant={link.active ? "default" : "outline"}
								size="sm"
								disabled={!link.url}
								onClick={() => link.url && onPageClick(link.url)}
							>
								{formatPaginationLabel(link.label)}
							</Button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
