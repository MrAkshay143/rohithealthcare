<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $table = 'galleries';
    public $timestamps = false;

    protected $fillable = ['title', 'imageUrl', 'order'];
}
