<?php

namespace Database\Factories\Domain\Donation\Models;

use Domain\Campaign\Models\Campaign;
use Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Donation>
 */
class DonationFactory extends Factory
{
    protected $model = Donation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'amount' => $this->faker->numberBetween(500, 50000), // stored in cents
            'currency_id' => \Domain\Currency\Models\Currency::factory(),
            'status' => 'success',
            'payment_method' => 'tap',
            'mastercard_transaction_id' => $this->faker->uuid(),
            'donor_name' => $this->faker->name(),
            'donor_email' => $this->faker->safeEmail(),
            'is_anonymous' => false,
            'is_recurring' => false,
            'metadata' => [],
        ];
    }
}
