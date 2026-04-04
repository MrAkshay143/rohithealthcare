<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Delete gallery images with broken /uploads/ URLs
        // (they're user-uploaded, not seeded, so affected by old /public/uploads/ wipe)
        DB::table('galleries')
            ->where('imageUrl', 'like', '/uploads/%')
            ->delete();
    }

    public function down(): void
    {
        // Rollback is not needed - this is a cleanup migration
    }
};
