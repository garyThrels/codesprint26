<?php

use Domain\Donation\Models\Donation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can update donation details', function () {
    $donation = Donation::factory()->create([
        'donor_name' => 'Original Name',
        'gift_aid_enabled' => false,
        'amount' => 10000, // €100
    ]);

    $response = $this->patch(route('donations.update', $donation), [
        'donor_name' => 'Updated Name',
        'gift_aid_enabled' => true,
        'gift_aid_name' => 'Updated Name',
        'gift_aid_address' => '123 Test St',
    ]);

    $response->assertRedirect();

    $donation->refresh();
    expect($donation->donor_name)->toBe('Updated Name')
        ->and($donation->gift_aid_enabled)->toBeTrue()
        ->and($donation->gift_aid_amount)->toBe(2500)
        ->and($donation->total_benefit_amount)->toBe(12500);
});
