<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests are redirected from the admin portal to login', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('users without admin access receive a 403', function () {
    $donor = User::factory()->create();
    $donor->assignRole('donor');

    $this->actingAs($donor)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('staff with access admin panel permission can enter the admin portal', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});

test('super-admin bypasses individual permission checks', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    expect($superAdmin->can('view audit log'))->toBeTrue()
        ->and($superAdmin->can('any undefined ability'))->toBeTrue();

    $this->actingAs($superAdmin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});

test('staff are redirected to the admin portal after login', function () {
    $admin = User::factory()->create(['password' => Hash::make('password')]);
    $admin->assignRole('manager');

    $this->post('/login', ['email' => $admin->email, 'password' => 'password'])
        ->assertRedirect(route('admin.dashboard'));
});

test('clients are redirected to the client dashboard after login', function () {
    $donor = User::factory()->create(['password' => Hash::make('password')]);
    $donor->assignRole('donor');

    $this->post('/login', ['email' => $donor->email, 'password' => 'password'])
        ->assertRedirect(route('dashboard'));
});
