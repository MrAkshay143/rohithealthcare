<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Traits\DeletesLocalFiles;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use DeletesLocalFiles;

    public function index(Request $request)
    {
        $query = Blog::query();

        // By default, exclude drafts (public pages). Admin can pass includeDrafts=true
        if ($request->query('includeDrafts') !== 'true') {
            $query->where('draft', false);
        }

        $allowed = ['id', 'title', 'createdAt', 'created_at', 'slug'];
        $orderBy = in_array($request->query('orderBy'), $allowed) ? $request->query('orderBy') : 'createdAt';
        $orderDir = in_array($raw = strtolower($request->query('orderDir', 'desc')), ['asc', 'desc']) ? $raw : 'desc';
        $query->orderBy($orderBy, $orderDir);

        $take = $request->query('take');
        if ($take) {
            $query->take((int) $take);
        }

        $select = $request->query('select');
        if ($select) {
            $fields = explode(',', $select);
            $query->select($fields);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'imageUrl' => 'nullable|string|max:500',
            'videoUrl' => 'nullable|string|max:500',
            'draft' => 'sometimes|boolean',
        ]);

        $slug = $this->generateUniqueSlug($validated['title']);
        $validated['slug'] = $slug;
        $validated['draft'] = $validated['draft'] ?? false;
        $validated['createdAt'] = now();

        $blog = Blog::create($validated);
        return response()->json($blog, 201);
    }

    public function show(string $slugOrId)
    {
        $blog = is_numeric($slugOrId)
            ? Blog::where('id', (int) $slugOrId)->where('draft', false)->first()
            : Blog::where('slug', $slugOrId)->where('draft', false)->first();

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        return response()->json($blog);
    }

    public function update(Request $request, int $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'imageUrl' => 'nullable|string|max:500',
            'videoUrl' => 'nullable|string|max:500',
            'draft'    => 'sometimes|boolean',
        ]);

        $validated['draft'] = $validated['draft'] ?? false;

        // Soft-delete old image file when the image URL changes
        if (isset($validated['imageUrl']) && $validated['imageUrl'] !== $blog->imageUrl) {
            $this->deleteLocalFile($blog->imageUrl);
        }

        $blog->update($validated);
        return response()->json($blog);
    }

    public function destroy(int $id)
    {
        try {
            $blog = Blog::findOrFail($id);
            $this->deleteLocalFile($blog->imageUrl);
            $blog->delete();
            return response()->json(['success' => 'Blog post deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function count()
    {
        return response()->json(['count' => Blog::count()]);
    }

    private function slugify(string $text): string
    {
        $slug = Str::lower(trim($text));
        $slug = preg_replace('/[^\w\s-]/', '', $slug);
        $slug = preg_replace('/[\s_]+/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        return Str::limit($slug, 80, '');
    }

    private function generateUniqueSlug(string $title): string
    {
        $slug = $this->slugify($title);
        $existingSlugs = Blog::pluck('slug')->toArray();

        if (!in_array($slug, $existingSlugs)) {
            return $slug;
        }

        $i = 2;
        while (in_array("{$slug}-{$i}", $existingSlugs)) {
            $i++;
        }
        return "{$slug}-{$i}";
    }
}
