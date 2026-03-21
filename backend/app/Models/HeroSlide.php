<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $table = 'hero_slides';
    public $timestamps = false;

    protected $fillable = ['imageUrl', 'alt', 'order', 'createdAt'];

    protected $casts = [
        'order' => 'integer',
        'createdAt' => 'datetime',
    ];
}
