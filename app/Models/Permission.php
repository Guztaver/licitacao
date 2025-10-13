<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'slug',
        'module',
        'type',
        'scope',
        'scope_conditions',
        'level',
        'restrictions',
        'conditions',
        'requires_approval',
        'approval_level',
        'is_system',
        'status',
        'created_by',
        'change_reason',
    ];

    protected $casts = [
        'scope_conditions' => 'array',
        'restrictions' => 'array',
        'conditions' => 'array',
        'requires_approval' => 'boolean',
        'approval_level' => 'integer',
        'is_system' => 'boolean',
        'created_by' => 'integer',
        'level' => 'integer',
    ];

    // Module constants
    const MODULE_USERS = 'users';
    const MODULE_ROLES = 'roles';
    const MODULE_FORNECEDORES = 'fornecedores';
    const MODULE_CONTRATOS = 'contratos';
    const MODULE_REQUISICOES = 'requisicoes';
    const MODULE_PEDIDOS = 'pedidos';
    const MODULE_CONFERENCIAS = 'conferencias';
    const MODULE_ESTOQUE = 'estoque';
    const MODULE_RELATORIOS = 'relatorios';
    const MODULE_DASHBOARD = 'dashboard';
    const MODULE_SYSTEM = 'system';
    const MODULE_AUDITORIA = 'auditoria';
    const MODULE_NOTIFICATIONS = 'notifications';
    const MODULE_INTEGRATIONS = 'integrations';
    const MODULE_CUSTOM = 'custom';

    // Type constants
    const TYPE_CREATE = 'create';
    const TYPE_READ = 'read';
    const TYPE_UPDATE = 'update';
    const TYPE_DELETE = 'delete';
    const TYPE_APPROVE = 'approve';
    const TYPE_REJECT = 'reject';
    const TYPE_EXPORT = 'export';
    const TYPE_IMPORT = 'import';
    const TYPE_MANAGE = 'manage';
    const TYPE_ADMIN = 'admin';
    const TYPE_EXECUTE = 'execute';
    const TYPE_VIEW_SENSITIVE = 'view_sensitive';
    const TYPE_CUSTOM = 'custom';

    // Scope constants
    const SCOPE_GLOBAL = 'global';
    const SCOPE_OWN = 'own';
    const SCOPE_DEPARTMENT = 'department';
    const SCOPE_TEAM = 'team';
    const SCOPE_CUSTOM = 'custom';

    // Level constants
    const LEVEL_BASIC = 'basic';
    const LEVEL_INTERMEDIATE = 'intermediate';
    const LEVEL_ADVANCED = 'advanced';
    const LEVEL_EXPERT = 'expert';
    const LEVEL_MASTER = 'master';

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_DEPRECATED = 'deprecated';
    const STATUS_EXPERIMENTAL = 'experimental';

    /**
     * Get the roles that have this permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission')
            ->withPivot(['permission_type', 'conditions', 'restrictions', 'expires_at', 'is_active', 'priority'])
            ->wherePivot('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Get all roles including inactive assignments.
     */
    public function allRoles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission')
            ->withPivot(['permission_type', 'conditions', 'restrictions', 'expires_at', 'is_active', 'priority']);
    }

    /**
     * Get the creator of the permission.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get module display name.
     */
    public function getModuleDisplayAttribute(): string
    {
        $modules = [
            self::MODULE_USERS => 'Usuários',
            self::MODULE_ROLES => 'Papéis',
            self::MODULE_FORNECEDORES => 'Fornecedores',
            self::MODULE_CONTRATOS => 'Contratos',
            self::MODULE_REQUISICOES => 'Requisições',
            self::MODULE_PEDIDOS => 'Pedidos',
            self::MODULE_CONFERENCIAS => 'Conferências',
            self::MODULE_ESTOQUE => 'Estoque',
            self::MODULE_RELATORIOS => 'Relatórios',
            self::MODULE_DASHBOARD => 'Dashboard',
            self::MODULE_SYSTEM => 'Sistema',
            self::MODULE_AUDITORIA => 'Auditoria',
            self::MODULE_NOTIFICATIONS => 'Notificações',
            self::MODULE_INTEGRATIONS => 'Integrações',
            self::MODULE_CUSTOM => 'Personalizado',
        ];

        return $modules[$this->module] ?? $this->module;
    }

    /**
     * Get type display name.
     */
    public function getTypeDisplayAttribute(): string
    {
        $types = [
            self::TYPE_CREATE => 'Criar',
            self::TYPE_READ => 'Ler',
            self::TYPE_UPDATE => 'Atualizar',
            self::TYPE_DELETE => 'Excluir',
            self::TYPE_APPROVE => 'Aprovar',
            self::TYPE_REJECT => 'Rejeitar',
            self::TYPE_EXPORT => 'Exportar',
            self::TYPE_IMPORT => 'Importar',
            self::TYPE_MANAGE => 'Gerenciar',
            self::TYPE_ADMIN => 'Administrar',
            self::TYPE_EXECUTE => 'Executar',
            self::TYPE_VIEW_SENSITIVE => 'Visualizar Restrito',
            self::TYPE_CUSTOM => 'Personalizado',
        ];

        return $types[$this->type] ?? $this->type;
    }

    /**
     * Get scope display name.
     */
    public function getScopeDisplayAttribute(): string
    {
        $scopes = [
            self::SCOPE_GLOBAL => 'Global',
            self::SCOPE_OWN => 'Próprio',
            self::SCOPE_DEPARTMENT => 'Departamento',
            self::SCOPE_TEAM => 'Equipe',
            self::SCOPE_CUSTOM => 'Personalizado',
        ];

        return $scopes[$this->scope] ?? $this->scope;
    }

    /**
     * Get level display name.
     */
    public function getLevelDisplayAttribute(): string
    {
        $levels = [
            self::LEVEL_BASIC => 'Básico',
            self::LEVEL_INTERMEDIATE => 'Intermediário',
            self::LEVEL_ADVANCED => 'Avançado',
            self::LEVEL_EXPERT => 'Especialista',
            self::LEVEL_MASTER => 'Mestre',
        ];

        return $levels[$this->level] ?? $this->level;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $status = [
            self::STATUS_ACTIVE => 'Ativa',
            self::STATUS_INACTIVE => 'Inativa',
            self::STATUS_DEPRECATED => 'Obsoleta',
            self::STATUS_EXPERIMENTAL => 'Experimental',
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
            self::STATUS_EXPERIMENTAL => 'bg-blue-100 text-blue-800',
        ];

        return $colors[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get type color class.
     */
    public function getTypeColorAttribute(): string
    {
        $colors = [
            self::TYPE_CREATE => 'bg-green-100 text-green-800',
            self::TYPE_READ => 'bg-blue-100 text-blue-800',
            self::TYPE_UPDATE => 'bg-yellow-100 text-yellow-800',
            self::TYPE_DELETE => 'bg-red-100 text-red-800',
            self::TYPE_APPROVE => 'bg-purple-100 text-purple-800',
            self::TYPE_REJECT => 'bg-orange-100 text-orange-800',
            self::TYPE_EXPORT => 'bg-indigo-100 text-indigo-800',
            self::TYPE_IMPORT => 'bg-pink-100 text-pink-800',
            self::TYPE_MANAGE => 'bg-teal-100 text-teal-800',
            self::TYPE_ADMIN => 'bg-gray-100 text-gray-800',
            self::TYPE_EXECUTE => 'bg-cyan-100 text-cyan-800',
            self::TYPE_VIEW_SENSITIVE => 'bg-rose-100 text-rose-800',
            self::TYPE_CUSTOM => 'bg-amber-100 text-amber-800',
        ];

        return $colors[$this->type] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Check if permission is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if permission is system permission.
     */
    public function isSystemPermission(): bool
    {
        return $this->is_system;
    }

    /**
     * Check if permission can be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_system && $this->allRoles()->isEmpty();
    }

    /**
     * Check if permission is a CRUD operation.
     */
    public function isCrudOperation(): bool
    {
        return in_array($this->type, [
            self::TYPE_CREATE,
            self::TYPE_READ,
            self::TYPE_UPDATE,
            self::TYPE_DELETE,
        ]);
    }

    /**
     * Check if permission requires approval.
     */
    public function requiresApproval(): bool
    {
        return $this->requires_approval;
    }

    /**
     * Check if permission is high risk.
     */
    public function isHighRisk(): bool
    {
        $highRiskTypes = [
            self::TYPE_DELETE,
            self::TYPE_ADMIN,
            self::TYPE_VIEW_SENSITIVE,
        ];

        $highRiskModules = [
            self::MODULE_SYSTEM,
            self::MODULE_AUDITORIA,
            self::MODULE_USERS,
            self::MODULE_ROLES,
        ];

        return in_array($this->type, $highRiskTypes) ||
               in_array($this->module, $highRiskModules) ||
               $this->level === self::LEVEL_MASTER;
    }

    /**
     * Get permission icon based on type.
     */
    public function getIcon(): string
    {
        $icons = [
            self::TYPE_CREATE => 'plus',
            self::TYPE_READ => 'eye',
            self::TYPE_UPDATE => 'pencil',
            self::TYPE_DELETE => 'trash',
            self::TYPE_APPROVE => 'check',
            self::TYPE_REJECT => 'x-mark',
            self::TYPE_EXPORT => 'arrow-down-tray',
            self::TYPE_IMPORT => 'arrow-up-tray',
            self::TYPE_MANAGE => 'cog',
            self::TYPE_ADMIN => 'shield-check',
            self::TYPE_EXECUTE => 'play',
            self::TYPE_VIEW_SENSITIVE => 'lock-closed',
            self::TYPE_CUSTOM => 'cog-6-tooth',
        ];

        return $icons[$this->type] ?? 'key';
    }

    /**
     * Get permission summary for API responses.
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'slug' => $this->slug,
            'module' => $this->module_display,
            'type' => $this->type_display,
            'scope' => $this->scope_display,
            'level' => $this->level_display,
            'status' => $this->status_display,
            'is_system' => $this->is_system,
            'requires_approval' => $this->requires_approval,
            'is_high_risk' => $this->isHighRisk(),
            'is_crud' => $this->isCrudOperation(),
            'roles_count' => $this->roles()->count(),
            'icon' => $this->getIcon(),
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'colors' => [
                'status' => $this->status_color,
                'type' => $this->type_color,
            ],
        ];
    }

    /**
     * Scope active permissions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope system permissions.
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope by module.
     */
    public function scopeModule($query, $module)
    {
        return $query->where('module', $module);
    }

    /**
     * Scope by type.
     */
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope by scope.
     */
    public function scopeScope($query, $scope)
    {
        return $query->where('scope', $scope);
    }

    /**
     * Scope by level.
     */
    public function scopeLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope high risk permissions.
     */
    public function scopeHighRisk($query)
    {
        return $query->where(function ($q) {
            $q->whereIn('type', [
                self::TYPE_DELETE,
                self::TYPE_ADMIN,
                self::TYPE_VIEW_SENSITIVE,
            ])->orWhere('level', self::LEVEL_MASTER)
               ->orWhereIn('module', [
                   self::MODULE_SYSTEM,
                   self::MODULE_AUDITORIA,
                   self::MODULE_USERS,
                   self::MODULE_ROLES,
               ]);
        });
    }

    /**
     * Scope permissions requiring approval.
     */
    public function scopeRequiresApproval($query)
    {
        return $query->where('requires_approval', true);
    }

    /**
     * Scope CRUD permissions.
     */
    public function scopeCrud($query)
    {
        return $query->whereIn('type', [
            self::TYPE_CREATE,
            self::TYPE_READ,
            self::TYPE_UPDATE,
            self::TYPE_DELETE,
        ]);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate slug on create
        static::creating(function ($permission) {
            if (empty($permission->slug)) {
                $permission->slug = str_slug($permission->name);
            }
        });
    }
}
