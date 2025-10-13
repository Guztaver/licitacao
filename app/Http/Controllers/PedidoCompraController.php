<?php

namespace App\Http\Controllers;

use App\Models\Fornecedor;
use App\Models\Item;
use App\Models\PedidoCompra;
use App\Models\PedidoCompraItem;
use App\Models\Secretaria;
use App\Models\Contrato;
use App\Models\ContratoItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PedidoCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input("search");
        $status = $request->input("status");
        $secretariaId = $request->input("secretaria_id");
        $prioridade = $request->input("prioridade");

        $query = PedidoCompra::query()
            ->with(["secretaria", "fornecedor", "usuarioSolicitante", "usuarioAutorizador"])
            ->orderBy("created_at", "desc");

        // Apply filters
        if ($search) {
            $query->search($search);
        }

        if ($status) {
            $query->status($status);
        }

        if ($secretariaId) {
            $query->secretaria($secretariaId);
        }

        if ($prioridade) {
            $query->where("prioridade", $prioridade);
        }

        // User can only see pedidos from their secretaria (unless they are admin/manager)
        $user = Auth::user();
        if (!$this->isGestorCompras($user)) {
            $query->whereHas('secretaria', function($q) use ($user) {
                // This assumes users have a secretaria_id field or relationship
                // You may need to adjust this based on your user structure
            });
        }

        $pedidos = $query->paginate(15)->withQueryString();

        // Transform data for frontend
        $pedidos->getCollection()->transform(function ($pedido) {
            return [
                "id" => $pedido->id,
                "numero_pedido" => $pedido->numero_pedido,
                "secretaria" => $pedido->secretaria
                    ? [
                        "id" => $pedido->secretaria->id,
                        "nome" => $pedido->secretaria->nome,
                        "sigla" => $pedido->secretaria->sigla,
                    ]
                    : null,
                "fornecedor" => $pedido->fornecedor
                    ? [
                        "id" => $pedido->fornecedor->id,
                        "razao_social" => $pedido->fornecedor->razao_social,
                    ]
                    : null,
                "titulo" => $pedido->titulo,
                "valor_total_estimado" => $pedido->valor_total_estimado,
                "valor_total_estimado_formatado" => $pedido->valor_total_estimado_formatado,
                "data_solicitacao" => $pedido->data_solicitacao_formatada,
                "data_necessidade" => $pedido->data_necessidade?->format('d/m/Y'),
                "status" => $pedido->status,
                "status_display" => $pedido->status_display,
                "status_color" => $pedido->status_color,
                "prioridade" => $pedido->prioridade,
                "prioridade_display" => $pedido->prioridade_display,
                "prioridade_color" => $pedido->prioridade_color,
                "usuario_solicitante" => $pedido->usuarioSolicitante
                    ? [
                        "id" => $pedido->usuarioSolicitante->id,
                        "name" => $pedido->usuarioSolicitante->name,
                    ]
                    : null,
                "usuario_autorizador" => $pedido->usuarioAutorizador
                    ? [
                        "id" => $pedido->usuarioAutorizador->id,
                        "name" => $pedido->usuarioAutorizador->name,
                    ]
                    : null,
                "pode_editar" => $pedido->podeEditar(),
                "pode_aprovar" => $pedido->podeAprovar(),
                "pode_rejeitar" => $pedido->podeRejeitar(),
                "pode_cancelar" => $pedido->podeCancelar(),
                "total_items" => $pedido->items()->count(),
            ];
        });

        // Get filter options
        $secretarias = Secretaria::ativas()->get(["id", "nome", "sigla"]);

        return Inertia::render("PedidosCompras/Index", [
            "pedidos" => $pedidos,
            "secretarias" => $secretarias,
            "filters" => [
                "search" => $search,
                "status" => $status,
                "secretaria_id" => $secretariaId,
                "prioridade" => $prioridade,
            ],
            "is_gestor_compras" => $this->isGestorCompras($user),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $secretarias = Secretaria::ativas()->get(["id", "nome", "sigla"]);
        $fornecedores = Fornecedor::where("status", true)->get(["id", "razao_social"]);
        $contratos = Contrato::where("status", "ativo")->get(["id", "numero_contrato", "fornecedor_id"]);
        $items = Item::orderBy("descricao")->get(["id", "codigo", "descricao", "unidade_medida"]);

        return Inertia::render("PedidosCompras/Create", [
            "secretarias" => $secretarias,
            "fornecedores" => $fornecedores,
            "contratos" => $contratos,
            "items" => $items,
            "numero_pedido" => PedidoCompra::gerarNumeroPedido(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "secretaria_id" => "required|exists:secretarias,id",
            "fornecedor_id" => "nullable|exists:fornecedores,id",
            "contrato_id" => "nullable|exists:contratos,id",
            "titulo" => "required|string|max:200",
            "descricao" => "required|string",
            "justificativa" => "nullable|string",
            "data_necessidade" => "nullable|date|after_or_equal:today",
            "prioridade" => "required|in:baixa,normal,alta,urgente",
            "observacoes" => "nullable|string",
            "items" => "required|array|min:1",
            "items.*.item_id" => "required|exists:items,id",
            "items.*.descricao_material" => "required|string|max:500",
            "items.*.quantidade_solicitada" => "required|numeric|min:0.001",
            "items.*.unidade_medida" => "required|string|max:20",
            "items.*.valor_unitario_estimado" => "required|numeric|min:0.01",
            "items.*.especificacoes" => "nullable|string",
            "items.*.observacoes" => "nullable|string",
        ]);

        $validated["usuario_solicitante_id"] = Auth::id();
        $validated["numero_pedido"] = PedidoCompra::gerarNumeroPedido();
        $validated["data_solicitacao"] = now();
        $validated["status"] = "rascunho";

        DB::beginTransaction();
        try {
            $pedido = PedidoCompra::create($validated);

            // Create pedido items
            $totalValor = 0;
            foreach ($validated["items"] as $itemData) {
                $itemData["pedido_compra_id"] = $pedido->id;
                $itemData["valor_total_estimado"] = $itemData["quantidade_solicitada"] * $itemData["valor_unitario_estimado"];

                PedidoCompraItem::create($itemData);
                $totalValor += $itemData["valor_total_estimado"];
            }

            // Update total value
            $pedido->valor_total_estimado = $totalValor;
            $pedido->save();

            DB::commit();

            return redirect()
                ->route("pedidos-compras.show", $pedido)
                ->with("success", "Pedido de compra criado com sucesso!");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withInput()
                ->with("error", "Erro ao criar pedido de compra: " . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PedidoCompra $pedidoCompra): Response
    {
        $pedidoCompra->load([
            "secretaria",
            "fornecedor",
            "contrato",
            "usuarioSolicitante",
            "usuarioAutorizador",
            "items.item",
            "items.contratoItem",
        ]);

        // Format data for frontend
        $pedido = [
            "id" => $pedidoCompra->id,
            "numero_pedido" => $pedidoCompra->numero_pedido,
            "secretaria" => $pedidoCompra->secretaria
                ? [
                    "id" => $pedidoCompra->secretaria->id,
                    "nome" => $pedidoCompra->secretaria->nome,
                    "sigla" => $pedidoCompra->secretaria->sigla,
                ]
                : null,
            "fornecedor" => $pedidoCompra->fornecedor
                ? [
                    "id" => $pedidoCompra->fornecedor->id,
                    "razao_social" => $pedidoCompra->fornecedor->razao_social,
                    "cnpj_formatado" => $pedidoCompra->fornecedor->cnpj_formatado,
                ]
                : null,
            "contrato" => $pedidoCompra->contrato
                ? [
                    "id" => $pedidoCompra->contrato->id,
                    "numero_contrato" => $pedidoCompra->contrato->numero_contrato,
                ]
                : null,
            "titulo" => $pedidoCompra->titulo,
            "descricao" => $pedidoCompra->descricao,
            "justificativa" => $pedidoCompra->justificativa,
            "valor_total_estimado" => $pedidoCompra->valor_total_estimado,
            "valor_total_estimado_formatado" => $pedidoCompra->valor_total_estimado_formatado,
            "data_solicitacao" => $pedidoCompra->data_solicitacao_formatada,
            "data_necessidade" => $pedidoCompra->data_necessidade?->format('d/m/Y'),
            "status" => $pedidoCompra->status,
            "status_display" => $pedidoCompra->status_display,
            "status_color" => $pedidoCompra->status_color,
            "prioridade" => $pedidoCompra->prioridade,
            "prioridade_display" => $pedidoCompra->prioridade_display,
            "prioridade_color" => $pedidoCompra->prioridade_color,
            "observacoes" => $pedidoCompra->observacoes,
            "motivo_rejeicao" => $pedidoCompra->motivo_rejeicao,
            "data_aprovacao" => $pedidoCompra->data_aprovacao?->format('d/m/Y H:i'),
            "data_rejeicao" => $pedidoCompra->data_rejeicao?->format('d/m/Y H:i'),
            "usuario_solicitante" => $pedidoCompra->usuarioSolicitante,
            "usuario_autorizador" => $pedidoCompra->usuarioAutorizador,
            "pode_editar" => $pedidoCompra->podeEditar(),
            "pode_enviar_aprovacao" => $pedidoCompra->podeEnviarParaAprovacao(),
            "pode_aprovar" => $pedidoCompra->podeAprovar(),
            "pode_rejeitar" => $pedidoCompra->podeRejeitar(),
            "pode_cancelar" => $pedidoCompra->podeCancelar(),
            "items" => $pedidoCompra->items->map(function ($item) {
                return [
                    "id" => $item->id,
                    "item" => $item->item,
                    "contrato_item" => $item->contratoItem,
                    "descricao_material" => $item->descricao_material,
                    "quantidade_solicitada" => $item->quantidade_solicitada,
                    "quantidade_solicitada_formatada" => $item->quantidade_solicitada_formatada,
                    "unidade_medida" => $item->unidade_medida,
                    "valor_unitario_estimado" => $item->valor_unitario_estimado,
                    "valor_unitario_estimado_formatado" => $item->valor_unitario_estimado_formatado,
                    "valor_total_estimado" => $item->valor_total_estimado,
                    "valor_total_estimado_formatado" => $item->valor_total_estimado_formatado,
                    "especificacoes" => $item->especificacoes,
                    "observacoes" => $item->observacoes,
                ];
            }),
        ];

        return Inertia::render("PedidosCompras/Show", [
            "pedido" => $pedido,
            "is_gestor_compras" => $this->isGestorCompras(Auth::user()),
            "can_authorize" => $this->canAuthorizePedido($pedidoCompra, Auth::user()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PedidoCompra $pedidoCompra): Response
    {
        if (!$pedidoCompra->podeEditar()) {
            return redirect()
                ->route("pedidos-compras.show", $pedidoCompra)
                ->with("error", "Este pedido não pode ser editado.");
        }

        $pedidoCompra->load("items");

        $secretarias = Secretaria::ativas()->get(["id", "nome", "sigla"]);
        $fornecedores = Fornecedor::where("status", true)->get(["id", "razao_social"]);
        $contratos = Contrato::where("status", "ativo")->get(["id", "numero_contrato", "fornecedor_id"]);
        $items = Item::orderBy("descricao")->get(["id", "codigo", "descricao", "unidade_medida"]);

        return Inertia::render("PedidosCompras/Edit", [
            "pedido" => [
                "id" => $pedidoCompra->id,
                "secretaria_id" => $pedidoCompra->secretaria_id,
                "fornecedor_id" => $pedidoCompra->fornecedor_id,
                "contrato_id" => $pedidoCompra->contrato_id,
                "titulo" => $pedidoCompra->titulo,
                "descricao" => $pedidoCompra->descricao,
                "justificativa" => $pedidoCompra->justificativa,
                "data_necessidade" => $pedidoCompra->data_necessidade?->format('Y-m-d'),
                "prioridade" => $pedidoCompra->prioridade,
                "observacoes" => $pedidoCompra->observacoes,
                "items" => $pedidoCompra->items->map(function ($item) {
                    return [
                        "id" => $item->id,
                        "item_id" => $item->item_id,
                        "descricao_material" => $item->descricao_material,
                        "quantidade_solicitada" => $item->quantidade_solicitada,
                        "unidade_medida" => $item->unidade_medida,
                        "valor_unitario_estimado" => $item->valor_unitario_estimado,
                        "especificacoes" => $item->especificacoes,
                        "observacoes" => $item->observacoes,
                    ];
                }),
            ],
            "secretarias" => $secretarias,
            "fornecedores" => $fornecedores,
            "contratos" => $contratos,
            "items" => $items,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PedidoCompra $pedidoCompra): RedirectResponse
    {
        if (!$pedidoCompra->podeEditar()) {
            return redirect()
                ->route("pedidos-compras.show", $pedidoCompra)
                ->with("error", "Este pedido não pode ser editado.");
        }

        $validated = $request->validate([
            "secretaria_id" => "required|exists:secretarias,id",
            "fornecedor_id" => "nullable|exists:fornecedores,id",
            "contrato_id" => "nullable|exists:contratos,id",
            "titulo" => "required|string|max:200",
            "descricao" => "required|string",
            "justificativa" => "nullable|string",
            "data_necessidade" => "nullable|date|after_or_equal:today",
            "prioridade" => "required|in:baixa,normal,alta,urgente",
            "observacoes" => "nullable|string",
            "items" => "required|array|min:1",
            "items.*.id" => "nullable|exists:pedido_compra_items,id",
            "items.*.item_id" => "required|exists:items,id",
            "items.*.descricao_material" => "required|string|max:500",
            "items.*.quantidade_solicitada" => "required|numeric|min:0.001",
            "items.*.unidade_medida" => "required|string|max:20",
            "items.*.valor_unitario_estimado" => "required|numeric|min:0.01",
            "items.*.especificacoes" => "nullable|string",
            "items.*.observacoes" => "nullable|string",
        ]);

        DB::beginTransaction();
        try {
            $pedidoCompra->update($validated);

            // Handle items
            $existingItemIds = [];
            $totalValor = 0;

            foreach ($validated["items"] as $itemData) {
                $itemData["valor_total_estimado"] = $itemData["quantidade_solicitada"] * $itemData["valor_unitario_estimado"];

                if (isset($itemData["id"]) && $itemData["id"]) {
                    // Update existing item
                    $item = PedidoCompraItem::find($itemData["id"]);
                    if ($item && $item->pedido_compra_id === $pedidoCompra->id) {
                        $item->update($itemData);
                        $existingItemIds[] = $item->id;
                    }
                } else {
                    // Create new item
                    $itemData["pedido_compra_id"] = $pedidoCompra->id;
                    $newItem = PedidoCompraItem::create($itemData);
                    $existingItemIds[] = $newItem->id;
                }

                $totalValor += $itemData["valor_total_estimado"];
            }

            // Delete items that were removed
            if (!empty($existingItemIds)) {
                PedidoCompraItem::where("pedido_compra_id", $pedidoCompra->id)
                    ->whereNotIn("id", $existingItemIds)
                    ->delete();
            }

            // Update total value
            $pedidoCompra->valor_total_estimado = $totalValor;
            $pedidoCompra->save();

            DB::commit();

            return redirect()
                ->route("pedidos-compras.show", $pedidoCompra)
                ->with("success", "Pedido de compra atualizado com sucesso!");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withInput()
                ->with("error", "Erro ao atualizar pedido de compra: " . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PedidoCompra $pedidoCompra): RedirectResponse
    {
        if (!$pedidoCompra->podeEditar()) {
            return redirect()
                ->route("pedidos-compras.show", $pedidoCompra)
                ->with("error", "Este pedido não pode ser excluído.");
        }

        $pedidoCompra->delete();

        return redirect()
            ->route("pedidos-compras.index")
            ->with("success", "Pedido de compra excluído com sucesso!");
    }

    /**
     * Submit pedido for approval.
     */
    public function enviarParaAprovacao(PedidoCompra $pedidoCompra): RedirectResponse
    {
        if (!$pedidoCompra->podeEnviarParaAprovacao()) {
            return redirect()
                ->back()
                ->with("error", "Este pedido não pode ser enviado para aprovação.");
        }

        $pedidoCompra->enviarParaAprovacao();

        return redirect()
            ->route("pedidos-compras.show", $pedidoCompra)
            ->with("success", "Pedido enviado para aprovação com sucesso!");
    }

    /**
     * Approve pedido.
     */
    public function aprovar(Request $request, PedidoCompra $pedidoCompra): RedirectResponse
    {
        if (!$this->canAuthorizePedido($pedidoCompra, Auth::user())) {
            return redirect()
                ->back()
                ->with("error", "Você não tem permissão para aprovar este pedido.");
        }

        $pedidoCompra->aprovar(Auth::id());

        return redirect()
            ->route("pedidos-compras.show", $pedidoCompra)
            ->with("success", "Pedido aprovado com sucesso!");
    }

    /**
     * Reject pedido.
     */
    public function rejeitar(Request $request, PedidoCompra $pedidoCompra): RedirectResponse
    {
        $validated = $request->validate([
            "motivo" => "required|string|max:1000",
        ]);

        if (!$this->canAuthorizePedido($pedidoCompra, Auth::user())) {
            return redirect()
                ->back()
                ->with("error", "Você não tem permissão para rejeitar este pedido.");
        }

        $pedidoCompra->rejeitar(Auth::id(), $validated["motivo"]);

        return redirect()
            ->route("pedidos-compras.show", $pedidoCompra)
            ->with("success", "Pedido rejeitado com sucesso!");
    }

    /**
     * Cancel pedido.
     */
    public function cancelar(Request $request, PedidoCompra $pedidoCompra): RedirectResponse
    {
        $validated = $request->validate([
            "motivo" => "required|string|max:1000",
        ]);

        $pedidoCompra->cancelar($validated["motivo"]);

        return redirect()
            ->route("pedidos-compras.show", $pedidoCompra)
            ->with("success", "Pedido cancelado com sucesso!");
    }

    /**
     * Get pedidos pending approval (for dashboard/managers).
     */
    public function pendentesAprovacao(): Response
    {
        $pedidos = PedidoCompra::with(["secretaria", "usuarioSolicitante"])
            ->pendentesAprovacao()
            ->orderBy("created_at", "desc")
            ->get();

        return Inertia::render("PedidosCompras/PendentesAprovacao", [
            "pedidos" => $pedidos->map(function ($pedido) {
                return [
                    "id" => $pedido->id,
                    "numero_pedido" => $pedido->numero_pedido,
                    "secretaria" => $pedido->secretaria,
                    "titulo" => $pedido->titulo,
                    "valor_total_estimado" => $pedido->valor_total_estimado,
                    "valor_total_estimado_formatado" => $pedido->valor_total_estimado_formatado,
                    "data_solicitacao" => $pedido->data_solicitacao_formatada,
                    "prioridade" => $pedido->prioridade,
                    "prioridade_display" => $pedido->prioridade_display,
                    "prioridade_color" => $pedido->prioridade_color,
                    "usuario_solicitante" => $pedido->usuarioSolicitante,
                    "total_items" => $pedido->items()->count(),
                ];
            }),
        ]);
    }

    /**
     * Check if user is a purchasing manager.
     */
    private function isGestorCompras($user): bool
    {
        // This is a placeholder - implement your actual logic
        // You might check user roles, permissions, or a specific field
        return $user->email === 'gestor.compras@example.com' ||
               $user->hasRole('gestor_compras') ||
               str_contains($user->email, 'compras');
    }

    /**
     * Check if user can authorize the specific pedido.
     */
    private function canAuthorizePedido(PedidoCompra $pedido, $user): bool
    {
        // Only purchasing managers can authorize
        return $this->isGestorCompras($user) && $pedido->podeAprovar();
    }
}
