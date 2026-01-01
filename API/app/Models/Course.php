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
        'syllabus_path',
        'created_by'
    ];

    protected $casts = [
        'credit' => 'integer',
        'semester' => 'integer'
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
