import { useForm, router } from "@inertiajs/react";
import { useCallback, useMemo } from "react";
import { destinatarios } from "@/routes";

export interface DestinatarisFormData {
	nome: string;
	sigla: string;
	endereco: string;
	telefone: string;
	email: string;
	observacoes: string;
}

export interface UseDestinatarisFormOptions {
	initialData?: Partial<DestinatarisFormData>;
	destinatarioId?: number;
	onSuccess?: () => void;
	onError?: (errors: Record<string, string>) => void;
}

// Labels and messages
export const DESTINATARIOS_LABELS = {
	// Page titles
	pageTitle: "Destinatários",
	pageSubtitle: "Gerencie os órgãos destinatários de requisições",
	createTitle: "Novo Destinatário",
	createSubtitle: "Cadastre um novo órgão destinatário de requisições",
	editTitle: "Editar Destinatário",
	editSubtitle: "Atualize as informações do órgão destinatário",
	showTitle: "Destinatário",
	showSubtitle: "Detalhes do órgão destinatário",

	// Form fields
	nome: "Nome",
	sigla: "Sigla",
	endereco: "Endereço",
	telefone: "Telefone",
	email: "E-mail",
	observacoes: "Observações",

	// Actions
	salvar: "Salvar Destinatário",
	salvarAlteracoes: "Salvar Alterações",
	cancelar: "Cancelar",
	voltar: "Voltar",
	editar: "Editar",
	excluir: "Excluir",
	ver: "Ver",
	exportar: "Exportar",
	buscar: "Buscar",
	limpar: "Limpar",
	filtros: "Filtros",

	// Table headers
	nomeESigla: "Nome / Sigla",
	contato: "Contato",
	requisicoes: "Requisições",
	acoes: "Ações",

	// Stats
	totalDestinatarios: "Total Destinatários",
	comRequisicoes: "Com Requisições",
	totalRequisicoes: "Total Requisições",
	semAtividade: "Sem Atividade",
	destinatariosAtivos: "destinatários ativos",
	requisicoesRecebidas: "requisições recebidas",
	semRequisicoes: "sem requisições",

	// Card sections
	informacoesDestinatario: "Informações do Destinatário",
	informacoesDestinatarioDesc:
		"Preencha os dados básicos do órgão destinatário",
	informacoesDestinatarioDescUpdate:
		"Atualize os dados básicos do órgão destinatário",
	estatisticas: "Estatísticas",
	acoesTitulo: "Ações",
	acoesDesc: "Gerenciar este destinatário",

	// Empty states
	nenhumDestinatario: "Nenhum destinatário cadastrado",
	nenhumResultado: "Nenhum destinatário encontrado com os filtros aplicados",
	adicionarPrimeiro: "Adicionar Primeiro Destinatário",
	limparFiltros: "Limpar filtros",
	nenhumaRequisicao: "Nenhuma requisição",
	nenhumaRequisicaoDesc:
		"Este destinatário ainda não possui requisições registradas.",

	// Breadcrumbs
	destinatarios: "Destinatários",
	novoDestinatario: "Novo Destinatário",
} as const;

export const DESTINATARIOS_MESSAGES = {
	// Success messages
	criado: "Destinatário criado com sucesso!",
	atualizado: "Destinatário atualizado com sucesso!",
	excluido: "Destinatário excluído com sucesso!",

	// Confirmation messages
	confirmarExclusao: "Tem certeza que deseja excluir este destinatário?",

	// Loading states
	salvando: "Salvando...",
	carregando: "Carregando...",
	processando: "Processando...",

	// Info messages
	resultadosFiltrados: "nos resultados filtrados",
	cadastradosNoSistema: "cadastrados no sistema",

	// Tips
	dicaTitulo: "Dica",
	dicaConteudo:
		"• O nome deve ser completo e oficial do órgão\n• A sigla será usada para identificação rápida nas listas\n• Informações de contato são opcionais mas recomendadas",

	// Edit info
	infoTitulo: "Informações",
	infoConteudo:
		"• Alterações nos dados do destinatário podem afetar relatórios existentes\n• A sigla é usada para identificação rápida em listas e relatórios\n• Requisições vinculadas a este destinatário não serão alteradas",

	// Filter descriptions
	filtrosDesc: "Use os filtros abaixo para refinar sua busca",
	listaDestinatarios: "Lista de Destinatários",

	// Pagination messages
	mostrando: "Mostrando",
	ate: "até",
	de: "de",
	resultados: "resultados",
	destinatariosEncontrados: "destinatários encontrados",
	nenhumResultadoEncontrado: "(nenhum resultado encontrado)",
	filtrosAtivos: "Filtros ativos:",
} as const;

const DEFAULT_FORM_DATA: DestinatarisFormData = {
	nome: "",
	sigla: "",
	endereco: "",
	telefone: "",
	email: "",
	observacoes: "",
};

