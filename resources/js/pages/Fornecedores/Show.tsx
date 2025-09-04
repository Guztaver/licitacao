import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { fornecedores, requisicoes } from "@/routes";
import type { BreadcrumbItem, Fornecedor, Requisicao } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	ArrowLeft,
	Building,
	Edit,
	FileText,
	Mail,
	MapPin,
	Phone,
	Trash2,
	Users,
} from "lucide-react";
import react from "react";

// Constants
const EMPTY_MESSAGES = {
	noData: "Não informado",
	noAddress: "Endereço não informado",
	noPhone: "Telefone não informado",
	noEmail: "E-mail não informado",
	noObservations: "Nenhuma observação",
	noRequisitions: "Este fornecedor ainda não possui requisições registradas",
	noValue: "Sem valor",
} as const;

const STATUS_CONFIG = {
	autorizada: { label: "Autorizada", variant: "secondary" as const },
	concretizada: { label: "Concretizada", variant: "default" as const },
	cancelada: { label: "Cancelada", variant: "destructive" as const },
} as const;

// Types
interface FornecedoresShowProps {
	fornecedor: Fornecedor & {
		requisicoes?: Requisicao[];
		requisicoes_count: number;
	};
}

interface InfoFieldProps {
	label: string;
	value?: string | number;
	icon?: react.ReactNode;
	emptyMessage?: string;
	format?: "currency" | "date" | "phone" | "cnpj";
}

interface StatCardProps {
	label: string;
	value: number;
	color: string;
	description: string;
}

// Utility Functions
const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
};

const formatDate = (dateString: string): string => {
	return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
		locale: ptBR,
	});
};

const formatValue = (
	value: string | number | undefined,
	formatType?: "currency" | "date" | "phone" | "cnpj",
): string => {
	if (!value) return "";

	switch (formatType) {
		case "currency":
			return formatCurrency(Number(value));
		case "date":
			return formatDate(String(value));
		case "phone":
		case "cnpj":
		default:
			return String(value);
	}
};

const getStatusBadge = (status: string) => {
	return (
		STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
			label: status,
			variant: "secondary" as const,
		}
	);
};

const calculateStats = (requisicoes?: Requisicao[]) => {
	if (!requisicoes) {
		return {
			total: 0,
			autorizadas: 0,
			concretizadas: 0,
			canceladas: 0,
			valorTotal: 0,
		};
	}

	return {
		total: requisicoes.length,
		autorizadas: requisicoes.filter((r) => r.status === "autorizada").length,
		concretizadas: requisicoes.filter((r) => r.status === "concretizada")
			.length,
		canceladas: requisicoes.filter((r) => r.status === "cancelada").length,
		valorTotal: requisicoes.reduce(
			(acc, r) => acc + (Number(r.valor_final) || 0),
			0,
		),
	};
};

// Components
const InfoField = ({
	label,
	value,
	icon,
	emptyMessage = EMPTY_MESSAGES.noData,
	format,
}: InfoFieldProps) => (
	<div>
		<h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
			{icon && <span className="mr-1">{icon}</span>}
			{label}
		</h3>
		<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
			{value ? formatValue(value, format) : emptyMessage}
		</p>
	</div>
);

const StatCard = ({ label, value, color, description }: StatCardProps) => (
	<div className="text-center">
		<div className={`text-3xl font-bold ${color}`}>{value || 0}</div>
		<div className="text-sm text-gray-500">{label}</div>
		{description && (
			<div className="text-xs text-gray-400 mt-1">{description}</div>
		)}
	</div>
);

