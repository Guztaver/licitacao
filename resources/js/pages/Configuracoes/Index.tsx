import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import {
	Bell,
	Building,
	Database,
	FileText,
	Mail,
	Save,
	Settings,
	Shield,
} from "lucide-react";
import type { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Configurações",
		href: "/configuracoes",
	},
];

interface ConfiguracoesData {
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
	configuracoes: ConfiguracoesData;
}

export default function ConfiguracoesIndex({
	configuracoes,
}: ConfiguracoesIndexProps) {
	const { data, setData, post, processing, errors } =
		useForm<ConfiguracoesData>({
			// Sistema
			nome_sistema: configuracoes.nome_sistema || "Sistema de Licitações",
			versao_sistema: configuracoes.versao_sistema || "1.0.0",
			descricao_sistema: configuracoes.descricao_sistema || "",

			// Organização
			nome_organizacao: configuracoes.nome_organizacao || "",
			cnpj_organizacao: configuracoes.cnpj_organizacao || "",
			endereco_organizacao: configuracoes.endereco_organizacao || "",
			telefone_organizacao: configuracoes.telefone_organizacao || "",
			email_organizacao: configuracoes.email_organizacao || "",

			// E-mail
			smtp_host: configuracoes.smtp_host || "",
			smtp_port: configuracoes.smtp_port || "587",
			smtp_username: configuracoes.smtp_username || "",
			smtp_password: configuracoes.smtp_password || "",
			smtp_encryption: configuracoes.smtp_encryption || "tls",
			email_from_address: configuracoes.email_from_address || "",
			email_from_name: configuracoes.email_from_name || "",

			// Notificações
			notificacoes_email: configuracoes.notificacoes_email ?? true,
			notificacoes_sistema: configuracoes.notificacoes_sistema ?? true,
			notificar_aprovacao: configuracoes.notificar_aprovacao ?? true,
			notificar_rejeicao: configuracoes.notificar_rejeicao ?? true,
			notificar_vencimento: configuracoes.notificar_vencimento ?? true,

			// Backup
			backup_automatico: configuracoes.backup_automatico ?? false,
			backup_frequencia: configuracoes.backup_frequencia || "diario",
			backup_retencao: configuracoes.backup_retencao || "30",

			// Segurança
			sessao_timeout: configuracoes.sessao_timeout || "120",
			login_tentativas: configuracoes.login_tentativas || "5",
			senha_complexidade: configuracoes.senha_complexidade ?? true,
			autenticacao_dois_fatores:
				configuracoes.autenticacao_dois_fatores ?? false,

			// Relatórios
			relatorio_logo: configuracoes.relatorio_logo || "",
			relatorio_rodape: configuracoes.relatorio_rodape || "",
			formato_data_padrao: configuracoes.formato_data_padrao || "dd/MM/yyyy",
			moeda_padrao: configuracoes.moeda_padrao || "BRL",
		});

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		post("/configuracoes", {
			preserveScroll: true,
		});
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Configurações" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Configurações do Sistema
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Gerencie as configurações gerais do sistema
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Informações do Sistema */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Settings className="mr-2 h-5 w-5" />
								Informações do Sistema
							</CardTitle>
							<CardDescription>
								Configurações básicas do sistema
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="nome_sistema">Nome do Sistema</Label>
									<Input
										id="nome_sistema"
										value={data.nome_sistema}
										onChange={(e) => setData("nome_sistema", e.target.value)}
										className={errors.nome_sistema ? "border-red-500" : ""}
									/>
									{errors.nome_sistema && (
										<p className="text-sm text-red-500">
											{errors.nome_sistema}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="versao_sistema">Versão</Label>
									<Input
										id="versao_sistema"
										value={data.versao_sistema}
										onChange={(e) => setData("versao_sistema", e.target.value)}
										className={errors.versao_sistema ? "border-red-500" : ""}
									/>
									{errors.versao_sistema && (
										<p className="text-sm text-red-500">
											{errors.versao_sistema}
										</p>
									)}
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="descricao_sistema">Descrição</Label>
								<Textarea
									id="descricao_sistema"
									value={data.descricao_sistema}
									onChange={(e) => setData("descricao_sistema", e.target.value)}
									placeholder="Descrição do sistema de licitações..."
									rows={3}
									className={errors.descricao_sistema ? "border-red-500" : ""}
								/>
								{errors.descricao_sistema && (
									<p className="text-sm text-red-500">
										{errors.descricao_sistema}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Informações da Organização */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Building className="mr-2 h-5 w-5" />
								Informações da Organização
							</CardTitle>
							<CardDescription>
								Dados da organização responsável pelo sistema
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="nome_organizacao">Nome da Organização</Label>
									<Input
										id="nome_organizacao"
										value={data.nome_organizacao}
										onChange={(e) =>
											setData("nome_organizacao", e.target.value)
										}
										placeholder="Prefeitura Municipal de..."
										className={errors.nome_organizacao ? "border-red-500" : ""}
									/>
									{errors.nome_organizacao && (
										<p className="text-sm text-red-500">
											{errors.nome_organizacao}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="cnpj_organizacao">CNPJ</Label>
									<Input
										id="cnpj_organizacao"
										value={data.cnpj_organizacao}
										onChange={(e) =>
											setData("cnpj_organizacao", e.target.value)
										}
										placeholder="00.000.000/0000-00"
										className={errors.cnpj_organizacao ? "border-red-500" : ""}
									/>
									{errors.cnpj_organizacao && (
										<p className="text-sm text-red-500">
											{errors.cnpj_organizacao}
										</p>
									)}
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="endereco_organizacao">Endereço</Label>
								<Input
									id="endereco_organizacao"
									value={data.endereco_organizacao}
									onChange={(e) =>
										setData("endereco_organizacao", e.target.value)
									}
									placeholder="Endereço completo da organização"
									className={
										errors.endereco_organizacao ? "border-red-500" : ""
									}
								/>
								{errors.endereco_organizacao && (
									<p className="text-sm text-red-500">
										{errors.endereco_organizacao}
									</p>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="telefone_organizacao">Telefone</Label>
									<Input
										id="telefone_organizacao"
										value={data.telefone_organizacao}
										onChange={(e) =>
											setData("telefone_organizacao", e.target.value)
										}
										placeholder="(XX) XXXXX-XXXX"
										className={
											errors.telefone_organizacao ? "border-red-500" : ""
										}
									/>
									{errors.telefone_organizacao && (
										<p className="text-sm text-red-500">
											{errors.telefone_organizacao}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="email_organizacao">E-mail</Label>
									<Input
										id="email_organizacao"
										type="email"
										value={data.email_organizacao}
										onChange={(e) =>
											setData("email_organizacao", e.target.value)
										}
										placeholder="contato@organizacao.gov.br"
										className={errors.email_organizacao ? "border-red-500" : ""}
									/>
									{errors.email_organizacao && (
										<p className="text-sm text-red-500">
											{errors.email_organizacao}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Configurações de E-mail */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Mail className="mr-2 h-5 w-5" />
								Configurações de E-mail
							</CardTitle>
							<CardDescription>
								Configurações do servidor SMTP para envio de e-mails
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="smtp_host">Servidor SMTP</Label>
									<Input
										id="smtp_host"
										value={data.smtp_host}
										onChange={(e) => setData("smtp_host", e.target.value)}
										placeholder="smtp.gmail.com"
										className={errors.smtp_host ? "border-red-500" : ""}
									/>
									{errors.smtp_host && (
										<p className="text-sm text-red-500">{errors.smtp_host}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp_port">Porta</Label>
									<Input
										id="smtp_port"
										value={data.smtp_port}
										onChange={(e) => setData("smtp_port", e.target.value)}
										placeholder="587"
										className={errors.smtp_port ? "border-red-500" : ""}
									/>
									{errors.smtp_port && (
										<p className="text-sm text-red-500">{errors.smtp_port}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp_encryption">Criptografia</Label>
									<Select
										value={data.smtp_encryption}
										onValueChange={(value) => setData("smtp_encryption", value)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="tls">TLS</SelectItem>
											<SelectItem value="ssl">SSL</SelectItem>
											<SelectItem value="none">Nenhuma</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="smtp_username">Usuário</Label>
									<Input
										id="smtp_username"
										value={data.smtp_username}
										onChange={(e) => setData("smtp_username", e.target.value)}
										placeholder="usuario@exemplo.com"
										className={errors.smtp_username ? "border-red-500" : ""}
									/>
									{errors.smtp_username && (
										<p className="text-sm text-red-500">
											{errors.smtp_username}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp_password">Senha</Label>
									<Input
										id="smtp_password"
										type="password"
										value={data.smtp_password}
										onChange={(e) => setData("smtp_password", e.target.value)}
										placeholder="••••••••"
										className={errors.smtp_password ? "border-red-500" : ""}
									/>
									{errors.smtp_password && (
										<p className="text-sm text-red-500">
											{errors.smtp_password}
										</p>
									)}
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="email_from_address">E-mail de Envio</Label>
									<Input
										id="email_from_address"
										type="email"
										value={data.email_from_address}
										onChange={(e) =>
											setData("email_from_address", e.target.value)
										}
										placeholder="noreply@organizacao.gov.br"
										className={
											errors.email_from_address ? "border-red-500" : ""
										}
									/>
									{errors.email_from_address && (
										<p className="text-sm text-red-500">
											{errors.email_from_address}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="email_from_name">Nome do Remetente</Label>
									<Input
										id="email_from_name"
										value={data.email_from_name}
										onChange={(e) => setData("email_from_name", e.target.value)}
										placeholder="Sistema de Licitações"
										className={errors.email_from_name ? "border-red-500" : ""}
									/>
									{errors.email_from_name && (
										<p className="text-sm text-red-500">
											{errors.email_from_name}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Notificações */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Bell className="mr-2 h-5 w-5" />
								Notificações
							</CardTitle>
							<CardDescription>
								Configure quando e como enviar notificações
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="notificacoes_email"
										className="text-sm font-medium"
									>
										Notificações por E-mail
									</Label>
									<Switch
										id="notificacoes_email"
										checked={data.notificacoes_email}
										onCheckedChange={(checked) =>
											setData("notificacoes_email", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="notificacoes_sistema"
										className="text-sm font-medium"
									>
										Notificações no Sistema
									</Label>
									<Switch
										id="notificacoes_sistema"
										checked={data.notificacoes_sistema}
										onCheckedChange={(checked) =>
											setData("notificacoes_sistema", checked)
										}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="notificar_aprovacao"
										className="text-sm font-medium"
									>
										Aprovação de Requisições
									</Label>
									<Switch
										id="notificar_aprovacao"
										checked={data.notificar_aprovacao}
										onCheckedChange={(checked) =>
											setData("notificar_aprovacao", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="notificar_rejeicao"
										className="text-sm font-medium"
									>
										Rejeição de Requisições
									</Label>
									<Switch
										id="notificar_rejeicao"
										checked={data.notificar_rejeicao}
										onCheckedChange={(checked) =>
											setData("notificar_rejeicao", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="notificar_vencimento"
										className="text-sm font-medium"
									>
										Vencimento de Prazos
									</Label>
									<Switch
										id="notificar_vencimento"
										checked={data.notificar_vencimento}
										onCheckedChange={(checked) =>
											setData("notificar_vencimento", checked)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Backup */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Database className="mr-2 h-5 w-5" />
								Backup
							</CardTitle>
							<CardDescription>
								Configurações de backup automático
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between space-x-2">
								<Label
									htmlFor="backup_automatico"
									className="text-sm font-medium"
								>
									Backup Automático
								</Label>
								<Switch
									id="backup_automatico"
									checked={data.backup_automatico}
									onCheckedChange={(checked) =>
										setData("backup_automatico", checked)
									}
								/>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="backup_frequencia">Frequência</Label>
									<Select
										value={data.backup_frequencia}
										onValueChange={(value) =>
											setData("backup_frequencia", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="diario">Diário</SelectItem>
											<SelectItem value="semanal">Semanal</SelectItem>
											<SelectItem value="mensal">Mensal</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="backup_retencao">Retenção (dias)</Label>
									<Input
										id="backup_retencao"
										type="number"
										value={data.backup_retencao}
										onChange={(e) => setData("backup_retencao", e.target.value)}
										placeholder="30"
										min="1"
										max="365"
										className={errors.backup_retencao ? "border-red-500" : ""}
									/>
									{errors.backup_retencao && (
										<p className="text-sm text-red-500">
											{errors.backup_retencao}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Segurança */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Shield className="mr-2 h-5 w-5" />
								Segurança
							</CardTitle>
							<CardDescription>
								Configurações de segurança do sistema
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="sessao_timeout">
										Timeout da Sessão (minutos)
									</Label>
									<Input
										id="sessao_timeout"
										type="number"
										value={data.sessao_timeout}
										onChange={(e) => setData("sessao_timeout", e.target.value)}
										placeholder="120"
										min="15"
										max="480"
										className={errors.sessao_timeout ? "border-red-500" : ""}
									/>
									{errors.sessao_timeout && (
										<p className="text-sm text-red-500">
											{errors.sessao_timeout}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="login_tentativas">Tentativas de Login</Label>
									<Input
										id="login_tentativas"
										type="number"
										value={data.login_tentativas}
										onChange={(e) =>
											setData("login_tentativas", e.target.value)
										}
										placeholder="5"
										min="3"
										max="10"
										className={errors.login_tentativas ? "border-red-500" : ""}
									/>
									{errors.login_tentativas && (
										<p className="text-sm text-red-500">
											{errors.login_tentativas}
										</p>
									)}
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="senha_complexidade"
										className="text-sm font-medium"
									>
										Exigir Senha Complexa
									</Label>
									<Switch
										id="senha_complexidade"
										checked={data.senha_complexidade}
										onCheckedChange={(checked) =>
											setData("senha_complexidade", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between space-x-2">
									<Label
										htmlFor="autenticacao_dois_fatores"
										className="text-sm font-medium"
									>
										Autenticação de Dois Fatores
									</Label>
									<Switch
										id="autenticacao_dois_fatores"
										checked={data.autenticacao_dois_fatores}
										onCheckedChange={(checked) =>
											setData("autenticacao_dois_fatores", checked)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Relatórios */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<FileText className="mr-2 h-5 w-5" />
								Relatórios
							</CardTitle>
							<CardDescription>
								Configurações para geração de relatórios
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="relatorio_logo">URL do Logo</Label>
								<Input
									id="relatorio_logo"
									value={data.relatorio_logo}
									onChange={(e) => setData("relatorio_logo", e.target.value)}
									placeholder="https://exemplo.com/logo.png"
									className={errors.relatorio_logo ? "border-red-500" : ""}
								/>
								{errors.relatorio_logo && (
									<p className="text-sm text-red-500">
										{errors.relatorio_logo}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="relatorio_rodape">Rodapé dos Relatórios</Label>
								<Textarea
									id="relatorio_rodape"
									value={data.relatorio_rodape}
									onChange={(e) => setData("relatorio_rodape", e.target.value)}
									placeholder="Texto que aparecerá no rodapé dos relatórios..."
									rows={3}
									className={errors.relatorio_rodape ? "border-red-500" : ""}
								/>
								{errors.relatorio_rodape && (
									<p className="text-sm text-red-500">
										{errors.relatorio_rodape}
									</p>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="formato_data_padrao">Formato de Data</Label>
									<Select
										value={data.formato_data_padrao}
										onValueChange={(value) =>
											setData("formato_data_padrao", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
											<SelectItem value="dd-MM-yyyy">dd-MM-yyyy</SelectItem>
											<SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="moeda_padrao">Moeda Padrão</Label>
									<Select
										value={data.moeda_padrao}
										onValueChange={(value) => setData("moeda_padrao", value)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="BRL">Real (R$)</SelectItem>
											<SelectItem value="USD">Dólar ($)</SelectItem>
											<SelectItem value="EUR">Euro (€)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Botões de Ação */}
					<div className="flex justify-end space-x-4">
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar Configurações"}
						</Button>
					</div>
				</form>

				{/* Informações */}
				<Card className="bg-blue-50 dark:bg-blue-950/20">
					<CardContent className="pt-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<Settings className="h-5 w-5 text-blue-400" />
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
									Informações
								</h3>
								<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
									<p>
										• As configurações são aplicadas imediatamente após serem
										salvas
										<br />• Alterações de segurança podem afetar usuários
										conectados
										<br />• Configure o e-mail SMTP para receber notificações
										automáticas
										<br />• O backup automático ajuda a proteger seus dados
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}
