import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, FileText, Save, Upload } from "lucide-react";
import { useId } from "react";
import * as button from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { requisicoes } from "@/routes";
import type { BreadcrumbItem, Destinatario, Emitente } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Requisições",
		href: requisicoes.index(),
	},
	{
		title: "Nova Requisição",
		href: requisicoes.create(),
	},
];

interface CreateProps {
	emitentes: Emitente[];
	destinatarios: Destinatario[];
	proximo_numero: string;
}

interface FormData {
	numero: string;
	emitente_id: string;
	destinatario_id: string;
	solicitante: string;
	numero_oficio: string;
	data_recebimento: string;
	descricao: string;
	anexo: File | null;
}

export default function RequisicaoCreate({
	emitentes,
	destinatarios,
	proximo_numero,
}: CreateProps) {
	const numeroId = useId();
	const emitenteId = useId();
	const destinatarioId = useId();
	const solicitanteId = useId();
	const numeroOficioId = useId();
	const dataRecebimentoId = useId();
	const descricaoId = useId();
	const anexoId = useId();

	const { data, setData, post, processing, errors, reset } = useForm<FormData>({
		numero: proximo_numero || "",
		emitente_id: "",
		destinatario_id: "",
		solicitante: "",
		numero_oficio: "",
		data_recebimento: new Date().toISOString().split("T")[0], // Today's date
		descricao: "",
		anexo: null,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(requisicoes.index());
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setData("anexo", file);
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Nova Requisição" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center space-x-4">
					<button.Button variant="outline" size="icon" asChild>
						<Link href={requisicoes.index()}>
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</button.Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
							Nova Requisição
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Cadastre uma nova requisição no sistema
						</p>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<FileText className="mr-2 h-5 w-5" />
								Informações da Requisição
							</CardTitle>
							<CardDescription>
								Preencha as informações da requisição. Campos marcados com * são
								obrigatórios.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Número da Requisição */}
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={numeroId}>Número da Requisição *</Label>
									<Input
										id={numeroId}
										type="text"
										value={data.numero}
										onChange={(e) => setData("numero", e.target.value)}
										placeholder="Ex: 001/2024"
										required
										className={errors.numero ? "border-red-500" : ""}
									/>
									{errors.numero && (
										<p className="text-sm text-red-500">{errors.numero}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor={dataRecebimentoId}>
										Data de Recebimento *
									</Label>
									<Input
										id={dataRecebimentoId}
										type="date"
										value={data.data_recebimento}
										onChange={(e) =>
											setData("data_recebimento", e.target.value)
										}
										required
										className={errors.data_recebimento ? "border-red-500" : ""}
									/>
									{errors.data_recebimento && (
										<p className="text-sm text-red-500">
											{errors.data_recebimento}
										</p>
									)}
								</div>
							</div>

							{/* Emitente e Destinatário */}
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={emitenteId}>Emitente *</Label>
									<Select
										value={data.emitente_id}
										onValueChange={(value) => setData("emitente_id", value)}
										required
									>
										<SelectTrigger
											className={errors.emitente_id ? "border-red-500" : ""}
										>
											<SelectValue placeholder="Selecione um emitente" />
										</SelectTrigger>
										<SelectContent>
											{emitentes && emitentes.length > 0 ? (
												emitentes.map((emitente) => (
													<SelectItem
														key={emitente.id}
														value={emitente.id.toString()}
													>
														{emitente.sigla} - {emitente.nome}
													</SelectItem>
												))
											) : (
												<SelectItem value="no-emitente" disabled>
													Nenhum emitente disponível
												</SelectItem>
											)}
										</SelectContent>
									</Select>
									{errors.emitente_id && (
										<p className="text-sm text-red-500">{errors.emitente_id}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor={destinatarioId}>Destinatário *</Label>
									<Select
										value={data.destinatario_id}
										onValueChange={(value) => setData("destinatario_id", value)}
										required
									>
										<SelectTrigger
											className={errors.destinatario_id ? "border-red-500" : ""}
										>
											<SelectValue placeholder="Selecione um destinatário" />
										</SelectTrigger>
										<SelectContent>
											{destinatarios && destinatarios.length > 0 ? (
												destinatarios.map((destinatario) => (
													<SelectItem
														key={destinatario.id}
														value={destinatario.id.toString()}
													>
														{destinatario.sigla} - {destinatario.nome}
													</SelectItem>
												))
											) : (
												<SelectItem value="no-destinatario" disabled>
													Nenhum destinatário disponível
												</SelectItem>
											)}
										</SelectContent>
									</Select>
									{errors.destinatario_id && (
										<p className="text-sm text-red-500">
											{errors.destinatario_id}
										</p>
									)}
								</div>
							</div>

							{/* Solicitante e Número do Ofício */}
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={solicitanteId}>Solicitante *</Label>
									<Input
										id={solicitanteId}
										type="text"
										value={data.solicitante}
										onChange={(e) => setData("solicitante", e.target.value)}
										placeholder="Nome do solicitante"
										required
										className={errors.solicitante ? "border-red-500" : ""}
									/>
									{errors.solicitante && (
										<p className="text-sm text-red-500">{errors.solicitante}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor={numeroOficioId}>Número do Ofício</Label>
									<Input
										id={numeroOficioId}
										type="text"
										value={data.numero_oficio}
										onChange={(e) => setData("numero_oficio", e.target.value)}
										placeholder="Ex: OF-001/2024"
										className={errors.numero_oficio ? "border-red-500" : ""}
									/>
									{errors.numero_oficio && (
										<p className="text-sm text-red-500">
											{errors.numero_oficio}
										</p>
									)}
								</div>
							</div>

							<Separator />

							{/* Descrição */}
							<div className="space-y-2">
								<Label htmlFor={descricaoId}>Descrição *</Label>
								<Textarea
									id={descricaoId}
									value={data.descricao}
									onChange={(e) => setData("descricao", e.target.value)}
									placeholder="Descreva detalhadamente o que está sendo solicitado..."
									rows={4}
									required
									className={errors.descricao ? "border-red-500" : ""}
								/>
								{errors.descricao && (
									<p className="text-sm text-red-500">{errors.descricao}</p>
								)}
							</div>

							{/* Anexo */}
							<div className="space-y-2">
								<Label htmlFor={anexoId}>Anexo</Label>
								<div className="flex items-center space-x-2">
									<Input
										id={anexoId}
										type="file"
										onChange={handleFileChange}
										accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
										className={errors.anexo ? "border-red-500" : ""}
									/>
									<Upload className="h-4 w-4 text-gray-400" />
								</div>
								<p className="text-xs text-gray-500">
									Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamanho
									máximo: 10MB
								</p>
								{data.anexo && (
									<p className="text-sm text-green-600">
										Arquivo selecionado: {data.anexo.name}
									</p>
								)}
								{errors.anexo && (
									<p className="text-sm text-red-500">{errors.anexo}</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4">
						<button.Button
							type="button"
							variant="outline"
							onClick={() => reset()}
							disabled={processing}
						>
							Limpar
						</button.Button>
						<button.Button type="button" variant="outline" asChild>
							<Link href={requisicoes.index()}>Cancelar</Link>
						</button.Button>
						<button.Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar Requisição"}
						</button.Button>
					</div>
				</form>
			</div>
		</AppLayout>
	);
}
