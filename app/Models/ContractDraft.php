<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractDraft extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_purchase_request_id',
        'requesting_department_id',
        'requesting_user_id',
        'title',
        'description',
        'status',
        'items',
        'estimated_total_value',
        'research_notes',
        'contract_notes',
        'priority_level',
        'created_by',
    ];

    protected $casts = [
        'items' => 'array',
        'estimated_total_value' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING_ANALYSIS = 'pending_analysis';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_FINALIZED = 'finalized';
    const STATUS_CANCELLED = 'cancelled';

    // Priority levels
    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    /**
     * Get the source purchase request
     */
    public function sourcePurchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class, 'source_purchase_request_id');
    }

    /**
     * Get the requesting department (secretaria)
     */
    public function requestingDepartment(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class, 'requesting_department_id');
    }

    /**
     * Get the requesting user
     */
    public function requestingUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requesting_user_id');
    }

    /**
     * Get the user who created the contract draft
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get status display text in Portuguese
     */
    public function getStatusDisplayText(): string
    {
        return match($this->status) {
            self::STATUS_PENDING_ANALYSIS => 'Aguardando Análise',
            self::STATUS_IN_PROGRESS => 'Em Elaboração',
            self::STATUS_UNDER_REVIEW => 'Em Revisão',
            self::STATUS_FINALIZED => 'Finalizado',
            self::STATUS_CANCELLED => 'Cancelado',
            default => 'Status Desconhecido',
        };
    }

    /**
     * Get status badge color
     */
    public function getStatusBadgeColor(): string
    {
        return match($this->status) {
            self::STATUS_PENDING_ANALYSIS => 'secondary',
            self::STATUS_IN_PROGRESS => 'default',
            self::STATUS_UNDER_REVIEW => 'outline',
            self::STATUS_FINALIZED => 'default',
            self::STATUS_CANCELLED => 'destructive',
            default => 'secondary',
        };
    }

    /**
     * Get priority display text in Portuguese
     */
    public function getPriorityDisplayText(): string
    {
        return match($this->priority_level) {
            self::PRIORITY_LOW => 'Baixa',
            self::PRIORITY_MEDIUM => 'Média',
            self::PRIORITY_HIGH => 'Alta',
            self::PRIORITY_URGENT => 'Urgente',
            default => 'Normal',
        };
    }

    /**
     * Get priority badge color
     */
    public function getPriorityBadgeColor(): string
    {
        return match($this->priority_level) {
            self::PRIORITY_LOW => 'secondary',
            self::PRIORITY_MEDIUM => 'default',
            self::PRIORITY_HIGH => 'outline',
            self::PRIORITY_URGENT => 'destructive',
            default => 'secondary',
        };
    }

    /**
     * Get total number of items
     */
    public function getItemsCountAttribute(): int
    {
        if (!$this->items) {
            return 0;
        }

        return count($this->items);
    }

    /**
     * Get total quantity of all items
     */
    public function getTotalQuantityAttribute(): float
    {
        if (!$this->items) {
            return 0;
        }

        return array_sum(array_column($this->items, 'quantidade_solicitada'));
    }

    /**
     * Check if contract draft can be edited
     */
    public function canBeEdited(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING_ANALYSIS,
            self::STATUS_IN_PROGRESS,
        ]);
    }

    /**
     * Check if contract draft can be finalized
     */
    public function canBeFinalized(): bool
    {
        return in_array($this->status, [
            self::STATUS_IN_PROGRESS,
            self::STATUS_UNDER_REVIEW,
        ]);
    }

    /**
     * Check if contract draft can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING_ANALYSIS,
            self::STATUS_IN_PROGRESS,
            self::STATUS_UNDER_REVIEW,
        ]);
    }

    /**
     * Calculate estimated total value from items
     */
    public function calculateEstimatedTotal(): void
    {
        if (!$this->items) {
            $this->estimated_total_value = 0;
            return;
        }

        $total = 0;
        foreach ($this->items as $item) {
            $quantity = $item['quantidade_solicitada'] ?? 0;
            $unitPrice = $item['valor_unitario_estimado'] ?? 0;
            $total += $quantity * $unitPrice;
        }

        $this->estimated_total_value = $total;
        $this->save();
    }

    /**
     * Get valid status transitions
     */
    public static function getValidTransitions(): array
    {
        return [
            self::STATUS_PENDING_ANALYSIS => [
                self::STATUS_IN_PROGRESS,
                self::STATUS_CANCELLED,
            ],
            self::STATUS_IN_PROGRESS => [
                self::STATUS_UNDER_REVIEW,
                self::STATUS_CANCELLED,
            ],
            self::STATUS_UNDER_REVIEW => [
                self::STATUS_FINALIZED,
                self::STATUS_IN_PROGRESS,
                self::STATUS_CANCELLED,
            ],
            self::STATUS_FINALIZED => [],
            self::STATUS_CANCELLED => [],
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
     * Add status change to history
     */
    public function addStatusHistory(string $newStatus, int $userId, ?string $comment = null): void
    {
        $history = $this->status_history ?? [];
        $history[] = [
            'status' => $newStatus,
            'changed_by' => $userId,
            'changed_at' => now()->toISOString(),
            'comment' => $comment,
        ];
        $this->status_history = $history;
    }
}
