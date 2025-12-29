<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'course_code',
        'course_name',
        'credit',
        'department',
        'semester',
        'created_by'
    ];

    public function faculties()
    {
        return $this->belongsToMany(Faculty::class, 'course_faculty');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'course_students');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
