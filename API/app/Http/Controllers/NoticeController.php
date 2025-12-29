<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notice;


class NoticeController extends Controller
{
    //
    public function create(Request $request)
    {
        try
        {
            $validated = $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'notice_date' => 'required|string'
            ]);

            $entity = new Notice();
            $entity->title = $validated['title'];
            $entity->description = $validated['description'];
            $entity->notice_date = $validated['notice_date'];
            $entity->created_by = 1;

            $entity->save();
            return response()->json(['message' =>'Notice Created Successfully'], 201);


        }catch(\Exception $ex)
        {
            return response()->json(['error'=> $ex->getMessage()], 400);
        }
    }

    public function update(Request $request)
    {
         try
        {
            $validated = $request->validate([
                'id' => 'required|integer',
                'title' => 'required|string',
                'description' => 'required|string',
                'notice_date' => 'required|string'
            ]);

            $entity = Notice::findOrFail($validated['id']);
            $entity->title = $validated['title'] ?? $entity->title;
            $entity->description = $validated['description'] ?? $entity->description;
            $entity->notice_date = $validated['notice_date'] ?? $entity->notice_date;

            $entity->updated_by = 1;

            $entity->save();
            return response()->json(['message' =>'Notice Created Successfully'], 201);


        }catch(\Exception $ex)
        {
            return response()->json(['error'=> $ex->getMessage()], 400);
        }
    }



    public function list(Request $request)
    {
        try
        {
            $query = Notice::query();
            $offset = $request->offset ?? 0;
            $limit = $request->limit ?? 10;

            $items = $query->offset($offset)->limit($limit)->get();

            return response()->json([
                'items' => $items
            ], 200);
        }catch(\Exception $ex)
        {
            return response()->json(['error'=> $ex->getMessage()], 400);
        }
    }

    public function get(int $id)
    {
        try
        {
            $entity = Notice::findOrFail($id)->get();
            return response()->json(['data'=> $entity], 200);

        }catch(\Exception $ex)
        {
            return response()->json(['error'=> $ex->getMessage()], 400);
        }
    }

    public function delete(int $id)
    {
        try {
            $entity = Notice::findOrFail($id);
            $entity->delete();

            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }

    }
}
