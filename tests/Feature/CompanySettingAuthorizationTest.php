<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CompanySettingAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_without_settings_permission_cannot_open_or_update_settings(): void
    {
        $company = $this->createCompany('empresa-sin-permiso@example.com');
        $user = User::factory()->create(['company_id' => $company->id]);

        $this->actingAs($user)
            ->get(route('settings.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->patch(route('settings.update'), $this->settingsData($company))
            ->assertForbidden();
    }

    public function test_view_permission_allows_read_only_settings_access(): void
    {
        $company = $this->createCompany('empresa-solo-lectura@example.com');
        $user = User::factory()->create(['company_id' => $company->id]);
        $user->givePermissionTo(
            Permission::firstOrCreate(['name' => 'settings.view', 'guard_name' => 'web'])
        );

        $this->actingAs($user)
            ->get(route('settings.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Settings/Index')
                ->where('canEdit', false)
                ->where('selectedCompany.id', $company->id)
            );

        $this->actingAs($user)
            ->patch(route('settings.update'), $this->settingsData($company))
            ->assertForbidden();
    }

    public function test_edit_permission_allows_updates_only_for_the_users_company(): void
    {
        $company = $this->createCompany('empresa-propia-settings@example.com');
        $otherCompany = $this->createCompany('empresa-ajena-settings@example.com');
        $user = User::factory()->create(['company_id' => $company->id]);
        $user->givePermissionTo(
            Permission::firstOrCreate(['name' => 'settings.edit', 'guard_name' => 'web'])
        );

        $this->actingAs($user)
            ->patch(route('settings.update'), $this->settingsData($otherCompany))
            ->assertForbidden();

        $this->actingAs($user)
            ->patch(route('settings.update'), $this->settingsData($company))
            ->assertRedirect(route('settings.index', ['company_id' => $company->id]));

        $this->assertDatabaseHas('company_settings', [
            'company_id' => $company->id,
            'primary_color' => '#123456',
        ]);
    }

    private function createCompany(string $email): Company
    {
        return Company::create([
            'name' => 'Empresa de configuración',
            'email' => $email,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function settingsData(Company $company): array
    {
        return [
            'company_id' => $company->id,
            'timezone' => 'America/Bogota',
            'currency' => 'COP',
            'language' => 'es',
            'appointment_interval' => 30,
            'start_week' => 'monday',
            'primary_color' => '#123456',
            'secondary_color' => '#654321',
            'notifications' => true,
        ];
    }
}
