<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;

class ClassScheduleController extends Controller
{
    public function index()
    {
        return ClassSchedule::with(['course', 'faculty'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'faculty_id' => 'required|exists:users,id',
            'class_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'nullable|in:scheduled,cancelled,rescheduled',
            'room' => 'nullable|string|max:255'
        ], [
            'end_time.after' => 'End time must be after start time.',
            'start_time.required' => 'Start time is required.',
            'end_time.required' => 'End time is required.',
            'course_id.required' => 'Course is required.',
            'faculty_id.required' => 'Faculty is required.',
            'class_date.required' => 'Class date is required.',
            'class_date.after_or_equal' => 'Class date cannot be in the past.'
        ]);

        // Additional validation: Check if datetime is in the future
        $scheduleDateTime = \Carbon\Carbon::parse($validated['class_date'] . ' ' . $validated['start_time']);
        if ($scheduleDateTime->isPast()) {
            return response()->json([
                'message' => 'Cannot create schedule for a time that has already passed.',
                'errors' => [
                    'start_time' => ['The selected time has already passed for today.']
                ]
            ], 422);
        }

        // Check for faculty scheduling conflict
        $conflict = ClassSchedule::where('faculty_id', $validated['faculty_id'])
            ->where('class_date', $validated['class_date'])
            ->where('status', 'scheduled')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->first();

        if ($conflict) {
            return response()->json([
                'message' => 'This faculty member is already scheduled at this time.',
                'errors' => [
                    'faculty_id' => ['Faculty is already scheduled from ' . $conflict->start_time . ' to ' . $conflict->end_time . ' on this date.']
                ]
            ], 422);
        }

        return ClassSchedule::create($validated);
    }

    public function show(ClassSchedule $classSchedule)
    {
        return $classSchedule->load(['course', 'faculty']);
    }

    public function update(Request $request, ClassSchedule $classSchedule)
    {
        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'faculty_id' => 'sometimes|exists:users,id',
            'class_date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'status' => 'sometimes|in:scheduled,cancelled,rescheduled',
            'room' => 'nullable|string|max:255'
        ], [
            'end_time.after' => 'End time must be after start time.',
            'class_date.after_or_equal' => 'Class date cannot be in the past.'
        ]);

        // Additional validation: Check if datetime is in the future
        $date = $validated['class_date'] ?? $classSchedule->class_date;
        $time = $validated['start_time'] ?? $classSchedule->start_time;
        $scheduleDateTime = \Carbon\Carbon::parse($date . ' ' . $time);

        if ($scheduleDateTime->isPast()) {
            return response()->json([
                'message' => 'Cannot update schedule to a time that has already passed.',
                'errors' => [
                    'start_time' => ['The selected time has already passed.']
                ]
            ], 422);
        }

        // Check for faculty scheduling conflict
        $facultyId = $validated['faculty_id'] ?? $classSchedule->faculty_id;
        $startTime = $validated['start_time'] ?? $classSchedule->start_time;
        $endTime = $validated['end_time'] ?? $classSchedule->end_time;

        $conflict = ClassSchedule::where('faculty_id', $facultyId)
            ->where('class_date', $date)
            ->where('status', 'scheduled')
            ->where('id', '!=', $classSchedule->id) // Exclude current schedule
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            })
            ->first();

        if ($conflict) {
            return response()->json([
                'message' => 'This faculty member is already scheduled at this time.',
                'errors' => [
                    'faculty_id' => ['Faculty is already scheduled from ' . $conflict->start_time . ' to ' . $conflict->end_time . ' on this date.']
                ]
            ], 422);
        }

        $classSchedule->update($validated);
        return $classSchedule;
    }

    public function destroy(ClassSchedule $classSchedule)
    {
        $classSchedule->delete();
        return response()->json(['message' => 'Schedule removed']);
    }
}
