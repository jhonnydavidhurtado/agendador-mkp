<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Advisor extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [

        'company_id',
        'user_id',
        'photo',
        'profession',
        'description',
        'status',

    ];
    protected $appends = [
    'photo_url',
];

public function getPhotoUrlAttribute(): ?string
{
    return $this->photo
        ? Storage::disk('public')->url($this->photo)
        : null;
}

    protected function casts(): array
    {
        return [

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
     * Usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calendarios
     */
    public function calendars(): HasMany
    {
        return $this->hasMany(Calendar::class);
    }

    /**
     * Citas
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}