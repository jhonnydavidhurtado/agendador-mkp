<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use HasRoles;
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'nit',
        'phone',
        'address',
        'city',
        'country',
        'logo',
        'cover',
        'status',
        'created_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Empresa del usuario.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Perfil de asesor.
     */
    public function advisor(): HasOne
    {
        return $this->hasOne(Advisor::class);
    }

    /**
     * Usuario creador.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Usuarios creados por este usuario.
     */
    public function createdUsers()
    {
        return $this->hasMany(User::class, 'created_by');
    }
}