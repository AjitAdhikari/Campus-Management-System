<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SemesterResult extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'student_id',
        'semester',
        'gpa',
        'result_pdf',
        'published_at'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
