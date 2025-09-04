export const CONFIGURACOES_MESSAGES = {
	// Page title and description
	PAGE_TITLE: "Configurações do Sistema",
	PAGE_DESCRIPTION: "Gerencie as configurações gerais do sistema",
	SAVE_BUTTON: "Salvar Configurações",
	SAVING: "Salvando...",

	// Section titles and descriptions
	SISTEMA_TITLE: "Informações do Sistema",
	SISTEMA_DESCRIPTION: "Configurações básicas do sistema",

	ORGANIZACAO_TITLE: "Informações da Organização",
	ORGANIZACAO_DESCRIPTION: "Dados da organização responsável pelo sistema",

	EMAIL_TITLE: "Configurações de E-mail",
	EMAIL_DESCRIPTION: "Configurações do servidor SMTP para envio de e-mails",

	NOTIFICACOES_TITLE: "Notificações",
	NOTIFICACOES_DESCRIPTION: "Configure quando e como enviar notificações",

	BACKUP_TITLE: "Backup",
	BACKUP_DESCRIPTION: "Configurações de backup automático",

	SEGURANCA_TITLE: "Segurança",
	SEGURANCA_DESCRIPTION: "Configurações de segurança do sistema",

	RELATORIOS_TITLE: "Relatórios",
	RELATORIOS_DESCRIPTION: "Configurações para geração de relatórios",

	// Field labels
	NOME_SISTEMA: "Nome do Sistema",
	VERSAO_SISTEMA: "Versão",
	DESCRICAO_SISTEMA: "Descrição",

	NOME_ORGANIZACAO: "Nome da Organização",
	CNPJ_ORGANIZACAO: "CNPJ",
	ENDERECO_ORGANIZACAO: "Endereço",
	TELEFONE_ORGANIZACAO: "Telefone",
	EMAIL_ORGANIZACAO: "E-mail",

	SMTP_HOST: "Servidor SMTP",
	SMTP_PORT: "Porta",
	SMTP_USERNAME: "Usuário",
	SMTP_PASSWORD: "Senha",
	SMTP_ENCRYPTION: "Criptografia",
	EMAIL_FROM_ADDRESS: "E-mail de Envio",
	EMAIL_FROM_NAME: "Nome do Remetente",

	NOTIFICACOES_EMAIL: "Notificações por E-mail",
	NOTIFICACOES_SISTEMA: "Notificações no Sistema",
	NOTIFICAR_APROVACAO: "Aprovação de Requisições",
	NOTIFICAR_REJEICAO: "Rejeição de Requisições",
	NOTIFICAR_VENCIMENTO: "Vencimento de Prazos",

	BACKUP_AUTOMATICO: "Backup Automático",
	BACKUP_FREQUENCIA: "Frequência",
	BACKUP_RETENCAO: "Retenção (dias)",

	SESSAO_TIMEOUT: "Timeout da Sessão (minutos)",
	LOGIN_TENTATIVAS: "Tentativas de Login",
	SENHA_COMPLEXIDADE: "Exigir Senha Complexa",
	AUTENTICACAO_DOIS_FATORES: "Autenticação de Dois Fatores",

	RELATORIO_LOGO: "URL do Logo",
	RELATORIO_RODAPE: "Rodapé dos Relatórios",
	FORMATO_DATA_PADRAO: "Formato de Data",
	MOEDA_PADRAO: "Moeda Padrão",

	// Info messages
	INFO_TITLE: "Informações",
	INFO_TEXT:
		"• As configurações são aplicadas imediatamente após serem salvas\n• Alterações de segurança podem afetar usuários conectados\n• Configure o e-mail SMTP para receber notificações automáticas\n• O backup automático ajuda a proteger seus dados",
} as const;

export const CONFIGURACOES_PLACEHOLDERS = {
	DESCRICAO_SISTEMA: "Descrição do sistema de licitações...",
	NOME_ORGANIZACAO: "Prefeitura Municipal de...",
	CNPJ_ORGANIZACAO: "00.000.000/0000-00",
	ENDERECO_ORGANIZACAO: "Endereço completo da organização",
	TELEFONE_ORGANIZACAO: "(XX) XXXXX-XXXX",
	EMAIL_ORGANIZACAO: "contato@organizacao.gov.br",

	SMTP_HOST: "smtp.gmail.com",
	SMTP_PORT: "587",
	SMTP_USERNAME: "usuario@exemplo.com",
	SMTP_PASSWORD: "••••••••",
	EMAIL_FROM_ADDRESS: "noreply@organizacao.gov.br",
	EMAIL_FROM_NAME: "Sistema de Licitações",

	BACKUP_RETENCAO: "30",
	SESSAO_TIMEOUT: "120",
	LOGIN_TENTATIVAS: "5",

	RELATORIO_LOGO: "https://exemplo.com/logo.png",
	RELATORIO_RODAPE: "Texto que aparecerá no rodapé dos relatórios...",
} as const;

