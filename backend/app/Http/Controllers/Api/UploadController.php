<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,gif,svg|max:5120',
        ]);

        $file = $request->file('file');
        $ext = $file->getClientOriginalExtension() ?: 'png';
        $safeName = time() . '-' . Str::random(6) . '.' . $ext;

        $file->move(public_path('uploads'), $safeName);

        return response()->json(['url' => '/uploads/' . $safeName]);
    }
}
