<?php

namespace Tests\Feature;

use App\Models\Advisor;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Company;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_report_keeps_full_summary_and_paginates_appointments(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('Super Usuario');

        $company = Company::create([
            'name' => 'Empresa de prueba',
            'email' => 'empresa-reporte@example.com',
        ]);
        $advisorUser = User::factory()->create(['company_id' => $company->id]);
        $advisor = Advisor::create([
            'company_id' => $company->id,
            'user_id' => $advisorUser->id,
        ]);
        $client = Client::create([
            'company_id' => $company->id,
            'name' => 'Cliente de prueba',
        ]);
        $service = Service::create([
            'company_id' => $company->id,
            'name' => 'Servicio de prueba',
        ]);

        for ($index = 0; $index < 16; $index++) {
            Appointment::create([
                'company_id' => $company->id,
                'advisor_id' => $advisor->id,
                'client_id' => $client->id,
                'service_id' => $service->id,
                'date' => now()->startOfMonth()->addDays($index % 28)->toDateString(),
                'hour' => '09:00',
                'status' => $index === 0 ? 'completed' : 'pending',
            ]);
        }

        $this->actingAs($user)
            ->get(route('reports.index', ['month' => now()->format('Y-m')]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reports/Index')
                ->where('summary.total', 16)
                ->where('summary.pending', 15)
                ->where('summary.completed', 1)
                ->has('appointments.data', 15)
                ->has('appointments.links', 4)
            );
    }
}
