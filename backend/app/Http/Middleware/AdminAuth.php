<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $session = $request->cookie('admin_session');
        if ($session !== 'true') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}
