<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function adminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('charity-admin');

    return $admin;
}

test('admins can view the audit log', function () {
    activity()->log('Something happened');

    $this->actingAs(adminUser())
        ->get(route('admin.audit-log.index'))
        ->assertOk();
});

test('staff without the view audit log permission are forbidden', function () {
    $volunteer = User::factory()->create();
    $volunteer->assignRole('volunteer');

    $this->actingAs($volunteer)
        ->get(route('admin.audit-log.index'))
        ->assertForbidden();
});

test('the audit log can be exported as csv', function () {
    activity()->log('Exported action');

    $this->actingAs(adminUser())
        ->get(route('admin.audit-log.export', ['format' => 'csv']))
        ->assertOk()
        ->assertDownload();
});

test('the audit log can be exported as pdf', function () {
    activity()->log('Exported action');

    $this->actingAs(adminUser())
        ->get(route('admin.audit-log.export', ['format' => 'pdf']))
        ->assertOk()
        ->assertDownload();
});

test('an unknown export format returns a 404', function () {
    $this->actingAs(adminUser())
        ->get(route('admin.audit-log.export', ['format' => 'xlsx']))
        ->assertNotFound();
});
