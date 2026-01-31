<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseStudent extends Model
{
    protected $table = 'course_students';

    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'student_id'
    ];
}
