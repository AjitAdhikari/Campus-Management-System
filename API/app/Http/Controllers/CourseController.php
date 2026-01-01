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
}
