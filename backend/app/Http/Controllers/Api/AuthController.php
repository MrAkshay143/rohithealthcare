<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = AdminUser::where('username', $validated['username'])->first();

        $isValid = false;
        if ($admin) {
            // Support both bcrypt-hashed and legacy plain-text passwords
            if (Str::startsWith($admin->password, '$2y$') || Str::startsWith($admin->password, '$argon2')) {
                $isValid = Hash::check($validated['password'], $admin->password);
            } else {
                $isValid = ($admin->password === $validated['password']);
            }
        }

        if ($isValid) {
            // Generate a secure random session token
            $rawToken = Str::random(64);
            $hashedToken = hash('sha256', $rawToken);

            // Store hashed token in DB
            $admin->update(['session_token' => $hashedToken]);

            // Put raw token in cookie (httpOnly, secure, samesite=lax)
            $cookie = Cookie::make(
                'admin_session',
                $rawToken,
                120, // 2 hours
                '/',
                null,
                $request->secure(),
                true,  // httpOnly
                false,
                'lax'
            );

            return response()->json(['success' => true])->withCookie($cookie);
        }

        return response()->json(['error' => 'InvalidCredentials'], 401);
    }

    public function logout(Request $request)
    {
        // Clear the session token from DB
        $rawToken = $request->cookie('admin_session');
        if ($rawToken) {
            $hashed = hash('sha256', $rawToken);
            AdminUser::where('session_token', $hashed)->update(['session_token' => null]);
        }

        $cookie = Cookie::forget('admin_session');
        return response()->json(['success' => true])->withCookie($cookie);
    }

    public function check(Request $request)
    {
        $rawToken = $request->cookie('admin_session');
        if ($rawToken) {
            $hashed = hash('sha256', $rawToken);
            $admin = AdminUser::where('session_token', $hashed)->first();
            if ($admin) {
                return response()->json([
                    'authenticated' => true,
                    'id'            => $admin->id,
                    'username'      => $admin->username,
                ]);
            }
        }
        return response()->json(['authenticated' => false], 401);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword'     => 'required|string|min:6',
        ]);

        $admin = AdminUser::first();
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 422);
        }

        $isValid = false;
        if (Str::startsWith($admin->password, '$2y$') || Str::startsWith($admin->password, '$argon2')) {
            $isValid = Hash::check($validated['currentPassword'], $admin->password);
        } else {
            $isValid = ($admin->password === $validated['currentPassword']);
        }

        if (!$isValid) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }

        $admin->update(['password' => Hash::make($validated['newPassword'])]);

        return response()->json(['success' => 'Password changed successfully']);
    }
}
