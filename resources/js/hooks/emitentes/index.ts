import { router, useForm } from "@inertiajs/react";
import { useMemo } from "react";
import {
	EMITENTE_LABELS,
	EMITENTE_MESSAGES,
	type EmitenteFormData,
} from "@/constants/emitentes";
import { emitentes } from "@/routes";
import type { BreadcrumbItem, Emitente } from "@/types";

// =============================================================================
// FORM HOOKS
// =============================================================================

/**
 * Hook for managing Emitente form state and actions
 */
export function useEmitenteForm(
	initialData?: Partial<EmitenteFormData>,
	emitenteId?: number,
) {
	const defaultData: EmitenteFormData = {
		nome: "",
		sigla: "",
		endereco: "",
		telefone: "",
		email: "",
		observacoes: "",
		...initialData,
	};

	const { data, setData, post, put, processing, errors, clearErrors } =
		useForm<EmitenteFormData>(defaultData);

	// Memoized handlers
	const handleFieldChange = useMemo(
		() => (name: string, value: string) => {
			setData(name as keyof EmitenteFormData, value);
			if (errors[name as keyof EmitenteFormData]) {
				clearErrors(name as keyof EmitenteFormData);
			}
		},
		[setData, errors, clearErrors],
	);

	const handleObservationsChange = useMemo(
		() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setData("observacoes", e.target.value);
			if (errors.observacoes) {
				clearErrors("observacoes");
			}
		},
		[setData, errors.observacoes, clearErrors],
	);

	const handleSubmit = useMemo(
		() => (e: React.FormEvent) => {
			e.preventDefault();
			if (emitenteId) {
				put(emitentes.update(emitenteId));
			} else {
				post(emitentes.store());
			}
		},
		[post, put, emitenteId],
	);

	const handleCancel = useMemo(() => {
		if (emitenteId) {
			return () => router.visit(emitentes.show(emitenteId));
		}
		return () => router.visit(emitentes.index());
	}, [emitenteId]);

	return {
		data,
		setData,
		processing,
		errors,
		handleFieldChange,
		handleObservationsChange,
		handleSubmit,
		handleCancel,
		clearErrors,
	};
}

/**
 * Hook for managing Emitente creation form
 */
export function useEmitenteCreate() {
	return useEmitenteForm();
}

/**
 * Hook for managing Emitente edit form
 */
export function useEmitenteEdit(emitente: Emitente) {
	const initialData: EmitenteFormData = useMemo(
		() => ({
			nome: emitente.nome || "",
			sigla: emitente.sigla || "",
			endereco: emitente.endereco || "",
			telefone: emitente.telefone || "",
			email: emitente.email || "",
			observacoes: emitente.observacoes || "",
		}),
		[emitente],
	);

	return useEmitenteForm(initialData, emitente.id);
}

// =============================================================================
// FILTER HOOKS
// =============================================================================

/**
 * Hook for managing Emitente list filters
 */
