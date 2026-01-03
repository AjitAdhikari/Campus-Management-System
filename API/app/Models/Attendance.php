<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';

    protected $fillable = [
        'faculty_id',
        'clock_in_time',
    ];

    protected $casts = [
        'clock_in_time' => 'datetime',
    ];

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
}
