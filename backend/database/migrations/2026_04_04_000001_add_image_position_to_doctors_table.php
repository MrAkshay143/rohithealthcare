<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // imagePosition: CSS object-position value e.g. "50% 30%"
            // Default "50% 30%" keeps headshots framed at top-center (face visible)
            $table->string('imagePosition', 100)->default('50% 30%')->after('imageUrl');
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn('imagePosition');
        });
    }
};
