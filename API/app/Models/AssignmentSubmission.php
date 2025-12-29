<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'file',
        'submitted_at',
        'feedback',
        'grade'
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
