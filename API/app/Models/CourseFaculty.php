<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseFaculty extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'faculty_id',
        'assigned_at'
    ];
}
