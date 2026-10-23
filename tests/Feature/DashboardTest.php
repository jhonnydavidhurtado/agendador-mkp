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
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_today_summary_and_appointments_for_the_users_company(): void
    {
        $company = Company::create([
            'name' => 'Empresa propia',
            'email' => 'empresa-propia@example.com',
        ]);
        $otherCompany = Company::create([
            'name' => 'Otra empresa',
            'email' => 'otra-empresa@example.com',
        ]);

        $user = User::factory()->create([
            'company_id' => $company->id,
            'email_verified_at' => now(),
        ]);
        $appointment = $this->createAppointment($company, 'pending', now()->toDateString(), '10:00');
        $this->createAppointment($company, 'confirmed', now()->toDateString(), '09:00');
        $this->createAppointment($company, 'completed', now()->subDay()->toDateString(), '08:00');
        $this->createAppointment($otherCompany, 'confirmed', now()->toDateString(), '11:00');

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('summary.total', 2)
                ->where('summary.pending', 1)
                ->where('summary.confirmed', 1)
                ->where('summary.completed', 0)
                ->where('appointments.0.hour', '09:00')
                ->where('appointments.1.id', $appointment->id)
                ->has('appointments', 2)
            );
    }

    private function createAppointment(
        Company $company,
        string $status,
        string $date,
        string $hour
    ): Appointment {
        $advisorUser = User::factory()->create(['company_id' => $company->id]);
        $advisor = Advisor::create([
            'company_id' => $company->id,
            'user_id' => $advisorUser->id,
        ]);
        $client = Client::create([
            'company_id' => $company->id,
            'name' => 'Cliente',
        ]);
        $service = Service::create([
            'company_id' => $company->id,
            'name' => 'Servicio',
        ]);

        return Appointment::create([
            'company_id' => $company->id,
            'advisor_id' => $advisor->id,
            'client_id' => $client->id,
            'service_id' => $service->id,
            'date' => $date,
            'hour' => $hour,
            'status' => $status,
        ]);
    }
}
