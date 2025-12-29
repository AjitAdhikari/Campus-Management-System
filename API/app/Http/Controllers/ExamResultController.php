<?php
namespace App\Http\Controllers;

use App\Models\ExamResult;
use Illuminate\Http\Request;
class ExamResultController extends Controller
{
    public function store(Request $request)
    {
        return ExamResult::create($request->all());
    }

    public function show($studentId)
    {
        return ExamResult::where('student_id', $studentId)->get();
    }
}
