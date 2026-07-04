<?php

namespace Database\Factories\Domain\Charity\Models;

use Domain\Charity\Models\Charity;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Throwable;

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

    /**
     * Attach a square logo image from Picsum after the charity is created.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Charity $charity): void {
            $seed = Str::slug($charity->name) ?: (string) $charity->id;

            try {
                $charity->addMediaFromUrl("https://picsum.photos/seed/{$seed}-logo/400/400")
                    ->usingFileName("{$seed}-logo.jpg")
                    ->toMediaCollection('logo');
            } catch (Throwable) {
                // Skip the logo if Picsum is unreachable (e.g. offline seeding).
            }
        });
    }
}
