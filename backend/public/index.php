<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Fix SCRIPT_NAME so Symfony correctly computes base URL as "/backend" when deployed to a subdirectory.
// Without this, Symfony returns an empty baseUrl and routes like /api/content are not found.
if (isset($_SERVER['REQUEST_URI']) && str_starts_with($_SERVER['REQUEST_URI'], '/backend/')) {
    $_SERVER['SCRIPT_NAME'] = '/backend/index.php';
    $_SERVER['PHP_SELF'] = '/backend/index.php';
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
