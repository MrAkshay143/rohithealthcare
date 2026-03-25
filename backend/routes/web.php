<?php

use Illuminate\Support\Facades\Route;
use App\Models\Blog;
use App\Models\SiteSetting;

// ── robots.txt ──────────────────────────────────────────────────────────────
Route::get('/robots.txt', function () {
    $domain = SiteSetting::where('key', 'site_domain')->value('value') ?: request()->getSchemeAndHttpHost();
    if (!str_starts_with($domain, 'http')) $domain = 'https://' . $domain;
    $content = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /backend/\nSitemap: {$domain}/sitemap.xml\n";
    return response($content, 200, ['Content-Type' => 'text/plain']);
});

// ── sitemap.xml ─────────────────────────────────────────────────────────────
Route::get('/sitemap.xml', function () {
    $domain = SiteSetting::where('key', 'site_domain')->value('value') ?: request()->getSchemeAndHttpHost();
    if (!str_starts_with($domain, 'http')) $domain = 'https://' . $domain;
    $domain = rtrim($domain, '/');

    $static = ['', '/about', '/services', '/doctors', '/gallery', '/blogs', '/contact'];
    $blogs  = Blog::where('draft', false)->select('slug', 'id', 'createdAt')->get();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($static as $path) {
        $xml .= "  <url><loc>{$domain}{$path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n";
    }
    foreach ($blogs as $blog) {
        $slug = $blog->slug ?: $blog->id;
        $date = date('Y-m-d', strtotime($blog->createdAt ?? 'now'));
        $xml .= "  <url><loc>{$domain}/blogs/{$slug}</loc><lastmod>{$date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n";
    }
    $xml .= '</urlset>';
    return response($xml, 200, ['Content-Type' => 'application/xml']);
});

// ── Fallback: redirect any /backend/* hit to frontend home ──────────────────
Route::fallback(function () {
    try {
        $domain = \App\Models\SiteSetting::where('key', 'site_domain')->value('value') ?: request()->getSchemeAndHttpHost();
        // Ensure it has a scheme — bare domain like "rohithealthcare.com" needs https://
        if (!str_starts_with($domain, 'http')) {
            $domain = 'https://' . $domain;
        }
        return redirect(rtrim($domain, '/'));
    } catch (\Exception $e) {
        // DB might not be ready
    }

    return redirect(env('FRONTEND_URL', request()->getSchemeAndHttpHost()));
});

