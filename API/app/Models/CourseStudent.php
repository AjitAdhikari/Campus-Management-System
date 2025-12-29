<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseStudent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'student_id'
    ];
}
