<?php

namespace Domain\Donation\Services;

use Domain\Donation\Models\Donation;
use Illuminate\Support\Facades\Log;

final class DonationReceiptService
{
    /**
     * Send a donation receipt to the donor.
     *
     * In a real application, this would use a Mailer or a
     * specialized receipt generation service.
     */
    public function send(Donation $donation, ?string $email = null): bool
    {
        $recipient = $email ?? $donation->donor_email;

        if (! $recipient) {
            return false;
        }

        // Simulate receipt generation
        Log::info("Generating receipt for donation #{$donation->id}...");

        // Simulate email dispatch
        Log::info("Sending receipt to {$recipient}...");

        $donation->update([
            'donor_email' => $recipient, // Ensure email is saved if it was missing
            'receipt_sent_at' => now(),
        ]);

        return true;
    }
}
