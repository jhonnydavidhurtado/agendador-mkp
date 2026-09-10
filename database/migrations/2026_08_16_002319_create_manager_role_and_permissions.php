<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage companies',
            'manage advisors',
            'manage calendars',
            'manage clients',
            'manage appointments',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $manager = Role::firstOrCreate([
            'name' => 'Manager',
            'guard_name' => 'web',
        ]);

        $manager->syncPermissions($permissions);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $manager = Role::where('name', 'Manager')
            ->where('guard_name', 'web')
            ->first();

        if ($manager) {
            $manager->syncPermissions([]);
            $manager->delete();
        }

        Permission::whereIn('name', [
            'manage companies',
            'manage advisors',
            'manage calendars',
            'manage clients',
            'manage appointments',
        ])
        ->where('guard_name', 'web')
        ->delete();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
};