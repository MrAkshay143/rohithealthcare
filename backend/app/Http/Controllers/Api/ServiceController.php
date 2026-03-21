<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(
            Service::where('visible', true)->orderBy('order')->get()
        );
    }

    public function all()
    {
        return response()->json(Service::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'icon' => 'required|string|max:100',
            'visible' => 'boolean',
        ]);

        $maxOrder = Service::max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;

        $service = Service::create($validated);
        return response()->json($service, 201);
    }

    public function update(Request $request, int $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'icon' => 'required|string|max:100',
            'visible' => 'boolean',
        ]);

        $service->update($validated);
        return response()->json($service);
    }

    public function destroy(int $id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['success' => 'Service removed']);
    }

    public function reorder(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        foreach ($ids as $i => $id) {
            Service::where('id', $id)->update(['order' => $i]);
        }
        return response()->json(['success' => true]);
    }
}
