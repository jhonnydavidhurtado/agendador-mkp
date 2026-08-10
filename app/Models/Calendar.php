<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [

        'company_id',
        'advisor_id',
        'status',

    ];

    protected function casts(): array
    {
        return [

            'status' => 'boolean',

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
     * Asesor
     */
    public function advisor(): BelongsTo
    {
        return $this->belongsTo(Advisor::class);
    }

    /**
     * Días del calendario
     */
    public function days(): HasMany
    {
        return $this->hasMany(CalendarDay::class);
    }
}