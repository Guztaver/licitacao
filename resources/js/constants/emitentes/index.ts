import { Building, Mail, MapPin, Phone } from 'lucide-react';

// =============================================================================
// FIELD CONFIGURATIONS
// =============================================================================

export const EMITENTE_FORM_FIELDS = [
    {
        name: 'nome' as const,
        label: 'Nome',
        type: 'text',
        placeholder: 'Nome completo do órgão',
        required: true,
        gridClass: 'md:col-span-1',
        transform: undefined,
        group: 'basic',
    },
    {
        name: 'sigla' as const,
        label: 'Sigla',
        type: 'text',
        placeholder: 'Ex: SECOM, SEMEC, etc.',
        required: true,
        gridClass: 'md:col-span-1',
        transform: (value: string) => value.toUpperCase(),
        group: 'basic',
    },
    {
        name: 'endereco' as const,
        label: 'Endereço',
        type: 'text',
        placeholder: 'Endereço completo do órgão',
        required: false,
        gridClass: 'md:col-span-2',
        transform: undefined,
        group: 'address',
    },
    {
        name: 'telefone' as const,
        label: 'Telefone',
        type: 'tel',
        placeholder: '(XX) XXXXX-XXXX',
        required: false,
        gridClass: 'md:col-span-1',
        transform: undefined,
        group: 'contact',
    },
    {
        name: 'email' as const,
        label: 'E-mail',
        type: 'email',
        placeholder: 'contato@orgao.gov.br',
        required: false,
        gridClass: 'md:col-span-1',
        transform: undefined,
        group: 'contact',
    },
] as const;

// =============================================================================
// TABLE CONFIGURATIONS
// =============================================================================

export const EMITENTE_TABLE_COLUMNS = [
    {
        key: 'nome_sigla',
        label: 'Nome / Sigla',
        sortable: true,
    },
    {
        key: 'contato',
        label: 'Contato',
        sortable: false,
    },
    {
        key: 'requisicoes',
        label: 'Requisições',
        sortable: true,
    },
    {
        key: 'acoes',
        label: 'Ações',
        sortable: false,
    },
] as const;

// =============================================================================
// STATISTICS CONFIGURATIONS
// =============================================================================

export const EMITENTE_STATS_CONFIG = [
    {
        key: 'total_emitentes' as const,
        title: 'Total Emitentes',
        icon: Building,
        color: 'text-gray-900',
        getDescription: (isFiltered: boolean) => (isFiltered ? 'nos resultados filtrados' : 'cadastrados no sistema'),
    },
    {
        key: 'com_requisicoes' as const,
        title: 'Com Requisições',
        icon: Building,
        color: 'text-gray-900',
        getDescription: () => 'emitentes ativos',
    },
    {
        key: 'total_requisicoes' as const,
        title: 'Total Requisições',
        icon: Building,
        color: 'text-gray-900',
        getDescription: () => 'requisições emitidas',
    },
    {
        key: 'sem_atividade' as const,
        title: 'Sem Atividade',
        icon: Building,
        color: 'text-gray-900',
        getDescription: () => 'sem requisições',
    },
] as const;

export const EMITENTE_DETAIL_STATS = [
    {
        key: 'total_requisicoes' as const,
        title: 'Requisições totais',
        color: 'text-grey-600',
        format: (value: number) => value.toString(),
    },
    {
        key: 'requisicoes_concretizadas' as const,
        title: 'Concretizadas',
        color: 'text-grey-600',
        format: (value: number) => value.toString(),
    },
    {
        key: 'valor_total' as const,
        title: 'Valor total',
        color: 'text-grey-600',
        format: (value: number) =>
            new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value),
    },
    {
        key: 'requisicoes_mes_atual' as const,
        title: 'Este mês',
        color: 'text-grey-600',
        format: (value: number) => value.toString(),
    },
] as const;

// =============================================================================
// STATUS CONFIGURATIONS
// =============================================================================

