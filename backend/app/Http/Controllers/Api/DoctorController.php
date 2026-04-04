<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Traits\DeletesLocalFiles;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    use DeletesLocalFiles;

    public function index(Request $request)
    {
        $allowed = ['id', 'name', 'specialty', 'order', 'created_at'];
        $orderBy = in_array($request->query('orderBy'), $allowed) ? $request->query('orderBy') : 'order';
        $orderDir = in_array($raw = strtolower($request->query('orderDir', 'asc')), ['asc', 'desc']) ? $raw : 'asc';
        $take = $request->query('take');

        $query = Doctor::orderBy($orderBy, $orderDir);

        if ($take) {
            $query->take((int) $take);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'specialty'     => 'required|string|max:255',
            'qualifications' => 'required|string|max:255',
            'imageUrl'      => 'nullable|string|max:500',
            'imagePosition' => 'nullable|string|max:100',
        ]);

        $doctor = Doctor::create($validated);
        return response()->json($doctor, 201);
    }

    public function show(int $id)
    {
        $doctor = Doctor::findOrFail($id);
        return response()->json($doctor);
    }

    public function update(Request $request, int $id)
    {
        $doctor = Doctor::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'specialty'     => 'required|string|max:255',
            'qualifications' => 'required|string|max:255',
            'imageUrl'      => 'nullable|string|max:500',
            'imagePosition' => 'nullable|string|max:100',
        ]);

        // Soft-delete old image file when the image URL changes
        $oldUrl = $doctor->imageUrl;
        if (array_key_exists('imageUrl', $validated) && $validated['imageUrl'] !== $oldUrl) {
            $this->deleteLocalFile($oldUrl);
        }

        $doctor->update($validated);
        return response()->json($doctor);
    }

    public function destroy(int $id)
    {
        $doctor = Doctor::findOrFail($id);
        $this->deleteLocalFile($doctor->imageUrl);
        $doctor->delete();
        return response()->json(['success' => 'Doctor removed']);
    }

    public function count()
    {
        return response()->json(['count' => Doctor::count()]);
    }

    public function reorder(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        foreach ($ids as $i => $id) {
            Doctor::where('id', $id)->update(['order' => $i]);
        }
        return response()->json(['success' => true]);
    }
}
