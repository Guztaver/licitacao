import { Head, Link, router, useForm } from "@inertiajs/react";
import {
	ArrowLeft,
	Building2,
	Calendar,
	CheckCircle,
	DollarSign,
	Edit3,
	FileText,
	Plus,
	Save,
	Trash2,
} from "lucide-react";
import { type FormEventHandler, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Conferências",
		href: "/conferencias",
	},
	{
		title: "Detalhes da Conferência",
		href: "#",
	},
];

interface Requisicao {
	id: number;
	numero_completo: string;
	solicitante: string;
	valor_final: number;
	numero_pedido_real?: string;
	data_concretizacao: string;
	emitente?: {
		nome: string;
		sigla: string;
	};
	destinatario?: {
		nome: string;
	};
}

interface PedidoManual {
	id: number;
	descricao: string;
	valor: number;
	numero_pedido?: string;
	data_pedido: string;
}

interface Fornecedor {
	id: number;
	razao_social: string;
	cnpj_formatado?: string;
	telefone_formatado?: string;
	email?: string;
	endereco_completo?: string;
}

interface Totals {
	requisicoes: number;
	pedidos_manuais: number;
	geral: number;
}

interface ConferenciaFornecedorProps {
	fornecedor: Fornecedor;
	periodo: string;
	periodo_display: string;
	requisicoes: Requisicao[];
	pedidos_manuais: PedidoManual[];
	totals: Totals;
}

interface PedidoManualForm {
	descricao: string;
	valor: string;
	numero_pedido: string;
	data_pedido: string;
	observacoes: string;
}

interface RequisicaoEditForm {
	valor_final: string;
}

