<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarHour extends Model
{
    use HasFactory;

    protected $fillable = [

        'calendar_day_id',
        'start_time',
        'end_time',
        'status',

    ];

    protected function casts(): array
    {
        return [

            'status' => 'boolean',

        ];
    }

    /**
     * Día del calendario
     */
    public function calendarDay(): BelongsTo
    {
        return $this->belongsTo(CalendarDay::class);
    }
}