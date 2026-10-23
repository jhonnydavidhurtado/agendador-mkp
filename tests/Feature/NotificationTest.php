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
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class NotificationTest extends TestCase
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
            'name' => 'Empresa de notificaciones',
            'email' => 'notificaciones@example.com',
        ]);
        $this->advisor = Advisor::create([
            'company_id' => $this->company->id,
            'user_id' => $this->user->id,
        ]);
        $this->client = Client::create([
            'company_id' => $this->company->id,
            'name' => 'Cliente de prueba',
        ]);
        $this->service = Service::create([
            'company_id' => $this->company->id,
            'name' => 'Servicio de prueba',
            'duration' => 30,
        ]);

        $this->date = CarbonImmutable::today()->next('Monday')->format('Y-m-d');
        $calendar = Calendar::create([
            'company_id' => $this->company->id,
            'advisor_id' => $this->advisor->id,
        ]);
        $day = CalendarDay::create([
            'calendar_id' => $calendar->id,
            'day' => strtolower(CarbonImmutable::parse($this->date)->format('l')),
        ]);
        CalendarHour::create([
            'calendar_day_id' => $day->id,
            'start_time' => '09:00',
            'end_time' => '12:00',
        ]);
    }

    public function test_creating_an_appointment_notifies_its_advisor(): void
    {
        $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('09:00'))
            ->assertRedirect(route('appointments.index'));

        $notification = $this->user->notifications()->firstOrFail();

        $this->assertSame('created', $notification->data['event']);
        $this->assertSame('Se creó una nueva cita.', $notification->data['message']);
        $this->assertSame('Cliente de prueba', $notification->data['client']);
    }

    public function test_updating_an_appointment_notifies_its_advisor(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));

        $this->actingAs($this->user)
            ->put(route('appointments.update', $appointment), $this->appointmentData('10:00'))
            ->assertRedirect(route('appointments.index'));

        $notification = $this->user->notifications()->firstOrFail();

        $this->assertSame('updated', $notification->data['event']);
        $this->assertSame('10:00', $notification->data['hour']);
    }

    public function test_cancelling_an_appointment_sends_a_cancellation_notification(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));

        $this->actingAs($this->user)
            ->put(
                route('appointments.update', $appointment),
                $this->appointmentData('09:00', 'cancelled')
            )
            ->assertRedirect(route('appointments.index'));

        $this->assertSame(
            'cancelled',
            $this->user->notifications()->firstOrFail()->data['event']
        );
    }

    public function test_deleting_an_appointment_saves_a_notification_snapshot(): void
    {
        $appointment = Appointment::create($this->appointmentData('09:00'));

        $this->actingAs($this->user)
            ->delete(route('appointments.destroy', $appointment))
            ->assertRedirect(route('appointments.index'));

        $notification = $this->user->notifications()->firstOrFail();

        $this->assertSame('deleted', $notification->data['event']);
        $this->assertSame('Cliente de prueba', $notification->data['client']);
        $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
    }

    public function test_notification_page_shares_unread_count_and_mark_as_read_updates_it(): void
    {
        $this->actingAs($this->user)
            ->post(route('appointments.store'), $this->appointmentData('09:00'));

        $notification = $this->user->notifications()->firstOrFail();

        $this->actingAs($this->user)
            ->get(route('notifications.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Notifications/Index')
                ->where('unreadCount', 1)
                ->where('unreadNotificationsCount', 1)
            );

        $this->actingAs($this->user)
            ->patch(route('notifications.read', $notification->id))
            ->assertRedirect();

        $this->actingAs($this->user)
            ->get(route('notifications.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('unreadCount', 0)
                ->where('unreadNotificationsCount', 0)
            );
    }

    public function test_users_cannot_mark_another_users_notification_as_read(): void
    {
        $notification = $this->user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'test',
            'data' => ['message' => 'Private notification'],
        ]);
        $otherUser = User::factory()->create();

        $this->actingAs($otherUser)
            ->patch(route('notifications.read', $notification->id))
            ->assertNotFound();

        $this->assertNull($notification->fresh()->read_at);
    }

    public function test_all_unread_notifications_can_be_marked_as_read(): void
    {
        foreach (['Primera notificación', 'Segunda notificación'] as $message) {
            $this->user->notifications()->create([
                'id' => Str::uuid()->toString(),
                'type' => 'test',
                'data' => ['message' => $message],
            ]);
        }

        $this->actingAs($this->user)
            ->patch(route('notifications.readAll'))
            ->assertRedirect();

        $this->assertSame(0, $this->user->unreadNotifications()->count());
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
