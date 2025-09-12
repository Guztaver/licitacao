import { Database, FileText, Shield } from 'lucide-react';
import { useMemo } from 'react';
import { CONFIGURACOES_MESSAGES, FIELD_CONFIGS } from '@/constants/configuracoes/constants';
import { createFieldHandler, getFieldError, getFieldValue } from '@/constants/configuracoes/utils';
import type { ConfiguracoesData } from '@/pages/Configuracoes/Index';
import ConfigField from '../config-field';
import ConfigGrid from '../config-grid';
import ConfigSection from '../config-section';

interface SectionProps {
    data: ConfiguracoesData;
    setData: (key: keyof ConfiguracoesData, value: ConfiguracoesData[keyof ConfiguracoesData]) => void;
    errors: Record<string, string>;
}

export function BackupSection({ data, setData, errors }: SectionProps) {
    const configs = FIELD_CONFIGS.BACKUP;

    const handlers = useMemo(
        () => ({
            backup_automatico: createFieldHandler(setData, 'backup_automatico'),
            backup_frequencia: createFieldHandler(setData, 'backup_frequencia'),
            backup_retencao: createFieldHandler(setData, 'backup_retencao'),
        }),
        [setData]
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.BACKUP_TITLE} description={CONFIGURACOES_MESSAGES.BACKUP_DESCRIPTION} icon={Database}>
            <ConfigField
                config={configs.backup_automatico}
                value={getFieldValue(data, 'backup_automatico')}
                onChange={handlers.backup_automatico}
                error={getFieldError(errors, 'backup_automatico')}
            />
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.backup_frequencia}
                    value={getFieldValue(data, 'backup_frequencia')}
                    onChange={handlers.backup_frequencia}
                    error={getFieldError(errors, 'backup_frequencia')}
                />
                <ConfigField
                    config={configs.backup_retencao}
                    value={getFieldValue(data, 'backup_retencao')}
                    onChange={handlers.backup_retencao}
                    error={getFieldError(errors, 'backup_retencao')}
                />
            </ConfigGrid>
        </ConfigSection>
    );
}

export function SegurancaSection({ data, setData, errors }: SectionProps) {
    const configs = FIELD_CONFIGS.SEGURANCA;

    const handlers = useMemo(
        () => ({
            sessao_timeout: createFieldHandler(setData, 'sessao_timeout'),
            login_tentativas: createFieldHandler(setData, 'login_tentativas'),
            senha_complexidade: createFieldHandler(setData, 'senha_complexidade'),
            autenticacao_dois_fatores: createFieldHandler(setData, 'autenticacao_dois_fatores'),
        }),
        [setData]
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.SEGURANCA_TITLE} description={CONFIGURACOES_MESSAGES.SEGURANCA_DESCRIPTION} icon={Shield}>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.sessao_timeout}
                    value={getFieldValue(data, 'sessao_timeout')}
                    onChange={handlers.sessao_timeout}
                    error={getFieldError(errors, 'sessao_timeout')}
                />
                <ConfigField
                    config={configs.login_tentativas}
                    value={getFieldValue(data, 'login_tentativas')}
                    onChange={handlers.login_tentativas}
                    error={getFieldError(errors, 'login_tentativas')}
                />
            </ConfigGrid>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.senha_complexidade}
                    value={getFieldValue(data, 'senha_complexidade')}
                    onChange={handlers.senha_complexidade}
                    error={getFieldError(errors, 'senha_complexidade')}
                />
                <ConfigField
                    config={configs.autenticacao_dois_fatores}
                    value={getFieldValue(data, 'autenticacao_dois_fatores')}
                    onChange={handlers.autenticacao_dois_fatores}
                    error={getFieldError(errors, 'autenticacao_dois_fatores')}
                />
            </ConfigGrid>
        </ConfigSection>
    );
}

export function RelatoriosSection({ data, setData, errors }: SectionProps) {
    const configs = FIELD_CONFIGS.RELATORIOS;

    const handlers = useMemo(
        () => ({
            relatorio_logo: createFieldHandler(setData, 'relatorio_logo'),
            relatorio_rodape: createFieldHandler(setData, 'relatorio_rodape'),
            formato_data_padrao: createFieldHandler(setData, 'formato_data_padrao'),
            moeda_padrao: createFieldHandler(setData, 'moeda_padrao'),
        }),
        [setData]
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.RELATORIOS_TITLE} description={CONFIGURACOES_MESSAGES.RELATORIOS_DESCRIPTION} icon={FileText}>
            <ConfigField
                config={configs.relatorio_logo}
                value={getFieldValue(data, 'relatorio_logo')}
                onChange={handlers.relatorio_logo}
                error={getFieldError(errors, 'relatorio_logo')}
            />
            <ConfigField
                config={configs.relatorio_rodape}
                value={getFieldValue(data, 'relatorio_rodape')}
                onChange={handlers.relatorio_rodape}
                error={getFieldError(errors, 'relatorio_rodape')}
            />
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.formato_data_padrao}
                    value={getFieldValue(data, 'formato_data_padrao')}
                    onChange={handlers.formato_data_padrao}
                    error={getFieldError(errors, 'formato_data_padrao')}
                />
                <ConfigField
                    config={configs.moeda_padrao}
                    value={getFieldValue(data, 'moeda_padrao')}
                    onChange={handlers.moeda_padrao}
                    error={getFieldError(errors, 'moeda_padrao')}
                />
            </ConfigGrid>
        </ConfigSection>
    );
}
