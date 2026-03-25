<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Models\Blog;
use App\Models\Doctor;
use App\Models\HeroSlide;
use App\Models\Service;
use App\Models\SiteContent;
use App\Models\SiteSetting;

class HomeBundleController extends Controller
{
    public function index()
    {
        $bundle = Cache::remember('home_bundle_v3', 3600, function () {
            // Build content map: key => value from site_contents table
            $contentMap = SiteContent::all()->pluck('value', 'key')->toArray();

            // Merge in site_settings (same key=>value pattern, settings override if conflict)
            $settingsMap = SiteSetting::all()->pluck('value', 'key')->toArray();
            $contentMap = array_merge($contentMap, $settingsMap);

            return [
                'content'    => $contentMap,
                'heroSlides' => HeroSlide::orderBy('order', 'asc')->get()->values()->toArray(),
                'doctors'    => Doctor::orderBy('order', 'asc')->get()->values()->toArray(),
                'services'   => Service::orderBy('order', 'asc')->get()->values()->toArray(),
                'blogs'      => Blog::where('draft', false)
                                    ->orderBy('createdAt', 'desc')
                                    ->take(3)
                                    ->get()->values()->toArray(),
            ];
        });

        return response()->json($bundle)->withHeaders([
            'Cache-Control' => 'private, no-store, no-cache, must-revalidate, max-age=0',
            'Pragma'        => 'no-cache',
            'Expires'       => '0',
        ]);
    }
}

