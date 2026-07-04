<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin can see user listing', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $users = User::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/users/index')
            ->has('users', 4) // Admin + 3 users
        );
});

test('admin can create a user and assign roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'New Staff',
            'email' => 'staff@example.com',
            'password' => 'password123',
            'roles' => ['charity-admin'],
        ])
        ->assertRedirect(route('admin.users.index'));

    $user = User::where('email', 'staff@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('New Staff')
        ->and($user->hasRole('charity-admin'))->toBeTrue();
});

test('admin can update a user (not self)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $user = User::factory()->create();
    $user->assignRole('volunteer');

    $this->actingAs($admin)
        ->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'roles' => ['charity-admin'],
        ])
        ->assertRedirect(route('admin.users.index'));

    $user->refresh();
    expect($user->name)->toBe('Updated Name')
        ->and($user->email)->toBe('updated@example.com')
        ->and($user->hasRole('charity-admin'))->toBeTrue()
        ->and($user->hasRole('volunteer'))->toBeFalse();
});

test('admin cannot update self from user management listing', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $this->actingAs($admin)
        ->put(route('admin.users.update', $admin), [
            'name' => 'Trying to update self',
            'email' => $admin->email,
            'roles' => ['volunteer'],
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('error', 'You cannot modify your own roles from this screen.');

    $admin->refresh();
    expect($admin->name)->not->toBe('Trying to update self')
        ->and($admin->hasRole('super-admin'))->toBeTrue();
});

test('admin can delete a user (not self)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'));

    expect(User::find($user->id))->toBeNull();
});

test('admin cannot delete self', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('error', 'You cannot delete yourself.');

    expect(User::find($admin->id))->not->toBeNull();
});