export function useDestinatarisForm({
	initialData,
	destinatarioId,
	onSuccess,
	onError,
}: UseDestinatarisFormOptions = {}) {
	const isEditing = Boolean(destinatarioId);

	const { data, setData, post, put, processing, errors, reset } =
		useForm<DestinatarisFormData>({
			...DEFAULT_FORM_DATA,
			...initialData,
		});

	// Form field configurations
	const formFields = useMemo(
		() => [
			{
				name: "nome",
				label: DESTINATARIOS_LABELS.nome,
				placeholder: "Nome completo do órgão",
				type: "text" as const,
				required: true,
				value: data.nome,
				onChange: (value: string) => setData("nome", value),
				error: errors.nome,
				grid: "md:col-span-1",
			},
			{
				name: "sigla",
				label: DESTINATARIOS_LABELS.sigla,
				placeholder: "Ex: SECOM, SEMEC, etc.",
				type: "text" as const,
				required: true,
				transform: "uppercase" as const,
				value: data.sigla,
				onChange: (value: string) => setData("sigla", value.toUpperCase()),
				error: errors.sigla,
				grid: "md:col-span-1",
			},
			{
				name: "endereco",
				label: DESTINATARIOS_LABELS.endereco,
				placeholder: "Endereço completo do órgão",
				type: "text" as const,
				required: false,
				value: data.endereco,
				onChange: (value: string) => setData("endereco", value),
				error: errors.endereco,
				grid: "md:col-span-2",
			},
			{
				name: "telefone",
				label: DESTINATARIOS_LABELS.telefone,
				placeholder: "(XX) XXXXX-XXXX",
				type: "tel" as const,
				required: false,
				value: data.telefone,
				onChange: (value: string) => setData("telefone", value),
				error: errors.telefone,
				grid: "md:col-span-1",
			},
			{
				name: "email",
				label: DESTINATARIOS_LABELS.email,
				placeholder: "contato@orgao.gov.br",
				type: "email" as const,
				required: false,
				value: data.email,
				onChange: (value: string) => setData("email", value),
				error: errors.email,
				grid: "md:col-span-1",
			},
			{
				name: "observacoes",
				label: DESTINATARIOS_LABELS.observacoes,
				placeholder: "Informações adicionais sobre o órgão destinatário...",
				type: "textarea" as const,
				required: false,
				value: data.observacoes,
				onChange: (value: string) => setData("observacoes", value),
				error: errors.observacoes,
				grid: "md:col-span-2",
				rows: 4,
			},
		],
		[data, setData, errors],
	);

	// Submit handler
	const handleSubmit = useCallback(
		(e?: React.FormEvent) => {
			if (e) {
				e.preventDefault();
			}

			if (isEditing && destinatarioId) {
				put(destinatarios.update(destinatarioId), {
					onSuccess,
					onError,
				});
			} else {
				post(destinatarios.store(), {
					onSuccess,
					onError,
				});
			}
		},
		[isEditing, destinatarioId, post, put, onSuccess, onError],
	);

	return {
		// Form state
		data,
		setData,
		errors,
		processing,
		reset,

		// Form configuration
		formFields,
		isEditing,

		// Submission
		handleSubmit,
	};
}

export interface UseDestinatarisFiltersOptions {
	initialFilters?: {
		search?: string;
	};
}

export function useDestinatarisFilters({
	initialFilters,
}: UseDestinatarisFiltersOptions = {}) {
	const { data, setData, get, processing } = useForm({
		search: initialFilters?.search || "",
	});

	const applyFilters = useCallback(() => {
		get(destinatarios.index(), {
			preserveState: true,
			replace: true,
		});
	}, [get]);

	const resetFilters = useCallback(() => {
		setData({ search: "" });
		get(destinatarios.index(), {
			preserveState: true,
			replace: true,
		});
	}, [get, setData]);

	const isFiltered = useMemo(() => {
		return Boolean(data.search);
	}, [data.search]);

	return {
		filters: data,
		setFilters: setData,
		applyFilters,
		resetFilters,
		isFiltered,
		processing,
	};
}

export interface UseDestinatarisActionsOptions {
	onSuccess?: () => void;
	onError?: (error: Record<string, string>) => void;
}

export function useDestinatarisActions({
	onSuccess,
	onError,
}: UseDestinatarisActionsOptions = {}) {
	const deleteDestinatario = useCallback(
		(id: number, name: string) => {
			const confirmed = window.confirm(
				`Tem certeza que deseja excluir o destinatário "${name}"?\n\nEsta ação não pode ser desfeita.`,
			);

			if (confirmed) {
				router.delete(destinatarios.destroy(id), {
					onSuccess,
					onError,
				});
			}
		},
		[onSuccess, onError],
	);

	const exportDestinatarios = useCallback((filters?: { search?: string }) => {
		const params = new URLSearchParams();
		if (filters?.search) {
			params.append("search", filters.search);
		}

		const url = params.toString()
			? `${destinatarios.export()}?${params.toString()}`
			: destinatarios.export();

		window.location.href = url;
	}, []);

	return {
		deleteDestinatario,
		exportDestinatarios,
	};
}

export function useDestinatarisUtils() {
	const formatCurrency = useCallback((value: number): string => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	}, []);

	const formatPhone = useCallback((phone: string): string => {
		const cleaned = phone.replace(/\D/g, "");

		if (cleaned.length === 10) {
			return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
		} else if (cleaned.length === 11) {
			return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
		}

		return phone;
	}, []);

	const getStatusConfig = useCallback((status: string) => {
		const statusConfig = {
			pendente: {
				label: "Pendente",
				variant: "secondary" as const,
				color: "yellow",
			},
			aprovado: {
				label: "Aprovado",
				variant: "default" as const,
				color: "green",
			},
			rejeitado: {
				label: "Rejeitado",
				variant: "destructive" as const,
				color: "red",
			},
		};

		return (
			statusConfig[status as keyof typeof statusConfig] || {
				label: status,
				variant: "secondary" as const,
				color: "gray",
			}
		);
	}, []);

	const formatDate = useCallback((dateString: string): string => {
		try {
			return new Date(dateString).toLocaleDateString("pt-BR");
		} catch {
			return dateString;
		}
	}, []);

	return {
		formatCurrency,
		formatPhone,
		getStatusConfig,
		formatDate,
	};
}
