<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HeroSlideController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\NavLinkController;
use App\Http\Controllers\Api\HomeBundleController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Bundled homepage data (single request for all homepage data)
Route::get('/home-bundle', [HomeBundleController::class, 'index']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/check', [AuthController::class, 'check']);

// Public data endpoints (used by React frontend pages)
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slugOrId}', [BlogController::class, 'show']);

Route::get('/gallery', [GalleryController::class, 'index']);

Route::get('/hero-slides', [HeroSlideController::class, 'index']);

Route::get('/content', [ContentController::class, 'index']);
Route::get('/content/defaults', [ContentController::class, 'defaults']);

Route::get('/settings', [SettingController::class, 'index']);

// Public services
Route::get('/services', [ServiceController::class, 'index']);

// Public nav links
Route::get('/nav-links', [NavLinkController::class, 'index']);

// Public enquiry submission
Route::post('/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:enquiry');

/*
|--------------------------------------------------------------------------
| Protected Admin API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(\App\Http\Middleware\AdminAuth::class)->group(function () {
    // Dashboard
    Route::get('/admin/stats', [DashboardController::class, 'stats']);

    // Doctors CRUD
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{id}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
    Route::post('/doctors/reorder', [DoctorController::class, 'reorder']);

    // Blogs CRUD
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

    // Gallery CRUD
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{id}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);

    // Hero Slides CRUD
    Route::post('/hero-slides', [HeroSlideController::class, 'store']);
    Route::put('/hero-slides/{id}', [HeroSlideController::class, 'update']);
    Route::delete('/hero-slides/{id}', [HeroSlideController::class, 'destroy']);

    // Content management
    Route::get('/content/list', [ContentController::class, 'list']);
    Route::post('/content', [ContentController::class, 'upsert']);
    Route::post('/content/bulk', [ContentController::class, 'bulkUpsert']);
    Route::post('/content/reset', [ContentController::class, 'resetAll']);

    // Settings
    Route::post('/settings', [SettingController::class, 'upsert']);
    Route::post('/settings/logo', [SettingController::class, 'saveLogo']);

    // Password
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Upload
    Route::post('/upload', [UploadController::class, 'store']);

    // Enquiries management
    Route::get('/enquiries', [EnquiryController::class, 'index']);
    Route::get('/enquiries/stats', [EnquiryController::class, 'stats']);
    Route::get('/enquiries/{id}', [EnquiryController::class, 'show']);
    Route::get('/enquiries/{id}/messages', [EnquiryController::class, 'messages']);
    Route::post('/enquiries/{id}/messages', [EnquiryController::class, 'addMessage']);
    Route::post('/enquiries/test-smtp', [EnquiryController::class, 'testSmtp']);
    Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy']);

    // Services CRUD
    Route::get('/services/all', [ServiceController::class, 'all']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    Route::post('/services/reorder', [ServiceController::class, 'reorder']);

    // Nav Links CRUD
    Route::get('/admin/nav-links', [NavLinkController::class, 'adminIndex']);
    Route::post('/nav-links', [NavLinkController::class, 'store']);
    Route::put('/nav-links/reorder', [NavLinkController::class, 'reorder']);
    Route::put('/nav-links/{id}', [NavLinkController::class, 'update']);
    Route::delete('/nav-links/{id}', [NavLinkController::class, 'destroy']);
});
