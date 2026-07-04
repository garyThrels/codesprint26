<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

/**
 * Sends staff to the admin portal and everyone else to the public home page
 * after a successful login.
 */
final class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        return redirect()->intended($this->homeFor($request));
    }

    private function homeFor(Request $request): string
    {
        return $request->user()?->can('access admin panel')
            ? route('admin.dashboard')
            : route('home');
    }
}
