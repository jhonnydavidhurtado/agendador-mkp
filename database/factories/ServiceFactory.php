<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'duration' => fake()->randomElement([15, 30, 45, 60, 90, 120]),
            'price' => fake()->randomFloat(2, 0, 1000),
            'color' => fake()->hexColor(),
            'status' => true,
        ];
    }
}
