<?php

namespace Tests\Feature;

use App\Models\Advisor;
use App\Models\Appointment;
use App\Models\Calendar;
use App\Models\CalendarDay;
use App\Models\CalendarHour;
use App\Models\Client;
use App\Models\Company;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class AppointmentAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Company $company;

    private Advisor $advisor;

    private Client $client;

    private Service $service;

    private string $date;

    protected function setUp(): void
    {
        parent::setUp();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        Role::firstOrCreate(['name' => 'Super Usuario', 'guard_name' => 'web']);

        $this->user = User::factory()->create();
        $this->user->assignRole('Super Usuario');

        $this->company = Company::create([
            'name' => 'Empresa de prueba',
            'email' => 'empresa-'.uniqid().'@example.com',
        ]);

        $this->advisor = Advisor::create([
            'company_id' => $this->company->id,
            'user_id' => $this->user->id,
            'status' => true,
        ]);

        $this->client = Client::create([
            'company_id' => $this->company->id,
            'name' => 'Cliente de prueba',
            'status' => true,
        ]);

        $this->service = Service::create([
            'company_id' => $this->company->id,
            'name' => 'Servicio de prueba',
            'duration' => 60,
            'price' => 100,
            'status' => true,
        ]);

        $this->date = CarbonImmutable::today()->next('Monday')->format('Y-m-d');

        $calendar = Calendar::create([
            'company_id' => $this->company->id,
            'advisor_id' => $this->advisor->id,
            'status' => true,
        ]);

        $day = CalendarDay::create([
            'calendar_id' => $calendar->id,
            'day' => strtolower(CarbonImmutable::parse($this->date)->format('l')),
            'status' => true,
        ]);

        CalendarHour::create([
            'calendar_day_id' => $day->id,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'status' => true,
        ]);
    }

    public function test_it_rejects_an_appointment_that_does_not_fit_the_calendar_slot(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('11:30'));

        $response->assertSessionHasErrors('hour');
        $this->assertDatabaseCount('appointments', 0);
    }

    public function test_it_rejects_overlapping_appointments_for_the_same_advisor(): void
    {
        Appointment::create($this->appointmentData('10:00'));

        $response = $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('10:30'));

        $response->assertSessionHasErrors('hour');
        $this->assertDatabaseCount('appointments', 1);
    }

    public function test_it_allows_appointments_that_start_when_another_ends(): void
    {
        Appointment::create($this->appointmentData('10:00'));

        $response = $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('11:00'));

        $response->assertRedirect(route('appointments.index'));
        $this->assertDatabaseCount('appointments', 2);
    }

    public function test_it_ignores_cancelled_appointments_when_checking_conflicts(): void
    {
        Appointment::create($this->appointmentData('10:00', 'cancelled'));

        $response = $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('10:00'));

        $response->assertRedirect(route('appointments.index'));
        $this->assertDatabaseCount('appointments', 2);
    }

    public function test_it_allows_an_appointment_to_keep_its_current_slot_when_updated(): void
    {
        $appointment = Appointment::create($this->appointmentData('10:00'));

        $response = $this->actingAs($this->user)
            ->put(route('appointments.update', $appointment), $this->appointmentData('10:00'));

        $response->assertRedirect(route('appointments.index'));
        $this->assertDatabaseCount('appointments', 1);
    }

    public function test_it_rejects_an_updated_appointment_that_conflicts_with_another(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));
        Appointment::create($this->appointmentData('10:00'));

        $response = $this->actingAs($this->user)
            ->put(route('appointments.update', $appointment), $this->appointmentData('10:30'));

        $response->assertSessionHasErrors('hour');
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'hour' => '09:00',
        ]);
    }

    public function test_it_rejects_an_updated_appointment_outside_the_calendar_slot(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));

        $response = $this->actingAs($this->user)
            ->put(route('appointments.update', $appointment), $this->appointmentData('11:30'));

        $response->assertSessionHasErrors('hour');
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'hour' => '09:00',
        ]);
    }

    public function test_it_allows_a_cancelled_appointment_to_be_moved_outside_the_calendar(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));

        $response = $this->actingAs($this->user)
            ->put(
                route('appointments.update', $appointment),
                $this->appointmentData('11:30', 'cancelled')
            );

        $response->assertRedirect(route('appointments.index'));
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'hour' => '11:30',
            'status' => 'cancelled',
        ]);
    }

    public function test_it_does_not_apply_availability_rules_to_cancelled_appointments(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('11:30', 'cancelled'));

        $response->assertRedirect(route('appointments.index'));
        $this->assertDatabaseHas('appointments', [
            'hour' => '11:30',
            'status' => 'cancelled',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function appointmentData(string $hour, string $status = 'pending'): array
    {
        return [
            'company_id' => $this->company->id,
            'advisor_id' => $this->advisor->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'date' => $this->date,
            'hour' => $hour,
            'status' => $status,
        ];
    }
}
