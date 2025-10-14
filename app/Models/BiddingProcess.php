<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BiddingProcess extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'consolidated_items',
        'user_id',
        'created_by',
        'observations',
    ];

    protected $casts = [
        'consolidated_items' => 'array',
    ];

    // Status constants
    const STATUS_DRAFT = 'draft';
    const STATUS_OPENED = 'opened';
    const STATUS_CLOSED = 'closed';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Get the user who created the bidding process
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the purchase requests for this bidding process
     */
    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    /**
     * Get status display text in Portuguese
     */
    public function getStatusDisplayText(): string
    {
        return match($this->status) {
            self::STATUS_DRAFT => 'Rascunho',
            self::STATUS_OPENED => 'Aberto',
            self::STATUS_CLOSED => 'Encerrado',
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
            self::STATUS_DRAFT => 'secondary',
            self::STATUS_OPENED => 'default',
            self::STATUS_CLOSED => 'outline',
            self::STATUS_CANCELLED => 'destructive',
            default => 'secondary',
        };
    }

    /**
     * Get total quantity of all consolidated items
     */
    public function getTotalQuantityAttribute(): float
    {
        if (!$this->consolidated_items) {
            return 0;
        }

        return array_sum(array_column($this->consolidated_items, 'totalQuantity'));
    }

    /**
     * Get total number of unique items
     */
    public function getUniqueItemsCountAttribute(): int
    {
        if (!$this->consolidated_items) {
            return 0;
        }

        return count($this->consolidated_items);
    }

    /**
     * Get total number of source requests
     */
    public function getSourceRequestsCountAttribute(): int
    {
        if (!$this->consolidated_items) {
            return 0;
        }

        $allSourceIds = [];
        foreach ($this->consolidated_items as $item) {
            $allSourceIds = array_merge($allSourceIds, $item['sourceRequestIds'] ?? []);
        }

        return count(array_unique($allSourceIds));
    }

    /**
     * Check if bidding process can be edited
     */
    public function canBeEdited(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if bidding process can be opened
     */
    public function canBeOpened(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if bidding process can be closed
     */
    public function canBeClosed(): bool
    {
        return $this->status === self::STATUS_OPENED;
    }

    /**
     * Check if bidding process can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_OPENED]);
    }
}
