<?php

namespace Database\Seeders;

use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;
use Illuminate\Database\Seeder;

final class CharityCampaignSeeder extends Seeder
{
    public function run(): void
    {
        $eur = Currency::where('code', 'EUR')->firstOrFail();

        Charity::factory(3)
            ->has(
                Campaign::factory(2)
                    ->state(fn (array $attributes, Charity $charity): array => [
                        'currency_id' => $eur->id,
                    ])
                    ->has(
                        Donation::factory(10)
                            ->state(fn (array $attributes, Campaign $campaign): array => [
                                'currency_id' => $eur->id,
                            ])
                    )
            )
            ->create();
    }
}
