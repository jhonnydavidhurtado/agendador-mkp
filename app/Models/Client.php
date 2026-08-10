<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [

        'company_id',
        'name',
        'phone',
        'email',
        'birthdate',
        'photo',
        'notes',
        'status',

    ];

    protected function casts(): array
    {
        return [

            'birthdate' => 'date',
            'status' => 'boolean',
            'deleted_at' => 'datetime',

        ];
    }

    /**
     * Empresa
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Citas
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}