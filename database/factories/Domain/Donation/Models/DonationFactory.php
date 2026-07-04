<?php

namespace Database\Factories\Domain\Donation\Models;

use Domain\Campaign\Models\Campaign;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Donation>
 */
class DonationFactory extends Factory
{
    protected $model = Donation::class;

    /**
     * Default the base-currency amount to the donation amount (assumes the base
     * currency / 1.0 rate) unless a test sets it explicitly. Keeps aggregate
     * stats that sum `amount_in_base_currency` correct for factory data.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Donation $donation): void {
            if (empty($donation->amount_in_base_currency)) {
                $donation->amount_in_base_currency = $donation->amount;
            }
        });
    }

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
            'currency_id' => Currency::factory(),
            'status' => 'success',
            'payment_method' => 'tap',
            'mastercard_transaction_id' => $this->faker->uuid(),
            'donor_name' => $this->faker->name(),
            'donor_email' => $this->faker->safeEmail(),
            'is_anonymous' => false,
            'is_recurring' => false,
            'gift_aid_enabled' => false,
            'gift_aid_name' => null,
            'gift_aid_address' => null,
            'gift_aid_amount' => 0,
            'total_benefit_amount' => 0,
            'round_up' => false,
            'metadata' => [],
        ];
    }

    public function giftAid(): static
    {
        return $this->state(fn (array $attributes) => [
            'gift_aid_enabled' => true,
            'gift_aid_name' => $this->faker->name(),
            'gift_aid_address' => $this->faker->address(),
            'gift_aid_amount' => (int) round($attributes['amount'] * 0.25),
            'total_benefit_amount' => (int) round($attributes['amount'] * 1.25),
        ]);
    }
}
