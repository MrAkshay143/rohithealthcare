<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->integer('order')->default(0)->after('imageUrl');
        });

        // Preserve current ordering for existing rows (order by id)
        DB::statement('UPDATE galleries SET `order` = id');
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
};
