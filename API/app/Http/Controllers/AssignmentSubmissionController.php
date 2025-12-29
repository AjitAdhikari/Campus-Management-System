<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request)
    {
        return AssignmentSubmission::create($request->all());
    }

    public function show(AssignmentSubmission $assignmentSubmission)
    {
        return $assignmentSubmission->load(['student','assignment']);
    }

    public function update(Request $request, AssignmentSubmission $assignmentSubmission)
    {
        $assignmentSubmission->update($request->only(['feedback','grade']));
        return $assignmentSubmission;
    }
}
