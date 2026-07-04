<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Donation\Models\Donation;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('super admin has full access', function () {
    $user = User::factory()->create();
    $user->assignRole('super-admin');

    $this->actingAs($user);

    $this->get(route('admin.users.index'))->assertOk();
    $this->get(route('admin.charities.index'))->assertOk();
    $this->get(route('admin.campaigns.index'))->assertOk();
    $this->get(route('admin.ledger.index'))->assertOk();
});

test('charity admin has restricted access', function () {
    $user = User::factory()->create();
    $user->assignRole('charity-admin');

    $this->actingAs($user);

    // Allowed
    $this->get(route('admin.charities.index'))->assertOk();
    $this->get(route('admin.campaigns.index'))->assertOk();
    $this->get(route('admin.ledger.index'))->assertOk();

    // Restricted
    $this->get(route('admin.users.index'))->assertForbidden();
    // Audit logs (assuming route exists)
    $this->get(route('admin.audit-log.index'))->assertForbidden();

    // Ledger actions (allowed now)
    $charity = Charity::factory()->create();
    $campaign = Campaign::factory()->create(['charity_id' => $charity->id]);
    $donation = Donation::factory()->create(['campaign_id' => $campaign->id]);

    $this->patch(route('admin.ledger.update', $donation), [])->assertRedirect(); // Should fail validation but not be 403
    $this->post(route('admin.ledger.send-receipt', $donation), [])->assertRedirect();
    $this->get(route('admin.ledger.reconciliation'))->assertOk();
});

test('volunteer has read-only access', function () {
    $user = User::factory()->create();
    $user->assignRole('volunteer');

    $charity = Charity::factory()->create();
    $campaign = Campaign::factory()->create(['charity_id' => $charity->id]);

    $this->actingAs($user);

    // Allowed views
    $this->get(route('admin.charities.index'))->assertOk();
    $this->get(route('admin.campaigns.index'))->assertOk();
    $this->get(route('admin.ledger.index'))->assertOk();

    // Restricted actions
    $this->get(route('admin.charities.create'))->assertForbidden();
    $this->get(route('admin.campaigns.create'))->assertForbidden();
    $this->post(route('admin.charities.store'), [])->assertForbidden();
    $this->delete(route('admin.campaigns.destroy', $campaign))->assertForbidden();

    // Restricted modules
    $this->get(route('admin.users.index'))->assertForbidden();
});

test('auditor has read-only access plus audit logs', function () {
    $user = User::factory()->create();
    $user->assignRole('auditor');

    $this->actingAs($user);

    // Allowed views
    $this->get(route('admin.charities.index'))->assertOk();
    $this->get(route('admin.campaigns.index'))->assertOk();
    $this->get(route('admin.ledger.index'))->assertOk();
    $this->get(route('admin.audit-log.index'))->assertOk();

    // Restricted management
    $this->get(route('admin.charities.create'))->assertForbidden();
    $this->get(route('admin.users.index'))->assertForbidden();
});
test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
