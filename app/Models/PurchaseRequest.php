<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "description",
        "status",
        "secretaria_id",
        "user_id",
        "estimated_total",
        "approved_total",
        "status_history",
        "rejection_reason",
        "observations",
        "bidding_process_id",
        "contract_draft_id",
    ];

    protected $casts = [
        "estimated_total" => "decimal:2",
        "approved_total" => "decimal:2",
        "status_history" => "array",
    ];

    // Status constants
    const STATUS_DRAFT = "draft";
    const STATUS_PRICE_RESEARCH = "price_research";
    const STATUS_PRICE_RESEARCH_COMPLETED = "price_research_completed";
    const STATUS_AWAITING_CONTRACT_ANALYSIS = "awaiting_contract_analysis";
    const STATUS_IN_BIDDING_PROCESS = "in_bidding_process";
    const STATUS_BIDDING = "bidding";
    const STATUS_AWAITING_SUPPLY_AUTHORIZATION = "awaiting_supply_authorization";
    const STATUS_APPROVED = "approved";
    const STATUS_REJECTED = "rejected";

    // Role constants
    const ROLE_ADMIN = "admin";
    const ROLE_PURCHASING_AGENT = "purchasing_agent";
    const ROLE_PURCHASING_MANAGER = "purchasing_manager";
    const ROLE_HEAD_OF_PURCHASING = "head_of_purchasing";
    const ROLE_OPERACIONAL = "operacional";

    /**
     * Get valid status transitions
     */
    public static function getValidTransitions(): array
    {
        return [
            self::STATUS_DRAFT => [
                self::STATUS_PRICE_RESEARCH,
                self::STATUS_REJECTED,
            ],
            self::STATUS_PRICE_RESEARCH => [
                self::STATUS_PRICE_RESEARCH_COMPLETED,
                self::STATUS_REJECTED,
            ],
            self::STATUS_PRICE_RESEARCH_COMPLETED => [
                self::STATUS_AWAITING_CONTRACT_ANALYSIS,
                self::STATUS_IN_BIDDING_PROCESS,
                self::STATUS_REJECTED,
            ],
            self::STATUS_AWAITING_CONTRACT_ANALYSIS => [
                self::STATUS_BIDDING,
                self::STATUS_REJECTED,
            ],
            self::STATUS_IN_BIDDING_PROCESS => [
                self::STATUS_BIDDING,
                self::STATUS_REJECTED,
            ],
            self::STATUS_BIDDING => [
                self::STATUS_AWAITING_SUPPLY_AUTHORIZATION,
                self::STATUS_REJECTED,
            ],
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION => [
                self::STATUS_APPROVED,
                self::STATUS_REJECTED,
            ],
            self::STATUS_APPROVED => [],
            self::STATUS_REJECTED => [],
        ];
    }

    /**
     * Get role permissions for status transitions
     */
    public static function getRolePermissions(): array
    {
        return [
            self::STATUS_DRAFT => [
                self::STATUS_PRICE_RESEARCH => [
                    self::ROLE_PURCHASING_AGENT,
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_PRICE_RESEARCH => [
                self::STATUS_PRICE_RESEARCH_COMPLETED => [
                    self::ROLE_PURCHASING_AGENT,
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_PRICE_RESEARCH_COMPLETED => [
                self::STATUS_AWAITING_CONTRACT_ANALYSIS => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_IN_BIDDING_PROCESS => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_AWAITING_CONTRACT_ANALYSIS => [
                self::STATUS_BIDDING => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_IN_BIDDING_PROCESS => [
                self::STATUS_BIDDING => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_PURCHASING_MANAGER,
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_BIDDING => [
                self::STATUS_AWAITING_SUPPLY_AUTHORIZATION => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION => [
                self::STATUS_APPROVED => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
                self::STATUS_REJECTED => [
                    self::ROLE_HEAD_OF_PURCHASING,
                    self::ROLE_ADMIN,
                ],
            ],
        ];
    }

    /**
     * Check if a status transition is valid
     */
    public function isValidTransition(string $newStatus): bool
    {
        $validTransitions = self::getValidTransitions();
        return in_array($newStatus, $validTransitions[$this->status] ?? []);
    }

    /**
     * Check if a user role can perform a status transition
     */
    public static function canUserPerformTransition(
        string $currentStatus,
        string $newStatus,
        string $userRole,
    ): bool {
        $rolePermissions = self::getRolePermissions();
        return in_array(
            $userRole,
            $rolePermissions[$currentStatus][$newStatus] ?? [],
        );
    }

    /**
     * Add status change to history
     */
    public function addStatusHistory(
        string $newStatus,
        int $userId,
        ?string $comment = null,
    ): void {
        $history = $this->status_history ?? [];
        $history[] = [
            "status" => $newStatus,
            "changed_by" => $userId,
            "changed_at" => now()->toISOString(),
            "comment" => $comment,
        ];
        $this->status_history = $history;
    }

    /**
     * Get status display text in Portuguese
     */
    public function getStatusDisplayText(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => "Rascunho",
            self::STATUS_PRICE_RESEARCH => "Em Pesquisa de Preço",
            self::STATUS_PRICE_RESEARCH_COMPLETED
                => "Pesquisa de Preço Concluída",
            self::STATUS_AWAITING_CONTRACT_ANALYSIS
                => "Aguardando Análise de Contrato",
            self::STATUS_IN_BIDDING_PROCESS => "Em Processo Licitatório",
            self::STATUS_BIDDING => "Em Licitação",
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION
                => "Aguardando Autorização de Fornecimento",
            self::STATUS_APPROVED => "Aprovado",
            self::STATUS_REJECTED => "Rejeitado",
            default => "Status Desconhecido",
        };
    }

    /**
     * Get status badge color
     */
    public function getStatusBadgeColor(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => "secondary",
            self::STATUS_PRICE_RESEARCH => "default",
            self::STATUS_BIDDING => "outline",
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION => "secondary",
            self::STATUS_APPROVED => "default",
            self::STATUS_REJECTED => "destructive",
            default => "secondary",
        };
    }

    /**
     * Get available actions for current user
     */
    public function getAvailableActions(string $userRole): array
    {
        $validTransitions = self::getValidTransitions()[$this->status] ?? [];
        $actions = [];

        foreach ($validTransitions as $newStatus) {
            if (
                self::canUserPerformTransition(
                    $this->status,
                    $newStatus,
                    $userRole,
                )
            ) {
                $actions[] = [
                    "status" => $newStatus,
                    "label" => $this->getActionLabel($newStatus),
                    "description" => $this->getActionDescription($newStatus),
                ];
            }
        }

        return $actions;
    }

    /**
     * Get action label for status
     */
    private function getActionLabel(string $status): string
    {
        return match ($status) {
            self::STATUS_PRICE_RESEARCH => "Encaminhar para Pesquisa de Preço",
            self::STATUS_BIDDING => "Encaminhar para Licitação",
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION
                => "Encaminhar para Autorização",
            self::STATUS_APPROVED => "Aprovar",
            self::STATUS_REJECTED => "Rejeitar",
            default => "Atualizar Status",
        };
    }

    /**
     * Get action description for status
     */
    private function getActionDescription(string $status): string
    {
        return match ($status) {
            self::STATUS_PRICE_RESEARCH => "Iniciar pesquisa de preços",
            self::STATUS_BIDDING => "Iniciar processo licitatório",
            self::STATUS_AWAITING_SUPPLY_AUTHORIZATION
                => "Solicitar autorização de fornecimento",
            self::STATUS_APPROVED => "Aprovar pedido",
            self::STATUS_REJECTED => "Rejeitar pedido",
            default => "Atualizar status do pedido",
        };
    }

    /**
     * Get the user who created the request
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the secretaria
     */
    public function secretaria(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class);
    }

    /**
     * Get the items for this purchase request
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }

    /**
     * Get the bidding process for this purchase request
     */
    public function biddingProcess(): BelongsTo
    {
        return $this->belongsTo(BiddingProcess::class);
    }

    /**
     * Get the contract draft for this purchase request
     */
    public function contractDraft(): BelongsTo
    {
        return $this->belongsTo(ContractDraft::class);
    }
}
