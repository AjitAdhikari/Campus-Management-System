<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $fillable = [
        'course_id',
        'faculty_id',
        'class_date',
        'start_time',
        'end_time',
        'room',
        'status'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function faculty()
    {
        return $this->belongsTo(User::class);
    }

    public function notifications()
    {
        return $this->hasMany(ScheduleNotification::class, 'schedule_id');
    }
}
