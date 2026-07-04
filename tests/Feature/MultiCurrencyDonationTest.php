<?php

use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;

test('a donation in a different currency is correctly converted to base currency', function () {
    $eur = Currency::factory()->create(['code' => 'EUR', 'symbol' => '€', 'exchange_rate' => 1.0]);
    $usd = Currency::factory()->create(['code' => 'USD', 'symbol' => '$', 'exchange_rate' => 0.92]); // 1 USD = 0.92 EUR

    $charity = Charity::factory()->create();
    $charity->currencies()->attach([$eur->id, $usd->id]);

    $campaign = Campaign::factory()->for($charity)->create([
        'status' => 'active',
        'currency_id' => $eur->id,
    ]);

    $response = $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 10000, // $100.00
        'currencyId' => $usd->id,
        'paymentMethod' => 'tap',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('donations', [
        'campaign_id' => $campaign->id,
        'amount' => 10000,
        'currency_id' => $usd->id,
        'amount_in_base_currency' => 9200, // 10000 * 0.92
    ]);
});

test('a donation defaults to campaign currency if selected currency is not supported by charity', function () {
    $eur = Currency::factory()->create(['code' => 'EUR', 'symbol' => '€', 'exchange_rate' => 1.0]);
    $usd = Currency::factory()->create(['code' => 'USD', 'symbol' => '$', 'exchange_rate' => 0.92]);
    $gbp = Currency::factory()->create(['code' => 'GBP', 'symbol' => '£', 'exchange_rate' => 1.18]);

    $charity = Charity::factory()->create();
    $charity->currencies()->attach([$eur->id]); // Charity ONLY supports EUR

    $campaign = Campaign::factory()->for($charity)->create([
        'status' => 'active',
        'currency_id' => $eur->id,
    ]);

    // Try to donate in GBP (not supported)
    $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 1000,
        'currencyId' => $gbp->id,
        'paymentMethod' => 'tap',
    ]);

    $donation = Donation::first();
    expect($donation->currency_id)->toBe($eur->id); // Fell back to campaign currency
});
