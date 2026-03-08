<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'exam_id',
        'student_id',
        'faculty_id',
        'marks',
        'grade',
        'grade_point',
        'status',
        'uploaded_at'
    ];

    /**
     * Calculate letter grade from numerical marks
     */
    public static function calculateGrade($marks)
    {
        if ($marks >= 90)
            return 'A';
        if ($marks >= 85)
            return 'A-';
        if ($marks >= 80)
            return 'B+';
        if ($marks >= 75)
            return 'B';
        if ($marks >= 70)
            return 'B-';
        if ($marks >= 65)
            return 'C+';
        if ($marks >= 60)
            return 'C';
        if ($marks >= 55)
            return 'C-';
        if ($marks >= 50)
            return 'D+';
        if ($marks >= 45)
            return 'D';
        return 'F';
    }

    /**
     * Calculate Grade Point (GP) from numerical marks
     */
    public static function calculateGP($marks)
    {
        if ($marks >= 90)
            return 4.00;
        if ($marks >= 85)
            return 3.70;
        if ($marks >= 80)
            return 3.30;
        if ($marks >= 75)
            return 3.00;
        if ($marks >= 70)
            return 2.70;
        if ($marks >= 65)
            return 2.30;
        if ($marks >= 60)
            return 2.00;
        if ($marks >= 55)
            return 1.70;
        if ($marks >= 50)
            return 1.30;
        if ($marks >= 45)
            return 1.00;
        return 0.00;
    }

    /**
     * Determine pass/fail status
     */
    public static function calculateStatus($marks)
    {
        return $marks >= 45 ? 'Pass' : 'Fail';
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
}
