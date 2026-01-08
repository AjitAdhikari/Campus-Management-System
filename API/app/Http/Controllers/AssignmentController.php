<?php

namespace App\Http\Controllers;


use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssignmentController extends Controller
{
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
            
            $user->load('profile');
            
            if (!$user->profile) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No profile information found for student'
                ]);
            }
            
            $studentSemester = $user->profile->semesters;
            $studentDepartment = $user->profile->department;
            
            $courseQuery = Course::query();
            
            $hasFilter = false;
            
            if ($studentSemester) {
                $hasFilter = true;
                $semesterValue = is_numeric($studentSemester) ? (int)$studentSemester : $studentSemester;
                $courseQuery->where(function($q) use ($semesterValue, $studentSemester) {
                    $q->where('semester', $semesterValue)
                      ->orWhere('semester', $studentSemester);
                });
            }
            
            if ($studentDepartment) {
                if ($hasFilter) {
                    $courseQuery->where('department', $studentDepartment);
                } else {
                    $courseQuery->where('department', $studentDepartment);
                    $hasFilter = true;
                }
            }
            
            $courseIds = $courseQuery->pluck('id')->toArray();
            
            if (empty($courseIds)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No courses found for your semester/department'
                ]);
            }
            
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

        // Send email notification to students enrolled in the course
        $this->sendNewAssignmentNotificationToStudents($assignment);

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully',
            'data' => $assignment
        ], 201);
    }

    public function show($id)
    {
        $assignment = Assignment::with(['course', 'submissions.student.profile'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

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

    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        
        if ($assignment->attachment) {
            Storage::disk('public')->delete($assignment->attachment);
        }

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

    public function submitAssignment(Request $request, $assignmentId)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240'
        ]);

        $user = Auth::user();
        $assignment = Assignment::findOrFail($assignmentId);

       
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

       
        $this->sendSubmissionNotificationEmail($assignment, $user);

        return response()->json([
            'success' => true,
            'message' => 'Assignment submitted successfully',
            'data' => $submission
        ], 201);
    }

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

    private function sendSubmissionNotificationEmail($assignment, $student)
    {
        try {
            $faculty = $assignment->faculty;
            
            if (!$faculty || !$faculty->email) {
                \Log::warning('Faculty email not found for assignment submission notification');
                return;
            }

            $studentName = $student->name;
            if ($student->profile) {
                $studentName = trim(($student->profile->first_name ?? '') . ' ' . ($student->profile->last_name ?? ''));
                if (empty($studentName)) {
                    $studentName = $student->name;
                }
            }

            $emailData = [
                'facultyName' => $faculty->name,
                'studentName' => $studentName,
                'assignmentTitle' => $assignment->title,
                'courseName' => $assignment->course->course_name ?? 'N/A',
                'submittedAt' => now()->format('F d, Y h:i A'),
            ];

            Mail::send([], [], function ($message) use ($faculty, $emailData) {
                $message->to($faculty->email)
                    ->subject('New Assignment Submission - ' . $emailData['assignmentTitle'])
                    ->html($this->getSubmissionNotificationEmailTemplate($emailData));
            });

            \Log::info('Assignment submission notification sent to faculty: ' . $faculty->email);
        } catch (\Exception $e) {
            \Log::error('Failed to send assignment submission notification: ' . $e->getMessage());
        }
    }

    private function getSubmissionNotificationEmailTemplate($data)
    {
        return '
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                    .info-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #4a5568; }
                    .value { color: #2d3748; }
                    .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">📝 New Assignment Submission</h1>
                    </div>
                    <div class="content">
                        <p>Dear ' . htmlspecialchars($data['facultyName']) . ',</p>
                        <p>A student has submitted an assignment.</p>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">Student Name:</span>
                                <span class="value">' . htmlspecialchars($data['studentName']) . '</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Assignment:</span>
                                <span class="value">' . htmlspecialchars($data['assignmentTitle']) . '</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Course:</span>
                                <span class="value">' . htmlspecialchars($data['courseName']) . '</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Submitted At:</span>
                                <span class="value">' . htmlspecialchars($data['submittedAt']) . '</span>
                            </div>
                        </div>
                        
                        <p>Please log in to the system to review the submission and provide feedback.</p>
                        
                    </div>
                </div>
            </body>
            </html>
        ';
    }

    private function sendNewAssignmentNotificationToStudents($assignment)
    {
        try {
            $course = $assignment->course;
            
            if (!$course) {
                \Log::warning('Course not found for new assignment notification');
                return;
            }

            $students = \App\Models\User::with('profile')
                ->whereHas('profile', function($query) use ($course) {
                    $query->where('role', 'student')
                          ->where('semesters', $course->semester)
                          ->where('department', $course->department);
                })
                ->get();

            if ($students->isEmpty()) {
                \Log::info('No students found for course: ' . $course->course_name);
                return;
            }

            $facultyName = $assignment->faculty->name ?? 'Your Instructor';
            $dueDate = \Carbon\Carbon::parse($assignment->due_date)->format('F d, Y');

            foreach ($students as $student) {
                if (!$student->email) {
                    continue;
                }

                $studentName = $student->name;
                if ($student->profile) {
                    $studentName = trim(($student->profile->first_name ?? '') . ' ' . ($student->profile->last_name ?? ''));
                    if (empty($studentName)) {
                        $studentName = $student->name;
                    }
                }

                $emailData = [
                    'studentName' => $studentName,
                    'facultyName' => $facultyName,
                    'assignmentTitle' => $assignment->title,
                    'courseName' => $course->course_name,
                    'courseCode' => $course->course_code,
                    'description' => $assignment->description ?? 'No description provided',
                    'dueDate' => $dueDate,
                ];

                Mail::send([], [], function ($message) use ($student, $emailData) {
                    $message->to($student->email)
                        ->subject('New Assignment: ' . $emailData['assignmentTitle'])
                        ->html($this->getNewAssignmentEmailTemplate($emailData));
                });
            }

            \Log::info('New assignment notifications sent to ' . $students->count() . ' students for course: ' . $course->course_name);
        } catch (\Exception $e) {
            \Log::error('Failed to send new assignment notifications: ' . $e->getMessage());
        }
    }

    /**
     * Get email template for new assignment notification
     */
    private function getNewAssignmentEmailTemplate($data)
    {
        return '
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
                    .info-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #4a5568; }
                    .value { color: #2d3748; }
                    .due-date { background: #FEF3C7; color: #92400E; padding: 10px; border-radius: 6px; text-align: center; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">📚 New Assignment Posted</h1>
                    </div>
                    <div class="content">
                        <p>Dear ' . htmlspecialchars($data['studentName']) . ',</p>
                        <p>A new assignment has been posted for your course.</p>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">Assignment:</span>
                                <span class="value">' . htmlspecialchars($data['assignmentTitle']) . '</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Course:</span>
                                <span class="value">' . htmlspecialchars($data['courseName']) . ' (' . htmlspecialchars($data['courseCode']) . ')</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Instructor:</span>
                                <span class="value">' . htmlspecialchars($data['facultyName']) . '</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Description:</span>
                                <span class="value">' . nl2br(htmlspecialchars($data['description'])) . '</span>
                            </div>
                        </div>
                        
                        <div class="due-date">
                            ⏰ Due Date: ' . htmlspecialchars($data['dueDate']) . '
                        </div>
                        
                        <p>Please log in to the system to view the full assignment details and submit your work before the due date.</p>
                        
                    </div>
                </div>
            </body>
            </html>
        ';
    }
}
