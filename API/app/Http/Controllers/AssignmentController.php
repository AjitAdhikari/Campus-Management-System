<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        return Assignment::with('course')->get();
    }

    public function store(Request $request)
    {
        return Assignment::create($request->all());
    }

    public function show(Assignment $assignment)
    {
        return $assignment->load('submissions');
    }

    public function update(Request $request, Assignment $assignment)
    {
        $assignment->update($request->all());
        return $assignment;
    }

    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return response()->json(['message' => 'Assignment deleted']);
    }
}
