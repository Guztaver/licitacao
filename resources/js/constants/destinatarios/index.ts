// Labels and text constants
export const LABELS = {
    // Page titles
    pageTitle: 'Destinatários',
    pageSubtitle: 'Gerencie os órgãos destinatários de requisições',
    createTitle: 'Novo Destinatário',
    createSubtitle: 'Cadastre um novo órgão destinatário de requisições',
    editTitle: 'Editar Destinatário',
    editSubtitle: 'Atualize as informações do órgão destinatário',
    showTitle: 'Detalhes do Destinatário',
    showSubtitle: 'Detalhes do órgão destinatário',

    // Form fields
    nome: 'Nome',
    sigla: 'Sigla',
    endereco: 'Endereço',
    telefone: 'Telefone',
    email: 'E-mail',
    observacoes: 'Observações',

    // Actions
    salvar: 'Salvar Destinatário',
    salvarAlteracoes: 'Salvar Alterações',
    cancelar: 'Cancelar',
    voltar: 'Voltar',
    editar: 'Editar',
    excluir: 'Excluir',
    ver: 'Ver',
    exportar: 'Exportar',
    buscar: 'Buscar',
    limpar: 'Limpar',
    filtros: 'Filtros',

    // Table headers
    nomeESigla: 'Nome / Sigla',
    contato: 'Contato',
    requisicoes: 'Requisições',
    acoes: 'Ações',

    // Stats
    totalDestinatarios: 'Total Destinatários',
    comRequisicoes: 'Com Requisições',
    totalRequisicoes: 'Total Requisições',
    semAtividade: 'Sem Atividade',
    destinatariosAtivos: 'destinatários ativos',
    requisicoesRecebidas: 'requisições recebidas',
    semRequisicoes: 'sem requisições',

    // Card sections
    informacoesDestinatario: 'Informações do Destinatário',
    informacoesDestinatarioDesc: 'Preencha os dados básicos do órgão destinatário',
    informacoesDestinatarioDescUpdate: 'Atualize os dados básicos do órgão destinatário',
    estatisticas: 'Estatísticas',
    acoesTitulo: 'Ações',
    acoesDesc: 'Gerenciar este destinatário',

    // Empty states
    nenhumDestinatario: 'Nenhum destinatário cadastrado',
    nenhumResultado: 'Nenhum destinatário encontrado com os filtros aplicados',
    adicionarPrimeiro: 'Adicionar Primeiro Destinatário',
    limparFiltros: 'Limpar filtros',
    nenhumaRequisicao: 'Nenhuma requisição',
    nenhumaRequisicaoDesc: 'Este destinatário ainda não possui requisições registradas.',

    // Breadcrumbs
    destinatarios: 'Destinatários',
    novoDestinatario: 'Novo Destinatário',
} as const;

// Placeholders
export const PLACEHOLDERS = {
    nome: 'Nome completo do órgão',
    sigla: 'Ex: SECOM, SEMEC, etc.',
    endereco: 'Endereço completo do órgão',
    telefone: '(XX) XXXXX-XXXX',
    email: 'contato@orgao.gov.br',
    observacoes: 'Informações adicionais sobre o órgão destinatário...',
    buscar: 'Buscar por nome ou sigla...',
} as const;

// Messages
export const MESSAGES = {
    // Success messages
    criado: 'Destinatário criado com sucesso!',
    atualizado: 'Destinatário atualizado com sucesso!',
    excluido: 'Destinatário excluído com sucesso!',

    // Confirmation messages
    confirmarExclusao: 'Tem certeza que deseja excluir este destinatário?',

    // Loading states
    salvando: 'Salvando...',
    carregando: 'Carregando...',
    processando: 'Processando...',

    // Info messages
    resultadosFiltrados: 'nos resultados filtrados',
    cadastradosNoSistema: 'cadastrados no sistema',

    // Tips
    dicaTitulo: 'Dica',
    dicaConteudo: [
        '• O nome deve ser completo e oficial do órgão',
        '• A sigla será usada para identificação rápida nas listas',
        '• Informações de contato são opcionais mas recomendadas',
    ].join('\n'),

    // Edit info
    infoTitulo: 'Informações',
    infoConteudo: [
        '• Alterações nos dados do destinatário podem afetar relatórios existentes',
        '• A sigla é usada para identificação rápida em listas e relatórios',
        '• Requisições vinculadas a este destinatário não serão alteradas',
    ].join('\n'),

    // Filter descriptions
    filtrosDesc: 'Use os filtros abaixo para refinar sua busca',
    listaDestinatarios: 'Lista de Destinatários',

    // Pagination messages
    mostrando: 'Mostrando',
    ate: 'até',
    de: 'de',
    resultados: 'resultados',
    destinatariosEncontrados: 'destinatários encontrados',
    nenhumResultadoEncontrado: '(nenhum resultado encontrado)',
    filtrosAtivos: 'Filtros ativos:',
} as const;

