<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('enquiry', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // Automatically clear home cache when models are updated
        $clearCache = function () {
            \Illuminate\Support\Facades\Cache::forget('home_bundle_v3');
            \Illuminate\Support\Facades\Cache::forget('home_bundle');
        };

        $models = [
            \App\Models\Blog::class,
            \App\Models\Doctor::class,
            \App\Models\HeroSlide::class,
            \App\Models\Service::class,
            \App\Models\SiteContent::class,
            \App\Models\SiteSetting::class,
        ];

        foreach ($models as $model) {
            $model::saved($clearCache);
            $model::deleted($clearCache);
        }
    }
}
