<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'student_id' => 'required|exists:users,id',
            'file' => 'required|string'
        ]);

        $assignment = Assignment::findOrFail($validated['assignment_id']);

        // Check if current time is past the due date
        if (Carbon::parse($assignment->due_date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot submit assignment. The due date (' . Carbon::parse($assignment->due_date)->format('M d, Y H:i') . ') has already passed.'
            ], 422);
        }

        $submission = AssignmentSubmission::create([
            'assignment_id' => $validated['assignment_id'],
            'student_id' => $validated['student_id'],
            'file' => $validated['file'],
            'submitted_at' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'data' => $submission
        ]);
    }

    public function show(AssignmentSubmission $assignmentSubmission)
    {
        return $assignmentSubmission->load(['student','assignment']);
    }

    public function update(Request $request, AssignmentSubmission $assignmentSubmission)
    {
        $assignmentSubmission->update($request->only(['feedback','grade']));
        return $assignmentSubmission;
    }
}
