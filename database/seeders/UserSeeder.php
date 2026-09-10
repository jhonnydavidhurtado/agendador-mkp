<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        */

        $superAdmin = User::firstOrCreate(

            [
                'email' => 'admin@mkp.com',
            ],

            [
                'name' => 'JHONNY DAVID',
                'password' => Hash::make('12345678'),
                'status' => true,
            ]

        );

        $superAdmin->assignRole('Super Usuario');


        /*
        |--------------------------------------------------------------------------
        | Administrador
        |--------------------------------------------------------------------------
        */

        $admin = User::firstOrCreate(

            [
                'email' => 'juan@mkp.com',
            ],

            [
                'name' => 'JUAN CAMILO',
                'password' => Hash::make('12345678'),
                'status' => true,
            ]

        );

        $admin->assignRole('Administrador');
    }
}