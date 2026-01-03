<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';

    protected $fillable = [
        'faculty_id',
    ];

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
}
