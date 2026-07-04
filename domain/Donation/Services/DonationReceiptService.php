<?php

namespace Domain\Donation\Services;

use Domain\Donation\Mail\DonationReceiptMail;
use Domain\Donation\Models\Donation;
use Illuminate\Support\Facades\Mail;

final class DonationReceiptService
{
    /**
     * Send a donation receipt to the donor.
     */
    public function send(Donation $donation, ?string $email = null): bool
    {
        $recipient = $email ?? $donation->donor_email;

        if (! $recipient) {
            return false;
        }

        // Send the real mailable
        Mail::to($recipient)->send(new DonationReceiptMail($donation));

        $donation->update([
            'donor_email' => $recipient, // Ensure email is saved if it was missing
            'receipt_sent_at' => now(),
        ]);

        return true;
    }
}
