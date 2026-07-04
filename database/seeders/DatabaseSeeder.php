<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Currency\Models\Currency;
use Domain\Charity\Models\Charity;
use Domain\Campaign\Models\Campaign;
use Domain\Donation\Models\Donation;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            UserSeeder::class,
        ]);

        $eur = Currency::create([
            'code' => 'EUR',
            'name' => 'Euro',
            'symbol' => '€',
            'exchange_rate' => 1.0,
        ]);

        Currency::create([
            'code' => 'USD',
            'name' => 'US Dollar',
            'symbol' => '$',
            'exchange_rate' => 0.92,
        ]);

        Currency::create([
            'code' => 'GBP',
            'name' => 'British Pound',
            'symbol' => '£',
            'exchange_rate' => 1.18,
        ]);

        Charity::factory(3)
            ->has(
                Campaign::factory(2)
                    ->state(fn (array $attributes, Charity $charity) => [
                        'currency_id' => $eur->id,
                    ])
                    ->afterCreating(function (Campaign $campaign) {
                        try {
                            $campaign->addMediaFromUrl('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')
                                ->toMediaCollection('hero', 'public');
                            
                            for ($i = 0; $i < 4; $i++) {
                                $campaign->addMediaFromUrl('https://images.unsplash.com/photo-1459183885447-fe8c43338aba?q=80&w=2070&auto=format&fit=crop')
                                    ->toMediaCollection('gallery', 'public');
                            }
                        } catch (\Exception $e) {
                            // Skip if external URL is down
                        }
                    })
                    ->has(
                        Donation::factory(10)
                            ->state(fn (array $attributes, Campaign $campaign) => [
                                'currency_id' => $eur->id,
                            ])
                    )
            )
            ->afterCreating(function (Charity $charity) {
                try {
                    $charity->addMediaFromUrl('https://ui-avatars.com/api/?name=' . urlencode($charity->name) . '&background=random&size=512')
                        ->toMediaCollection('logo', 'public');
                } catch (\Exception $e) {
                    // Skip if external URL is down
                }
            })
            ->create();
    }
}
