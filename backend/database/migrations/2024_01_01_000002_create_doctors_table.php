<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('specialty');
            $table->string('qualifications');
            $table->string('imageUrl')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
