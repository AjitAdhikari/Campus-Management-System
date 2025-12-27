<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
     // POST: Create Inventory
    public function create(Request $request)
    {
        try {
            $entity = new Inventory();
            $entity->name        = $request->name;
            $entity->description = $request->description;
            $entity->code        = $request->code;
            $entity->quantity    = $request->quantity;
            $entity->created_by  = Auth::id();

            if ($request->hasFile('imageFile')) {
                $path = $request->file('imageFile')->store('public');
                $entity->image_url = $path;
            }

            $entity->save();

            return response()->json($entity);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Inventory
    public function store(Request $request)
    {
        try {
            $entity = Inventory::findOrFail($request->id);
            $entity->name        = $request->name;
            $entity->description = $request->description;
            $entity->code        = $request->code;
            $entity->quantity    = $request->quantity;
            $entity->image_url       = $request->image_url; // keep old image if not replaced
            $entity->updated_by  = Auth::id();
            $entity->updated_at  = now();

            if ($request->hasFile('image_file')) {
                if ($entity->image_url && Storage::disk('public')->exists($entity->image_url)) {
                    Storage::disk('public')->delete($entity->image_url);
                }
                $path = $request->file('image_file')->store('inventories', 'public');
                $entity->image_url = $path;
            }

            $entity->save();

            return response()->json(['message' => 'Updated successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // DELETE: Delete Inventory
    public function destroy($id)
    {
        try {
            $inventory = Inventory::findOrFail($id);

            if ($inventory->image && Storage::disk('public')->exists($inventory->image)) {
                Storage::disk('public')->delete($inventory->image);
            }

            $inventory->delete();

            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Get Inventory by ID
    public function get($id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            return response()->json($inventory);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: List Inventory with filters
    public function index(Request $request)
    {
        try {
            $query = Inventory::query();

            if (!empty($request->name)) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            if (!empty($request->code)) {
                $query->where('code', 'like', '%' . $request->code . '%');
            }

            $offset = $request->offset ?? 0;
            $limit  = $request->limit ?? 10;

            $items = $query->offset($offset)->limit($limit)->get();
            $total = $query->count();

            return response()->json([
                'items' => $items,
                'total_data_count' => $total
            ]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }
}
