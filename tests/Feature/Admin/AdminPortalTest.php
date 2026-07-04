<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests are redirected from the admin portal to login', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('users without admin access receive a 403', function () {
    $user = User::factory()->create();
    // No roles assigned

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('staff with access admin panel permission can enter the admin portal', function () {
    $admin = User::factory()->create();
    $admin->assignRole('charity-admin');

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
    $admin->assignRole('charity-admin');

    $this->post('/login', ['email' => $admin->email, 'password' => 'password'])
        ->assertRedirect(route('admin.dashboard'));
});

test('clients are redirected to the public home page after login', function () {
    $user = User::factory()->create(['password' => Hash::make('password')]);
    // No special admin role

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('home'));
});
