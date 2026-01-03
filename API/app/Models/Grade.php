<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'student_id',
        'course_id',
        'faculty_id',
        'marks',
        'grade',
        'status'
    ];

    /**
     * Calculate letter grade from numerical marks
     */
    public static function calculateGrade($marks)
    {
        if ($marks >= 90) return 'A';
        if ($marks >= 85) return 'A-';
        if ($marks >= 80) return 'B+';
        if ($marks >= 75) return 'B';
        if ($marks >= 70) return 'B-';
        if ($marks >= 65) return 'C+';
        if ($marks >= 60) return 'C';
        if ($marks >= 55) return 'C-';
        if ($marks >= 50) return 'D+';
        if ($marks >= 45) return 'D';
        return 'F';
    }

    /**
     * Determine pass/fail status
     */
    public static function calculateStatus($marks)
    {
        return $marks >= 45 ? 'Pass' : 'Fail';
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
}
