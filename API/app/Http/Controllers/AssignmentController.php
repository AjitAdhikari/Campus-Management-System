<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssignmentController extends Controller
{
    /**
     * Get all assignments for faculty
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $assignments = Assignment::with(['course', 'submissions.student'])
            ->where('faculty_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    /**
     * Get assignments for students
     */
    public function studentAssignments(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please login first.'
                ], 401);
            }
            
            // Load user profile to get student's semester and department
            $user->load('profile');
            
            if (!$user->profile) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No profile information found for student'
                ]);
            }
            
            // Get student's semester and department
            $studentSemester = $user->profile->semesters;
            $studentDepartment = $user->profile->department;
            
            // Build query to get courses
            $courseQuery = Course::query();
            
            $hasFilter = false;
            
            // Match by semester if available
            if ($studentSemester) {
                $hasFilter = true;
                // Handle both numeric and string semester values
                $semesterValue = is_numeric($studentSemester) ? (int)$studentSemester : $studentSemester;
                $courseQuery->where(function($q) use ($semesterValue, $studentSemester) {
                    $q->where('semester', $semesterValue)
                      ->orWhere('semester', $studentSemester);
                });
            }
            
            // Additionally filter by department if available
            if ($studentDepartment) {
                if ($hasFilter) {
                    $courseQuery->where('department', $studentDepartment);
                } else {
                    $courseQuery->where('department', $studentDepartment);
                    $hasFilter = true;
                }
            }
            
            // If no filters, get all courses (fallback)
            $courseIds = $courseQuery->pluck('id')->toArray();
            
            // If no courses found, return empty array
            if (empty($courseIds)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No courses found for your semester/department'
                ]);
            }
            
            // Get assignments for courses in the student's semester
            $assignments = Assignment::with(['course', 'faculty.profile'])
                ->whereIn('course_id', $courseIds)
                ->orderBy('due_date', 'desc')
                ->get()
                ->map(function ($assignment) use ($user) {
                    $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
                        ->where('student_id', $user->id)
                        ->first();
                    
                    $assignment->submission = $submission;
                    $assignment->is_submitted = $submission !== null;
                    return $assignment;
                });

            return response()->json([
                'success' => true,
                'data' => $assignments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load assignments: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new assignment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'attachment' => 'nullable|file|max:10240' // 10MB max
        ]);

        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login first.'
            ], 401);
        }
        
        $attachmentPath = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $attachmentPath = $file->storeAs('assignments', $filename, 'public');
        }

        $assignment = Assignment::create([
            'course_id' => $validated['course_id'],
            'faculty_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'],
            'attachment' => $attachmentPath
        ]);

        $assignment->load(['course', 'submissions']);

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully',
            'data' => $assignment
        ], 201);
    }

    /**
     * Get a single assignment with submissions
     */
    public function show($id)
    {
        $assignment = Assignment::with(['course', 'submissions.student.profile'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    /**
     * Update assignment
     */
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'attachment' => 'nullable|file|max:10240'
        ]);

        if ($request->hasFile('attachment')) {
            // Delete old file if exists
            if ($assignment->attachment) {
                Storage::disk('public')->delete($assignment->attachment);
            }

            $file = $request->file('attachment');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $validated['attachment'] = $file->storeAs('assignments', $filename, 'public');
        }

        $assignment->update($validated);
        $assignment->load(['course', 'submissions']);

        return response()->json([
            'success' => true,
            'message' => 'Assignment updated successfully',
            'data' => $assignment
        ]);
    }

    /**
     * Delete assignment
     */
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        
        // Delete attachment file if exists
        if ($assignment->attachment) {
            Storage::disk('public')->delete($assignment->attachment);
        }

        // Delete all submission files
        foreach ($assignment->submissions as $submission) {
            if ($submission->file) {
                Storage::disk('public')->delete($submission->file);
            }
        }

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignment deleted successfully'
        ]);
    }

    /**
     * Submit assignment (student)
     */
    public function submitAssignment(Request $request, $assignmentId)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240'
        ]);

        $user = Auth::user();
        $assignment = Assignment::findOrFail($assignmentId);

        // Check if already submitted
        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignmentId)
            ->where('student_id', $user->id)
            ->first();

        if ($existingSubmission) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment already submitted'
            ], 400);
        }

        $file = $request->file('file');
        $filename = time() . '_' . $user->id . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('submissions', $filename, 'public');

        $submission = AssignmentSubmission::create([
            'assignment_id' => $assignmentId,
            'student_id' => $user->id,
            'file' => $filePath,
            'submitted_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Assignment submitted successfully',
            'data' => $submission
        ], 201);
    }

    /**
     * Update submission feedback (faculty)
     */
    public function updateSubmissionFeedback(Request $request, $submissionId)
    {
        $validated = $request->validate([
            'feedback' => 'required|string',
            'grade' => 'nullable|string'
        ]);

        $submission = AssignmentSubmission::findOrFail($submissionId);
        $submission->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Feedback updated successfully',
            'data' => $submission
        ]);
    }

    /**
     * Get submissions for an assignment
     */
    public function getSubmissions($assignmentId)
    {
        $assignment = Assignment::findOrFail($assignmentId);
        
        $submissions = AssignmentSubmission::with(['student.profile'])
            ->where('assignment_id', $assignmentId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }
}
