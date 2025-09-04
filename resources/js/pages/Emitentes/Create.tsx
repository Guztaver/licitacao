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
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { emitentes } from "@/routes";
import type { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Building, Save } from "lucide-react";
import type { FormEventHandler } from "react";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Emitentes",
		href: emitentes.index(),
	},
	{
		title: "Novo Emitente",
		href: emitentes.create(),
	},
];

export default function EmitentesCreate() {
	const { data, setData, post, processing, errors } = useForm({
		nome: "",
		sigla: "",
		endereco: "",
		telefone: "",
		email: "",
		observacoes: "",
	});

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		post(emitentes.store());
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Novo Emitente" />

			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Novo Emitente
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Cadastre um novo órgão emitente de requisições
						</p>
					</div>
					<Link href={emitentes.index()}>
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar
						</Button>
					</Link>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Building className="mr-2 h-5 w-5" />
								Informações do Emitente
							</CardTitle>
							<CardDescription>
								Preencha os dados básicos do órgão emitente
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="nome">Nome *</Label>
									<Input
										id="nome"
										type="text"
										value={data.nome}
										onChange={(e) => setData("nome", e.target.value)}
										placeholder="Nome completo do órgão"
										required
										className={errors.nome ? "border-red-500" : ""}
									/>
									{errors.nome && (
										<p className="text-sm text-red-500">{errors.nome}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="sigla">Sigla *</Label>
									<Input
										id="sigla"
										type="text"
										value={data.sigla}
										onChange={(e) =>
											setData("sigla", e.target.value.toUpperCase())
										}
										placeholder="Ex: SECOM, SEMEC, etc."
										required
										className={errors.sigla ? "border-red-500" : ""}
									/>
									{errors.sigla && (
										<p className="text-sm text-red-500">{errors.sigla}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="endereco">Endereço</Label>
								<Input
									id="endereco"
									type="text"
									value={data.endereco}
									onChange={(e) => setData("endereco", e.target.value)}
									placeholder="Endereço completo do órgão"
									className={errors.endereco ? "border-red-500" : ""}
								/>
								{errors.endereco && (
									<p className="text-sm text-red-500">{errors.endereco}</p>
								)}
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="telefone">Telefone</Label>
									<Input
										id="telefone"
										type="tel"
										value={data.telefone}
										onChange={(e) => setData("telefone", e.target.value)}
										placeholder="(XX) XXXXX-XXXX"
										className={errors.telefone ? "border-red-500" : ""}
									/>
									{errors.telefone && (
										<p className="text-sm text-red-500">{errors.telefone}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">E-mail</Label>
									<Input
										id="email"
										type="email"
										value={data.email}
										onChange={(e) => setData("email", e.target.value)}
										placeholder="contato@orgao.gov.br"
										className={errors.email ? "border-red-500" : ""}
									/>
									{errors.email && (
										<p className="text-sm text-red-500">{errors.email}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="observacoes">Observações</Label>
								<Textarea
									id="observacoes"
									value={data.observacoes}
									onChange={(e) => setData("observacoes", e.target.value)}
									placeholder="Informações adicionais sobre o órgão emitente..."
									rows={4}
									className={errors.observacoes ? "border-red-500" : ""}
								/>
								{errors.observacoes && (
									<p className="text-sm text-red-500">{errors.observacoes}</p>
								)}
							</div>
						</CardContent>
					</Card>

					<div className="flex items-center justify-end space-x-4">
						<Link href={emitentes.index()}>
							<Button type="button" variant="outline">
								Cancelar
							</Button>
						</Link>
						<Button type="submit" disabled={processing}>
							<Save className="mr-2 h-4 w-4" />
							{processing ? "Salvando..." : "Salvar Emitente"}
						</Button>
					</div>
				</form>

				<Card className="bg-blue-50 dark:bg-blue-950/20">
					<CardContent className="pt-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<Building className="h-5 w-5 text-blue-400" />
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
									Dica
								</h3>
								<div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
									<p>
										• O nome deve ser completo e oficial do órgão
										<br />• A sigla será usada para identificação rápida nas
										listas
										<br />• Informações de contato são opcionais mas
										recomendadas
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
