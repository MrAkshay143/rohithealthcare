<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Traits\DeletesLocalFiles;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    use DeletesLocalFiles;

    public function index()
    {
        $slides = HeroSlide::orderBy('order', 'asc')
            ->orderBy('createdAt', 'asc')
            ->get();
        return response()->json($slides);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'imageUrl' => 'required|string|max:500',
            'alt' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        $validated['alt'] = $validated['alt'] ?? 'Hero slide';
        $validated['order'] = $validated['order'] ?? 0;
        $validated['createdAt'] = now();

        $slide = HeroSlide::create($validated);
        return response()->json($slide, 201);
    }

    public function show(int $id)
    {
        $slide = HeroSlide::findOrFail($id);
        return response()->json($slide);
    }

    public function update(Request $request, int $id)
    {
        $slide = HeroSlide::findOrFail($id);

        $validated = $request->validate([
            'imageUrl' => 'required|string|max:500',
            'alt' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        $validated['alt'] = $validated['alt'] ?? 'Hero slide';
        $validated['order'] = $validated['order'] ?? 0;

        // Soft-delete old image file when the image URL changes
        if ($validated['imageUrl'] !== $slide->imageUrl) {
            $this->deleteLocalFile($slide->imageUrl);
        }

        $slide->update($validated);
        return response()->json($slide);
    }

    public function destroy(int $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $this->deleteLocalFile($slide->imageUrl);
        $slide->delete();
        return response()->json(['success' => 'Slide deleted']);
    }

    public function count()
    {
        return response()->json(['count' => HeroSlide::count()]);
    }
}
