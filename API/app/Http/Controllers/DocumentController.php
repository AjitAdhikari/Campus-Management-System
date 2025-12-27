<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DocumentController extends Controller
{
    // POST: Create Document
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'file'        => 'required|file|max:10240', // max 10MB, adjust as needed
        ]);

        try {
            $file = $request->file('file');
            $path = $file->store('documents', 'public');

            $entity = new Document();
            $entity->name        = $validated['name'];
            $entity->description = $validated['description'] ?? null;
            $entity->type        = $file->getClientMimeType();
            $entity->size        = $file->getSize();
            $entity->path        = $path;
            $entity->created_by  = Auth::id();
            $entity->save();

            return response()->json($entity, Response::HTTP_CREATED);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Document (no file upload here, just metadata)
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id'          => 'required|exists:documents,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'path'        => 'nullable|string|max:255',
            'type'        => 'nullable|string|max:255',
            'size'        => 'nullable|integer',
        ]);

        try {
            $entity = Document::findOrFail($validated['id']);
            $entity->name        = $validated['name'];
            $entity->description = $validated['description'] ?? $entity->description;
            $entity->path        = $validated['path'] ?? $entity->path;
            $entity->type        = $validated['type'] ?? $entity->type;
            $entity->size        = $validated['size'] ?? $entity->size;
            $entity->updated_by  = Auth::id();
            $entity->updated_at  = now();
            $entity->save();

            return response()->json(['message' => 'Updated successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // DELETE: Delete Document by ID
    public function delete($id)
    {
        try {
            $document = Document::findOrFail($id);

            // Delete file from storage if exists
            if ($document->path && Storage::disk('public')->exists($document->path)) {
                Storage::disk('public')->delete($document->path);
            }

            $document->delete();

            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Get Document by ID
    public function get($id)
    {
        try {
            $document = Document::findOrFail($id);
            return response()->json($document);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Download Document file by ID
    public function download($id)
    {
        try {
            $document = Document::findOrFail($id);

            if (!$document->path || !Storage::disk('public')->exists($document->path)) {
                return response()->json(['error' => 'File not found'], 404);
            }

            $filePath = storage_path('app/public/' . $document->path);
            $fileName = $document->name . '.' . pathinfo($document->path, PATHINFO_EXTENSION);

            return response()->download($filePath, $fileName, [
                'Content-Type' => $document->type ?? 'application/octet-stream'
            ]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

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
