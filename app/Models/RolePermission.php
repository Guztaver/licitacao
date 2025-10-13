<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RolePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'permission_id',
        'permission_type',
        'conditions',
        'restrictions',
        'granted_at',
        'expires_at',
        'revoked_at',
        'is_active',
        'priority',
        'can_override',
        'context',
        'resource_type',
        'resource_ids',
        'granted_by',
        'revoked_by',
        'revoke_reason',
    ];

    protected $casts = [
        'conditions' => 'array',
        'restrictions' => 'array',
        'granted_at' => 'datetime',
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'is_active' => 'boolean',
        'priority' => 'integer',
        'can_override' => 'boolean',
        'context' => 'array',
        'resource_ids' => 'array',
        'granted_by' => 'integer',
        'revoked_by' => 'integer',
    ];

    protected $dates = [
        'granted_at',
        'expires_at',
        'revoked_at',
    ];

    // Permission type constants
    const TYPE_ALLOW = 'allow';
    const TYPE_DENY = 'deny';
    const TYPE_INHERIT = 'inherit';
    const TYPE_CONDITIONAL = 'conditional';

    /**
     * Get the role that owns the role_permission.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the permission that owns the role_permission.
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    /**
     * Get the user who granted the permission.
     */
    public function grantedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    /**
     * Get the user who revoked the permission.
     */
    public function revokedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revoked_by');
    }

    /**
     * Get permission type display name.
     */
    public function getPermissionTypeDisplayAttribute(): string
    {
        $types = [
            self::TYPE_ALLOW => 'Permitido',
            self::TYPE_DENY => 'Negado',
            self::TYPE_INHERIT => 'Herdado',
            self::TYPE_CONDITIONAL => 'Condicional',
        ];

        return $types[$this->permission_type] ?? $this->permission_type;
    }

    /**
     * Get permission type color class.
     */
    public function getPermissionTypeColorAttribute(): string
    {
        $colors = [
            self::TYPE_ALLOW => 'bg-green-100 text-green-800',
            self::TYPE_DENY => 'bg-red-100 text-red-800',
            self::TYPE_INHERIT => 'bg-blue-100 text-blue-800',
            self::TYPE_CONDITIONAL => 'bg-yellow-100 text-yellow-800',
        ];

        return $colors[$this->permission_type] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if permission is active.
     */
    public function isActive(): bool
    {
        return $this->is_active &&
               $this->permission_type !== self::TYPE_DENY &&
               (!$this->expires_at || $this->expires_at->isFuture()) &&
               !$this->revoked_at;
    }

    /**
     * Check if permission is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if permission is revoked.
     */
    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * Check if permission can override others.
     */
    public function canOverride(): bool
    {
        return $this->can_override && $this->isActive();
    }

    /**
     * Check if permission applies to a specific resource.
     */
    public function appliesToResource(string $resourceType, $resourceId = null): bool
    {
        // Check resource type match
        if ($this->resource_type && $this->resource_type !== $resourceType) {
            return false;
        }

        // Check specific resource IDs
        if ($this->resource_ids && $resourceId) {
            return in_array($resourceId, $this->resource_ids);
        }

        return true;
    }

    /**
     * Check if permission conditions are met.
     */
    public function conditionsMet(array $context = []): bool
    {
        if (!$this->conditions || empty($this->conditions)) {
            return true;
        }

        foreach ($this->conditions as $condition) {
            if (!$this->evaluateCondition($condition, $context)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate a single condition.
     */
    private function evaluateCondition(array $condition, array $context): bool
    {
        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? 'equals';
        $value = $condition['value'] ?? null;
        $contextValue = $this->getNestedValue($context, $field);

        return match ($operator) {
            'equals' => $contextValue == $value,
            'not_equals' => $contextValue != $value,
            'in' => in_array($contextValue, (array) $value),
            'not_in' => !in_array($contextValue, (array) $value),
            'greater_than' => $contextValue > $value,
            'less_than' => $contextValue < $value,
            'greater_equal' => $contextValue >= $value,
            'less_equal' => $contextValue <= $value,
            'contains' => str_contains((string) $contextValue, (string) $value),
            'starts_with' => str_starts_with((string) $contextValue, (string) $value),
            'ends_with' => str_ends_with((string) $contextValue, (string) $value),
            'is_null' => is_null($contextValue),
            'is_not_null' => !is_null($contextValue),
            default => true,
        };
    }

    /**
     * Get nested value from array using dot notation.
     */
    private function getNestedValue(array $array, string $key, $default = null)
    {
        $keys = explode('.', $key);
        $value = $array;

        foreach ($keys as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }

    /**
     * Revoke permission assignment.
     */
    public function revoke(string $reason = null): bool
    {
        return $this->update([
            'revoked_at' => now(),
            'revoked_by' => auth()->id(),
            'revoke_reason' => $reason,
            'is_active' => false,
        ]);
    }

    /**
     * Set permission to expire at specific date.
     */
    public function setExpiration(\DateTime $expiresAt): bool
    {
        return $this->update(['expires_at' => $expiresAt]);
    }

    /**
     * Extend expiration by given days.
     */
    public function extendExpiration(int $days): bool
    {
        $newExpiresAt = $this->expires_at
            ? $this->expires_at->addDays($days)
            : now()->addDays($days);

        return $this->setExpiration($newExpiresAt);
    }

    /**
     * Add restriction to permission.
     */
    public function addRestriction(string $key, $value): bool
    {
        $restrictions = $this->restrictions ?? [];
        $restrictions[$key] = $value;

        return $this->update(['restrictions' => $restrictions]);
    }

    /**
     * Remove restriction from permission.
     */
    public function removeRestriction(string $key): bool
    {
        $restrictions = $this->restrictions ?? [];
        unset($restrictions[$key]);

        return $this->update(['restrictions' => $restrictions]);
    }

    /**
     * Check if permission has specific restriction.
     */
    public function hasRestriction(string $key): bool
    {
        return isset($this->restrictions[$key]);
    }

    /**
     * Get restriction value.
     */
    public function getRestriction(string $key, $default = null)
    {
        return $this->restrictions[$key] ?? $default;
    }

    /**
     * Get permission summary for API responses.
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'role' => $this->role->display_name,
            'permission' => $this->permission->display_name,
            'permission_type' => $this->permission_type_display,
            'is_active' => $this->isActive(),
            'priority' => $this->priority,
            'can_override' => $this->can_override,
            'expires_at' => $this->expires_at?->format('d/m/Y H:i'),
            'revoked_at' => $this->revoked_at?->format('d/m/Y H:i'),
            'granted_at' => $this->granted_at->format('d/m/Y H:i'),
            'granted_by' => $this->grantedBy->name ?? 'System',
            'resource_type' => $this->resource_type,
            'resource_ids' => $this->resource_ids,
            'has_conditions' => !empty($this->conditions),
            'has_restrictions' => !empty($this->restrictions),
            'colors' => [
                'type' => $this->permission_type_color,
            ],
        ];
    }

    /**
     * Scope active permissions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    })
                    ->whereNull('revoked_at');
    }

    /**
     * Scope expired permissions.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope revoked permissions.
     */
    public function scopeRevoked($query)
    {
        return $query->whereNotNull('revoked_at');
    }

    /**
     * Scope by permission type.
     */
    public function scopeType($query, $type)
    {
        return $query->where('permission_type', $type);
    }

    /**
     * Scope by priority.
     */
    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope by priority level (greater than or equal).
     */
    public function scopePriorityMin($query, $priority)
    {
        return $query->where('priority', '>=', $priority);
    }

    /**
     * Scope that can override.
     */
    public function scopeCanOverride($query)
    {
        return $query->where('can_override', true)->active();
    }

    /**
     * Scope by resource type.
     */
    public function scopeResourceType($query, $resourceType)
    {
        return $query->where('resource_type', $resourceType);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Set default values on create
        static::creating(function ($rolePermission) {
            if ($rolePermission->granted_at === null) {
                $rolePermission->granted_at = now();
            }

            if ($rolePermission->is_active === null) {
                $rolePermission->is_active = true;
            }

            if ($rolePermission->priority === null) {
                $rolePermission->priority = 0;
            }
        });
    }
}
