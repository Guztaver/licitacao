/**
 * Tipos para o sistema de controle de limites de dispensa de licitações
 */

export interface CategoriaMaterial {
    id: number;
    nome: string;
    descricao: string;
    tipo: 'material' | 'servico';
    limite_dispensa_anual: number;
    limite_dispensa_mensal: number;
    alerta_percentual: number;
    bloqueio_percentual: number;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    uso_anual?: number;
    uso_mensal?: number;
    percentual_uso_anual?: number;
    percentual_uso_mensal?: number;
    status?: 'normal' | 'alerta' | 'bloqueio';
}

export interface DispensaLicitacao {
    id: number;
    numero: string;
    categoria_material_id: number;
    valor: number;
    objeto: string;
    fundamentacao_legal: string;
    data_dispensa: string;
    responsavel: string;
    unidade_administrativa: string;
    periodo: 'anual' | 'mensal';
    referencia_mes?: number;
    referencia_ano: number;
    status: 'ativa' | 'cancelada' | 'suspensa';
    created_at: string;
    updated_at: string;
    categoria_material?: CategoriaMaterial;
}

export interface LimiteDispensaAlerta {
    id: number;
    categoria_material_id: number;
    tipo_alerta: 'warning' | 'error' | 'critical';
    percentual_usado: number;
    valor_usado: number;
    limite_aplicavel: number;
    periodo: 'anual' | 'mensal';
    referencia_mes?: number;
    referencia_ano: number;
    mensagem: string;
    lida: boolean;
    created_at: string;
    updated_at: string;
    categoria_material?: CategoriaMaterial;
}

export interface CreateCategoriaData {
    nome: string;
    descricao: string;
    tipo: 'material' | 'servico';
    limite_dispensa_anual: number;
    limite_dispensa_mensal: number;
    alerta_percentual: number;
    bloqueio_percentual: number;
}

export interface UpdateCategoriaData extends Partial<CreateCategoriaData> {
    ativo?: boolean;
}

export interface CreateDispensaData {
    numero: string;
    categoria_material_id: number;
    valor: number;
    objeto: string;
    fundamentacao_legal: string;
    data_dispensa: string;
    responsavel: string;
    unidade_administrativa: string;
    periodo: 'anual' | 'mensal';
    referencia_mes?: number;
    referencia_ano: number;
}

export interface DispensaValidation {
    pode_gerar: boolean;
    valor_excedido: number;
    atingira_alerta: boolean;
    mensagem?: string;
}

export interface LimitesDashboard {
    total_categorias: number;
    categorias_ativas: number;
    alertas_ativos: number;
    dispensas_este_mes: number;
    valor_total_este_mes: number;
    categorias_criticas: Array<{
        categoria: CategoriaMaterial;
        percentual_uso: number;
        status: 'alerta' | 'bloqueio';
    }>;
    alertas_recentes: LimiteDispensaAlerta[];
    dispensas_recentes: DispensaLicitacao[];
}

export interface CategoriaFilters {
    tipo?: 'material' | 'servico' | '';
    ativo?: boolean | '';
    search?: string;
}

export interface DispensaFilters {
    categoria_id?: number;
    periodo?: 'anual' | 'mensal' | '';
    status?: 'ativa' | 'cancelada' | 'suspensa' | '';
    data_inicio?: string;
    data_fim?: string;
    search?: string;
}

export interface AlertaFilters {
    tipo_alerta?: 'warning' | 'error' | 'critical' | '';
    lida?: boolean | '';
    periodo?: 'anual' | 'mensal' | '';
    data_inicio?: string;
    data_fim?: string;
    categoria_id?: number;
}
