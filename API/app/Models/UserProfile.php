<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    //
    protected $fillable = [
        'user_id',
        'role',
        'subjects',
        'semesters',
        'avatar',
        'department',
        'fees',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
