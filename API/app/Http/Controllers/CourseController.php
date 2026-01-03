<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::orderBy('created_at', 'desc')->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,course_code',
            'credit' => 'required|integer|min:1',
            'department' => 'required|string|max:255',
            'semester' => 'required|integer|min:1|max:8',
            'syllabus' => 'nullable|file|mimes:pdf,doc,docx|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $syllabusPath = null;
        if ($request->hasFile('syllabus')) {
            $syllabusPath = $request->file('syllabus')->store('syllabi', 'public');
        }

        $course = Course::create([
            'course_code' => $request->code,
            'course_name' => $request->title,
            'credit' => $request->credit,
            'department' => $request->department,
            'semester' => $request->semester,
            'syllabus_path' => $syllabusPath,
            'created_by' => Auth::id()
        ]);

        // Automatically assign course to all students in the same semester
        $students = \App\Models\User::whereHas('profile', function($query) use ($request) {
            $query->where('role', 'Student')
                  ->where('semesters', (string)$request->semester);
        })->get();

        foreach ($students as $student) {
            $exists = \DB::table('course_students')
                ->where('student_id', $student->id)
                ->where('course_id', $course->id)
                ->exists();

            if (!$exists) {
                \DB::table('course_students')->insert([
                    'student_id' => $student->id,
                    'course_id' => $course->id
                ]);
            }
        }

        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return response()->json($course);
    }

    public function update(Request $request, Course $course)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,course_code,' . $course->id,
            'credit' => 'required|integer|min:1',
            'department' => 'required|string|max:255',
            'semester' => 'required|integer|min:1|max:8',
            'syllabus' => 'nullable|file|mimes:pdf,doc,docx|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $syllabusPath = $course->syllabus_path;
        if ($request->hasFile('syllabus')) {
            // Delete old syllabus if exists
            if ($syllabusPath) {
                Storage::disk('public')->delete($syllabusPath);
            }
            $syllabusPath = $request->file('syllabus')->store('syllabi', 'public');
        }

        $course->update([
            'course_code' => $request->code,
            'course_name' => $request->title,
            'credit' => $request->credit,
            'department' => $request->department,
            'semester' => $request->semester,
            'syllabus_path' => $syllabusPath
        ]);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        // Delete syllabus file if exists
        if ($course->syllabus_path) {
            Storage::disk('public')->delete($course->syllabus_path);
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    public function getFacultyCourses($facultyId)
    {
        $user = \App\Models\User::find($facultyId);
        
        if (!$user) {
            return response()->json(['error' => 'Faculty not found'], 404);
        }

        $courses = $user->assignedCourses()
            ->orderBy('semester', 'asc')
            ->orderBy('course_name', 'asc')
            ->get();

        return response()->json($courses);
    }

    public function assignCourseToFaculty(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required',
            'course_id' => 'required|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = \App\Models\User::find($request->faculty_id);
        
        if (!$user) {
            return response()->json(['error' => 'Faculty not found'], 404);
        }

        // Check if already assigned
        $exists = \DB::table('course_faculty')
            ->where('faculty_id', $request->faculty_id)
            ->where('course_id', $request->course_id)
            ->exists();

        if (!$exists) {
            \DB::table('course_faculty')->insert([
                'faculty_id' => $request->faculty_id,
                'course_id' => $request->course_id,
                'assigned_at' => now()
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Course assigned to faculty successfully'
        ]);
    }

    public function getStudentCourses($studentId)
    {
        $user = \App\Models\User::find($studentId);
        
        if (!$user) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $courses = $user->enrolledCourses()
            ->orderBy('semester', 'asc')
            ->orderBy('course_name', 'asc')
            ->get();

        return response()->json($courses);
    }

    public function assignCoursesToStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required',
            'semester' => 'required|integer|min:1|max:8'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = \App\Models\User::find($request->student_id);
        
        if (!$user) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Get all courses for the student's semester
        $courses = Course::where('semester', $request->semester)->get();

        // Assign each course to the student
        foreach ($courses as $course) {
            $exists = \DB::table('course_students')
                ->where('student_id', $request->student_id)
                ->where('course_id', $course->id)
                ->exists();

            if (!$exists) {
                \DB::table('course_students')->insert([
                    'student_id' => $request->student_id,
                    'course_id' => $course->id
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Courses assigned to student successfully',
            'courses_count' => $courses->count()
        ]);
    }

    public function getCourseStudents($courseId)
    {
        $course = Course::find($courseId);
        
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $students = \DB::table('course_students')
            ->join('users', 'course_students.student_id', '=', 'users.id')
            ->where('course_students.course_id', $courseId)
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json($students);
    }
}
