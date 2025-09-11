import type { ConfiguracoesData } from '@/pages/Configuracoes/Index';
import { DEFAULT_VALUES } from './constants';

export function getFormDefaults(configuracoes: Partial<ConfiguracoesData> = {}): ConfiguracoesData {
    return {
        // Sistema
        nome_sistema: configuracoes.nome_sistema || DEFAULT_VALUES.nome_sistema,
        versao_sistema: configuracoes.versao_sistema || DEFAULT_VALUES.versao_sistema,
        descricao_sistema: configuracoes.descricao_sistema || DEFAULT_VALUES.descricao_sistema,

        // Organização
        nome_organizacao: configuracoes.nome_organizacao || DEFAULT_VALUES.nome_organizacao,
        cnpj_organizacao: configuracoes.cnpj_organizacao || DEFAULT_VALUES.cnpj_organizacao,
        endereco_organizacao: configuracoes.endereco_organizacao || DEFAULT_VALUES.endereco_organizacao,
        telefone_organizacao: configuracoes.telefone_organizacao || DEFAULT_VALUES.telefone_organizacao,
        email_organizacao: configuracoes.email_organizacao || DEFAULT_VALUES.email_organizacao,

        // E-mail
        smtp_host: configuracoes.smtp_host || DEFAULT_VALUES.smtp_host,
        smtp_port: configuracoes.smtp_port || DEFAULT_VALUES.smtp_port,
        smtp_username: configuracoes.smtp_username || DEFAULT_VALUES.smtp_username,
        smtp_password: configuracoes.smtp_password || DEFAULT_VALUES.smtp_password,
        smtp_encryption: configuracoes.smtp_encryption || DEFAULT_VALUES.smtp_encryption,
        email_from_address: configuracoes.email_from_address || DEFAULT_VALUES.email_from_address,
        email_from_name: configuracoes.email_from_name || DEFAULT_VALUES.email_from_name,

        // Notificações
        notificacoes_email: configuracoes.notificacoes_email ?? DEFAULT_VALUES.notificacoes_email,
        notificacoes_sistema: configuracoes.notificacoes_sistema ?? DEFAULT_VALUES.notificacoes_sistema,
        notificar_aprovacao: configuracoes.notificar_aprovacao ?? DEFAULT_VALUES.notificar_aprovacao,
        notificar_rejeicao: configuracoes.notificar_rejeicao ?? DEFAULT_VALUES.notificar_rejeicao,
        notificar_vencimento: configuracoes.notificar_vencimento ?? DEFAULT_VALUES.notificar_vencimento,

        // Backup
        backup_automatico: configuracoes.backup_automatico ?? DEFAULT_VALUES.backup_automatico,
        backup_frequencia: configuracoes.backup_frequencia || DEFAULT_VALUES.backup_frequencia,
        backup_retencao: configuracoes.backup_retencao || DEFAULT_VALUES.backup_retencao,

        // Segurança
        sessao_timeout: configuracoes.sessao_timeout || DEFAULT_VALUES.sessao_timeout,
        login_tentativas: configuracoes.login_tentativas || DEFAULT_VALUES.login_tentativas,
        senha_complexidade: configuracoes.senha_complexidade ?? DEFAULT_VALUES.senha_complexidade,
        autenticacao_dois_fatores: configuracoes.autenticacao_dois_fatores ?? DEFAULT_VALUES.autenticacao_dois_fatores,

        // Relatórios
        relatorio_logo: configuracoes.relatorio_logo || DEFAULT_VALUES.relatorio_logo,
        relatorio_rodape: configuracoes.relatorio_rodape || DEFAULT_VALUES.relatorio_rodape,
        formato_data_padrao: configuracoes.formato_data_padrao || DEFAULT_VALUES.formato_data_padrao,
        moeda_padrao: configuracoes.moeda_padrao || DEFAULT_VALUES.moeda_padrao,
    };
}

export function createFieldHandler<T extends keyof ConfiguracoesData>(
    setData: (key: keyof ConfiguracoesData, value: ConfiguracoesData[keyof ConfiguracoesData]) => void,
    field: T,
) {
    return (value: string | number | boolean) => setData(field, value as ConfiguracoesData[T]);
}

export function getFieldValue<T extends keyof ConfiguracoesData>(data: ConfiguracoesData, field: T): ConfiguracoesData[T] {
    return data[field];
}

export function hasFieldError(errors: Record<string, string>, field: string): boolean {
    return Boolean(errors[field]);
}

export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
    return errors[field];
}
