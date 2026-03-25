<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        try {
            return response()->json(SiteSetting::all());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        if ($validated['key'] === 'allowed_domains') {
            $domains = implode(',', array_filter(array_map('trim', explode(',', $validated['value'] ?? ''))));
            if ($domains) {
                $envPath = base_path('.env');
                if (file_exists($envPath)) {
                    $envContent = file_get_contents($envPath);
                    $sanctumDomains = str_replace(['https://', 'http://', ' '], '', $domains);
                    
                    if (preg_match('/^CORS_ALLOWED_ORIGINS=.*$/m', $envContent)) {
                        $envContent = preg_replace('/^CORS_ALLOWED_ORIGINS=.*$/m', 'CORS_ALLOWED_ORIGINS="' . $domains . '"', $envContent);
                    } else {
                        $envContent .= "\nCORS_ALLOWED_ORIGINS=\"" . $domains . "\"";
                    }
                    if (preg_match('/^SANCTUM_STATEFUL_DOMAINS=.*$/m', $envContent)) {
                        $envContent = preg_replace('/^SANCTUM_STATEFUL_DOMAINS=.*$/m', 'SANCTUM_STATEFUL_DOMAINS="' . $sanctumDomains . '"', $envContent);
                    } else {
                        $envContent .= "\nSANCTUM_STATEFUL_DOMAINS=\"" . $sanctumDomains . "\"";
                    }
                    
                    file_put_contents($envPath, $envContent);
                    \Illuminate\Support\Facades\Artisan::call('config:clear');
                }
            }
        }

        return response()->json(['success' => 'Setting saved', 'setting' => $setting]);
    }

    public function saveLogo(Request $request)
    {
        $validated = $request->validate([
            'logo_url' => 'required|string|max:500',
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => 'site_logo'],
            ['value' => $validated['logo_url']]
        );

        return response()->json(['success' => 'Logo updated', 'setting' => $setting]);
    }

    /**
     * Get current database configuration from .env
     */
    public function databaseConfig()
    {
        return response()->json([
            'DB_CONNECTION' => env('DB_CONNECTION', 'sqlite'),
            'DB_HOST'       => env('DB_HOST', '127.0.0.1'),
            'DB_PORT'       => env('DB_PORT', '3306'),
            'DB_DATABASE'   => env('DB_DATABASE', ''),
            'DB_USERNAME'   => env('DB_USERNAME', 'root'),
        ]);
    }

    /**
     * Update database configuration in .env file
     */
    public function updateDatabaseConfig(Request $request)
    {
        $validated = $request->validate([
            'DB_CONNECTION' => 'required|string|in:mysql,sqlite,pgsql',
            'DB_HOST'       => 'required|string|max:255',
            'DB_PORT'       => 'required|string|max:10',
            'DB_DATABASE'   => 'required|string|max:255',
            'DB_USERNAME'   => 'required|string|max:255',
            'DB_PASSWORD'   => 'nullable|string|max:255',
        ]);

        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            return response()->json(['error' => '.env file not found'], 404);
        }

        $envContent = file_get_contents($envPath);

        foreach ($validated as $key => $value) {
            $value = $value ?? '';
            $escaped = addcslashes($value, '"');
            if (preg_match('/^' . preg_quote($key, '/') . '=(.*)$/m', $envContent)) {
                $envContent = preg_replace(
                    '/^' . preg_quote($key, '/') . '=(.*)$/m',
                    $key . '="' . $escaped . '"',
                    $envContent
                );
            } else {
                $envContent .= "\n" . $key . '="' . $escaped . '"';
            }
        }

        file_put_contents($envPath, $envContent);

        return response()->json(['success' => 'Database configuration updated. Restart the server for changes to take effect.']);
    }
}
