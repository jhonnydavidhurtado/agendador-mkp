<?php

namespace Tests\Feature;

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelFactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_appointment_factory_creates_consistent_related_models(): void
    {
        $appointment = Appointment::factory()->create();

        $this->assertNotNull($appointment->company);
        $this->assertNotNull($appointment->advisor);
        $this->assertNotNull($appointment->client);
        $this->assertNotNull($appointment->service);
        $this->assertSame($appointment->company_id, $appointment->advisor->company_id);
        $this->assertSame($appointment->company_id, $appointment->client->company_id);
        $this->assertSame($appointment->company_id, $appointment->service->company_id);
        $this->assertSame('pending', $appointment->status);
    }

    public function test_appointment_factory_supports_all_non_default_statuses(): void
    {
        $this->assertSame(
            'confirmed',
            Appointment::factory()->confirmed()->create()->status
        );
        $this->assertSame(
            'completed',
            Appointment::factory()->completed()->create()->status
        );
        $this->assertSame(
            'cancelled',
            Appointment::factory()->cancelled()->create()->status
        );
    }
}
