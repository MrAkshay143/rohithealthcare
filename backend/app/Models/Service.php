<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';
    public $timestamps = false;

    protected $fillable = ['title', 'description', 'icon', 'order', 'visible'];

    protected $casts = [
        'visible' => 'boolean',
        'order' => 'integer',
    ];
}
