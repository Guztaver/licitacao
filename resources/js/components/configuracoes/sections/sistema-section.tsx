import { CONFIGURACOES_MESSAGES, FIELD_CONFIGS } from '@/constants/configuracoes/constants';
import { createFieldHandler, getFieldError, getFieldValue } from '@/constants/configuracoes/utils';
import type { ConfiguracoesData } from '@/pages/Configuracoes/Index';
import { Settings } from 'lucide-react';
import { useMemo } from 'react';
import ConfigField from '../config-field';
import ConfigGrid from '../config-grid';
import ConfigSection from '../config-section';

interface SistemaSectionProps {
    data: ConfiguracoesData;
    setData: (key: keyof ConfiguracoesData, value: ConfiguracoesData[keyof ConfiguracoesData]) => void;
    errors: Record<string, string>;
}

export default function SistemaSection({ data, setData, errors }: SistemaSectionProps) {
    const configs = FIELD_CONFIGS.SISTEMA;

    const handlers = useMemo(
        () => ({
            nome_sistema: createFieldHandler(setData, 'nome_sistema'),
            versao_sistema: createFieldHandler(setData, 'versao_sistema'),
            descricao_sistema: createFieldHandler(setData, 'descricao_sistema'),
        }),
        [setData],
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.SISTEMA_TITLE} description={CONFIGURACOES_MESSAGES.SISTEMA_DESCRIPTION} icon={Settings}>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.nome_sistema}
                    value={getFieldValue(data, 'nome_sistema')}
                    onChange={handlers.nome_sistema}
                    error={getFieldError(errors, 'nome_sistema')}
                />
                <ConfigField
                    config={configs.versao_sistema}
                    value={getFieldValue(data, 'versao_sistema')}
                    onChange={handlers.versao_sistema}
                    error={getFieldError(errors, 'versao_sistema')}
                />
            </ConfigGrid>
            <ConfigField
                config={configs.descricao_sistema}
                value={getFieldValue(data, 'descricao_sistema')}
                onChange={handlers.descricao_sistema}
                error={getFieldError(errors, 'descricao_sistema')}
            />
        </ConfigSection>
    );
}