const RequisicoesTable = ({
	requisicoesList,
}: {
	requisicoesList: Requisicao[];
}) => (
	<div className="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Número</TableHead>
					<TableHead>Data</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{requisicoesList.slice(0, 5).map((requisicao) => {
					const statusConfig = getStatusBadge(requisicao.status);
					return (
						<TableRow key={requisicao.id}>
							<TableCell>
								<Link
									href={requisicoes.show(requisicao.id)}
									className="font-medium text-blue-600 hover:text-blue-800"
								>
									{requisicao.numero_completo || requisicao.numero}
								</Link>
							</TableCell>
							<TableCell>
								{requisicao.data_recebimento
									? format(new Date(requisicao.data_recebimento), "dd/MM/yyyy")
									: EMPTY_MESSAGES.noData}
							</TableCell>
							<TableCell>
								<Badge variant={statusConfig.variant}>
									{statusConfig.label}
								</Badge>
							</TableCell>
							<TableCell>
								{requisicao.valor_final
									? formatCurrency(Number(requisicao.valor_final))
									: EMPTY_MESSAGES.noValue}
							</TableCell>
							<TableCell>
								<Link href={requisicoes.show(requisicao.id)}>
									<Button variant="outline" size="sm">
										Ver
									</Button>
								</Link>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	</div>
);

const EmptyState = () => (
	<div className="py-8 text-center">
		<FileText className="mx-auto h-12 w-12 text-gray-400" />
		<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
			Nenhuma requisição
		</h3>
		<p className="mt-1 text-sm text-gray-500">
			{EMPTY_MESSAGES.noRequisitions}
		</p>
	</div>
);

const ActionButtons = ({ fornecedor }: { fornecedor: Fornecedor }) => {
	const handleDelete = react.useCallback(() => {
		if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
			router.delete(fornecedores.show(fornecedor.id));
		}
	}, [fornecedor.id]);

	return (
		<div className="flex items-center space-x-2">
			<Link href={fornecedores.index()}>
				<Button variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar
				</Button>
			</Link>
			<Link href={fornecedores.edit(fornecedor.id)}>
				<Button variant="outline">
					<Edit className="mr-2 h-4 w-4" />
					Editar
				</Button>
			</Link>
			<Button variant="destructive" onClick={handleDelete}>
				<Trash2 className="mr-2 h-4 w-4" />
				Excluir
			</Button>
		</div>
	);
};

const QuickActions = ({ fornecedor }: { fornecedor: Fornecedor }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg">Ações Rápidas</CardTitle>
		</CardHeader>
		<CardContent className="space-y-2">
			<Link href={fornecedores.edit(fornecedor.id)} className="block">
				<Button variant="outline" className="w-full justify-start">
					<Edit className="mr-2 h-4 w-4" />
					Editar fornecedor
				</Button>
			</Link>
			<Link
				href={`${requisicoes.index()}?fornecedor_id=${fornecedor.id}`}
				className="block"
			>
				<Button variant="outline" className="w-full justify-start">
					<FileText className="mr-2 h-4 w-4" />
					Ver todas as requisições
				</Button>
			</Link>
		</CardContent>
	</Card>
);

export default function FornecedoresShow({
	fornecedor,
}: FornecedoresShowProps) {
	const fornecedorName = fornecedor.razao_social || "Fornecedor";

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: "Fornecedores",
			href: fornecedores.index(),
		},
		{
			title: fornecedorName,
			href: fornecedores.show(fornecedor.id),
		},
	];

	const stats = calculateStats(fornecedor.requisicoes);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Fornecedor: ${fornecedorName}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{fornecedorName}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Detalhes do fornecedor
						</p>
					</div>
					<ActionButtons fornecedor={fornecedor} />
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Content */}
					<div className="space-y-6 lg:col-span-2">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle
									className="flex
 items-center"
								>
									<Building className="mr-2 h-5 w-5" />
									Informações do Fornecedor
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<InfoField
										label="Nome / Razão Social"
										value={fornecedorName}
									/>
									<InfoField
										label="CNPJ / CPF"
										value={fornecedor.cnpj_formatado || fornecedor.cnpj}
										emptyMessage={EMPTY_MESSAGES.noData}
									/>
								</div>

								<InfoField
									label="Endereço"
									value={fornecedor.endereco_completo || fornecedor.endereco}
									icon={<MapPin className="h-4 w-4" />}
									emptyMessage={EMPTY_MESSAGES.noAddress}
								/>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<InfoField
										label="Telefone"
										value={fornecedor.telefone_formatado || fornecedor.telefone}
										icon={<Phone className="h-4 w-4" />}
										emptyMessage={EMPTY_MESSAGES.noPhone}
									/>
									<InfoField
										label="E-mail"
										value={fornecedor.email}
										icon={<Mail className="h-4 w-4" />}
										emptyMessage={EMPTY_MESSAGES.noEmail}
									/>
								</div>

								{fornecedor.observacoes && (
									<InfoField
										label="Observações"
										value={fornecedor.observacoes}
										emptyMessage={EMPTY_MESSAGES.noObservations}
									/>
								)}

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<InfoField
										label="Criado em"
										value={fornecedor.created_at}
										format="date"
									/>
									<InfoField
										label="Última atualização"
										value={fornecedor.updated_at}
										format="date"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Requisitions */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<FileText className="mr-2 h-5 w-5" />
									Requisições ({stats.total})
								</CardTitle>
								<CardDescription>
									{stats.total === 0
										? "Nenhuma requisição registrada"
										: `Últimas requisições relacionadas a este fornecedor`}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{fornecedor.requisicoes && fornecedor.requisicoes.length > 0 ? (
									<div className="space-y-4">
										<RequisicoesTable
											requisicoesList={fornecedor.requisicoes}
										/>
										{stats.total > 5 && (
											<div className="text-center">
												<Link
													href={`${requisicoes.index()}?fornecedor_id=${
														fornecedor.id
													}`}
												>
													<Button variant="outline" size="sm">
														Ver todas as requisições ({stats.total})
													</Button>
												</Link>
											</div>
										)}
									</div>
								) : (
									<EmptyState />
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Statistics */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center">
									<Users className="mr-2 h-4 w-4" />
									Estatísticas
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<StatCard
									label="Total"
									value={stats.total}
									color="text-blue-600"
									description="requisições"
								/>

								{stats.total > 0 && (
									<>
										<div
											className="border-t
 pt-4"
										>
											<StatCard
												label="Autorizadas"
												value={stats.autorizadas}
												color="text-yellow-600"
												description="aguardando processamento"
											/>
										</div>

										<div className="border-t pt-4">
											<StatCard
												label="Concretizadas"
												value={stats.concretizadas}
												color="text-green-600"
												description="finalizadas"
											/>
										</div>

										<div className="border-t pt-4">
											<StatCard
												label="Canceladas"
												value={stats.canceladas}
												color="text-red-600"
												description="não processadas"
											/>
										</div>

										<div className="border-t pt-4">
											<StatCard
												label={
													stats.valorTotal === 0
														? "Sem valor"
														: formatCurrency(stats.valorTotal)
												}
												value={0}
												color="text-purple-600"
												description="valor total movimentado"
											/>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<QuickActions fornecedor={fornecedor} />
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
