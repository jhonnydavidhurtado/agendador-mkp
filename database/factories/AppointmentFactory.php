<?php

namespace Database\Factories;

use App\Models\Advisor;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Company;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'advisor_id' => fn (array $attributes) => Advisor::factory()
                ->create(['company_id' => $attributes['company_id']])
                ->id,
            'client_id' => fn (array $attributes) => Client::factory()
                ->create(['company_id' => $attributes['company_id']])
                ->id,
            'service_id' => fn (array $attributes) => Service::factory()
                ->create(['company_id' => $attributes['company_id']])
                ->id,
            'date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'hour' => fake()->time('H:i'),
            'status' => 'pending',
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}
