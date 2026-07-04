<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Models\Donation;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole('charity-admin');

    $currency = Currency::factory()->create();
    $charity = Charity::factory()->create();
    $campaign = Campaign::factory()->for($charity)->create(['currency_id' => $currency->id]);

    Donation::factory()->for($campaign)->create([
        'status' => 'success',
        'mastercard_transaction_id' => 'sim_man_ABC123',
        'donor_name' => 'Jane Donor',
    ]);
});

test('the transaction ledger loads for an admin', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index'))
        ->assertOk();
});

test('the ledger can be searched by the mastercard transaction id', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['search' => 'sim_man_ABC123']))
        ->assertOk();
});

test('search combined with a status filter does not leak other statuses', function () {
    $currency = Currency::first();
    $campaign = Campaign::first();

    // A failed donation whose donor name matches the search term. It must be
    // excluded when the status filter is set to "success".
    Donation::factory()->for($campaign)->create([
        'status' => 'failed',
        'donor_name' => 'Jane Donor',
        'mastercard_transaction_id' => 'sim_fail_XYZ789',
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['search' => 'Jane Donor', 'status' => 'success']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));
});

test('the ledger can be filtered by date range', function () {
    Donation::query()->delete();
    $campaign = Campaign::first();

    // Create an old donation
    Donation::factory()->for($campaign)->create([
        'created_at' => now()->subDays(10),
    ]);

    // Create a new donation
    Donation::factory()->for($campaign)->create([
        'created_at' => now(),
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', [
            'date_from' => now()->subDays(1)->toDateString(),
            'date_to' => now()->addDays(1)->toDateString(),
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));
});

test('the ledger can be filtered by campaign', function () {
    Donation::query()->delete();
    $otherCampaign = Campaign::factory()->create();
    Donation::factory()->for($otherCampaign)->create();

    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['campaign_id' => $otherCampaign->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));
});

test('the ledger can be filtered by amount', function () {
    Donation::query()->delete();
    $campaign = Campaign::first();

    Donation::factory()->for($campaign)->create(['amount' => 1000]); // 10.00 EUR
    Donation::factory()->for($campaign)->create(['amount' => 2000]); // 20.00 EUR
    Donation::factory()->for($campaign)->create(['amount' => 3000]); // 30.00 EUR

    // Greater than 15.00 EUR (20 and 30)
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['amount' => 15, 'amount_operator' => 'gt']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 2));

    // Less than 25.00 EUR (10 and 20)
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['amount' => 25, 'amount_operator' => 'lt']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 2));

    // Equal to 20.00 EUR
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['amount' => 20, 'amount_operator' => 'eq']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));

    // Test with different currencies
    Donation::query()->delete();
    $usdCurrency = Currency::factory()->create(['code' => 'USD', 'symbol' => '$']);
    
    // 50 USD ($), but worth 40 EUR (€)
    Donation::factory()->for($campaign)->create([
        'amount' => 5000,
        'amount_in_base_currency' => 4000,
        'currency_id' => $usdCurrency->id,
    ]);

    // Filter by 40 EUR - should match
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['amount' => 40, 'amount_operator' => 'eq']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));

    // Filter by 50 EUR - should NOT match (even though original amount was 50 USD)
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.index', ['amount' => 50, 'amount_operator' => 'eq']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 0));
});

test('the reconciliation view loads for an admin', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.reconciliation'))
        ->assertOk();
});

test('the ledger can be exported to csv', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.export'))
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=utf-8');
});

test('exported ledger respects filters', function () {
    Donation::query()->delete();
    $campaign = Campaign::first();

    Donation::factory()->for($campaign)->create([
        'status' => 'success',
        'donor_name' => 'Success Donor',
        'amount' => 1000,
        'created_at' => now(),
    ]);

    Donation::factory()->for($campaign)->create([
        'status' => 'failed',
        'donor_name' => 'Failed Donor',
        'amount' => 2000,
        'created_at' => now(),
    ]);

    Donation::factory()->for($campaign)->create([
        'status' => 'success',
        'donor_name' => 'Old Donor',
        'amount' => 3000,
        'created_at' => now()->subDays(10),
    ]);

    // Filter by status
    $response = $this->actingAs($this->admin)
        ->get(route('admin.ledger.export', ['status' => 'success']));
    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Success Donor')
        ->toContain('Old Donor')
        ->not->toContain('Failed Donor');

    // Filter by date
    $response = $this->actingAs($this->admin)
        ->get(route('admin.ledger.export', [
            'date_from' => now()->subDays(1)->toDateString(),
            'date_to' => now()->addDays(1)->toDateString(),
        ]));
    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Success Donor')
        ->toContain('Failed Donor')
        ->not->toContain('Old Donor');

    // Filter by amount
    $response = $this->actingAs($this->admin)
        ->get(route('admin.ledger.export', ['amount' => 15, 'amount_operator' => 'gt']));
    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Failed Donor')
        ->toContain('Old Donor')
        ->not->toContain('Success Donor');
});
