<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        // Hash any existing plaintext passwords
        $admins = DB::table('admin_users')->get();
        foreach ($admins as $admin) {
            // Skip if already hashed (bcrypt hashes start with $2y$)
            if (!str_starts_with($admin->password, '$2y$')) {
                DB::table('admin_users')
                    ->where('id', $admin->id)
                    ->update(['password' => Hash::make($admin->password)]);
            }
        }
    }

    public function down(): void
    {
        // Cannot reverse password hashing
    }
};
