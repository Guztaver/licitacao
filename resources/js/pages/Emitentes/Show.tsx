import { Head, Link, router } from "@inertiajs/react";
import {
	ArrowLeft,
	Building,
	Edit,
	FileText,
	Mail,
	MapPin,
	Phone,
	Trash2,
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
import { emitentes } from "@/routes";
import type { BreadcrumbItem, Emitente, Requisicao } from "@/types";

interface EmitentesShowProps {
	emitente: Emitente & {
		requisicoes?: Requisicao[];
		requisicoes_count: number;
	};
	requisicoes: Requisicao[];
	stats: {
		total_requisicoes: number;
		requisicoes_concretizadas: number;
		valor_total: number;
		requisicoes_mes_atual: number;
	};
}

export default function EmitentesShow({
	emitente,
	requisicoes,
	stats,
}: EmitentesShowProps) {
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: "Emitentes",
			href: emitentes.index(),
		},
		{
			title: emitente.nome,
			href: emitentes.show(emitente.id),
		},
	];

	const handleDelete = () => {
		if (confirm("Tem certeza que deseja excluir este emitente?")) {
			router.delete(emitentes.show(emitente.id));
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
			<Head title={`Emitente: ${emitente.nome}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{emitente.nome}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Detalhes do órgão emitente
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Link href={emitentes.index()}>
							<Button variant="outline">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Voltar
							</Button>
						</Link>
						<Link href={emitentes.edit(emitente.id)}>
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
					{/* Informações do Emitente */}
					<div className="space-y-6 lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Building className="mr-2 h-5 w-5" />
									Informações do Emitente
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Nome
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{emitente.nome}
										</p>
									</div>
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Sigla
										</h3>
										<p className="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100">
											{emitente.sigla}
										</p>
									</div>
								</div>

								{emitente.endereco && (
									<div>
										<h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
											<MapPin className="mr-1 h-4 w-4" />
											Endereço
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{emitente.endereco}
										</p>
									</div>
								)}

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{emitente.telefone && (
										<div>
											<h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
												<Phone className="mr-1 h-4 w-4" />
												Telefone
											</h3>
											<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
												{emitente.telefone}
											</p>
										</div>
									)}
									{emitente.email && (
										<div>
											<h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
												<Mail className="mr-1 h-4 w-4" />
												E-mail
											</h3>
											<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
												{emitente.email}
											</p>
										</div>
									)}
								</div>

								{emitente.observacoes && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Observações
										</h3>
										<p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
											{emitente.observacoes}
										</p>
									</div>
								)}

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Criado em
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{emitente.created_at}
										</p>
									</div>
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Última atualização
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
											{emitente.updated_at}
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
									Requisições ({stats.total_requisicoes})
								</CardTitle>
								<CardDescription>
									Últimas requisições emitidas por este órgão
								</CardDescription>
							</CardHeader>
							<CardContent>
								{requisicoes && requisicoes.length > 0 ? (
									<div className="space-y-4">
										<div className="rounded-md border">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Número</TableHead>
														<TableHead>Solicitante</TableHead>
														<TableHead>Data</TableHead>
														<TableHead>Status</TableHead>
														<TableHead>Valor</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{requisicoes.slice(0, 10).map((requisicao) => {
														const statusConfig = getStatusBadge(
															requisicao.status,
														);
														return (
															<TableRow key={requisicao.id}>
																<TableCell>
																	<div className="font-medium text-blue-600">
																		{requisicao.numero_completo}
																	</div>
																</TableCell>
																<TableCell>{requisicao.solicitante}</TableCell>
																<TableCell>
																	{requisicao.data_recebimento}
																</TableCell>
																<TableCell>
																	<Badge
																		variant={statusConfig.variant}
																		className={
																			requisicao.status_color
																				? `bg-${requisicao.status_color}-100 text-${requisicao.status_color}-800 border-${requisicao.status_color}-200`
																				: ""
																		}
																	>
																		{requisicao.status_display}
																	</Badge>
																</TableCell>
																<TableCell>
																	{requisicao.valor_final
																		? new Intl.NumberFormat("pt-BR", {
																				style: "currency",
																				currency: "BRL",
																			}).format(Number(requisicao.valor_final))
																		: "-"}
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</div>
										{stats.total_requisicoes > 10 && (
											<div className="text-center">
												<Link href={`/requisicoes?emitente_id=${emitente.id}`}>
													<Button variant="outline" size="sm">
														Ver todas as requisições ({stats.total_requisicoes})
													</Button>
												</Link>
											</div>
										)}
									</div>
								) : (
									<div className="py-8 text-center">
										<FileText className="mx-auto h-12 w-12 text-gray-400" />
										<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
											Nenhuma requisição
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Este emitente ainda não possui requisições registradas.
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
										{stats.total_requisicoes}
									</div>
									<div className="text-sm text-gray-500">
										Requisições totais
									</div>
								</div>

								<div className="border-t pt-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">
											{stats.requisicoes_concretizadas}
										</div>
										<div className="text-sm text-gray-500">Concretizadas</div>
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
											}).format(stats.valor_total)}
										</div>
										<div className="text-sm text-gray-500">Valor total</div>
									</div>
								</div>

								<div className="border-t pt-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-amber-600">
											{stats.requisicoes_mes_atual}
										</div>
										<div className="text-sm text-gray-500">Este mês</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Ações</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<Link href={emitentes.edit(emitente.id)} className="block">
									<Button variant="outline" className="w-full justify-start">
										<Edit className="mr-2 h-4 w-4" />
										Editar emitente
									</Button>
								</Link>
								<Link
									href={`/requisicoes?emitente_id=${emitente.id}`}
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
									Excluir emitente
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
