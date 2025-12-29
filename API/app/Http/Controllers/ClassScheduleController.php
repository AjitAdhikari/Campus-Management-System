<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;

class ClassScheduleController extends Controller
{
    public function index()
    {
        return ClassSchedule::with(['course','faculty'])->get();
    }

    public function store(Request $request)
    {
        return ClassSchedule::create($request->all());
    }

    public function show(ClassSchedule $classSchedule)
    {
        return $classSchedule->load(['course','faculty']);
    }

    public function update(Request $request, ClassSchedule $classSchedule)
    {
        $classSchedule->update($request->all());
        return $classSchedule;
    }

    public function destroy(ClassSchedule $classSchedule)
    {
        $classSchedule->delete();
        return response()->json(['message' => 'Schedule removed']);
    }
}
