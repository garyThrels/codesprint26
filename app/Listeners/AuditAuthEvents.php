<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Laravel\Fortify\Events\TwoFactorAuthenticationDisabled;
use Laravel\Fortify\Events\TwoFactorAuthenticationEnabled;
use Laravel\Fortify\Events\RecoveryCodesGenerated;

class AuditAuthEvents
{
    /**
     * Handle the event.
     */
    public function handle(
        Login|Logout|PasswordReset|TwoFactorAuthenticationEnabled|TwoFactorAuthenticationDisabled|RecoveryCodesGenerated $event
    ): void {
        $description = match (true) {
            $event instanceof Login => 'User logged in',
            $event instanceof Logout => 'User logged out',
            $event instanceof PasswordReset => 'User reset password',
            $event instanceof TwoFactorAuthenticationEnabled => 'Two-factor authentication enabled',
            $event instanceof TwoFactorAuthenticationDisabled => 'Two-factor authentication disabled',
            $event instanceof RecoveryCodesGenerated => 'Two-factor recovery codes regenerated',
        };

        activity()
            ->causedBy($event->user)
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log($description);
    }
}
