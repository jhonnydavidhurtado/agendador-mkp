<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Company extends Model
{

    use HasFactory;
    use SoftDeletes;



    protected $fillable = [

        'name',
        'nit',
        'email',
        'phone',

        'address',
        'city',
        'country',

        'logo',
        'cover',

        'status',

        'created_by',

    ];



    protected function casts(): array
    {
        return [

            'status'=>'boolean',

            'deleted_at'=>'datetime',

        ];
    }




    /**
     * Usuarios de la empresa
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }



    /**
     * Asesores
     */
    public function advisors(): HasMany
    {
        return $this->hasMany(Advisor::class);
    }



    /**
     * Clientes
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }



    /**
     * Servicios
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }



    /**
     * Citas
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }



    /**
     * Configuración
     */
    public function setting(): HasOne
    {
        return $this->hasOne(CompanySetting::class);
    }



}
