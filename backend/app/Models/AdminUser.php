<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminUser extends Model
{
    protected $table = 'admin_users';
    public $timestamps = false;

    protected $fillable = ['username', 'password', 'session_token'];

    protected $hidden = ['password', 'session_token'];
}
