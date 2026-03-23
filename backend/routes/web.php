<?php

use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    try {
        $domain = \App\Models\SiteSetting::where('key', 'site_domain')->value('value');
        if ($domain) {
            return redirect(rtrim($domain, '/'));
        }
    } catch (\Exception $e) {
        // DB might not be ready
    }
    
    return redirect(env('FRONTEND_URL', 'https://rhc.imakshay.in'));
});
