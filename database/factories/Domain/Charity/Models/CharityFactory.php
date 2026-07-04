<?php

namespace Database\Factories\Domain\Charity\Models;

use Domain\Charity\Models\Charity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Charity>
 */
class CharityFactory extends Factory
{
    protected $model = Charity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'slogan' => $this->faker->catchPhrase(),
            'brand_color' => $this->faker->hexColor(),
            'surface_tint' => $this->faker->randomElement(['warm', 'cool', 'neutral']),
            'description' => $this->faker->paragraph(),
        ];
    }
}
