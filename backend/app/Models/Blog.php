<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $table = 'blogs';
    public $timestamps = false;

    protected $fillable = ['slug', 'title', 'content', 'imageUrl', 'videoUrl', 'draft', 'createdAt'];

    protected $casts = [
        'draft' => 'boolean',
        'createdAt' => 'datetime',
    ];
}
