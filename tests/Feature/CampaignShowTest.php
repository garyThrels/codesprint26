<?php

use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;

test('the show page counts anonymous (no-email) donations toward the donor count', function () {
    $currency = Currency::factory()->create();
    $charity = Charity::factory()->create();
    $campaign = Campaign::factory()->for($charity)->create([
        'status' => 'active',
        'currency_id' => $currency->id,
    ]);

    // Anonymous tap donations have no donor_email — the previous
    // COUNT(distinct donor_email) ignored these and never moved the count.
    Donation::factory()->count(3)->for($campaign)->create([
        'status' => 'success',
        'donor_email' => null,
        'amount' => 1000,
    ]);

    // A failed donation must not be counted.
    Donation::factory()->for($campaign)->create([
        'status' => 'failed',
        'amount' => 5000,
    ]);

    $this->get(route('campaigns.show', $campaign))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('campaign.donor_count', 3)
            ->where('campaign.raised_amount', 3000)
        );
});
