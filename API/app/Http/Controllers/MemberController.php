<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{

    // POST: Create Member
    public function create(Request $request)
    {
        $validated = $request->validate([
            'first_name'           => 'required|string|max:255',
            'last_name'            => 'required|string|max:255',
            'email'                => 'nullable|email|max:255|unique:members,email',
            'membership_date'      => 'nullable|date',
            'baptized_date'        => 'nullable|date',
            'permanent_address'    => 'nullable|string|max:500',
            'temporary_address'    => 'nullable|string|max:500',
            'gender'               => 'nullable|in:male,female,other',
            'middle_name'          => 'nullable|string|max:255',
            'phone_number'         => 'nullable|string|max:20',
            'secondary_phone_number'=> 'nullable|string|max:20',
            'birth_date'           => 'nullable|date',
            'occupation'           => 'nullable|string|max:255',
            'photo_file'           => 'nullable|file|image|max:2048', // max 2MB image
        ]);

        try {
            $entity = new Member();
            $entity->first_name            = $validated['first_name'];
            $entity->last_name             = $validated['last_name'];
            $entity->email                 = $validated['email'] ?? null;
            $entity->membership_date       = $validated['membership_date'] ?? null;
            $entity->baptized_date         = $validated['baptized_date'] ?? null;
            $entity->permanent_address     = $validated['permanent_address'] ?? "";
            $entity->temporary_address     = $validated['temporary_address'] ?? "";
            $entity->gender                = $validated['gender'] ?? "";
            $entity->middle_name           = $validated['middle_name'] ?? "";
            $entity->phone_number          = $validated['phone_number'] ?? "";
            $entity->secondary_phone_number= $validated['secondary_phone_number'] ?? "";
            $entity->birth_date            = $validated['birth_date'] ?? "";
            $entity->occupation            = $validated['occupation'] ?? "";
            $entity->created_by            = 1; // Auth::id();
            $entity->group_id              = 1; // default group
            $entity->church_role           = 1; // default role
            $entity->updated_by            = 0;

            if ($request->hasFile('photo_file')) {
                $path = $request->file('photo_file')->store('members', 'public');
                $entity->photo = $path;
            }

            $entity->save();

            return response()->json($entity);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Member
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                    => 'required|uuid|exists:members,id',
            'first_name'            => 'required|string|max:255',
            'last_name'             => 'required|string|max:255',
            'email'                 => 'nullable|email|max:255|unique:members,email,' . $request->id,
            'membership_date'       => 'nullable|date',
            'baptized_date'         => 'nullable|date',
            'permanent_address'     => 'nullable|string|max:500',
            'temporary_address'     => 'nullable|string|max:500',
            'gender'                => 'nullable|in:male,female,other',
            'middle_name'           => 'nullable|string|max:255',
            'phone_number'          => 'nullable|string|max:20',
            'secondary_phone_number' => 'nullable|string|max:20',
            'birth_date'            => 'nullable|date',
            'occupation'            => 'nullable|string|max:255',
            'photo'                 => 'nullable|string|max:255',
            'photo_file'            => 'nullable|file|image|max:2048',
        ]);

        try {
            $entity = Member::findOrFail($validated['id']);
            $entity->first_name             = $validated['first_name'];
            $entity->last_name              = $validated['last_name'];
            $entity->email                  = $validated['email'] ?? null;
            $entity->membership_date        = $validated['membership_date'] ?? null;
            $entity->baptized_date          = $validated['baptized_date'] ?? null;
            $entity->permanent_address      = $validated['permanent_address'] ?? "";
            $entity->temporary_address      = $validated['temporary_address'] ?? "";
            $entity->gender                 = $validated['gender'] ?? "";
            $entity->middle_name            = $validated['middle_name'] ?? "";
            $entity->phone_number           = $validated['phone_number'] ?? "";
            $entity->secondary_phone_number = $validated['secondary_phone_number'] ?? "";
            $entity->birth_date             = $validated['birth_date'] ?? null;
            $entity->occupation             = $validated['occupation'] ?? null;
            $entity->photo                  = $validated['photo'] ?? $entity->photo;
            $entity->updated_by             = 1; //Auth::id();
            $entity->updated_at             = now();
            $entity->group_id               = 1; // default group
            $entity->church_role            = 1; // default role

            if ($request->hasFile('photo_file')) {
                if ($entity->photo && Storage::disk('public')->exists($entity->photo)) {
                    Storage::disk('public')->delete($entity->photo);
                }
                $path = $request->file('photo_file')->store('members', 'public');
                $entity->photo = $path;
            }

            $entity->save();

            return response()->json(['message' => 'Updated successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

      // DELETE: Delete Member by ID (UUID)
    public function destroy($id)
    {
        try {
            $member = Member::findOrFail($id);

            if ($member->photo && Storage::disk('public')->exists($member->photo)) {
                Storage::disk('public')->delete($member->photo);
            }

            $member->delete();

            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }



    // GET: Get Member by ID (UUID)
    public function get($id)
    {
        try {
            $member = Member::findOrFail($id);
            return response()->json($member);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: List Members with filters
    public function index(Request $request)
    {
        try {
            $query = Member::query();

            if (!empty($request->name)) {
                $query->where(function ($q) use ($request) {
                    $q->where('first_name', 'like', '%' . $request->name . '%')
                      ->orWhere('last_name', 'like', '%' . $request->name . '%')
                      ->orWhere('middle_name', 'like', '%' . $request->name . '%');
                });
            }

            if (!empty($request->phone_number)) {
                $query->where('phone_number', 'like', '%' . $request->phone_number . '%');
            }

            if (!empty($request->gender)) {
                $query->where('gender', $request->gender);
            }

            $offset = $request->offset ?? 0;
            $limit = $request->limit ?? 10;

            $total = $query->count();

            $items = $query->offset($offset)->limit($limit)->get();

            return response()->json([
                'items' => $items,
                'total_data_count' => $total,
            ]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: List Active Members (assumed active = some condition)
    public function list_active_members()
    {
        try {
            // You can adjust this condition as per your business logic
            $members = Member::where('is_active', true)
                ->select('id', 'first_name', 'last_name') // or any key-pair fields
                ->get();

            return response()->json($members);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }
}
