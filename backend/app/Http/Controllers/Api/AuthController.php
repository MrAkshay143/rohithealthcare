<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = AdminUser::where('username', $validated['username'])->first();

        if ($admin && $admin->password === $validated['password']) {
            $cookie = Cookie::make(
                'admin_session',
                'true',
                120, // minutes
                '/',
                null,
                $request->secure(),
                true, // httpOnly
                false,
                'lax'
            );

            return response()->json(['success' => true])
                ->withCookie($cookie);
        }

        return response()->json(['error' => 'InvalidCredentials'], 401);
    }

    public function logout()
    {
        $cookie = Cookie::forget('admin_session');
        return response()->json(['success' => true])->withCookie($cookie);
    }

    public function check(Request $request)
    {
        $session = $request->cookie('admin_session');
        if ($session === 'true') {
            $admin = AdminUser::first();
            if ($admin) {
                return response()->json([
                    'authenticated' => true,
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'password' => $admin->password,
                ]);
            }
        }
        return response()->json(['authenticated' => false], 401);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:6',
        ]);

        $admin = AdminUser::first();

        if (!$admin || $admin->password !== $validated['currentPassword']) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }

        $admin->update(['password' => $validated['newPassword']]);

        return response()->json(['success' => 'Password changed successfully']);
    }
}
