<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $table = 'site_contents';
    public $timestamps = false;

    protected $fillable = ['key', 'value'];
}