export function useEmitenteFilters(initialFilters?: { search?: string }) {
	const { data, setData, get, processing } = useForm({
		search: initialFilters?.search || "",
	});

	const isFiltered = useMemo(() => data.search !== "", [data.search]);

	const handleSearch = useMemo(
		() => (e: React.FormEvent) => {
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

	const handleSearchChange = useMemo(
		() => (value: string) => {
			setData("search", value);
		},
		[setData],
	);

	return {
		filters: data,
		setFilters: setData,
		processing,
		isFiltered,
		handleSearch,
		handleReset,
		handleSearchChange,
	};
}

// =============================================================================
// NAVIGATION HOOKS
// =============================================================================

/**
 * Hook for managing Emitente pagination
 */
export function useEmitentePagination() {
	const handlePaginationClick = useMemo(
		() => (url: string) => {
			router.get(url);
		},
		[],
	);

	return {
		handlePaginationClick,
	};
}

/**
 * Hook for managing Emitente breadcrumbs
 */
export function useEmitenteBreadcrumbs(
	page: "index" | "create" | "edit" | "show",
	emitente?: Emitente,
): BreadcrumbItem[] {
	return useMemo(() => {
		const breadcrumbs: BreadcrumbItem[] = [
			{
				title: EMITENTE_LABELS.index,
				href: emitentes.index(),
			},
		];

		switch (page) {
			case "create":
				breadcrumbs.push({
					title: EMITENTE_LABELS.create,
					href: emitentes.create(),
				});
				break;
			case "edit":
				if (emitente) {
					breadcrumbs.push(
						{
							title: emitente.nome,
							href: emitentes.show(emitente.id),
						},
						{
							title: EMITENTE_LABELS.edit,
							href: emitentes.edit(emitente.id),
						},
					);
				}
				break;
			case "show":
				if (emitente) {
					breadcrumbs.push({
						title: emitente.nome,
						href: emitentes.show(emitente.id),
					});
				}
				break;
		}

		return breadcrumbs;
	}, [page, emitente]);
}

// =============================================================================
// ACTION HOOKS
// =============================================================================

/**
 * Hook for managing Emitente actions (delete, export, etc.)
 */
export function useEmitenteActions() {
	const handleDelete = useMemo(
		() => (emitente: Emitente) => {
			if (
				confirm(
					`${EMITENTE_LABELS.deleteConfirmMessage}\n\nEmitente: ${emitente.nome}`,
				)
			) {
				router.delete(emitentes.destroy(emitente.id), {
					onSuccess: () => {
						// Handle success if needed
					},
				});
			}
		},
		[],
	);

	const handleExport = useMemo(
		() => (filters?: Record<string, string>) => {
			const params = new URLSearchParams(filters);
			window.location.href = `${emitentes.export()}?${params.toString()}`;
		},
		[],
	);

	const handleReload = useMemo(() => () => router.reload(), []);

	return {
		handleDelete,
		handleExport,
		handleReload,
	};
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook for formatting Emitente data
 */
export function useEmitenteFormatters() {
	const formatContactInfo = useMemo(
		() => (telefone?: string, email?: string) => {
			if (!telefone && !email) return EMITENTE_MESSAGES.contactNotProvided;

			const parts = [];
			if (telefone) parts.push(telefone);
			if (email) parts.push(email);
			return parts.join(" | ");
		},
		[],
	);

	const formatRequisicoesCount = useMemo(
		() => (count: number) => `${count || 0} requisições`,
		[],
	);

	const formatCurrency = useMemo(
		() => (value: string | number | null | undefined) => {
			if (!value || Number(value) === 0) return EMITENTE_MESSAGES.noValue;
			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(Number(value));
		},
		[],
	);

	const formatDate = useMemo(
		() => (date: string | null | undefined) => {
			return date || EMITENTE_MESSAGES.noValue;
		},
		[],
	);

	const formatPaginationLabel = useMemo(
		() => (label: string) => {
			if (label.includes("&laquo;")) return "«";
			if (label.includes("&raquo;")) return "»";
			if (label.includes("&hellip;")) return "...";
			return label;
		},
		[],
	);

	return {
		formatContactInfo,
		formatRequisicoesCount,
		formatCurrency,
		formatDate,
		formatPaginationLabel,
	};
}

/**
 * Hook for managing Emitente status
 */
export function useEmitenteStatus() {
	const getStatusVariant = useMemo(
		() => (status: string) => {
			switch (status.toLowerCase()) {
				case "ativo":
					return "default";
				case "inativo":
					return "secondary";
				default:
					return "secondary";
			}
		},
		[],
	);

	const getStatusLabel = useMemo(
		() => (status: string) => {
			switch (status.toLowerCase()) {
				case "ativo":
					return "Ativo";
				case "inativo":
					return "Inativo";
				default:
					return status;
			}
		},
		[],
	);

	return {
		getStatusVariant,
		getStatusLabel,
	};
}

// =============================================================================
// STATS HOOKS
// =============================================================================

/**
 * Hook for managing safe statistics data
 */
export function useEmitenteStats(stats?: Record<string, number>) {
	return useMemo(
		() => ({
			total_emitentes: 0,
			com_requisicoes: 0,
			total_requisicoes: 0,
			sem_atividade: 0,
			requisicoes_concretizadas: 0,
			valor_total: 0,
			requisicoes_mes_atual: 0,
			...stats,
		}),
		[stats],
	);
}

// =============================================================================
// VALIDATION HOOKS
// =============================================================================

/**
 * Hook for client-side validation
 */
export function useEmitenteValidation() {
	const validateField = useMemo(
		() => (field: keyof EmitenteFormData, value: string) => {
			switch (field) {
				case "nome":
					if (!value.trim()) return "Nome é obrigatório";
					if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres";
					if (value.length > 255)
						return "Nome deve ter no máximo 255 caracteres";
					break;
				case "sigla":
					if (!value.trim()) return "Sigla é obrigatória";
					if (value.length < 2) return "Sigla deve ter pelo menos 2 caracteres";
					if (value.length > 10)
						return "Sigla deve ter no máximo 10 caracteres";
					if (!/^[A-Z0-9]+$/.test(value))
						return "Sigla deve conter apenas letras maiúsculas e números";
					break;
				case "email":
					if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
						return "Formato de email inválido";
					break;
				case "telefone":
					if (value && !/^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(value))
						return "Formato de telefone inválido";
					break;
				case "endereco":
					if (value.length > 500)
						return "Endereço deve ter no máximo 500 caracteres";
					break;
				case "observacoes":
					if (value.length > 1000)
						return "Observações devem ter no máximo 1000 caracteres";
					break;
			}
			return null;
		},
		[],
	);

	const validateForm = useMemo(
		() => (data: EmitenteFormData) => {
			const errors: Partial<Record<keyof EmitenteFormData, string>> = {};
			let hasErrors = false;

			(Object.keys(data) as Array<keyof EmitenteFormData>).forEach((field) => {
				const error = validateField(field, data[field]);
				if (error) {
					errors[field] = error;
					hasErrors = true;
				}
			});

			return { errors, hasErrors };
		},
		[validateField],
	);

	return {
		validateField,
		validateForm,
	};
}
