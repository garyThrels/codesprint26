<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        // The primary admin account is the super-admin (full access; bypasses
        // individual permission checks via the Gate::before hook). Per-tier demo
        // accounts (charity-admin, volunteer, auditor) exist separately.
        $admin->syncRoles(['super-admin']);
    }
}
