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

interface FornecedoresShowProps {
	fornecedor: Fornecedor & {
		requisicoes?: Requisicao[];
		requisicoes_count: number;
	};
}

export default function FornecedoresShow({
	fornecedor,
}: FornecedoresShowProps) {
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: "Fornecedores",
			href: fornecedores.index(),
		},
		{
			title: fornecedor.nome,
			href: fornecedores.show(fornecedor.id),
		},
	];

	const handleDelete = () => {
		if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
			router.delete(fornecedores.destroy(fornecedor.id));
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pendente: { label: "Pendente", variant: "secondary" as const },
			aprovado: { label: "Aprovado", variant: "default" as const },
			rejeitado: { label: "Rejeitado", variant: "destructive" as const },
		};

		return (
			statusConfig[status as keyof typeof statusConfig] || {
				label: status,
				variant: "secondary" as const,
			}
		);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Fornecedor: ${fornecedor.nome}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{fornecedor.nome}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Detalhes do fornecedor
						</p>
					</div>
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
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Informações do Fornecedor */}
					<div className="lg:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Users className="mr-2 h-5 w-5" />
									Informações do Fornecedor
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Nome / Razão Social
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{fornecedor.nome}
										</p>
									</div>
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											CNPJ / CPF
										</h3>
										<p className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
											{fornecedor.cnpj_cpf || "-"}
										</p>
									</div>
								</div>

								{fornecedor.endereco && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
											<MapPin className="mr-1 h-4 w-4" />
											Endereço
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{fornecedor.endereco}
										</p>
									</div>
								)}

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{fornecedor.telefone && (
										<div>
											<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
												<Phone className="mr-1 h-4 w-4" />
												Telefone
											</h3>
											<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
												{fornecedor.telefone}
											</p>
										</div>
									)}
									{fornecedor.email && (
										<div>
											<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
												<Mail className="mr-1 h-4 w-4" />
												E-mail
											</h3>
											<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
												{fornecedor.email}
											</p>
										</div>
									)}
								</div>

								{fornecedor.observacoes && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Observações
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
											{fornecedor.observacoes}
										</p>
									</div>
								)}

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Criado em
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{format(
												new Date(fornecedor.created_at),
												"dd 'de' MMMM 'de' yyyy 'às' HH:mm",
												{
													locale: ptBR,
												},
											)}
										</p>
									</div>
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Última atualização
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{format(
												new Date(fornecedor.updated_at),
												"dd 'de' MMMM 'de' yyyy 'às' HH:mm",
												{
													locale: ptBR,
												},
											)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Requisições */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<FileText className="mr-2 h-5 w-5" />
									Requisições ({fornecedor.requisicoes_count})
								</CardTitle>
								<CardDescription>
									Últimas requisições relacionadas a este fornecedor
								</CardDescription>
							</CardHeader>
							<CardContent>
								{fornecedor.requisicoes && fornecedor.requisicoes.length > 0 ? (
									<div className="space-y-4">
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
													{fornecedor.requisicoes
														.slice(0, 5)
														.map((requisicao) => {
															const statusConfig = getStatusBadge(
																requisicao.status,
															);
															return (
																<TableRow key={requisicao.id}>
																	<TableCell>
																		<Link
																			href={requisicoes.show(requisicao.id)}
																			className="font-medium text-blue-600 hover:text-blue-800"
																		>
																			{requisicao.numero}
																		</Link>
																	</TableCell>
																	<TableCell>
																		{format(
																			new Date(requisicao.data_requisicao),
																			"dd/MM/yyyy",
																		)}
																	</TableCell>
																	<TableCell>
																		<Badge variant={statusConfig.variant}>
																			{statusConfig.label}
																		</Badge>
																	</TableCell>
																	<TableCell>
																		{requisicao.valor_total
																			? new Intl.NumberFormat("pt-BR", {
																					style: "currency",
																					currency: "BRL",
																				}).format(
																					Number(requisicao.valor_total),
																				)
																			: "-"}
																	</TableCell>
																	<TableCell>
																		<Link
																			href={requisicoes.show(requisicao.id)}
																		>
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
										{fornecedor.requisicoes_count > 5 && (
											<div className="text-center">
												<Link
													href={`${requisicoes.index()}?fornecedor_id=${fornecedor.id}`}
												>
													<Button variant="outline" size="sm">
														Ver todas as requisições (
														{fornecedor.requisicoes_count})
													</Button>
												</Link>
											</div>
										)}
									</div>
								) : (
									<div className="text-center py-8">
										<FileText className="mx-auto h-12 w-12 text-gray-400" />
										<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
											Nenhuma requisição
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Este fornecedor ainda não possui requisições registradas.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Estatísticas */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Estatísticas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-600">
										{fornecedor.requisicoes_count}
									</div>
									<div className="text-sm text-gray-500">
										Requisições totais
									</div>
								</div>

								{fornecedor.requisicoes && (
									<>
										<div className="border-t pt-4">
											<div className="text-center">
												<div className="text-2xl font-bold text-green-600">
													{
														fornecedor.requisicoes.filter(
															(r) => r.status === "aprovado",
														).length
													}
												</div>
												<div className="text-sm text-gray-500">Aprovadas</div>
											</div>
										</div>

										<div className="border-t pt-4">
											<div className="text-center">
												<div className="text-2xl font-bold text-yellow-600">
													{
														fornecedor.requisicoes.filter(
															(r) => r.status === "pendente",
														).length
													}
												</div>
												<div className="text-sm text-gray-500">Pendentes</div>
											</div>
										</div>

										<div className="border-t pt-4">
											<div className="text-center">
												<div className="text-2xl font-bold text-red-600">
													{
														fornecedor.requisicoes.filter(
															(r) => r.status === "rejeitado",
														).length
													}
												</div>
												<div className="text-sm text-gray-500">Rejeitadas</div>
											</div>
										</div>

										<div className="border-t pt-4">
											<div className="text-center">
												<div className="text-2xl font-bold text-purple-600">
													{new Intl.NumberFormat("pt-BR", {
														style: "currency",
														currency: "BRL",
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}).format(
														fornecedor.requisicoes.reduce(
															(acc, r) => acc + (Number(r.valor_total) || 0),
															0,
														),
													)}
												</div>
												<div className="text-sm text-gray-500">Valor total</div>
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Ações</CardTitle>
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
										Ver requisições
									</Button>
								</Link>
								<Button
									variant="destructive"
									className="w-full justify-start"
									onClick={handleDelete}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Excluir fornecedor
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
