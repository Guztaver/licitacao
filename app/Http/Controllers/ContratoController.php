<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\ContratoItem;
use App\Models\Fornecedor;
use App\Models\Item;
use App\Models\ProcessoLicitatorio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        // Transform data for frontend
        $contratos->getCollection()->transform(function ($contrato) {
            return [
                "id" => $contrato->id,
                "numero_contrato" => $contrato->numero_contrato,
                "fornecedor" => $contrato->fornecedor
                    ? [
                        "id" => $contrato->fornecedor->id,
                        "razao_social" => $contrato->fornecedor->razao_social,
                    ]
                    : null,
                "data_inicio" => $contrato->data_inicio->format("d/m/Y"),
                "data_fim" => $contrato->data_fim->format("d/m/Y"),
                "limite_requisicoes" => $contrato->limite_requisicoes,
                "limite_conferencias" => $contrato->limite_conferencias,
                "status" => $contrato->status,
                "status_display" => $contrato->status_display,
                "status_color" => $contrato->status_color,
                "descricao" => $contrato->descricao,
            ];
        });

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

        $processos = ProcessoLicitatorio::query()
            ->whereIn("status", ["homologado", "adjudicado"])
            ->orderBy("numero_processo")
            ->get(["id", "numero_processo", "objeto"]);

        $items = Item::query()
            ->orderBy("descricao")
            ->get(["id", "codigo", "descricao", "unidade_medida"]);

        $users = \App\Models\User::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render("Contratos/Create", [
            "fornecedores" => $fornecedores,
            "processos" => $processos,
            "items" => $items,
            "users" => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "fornecedor_id" => "nullable|exists:fornecedores,id",
            "processo_licitatorio_id" =>
                "nullable|exists:processos_licitatorios,id",
            "numero_contrato" =>
                "required|string|max:100|unique:contratos,numero_contrato",
            "data_inicio" => "required|date",
            "data_fim" => "required|date|after:data_inicio",
            "limite_requisicoes" => "nullable|integer|min:0",
            "limite_conferencias" => "nullable|integer|min:0",
            "limite_valor_mensal" => "nullable|numeric|min:0",
            "descricao" => "nullable|string|max:1000",
            "status" => "required|in:ativo,inativo",
            "fiscal_id" => "nullable|exists:users,id",
            "data_designacao_fiscal" => "nullable|date",
            "observacoes_fiscal" => "nullable|string|max:1000",
            "items" => "nullable|array",
            "items.*.item_id" => "required|exists:items,id",
            "items.*.quantidade" => "required|integer|min:1",
            "items.*.valor_unitario" => "required|numeric|min:0",
            "items.*.marca" => "nullable|string|max:255",
            "items.*.especificacao" => "nullable|string",
            "items.*.observacoes" => "nullable|string",
        ]);

        // Convert "0" to null for fornecedor_id (general contract)
        if (
            isset($validated["fornecedor_id"]) &&
            $validated["fornecedor_id"] === "0"
        ) {
            $validated["fornecedor_id"] = null;
        }

        $validated["usuario_criacao_id"] = Auth::id();

        DB::beginTransaction();
        try {
            $contrato = Contrato::create($validated);

            // Create contract items
            if (isset($validated["items"]) && is_array($validated["items"])) {
                foreach ($validated["items"] as $itemData) {
                    ContratoItem::create([
                        "contrato_id" => $contrato->id,
                        "item_id" => $itemData["item_id"],
                        "quantidade" => $itemData["quantidade"],
                        "valor_unitario" => $itemData["valor_unitario"],
                        "marca" => $itemData["marca"] ?? null,
                        "especificacao" => $itemData["especificacao"] ?? null,
                        "observacoes" => $itemData["observacoes"] ?? null,
                    ]);
                }

                // Update total contract value
                $contrato->recalcularValorTotal();
            }

            DB::commit();

            return redirect()
                ->route("contratos.show", $contrato)
                ->with("success", "Contrato criado com sucesso!");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withInput()
                ->with("error", "Erro ao criar contrato: " . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contrato $contrato): Response
    {
        $contrato->load([
            "fornecedor",
            "usuarioCriacao",
            "fiscal",
            "processoLicitatorio",
            "items.item",
        ]);

        // Get counts and remaining
        $countRequisicoes = $contrato->getCountRequisicoes();
        $countConferencias = $contrato->getCountConferencias();
        $requisicoesRestantes = $contrato->getRequisicoesRestantes();
        $conferenciasRestantes = $contrato->getConferenciasRestantes();

        // Get monthly values summary
        $valoresMensais = $contrato->getValoresMensaisSummary();

        // Get historico de limites (timeline)
        $historicoLimites = $contrato
            ->historicoLimites()
            ->with("usuario")
            ->orderBy("created_at", "desc")
            ->get()
            ->map(function ($historico) {
                return [
                    "id" => $historico->id,
                    "tipo_alteracao" => $historico->tipo_alteracao,
                    "tipo_display" => $historico->tipo_display,
                    "campo_alterado" => $historico->campo_alterado,
                    "campo_display" => $historico->campo_display,
                    "valor_anterior" => $historico->valor_anterior,
                    "valor_novo" => $historico->valor_novo,
                    "diferenca" => $historico->diferenca,
                    "mensagem" => $historico->mensagem,
                    "descricao" => $historico->descricao,
                    "icon_color" => $historico->icon_color,
                    "badge_color" => $historico->badge_color,
                    "usuario" => $historico->usuario
                        ? [
                            "id" => $historico->usuario->id,
                            "name" => $historico->usuario->name,
                        ]
                        : null,
                    "created_at" => $historico->created_at->format("d/m/Y H:i"),
                    "created_at_diff" => $historico->created_at->diffForHumans(),
                ];
            });

        // Get current month stats
        $mesAtual = now()->month;
        $anoAtual = now()->year;
        $valorUsadoMesAtual = $contrato->getValorUsadoNoMes(
            $anoAtual,
            $mesAtual,
        );
        $valorRestanteMesAtual = $contrato->getValorRestanteNoMes(
            $anoAtual,
            $mesAtual,
        );

        // Get related items
        $requisicoes = $contrato->getRequisicoes()->take(10);
        $conferencias = $contrato->getConferencias()->take(10);

        return Inertia::render("Contratos/Show", [
            "contrato" => [
                "id" => $contrato->id,
                "numero_contrato" => $contrato->numero_contrato,
                "fornecedor" => $contrato->fornecedor
                    ? [
                        "id" => $contrato->fornecedor->id,
                        "razao_social" => $contrato->fornecedor->razao_social,
                        "cnpj_formatado" =>
                            $contrato->fornecedor->cnpj_formatado,
                    ]
                    : null,
                "processo_licitatorio" => $contrato->processoLicitatorio
                    ? [
                        "id" => $contrato->processoLicitatorio->id,
                        "numero_processo" =>
                            $contrato->processoLicitatorio->numero_processo,
                        "objeto" => $contrato->processoLicitatorio->objeto,
                        "modalidade_display" =>
                            $contrato->processoLicitatorio->modalidade_display,
                    ]
                    : null,
                "data_inicio" => $contrato->data_inicio->format("d/m/Y"),
                "data_fim" => $contrato->data_fim->format("d/m/Y"),
                "limite_requisicoes" => $contrato->limite_requisicoes,
                "limite_conferencias" => $contrato->limite_conferencias,
                "limite_valor_mensal" => $contrato->limite_valor_mensal,
                "valor_total" => $contrato->valor_total,
                "status" => $contrato->status,
                "status_display" => $contrato->status_display,
                "status_color" => $contrato->status_color,
                "descricao" => $contrato->descricao,
                "fiscal" => $contrato->fiscal
                    ? [
                        "id" => $contrato->fiscal->id,
                        "name" => $contrato->fiscal->name,
                    ]
                    : null,
                "data_designacao_fiscal" => $contrato->data_designacao_fiscal?->format("d/m/Y"),
                "observacoes_fiscal" => $contrato->observacoes_fiscal,
                "created_at" => $contrato->created_at->format("d/m/Y H:i"),
                "items" => $contrato->items->map(function ($item) {
                    return [
                        "id" => $item->id,
                        "item" => [
                            "id" => $item->item->id,
                            "codigo" => $item->item->codigo,
                            "descricao" => $item->item->descricao,
                        ],
                        "quantidade" => $item->quantidade,
                        "valor_unitario" => $item->valor_unitario,
                        "valor_total" => $item->valor_total,
                        "marca" => $item->marca,
                        "unidade_medida" =>
                            $item->unidade_medida ??
                            $item->item->unidade_medida,
                        "especificacao" => $item->especificacao,
                        "observacoes" => $item->observacoes,
                    ];
                }),
                "total_itens" => $contrato->total_itens,
            ],
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
                "valores" => [
                    "limite_mensal" => $contrato->limite_valor_mensal,
                    "usado_mes_atual" => $valorUsadoMesAtual,
                    "restante_mes_atual" => $valorRestanteMesAtual,
                    "mes_atual" => sprintf("%02d/%d", $mesAtual, $anoAtual),
                ],
            ],
            "valores_mensais" => $valoresMensais,
            "requisicoes" => $requisicoes->map(function ($req) {
                return [
                    "id" => $req->id,
                    "numero_completo" => $req->numero_completo,
                    "data_recebimento" => $req->data_recebimento->format(
                        "d/m/Y",
                    ),
                    "valor_final" => $req->valor_final,
                ];
            }),
            "conferencias" => $conferencias->map(function ($conf) {
                return [
                    "id" => $conf->id,
                    "periodo_display" => $conf->periodo_display,
                    "total_geral" => $conf->total_geral,
                ];
            }),
            "historico_limites" => $historicoLimites,
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

        $contrato->load(["items.item", "processoLicitatorio"]);

        $fornecedores = Fornecedor::query()
            ->where("status", true)
            ->orderBy("razao_social")
            ->get(["id", "razao_social"]);

        $processos = ProcessoLicitatorio::query()
            ->whereIn("status", ["homologado", "adjudicado"])
            ->orderBy("numero_processo")
            ->get(["id", "numero_processo", "objeto"]);

        $items = Item::query()
            ->orderBy("descricao")
            ->get(["id", "codigo", "descricao", "unidade_medida"]);

        $users = \App\Models\User::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render("Contratos/Edit", [
            "contrato" => [
                "id" => $contrato->id,
                "fornecedor_id" => $contrato->fornecedor_id,
                "processo_licitatorio_id" => $contrato->processo_licitatorio_id,
                "numero_contrato" => $contrato->numero_contrato,
                "data_inicio" => $contrato->data_inicio->format("Y-m-d"),
                "data_fim" => $contrato->data_fim->format("Y-m-d"),
                "limite_requisicoes" => $contrato->limite_requisicoes,
                "limite_conferencias" => $contrato->limite_conferencias,
                "limite_valor_mensal" => $contrato->limite_valor_mensal,
                "descricao" => $contrato->descricao,
                "status" => $contrato->status,
                "fiscal_id" => $contrato->fiscal_id,
                "data_designacao_fiscal" => $contrato->data_designacao_fiscal?->format("Y-m-d"),
                "observacoes_fiscal" => $contrato->observacoes_fiscal,
                "items" => $contrato->items->map(function ($item) {
                    return [
                        "id" => $item->id,
                        "item_id" => $item->item_id,
                        "quantidade" => $item->quantidade,
                        "valor_unitario" => $item->valor_unitario,
                        "marca" => $item->marca,
                        "especificacao" => $item->especificacao,
                        "observacoes" => $item->observacoes,
                    ];
                }),
            ],
            "fornecedores" => $fornecedores,
            "processos" => $processos,
            "items" => $items,
            "users" => $users,
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
            "processo_licitatorio_id" =>
                "nullable|exists:processos_licitatorios,id",
            "numero_contrato" =>
                "required|string|max:100|unique:contratos,numero_contrato," .
                $contrato->id,
            "data_inicio" => "required|date",
            "data_fim" => "required|date|after:data_inicio",
            "limite_requisicoes" => "nullable|integer|min:0",
            "limite_conferencias" => "nullable|integer|min:0",
            "limite_valor_mensal" => "nullable|numeric|min:0",
            "descricao" => "nullable|string|max:1000",
            "status" => "required|in:ativo,inativo,expirado",
            "fiscal_id" => "nullable|exists:users,id",
            "data_designacao_fiscal" => "nullable|date",
            "observacoes_fiscal" => "nullable|string|max:1000",
            "items" => "nullable|array",
            "items.*.id" => "nullable|exists:contrato_items,id",
            "items.*.item_id" => "required|exists:items,id",
            "items.*.quantidade" => "required|integer|min:1",
            "items.*.valor_unitario" => "required|numeric|min:0",
            "items.*.marca" => "nullable|string|max:255",
            "items.*.especificacao" => "nullable|string",
            "items.*.observacoes" => "nullable|string",
        ]);

        // Convert "0" to null for fornecedor_id (general contract)
        if (
            isset($validated["fornecedor_id"]) &&
            $validated["fornecedor_id"] === "0"
        ) {
            $validated["fornecedor_id"] = null;
        }

        DB::beginTransaction();
        try {
            $contrato->update($validated);

            // Handle items
            if (isset($validated["items"]) && is_array($validated["items"])) {
                // Get existing item IDs
                $existingItemIds = [];

                foreach ($validated["items"] as $itemData) {
                    if (isset($itemData["id"]) && $itemData["id"]) {
                        // Update existing item
                        $contratoItem = ContratoItem::find($itemData["id"]);
                        if (
                            $contratoItem &&
                            $contratoItem->contrato_id === $contrato->id
                        ) {
                            $contratoItem->update([
                                "item_id" => $itemData["item_id"],
                                "quantidade" => $itemData["quantidade"],
                                "valor_unitario" => $itemData["valor_unitario"],
                                "marca" => $itemData["marca"] ?? null,
                                "especificacao" =>
                                    $itemData["especificacao"] ?? null,
                                "observacoes" =>
                                    $itemData["observacoes"] ?? null,
                            ]);
                            $existingItemIds[] = $itemData["id"];
                        }
                    } else {
                        // Create new item
                        $newItem = ContratoItem::create([
                            "contrato_id" => $contrato->id,
                            "item_id" => $itemData["item_id"],
                            "quantidade" => $itemData["quantidade"],
                            "valor_unitario" => $itemData["valor_unitario"],
                            "marca" => $itemData["marca"] ?? null,
                            "especificacao" =>
                                $itemData["especificacao"] ?? null,
                            "observacoes" => $itemData["observacoes"] ?? null,
                        ]);
                        $existingItemIds[] = $newItem->id;
                    }
                }

                // Delete items that were removed
                ContratoItem::where("contrato_id", $contrato->id)
                    ->whereNotIn("id", $existingItemIds)
                    ->delete();

                // Update total contract value
                $contrato->recalcularValorTotal();
            }

            DB::commit();

            return redirect()
                ->route("contratos.show", $contrato)
                ->with("success", "Contrato atualizado com sucesso!");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withInput()
                ->with(
                    "error",
                    "Erro ao atualizar contrato: " . $e->getMessage(),
                );
        }
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

    /**
     * Get timeline of limit changes for a contract (API endpoint for reports).
     */
    public function historicoLimites(Request $request, Contrato $contrato)
    {
        $campoFiltro = $request->input("campo");
        $tipoFiltro = $request->input("tipo");
        $dataInicio = $request->input("data_inicio");
        $dataFim = $request->input("data_fim");

        $query = $contrato
            ->historicoLimites()
            ->with("usuario")
            ->orderBy("created_at", "desc");

        // Apply filters
        if ($campoFiltro) {
            $query->where("campo_alterado", $campoFiltro);
        }

        if ($tipoFiltro) {
            $query->where("tipo_alteracao", $tipoFiltro);
        }

        if ($dataInicio) {
            $query->whereDate("created_at", ">=", $dataInicio);
        }

        if ($dataFim) {
            $query->whereDate("created_at", "<=", $dataFim);
        }

        $historico = $query->get()->map(function ($h) {
            return [
                "id" => $h->id,
                "tipo_alteracao" => $h->tipo_alteracao,
                "tipo_display" => $h->tipo_display,
                "campo_alterado" => $h->campo_alterado,
                "campo_display" => $h->campo_display,
                "valor_anterior" => $h->valor_anterior,
                "valor_novo" => $h->valor_novo,
                "diferenca" => $h->diferenca,
                "mensagem" => $h->mensagem,
                "descricao" => $h->descricao,
                "usuario" => $h->usuario
                    ? [
                        "id" => $h->usuario->id,
                        "name" => $h->usuario->name,
                    ]
                    : null,
                "created_at" => $h->created_at->format("Y-m-d H:i:s"),
                "created_at_formatted" => $h->created_at->format("d/m/Y H:i"),
            ];
        });

        return response()->json([
            "success" => true,
            "contrato" => [
                "id" => $contrato->id,
                "numero_contrato" => $contrato->numero_contrato,
                "fornecedor" => $contrato->fornecedor
                    ? [
                        "id" => $contrato->fornecedor->id,
                        "razao_social" => $contrato->fornecedor->razao_social,
                    ]
                    : null,
            ],
            "historico" => $historico,
            "total" => $historico->count(),
        ]);
    }
}