// Form field configurations
export const FORM_FIELDS = {
    nome: {
        name: 'nome' as const,
        label: LABELS.nome,
        placeholder: PLACEHOLDERS.nome,
        type: 'text' as const,
        required: true,
        validation: {
            required: 'Nome é obrigatório',
            minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
            maxLength: {
                value: 255,
                message: 'Nome não pode exceder 255 caracteres',
            },
        },
        grid: 'md:col-span-1',
    },
    sigla: {
        name: 'sigla' as const,
        label: LABELS.sigla,
        placeholder: PLACEHOLDERS.sigla,
        type: 'text' as const,
        required: true,
        transform: 'uppercase' as const,
        validation: {
            required: 'Sigla é obrigatória',
            minLength: {
                value: 2,
                message: 'Sigla deve ter pelo menos 2 caracteres',
            },
            maxLength: { value: 10, message: 'Sigla não pode exceder 10 caracteres' },
        },
        grid: 'md:col-span-1',
    },
    endereco: {
        name: 'endereco' as const,
        label: LABELS.endereco,
        placeholder: PLACEHOLDERS.endereco,
        type: 'text' as const,
        required: false,
        validation: {
            maxLength: {
                value: 500,
                message: 'Endereço não pode exceder 500 caracteres',
            },
        },
        grid: 'md:col-span-2',
    },
    telefone: {
        name: 'telefone' as const,
        label: LABELS.telefone,
        placeholder: PLACEHOLDERS.telefone,
        type: 'tel' as const,
        required: false,
        validation: {
            pattern: {
                value: /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/,
                message: 'Formato de telefone inválido',
            },
        },
        grid: 'md:col-span-1',
    },
    email: {
        name: 'email' as const,
        label: LABELS.email,
        placeholder: PLACEHOLDERS.email,
        type: 'email' as const,
        required: false,
        validation: {
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Formato de e-mail inválido',
            },
        },
        grid: 'md:col-span-1',
    },
    observacoes: {
        name: 'observacoes' as const,
        label: LABELS.observacoes,
        placeholder: PLACEHOLDERS.observacoes,
        type: 'textarea' as const,
        required: false,
        validation: {
            maxLength: {
                value: 1000,
                message: 'Observações não podem exceder 1000 caracteres',
            },
        },
        grid: 'md:col-span-2',
        rows: 4,
    },
} as const;

// Default form data
export const DEFAULT_FORM_DATA = {
    nome: '',
    sigla: '',
    endereco: '',
    telefone: '',
    email: '',
    observacoes: '',
} as const;

// Status configurations for requisitions
export const STATUS_CONFIG = {
    pendente: {
        label: 'Pendente',
        variant: 'secondary' as const,
        color: 'yellow',
    },
    aprovado: {
        label: 'Aprovado',
        variant: 'default' as const,
        color: 'green',
    },
    rejeitado: {
        label: 'Rejeitado',
        variant: 'destructive' as const,
        color: 'red',
    },
} as const;

// Export all constants
export const DESTINATARIOS_CONSTANTS = {
    LABELS,
    PLACEHOLDERS,
    MESSAGES,
    FORM_FIELDS,
    DEFAULT_FORM_DATA,
    STATUS_CONFIG,
} as const;

export default DESTINATARIOS_CONSTANTS;
