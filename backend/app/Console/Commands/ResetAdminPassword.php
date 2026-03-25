<?php

namespace App\Console\Commands;

use App\Models\AdminUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:reset-password {new_password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resets the master admin password in the users table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $newPassword = $this->argument('new_password');

        if (strlen($newPassword) < 6) {
            $this->error('Password must be at least 6 characters long.');
            return 1;
        }

        $admin = AdminUser::first();
        if (!$admin) {
            $this->error('No admin user found in database.');
            return 1;
        }

        $admin->update(['password' => Hash::make($newPassword)]);

        $this->info("Admin password has been successfully reset for '{$admin->username}'.");
        return 0;
    }
}
