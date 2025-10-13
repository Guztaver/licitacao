import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Fornecedor {
    id: number;
    razao_social: string;
    cnpj: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    contato?: string;
    status: boolean;
    observacoes?: string;
    created_at: string;
    updated_at: string;
    // Computed attributes
    cnpj_formatado?: string;
    status_display?: string;
    status_color?: string;
    telefone_formatado?: string;
    endereco_completo?: string;
    total_geral?: number;
    // Counts
    requisicoes_count?: number;
    pedidos_manuais_count?: number;
    conferencias_count?: number;
    requisicoes_mes_atual?: number;
    // Relationships
    requisicoes?: Requisicao[];
    pedidos_manuais?: PedidoManual[];
    conferencias?: Conferencia[];
}

export interface Emitente {
    id: number;
    nome: string;
    sigla: string;
    endereco?: string;
    telefone?: string;
    email?: string;
    observacoes?: string;
    created_at: string;
    updated_at: string;
    // Relationships
    requisicoes?: Requisicao[];
    requisicoes_count?: number;
}

export interface Destinatario {
    id: number;
    nome: string;
    sigla: string;
    endereco?: string;
    telefone?: string;
    email?: string;
    observacoes?: string;
    created_at: string;
    updated_at: string;
    // Relationships
    requisicoes?: Requisicao[];
    requisicoes_count?: number;
}

export interface Item {
    id: number;
    codigo: string;
    descricao: string;
    unidade_medida: string;
    preco_medio: number;
    created_at: string;
    updated_at: string;
}

export interface ProcessoLicitatorio {
    id: number;
    numero_processo: string;
    modalidade: string;
    objeto: string;
    status: string;
    modalidade_display?: string;
    created_at: string;
    updated_at: string;
}

export interface Contrato {
    id: number;
    fornecedor_id: number | null;
    processo_licitatorio_id: number | null;
    numero_contrato: string;
    data_inicio: string;
    data_fim: string;
    limite_requisicoes: number | null;
    limite_conferencias: number | null;
    limite_valor_mensal: number | null;
    valor_total: number | null;
    descricao: string;
    status: 'ativo' | 'inativo' | 'expirado';
    status_display?: string;
    status_color?: string;
    usuario_criacao_id: number | null;
    created_at: string;
    updated_at: string;
    // Computed attributes
    pode_editar?: boolean;
    pode_excluir?: boolean;
    total_itens?: number;
    // Relationships
    fornecedor?: Fornecedor;
    processo_licitatorio?: ProcessoLicitatorio;
    usuario_criacao?: User;
    items?: ContratoItem[];
}

export interface ContratoItem {
    id: number;
    contrato_id: number;
    item_id: number;
    quantidade: number;
    valor_unitario: number;
    valor_total: number | null;
    marca: string | null;
    especificacao: string | null;
    observacoes: string | null;
    unidade_medida: string | null;
    created_at: string;
    updated_at: string;
    // Relationships
    contrato?: Contrato;
    item?: Item;
}

export interface Secretaria {
    id: number;
    nome: string;
    sigla: string;
    descricao: string | null;
    responsavel: string | null;
    email_responsavel: string | null;
    ativa: boolean;
    created_at: string;
    updated_at: string;
    // Computed attributes
    status_display?: string;
    status_color?: string;
    display_text?: string;
}

export interface PedidoCompra {
    id: number;
    numero_pedido: string;
    secretaria_id: number;
    fornecedor_id: number | null;
    contrato_id: number | null;
    usuario_solicitante_id: number;
    usuario_autorizador_id: number | null;
    titulo: string;
    descricao: string;
    justificativa: string | null;
    valor_total_estimado: number;
    data_solicitacao: string;
    data_necessidade: string | null;
    status: 'rascunho' | 'pendente_aprovacao' | 'aprovado' | 'rejeitado' | 'cancelado' | 'em_execucao' | 'concluido';
    prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
    observacoes: string | null;
    motivo_rejeicao: string | null;
    data_aprovacao: string | null;
    data_rejeicao: string | null;
    created_at: string;
    updated_at: string;
    // Computed attributes
    status_display?: string;
    status_color?: string;
    prioridade_display?: string;
    prioridade_color?: string;
    valor_total_estimado_formatado?: string;
    data_solicitacao_formatada?: string;
    pode_editar?: boolean;
    pode_enviar_aprovacao?: boolean;
    pode_aprovar?: boolean;
    pode_rejeitar?: boolean;
    pode_cancelar?: boolean;
    // Relationships
    secretaria?: Secretaria;
    fornecedor?: Fornecedor;
    contrato?: Contrato;
    usuario_solicitante?: User;
    usuario_autorizador?: User;
    items?: PedidoCompraItem[];
}

