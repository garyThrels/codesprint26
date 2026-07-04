<?php

namespace Database\Factories\Domain\Campaign\Models;

use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Throwable;

/**
 * @extends Factory<Campaign>
 */
class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'charity_id' => Charity::factory(),
            'name' => $this->faker->sentence(3),
            'tagline' => $this->faker->sentence(6),
            'description_html' => '<p>'.implode('</p><p>', $this->faker->paragraphs(3)).'</p>',
            'about_title' => 'About this Campaign',
            'goal_amount' => $this->faker->numberBetween(500000, 10000000), // stored in cents
            'currency_id' => Currency::factory(),
            'donation_presets' => [
                ['amount' => 2500, 'label' => 'Basic'],
                ['amount' => 5000, 'label' => 'Popular'],
                ['amount' => 10000, 'label' => 'Generous'],
            ],
            'preselected_index' => 2,
            'allow_custom_amount' => true,
            'status' => 'active',
            'expires_at' => now()->addMonths(3),
        ];
    }

    /**
     * Attach a hero image and gallery images from Picsum after the campaign is created.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Campaign $campaign): void {
            $seed = Str::slug($campaign->name) ?: (string) $campaign->id;

            try {
                $campaign->addMediaFromUrl("https://picsum.photos/seed/{$seed}/1200/675")
                    ->usingFileName("{$seed}-hero.jpg")
                    ->toMediaCollection('hero');

                foreach (range(1, 4) as $index) {
                    $campaign->addMediaFromUrl("https://picsum.photos/seed/{$seed}-{$index}/800/600")
                        ->usingFileName("{$seed}-gallery-{$index}.jpg")
                        ->toMediaCollection('gallery');
                }
            } catch (Throwable) {
                // Skip the images if Picsum is unreachable (e.g. offline seeding).
            }
        });
    }
}
