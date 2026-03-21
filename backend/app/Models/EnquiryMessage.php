<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnquiryMessage extends Model
{
    protected $table = 'enquiry_messages';
    public $timestamps = false;

    protected $fillable = [
        'enquiry_id',
        'sender',
        'message',
        'sentViaEmail',
        'createdAt',
    ];

    protected $casts = [
        'sentViaEmail' => 'boolean',
        'createdAt'    => 'datetime',
    ];

    public function enquiry()
    {
        return $this->belongsTo(Enquiry::class);
    }
}
