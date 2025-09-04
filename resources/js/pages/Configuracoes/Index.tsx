import { Head, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useCallback, type FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { ConfigInfoCard } from "@/components/configuracoes";
import {
	SistemaSection,
	OrganizacaoSection,
	EmailSection,
	NotificacoesSection,
	BackupSection,
	SegurancaSection,
	RelatoriosSection,
} from "@/components/configuracoes/sections";
import AppLayout from "@/layouts/app-layout";
import { CONFIGURACOES_MESSAGES } from "@/constants/configuracoes/constants";
import { getFormDefaults } from "@/constants/configuracoes/utils";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Configurações",
		href: "/configuracoes",
	},
];

export interface ConfiguracoesData {
	// Sistema
	nome_sistema: string;
	versao_sistema: string;
	descricao_sistema: string;

	// Organização
	nome_organizacao: string;
	cnpj_organizacao: string;
	endereco_organizacao: string;
	telefone_organizacao: string;
	email_organizacao: string;

	// E-mail
	smtp_host: string;
	smtp_port: string;
	smtp_username: string;
	smtp_password: string;
	smtp_encryption: string;
	email_from_address: string;
	email_from_name: string;

	// Notificações
	notificacoes_email: boolean;
	notificacoes_sistema: boolean;
	notificar_aprovacao: boolean;
	notificar_rejeicao: boolean;
	notificar_vencimento: boolean;

	// Backup
	backup_automatico: boolean;
	backup_frequencia: string;
	backup_retencao: string;

	// Segurança
	sessao_timeout: string;
	login_tentativas: string;
	senha_complexidade: boolean;
	autenticacao_dois_fatores: boolean;

	// Relatórios
	relatorio_logo: string;
	relatorio_rodape: string;
	formato_data_padrao: string;
	moeda_padrao: string;
}

interface ConfiguracoesIndexProps {
	configuracoes: Partial<ConfiguracoesData>;
}

export default function ConfiguracoesIndex({
	configuracoes,
}: ConfiguracoesIndexProps) {
	const { data, setData, post, processing, errors } =
		useForm<ConfiguracoesData>(getFormDefaults(configuracoes));

	const handleSubmit: FormEventHandler = useCallback(
		(e) => {
			e.preventDefault();
			post("/configuracoes", {
				preserveScroll: true,
			});
		},
		[post],
	);

	const renderHeader = useCallback(
		() => (
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{CONFIGURACOES_MESSAGES.PAGE_TITLE}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{CONFIGURACOES_MESSAGES.PAGE_DESCRIPTION}
					</p>
				</div>
			</div>
		),
		[],
	);

	const renderSaveButton = useCallback(
		() => (
			<div className="flex justify-end space-x-4">
				<Button type="submit" disabled={processing}>
					<Save className="mr-2 h-4 w-4" />
					{processing
						? CONFIGURACOES_MESSAGES.SAVING
						: CONFIGURACOES_MESSAGES.SAVE_BUTTON}
				</Button>
			</div>
		),
		[processing],
	);

	const renderInfoCard = useCallback(
		() => (
			<ConfigInfoCard
				title={CONFIGURACOES_MESSAGES.INFO_TITLE}
				message={CONFIGURACOES_MESSAGES.INFO_TEXT}
			/>
		),
		[],
	);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Configurações" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{renderHeader()}

				<form onSubmit={handleSubmit} className="space-y-6">
					<SistemaSection data={data} setData={setData} errors={errors} />

					<OrganizacaoSection data={data} setData={setData} errors={errors} />

					<EmailSection data={data} setData={setData} errors={errors} />

					<NotificacoesSection data={data} setData={setData} errors={errors} />

					<BackupSection data={data} setData={setData} errors={errors} />

					<SegurancaSection data={data} setData={setData} errors={errors} />

					<RelatoriosSection data={data} setData={setData} errors={errors} />

					{renderSaveButton()}
				</form>

				{renderInfoCard()}
			</div>
		</AppLayout>
	);
}
