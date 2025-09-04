<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'municipio',
        'tipo_acesso',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'tipo_acesso' => 'string',
        ];
    }

    /**
     * Check if user is a manager.
     */
    public function isGestor(): bool
    {
        return $this->tipo_acesso === 'gestor';
    }

    /**
     * Check if user is operational.
     */
    public function isOperacional(): bool
    {
        return $this->tipo_acesso === 'operacional';
    }

    /**
     * Get tipo_acesso display name.
     */
    public function getTipoAcessoDisplayAttribute(): string
    {
        $tipos = [
            'gestor' => 'Gestor',
            'operacional' => 'Operacional',
        ];

        return $tipos[$this->tipo_acesso] ?? $this->tipo_acesso;
    }
}
