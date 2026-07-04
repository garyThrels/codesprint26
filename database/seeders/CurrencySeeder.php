<?php

namespace Database\Seeders;

use Domain\Currency\Models\Currency;
use Illuminate\Database\Seeder;

final class CurrencySeeder extends Seeder
{
    /**
     * Currencies to seed, keyed by ISO code. Rates are expressed relative to EUR.
     *
     * @var array<string, array{name: string, symbol: string, exchange_rate: float}>
     */
    private const array CURRENCIES = [
        'EUR' => ['name' => 'Euro', 'symbol' => '€', 'exchange_rate' => 1.0],
        'USD' => ['name' => 'US Dollar', 'symbol' => '$', 'exchange_rate' => 0.92],
        'GBP' => ['name' => 'British Pound', 'symbol' => '£', 'exchange_rate' => 1.18],
    ];

    public function run(): void
    {
        foreach (self::CURRENCIES as $code => $attributes) {
            Currency::updateOrCreate(['code' => $code], $attributes);
        }
    }
}
