<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $table = 'enquiries';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'message',
        'city',
        'region',
        'country',
        'browser',
        'device',
        'ip',
        'status',
        'adminReply',
        'readAt',
        'repliedAt',
        'createdAt',
    ];

    protected $casts = [
        'createdAt'  => 'datetime',
        'readAt'     => 'datetime',
        'repliedAt'  => 'datetime',
    ];

    public function messages()
    {
        return $this->hasMany(EnquiryMessage::class)->orderBy('createdAt', 'asc');
    }
}
