<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards the admin portal. Any authenticated user holding the
 * `access admin panel` permission (granted to all staff roles) may enter;
 * everyone else is rejected with a 403.
 */
final class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(
            $request->user()?->can('access admin panel') ?? false,
            Response::HTTP_FORBIDDEN,
        );

        return $next($request);
    }
}
