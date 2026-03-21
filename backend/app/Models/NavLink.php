<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavLink extends Model
{
    protected $table = 'nav_links';
    public $timestamps = false;

    protected $fillable = [
        'type',
        'label',
        'url',
        'order',
        'is_visible',
        'open_new_tab',
        'desktop_visible',
        'mobile_visible',
    ];

    protected $casts = [
        'order'            => 'integer',
        'is_visible'       => 'boolean',
        'open_new_tab'     => 'boolean',
        'desktop_visible'  => 'boolean',
        'mobile_visible'   => 'boolean',
    ];
}
