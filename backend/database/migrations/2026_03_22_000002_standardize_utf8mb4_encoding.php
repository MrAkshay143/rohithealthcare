<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Ensure all tables use utf8mb4 charset and utf8mb4_unicode_ci collation.
     */
    public function up(): void
    {
        $tables = [
            'admin_users',
            'blogs',
            'doctors',
            'enquiries',
            'enquiry_messages',
            'galleries',
            'hero_slides',
            'nav_links',
            'services',
            'site_contents',
            'site_settings',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE `{$table}` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        }
    }

    public function down(): void
    {
        // No rollback — utf8mb4 is the desired permanent state
    }
};
