<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CalendarDay extends Model
{
    use HasFactory;

    protected $fillable = [

        'calendar_id',
        'day',
        'status',

    ];

    protected function casts(): array
    {
        return [

            'status' => 'boolean',

        ];
    }

    /**
     * Calendario
     */
    public function calendar(): BelongsTo
    {
        return $this->belongsTo(Calendar::class);
    }

    /**
     * Horarios
     */
    public function hours(): HasMany
    {
        return $this->hasMany(CalendarHour::class);
    }
}