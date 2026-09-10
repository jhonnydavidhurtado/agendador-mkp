<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolePermissionUiTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_user_can_access_roles_and_permissions_pages(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name' => 'manage companies', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage roles', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage permissions', 'guard_name' => 'web']);

        $role = Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);
        $role->syncPermissions(['manage companies', 'manage roles', 'manage permissions']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/roles')
            ->assertOk();

        $this->actingAs($user)
            ->get('/permissions')
            ->assertOk();
    }

    public function test_super_user_can_access_users_page_and_assign_role(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'dev', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $targetUser = User::factory()->create();

        $this->actingAs($user)
            ->get('/users')
            ->assertOk();

        $this->actingAs($user)
            ->patch('/users/' . $targetUser->id . '/role', [
                'role' => 'dev',
            ])
            ->assertRedirect();

        $this->assertTrue($targetUser->fresh()->hasRole('dev'));
    }

    public function test_super_user_can_access_permission_protected_pages_without_direct_permissions(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage companies', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/companies')
            ->assertOk();
    }

    public function test_super_user_can_access_reports_page(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/reports')
            ->assertOk();
    }

    public function test_super_user_can_access_appointments_management_page(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/appointments')
            ->assertOk();
    }

    public function test_super_user_can_access_and_update_company_settings(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');
        $company = Company::create([
            'name' => 'Empresa de prueba',
            'email' => 'empresa-prueba@example.com',
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->get('/settings')
            ->assertOk();

        $this->actingAs($user)
            ->patch('/settings', [
                'company_id' => $company->id,
                'timezone' => 'America/Bogota',
                'currency' => 'COP',
                'language' => 'es',
                'appointment_interval' => 60,
                'start_week' => 'monday',
                'primary_color' => '#123456',
                'secondary_color' => '#654321',
                'notifications' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('company_settings', [
            'company_id' => $company->id,
            'appointment_interval' => 60,
            'primary_color' => '#123456',
        ]);
    }

    public function test_super_user_can_open_settings_without_companies(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/settings')
            ->assertOk();
    }
}
