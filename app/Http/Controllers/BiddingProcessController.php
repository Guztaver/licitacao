<?php

namespace App\Http\Controllers;

use App\Models\BiddingProcess;
use App\Models\PurchaseRequest;
use App\Models\PurchaseRequestItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BiddingProcessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $processes = BiddingProcess::with(['user', 'purchaseRequests'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $processes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'observations' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $biddingProcess = BiddingProcess::create([
            'title' => $request->title,
            'status' => BiddingProcess::STATUS_DRAFT,
            'consolidated_items' => [],
            'created_by' => Auth::id(),
            'observations' => $request->observations,
        ]);

        return response()->json([
            'success' => true,
            'data' => $biddingProcess->load(['user', 'purchaseRequests']),
            'message' => 'Processo licitatório criado com sucesso',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BiddingProcess $biddingProcess)
    {
        return response()->json([
            'success' => true,
            'data' => $biddingProcess->load(['user', 'purchaseRequests.user', 'purchaseRequests.secretaria']),
        ]);
    }

    /**
     * Consolidate multiple purchase requests into a bidding process
     */
    public function consolidate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'purchaseRequestIds' => 'required|array|min:1',
            'purchaseRequestIds.*' => 'required|integer|exists:purchase_requests,id',
            'title' => 'required|string|max:255',
            'observations' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $purchaseRequestIds = $request->input('purchaseRequestIds');
        $title = $request->input('title');
        $observations = $request->input('observations');

        // Start database transaction
        return DB::transaction(function () use ($purchaseRequestIds, $title, $observations) {
            // Step 1: Validate all purchase requests exist and are in correct status
            $purchaseRequests = PurchaseRequest::with(['items'])
                ->whereIn('id', $purchaseRequestIds)
                ->get();

            if ($purchaseRequests->count() !== count($purchaseRequestIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Um ou mais pedidos de compra não foram encontrados',
                ], 404);
            }

            // Step 2: Validate that all requests are in the correct status for consolidation
            $invalidRequests = $purchaseRequests->filter(function ($request) {
                return $request->status !== PurchaseRequest::STATUS_PRICE_RESEARCH_COMPLETED;
            });

            if ($invalidRequests->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Apenas pedidos com status "Pesquisa de Preço Concluída" podem ser consolidados',
                    'invalid_requests' => $invalidRequests->pluck('id'),
                ], 400);
            }

            // Step 3: Aggregate items from all requests
            $consolidatedItems = [];
            $allItems = [];

            foreach ($purchaseRequests as $request) {
                foreach ($request->items as $item) {
                    $aggregationKey = $item->getAggregationKey();

                    if (!isset($consolidatedItems[$aggregationKey])) {
                        $consolidatedItems[$aggregationKey] = [
                            'itemDescription' => $item->descricao_material,
                            'unitOfMeasure' => $item->unidade_medida,
                            'totalQuantity' => 0,
                            'sourceRequestIds' => [],
                            'valorUnitarioEstimado' => $item->valor_unitario_estimado,
                            'especificacoes' => $item->especificacoes,
                        ];
                    }

                    $consolidatedItems[$aggregationKey]['totalQuantity'] += $item->quantidade_solicitada;
                    $consolidatedItems[$aggregationKey]['sourceRequestIds'][] = $request->id;

                    // Store original item data for reference
                    $allItems[] = [
                        'purchase_request_id' => $request->id,
                        'purchase_request_title' => $request->title,
                        'original_item' => $item->toArray(),
                    ];
                }
            }

            // Convert to array and remove aggregation keys
            $finalConsolidatedItems = array_values($consolidatedItems);

            // Step 4: Create bidding process
            $biddingProcess = BiddingProcess::create([
                'title' => $title,
                'status' => BiddingProcess::STATUS_DRAFT,
                'consolidated_items' => $finalConsolidatedItems,
                'created_by' => Auth::id(),
                'observations' => $observations,
            ]);

            // Step 5: Update original purchase requests
            foreach ($purchaseRequests as $request) {
                $request->update([
                    'status' => PurchaseRequest::STATUS_IN_BIDDING_PROCESS,
                    'bidding_process_id' => $biddingProcess->id,
                ]);

                // Add status change to history
                $request->addStatusHistory(
                    PurchaseRequest::STATUS_IN_BIDDING_PROCESS,
                    Auth::id(),
                    "Consolidado no processo licitatório: {$title}"
                );
                $request->save();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'biddingProcess' => $biddingProcess->load(['user']),
                    'consolidatedItems' => $finalConsolidatedItems,
                    'sourceRequests' => $purchaseRequests,
                    'summary' => [
                        'totalRequests' => $purchaseRequests->count(),
                        'totalUniqueItems' => count($finalConsolidatedItems),
                        'totalQuantity' => array_sum(array_column($finalConsolidatedItems, 'totalQuantity')),
                    ]
                ],
                'message' => 'Processo licitatório criado com sucesso a partir dos pedidos selecionados',
            ], 201);
        });
    }

    /**
     * Get purchase requests available for consolidation
     */
    public function getAvailableRequests(): JsonResponse
    {
        $user = Auth::user();
        $query = PurchaseRequest::with(['user', 'secretaria', 'items'])
            ->where('status', PurchaseRequest::STATUS_PRICE_RESEARCH_COMPLETED);

        // Filter based on user role
        if (!$user || $user->type === 'operacional') {
            // Regular users can only see their own requests
            $query->where('user_id', $user?->id);
        }

        $requests = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Update bidding process status
     */
    public function updateStatus(Request $request, BiddingProcess $biddingProcess): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'newStatus' => 'required|string|in:opened,closed,cancelled',
            'comment' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $newStatus = $request->input('newStatus');
        $comment = $request->input('comment');

        // Check user permissions (only managers and admins can change status)
        if (!in_array($user->type, ['admin', 'purchasing_manager', 'head_of_purchasing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para alterar o status do processo licitatório',
            ], 403);
        }

        // Validate status transition
        if (!$this->isValidStatusTransition($biddingProcess->status, $newStatus)) {
            return response()->json([
                'success' => false,
                'message' => 'Transição de status inválida',
            ], 400);
        }

        // Update the bidding process
        $biddingProcess->status = $newStatus;
        $biddingProcess->save();

        return response()->json([
            'success' => true,
            'data' => $biddingProcess->load(['user', 'purchaseRequests']),
            'message' => 'Status atualizado com sucesso',
        ]);
    }

    /**
     * Check if status transition is valid
     */
    private function isValidStatusTransition(string $currentStatus, string $newStatus): bool
    {
        $validTransitions = [
            BiddingProcess::STATUS_DRAFT => [BiddingProcess::STATUS_OPENED, BiddingProcess::STATUS_CANCELLED],
            BiddingProcess::STATUS_OPENED => [BiddingProcess::STATUS_CLOSED, BiddingProcess::STATUS_CANCELLED],
            BiddingProcess::STATUS_CLOSED => [],
            BiddingProcess::STATUS_CANCELLED => [],
        ];

        return in_array($newStatus, $validTransitions[$currentStatus] ?? []);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BiddingProcess $biddingProcess)
    {
        // Only allow deletion if status is draft
        if ($biddingProcess->status !== BiddingProcess::STATUS_DRAFT) {
            return response()->json([
                'success' => false,
                'message' => 'Apenas processos em rascunho podem ser excluídos',
            ], 400);
        }

        $user = Auth::user();

        // Check if user can delete this process
        if ($biddingProcess->created_by !== $user->id && $user->type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Não autorizado',
            ], 403);
        }

        // Update related purchase requests
        PurchaseRequest::where('bidding_process_id', $biddingProcess->id)
            ->update([
                'status' => PurchaseRequest::STATUS_PRICE_RESEARCH_COMPLETED,
                'bidding_process_id' => null,
            ]);

        $biddingProcess->delete();

        return response()->json([
            'success' => true,
            'message' => 'Processo licitatório excluído com sucesso',
        ]);
    }
}