export const EMITENTE_STATUS_CONFIG = {
    pendente: { label: 'Pendente', variant: 'secondary' as const },
    aprovado: { label: 'Aprovado', variant: 'default' as const },
    rejeitado: { label: 'Rejeitado', variant: 'destructive' as const },
} as const;

// =============================================================================
// INFO FIELD CONFIGURATIONS
// =============================================================================

export const EMITENTE_INFO_FIELDS = [
    {
        key: 'nome' as const,
        label: 'Nome',
        icon: undefined,
        group: 'basic',
        gridClass: 'md:col-span-1',
    },
    {
        key: 'sigla' as const,
        label: 'Sigla',
        icon: undefined,
        group: 'basic',
        gridClass: 'md:col-span-1',
    },
    {
        key: 'endereco' as const,
        label: 'Endereço',
        icon: MapPin,
        group: 'address',
        gridClass: 'md:col-span-2',
    },
    {
        key: 'telefone' as const,
        label: 'Telefone',
        icon: Phone,
        group: 'contact',
        gridClass: 'md:col-span-1',
    },
    {
        key: 'email' as const,
        label: 'E-mail',
        icon: Mail,
        group: 'contact',
        gridClass: 'md:col-span-1',
    },
    {
        key: 'observacoes' as const,
        label: 'Observações',
        icon: undefined,
        group: 'details',
        gridClass: 'md:col-span-2',
    },
    {
        key: 'created_at' as const,
        label: 'Criado em',
        icon: undefined,
        group: 'timestamps',
        gridClass: 'md:col-span-1',
    },
    {
        key: 'updated_at' as const,
        label: 'Última atualização',
        icon: undefined,
        group: 'timestamps',
        gridClass: 'md:col-span-1',
    },
] as const;

// =============================================================================
// LABELS & TITLES
// =============================================================================

export const EMITENTE_LABELS = {
    // Page Titles
    index: 'Emitentes',
    create: 'Novo Emitente',
    edit: 'Editar Emitente',
    show: 'Detalhes do Emitente',

    // Section Titles
    information: 'Informações do Emitente',
    contact: 'Contato',
    statistics: 'Estatísticas',
    actions: 'Ações',
    filters: 'Filtros',
    requisicoes: 'Requisições',

    // Button Labels
    save: 'Salvar Emitente',
    saveChanges: 'Salvar Alterações',
    saving: 'Salvando...',
    cancel: 'Cancelar',
    back: 'Voltar',
    editAction: 'Editar',
    delete: 'Excluir',
    export: 'Exportar',
    search: 'Buscar',
    clear: 'Limpar',
    clearFilters: 'Limpar filtros',
    view: 'Ver',
    addFirst: 'Adicionar Primeiro Emitente',

    // Form Labels
    observacoes: 'Observações',
    observacoesPlaceholder: 'Informações adicionais sobre o órgão emitente...',

    // Modal & Dialog Labels
    deleteConfirmTitle: 'Confirmar Exclusão',
    deleteConfirmMessage: 'Tem certeza que deseja excluir este emitente?',
    deleteConfirmButton: 'Excluir',
    cancelButton: 'Cancelar',
} as const;

// =============================================================================
// MESSAGES
// =============================================================================

export const EMITENTE_MESSAGES = {
    // Descriptions
    indexDescription: 'Gerencie os órgãos emitentes de requisições',
    createDescription: 'Cadastre um novo órgão emitente de requisições',
    editDescription: 'Atualize as informações do órgão emitente',
    showDescription: 'Detalhes do órgão emitente',

    // Form Descriptions
    formDescription: 'Preencha os dados básicos do órgão emitente',
    editFormDescription: 'Atualize os dados básicos do órgão emitente',

    // Filter Descriptions
    filtersDescription: 'Use os filtros abaixo para refinar sua busca',

    // Empty States
    noResults: 'Nenhum emitente encontrado com os filtros aplicados',
    noData: 'Nenhum emitente cadastrado',
    noRequisicoes: 'Nenhuma requisição',
    noRequisicoesDescription: 'Este emitente ainda não possui requisições registradas.',

    // Placeholders
    searchPlaceholder: 'Buscar por nome ou sigla...',

    // Default Values
    contactNotProvided: '-',
    noValue: '-',

    // Success Messages
    createSuccess: 'Emitente criado com sucesso',
    updateSuccess: 'Emitente atualizado com sucesso',
    deleteSuccess: 'Emitente excluído com sucesso',
} as const;

