<?php

namespace Database\Factories;

use App\Models\Advisor;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Advisor>
 */
class AdvisorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'user_id' => User::factory(),
            'profession' => fake()->jobTitle(),
            'description' => fake()->optional()->sentence(),
            'status' => true,
        ];
    }
}