export const SELECT_OPTIONS = {
	SMTP_ENCRYPTION: [
		{ value: "tls", label: "TLS" },
		{ value: "ssl", label: "SSL" },
		{ value: "none", label: "Nenhuma" },
	],
	BACKUP_FREQUENCIA: [
		{ value: "diario", label: "Diário" },
		{ value: "semanal", label: "Semanal" },
		{ value: "mensal", label: "Mensal" },
	],
	FORMATO_DATA: [
		{ value: "dd/MM/yyyy", label: "dd/MM/yyyy" },
		{ value: "dd-MM-yyyy", label: "dd-MM-yyyy" },
		{ value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
	],
	MOEDA: [
		{ value: "BRL", label: "Real (R$)" },
		{ value: "USD", label: "Dólar ($)" },
		{ value: "EUR", label: "Euro (€)" },
	],
} as const;

export const DEFAULT_VALUES = {
	nome_sistema: "Sistema de Licitações",
	versao_sistema: "1.0.0",
	descricao_sistema: "",
	nome_organizacao: "",
	cnpj_organizacao: "",
	endereco_organizacao: "",
	telefone_organizacao: "",
	email_organizacao: "",
	smtp_host: "",
	smtp_port: "587",
	smtp_username: "",
	smtp_password: "",
	smtp_encryption: "tls",
	email_from_address: "",
	email_from_name: "",
	notificacoes_email: true,
	notificacoes_sistema: true,
	notificar_aprovacao: true,
	notificar_rejeicao: true,
	notificar_vencimento: true,
	backup_automatico: false,
	backup_frequencia: "diario",
	backup_retencao: "30",
	sessao_timeout: "120",
	login_tentativas: "5",
	senha_complexidade: true,
	autenticacao_dois_fatores: false,
	relatorio_logo: "",
	relatorio_rodape: "",
	formato_data_padrao: "dd/MM/yyyy",
	moeda_padrao: "BRL",
} as const;

export const FIELD_CONFIGS = {
	SISTEMA: {
		nome_sistema: {
			type: "text" as const,
			name: "nome_sistema",
			label: CONFIGURACOES_MESSAGES.NOME_SISTEMA,
		},
		versao_sistema: {
			type: "text" as const,
			name: "versao_sistema",
			label: CONFIGURACOES_MESSAGES.VERSAO_SISTEMA,
		},
		descricao_sistema: {
			type: "textarea" as const,
			name: "descricao_sistema",
			label: CONFIGURACOES_MESSAGES.DESCRICAO_SISTEMA,
			placeholder: CONFIGURACOES_PLACEHOLDERS.DESCRICAO_SISTEMA,
			rows: 3,
		},
	},
	ORGANIZACAO: {
		nome_organizacao: {
			type: "text" as const,
			name: "nome_organizacao",
			label: CONFIGURACOES_MESSAGES.NOME_ORGANIZACAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.NOME_ORGANIZACAO,
		},
		cnpj_organizacao: {
			type: "text" as const,
			name: "cnpj_organizacao",
			label: CONFIGURACOES_MESSAGES.CNPJ_ORGANIZACAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.CNPJ_ORGANIZACAO,
		},
		endereco_organizacao: {
			type: "text" as const,
			name: "endereco_organizacao",
			label: CONFIGURACOES_MESSAGES.ENDERECO_ORGANIZACAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.ENDERECO_ORGANIZACAO,
		},
		telefone_organizacao: {
			type: "text" as const,
			name: "telefone_organizacao",
			label: CONFIGURACOES_MESSAGES.TELEFONE_ORGANIZACAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.TELEFONE_ORGANIZACAO,
		},
		email_organizacao: {
			type: "email" as const,
			name: "email_organizacao",
			label: CONFIGURACOES_MESSAGES.EMAIL_ORGANIZACAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.EMAIL_ORGANIZACAO,
		},
	},
	EMAIL: {
		smtp_host: {
			type: "text" as const,
			name: "smtp_host",
			label: CONFIGURACOES_MESSAGES.SMTP_HOST,
			placeholder: CONFIGURACOES_PLACEHOLDERS.SMTP_HOST,
		},
		smtp_port: {
			type: "text" as const,
			name: "smtp_port",
			label: CONFIGURACOES_MESSAGES.SMTP_PORT,
			placeholder: CONFIGURACOES_PLACEHOLDERS.SMTP_PORT,
		},
		smtp_username: {
			type: "text" as const,
			name: "smtp_username",
			label: CONFIGURACOES_MESSAGES.SMTP_USERNAME,
			placeholder: CONFIGURACOES_PLACEHOLDERS.SMTP_USERNAME,
		},
		smtp_password: {
			type: "password" as const,
			name: "smtp_password",
			label: CONFIGURACOES_MESSAGES.SMTP_PASSWORD,
			placeholder: CONFIGURACOES_PLACEHOLDERS.SMTP_PASSWORD,
		},
		smtp_encryption: {
			type: "select" as const,
			name: "smtp_encryption",
			label: CONFIGURACOES_MESSAGES.SMTP_ENCRYPTION,
			options: SELECT_OPTIONS.SMTP_ENCRYPTION,
		},
		email_from_address: {
			type: "email" as const,
			name: "email_from_address",
			label: CONFIGURACOES_MESSAGES.EMAIL_FROM_ADDRESS,
			placeholder: CONFIGURACOES_PLACEHOLDERS.EMAIL_FROM_ADDRESS,
		},
		email_from_name: {
			type: "text" as const,
			name: "email_from_name",
			label: CONFIGURACOES_MESSAGES.EMAIL_FROM_NAME,
			placeholder: CONFIGURACOES_PLACEHOLDERS.EMAIL_FROM_NAME,
		},
	},
	NOTIFICACOES: {
		notificacoes_email: {
			type: "switch" as const,
			name: "notificacoes_email",
			label: CONFIGURACOES_MESSAGES.NOTIFICACOES_EMAIL,
		},
		notificacoes_sistema: {
			type: "switch" as const,
			name: "notificacoes_sistema",
			label: CONFIGURACOES_MESSAGES.NOTIFICACOES_SISTEMA,
		},
		notificar_aprovacao: {
			type: "switch" as const,
			name: "notificar_aprovacao",
			label: CONFIGURACOES_MESSAGES.NOTIFICAR_APROVACAO,
		},
		notificar_rejeicao: {
			type: "switch" as const,
			name: "notificar_rejeicao",
			label: CONFIGURACOES_MESSAGES.NOTIFICAR_REJEICAO,
		},
		notificar_vencimento: {
			type: "switch" as const,
			name: "notificar_vencimento",
			label: CONFIGURACOES_MESSAGES.NOTIFICAR_VENCIMENTO,
		},
	},
	BACKUP: {
		backup_automatico: {
			type: "switch" as const,
			name: "backup_automatico",
			label: CONFIGURACOES_MESSAGES.BACKUP_AUTOMATICO,
		},
		backup_frequencia: {
			type: "select" as const,
			name: "backup_frequencia",
			label: CONFIGURACOES_MESSAGES.BACKUP_FREQUENCIA,
			options: SELECT_OPTIONS.BACKUP_FREQUENCIA,
		},
		backup_retencao: {
			type: "number" as const,
			name: "backup_retencao",
			label: CONFIGURACOES_MESSAGES.BACKUP_RETENCAO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.BACKUP_RETENCAO,
			min: 1,
			max: 365,
		},
	},
	SEGURANCA: {
		sessao_timeout: {
			type: "number" as const,
			name: "sessao_timeout",
			label: CONFIGURACOES_MESSAGES.SESSAO_TIMEOUT,
			placeholder: CONFIGURACOES_PLACEHOLDERS.SESSAO_TIMEOUT,
			min: 15,
			max: 480,
		},
		login_tentativas: {
			type: "number" as const,
			name: "login_tentativas",
			label: CONFIGURACOES_MESSAGES.LOGIN_TENTATIVAS,
			placeholder: CONFIGURACOES_PLACEHOLDERS.LOGIN_TENTATIVAS,
			min: 3,
			max: 10,
		},
		senha_complexidade: {
			type: "switch" as const,
			name: "senha_complexidade",
			label: CONFIGURACOES_MESSAGES.SENHA_COMPLEXIDADE,
		},
		autenticacao_dois_fatores: {
			type: "switch" as const,
			name: "autenticacao_dois_fatores",
			label: CONFIGURACOES_MESSAGES.AUTENTICACAO_DOIS_FATORES,
		},
	},
	RELATORIOS: {
		relatorio_logo: {
			type: "text" as const,
			name: "relatorio_logo",
			label: CONFIGURACOES_MESSAGES.RELATORIO_LOGO,
			placeholder: CONFIGURACOES_PLACEHOLDERS.RELATORIO_LOGO,
		},
		relatorio_rodape: {
			type: "textarea" as const,
			name: "relatorio_rodape",
			label: CONFIGURACOES_MESSAGES.RELATORIO_RODAPE,
			placeholder: CONFIGURACOES_PLACEHOLDERS.RELATORIO_RODAPE,
			rows: 3,
		},
		formato_data_padrao: {
			type: "select" as const,
			name: "formato_data_padrao",
			label: CONFIGURACOES_MESSAGES.FORMATO_DATA_PADRAO,
			options: SELECT_OPTIONS.FORMATO_DATA,
		},
		moeda_padrao: {
			type: "select" as const,
			name: "moeda_padrao",
			label: CONFIGURACOES_MESSAGES.MOEDA_PADRAO,
			options: SELECT_OPTIONS.MOEDA,
		},
	},
} as const;

export type ConfigFieldType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "textarea"
	| "select"
	| "switch";

export type SelectOption = {
	value: string;
	label: string;
};

export type ConfigFieldConfig = {
	type: ConfigFieldType;
	name: string;
	label: string;
	placeholder?: string;
	rows?: number;
	min?: number;
	max?: number;
	options?: readonly SelectOption[];
};

export type ConfigSectionKey = keyof typeof FIELD_CONFIGS;
