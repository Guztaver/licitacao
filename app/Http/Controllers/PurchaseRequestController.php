<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use App\Models\ContractDraft;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PurchaseRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = PurchaseRequest::with(["user", "secretaria"]);

        // Filter based on user role
        if (!$user || $user->type === "operacional") {
            // Regular users can only see their own requests
            $query->where("user_id", $user?->id);
        }

        $requests = $query->latest()->paginate(15);

        return response()->json([
            "success" => true,
            "data" => $requests,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([
            "success" => true,
            "message" => "Form to create purchase request",
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "description" => "required|string",
            "secretaria_id" => "required|exists:secretarias,id",
            "estimated_total" => "nullable|numeric|min:0",
            "observations" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        $purchaseRequest = PurchaseRequest::create([
            "title" => $request->title,
            "description" => $request->description,
            "secretaria_id" => $request->secretaria_id,
            "user_id" => Auth::id(),
            "estimated_total" => $request->estimated_total,
            "observations" => $request->observations,
            "status" => PurchaseRequest::STATUS_DRAFT,
        ]);

        return response()->json(
            [
                "success" => true,
                "data" => $purchaseRequest->load(["user", "secretaria"]),
                "message" => "Pedido de compra criado com sucesso",
            ],
            201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        $user = Auth::user();

        // Check permissions
        if (
            !$user ||
            ($user->type === "operacional" &&
                $purchaseRequest->user_id !== $user->id)
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Não autorizado",
                ],
                403,
            );
        }

        return response()->json([
            "success" => true,
            "data" => $purchaseRequest->load(["user", "secretaria"]),
        ]);
    }

    /**
     * Update purchase request status
     */
    public function updateStatus(
        Request $request,
        PurchaseRequest $purchaseRequest,
    ): JsonResponse {
        $validator = Validator::make($request->all(), [
            "newStatus" =>
                "required|string|in:price_research,bidding,awaiting_supply_authorization,approved,rejected",
            "comment" => "nullable|string|max:500",
            "rejectionReason" =>
                "required_if:newStatus,rejected|string|max:500",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        $user = Auth::user();
        $newStatus = $request->input("newStatus");
        $comment = $request->input("comment");
        $rejectionReason = $request->input("rejectionReason");

        // Validate status transition
        if (!$purchaseRequest->isValidTransition($newStatus)) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        'Transição de status inválida. Não é possível alterar de "' .
                        $purchaseRequest->getStatusDisplayText() .
                        '" para "' .
                        $this->getStatusDisplayText($newStatus) .
                        '"',
                ],
                400,
            );
        }

        // Check user permissions
        if (
            !PurchaseRequest::canUserPerformTransition(
                $purchaseRequest->status,
                $newStatus,
                $user->type,
            )
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Você não tem permissão para realizar esta alteração de status",
                ],
                403,
            );
        }

        // Add status change to history
        $purchaseRequest->addStatusHistory($newStatus, $user->id, $comment);

        // Update the request
        $purchaseRequest->status = $newStatus;

        if (
            $newStatus === PurchaseRequest::STATUS_REJECTED &&
            $rejectionReason
        ) {
            $purchaseRequest->rejection_reason = $rejectionReason;
        }

        $purchaseRequest->save();

        return response()->json([
            "success" => true,
            "data" => $purchaseRequest->load(["user", "secretaria"]),
            "message" => "Status atualizado com sucesso",
            "availableActions" => $purchaseRequest->getAvailableActions(
                $user->type,
            ),
        ]);
    }

    /**
     * Get status display text
     */
    private function getStatusDisplayText(string $status): string
    {
        return match ($status) {
            PurchaseRequest::STATUS_DRAFT => "Rascunho",
            PurchaseRequest::STATUS_PRICE_RESEARCH => "Em Pesquisa de Preço",
            PurchaseRequest::STATUS_BIDDING => "Em Licitação",
            PurchaseRequest::STATUS_AWAITING_SUPPLY_AUTHORIZATION
                => "Aguardando Autorização de Fornecimento",
            PurchaseRequest::STATUS_APPROVED => "Aprovado",
            PurchaseRequest::STATUS_REJECTED => "Rejeitado",
            default => "Status Desconhecido",
        };
    }

    /**
     * Get available status transitions and actions
     */
    public function getAvailableActions(
        PurchaseRequest $purchaseRequest,
    ): JsonResponse {
        $user = Auth::user();

        if (!$user) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Não autorizado",
                ],
                401,
            );
        }

        return response()->json([
            "success" => true,
            "data" => [
                "currentStatus" => $purchaseRequest->status,
                "availableActions" => $purchaseRequest->getAvailableActions(
                    $user->type,
                ),
                "validTransitions" =>
                    PurchaseRequest::getValidTransitions()[
                        $purchaseRequest->status
                    ] ?? [],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        // Only allow editing if status is draft
        if ($purchaseRequest->status !== PurchaseRequest::STATUS_DRAFT) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Apenas pedidos em rascunho podem ser editados",
                ],
                400,
            );
        }

        $user = Auth::user();

        // Check if user can edit this request
        if (
            $purchaseRequest->user_id !== $user->id &&
            $user->type !== "admin"
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Não autorizado",
                ],
                403,
            );
        }

        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "description" => "required|string",
            "secretaria_id" => "required|exists:secretarias,id",
            "estimated_total" => "nullable|numeric|min:0",
            "observations" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        $purchaseRequest->update(
            $request->only([
                "title",
                "description",
                "secretaria_id",
                "estimated_total",
                "observations",
            ]),
        );

        return response()->json([
            "success" => true,
            "data" => $purchaseRequest->load(["user", "secretaria"]),
            "message" => "Pedido de compra atualizado com sucesso",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        // Only allow deletion if status is draft
        if ($purchaseRequest->status !== PurchaseRequest::STATUS_DRAFT) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Apenas pedidos em rascunho podem ser excluídos",
                ],
                400,
            );
        }

        $user = Auth::user();

        // Check if user can delete this request
        if (
            $purchaseRequest->user_id !== $user->id &&
            $user->type !== "admin"
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Não autorizado",
                ],
                403,
            );
        }

        $purchaseRequest->delete();

        return response()->json([
            "success" => true,
            "message" => "Pedido de compra excluído com sucesso",
        ]);
    }

    /**
     * Forward purchase request to contracts department
     */
    public function forwardToContracts(
        Request $request,
        PurchaseRequest $purchaseRequest,
    ): JsonResponse {
        $user = Auth::user();

        // Check permissions - only purchasing managers and above can forward
        if (
            !in_array($user->tipo_acesso, [
                "admin",
                "purchasing_manager",
                "head_of_purchasing",
            ])
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Você não tem permissão para encaminhar pedidos para o setor de contratos",
                ],
                403,
            );
        }

        // Validate that the purchase request is in the correct status
        if (
            $purchaseRequest->status !==
            PurchaseRequest::STATUS_PRICE_RESEARCH_COMPLETED
        ) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        'Apenas pedidos com status "Pesquisa de Preço Concluída" podem ser encaminhados para o setor de contratos',
                ],
                409,
            );
        }

        // Start database transaction
        return DB::transaction(function () use ($purchaseRequest, $user) {
            // Step 1: Create contract draft
            $contractDraft = ContractDraft::create([
                "source_purchase_request_id" => $purchaseRequest->id,
                "requesting_department_id" => $purchaseRequest->secretaria_id,
                "requesting_user_id" => $purchaseRequest->user_id,
                "title" => "Minuta de Contrato - " . $purchaseRequest->title,
                "description" => $purchaseRequest->description,
                "status" => ContractDraft::STATUS_PENDING_ANALYSIS,
                "items" => $purchaseRequest->items
                    ->map(function ($item) {
                        return [
                            "descricao_material" => $item->descricao_material,
                            "quantidade_solicitada" =>
                                $item->quantidade_solicitada,
                            "unidade_medida" => $item->unidade_medida,
                            "valor_unitario_estimado" =>
                                $item->valor_unitario_estimado,
                            "valor_total_estimado" =>
                                $item->valor_total_estimado,
                            "especificacoes" => $item->especificacoes,
                            "observacoes" => $item->observacoes,
                        ];
                    })
                    ->toArray(),
                "estimated_total_value" => $purchaseRequest->estimated_total,
                "research_notes" =>
                    "Encaminhado automaticamente a partir do pedido de compra #" .
                    $purchaseRequest->id,
                "priority_level" => ContractDraft::PRIORITY_MEDIUM,
                "created_by" => $user->id,
            ]);

            // Step 2: Update purchase request status and reference
            $purchaseRequest->update([
                "status" => PurchaseRequest::STATUS_AWAITING_CONTRACT_ANALYSIS,
                "contract_draft_id" => $contractDraft->id,
            ]);

            // Step 3: Add status change to history
            $purchaseRequest->addStatusHistory(
                PurchaseRequest::STATUS_AWAITING_CONTRACT_ANALYSIS,
                $user->id,
                "Encaminhado para o setor de contratos - Minuta criada: {$contractDraft->title}",
            );
            $purchaseRequest->save();

            return response()->json(
                [
                    "success" => true,
                    "data" => [
                        "contractDraft" => $contractDraft->load([
                            "sourcePurchaseRequest",
                            "requestingDepartment",
                            "requestingUser",
                            "creator",
                        ]),
                        "purchaseRequest" => $purchaseRequest->load([
                            "user",
                            "secretaria",
                        ]),
                    ],
                    "message" =>
                        "Pedido encaminhado para o setor de contratos com sucesso! Minuta de contrato #" .
                        $contractDraft->id .
                        " foi criada.",
                ],
                201,
            );
        });
    }
}
