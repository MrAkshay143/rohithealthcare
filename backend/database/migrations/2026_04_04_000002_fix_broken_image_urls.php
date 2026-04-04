<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Reset hero_slides that have broken /uploads/ URLs to use static /images/ paths
        DB::table('hero_slides')
            ->where('imageUrl', 'like', '/uploads/%')
            ->delete();

        // Ensure hero_slides have the correct static image paths
        DB::table('hero_slides')->updateOrInsert(
            ['id' => 1],
            ['imageUrl' => '/images/bg-diagnostic.jpg', 'alt' => 'Healthcare professionals at work', 'order' => 1, 'createdAt' => now()]
        );
        DB::table('hero_slides')->updateOrInsert(
            ['id' => 2],
            ['imageUrl' => '/images/bg-blood-donation.jpg', 'alt' => 'Modern diagnostic laboratory', 'order' => 2, 'createdAt' => now()]
        );
        DB::table('hero_slides')->updateOrInsert(
            ['id' => 3],
            ['imageUrl' => '/images/bg-medical.jpg', 'alt' => 'Patient care and consultation', 'order' => 3, 'createdAt' => now()]
        );

        // Reset site_contents images that have broken /uploads/ URLs
        DB::table('site_contents')
            ->where('key', 'about_hero_bg')
            ->where('value', 'like', '/uploads/%')
            ->update(['value' => '']);

        DB::table('site_contents')
            ->where('key', 'about_image')
            ->where('value', 'like', '/uploads/%')
            ->update(['value' => '']);

        DB::table('site_contents')
            ->where('key', 'home_whyus_image')
            ->where('value', 'like', '/uploads/%')
            ->update(['value' => '/images/bg-lab.jpg']);

        // Reset blogs that have broken /uploads/ URLs to use static /images/
        DB::table('blogs')
            ->where('imageUrl', 'like', '/uploads/%')
            ->update(['imageUrl' => '/images/bg-medical.jpg']);
    }

    public function down(): void
    {
        // Rollback is not needed - this is a data cleanup migration
    }
};
