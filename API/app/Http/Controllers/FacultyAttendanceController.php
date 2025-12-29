<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacultyAttendanceController extends Controller
{
     public function index()
    {
        return FacultyAttendance::with(['student','course'])->get();
    }

    public function store(Request $request)
    {
        return FacultyAttendance::create($request->all());
    }
}
