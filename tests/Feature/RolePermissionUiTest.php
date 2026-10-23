<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RolePermissionUiTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_user_can_access_roles_and_permissions_pages(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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

    public function test_sidebar_navigation_matches_super_user_access(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/notifications')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.navigation.companies', true)
                ->where('auth.navigation.advisors', true)
                ->where('auth.navigation.clients', true)
                ->where('auth.navigation.services', true)
                ->where('auth.navigation.calendars', true)
                ->where('auth.navigation.appointments', true)
                ->where('auth.navigation.reports', true)
                ->where('auth.navigation.systemAdmin', true)
                ->where('auth.navigation.settings', true)
            );
    }

    public function test_sidebar_hides_restricted_links_from_regular_users(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/notifications')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.navigation.companies', false)
                ->where('auth.navigation.advisors', false)
                ->where('auth.navigation.clients', false)
                ->where('auth.navigation.services', false)
                ->where('auth.navigation.calendars', false)
                ->where('auth.navigation.appointments', false)
                ->where('auth.navigation.reports', false)
                ->where('auth.navigation.systemAdmin', false)
                ->where('auth.navigation.settings', false)
            );
    }

    public function test_sidebar_shows_links_for_individual_permissions_and_manager_role(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        Permission::firstOrCreate(['name' => 'manage clients', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage appointments', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->givePermissionTo(['manage clients', 'manage appointments']);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->get('/notifications')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.navigation.clients', true)
                ->where('auth.navigation.appointments', true)
                ->where('auth.navigation.reports', true)
                ->where('auth.navigation.services', true)
                ->where('auth.navigation.systemAdmin', false)
                ->where('auth.navigation.settings', false)
            );
    }

    public function test_super_user_can_access_users_page_and_assign_role(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'dev', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $targetUser = User::factory()->create();

        $this->actingAs($user)
            ->get('/users')
            ->assertOk();

        $this->actingAs($user)
            ->patch('/users/'.$targetUser->id.'/role', [
                'role' => 'dev',
            ])
            ->assertRedirect();

        $this->assertTrue($targetUser->fresh()->hasRole('dev'));
    }

    public function test_super_user_can_access_permission_protected_pages_without_direct_permissions(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/reports')
            ->assertOk();
    }

    public function test_super_user_can_access_appointments_management_page(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/appointments')
            ->assertOk();
    }

    public function test_super_user_can_access_and_update_company_settings(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $this->actingAs($user)
            ->get('/settings')
            ->assertOk();
    }
}
