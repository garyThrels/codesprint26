<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

final class RolePermissionSeeder extends Seeder
{
    /**
     * Baseline permissions for the admin portal.
     *
     * These are intentionally generic; task-specific permissions can be added
     * on top once the competition task is revealed.
     *
     * @var list<string>
     */
    private const array PERMISSIONS = [
        'access admin panel',
        'view dashboard',
        'view ledger',
        'export ledger',
        'view audit log',
        'manage users',
        'view campaigns',
        'manage campaigns',
        'view charities',
        'manage charities',
    ];

    /**
     * Role definitions mapped to the permissions each role is granted.
     *
     * `super-admin` is intentionally omitted here; it receives all abilities
     * through the `Gate::before` hook registered in AppServiceProvider.
     *
     * @var array<string, list<string>>
     */
    private const array ROLES = [
        // Charity Admin manages campaigns/charities/ledger but NOT users or the
        // audit log — those are reserved for super-admin (users) and
        // super-admin/auditor (audit log). See RoleAccessTest.
        'charity-admin' => [
            'access admin panel',
            'view dashboard',
            'view ledger',
            'export ledger',
            'view campaigns',
            'manage campaigns',
            'view charities',
            'manage charities',
        ],
        'volunteer' => [
            'access admin panel',
            'view dashboard',
            'view ledger',
            'view campaigns',
            'view charities',
        ],
        'auditor' => [
            'access admin panel',
            'view dashboard',
            'view ledger',
            'export ledger',
            'view audit log',
            'view campaigns',
            'view charities',
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        Role::findOrCreate('super-admin', 'web');

        foreach (self::ROLES as $role => $permissions) {
            Role::findOrCreate($role, 'web')->syncPermissions($permissions);
        }
    }
}
