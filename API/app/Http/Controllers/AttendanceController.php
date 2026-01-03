<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Get all attendance records
     */
    public function index()
    {
        try {
            $attendance = Attendance::with('faculty:id,name')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $attendance
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attendance records for a specific faculty
     */
    public function show($facultyId)
    {
        try {
            $attendance = Attendance::with('faculty:id,name')
                ->where('faculty_id', $facultyId)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $attendance
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clock in - create attendance record
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'faculty_id' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if faculty has already clocked in today
            $today = now()->toDateString();
            $existingAttendance = Attendance::where('faculty_id', $request->faculty_id)
                ->whereDate('created_at', $today)
                ->first();

            if ($existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already clocked in today',
                    'data' => $existingAttendance
                ], 400);
            }

            $attendance = Attendance::create([
                'faculty_id' => $request->faculty_id,
                'clock_in_time' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Clocked in successfully',
                'data' => $attendance
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clock in: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete all attendance records for a faculty
     */
    public function destroy($facultyId)
    {
        try {
            Attendance::where('faculty_id', $facultyId)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'All attendance records cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear attendance: ' . $e->getMessage()
            ], 500);
        }
    }
}
