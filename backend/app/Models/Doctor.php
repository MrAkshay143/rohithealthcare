<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctors';
    public $timestamps = false;

    protected $fillable = ['name', 'specialty', 'qualifications', 'imageUrl', 'imagePosition', 'order'];
}
