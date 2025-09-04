import { InertiaLinkProps } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

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
	href: NonNullable<InertiaLinkProps["href"]>;
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
	status: "autorizada" | "concretizada" | "cancelada" | "excluida";
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
	// Relationships
	emitente?: Emitente;
	destinatario?: Destinatario;
	fornecedor?: Fornecedor;
	usuario_criacao?: User;
	usuario_concretizacao?: User;
	usuario_exclusao?: User;
}

export interface Conferencia {
	id: number;
	fornecedor_id: number;
	periodo: string;
	total_requisicoes: number;
	total_pedidos_manuais: number;
	total_geral: number;
	data_conferencia: string;
	observacoes?: string;
	created_at: string;
	updated_at: string;
	// Relationships
	fornecedor?: Fornecedor;
}

export interface PedidoManual {
	id: number;
	fornecedor_id: number;
	descricao: string;
	valor: number;
	data_pedido: string;
	numero_pedido?: string;
	observacoes?: string;
	created_at: string;
	updated_at: string;
	// Relationships
	fornecedor?: Fornecedor;
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
