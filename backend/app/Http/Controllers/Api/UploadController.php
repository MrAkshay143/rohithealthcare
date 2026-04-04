<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Sanitize folder name: only alphanumeric, dash, underscore allowed.
     */
    private function safeFolder(?string $raw): string
    {
        if (!$raw) return 'uploads';
        $clean = preg_replace('/[^a-z0-9_-]/i', '', $raw);
        return $clean ?: 'uploads';
    }

    /**
     * Build a safe filename from an optional custom name + timestamp, or a random name.
     */
    private function safeName(?string $customFilename, string $ext): string
    {
        if ($customFilename && trim($customFilename)) {
            return Str::slug($customFilename) . '-' . time() . '.' . $ext;
        }
        return time() . '-' . Str::random(6) . '.' . $ext;
    }

    /**
     * Store uploaded file.
     * Saves to storage/app/public/{folder}/ so files survive deployments.
     * Accepts optional: folder (e.g. "doctors"), customFilename (e.g. doctor name).
     */
    public function store(Request $request)
    {
        $request->validate([
            'file'           => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'folder'         => 'nullable|string|max:50',
            'customFilename' => 'nullable|string|max:200',
        ]);

        $file   = $request->file('file');
        $ext    = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        if ($ext === 'jpeg') $ext = 'jpg';

        $folder   = $this->safeFolder($request->input('folder'));
        $safeName = $this->safeName($request->input('customFilename'), $ext);

        $dir = storage_path('app/public/' . $folder);
        if (!is_dir($dir)) mkdir($dir, 0775, true);

        $file->move($dir, $safeName);

        return response()->json(['url' => '/backend/storage/' . $folder . '/' . $safeName]);
    }

    /**
     * Download an external image URL and store it locally.
     * Saves to storage/app/public/{folder}/ so files survive deployments.
     */
    public function fromUrl(Request $request)
    {
        $request->validate([
            'url'            => 'required|string|max:2048',
            'folder'         => 'nullable|string|max:50',
            'customFilename' => 'nullable|string|max:200',
        ]);

        $url = trim($request->input('url'));

        // Already a local path — return as-is
        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            return response()->json(['url' => $url]);
        }

        // Already stored on our own backend — return as-is
        if (str_contains($url, '/backend/uploads/') || str_contains($url, '/backend/storage/')) {
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
                'image/jpeg'    => 'jpg',
                'image/jpg'     => 'jpg',
                'image/png'     => 'png',
                'image/gif'     => 'gif',
                'image/webp'    => 'webp',
                'image/svg+xml' => 'svg',
            ];

            $ext = null;
            foreach ($mimeToExt as $mime => $e) {
                if (str_contains($contentType, $mime)) {
                    $ext = $e;
                    break;
                }
            }

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

            $folder   = $this->safeFolder($request->input('folder'));
            $safeName = $this->safeName($request->input('customFilename'), $ext);

            $dir = storage_path('app/public/' . $folder);
            if (!is_dir($dir)) mkdir($dir, 0775, true);

            file_put_contents($dir . '/' . $safeName, $response->body());

            return response()->json(['url' => '/backend/storage/' . $folder . '/' . $safeName]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Download failed: ' . $e->getMessage()], 422);
        }
    }
}
