<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $photos = Gallery::orderBy('id', 'desc')->get();
        return response()->json($photos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'imageUrl' => 'required|string|max:500',
        ]);

        $photo = Gallery::create($validated);
        return response()->json($photo, 201);
    }

    public function show(int $id)
    {
        $photo = Gallery::findOrFail($id);
        return response()->json($photo);
    }

    public function update(Request $request, int $id)
    {
        $photo = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'imageUrl' => 'required|string|max:500',
        ]);

        $photo->update($validated);
        return response()->json($photo);
    }

    public function destroy(int $id)
    {
        $photo = Gallery::findOrFail($id);
        $photo->delete();
        return response()->json(['success' => 'Photo deleted']);
    }

    public function count()
    {
        return response()->json(['count' => Gallery::count()]);
    }
}