// =============================================================================
// TIPS & HELP
// =============================================================================

export const EMITENTE_TIPS = {
    create: [
        'O nome deve ser completo e oficial do órgão',
        'A sigla será usada para identificação rápida nas listas',
        'Informações de contato são opcionais mas recomendadas',
    ],
    edit: [
        'Alterações nos dados do emitente podem afetar relatórios existentes',
        'A sigla é usada para identificação rápida em listas e relatórios',
        'Requisições vinculadas a este emitente não serão alteradas',
    ],
    general: [
        'Emitentes são órgãos que solicitam requisições',
        'Cada requisição deve estar vinculada a um emitente',
        'Use siglas padronizadas para facilitar a identificação',
    ],
} as const;

// =============================================================================
// PAGINATION CONFIGURATIONS
// =============================================================================

export const EMITENTE_PAGINATION = {
    perPage: 15,
    showingText: 'Mostrando',
    toText: 'a',
    ofText: 'de',
    resultsText: 'resultados',
    noResultsText: 'nenhum resultado encontrado',
    previousLabel: '«',
    nextLabel: '»',
    ellipsisLabel: '...',
} as const;

// =============================================================================
// BREADCRUMB CONFIGURATIONS
// =============================================================================

export const EMITENTE_BREADCRUMBS = {
    index: { title: 'Emitentes' },
    create: { title: 'Novo Emitente' },
    edit: { title: 'Editar' },
    show: (nome: string) => ({ title: nome }),
} as const;

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const EMITENTE_VALIDATION = {
    nome: {
        required: true,
        minLength: 2,
        maxLength: 255,
        message: 'Nome é obrigatório e deve ter entre 2 e 255 caracteres',
    },
    sigla: {
        required: true,
        minLength: 2,
        maxLength: 10,
        pattern: /^[A-Z0-9]+$/,
        message: 'Sigla é obrigatória, deve ter entre 2 e 10 caracteres em maiúsculas',
    },
    endereco: {
        required: false,
        maxLength: 500,
        message: 'Endereço deve ter no máximo 500 caracteres',
    },
    telefone: {
        required: false,
        pattern: /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
        message: 'Formato de telefone inválido',
    },
    email: {
        required: false,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Formato de email inválido',
    },
    observacoes: {
        required: false,
        maxLength: 1000,
        message: 'Observações devem ter no máximo 1000 caracteres',
    },
} as const;

// =============================================================================
// EXPORT CONFIGURATIONS
// =============================================================================

export const EMITENTE_EXPORT = {
    filename: 'emitentes',
    formats: ['xlsx', 'csv', 'pdf'] as const,
    defaultFormat: 'xlsx' as const,
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type EmitenteFormField = (typeof EMITENTE_FORM_FIELDS)[number];
export type EmitenteTableColumn = (typeof EMITENTE_TABLE_COLUMNS)[number];
export type EmitenteStatConfig = (typeof EMITENTE_STATS_CONFIG)[number];
export type EmitenteDetailStat = (typeof EMITENTE_DETAIL_STATS)[number];
export type EmitenteInfoField = (typeof EMITENTE_INFO_FIELDS)[number];
export type EmitenteStatus = keyof typeof EMITENTE_STATUS_CONFIG;
export type EmitenteFormData = {
    nome: string;
    sigla: string;
    endereco: string;
    telefone: string;
    email: string;
    observacoes: string;
};
