<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Domain\Donation\Models\Donation;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('super-admin');
});

test('it displays the correct donor statistics', function () {
    // 1. Unique named donor
    Donation::factory()->create([
        'donor_name' => 'John Doe',
        'donor_email' => 'john@example.com',
        'is_anonymous' => false,
        'status' => 'success',
        'amount' => 1000,
    ]);

    // Same person, another donation
    Donation::factory()->create([
        'donor_name' => 'John Doe',
        'donor_email' => 'john@example.com',
        'is_anonymous' => false,
        'status' => 'success',
        'amount' => 2000,
    ]);

    // 2. Another unique named donor
    Donation::factory()->create([
        'donor_name' => 'Jane Smith',
        'donor_email' => 'jane@example.com',
        'is_anonymous' => false,
        'status' => 'success',
        'amount' => 5000,
    ]);

    // 3. Anonymous donor
    Donation::factory()->create([
        'is_anonymous' => true,
        'status' => 'success',
        'amount' => 3000,
    ]);

    // 4. Another anonymous donor
    Donation::factory()->create([
        'is_anonymous' => true,
        'status' => 'success',
        'amount' => 4000,
    ]);

    // 5. A pending donation (should not be counted)
    Donation::factory()->create([
        'status' => 'pending',
        'amount' => 10000,
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats', fn (Assert $stats) => $stats
                ->where('totalRaised', 150) // 10+20+50+30+40 = 150
                ->where('totalDonations', 5)
                ->where('uniqueNamedDonors', 2)
                ->where('anonymousDonors', 2)
                ->where('averageDonation', 30) // 150 / 5
            )
        );
});
