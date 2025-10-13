<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'slug',
        'parent_id',
        'level',
        'type',
        'status',
        'expires_at',
        'is_system',
        'is_default',
        'max_users',
        'current_users',
        'created_by',
        'updated_by',
        'change_reason',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_system' => 'boolean',
        'is_default' => 'boolean',
        'max_users' => 'integer',
        'current_users' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'level' => 'integer',
    ];

    protected $dates = ['expires_at'];

    // Type constants
    const TYPE_SYSTEM = 'system';
    const TYPE_ORGANIZATIONAL = 'organizational';
    const TYPE_FUNCTIONAL = 'functional';
    const TYPE_OPERATIONAL = 'operational';
    const TYPE_CUSTOM = 'custom';

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_DEPRECATED = 'deprecated';
    const STATUS_LOCKED = 'locked';

    /**
     * Get the parent role.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'parent_id');
    }

    /**
     * Get the child roles.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Role::class, 'parent_id')->orderBy('level');
    }

    /**
     * Get the users assigned to this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_role')
            ->withPivot(['status', 'assigned_at', 'expires_at', 'is_primary'])
            ->wherePivot('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Get all users including inactive assignments.
     */
    public function allUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_role')
            ->withPivot(['status', 'assigned_at', 'expires_at', 'is_primary']);
    }

    /**
     * Get the permissions for this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission')
            ->withPivot(['permission_type', 'conditions', 'restrictions', 'expires_at', 'is_active', 'priority'])
            ->wherePivot('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Get all permissions including inactive.
     */
    public function allPermissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission')
            ->withPivot(['permission_type', 'conditions', 'restrictions', 'expires_at', 'is_active', 'priority']);
    }

    /**
     * Get the creator of the role.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the updater of the role.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get type display name.
     */
    public function getTypeDisplayAttribute(): string
    {
        $types = [
            self::TYPE_SYSTEM => 'Sistema',
            self::TYPE_ORGANIZATIONAL => 'Organizacional',
            self::TYPE_FUNCTIONAL => 'Funcional',
            self::TYPE_OPERATIONAL => 'Operacional',
            self::TYPE_CUSTOM => 'Personalizado',
        ];

        return $types[$this->type] ?? $this->type;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            self::STATUS_ACTIVE => 'Ativo',
            self::STATUS_INACTIVE => 'Inativo',
            self::STATUS_DEPRECATED => 'Obsoleto',
            self::STATUS_LOCKED => 'Bloqueado',
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
            self::STATUS_DEPRECATED => 'bg-yellow-100 text-yellow-800',
            self::STATUS_LOCKED => 'bg-red-100 text-red-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get type color class.
     */
    public function getTypeColorAttribute(): string
    {
        $colors = [
            self::TYPE_SYSTEM => 'bg-purple-100 text-purple-800',
            self::TYPE_ORGANIZATIONAL => 'bg-blue-100 text-blue-800',
            self::TYPE_FUNCTIONAL => 'bg-green-100 text-green-800',
            self::TYPE_OPERATIONAL => 'bg-orange-100 text-orange-800',
            self::TYPE_CUSTOM => 'bg-indigo-100 text-indigo-800',
        ];

        return $colors[$this->type] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if role is active and not expired.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE &&
               (!$this->expires_at || $this->expires_at->isFuture());
    }

    /**
     * Check if role is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if role is system role.
     */
    public function isSystemRole(): bool
    {
        return $this->is_system;
    }

    /**
     * Check if role can be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_system && $this->current_users === 0;
    }

    /**
     * Check if role can accept more users.
     */
    public function canAcceptMoreUsers(): bool
    {
        return !$this->max_users || $this->current_users < $this->max_users;
    }

    /**
     * Get all inherited permissions from parent roles.
     */
    public function getInheritedPermissions(): Collection
    {
        $permissions = collect();

        // Get permissions from parent role recursively
        if ($this->parent) {
            $permissions = $permissions->merge($this->parent->getInheritedPermissions());
        }

        // Add this role's own permissions
        $permissions = $permissions->merge($this->permissions);

        return $permissions->unique('id');
    }

    /**
     * Get all effective permissions (own + inherited).
     */
    public function getEffectivePermissions(): Collection
    {
        $permissions = collect();

        // Get all permissions from this role and parents
        if ($this->parent) {
            $permissions = $permissions->merge($this->parent->getInheritedPermissions());
        }

        // Add this role's permissions
        $permissions = $permissions->merge($this->permissions);

        // Sort by priority (highest first)
        return $permissions->sortByDescendant('pivot.priority');
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->getEffectivePermissions()
            ->where('name', $permissionName)
            ->where('pivot.permission_type', '!=', 'deny')
            ->isNotEmpty();
    }

    /**
     * Check if role is explicitly denied a permission.
     */
    public function isDeniedPermission(string $permissionName): bool
    {
        return $this->allPermissions()
            ->where('name', $permissionName)
            ->where('pivot.permission_type', 'deny')
            ->where('pivot.is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->isNotEmpty();
    }

    /**
     * Grant permission to role.
     */
    public function grantPermission(Permission $permission, array $pivotData = []): bool
    {
        if ($this->isDeniedPermission($permission->name)) {
            return false; // Cannot grant if explicitly denied
        }

        return $this->permissions()->syncWithoutDetaching(
            [$permission->id => array_merge([
                'permission_type' => 'allow',
                'granted_at' => now(),
                'granted_by' => auth()->id(),
            ], $pivotData)]
        ) > 0;
    }

    /**
     * Revoke permission from role.
     */
    public function revokePermission(Permission $permission): bool
    {
        return $this->permissions()->detach($permission->id) > 0;
    }

    /**
     * Deny permission for role.
     */
    public function denyPermission(Permission $permission, array $pivotData = []): bool
    {
        // Remove any existing grants first
        $this->permissions()->detach($permission->id);

        // Add explicit denial
        return $this->allPermissions()->syncWithoutDetaching(
            [$permission->id => array_merge([
                'permission_type' => 'deny',
                'granted_at' => now(),
                'granted_by' => auth()->id(),
                'is_active' => true,
            ], $pivotData)]
        ) > 0;
    }

    /**
     * Assign role to user.
     */
    public function assignToUser(User $user, array $pivotData = []): bool
    {
        if (!$this->canAcceptMoreUsers()) {
            return false;
        }

        $assignment = $user->roles()->syncWithoutDetaching([
            $this->id => array_merge([
                'status' => 'active',
                'assignment_type' => 'direct',
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
            ], $pivotData)
        ]);

        if ($assignment) {
            $this->increment('current_users');
        }

        return $assignment > 0;
    }

    /**
     * Remove role from user.
     */
    public function removeFromUser(User $user): bool
    {
        $detached = $user->roles()->detach($this->id);

        if ($detached > 0) {
            $this->decrement('current_users');
        }

        return $detached > 0;
    }

    /**
     * Get role hierarchy path.
     */
    public function getHierarchyPath(): string
    {
        $path = [];
        $current = $this;

        while ($current) {
            array_unshift($path, $current->display_name);
            $current = $current->parent;
        }

        return implode(' → ', $path);
    }

    /**
     * Get role depth in hierarchy.
     */
    public function getDepth(): int
    {
        $depth = 0;
        $current = $this->parent;

        while ($current) {
            $depth++;
            $current = $current->parent;
        }

        return $depth;
    }

    /**
     * Check if role can be parent of another role.
     */
    public function canBeParentOf(Role $child): bool
    {
        // Check if child is not ancestor of current role
        $current = $this->parent;
        while ($current) {
            if ($current->id === $child->id) {
                return false;
            }
            $current = $current->parent;
        }

        // Check level difference
        $levelDiff = $child->level - $this->level;
        return $levelDiff > 0 && $levelDiff <= 5; // Max 5 levels difference
    }

    /**
     * Update role level and child levels.
     */
    public function updateLevel(): void
    {
        $this->level = $this->parent ? $this->parent->level + 1 : 0;
        $this->save();

        // Update child levels recursively
        $this->children->each(function ($child) {
            $child->updateLevel();
        });
    }

    /**
     * Get role summary for API responses.
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'slug' => $this->slug,
            'type' => $this->type_display,
            'status' => $this->status_display,
            'hierarchy_path' => $this->getHierarchyPath(),
            'depth' => $this->getDepth(),
            'is_system' => $this->is_system,
            'is_default' => $this->is_default,
            'current_users' => $this->current_users,
            'max_users' => $this->max_users,
            'permissions_count' => $this->permissions->count(),
            'effective_permissions_count' => $this->getEffectivePermissions()->count(),
            'expires_at' => $this->expires_at?->format('d/m/Y'),
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'colors' => [
                'status' => $this->status_color,
                'type' => $this->type_color,
            ],
        ];
    }

    /**
     * Scope active roles.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    });
    }

    /**
     * Scope system roles.
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope by type.
     */
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope by level.
     */
    public function scopeLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope root roles (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope expired roles.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope default roles.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate slug on create
        static::creating(function ($role) {
            if (empty($role->slug)) {
                $role->slug = str_slug($role->name);
            }
        });

        // Update current_users count when user assignments change
        static::saved(function ($role) {
            $role->update(['current_users' => $role->users()->count()]);
        });
    }
}
