<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $file = $request->file('file');
        $ext = $file->getClientOriginalExtension() ?: 'png';
        $safeName = time() . '-' . Str::random(6) . '.' . $ext;

        $file->move(public_path('uploads'), $safeName);

        return response()->json(['url' => '/backend/uploads/' . $safeName]);
    }

    public function fromUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        $url = trim($request->input('url'));

        // Already a local path — return as-is
        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            return response()->json(['url' => $url]);
        }

        // Already stored on our own backend — return as-is
        if (str_contains($url, '/backend/uploads/')) {
            return response()->json(['url' => $url]);
        }

        // Basic SSRF guard: reject private / loopback hosts
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        $blocked = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
        foreach ($blocked as $b) {
            if ($host === $b || str_ends_with($host, '.local')) {
                return response()->json(['error' => 'Blocked URL'], 422);
            }
        }
        // Block private RFC-1918 ranges via IP (rough check)
        if (preg_match('/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/', $host)) {
            return response()->json(['error' => 'Blocked URL'], 422);
        }

        try {
            $response = Http::timeout(20)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; RohitHealthCare/1.0)'])
                ->get($url);

            if (!$response->successful()) {
                return response()->json(['error' => 'Remote server returned ' . $response->status()], 422);
            }

            $contentType = strtolower($response->header('Content-Type') ?? '');

            $mimeToExt = [
                'image/jpeg' => 'jpg',
                'image/jpg'  => 'jpg',
                'image/png'  => 'png',
                'image/gif'  => 'gif',
                'image/webp' => 'webp',
                'image/svg+xml' => 'svg',
            ];

            $ext = null;
            foreach ($mimeToExt as $mime => $e) {
                if (str_contains($contentType, $mime)) {
                    $ext = $e;
                    break;
                }
            }

            // Fall back to URL extension if content-type is ambiguous
            if (!$ext) {
                $urlPath = parse_url($url, PHP_URL_PATH) ?? '';
                $urlExt  = strtolower(pathinfo($urlPath, PATHINFO_EXTENSION));
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
                if (in_array($urlExt, $allowed)) {
                    $ext = ($urlExt === 'jpeg') ? 'jpg' : $urlExt;
                }
            }

            if (!$ext) {
                return response()->json(['error' => 'URL does not appear to be an image'], 422);
            }

            $safeName = time() . '-' . Str::random(6) . '.' . $ext;
            file_put_contents(public_path('uploads') . '/' . $safeName, $response->body());

            return response()->json(['url' => '/backend/uploads/' . $safeName]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Download failed: ' . $e->getMessage()], 422);
        }
    }
}
