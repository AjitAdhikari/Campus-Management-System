<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Fee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // GET: List users
    public function index()
    {
        try {
            $users = DB::table('users')
                ->leftJoin('user_profiles', 'users.id', '=', 'user_profiles.user_id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.active_status',
                    'user_profiles.role',
                    'user_profiles.semesters',
                    'user_profiles.subjects',
                    'user_profiles.department',
                    'user_profiles.fees'
                )
                ->get()
                ->map(function ($u) {
                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'active_status' => $u->active_status,
                        'role' => $u->role,
                        'semesters' => $u->semesters,
                        'subjects' => $u->subjects,
                        'department' => $u->department,
                        'fees' => $u->fees,
                    ];
                });

            return response()->json($users);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // POST: Create Document
    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:users,email', // unique in users table
                'active_status' => 'required|integer',
                'role' => 'required|string',
                'subjects' => 'nullable|string',
                'semesters' => 'nullable|string',
                'department' => 'nullable|string',
                'fees' => 'nullable|numeric',
                'password' => 'required|string',
                'avatar' => 'nullable|file|max:10240', // optional for testing
            ]);

            $entity = new User();
            $entity->name = $validated['name'];
            $entity->email = $validated['email'] ?? null;
            $entity->active_status = $validated['active_status'];
            $entity->password = Hash::make($validated['password']);
            $entity->save();

            $last_inserted_id = $entity->id;


            $user_profile = new UserProfile();
            $user_profile->user_id = $last_inserted_id;
            $user_profile->role = $validated['role'];
            $user_profile->subjects = $validated['subjects'] ?? null;
            $user_profile->semesters = $validated['semesters'] ?? null;
            $user_profile->department = $validated['department'] ?? null;
            $user_profile->fees = $validated['fees'] ?? 60000.00;

            // handle optional avatar upload
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $path = $file->store('avatars', 'public');
                $user_profile->avatar = $path;
            }

            $user_profile->save();

            // If student and fees provided, create a record in fees table for management system
            if ($validated['role'] === 'Student' && !empty($validated['fees'])) {
                Fee::create([
                    'user_id' => $last_inserted_id,
                    'semester' => $validated['semesters'] ?? '1',
                    'total_fee' => $validated['fees'],
                    'created_by' => Auth::id() ?? 1
                ]);
            }

            return response()->json([
                'message' => 'New User Created Successfully',
                'user_id' => $last_inserted_id
            ], 201);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Document (no file upload here, just metadata)
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:users,id',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email', // unique in users table
                'active_status' => 'required|integer',
                'role' => 'required|string',
                'subjects' => 'nullable|string',
                'semesters' => 'nullable|string',
                'department' => 'nullable|string',
                'fees' => 'nullable|numeric',
                // 'password' => 'required|string',
                'avatar' => 'nullable|file|max:10240', // optional for testing
            ]);

            $entity = User::findOrFail($validated['id']);
            $entity->name = $validated['name'];
            $entity->email = $validated['email'] ?? $entity->email;
            $entity->active_status = $validated['active_status'] ?? $entity->active_status;
            // $entity->password = Hash::make($validated['password']);
            $entity->updated_at = now();
            $entity->save();

            $last_inserted_id = $entity->id;


            $user_profile = UserProfile::where('user_id', $entity->id)->first();
            $user_profile->user_id = $entity->id;
            $user_profile->role = $validated['role'] ?? $user_profile->role;
            $user_profile->subjects = $validated['subjects'] ?? $user_profile->subjects;
            $user_profile->semesters = $validated['semesters'] ?? $user_profile->semesters;
            $user_profile->department = $validated['department'] ?? $user_profile->department;
            $user_profile->fees = $validated['fees'] ?? $user_profile->fees;
            $user_profile->updated_at = now();
            // handle optional avatar upload and save path
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $path = $file->store('avatars', 'public');
                $user_profile->avatar = $path;
            }

            $user_profile->save();

            // If student and fees provided, update or create record in fees table
            if (($validated['role'] ?? $user_profile->role) === 'Student' && isset($validated['fees'])) {
                Fee::updateOrCreate(
                    [
                        'user_id' => $entity->id,
                        'semester' => $validated['semesters'] ?? $user_profile->semesters ?? '1',
                    ],
                    [
                        'total_fee' => $validated['fees'],
                        'updated_by' => Auth::id() ?? 1
                    ]
                );
            }

            return response()->json([
                'message' => 'User Updated Successfully',
                'user_id' => $last_inserted_id
            ], 201);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }


    }

    // DELETE: Delete Document by ID
    public function delete($id)
    {
        try {
            $entity = User::findOrFail($id);
            $entity->delete();

            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Get Document by ID
    public function get($id)
    {
        try {
            $user = DB::table('users')
                ->leftJoin('user_profiles', 'users.id', '=', 'user_profiles.user_id')
                ->where('users.id', $id)
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.active_status',
                    'user_profiles.role',
                    'user_profiles.avatar',
                    'user_profiles.subjects',
                    'user_profiles.semesters'
                )
                ->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            if ($user && !empty($user->avatar)) {
                // convert stored path into a publicly accessible URL
                $user->avatar = url('storage/' . $user->avatar);
            }

            return response()->json($user);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Download Document file by ID
    // public function download($id)
    // {
    //     try {
    //         $document = Document::findOrFail($id);

    //         if (!$document->path || !Storage::disk('public')->exists($document->path)) {
    //             return response()->json(['error' => 'File not found'], 404);
    //         }

    //         $filePath = storage_path('app/public/' . $document->path);
    //         $fileName = $document->name . '.' . pathinfo($document->path, PATHINFO_EXTENSION);

    //         return response()->download($filePath, $fileName, [
    //             'Content-Type' => $document->type ?? 'application/octet-stream'
    //         ]);
    //     } catch (\Exception $ex) {
    //         return response()->json(['error' => $ex->getMessage()], 400);
    //     }
    // }

    // GET: List Documents with filters
    public function list(Request $request)
    {
        try {
            $query = Document::query();

            if ($request->has('name') && $request->name != '') {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            if ($request->has('created_date') && $request->created_date != '') {
                $query->whereDate('created_at', $request->created_date);
            }

            $offset = $request->offset ?? 0;
            $limit = $request->limit ?? 10;

            $total = $query->count();
            $items = $query->offset($offset)->limit($limit)->get();

            return response()->json([
                'items' => $items,
                'total_data_count' => $total
            ]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }
}
