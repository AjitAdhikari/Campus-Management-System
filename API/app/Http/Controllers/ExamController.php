<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index()
    {
        return Exam::with('course')->get();
    }

    public function store(Request $request)
    {
        return Exam::create($request->all());
    }
}
