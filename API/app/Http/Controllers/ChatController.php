<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\CourseFaculty;
use App\Models\CourseStudent;
use App\Models\UserProfile;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get contacts based on course assignments.
     */
    public function getContacts()
    {
        $user = Auth::user();
        if (!$user)
            return response()->json(['error' => 'Unauthenticated'], 401);

        $profile = $user->profile;
        $role = trim(strtolower($profile->role ?? 'student'));

        if ($role === 'student') {
            // Get faculty who teach this student
            $courseIds = CourseStudent::where('student_id', $user->id)->pluck('course_id');
            $facultyIds = CourseFaculty::whereIn('course_id', $courseIds)->pluck('faculty_id');

            $contacts = User::whereIn('id', $facultyIds)
                ->with([
                    'profile',
                    'assignedCourses' => function ($query) use ($courseIds) {
                        $query->whereIn('courses.id', $courseIds);
                    }
                ])
                ->get();

            $contacts = $contacts->map(function ($contact) use ($courseIds) {
                // Get course names from assigned courses that the student is also in
                $contact->subject = $contact->assignedCourses->whereIn('id', $courseIds)->pluck('course_name')->implode(', ');
                return $contact;
            });
        } else if ($role === 'faculty') {
            // Get students enrolled in courses taught by this faculty
            $courseIds = CourseFaculty::where('faculty_id', $user->id)->pluck('course_id');
            $studentIds = CourseStudent::whereIn('course_id', $courseIds)->pluck('student_id');

            $contacts = User::whereIn('id', $studentIds)
                ->with([
                    'profile',
                    'enrolledCourses' => function ($query) use ($courseIds) {
                        $query->whereIn('courses.id', $courseIds);
                    }
                ])
                ->get();

            $contacts = $contacts->map(function ($contact) use ($courseIds) {
                // Get course names from enrolled courses that the faculty member teaches
                $contact->subject = $contact->enrolledCourses->whereIn('id', $courseIds)->pluck('course_name')->implode(', ');
                return $contact;
            });
        } else {
            return response()->json(['contacts' => []]);
        }

        // Add last message and unread count for each contact
        foreach ($contacts as $contact) {
            $lastMessage = Message::where(function ($q) use ($user, $contact) {
                $q->where('sender_id', $user->id)->where('receiver_id', $contact->id);
            })->orWhere(function ($q) use ($user, $contact) {
                $q->where('sender_id', $contact->id)->where('receiver_id', $user->id);
            })->latest()->first();

            $contact->last_message = $lastMessage ? $lastMessage->message : null;
            $contact->last_message_at = $lastMessage ? $lastMessage->created_at->format('Y-m-d H:i:s') : null;

            $contact->unread_count = Message::where('sender_id', $contact->id)
                ->where('receiver_id', $user->id)
                ->where('is_read', false)
                ->count();

            $contact->status = 'Available'; // Placeholder for online status

            if ($contact->profile && !empty($contact->profile->avatar)) {
                $contact->profile->avatar = url('storage/' . $contact->profile->avatar);
            }
        }

        // Sort contacts by last message time (most recent first)
        $contacts = $contacts->sortByDesc('last_message_at')->values();

        return response()->json(['contacts' => $contacts]);
    }

    /**
     * Get messages history with a specific contact.
     */
    public function getMessages($contactId)
    {
        $userId = Auth::id();

        $messages = Message::where(function ($query) use ($userId, $contactId) {
            $query->where('sender_id', $userId)
                ->where('receiver_id', $contactId);
        })
            ->orWhere(function ($query) use ($userId, $contactId) {
                $query->where('sender_id', $contactId)
                    ->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages from contact as read
        Message::where('sender_id', $contactId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages->transform(function ($msg) {
            if ($msg->file_path) {
                $msg->file_path = url('storage/' . $msg->file_path);
            }
            return $msg;
        });

        return response()->json(['messages' => $messages]);
    }

    /**
     * Send a new message with security check.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // Max 5MB
        ]);

        if (empty($request->message) && !$request->hasFile('file')) {
            return response()->json(['error' => 'Either message or file is required.'], 422);
        }

        $sender = Auth::user();
        $receiverId = $request->receiver_id;
        $profile = $sender->profile;
        $role = trim(strtolower($profile->role ?? 'student'));
        $canMessage = false;

        // Security Check: Access must strictly follow subject mapping
        if ($role === 'student') {
            $courseIds = DB::table('course_students')->where('student_id', $sender->id)->pluck('course_id');
            $canMessage = DB::table('course_faculty')->where('faculty_id', $receiverId)
                ->whereIn('course_id', $courseIds)
                ->exists();
        } else if ($role === 'faculty') {
            $courseIds = DB::table('course_faculty')->where('faculty_id', $sender->id)->pluck('course_id');
            $canMessage = DB::table('course_students')->where('student_id', $receiverId)
                ->whereIn('course_id', $courseIds)
                ->exists();
        }

        if (!$canMessage) {
            return response()->json(['error' => 'Unauthorized: You can only message users assigned to your courses.'], 403);
        }

        $filePath = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('chat_attachments', 'public');
            $fileType = $file->getClientOriginalExtension() === 'pdf' ? 'pdf' : 'image';
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'message' => $request->message,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'is_read' => false,
        ]);

        if ($message->file_path) {
            $message->file_path = url('storage/' . $message->file_path);
        }

        return response()->json(['message' => $message], 201);
    }
}
