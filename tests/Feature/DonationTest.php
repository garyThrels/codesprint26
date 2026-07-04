<?php

use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;

test('a donor can make a donation to a campaign', function () {
    $currency = Currency::factory()->create(['code' => 'EUR', 'symbol' => '€']);
    $charity = Charity::factory()->create();
    $campaign = Campaign::factory()->for($charity)->create([
        'status' => 'active',
        'currency_id' => $currency->id,
        'donation_presets' => [
            ['amount' => 1000, 'label' => 'Basic'],
            ['amount' => 2000, 'label' => 'Popular'],
            ['amount' => 5000, 'label' => 'Generous'],
        ],
    ]);

    $response = $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 2500, // €25.00
        'currencyId' => $currency->id,
        'paymentMethod' => 'tap',
        'donorName' => 'John Doe',
        'donorEmail' => 'john@example.com',
        'isAnonymous' => false,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('donations', [
        'campaign_id' => $campaign->id,
        'amount' => 2500,
        'donor_name' => 'John Doe',
        'status' => 'success',
    ]);
});

test('a declined manual payment is marked as failed and flashes an error', function () {
    $currency = Currency::factory()->create();
    $campaign = Campaign::factory()->create(['currency_id' => $currency->id]);

    $response = $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 1000,
        'currencyId' => $currency->id,
        'paymentMethod' => 'manual',
        'card' => [
            'cardNumber' => '0000', // simulated decline
            'expiryMonth' => '12',
            'expiryYear' => '30',
            'cvv' => '123',
        ],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');

    $donation = Donation::first();
    expect($donation->status->value)->toBe('failed');
});

test('a tap donation succeeds without a currency or card in the payload', function () {
    // Mirrors the real tap-to-pay request: the client sends neither a currency
    // (derived from the campaign) nor card details.
    $currency = Currency::factory()->create();
    $campaign = Campaign::factory()->create(['currency_id' => $currency->id]);

    $response = $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 1500,
        'paymentMethod' => 'tap',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
    $response->assertSessionHas('success');
    $response->assertSessionMissing('error');

    $donation = Donation::first();
    expect($donation->status->value)->toBe('success')
        ->and($donation->currency_id)->toBe($campaign->currency_id);
});

test('a donation is marked as successful when using tap', function () {
    $currency = Currency::factory()->create();
    $campaign = Campaign::factory()->create(['currency_id' => $currency->id]);

    $this->post(route('donations.store'), [
        'campaignId' => $campaign->id,
        'amount' => 1000,
        'currencyId' => $currency->id,
        'paymentMethod' => 'tap',
    ]);

    $donation = Donation::first();
    expect($donation->status->value)->toBe('success');
    expect($donation->mastercard_transaction_id)->not->toBeNull();
});
