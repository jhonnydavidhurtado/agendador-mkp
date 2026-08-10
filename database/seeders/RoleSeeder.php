<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Crear Roles
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::firstOrCreate([
            'name' => 'Super Admin',
            'guard_name' => 'web',
        ]);

        $admin = Role::firstOrCreate([
            'name' => 'Administrador',
            'guard_name' => 'web',
        ]);

        $advisor = Role::firstOrCreate([
            'name' => 'Asesor',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Super Admin
        | Tiene todos los permisos
        |--------------------------------------------------------------------------
        */

        $superAdmin->syncPermissions(
            Permission::all()
        );

        /*
        |--------------------------------------------------------------------------
        | Administrador
        |--------------------------------------------------------------------------
        */

        $admin->syncPermissions([

            // Dashboard
            'dashboard.view',

            // Empresas
            'companies.view',
            'companies.create',
            'companies.edit',
            'companies.delete',

           
            // Usuarios
            'users.view',
            'users.create',
            'users.edit',
           

            // Asesores
            'advisors.view',
            'advisors.create',
            'advisors.edit',
            'advisors.delete',

            // Clientes
            'clients.view',
            'clients.create',
            'clients.edit',
            'clients.delete',

            // Servicios
            'services.view',
            'services.create',
            'services.edit',
            'services.delete',

            // Calendarios
            'calendars.view',
            'calendars.create',
            'calendars.edit',

            // Citas
            'appointments.view',
            'appointments.create',
            'appointments.edit',
            'appointments.delete',

            // Configuración
            'settings.view',
            'settings.edit',

        ]);

        /*
        |--------------------------------------------------------------------------
        | Asesor
        |--------------------------------------------------------------------------
        */

        $advisor->syncPermissions([

            'dashboard.view',

            'appointments.view',
            'appointments.create',
            'appointments.edit',

            'clients.view',

            'services.view',

            'calendars.view',
            'calendars.edit',

        ]);
    }
}