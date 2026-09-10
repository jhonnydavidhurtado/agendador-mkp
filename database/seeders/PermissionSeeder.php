<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [

            // Dashboard
            'dashboard.view',

            // Empresas
            'companies.view',
            'companies.create',
            'companies.edit',
            'companies.delete',
            'manage companies',

            // Usuarios
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Asesores
            'advisors.view',
            'advisors.create',
            'advisors.edit',
            'advisors.delete',
            'manage advisors',

            // Clientes
            'clients.view',
            'clients.create',
            'clients.edit',
            'clients.delete',
            'manage clients',

            // Servicios
            'services.view',
            'services.create',
            'services.edit',
            'services.delete',

            // Calendarios
            'calendars.view',
            'calendars.create',
            'calendars.edit',
            'calendars.delete',
            'manage calendars',

            // Citas
            'appointments.view',
            'appointments.create',
            'appointments.edit',
            'appointments.delete',
            'manage appointments',

            // Configuración
            'settings.view',
            'settings.edit',

            // Roles
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            // Permisos
            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',

        ];

        foreach ($permissions as $permission) {

            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);

        }
    }
}