import { Building } from "lucide-react";
import { useMemo } from "react";
import ConfigSection from "../config-section";
import ConfigField from "../config-field";
import ConfigGrid from "../config-grid";
import {
	CONFIGURACOES_MESSAGES,
	FIELD_CONFIGS,
} from "@/constants/configuracoes/constants";
import {
	createFieldHandler,
	getFieldValue,
	getFieldError,
} from "@/constants/configuracoes/utils";
import type { ConfiguracoesData } from "@/pages/Configuracoes/Index";

interface OrganizacaoSectionProps {
	data: ConfiguracoesData;
	setData: (
		key: keyof ConfiguracoesData,
		value: ConfiguracoesData[keyof ConfiguracoesData],
	) => void;
	errors: Record<string, string>;
}

export default function OrganizacaoSection({
	data,
	setData,
	errors,
}: OrganizacaoSectionProps) {
	const configs = FIELD_CONFIGS.ORGANIZACAO;

	const handlers = useMemo(
		() => ({
			nome_organizacao: createFieldHandler(setData, "nome_organizacao"),
			cnpj_organizacao: createFieldHandler(setData, "cnpj_organizacao"),
			endereco_organizacao: createFieldHandler(setData, "endereco_organizacao"),
			telefone_organizacao: createFieldHandler(setData, "telefone_organizacao"),
			email_organizacao: createFieldHandler(setData, "email_organizacao"),
		}),
		[setData],
	);

	return (
		<ConfigSection
			title={CONFIGURACOES_MESSAGES.ORGANIZACAO_TITLE}
			description={CONFIGURACOES_MESSAGES.ORGANIZACAO_DESCRIPTION}
			icon={Building}
		>
			<ConfigGrid columns={2}>
				<ConfigField
					config={configs.nome_organizacao}
					value={getFieldValue(data, "nome_organizacao")}
					onChange={handlers.nome_organizacao}
					error={getFieldError(errors, "nome_organizacao")}
				/>
				<ConfigField
					config={configs.cnpj_organizacao}
					value={getFieldValue(data, "cnpj_organizacao")}
					onChange={handlers.cnpj_organizacao}
					error={getFieldError(errors, "cnpj_organizacao")}
				/>
			</ConfigGrid>
			<ConfigField
				config={configs.endereco_organizacao}
				value={getFieldValue(data, "endereco_organizacao")}
				onChange={handlers.endereco_organizacao}
				error={getFieldError(errors, "endereco_organizacao")}
			/>
			<ConfigGrid columns={2}>
				<ConfigField
					config={configs.telefone_organizacao}
					value={getFieldValue(data, "telefone_organizacao")}
					onChange={handlers.telefone_organizacao}
					error={getFieldError(errors, "telefone_organizacao")}
				/>
				<ConfigField
					config={configs.email_organizacao}
					value={getFieldValue(data, "email_organizacao")}
					onChange={handlers.email_organizacao}
					error={getFieldError(errors, "email_organizacao")}
				/>
			</ConfigGrid>
		</ConfigSection>
	);
}
