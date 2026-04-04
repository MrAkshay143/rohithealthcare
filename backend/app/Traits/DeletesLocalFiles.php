<?php

namespace App\Traits;

trait DeletesLocalFiles
{
    /**
     * Delete a locally stored image file when it is replaced or the record is removed.
     * Only deletes files we uploaded ourselves (paths containing /backend/storage/).
     * Silently ignores external URLs and frontend static assets like /images/*.
     */
    protected function deleteLocalFile(?string $url): void
    {
        if (!$url) return;

        // Only act on URLs that point to our own backend storage
        if (!preg_match('#(?:^|https?://[^/]+)/backend/storage/([^?#\s]+)#', $url, $m)) return;

        // Sanitize: strip any path traversal attempts
        $relativePath = preg_replace('#(\.\.[\\/]|[\\/]\.\.)+#', '', $m[1]);
        $fullPath = storage_path('app/public/' . $relativePath);

        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}
