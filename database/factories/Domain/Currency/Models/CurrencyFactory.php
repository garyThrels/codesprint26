<?php

namespace Database\Factories\Domain\Currency\Models;

use Domain\Currency\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Currency>
 */
class CurrencyFactory extends Factory
{
    protected $model = Currency::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->currencyCode(),
            'name' => $this->faker->word(),
            'symbol' => '€',
            'exchange_rate' => 1.0,
            'is_active' => true,
        ];
    }
}
