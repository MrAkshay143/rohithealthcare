<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Admin users: index on session_token for auth lookups
        Schema::table('admin_users', function (Blueprint $table) {
            $table->index('session_token', 'idx_admin_session_token');
        });

        // Doctors: index on order for sorted queries
        Schema::table('doctors', function (Blueprint $table) {
            $table->index('order', 'idx_doctors_order');
        });

        // Services: composite index for visible + order (used by public endpoint)
        Schema::table('services', function (Blueprint $table) {
            $table->index(['visible', 'order'], 'idx_services_visible_order');
        });

        // Enquiries: indexes for admin dashboard queries
        Schema::table('enquiries', function (Blueprint $table) {
            $table->index('status', 'idx_enquiries_status');
            $table->index('createdAt', 'idx_enquiries_created');
        });

        // Blogs: index on draft for public filtering, make slug unique
        Schema::table('blogs', function (Blueprint $table) {
            $table->index('draft', 'idx_blogs_draft');
        });

        // Upgrade blogs.slug from non-unique index to unique
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->unique('slug', 'blogs_slug_unique');
        });

        // Hero slides: index on order for sorted queries
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->index('order', 'idx_hero_slides_order');
        });

        // Nav links: index on is_visible for public queries
        Schema::table('nav_links', function (Blueprint $table) {
            $table->index('is_visible', 'idx_nav_links_visible');
        });
    }

    public function down(): void
    {
        Schema::table('admin_users', function (Blueprint $table) {
            $table->dropIndex('idx_admin_session_token');
        });

        Schema::table('doctors', function (Blueprint $table) {
            $table->dropIndex('idx_doctors_order');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex('idx_services_visible_order');
        });

        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropIndex('idx_enquiries_status');
            $table->dropIndex('idx_enquiries_created');
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropIndex('idx_blogs_draft');
            $table->dropUnique('blogs_slug_unique');
            $table->index('slug');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropIndex('idx_hero_slides_order');
        });

        Schema::table('nav_links', function (Blueprint $table) {
            $table->dropIndex('idx_nav_links_visible');
        });
    }
};
