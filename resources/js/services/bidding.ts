import axios from 'axios';
import type {
    CategoriaMaterial,
    DispensaLicitacao,
    LimiteDispensaAlerta,
    CreateCategoriaData,
    UpdateCategoriaData,
    CreateDispensaData,
    DispensaValidation,
    LimitesDashboard,
    CategoriaFilters,
    DispensaFilters,
    AlertaFilters,
} from '@/types/bidding';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Categorias de Materiais
export const categoriaService = {
    async listar(filtros?: CategoriaFilters): Promise<CategoriaMaterial[]> {
        const params = new URLSearchParams();

        if (filtros?.tipo) params.append('tipo', filtros.tipo);
        if (filtros?.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
        if (filtros?.search) params.append('search', filtros.search);

        const response = await api.get(`/categoria-materiais?${params.toString()}`);
        return response.data;
    },

    async obter(id: number): Promise<CategoriaMaterial> {
        const response = await api.get(`/categoria-materiais/${id}`);
        return response.data;
    },

    async criar(dados: CreateCategoriaData): Promise<CategoriaMaterial> {
        const response = await api.post('/categoria-materiais', dados);
        return response.data;
    },

    async atualizar(id: number, dados: UpdateCategoriaData): Promise<CategoriaMaterial> {
        const response = await api.put(`/categoria-materiais/${id}`, dados);
        return response.data;
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/categoria-materiais/${id}`);
    },

    async obterComUso(id: number): Promise<CategoriaMaterial> {
        const response = await api.get(`/categoria-materiais/${id}/com-uso`);
        return response.data;
    },
};

// Dispensas de Licitação
export const dispensaService = {
    async listar(filtros?: DispensaFilters): Promise<DispensaLicitacao[]> {
        const params = new URLSearchParams();

        if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id.toString());
        if (filtros?.periodo) params.append('periodo', filtros.periodo);
        if (filtros?.status) params.append('status', filtros.status);
        if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros?.search) params.append('search', filtros.search);

        const response = await api.get(`/dispensa-licitacoes?${params.toString()}`);
        return response.data;
    },

    async obter(id: number): Promise<DispensaLicitacao> {
        const response = await api.get(`/dispensa-licitacoes/${id}`);
        return response.data;
    },

    async criar(dados: CreateDispensaData): Promise<DispensaLicitacao> {
        const response = await api.post('/dispensa-licitacoes', dados);
        return response.data;
    },

    async atualizar(id: number, dados: Partial<CreateDispensaData>): Promise<DispensaLicitacao> {
        const response = await api.put(`/dispensa-licitacoes/${id}`, dados);
        return response.data;
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/dispensa-licitacoes/${id}`);
    },

    async validar(dados: CreateDispensaData): Promise<DispensaValidation> {
        const response = await api.post('/dispensa-licitacoes/validar', dados);
        return response.data;
    },

    async cancelar(id: number, motivo: string): Promise<DispensaLicitacao> {
        const response = await api.post(`/dispensa-licitacoes/${id}/cancelar`, { motivo });
        return response.data;
    },
};

// Alertas de Limites
export const alertaService = {
    async listar(filtros?: AlertaFilters): Promise<LimiteDispensaAlerta[]> {
        const params = new URLSearchParams();

        if (filtros?.tipo_alerta) params.append('tipo_alerta', filtros.tipo_alerta);
        if (filtros?.lida !== undefined) params.append('lida', filtros.lida.toString());
        if (filtros?.periodo) params.append('periodo', filtros.periodo);
        if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id.toString());

        const response = await api.get(`/limite-alertas?${params.toString()}`);
        return response.data;
    },

    async obter(id: number): Promise<LimiteDispensaAlerta> {
        const response = await api.get(`/limite-alertas/${id}`);
        return response.data;
    },

    async marcarComoLida(id: number): Promise<LimiteDispensaAlerta> {
        const response = await api.patch(`/limite-alertas/${id}/marcar-lida`);
        return response.data;
    },

    async marcarComoNaoLida(id: number): Promise<LimiteDispensaAlerta> {
        const response = await api.patch(`/limite-alertas/${id}/marcar-nao-lida`);
        return response.data;
    },

    async marcarTodasComoLidas(): Promise<{ count: number }> {
        const response = await api.patch('/limite-alertas/marcar-todas-lidas');
        return response.data;
    },

    async contarNaoLidas(): Promise<{ count: number }> {
        const response = await api.get('/limite-alertas/nao-lidas-count');
        return response.data;
    },
};

// Dashboard
export const dashboardService = {
    async obterDados(): Promise<LimitesDashboard> {
        const response = await api.get('/limites-dashboard');
        return response.data;
    },
};

// Relatórios
export const relatorioService = {
    async gerarRelatorioLimites(tipo: 'anual' | 'mensal', ano: number, mes?: number): Promise<Blob> {
        const params = new URLSearchParams();
        params.append('tipo', tipo);
        params.append('ano', ano.toString());
        if (mes) params.append('mes', mes.toString());

        const response = await api.get(`/relatorios/limites-uso?${params.toString()}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async gerarRelatorioAlertas(data_inicio: string, data_fim: string): Promise<Blob> {
        const params = new URLSearchParams();
        params.append('data_inicio', data_inicio);
        params.append('data_fim', data_fim);

        const response = await api.get(`/relatorios/alertas?${params.toString()}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async gerarRelatorioDispensas(filtros: DispensaFilters): Promise<Blob> {
        const params = new URLSearchParams();

        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, value.toString());
            }
        });

        const response = await api.get(`/relatorios/dispensas?${params.toString()}`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

// Utilitários
export const biddingUtils = {
    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    },

    formatarPercentual(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(valor / 100);
    },

    formatarData(data: string): string {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(data));
    },

    obterCorPercentual(percentual: number, alerta: number, bloqueio: number): string {
        if (percentual >= bloqueio) return 'text-red-600 bg-red-50';
        if (percentual >= alerta) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    },

    obterCorTipoAlerta(tipo: string): string {
        switch (tipo) {
            case 'critical':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'error':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    },

    baixarArquivo(blob: Blob, nomeArquivo: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
};

export default {
    categoria: categoriaService,
    dispensa: dispensaService,
    alerta: alertaService,
    dashboard: dashboardService,
    relatorio: relatorioService,
    utils: biddingUtils,
};
