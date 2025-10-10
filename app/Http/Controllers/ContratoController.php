<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\Fornecedor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ContratoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input("search");
        $status = $request->input("status");
        $fornecedorId = $request->input("fornecedor_id");

        $query = Contrato::query()
            ->with(["fornecedor", "usuarioCriacao"])
            ->orderBy("created_at", "desc");

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where("numero_contrato", "like", "%{$search}%")
                    ->orWhere("descricao", "like", "%{$search}%")
                    ->orWhereHas("fornecedor", function ($q) use ($search) {
                        $q->where("razao_social", "like", "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where("status", $status);
        }

        if ($fornecedorId) {
            $query->where("fornecedor_id", $fornecedorId);
        }

        // Update expired contracts
        Contrato::query()
            ->where("status", "ativo")
            ->where("data_fim", "<", now()->startOfDay())
            ->update(["status" => "expirado"]);

        $contratos = $query->paginate(15)->withQueryString();

        // Get fornecedores for filter
        $fornecedores = Fornecedor::query()
            ->orderBy("razao_social")
            ->get(["id", "razao_social"]);

        return Inertia::render("Contratos/Index", [
            "contratos" => $contratos,
            "fornecedores" => $fornecedores,
            "filters" => [
                "search" => $search,
                "status" => $status,
                "fornecedor_id" => $fornecedorId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $fornecedores = Fornecedor::query()
            ->where("status", true)
            ->orderBy("razao_social")
            ->get(["id", "razao_social"]);

        return Inertia::render("Contratos/Create", [
            "fornecedores" => $fornecedores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "fornecedor_id" => "nullable|exists:fornecedores,id",
            "numero_contrato" =>
                "required|string|max:100|unique:contratos,numero_contrato",
            "data_inicio" => "required|date",
            "data_fim" => "required|date|after:data_inicio",
            "limite_requisicoes" => "nullable|integer|min:0",
            "limite_conferencias" => "nullable|integer|min:0",
            "descricao" => "nullable|string|max:1000",
            "status" => "required|in:ativo,inativo",
        ]);

        $validated["usuario_criacao_id"] = Auth::id();

        $contrato = Contrato::create($validated);

        return redirect()
            ->route("contratos.show", $contrato)
            ->with("success", "Contrato criado com sucesso!");
    }

    /**
     * Display the specified resource.
     */
    public function show(Contrato $contrato): Response
    {
        $contrato->load(["fornecedor", "usuarioCriacao"]);

        // Get counts and remaining
        $countRequisicoes = $contrato->getCountRequisicoes();
        $countConferencias = $contrato->getCountConferencias();
        $requisicoesRestantes = $contrato->getRequisicoesRestantes();
        $conferenciasRestantes = $contrato->getConferenciasRestantes();

        // Get related items
        $requisicoes = $contrato->getRequisicoes()->take(10);
        $conferencias = $contrato->getConferencias()->take(10);

        return Inertia::render("Contratos/Show", [
            "contrato" => $contrato,
            "stats" => [
                "requisicoes" => [
                    "total" => $countRequisicoes,
                    "limite" => $contrato->limite_requisicoes,
                    "restantes" => $requisicoesRestantes,
                ],
                "conferencias" => [
                    "total" => $countConferencias,
                    "limite" => $contrato->limite_conferencias,
                    "restantes" => $conferenciasRestantes,
                ],
            ],
            "requisicoes" => $requisicoes,
            "conferencias" => $conferencias,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contrato $contrato): Response
    {
        if (!$contrato->podeEditar()) {
            return redirect()
                ->route("contratos.show", $contrato)
                ->with("error", "Este contrato não pode ser editado.");
        }

        $fornecedores = Fornecedor::query()
            ->where("status", true)
            ->orderBy("razao_social")
            ->get(["id", "razao_social"]);

        return Inertia::render("Contratos/Edit", [
            "contrato" => $contrato,
            "fornecedores" => $fornecedores,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Contrato $contrato,
    ): RedirectResponse {
        if (!$contrato->podeEditar()) {
            return redirect()
                ->route("contratos.show", $contrato)
                ->with("error", "Este contrato não pode ser editado.");
        }

        $validated = $request->validate([
            "fornecedor_id" => "nullable|exists:fornecedores,id",
            "numero_contrato" =>
                "required|string|max:100|unique:contratos,numero_contrato," .
                $contrato->id,
            "data_inicio" => "required|date",
            "data_fim" => "required|date|after:data_inicio",
            "limite_requisicoes" => "nullable|integer|min:0",
            "limite_conferencias" => "nullable|integer|min:0",
            "descricao" => "nullable|string|max:1000",
            "status" => "required|in:ativo,inativo,expirado",
        ]);

        $contrato->update($validated);

        return redirect()
            ->route("contratos.show", $contrato)
            ->with("success", "Contrato atualizado com sucesso!");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contrato $contrato): RedirectResponse
    {
        if (!$contrato->podeExcluir()) {
            return redirect()
                ->route("contratos.index")
                ->with(
                    "error",
                    "Este contrato não pode ser excluído pois possui requisições ou conferências vinculadas.",
                );
        }

        $contrato->delete();

        return redirect()
            ->route("contratos.index")
            ->with("success", "Contrato excluído com sucesso!");
    }

    /**
     * Toggle contract status.
     */
    public function toggleStatus(Contrato $contrato): RedirectResponse
    {
        if ($contrato->status === "expirado") {
            return redirect()
                ->back()
                ->with(
                    "error",
                    "Contratos expirados não podem ter o status alterado.",
                );
        }

        $novoStatus = $contrato->status === "ativo" ? "inativo" : "ativo";
        $contrato->update(["status" => $novoStatus]);

        return redirect()
            ->back()
            ->with("success", "Status do contrato alterado com sucesso!");
    }

    /**
     * Get contract information for validation (API endpoint).
     */
    public function checkLimits(Request $request)
    {
        $fornecedorId = $request->input("fornecedor_id");
        $data = $request->input("data", now());

        if (!$fornecedorId) {
            return response()->json([
                "has_contract" => false,
                "message" => "Nenhum fornecedor informado.",
            ]);
        }

        $contrato = Contrato::findContratoVigente($fornecedorId, $data);

        if (!$contrato) {
            return response()->json([
                "has_contract" => false,
                "message" =>
                    "Nenhum contrato vigente encontrado para este fornecedor.",
            ]);
        }

        return response()->json([
            "has_contract" => true,
            "contrato" => [
                "id" => $contrato->id,
                "numero_contrato" => $contrato->numero_contrato,
                "data_inicio" => $contrato->data_inicio->format("d/m/Y"),
                "data_fim" => $contrato->data_fim->format("d/m/Y"),
                "requisicoes" => [
                    "limite" => $contrato->limite_requisicoes,
                    "utilizadas" => $contrato->getCountRequisicoes(),
                    "restantes" => $contrato->getRequisicoesRestantes(),
                    "atingido" => $contrato->limiteRequisioesAtingido(),
                ],
                "conferencias" => [
                    "limite" => $contrato->limite_conferencias,
                    "utilizadas" => $contrato->getCountConferencias(),
                    "restantes" => $contrato->getConferenciasRestantes(),
                    "atingido" => $contrato->limiteConferenciasAtingido(),
                ],
            ],
        ]);
    }
}