export default function ConferenciaFornecedor({
	fornecedor,
	periodo,
	periodo_display,
	requisicoes,
	pedidos_manuais,
	totals,
}: ConferenciaFornecedorProps) {
	const [showAddPedidoForm, setShowAddPedidoForm] = useState(false);
	const [editingRequisicao, setEditingRequisicao] = useState<number | null>(
		null,
	);
	const [_editingPedido, _setEditingPedido] = useState<number | null>(null);

	const {
		data: pedidoData,
		setData: setPedidoData,
		post: postPedido,
		processing: processingPedido,
		errors: pedidoErrors,
		reset: resetPedido,
	} = useForm<PedidoManualForm>({
		descricao: "",
		valor: "",
		numero_pedido: "",
		data_pedido: "",
		observacoes: "",
	});

	const {
		data: requisicaoData,
		setData: setRequisicaoData,
		patch: patchRequisicao,
		processing: processingRequisicao,
		errors: _requisicaoErrors,
	} = useForm<RequisicaoEditForm>({
		valor_final: "",
	});

	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const handleAddPedidoManual: FormEventHandler = (e) => {
		e.preventDefault();
		postPedido(
			`/conferencias/fornecedor/${fornecedor.id}/${periodo}/pedidos-manuais`,
			{
				onSuccess: () => {
					resetPedido();
					setShowAddPedidoForm(false);
				},
			},
		);
	};

	const handleEditRequisicao = (requisicaoId: number, valorAtual: number) => {
		setEditingRequisicao(requisicaoId);
		setRequisicaoData("valor_final", valorAtual.toString());
	};

	const handleSaveRequisicao = (requisicaoId: number) => {
		patchRequisicao(`/requisicoes/${requisicaoId}`, {
			onSuccess: () => {
				setEditingRequisicao(null);
			},
		});
	};

	const handleDeletePedidoManual = (pedidoId: number) => {
		if (confirm("Tem certeza que deseja excluir este pedido manual?")) {
			router.delete(
				`/conferencias/fornecedor/${fornecedor.id}/${periodo}/pedidos-manuais/${pedidoId}`,
			);
		}
	};

	const handleFinalizarConferencia = () => {
		if (
			confirm(
				"Tem certeza que deseja finalizar esta conferência? Esta ação não pode ser desfeita.",
			)
		) {
			router.post(
				`/conferencias/fornecedor/${fornecedor.id}/${periodo}/finalizar`,
			);
		}
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head
				title={`Conferência - ${fornecedor.razao_social} - ${periodo_display}`}
			/>

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="outline" size="icon" asChild>
							<Link href="/conferencias">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div>
							<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
								Conferência - {periodo_display}
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								{fornecedor.razao_social}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							onClick={handleFinalizarConferencia}
							className="bg-green-600 hover:bg-green-700"
						>
							<CheckCircle className="mr-2 h-4 w-4" />
							Finalizar Conferência
						</Button>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-4">
					{/* Main Content */}
					<div className="space-y-6 lg:col-span-3">
						{/* Financial Summary */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<DollarSign className="mr-2 h-5 w-5" />
									Resumo Financeiro
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-3">
									<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
										<p className="text-sm font-medium text-blue-600 dark:text-blue-400">
											Total Requisições
										</p>
										<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
											{formatCurrency(totals.requisicoes)}
										</p>
										<p className="text-xs text-blue-600 dark:text-blue-400">
											{requisicoes.length} requisições
										</p>
									</div>
									<div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
										<p className="text-sm font-medium text-green-600 dark:text-green-400">
											Total Pedidos Manuais
										</p>
										<p className="text-2xl font-bold text-green-900 dark:text-green-100">
											{formatCurrency(totals.pedidos_manuais)}
										</p>
										<p className="text-xs text-green-600 dark:text-green-400">
											{pedidos_manuais.length} pedidos
										</p>
									</div>
									<div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
										<p className="text-sm font-medium text-purple-600 dark:text-purple-400">
											Total Geral
										</p>
										<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
											{formatCurrency(totals.geral)}
										</p>
										<p className="text-xs text-purple-600 dark:text-purple-400">
											Valor final da conferência
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
									Requisições do Período
								</CardTitle>
								<CardDescription>
									Lista de requisições concretizadas. Clique em "Editar" para
									ajustar valores se necessário.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{requisicoes.length > 0 ? (
									<div className="overflow-hidden rounded-lg border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Requisição</TableHead>
													<TableHead>Solicitante</TableHead>
													<TableHead>Emitente</TableHead>
													<TableHead>Valor</TableHead>
													<TableHead>Data</TableHead>
													<TableHead>Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{requisicoes.map((requisicao) => (
													<TableRow key={requisicao.id}>
														<TableCell className="font-medium">
															{requisicao.numero_completo}
														</TableCell>
														<TableCell>{requisicao.solicitante}</TableCell>
														<TableCell>
															{requisicao.emitente
																? `${requisicao.emitente.nome} (${requisicao.emitente.sigla})`
																: "-"}
														</TableCell>
														<TableCell>
															{editingRequisicao === requisicao.id ? (
																<div className="flex items-center space-x-2">
																	<Input
																		type="number"
																		step="0.01"
																		value={requisicaoData.valor_final}
																		onChange={(e) =>
																			setRequisicaoData(
																				"valor_final",
																				e.target.value,
																			)
																		}
																		className="w-24"
																	/>
																	<Button
																		size="sm"
																		onClick={() =>
																			handleSaveRequisicao(requisicao.id)
																		}
																		disabled={processingRequisicao}
																	>
																		<Save className="h-3 w-3" />
																	</Button>
																	<Button
																		size="sm"
																		variant="outline"
																		onClick={() => setEditingRequisicao(null)}
																	>
																		Cancelar
																	</Button>
																</div>
															) : (
																formatCurrency(requisicao.valor_final)
															)}
														</TableCell>
														<TableCell>
															{requisicao.data_concretizacao}
														</TableCell>
														<TableCell>
															{editingRequisicao !== requisicao.id && (
																<Button
																	size="sm"
																	variant="outline"
																	onClick={() =>
																		handleEditRequisicao(
																			requisicao.id,
																			requisicao.valor_final,
																		)
																	}
																>
																	<Edit3 className="mr-1 h-3 w-3" />
																	Editar
																</Button>
															)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								) : (
									<div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900">
										<FileText className="mx-auto h-12 w-12 text-gray-400" />
										<h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
											Nenhuma requisição encontrada
										</h3>
										<p className="mt-2 text-gray-600 dark:text-gray-400">
											Não há requisições concretizadas para este fornecedor no
											período selecionado.
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Pedidos Manuais */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center">
										<Plus className="mr-2 h-5 w-5" />
										Pedidos Manuais
									</div>
									<Button
										onClick={() => setShowAddPedidoForm(true)}
										disabled={showAddPedidoForm}
									>
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Pedido
									</Button>
								</CardTitle>
								<CardDescription>
									Pedidos informais (sem requisição) realizados no período. Aqui
									você pode adicionar valores extras.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Add Pedido Form */}
								{showAddPedidoForm && (
									<form
										onSubmit={handleAddPedidoManual}
										className="space-y-4 rounded-lg border p-4"
									>
										<h4 className="font-medium">Novo Pedido Manual</h4>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="descricao">Descrição *</Label>
												<Input
													id="descricao"
													value={pedidoData.descricao}
													onChange={(e) =>
														setPedidoData("descricao", e.target.value)
													}
													placeholder="Descreva o pedido..."
													required
													className={
														pedidoErrors.descricao ? "border-red-500" : ""
													}
												/>
												{pedidoErrors.descricao && (
													<p className="text-sm text-red-500">
														{pedidoErrors.descricao}
													</p>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="valor">Valor (R$) *</Label>
												<Input
													id="valor"
													type="number"
													step="0.01"
													min="0"
													value={pedidoData.valor}
													onChange={(e) =>
														setPedidoData("valor", e.target.value)
													}
													placeholder="0,00"
													required
													className={pedidoErrors.valor ? "border-red-500" : ""}
												/>
												{pedidoErrors.valor && (
													<p className="text-sm text-red-500">
														{pedidoErrors.valor}
													</p>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="numero_pedido">Número do Pedido</Label>
												<Input
													id="numero_pedido"
													value={pedidoData.numero_pedido}
													onChange={(e) =>
														setPedidoData("numero_pedido", e.target.value)
													}
													placeholder="Ex: PED-001"
													className={
														pedidoErrors.numero_pedido ? "border-red-500" : ""
													}
												/>
												{pedidoErrors.numero_pedido && (
													<p className="text-sm text-red-500">
														{pedidoErrors.numero_pedido}
													</p>
												)}
											</div>
											<div className="space-y-2">
												<Label htmlFor="data_pedido">Data do Pedido *</Label>
												<Input
													id="data_pedido"
													type="date"
													value={pedidoData.data_pedido}
													onChange={(e) =>
														setPedidoData("data_pedido", e.target.value)
													}
													required
													className={
														pedidoErrors.data_pedido ? "border-red-500" : ""
													}
												/>
												{pedidoErrors.data_pedido && (
													<p className="text-sm text-red-500">
														{pedidoErrors.data_pedido}
													</p>
												)}
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="observacoes">Justificativa *</Label>
											<Textarea
												id="observacoes"
												value={pedidoData.observacoes}
												onChange={(e) =>
													setPedidoData("observacoes", e.target.value)
												}
												placeholder="Justifique a necessidade deste pedido manual..."
												required
												rows={3}
												className={
													pedidoErrors.observacoes ? "border-red-500" : ""
												}
											/>
											{pedidoErrors.observacoes && (
												<p className="text-sm text-red-500">
													{pedidoErrors.observacoes}
												</p>
											)}
										</div>
										<div className="flex items-center space-x-2">
											<Button type="submit" disabled={processingPedido}>
												<Save className="mr-2 h-4 w-4" />
												{processingPedido ? "Salvando..." : "Salvar Pedido"}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													setShowAddPedidoForm(false);
													resetPedido();
												}}
											>
												Cancelar
											</Button>
										</div>
									</form>
								)}

								{/* Pedidos List */}
								{pedidos_manuais.length > 0 ? (
									<div className="overflow-hidden rounded-lg border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Descrição</TableHead>
													<TableHead>Número</TableHead>
													<TableHead>Data</TableHead>
													<TableHead>Valor</TableHead>
													<TableHead>Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{pedidos_manuais.map((pedido) => (
													<TableRow key={pedido.id}>
														<TableCell className="font-medium">
															{pedido.descricao}
														</TableCell>
														<TableCell>{pedido.numero_pedido || "-"}</TableCell>
														<TableCell>{pedido.data_pedido}</TableCell>
														<TableCell className="font-semibold text-green-600">
															{formatCurrency(pedido.valor)}
														</TableCell>
														<TableCell>
															<Button
																size="sm"
																variant="destructive"
																onClick={() =>
																	handleDeletePedidoManual(pedido.id)
																}
															>
																<Trash2 className="h-3 w-3" />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								) : (
									!showAddPedidoForm && (
										<div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900">
											<Plus className="mx-auto h-12 w-12 text-gray-400" />
											<h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
												Nenhum pedido manual
											</h3>
											<p className="mt-2 text-gray-600 dark:text-gray-400">
												Clique em "Adicionar Pedido" para incluir pedidos
												manuais nesta conferência.
											</p>
										</div>
									)
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Fornecedor Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Building2 className="mr-2 h-5 w-5" />
									Fornecedor
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Razão Social
									</p>
									<p className="font-semibold">{fornecedor.razao_social}</p>
								</div>

								{fornecedor.cnpj_formatado && (
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											CNPJ
										</p>
										<p className="font-mono text-sm">
											{fornecedor.cnpj_formatado}
										</p>
									</div>
								)}

								{fornecedor.telefone_formatado && (
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Telefone
										</p>
										<p className="text-sm">{fornecedor.telefone_formatado}</p>
									</div>
								)}

								{fornecedor.email && (
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Email
										</p>
										<p className="text-sm">{fornecedor.email}</p>
									</div>
								)}

								<Separator />

								<Button variant="outline" size="sm" asChild className="w-full">
									<Link href={`/fornecedores/${fornecedor.id}`}>
										Ver Fornecedor
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Period Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Calendar className="mr-2 h-5 w-5" />
									Período
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Período da Conferência
									</p>
									<p className="text-lg font-semibold">{periodo_display}</p>
								</div>
							</CardContent>
						</Card>

						{/* Instructions */}
						<Card className="bg-blue-50 dark:bg-blue-950/20">
							<CardContent className="pt-6">
								<div className="flex">
									<div className="flex-shrink-0">
										<FileText className="h-5 w-5 text-blue-400" />
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
											Instruções
										</h3>
										<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
											<p>
												• Revise as requisições e ajuste valores se necessário
												<br />• Adicione pedidos manuais com justificativa
												obrigatória
												<br />• Clique em "Finalizar Conferência" quando
												terminar
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
