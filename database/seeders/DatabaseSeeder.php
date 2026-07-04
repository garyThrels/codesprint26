<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        // Admin portal login (full access).
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@codesprint.test',
        ])->assignRole('super-admin');

        // Client-facing portal login.
        User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@codesprint.test',
        ])->assignRole('donor');
    }
}
