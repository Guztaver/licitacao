import { CONFIGURACOES_MESSAGES, FIELD_CONFIGS } from '@/constants/configuracoes/constants';
import { createFieldHandler, getFieldError, getFieldValue } from '@/constants/configuracoes/utils';
import type { ConfiguracoesData } from '@/pages/Configuracoes/Index';
import { Mail } from 'lucide-react';
import { useMemo } from 'react';
import ConfigField from '../config-field';
import ConfigGrid from '../config-grid';
import ConfigSection from '../config-section';

interface EmailSectionProps {
    data: ConfiguracoesData;
    setData: (key: keyof ConfiguracoesData, value: ConfiguracoesData[keyof ConfiguracoesData]) => void;
    errors: Record<string, string>;
}

export default function EmailSection({ data, setData, errors }: EmailSectionProps) {
    const configs = FIELD_CONFIGS.EMAIL;

    const handlers = useMemo(
        () => ({
            smtp_host: createFieldHandler(setData, 'smtp_host'),
            smtp_port: createFieldHandler(setData, 'smtp_port'),
            smtp_username: createFieldHandler(setData, 'smtp_username'),
            smtp_password: createFieldHandler(setData, 'smtp_password'),
            smtp_encryption: createFieldHandler(setData, 'smtp_encryption'),
            email_from_address: createFieldHandler(setData, 'email_from_address'),
            email_from_name: createFieldHandler(setData, 'email_from_name'),
        }),
        [setData],
    );

    return (
        <ConfigSection title={CONFIGURACOES_MESSAGES.EMAIL_TITLE} description={CONFIGURACOES_MESSAGES.EMAIL_DESCRIPTION} icon={Mail}>
            <ConfigGrid columns={3}>
                <ConfigField
                    config={configs.smtp_host}
                    value={getFieldValue(data, 'smtp_host')}
                    onChange={handlers.smtp_host}
                    error={getFieldError(errors, 'smtp_host')}
                />
                <ConfigField
                    config={configs.smtp_port}
                    value={getFieldValue(data, 'smtp_port')}
                    onChange={handlers.smtp_port}
                    error={getFieldError(errors, 'smtp_port')}
                />
                <ConfigField
                    config={configs.smtp_encryption}
                    value={getFieldValue(data, 'smtp_encryption')}
                    onChange={handlers.smtp_encryption}
                    error={getFieldError(errors, 'smtp_encryption')}
                />
            </ConfigGrid>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.smtp_username}
                    value={getFieldValue(data, 'smtp_username')}
                    onChange={handlers.smtp_username}
                    error={getFieldError(errors, 'smtp_username')}
                />
                <ConfigField
                    config={configs.smtp_password}
                    value={getFieldValue(data, 'smtp_password')}
                    onChange={handlers.smtp_password}
                    error={getFieldError(errors, 'smtp_password')}
                />
            </ConfigGrid>
            <ConfigGrid columns={2}>
                <ConfigField
                    config={configs.email_from_address}
                    value={getFieldValue(data, 'email_from_address')}
                    onChange={handlers.email_from_address}
                    error={getFieldError(errors, 'email_from_address')}
                />
                <ConfigField
                    config={configs.email_from_name}
                    value={getFieldValue(data, 'email_from_name')}
                    onChange={handlers.email_from_name}
                    error={getFieldError(errors, 'email_from_name')}
                />
            </ConfigGrid>
        </ConfigSection>
    );
}
