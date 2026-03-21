<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavLink;
use Illuminate\Http\Request;

class NavLinkController extends Controller
{
    /**
     * GET /nav-links
     * Public: returns all visible links (optionally filtered by ?type=navbar|footer).
     * Admin list (all): pass ?all=1 from protected routes.
     */
    public function index(Request $request)
    {
        $query = NavLink::orderBy('order', 'asc')->orderBy('id', 'asc');

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        // Public access only sees visible links unless ?all=1 (from admin)
        if ($request->input('all') !== '1') {
            $query->where('is_visible', true);
        }

        return response()->json($query->get());
    }

    /**
     * GET /admin/nav-links - Returns ALL links (including hidden) for admin panel.
     */
    public function adminIndex(Request $request)
    {
        $query = NavLink::orderBy('type', 'asc')->orderBy('order', 'asc')->orderBy('id', 'asc');

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'             => 'required|in:navbar,footer',
            'label'            => 'required|string|max:255',
            'url'              => 'required|string|max:500',
            'order'            => 'nullable|integer',
            'is_visible'       => 'nullable|boolean',
            'open_new_tab'     => 'nullable|boolean',
            'desktop_visible'  => 'nullable|boolean',
            'mobile_visible'   => 'nullable|boolean',
        ]);

        // Auto-set order to end of the list if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = NavLink::where('type', $validated['type'])->max('order') + 1;
        }

        $link = NavLink::create($validated);
        return response()->json($link, 201);
    }

    public function update(Request $request, int $id)
    {
        $link = NavLink::findOrFail($id);

        $validated = $request->validate([
            'type'             => 'sometimes|in:navbar,footer',
            'label'            => 'sometimes|string|max:255',
            'url'              => 'sometimes|string|max:500',
            'order'            => 'sometimes|integer',
            'is_visible'       => 'sometimes|boolean',
            'open_new_tab'     => 'sometimes|boolean',
            'desktop_visible'  => 'sometimes|boolean',
            'mobile_visible'   => 'sometimes|boolean',
        ]);

        $link->update($validated);
        return response()->json($link);
    }

    public function destroy(int $id)
    {
        $link = NavLink::findOrFail($id);
        $link->delete();
        return response()->json(['success' => 'Link deleted']);
    }

    /**
     * PUT /admin/nav-links/reorder
     * Body: { items: [{ id: int, order: int }, ...] }
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items'          => 'required|array|min:1',
            'items.*.id'     => 'required|integer|exists:nav_links,id',
            'items.*.order'  => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            NavLink::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => 'Reordered']);
    }
}