export interface PedidoCompraItem {
    id: number;
    pedido_compra_id: number;
    item_id: number;
    contrato_item_id: number | null;
    descricao_material: string;
    quantidade_solicitada: number;
    unidade_medida: string;
    valor_unitario_estimado: number;
    valor_total_estimado: number;
    especificacoes: string | null;
    observacoes: string | null;
    created_at: string;
    updated_at: string;
    // Computed attributes
    quantidade_solicitada_formatada?: string;
    valor_unitario_estimado_formatado?: string;
    valor_total_estimado_formatado?: string;
    pode_editar?: boolean;
    // Relationships
    pedido_compra?: PedidoCompra;
    item?: Item;
    contrato_item?: ContratoItem;
}

export interface RequisicaoItem {
    item_id: number;
    quantidade_solicitada: number;
    valor_unitario_maximo: number;
    observacao?: string;
}

export interface RequisicaoItemWithDetails extends Item {
    quantidade_solicitada: number;
    valor_unitario_maximo: number;
    valor_total_maximo: number;
    observacao?: string;
}

export interface Requisicao {
    id: number;
    numero: string;
    numero_completo: string;
    emitente_id: number;
    destinatario_id: number;
    solicitante: string;
    numero_oficio?: string;
    data_recebimento: string;
    descricao: string;
    fornecedor_id?: number;
    anexo?: string;
    status: 'autorizada' | 'concretizada' | 'cancelada' | 'excluida';
    numero_pedido_real?: string;
    valor_final?: number;
    data_concretizacao?: string;
    usuario_concretizacao_id?: number;
    data_exclusao?: string;
    usuario_exclusao_id?: number;
    motivo_exclusao?: string;
    usuario_criacao_id: number;
    created_at: string;
    updated_at: string;
    // Computed attributes
    status_display?: string;
    status_color?: string;
    pode_editar?: boolean;
    data_requisicao?: string;
    valor_total?: number;
    valor_total_itens?: number;
    // Relationships
    emitente?: Emitente;
    destinatario?: Destinatario;
    fornecedor?: Fornecedor;
    usuario_criacao?: User;
    usuario_concretizacao?: User;
    usuario_exclusao?: User;
    items?: RequisicaoItemWithDetails[];
}

export interface Conferencia {
    id: number;
    fornecedor_id: number;
    periodo_inicio: string;
    periodo_fim: string;
    periodo_display: string;
    periodo?: string;
    total_requisicoes: number;
    total_pedidos_manuais: number;
    total_geral: number;
    status: 'em_andamento' | 'finalizada';
    status_display?: string;
    status_color?: string;
    data_finalizacao?: string;
    data_conferencia?: string;
    usuario_criacao_id?: number;
    usuario_finalizacao_id?: number;
    observacoes?: string;
    created_at: string;
    updated_at: string;
    pode_editar?: boolean;
    pode_finalizar?: boolean;
    // Relationships
    fornecedor?: Fornecedor;
    pedidos_manuais?: PedidoManual[];
    usuario_criacao?: User;
    usuario_finalizacao?: User;
}

export interface PedidoManual {
    id: number;
    fornecedor_id: number;
    conferencia_id?: number;
    descricao: string;
    valor: number;
    data_pedido: string;
    numero_pedido?: string;
    observacoes?: string;
    created_at: string;
    updated_at: string;
    // Relationships
    fornecedor?: Fornecedor;
    conferencia?: Conferencia;
}

export interface DashboardStats {
    total_fornecedores: number;
    fornecedores_ativos: number;
    total_requisicoes: number;
    requisicoes_pendentes: number;
    requisicoes_concretizadas: number;
    valor_total_requisicoes: number;
    requisicoes_mes_atual: number;
    conferencias_mes_atual: number;
}
