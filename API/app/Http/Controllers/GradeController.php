<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    /**
     * Submit grades for students in a course
     */
    public function submitGrades(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'faculty_id' => 'required|exists:users,id',
            'marks' => 'required|array',
            'marks.*.studentId' => 'required|exists:users,id',
            'marks.*.mark' => 'required|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            $courseId = $request->course_id;
            $facultyId = $request->faculty_id;

            // Get or create a "final" exam for this course
            $exam = Exam::firstOrCreate(
                [
                    'course_id' => $courseId,
                    'exam_type' => 'final'
                ],
                ['max_marks' => 100]
            );

            $results = [];

            foreach ($request->marks as $mark) {
                $marks = $mark['mark'];
                $grade = ExamResult::calculateGrade($marks);
                $status = ExamResult::calculateStatus($marks);

                $examResult = ExamResult::updateOrCreate(
                    [
                        'exam_id' => $exam->id,
                        'student_id' => $mark['studentId']
                    ],
                    [
                        'faculty_id' => $facultyId,
                        'marks' => $marks,
                        'grade' => $grade,
                        'status' => $status,
                        'uploaded_at' => now()
                    ]
                );

                $results[] = $examResult;
            }

            DB::commit();

            return response()->json([
                'message' => 'Grades submitted successfully',
                'results' => $results
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to submit grades',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student results - all courses with marks and grades
     */
    public function getStudentResults($studentId)
    {
        try {
            $results = ExamResult::with(['exam.course', 'faculty'])
                ->where('student_id', $studentId)
                ->get()
                ->map(function ($result) {
                    return [
                        'id' => $result->id,
                        'course_name' => $result->exam->course->course_name ?? 'N/A',
                        'course_code' => $result->exam->course->course_code ?? 'N/A',
                        'marks' => $result->marks,
                        'grade' => $result->grade,
                        'status' => $result->status,
                        'faculty_name' => $result->faculty->name ?? 'N/A',
                        'uploaded_at' => $result->uploaded_at
                    ];
                });

            return response()->json($results, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch results',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
