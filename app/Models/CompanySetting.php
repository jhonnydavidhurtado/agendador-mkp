<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanySetting extends Model
{
    use HasFactory;


    protected $fillable = [

        'company_id',

        'timezone',
        'currency',
        'language',

        'appointment_interval',

        'start_week',

        'logo',

        'primary_color',
        'secondary_color',

        'notifications',

    ];



    protected function casts(): array
    {
        return [

            'appointment_interval' => 'integer',

            'notifications' => 'boolean',

        ];
    }



    /**
     * Empresa
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

}


    

