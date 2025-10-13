<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'user_id',
        'action',
        'field_changed',
        'old_value',
        'new_value',
        'context_type',
        'context_id',
        'user_ip',
        'user_agent',
    ];

    protected $casts = [
        'old_value' => 'string',
        'new_value' => 'string',
        'user_agent' => 'string',
    ];

    /**
     * Get the item that owns the audit log.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the user that created the audit log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Create a new audit log entry.
     */
    public static function log(
        Item $item,
        string $action,
        ?string $fieldChanged = null,
        ?string $oldValue = null,
        ?string $newValue = null,
        ?string $contextType = null,
        ?int $contextId = null
    ): self {
        return static::create([
            'item_id' => $item->id,
            'user_id' => auth()->id(),
            'action' => $action,
            'field_changed' => $fieldChanged,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'context_type' => $contextType,
            'context_id' => $contextId,
            'user_ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get action display text.
     */
    public function getActionDisplayAttribute(): string
    {
        $actions = [
            'created' => 'Criado',
            'updated' => 'Atualizado',
            'frozen' => 'Congelado',
            'attempted_update' => 'Tentativa de Atualização',
        ];

        return $actions[$this->action] ?? $this->action;
    }

    /**
     * Get field display text.
     */
    public function getFieldDisplayAttribute(): string
    {
        $fields = [
            'descricao' => 'Descrição',
            'codigo' => 'Código',
            'unidade_medida' => 'Unidade de Medida',
            'preco_medio' => 'Preço Médio',
        ];

        return $fields[$this->field_changed] ?? $this->field_changed;
    }

    /**
     * Scope a query for a specific action.
     */
    public function scopeAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope a query for a specific field.
     */
    public function scopeField($query, string $field)
    {
        return $query->where('field_changed', $field);
    }

    /**
     * Scope a query for a specific context.
     */
    public function scopeContext($query, string $contextType, ?int $contextId = null)
    {
        $query->where('context_type', $contextType);
        if ($contextId) {
            $query->where('context_id', $contextId);
        }
        return $query;
    }
}
