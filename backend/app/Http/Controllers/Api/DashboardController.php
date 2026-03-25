<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Doctor;
use App\Models\Gallery;
use App\Models\HeroSlide;
use App\Models\SiteContent;
use App\Models\Service;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'doctors' => Doctor::count(),
            'blogs' => Blog::count(),
            'gallery' => Gallery::count(),
            'heroSlides' => HeroSlide::count(),
            'content' => SiteContent::count(),
            'services' => Service::count(),
        ]);
    }
}
