import { CONFIGURACOES_MESSAGES, FIELD_CONFIGS } from '@/constants/configuracoes/constants';
import { createFieldHandler, getFieldError, getFieldValue } from '@/constants/configuracoes/utils';
import type { ConfiguracoesData } from '@/pages/Configuracoes/Index';
import { Bell } from 'lucide-react';
import { useMemo } from 'react';
import ConfigField from '../config-field';
import ConfigGrid from '../config-grid';
import ConfigSection from '../config-section';

interface NotificacoesSectionProps {
    data: ConfiguracoesData;
    setData: (key: keyof ConfiguracoesData, value: ConfiguracoesData[keyof ConfiguracoesData]) => void;
    errors: Record<string, string>;
}

export default function NotificacoesSection({ data, setData, errors }: NotificacoesSectionProps) {
    const configs = FIELD_CONFIGS.NOTIFICACOES;

    const handlers = useMemo(
        () => ({
            notificacoes_email: createFieldHandler(setData, 'notificacoes_email'),
            notificacoes_sistema: createFieldHandler(setData, 'notificacoes_sistema'),
            notificar_aprovacao: createFieldHandler(setData, 'notificar_aprovacao'),
            notificar_rejeicao: createFieldHandler(setData, 'notificar_rejeicao'),
            notificar_vencimento: createFieldHandler(setData, 'notificar_vencimento'),
        }),
        [setData],
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.NOTIFICACOES_TITLE} description={CONFIGURACOES_MESSAGES.NOTIFICACOES_DESCRIPTION} icon={Bell}>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.notificacoes_email}
                    value={getFieldValue(data, 'notificacoes_email')}
                    onChange={handlers.notificacoes_email}
                    error={getFieldError(errors, 'notificacoes_email')}
                />
                <ConfigField
                    config={configs.notificacoes_sistema}
                    value={getFieldValue(data, 'notificacoes_sistema')}
                    onChange={handlers.notificacoes_sistema}
                    error={getFieldError(errors, 'notificacoes_sistema')}
                />
            </ConfigGrid>
            <ConfigGrid columns={3}>
                <ConfigField
                    config={configs.notificar_aprovacao}
                    value={getFieldValue(data, 'notificar_aprovacao')}
                    onChange={handlers.notificar_aprovacao}
                    error={getFieldError(errors, 'notificar_aprovacao')}
                />
                <ConfigField
                    config={configs.notificar_rejeicao}
                    value={getFieldValue(data, 'notificar_rejeicao')}
                    onChange={handlers.notificar_rejeicao}
                    error={getFieldError(errors, 'notificar_rejeicao')}
                />
                <ConfigField
                    config={configs.notificar_vencimento}
                    value={getFieldValue(data, 'notificar_vencimento')}
                    onChange={handlers.notificar_vencimento}
                    error={getFieldError(errors, 'notificar_vencimento')}
                />
            </ConfigGrid>
        </ConfigSection>
    );
}
