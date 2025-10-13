<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRole extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'role_id',
        'status',
        'assignment_type',
        'assigned_at',
        'starts_at',
        'expires_at',
        'revoked_at',
        'scope',
        'restrictions',
        'conditions',
        'priority',
        'is_primary',
        'can_be_overridden',
        'assigned_by',
        'approved_by',
        'revoked_by',
        'assignment_reason',
        'revoke_reason',
        'is_system',
        'reference_id',
        'metadata',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'scope' => 'array',
        'restrictions' => 'array',
        'conditions' => 'array',
        'priority' => 'integer',
        'is_primary' => 'boolean',
        'can_be_overridden' => 'boolean',
        'assigned_by' => 'integer',
        'approved_by' => 'integer',
        'revoked_by' => 'integer',
        'is_system' => 'boolean',
        'metadata' => 'array',
    ];

    protected $dates = [
        'assigned_at',
        'starts_at',
        'expires_at',
        'revoked_at',
    ];

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_PENDING = 'pending';
    const STATUS_EXPIRED = 'expired';
    const STATUS_REVOKED = 'revoked';

    // Assignment type constants
    const TYPE_DIRECT = 'direct';
    const TYPE_INHERITED = 'inherited';
    const TYPE_AUTOMATIC = 'automatic';
    const TYPE_TEMPORARY = 'temporary';
    const TYPE_EMERGENCY = 'emergency';

    /**
     * Get the user that owns the user_role.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the role that owns the user_role.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the user who assigned the role.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Get the user who approved the assignment.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who revoked the assignment.
     */
    public function revokedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revoked_by');
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            self::STATUS_ACTIVE => 'Ativa',
            self::STATUS_INACTIVE => 'Inativa',
            self::STATUS_PENDING => 'Pendente',
            self::STATUS_EXPIRED => 'Expirada',
            self::STATUS_REVOKED => 'Revogada',
        ];

        return $status[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            self::STATUS_ACTIVE => 'bg-green-100 text-green-800',
            self::STATUS_INACTIVE => 'bg-gray-100 text-gray-800',
            self::STATUS_PENDING => 'bg-yellow-100 text-yellow-800',
            self::STATUS_EXPIRED => 'bg-orange-100 text-orange-800',
            self::STATUS_REVOKED => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get assignment type display name.
     */
    public function getAssignmentTypeDisplayAttribute(): string
    {
        $types = [
            self::TYPE_DIRECT => 'Direta',
            self::TYPE_INHERITED => 'Herdada',
            self::TYPE_AUTOMATIC => 'Automática',
            self::TYPE_TEMPORARY => 'Temporária',
            self::TYPE_EMERGENCY => 'Emergencial',
        ];

        return $types[$this->assignment_type] ?? $this->assignment_type;
    }

    /**
     * Check if assignment is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE &&
               (!$this->expires_at || $this->expires_at->isFuture()) &&
               (!$this->starts_at || $this->starts_at->isPast()) &&
               !$this->revoked_at;
    }

    /**
     * Check if assignment is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if assignment is revoked.
     */
    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * Check if assignment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if assignment is ready to start.
     */
    public function isReadyToStart(): bool
    {
        return $this->starts_at && $this->starts_at->isFuture() && $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if assignment is system assignment.
     */
    public function isSystemAssignment(): bool
    {
        return $this->is_system;
    }

    /**
     * Check if assignment is primary role.
     */
    public function isPrimary(): bool
    {
        return $this->is_primary;
    }

    /**
     * Check if assignment can be overridden.
     */
    public function canBeOverridden(): bool
    {
        return $this->can_be_overridden && $this->isActive();
    }

    /**
     * Check if assignment applies to specific scope.
     */
    public function appliesToScope(array $context): bool
    {
        if (!$this->scope || empty($this->scope)) {
            return true;
        }

        foreach ($this->scope as $key => $expectedValue) {
            $actualValue = $context[$key] ?? null;

            if ($actualValue != $expectedValue) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if assignment restrictions are met.
     */
    public function restrictionsMet(array $context): bool
    {
        if (!$this->restrictions || empty($this->restrictions)) {
            return true;
        }

        foreach ($this->restrictions as $restriction) {
            if (!$this->evaluateRestriction($restriction, $context)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate a single restriction.
     */
    private function evaluateRestriction(array $restriction, array $context): bool
    {
        $field = $restriction['field'] ?? null;
        $operator = $restriction['operator'] ?? 'equals';
        $value = $restriction['value'] ?? null;
        $contextValue = $context[$field] ?? null;

        return match ($operator) {
            'equals' => $contextValue == $value,
            'not_equals' => $contextValue != $value,
            'in' => in_array($contextValue, (array) $value),
            'not_in' => !in_array($contextValue, (array) $value),
            'greater_than' => $contextValue > $value,
            'less_than' => $contextValue < $value,
            'contains' => str_contains((string) $contextValue, (string) $value),
            'not_contains' => !str_contains((string) $contextValue, (string) $value),
            default => true,
        };
    }

    /**
     * Approve role assignment.
     */
    public function approve(int $approverId = null): bool
    {
        if ($this->status !== self::STATUS_PENDING) {
            return false;
        }

        return $this->update([
            'status' => self::STATUS_ACTIVE,
            'approved_by' => $approverId ?? auth()->id(),
        ]);
    }

    /**
     * Revoke role assignment.
     */
    public function revoke(string $reason = null): bool
    {
        return $this->update([
            'status' => self::STATUS_REVOKED,
            'revoked_at' => now(),
            'revoked_by' => auth()->id(),
            'revoke_reason' => $reason,
        ]);
    }

    /**
     * Extend assignment expiration.
     */
    public function extendExpiration(\DateTime $newExpiresAt): bool
    {
        return $this->update(['expires_at' => $newExpiresAt]);
    }

    /**
     * Set assignment to primary.
     */
    public function setAsPrimary(): bool
    {
        // Remove primary status from other roles for this user
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->where('is_primary', true)
            ->update(['is_primary' => false]);

        return $this->update(['is_primary' => true]);
    }

    /**
     * Add scope restriction.
     */
    public function addScopeRestriction(string $key, $value): bool
    {
        $scope = $this->scope ?? [];
        $scope[$key] = $value;

        return $this->update(['scope' => $scope]);
    }

    /**
     * Remove scope restriction.
     */
    public function removeScopeRestriction(string $key): bool
    {
        $scope = $this->scope ?? [];
        unset($scope[$key]);

        return $this->update(['scope' => $scope]);
    }

    /**
     * Add condition.
     */
    public function addCondition(string $key, $value): bool
    {
        $conditions = $this->conditions ?? [];
        $conditions[$key] = $value;

        return $this->update(['conditions' => $conditions]);
    }

    /**
     * Remove condition.
     */
    public function removeCondition(string $key): bool
    {
        $conditions = $this->conditions ?? [];
        unset($conditions[$key]);

        return $this->update(['conditions' => $conditions]);
    }

    /**
     * Get assignment summary for API responses.
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user->name,
            'role' => $this->role->display_name,
            'status' => $this->status_display,
            'assignment_type' => $this->assignment_type_display,
            'is_primary' => $this->is_primary,
            'can_be_overridden' => $this->can_be_overridden,
            'priority' => $this->priority,
            'starts_at' => $this->starts_at?->format('d/m/Y H:i'),
            'expires_at' => $this->expires_at?->format('d/m/Y H:i'),
            'revoked_at' => $this->revoked_at?->format('d/m/Y H:i'),
            'assigned_at' => $this->assigned_at->format('d/m/Y H:i'),
            'assigned_by' => $this->assignedBy->name ?? 'System',
            'approved_by' => $this->approvedBy?->name,
            'has_scope' => !empty($this->scope),
            'has_restrictions' => !empty($this->restrictions),
            'has_conditions' => !empty($this->conditions),
            'colors' => [
                'status' => $this->status_color,
            ],
        ];
    }

    /**
     * Scope active assignments.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('starts_at')
                          ->orWhere('starts_at', '<=', now());
                    })
                    ->whereNull('revoked_at');
    }

    /**
     * Scope by status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope by assignment type.
     */
    public function scopeType($query, $type)
    {
        return $query->where('assignment_type', $type);
    }

    /**
     * Scope expired assignments.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope revoked assignments.
     */
    public function scopeRevoked($query)
    {
        return $query->whereNotNull('revoked_at');
    }

    /**
     * Scope pending assignments.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope primary assignments.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope by user.
     */
    public function scopeUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope by role.
     */
    public function scopeRole($query, $roleId)
    {
        return $query->where('role_id', $roleId);
    }

    /**
     * Scope by assigned by.
     */
    public function scopeAssignedBy($query, $userId)
    {
        return $query->where('assigned_by', $userId);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Set default values on create
        static::creating(function ($userRole) {
            if ($userRole->assigned_at === null) {
                $userRole->assigned_at = now();
            }

            if ($userRole->status === null) {
                $userRole->status = self::STATUS_PENDING;
            }

            if ($userRole->priority === null) {
                $userRole->priority = 0;
            }
        });

        // Handle role assignment status changes
        static::saved(function ($userRole) {
            // Update user's default role if this is primary
            if ($userRole->is_primary && $userRole->isActive()) {
                $userRole->user->update(['default_role_id' => $userRole->role_id]);
            }

            // Invalidate user's permission cache
            $userRole->user->invalidatePermissionCache();
        });
    }
}
