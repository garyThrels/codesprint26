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

test('the reconciliation view loads for an admin', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.ledger.reconciliation'))
        ->assertOk();
});
