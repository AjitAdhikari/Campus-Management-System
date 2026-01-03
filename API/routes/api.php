<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ExamResultController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\AttendanceController;



Route::get('/test', function() {
    return ['message' => 'API is working'];
});


Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',  [AuthController::class, 'logout']);
        Route::get('/profile',  [AuthController::class, 'profile']);
    });
});

//http://localhost:8000/api/users
Route::prefix('users')->group(function(){
    Route::post('/', [UserController::class, 'create']);
    Route::post('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}',[UserController::class, 'delete']);
    Route::get('/{id}', [UserController::class, 'get']);
    Route::get('/', [UserController::class, 'index']);
});


//http://localhost:8000/api/fees
Route::prefix('fees')->group(function () {
    Route::post('/', [FeeController::class, 'create']);
    Route::post('/details', [FeeController::class, 'create_fee_details']);
    Route::post('/{id}', [FeeController::class, 'store']);
    Route::post('/details/{id}', [FeeController::class, 'update_fee_details']);
    Route::delete('/{id}', [FeeController::class, 'delete']);
    Route::delete('/details/{id}', [FeeController::class, 'delete_fee_details']);
    Route::get('/{user_id}', [FeeController::class, 'show']);
    Route::get('/details/{user_id}', [FeeController::class, 'show_fee_details']);
    Route::get('/', [FeeController::class, 'index']);
});
//http://localhost:8000/api/notices
Route::prefix('notices')->group(function () {
    Route::post('/', [NoticeController::class, 'create']);
    Route::post('/{id}', [NoticeController::class, 'update']);
    Route::get('/', [NoticeController::class, 'list']);
    Route::delete('/{id}', [NoticeController::class, 'delete']);
    Route::get('/{id}', [NoticeController::class, 'get']);
});


 // Courses
    Route::apiResource('courses', CourseController::class);
    Route::get('faculty/{facultyId}/courses', [CourseController::class, 'getFacultyCourses']);
    Route::post('faculty/assign-course', [CourseController::class, 'assignCourseToFaculty']);
    Route::get('courses/{courseId}/students', [CourseController::class, 'getCourseStudents']);
    Route::get('student/{studentId}/courses', [CourseController::class, 'getStudentCourses']);
    Route::post('student/assign-courses', [CourseController::class, 'assignCoursesToStudent']);
    Route::apiResource('class-schedules', ClassScheduleController::class);

    // Assignments (Protected with auth:sanctum)
    Route::middleware('auth:sanctum')->prefix('assignments')->group(function () {
        Route::get('/', [AssignmentController::class, 'index']); // Faculty: get their assignments
        Route::post('/', [AssignmentController::class, 'store']); // Faculty: create assignment
        Route::get('/student', [AssignmentController::class, 'studentAssignments']); // Student: get assignments
        Route::get('/{id}', [AssignmentController::class, 'show']); // Get single assignment
        Route::post('/{id}', [AssignmentController::class, 'update']); // Update assignment
        Route::delete('/{id}', [AssignmentController::class, 'destroy']); // Delete assignment
        Route::get('/{id}/submissions', [AssignmentController::class, 'getSubmissions']); // Get submissions
        Route::post('/{assignmentId}/submit', [AssignmentController::class, 'submitAssignment']); // Student submit
        Route::post('/submissions/{submissionId}/feedback', [AssignmentController::class, 'updateSubmissionFeedback']); // Faculty feedback
    });
    
    // Route::middleware('auth:sanctum')->group(function () {
    //     Route::post('assignment-submissions', [AssignmentSubmissionController::class, 'store']);
    //     Route::put('assignment-submissions/{assignmentSubmission}', [AssignmentSubmissionController::class, 'update']);
    // });

    // Exams & Results
    Route::apiResource('exams', ExamController::class)->only(['index','store']);
    Route::post('exam-results', [ExamResultController::class, 'store']);
    Route::get('exam-results/{studentId}', [ExamResultController::class, 'show']);

    // Grades (using ExamResultController)
    Route::post('grades/submit', [ExamResultController::class, 'submitGrades']);
    Route::get('student/{studentId}/results', [ExamResultController::class, 'show']);
    Route::get('faculty/{facultyId}/grades', [ExamResultController::class, 'getFacultyGrades']);


       // Departments
    Route::apiResource('departments', DepartmentController::class);

    // Attendance
    Route::prefix('attendance')->group(function () {
        Route::get('/', [AttendanceController::class, 'index']); // Get all attendance
        Route::post('/', [AttendanceController::class, 'store']); // Clock in
        Route::get('/{facultyId}', [AttendanceController::class, 'show']); // Get faculty attendance
        Route::delete('/{facultyId}', [AttendanceController::class, 'destroy']); // Clear faculty attendance
    });

     Route::get(
        'faculty/attendance',
        [FacultyAttendanceController::class, 'index']
    );
