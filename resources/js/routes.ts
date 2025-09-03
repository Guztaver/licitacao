export const home = () => '/';
export const dashboard = () => '/dashboard';

// Auth routes
export const login = () => '/login';
export const register = () => '/register';
export const forgotPassword = () => '/forgot-password';
export const resetPassword = (token: string) => `/reset-password/${token}`;
export const verifyEmail = () => '/verify-email';
export const logout = () => '/logout';

export const fornecedores = {
    index: () => '/fornecedores',
    create: () => '/fornecedores/create',
    show: (id: number) => `/fornecedores/${id}`,
    edit: (id: number) => `/fornecedores/${id}/edit`,
    export: () => '/fornecedores-export',
    search: () => '/fornecedores-search',
};

export const requisicoes = {
    index: () => '/requisicoes',
    create: () => '/requisicoes/create',
    store: () => '/requisicoes',
    show: (id: number) => `/requisicoes/${id}`,
    edit: (id: number) => `/requisicoes/${id}/edit`,
    update: (id: number) => `/requisicoes/${id}`,
    destroy: (id: number) => `/requisicoes/${id}`,
    concretizar: (id: number) => `/requisicoes/${id}/concretizar`,
    cancelar: (id: number) => `/requisicoes/${id}/cancelar`,
    export: () => '/requisicoes-export',
    excluidas: () => '/requisicoes-excluidas',
    pdf: (id: number) => `/requisicoes/${id}/pdf`,
    anexo: (id: number) => `/requisicoes/${id}/anexo`,
};

export const conferencias = {
    index: () => '/conferencias',
    create: () => '/conferencias/create',
    show: (id: number) => `/conferencias/${id}`,
    edit: (id: number) => `/conferencias/${id}/edit`,
    destroy: (id: number) => `/conferencias/${id}`,
    export: () => '/conferencias-export',
    fornecedor: (fornecedorId: number, periodo: string) => `/conferencias/fornecedor/${fornecedorId}/${periodo}`,
};

export const emitentes = {
    index: () => '/emitentes',
    create: () => '/emitentes/create',
    show: (id: number) => `/emitentes/${id}`,
    edit: (id: number) => `/emitentes/${id}/edit`,
    export: () => '/emitentes-export',
};

export const destinatarios = {
    index: () => '/destinatarios',
    create: () => '/destinatarios/create',
    store: () => '/destinatarios',
    show: (id: number) => `/destinatarios/${id}`,
    edit: (id: number) => `/destinatarios/${id}/edit`,
    update: (id: number) => `/destinatarios/${id}`,
    destroy: (id: number) => `/destinatarios/${id}`,
    export: () => '/destinatarios-export',
};

export const relatorios = {
    index: () => '/relatorios',
    requisicoes: () => '/relatorios/requisicoes',
    fornecedores: () => '/relatorios/fornecedores',
    conferencias: () => '/relatorios/conferencias',
};

// Settings routes
export const settings = {
    index: () => '/settings',
    profile: () => '/settings/profile',
    password: () => '/settings/password',
    appearance: () => '/settings/appearance',
    sessions: () => '/settings/sessions',
    deleteAccount: () => '/settings/delete-account',
};

export const appearance = () => '/settings/appearance';

// System configurations
export const configuracoes = {
    index: () => '/configuracoes',
    edit: () => '/configuracoes/edit',
};

// Auth specific routes for backwards compatibility
export const password = {
    request: () => '/forgot-password',
    reset: () => '/reset-password',
    edit: () => '/settings/password',
};

export const profile = {
    edit: () => '/settings/profile',
    update: () => '/settings/profile',
};

export const verification = {
    send: () => '/verify-email',
    notice: () => '/verify-email',
};

// Quick actions helper
export const quickActions = {
    newRequisicao: () => requisicoes.create(),
    newFornecedor: () => fornecedores.create(),
    newConferencia: () => conferencias.create(),
    newEmitente: () => emitentes.create(),
    newDestinatario: () => destinatarios.create(),
};
