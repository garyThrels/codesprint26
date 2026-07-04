<?php

namespace Domain\Donation\Mail;

use Domain\Donation\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonationReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Donation $donation
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $charityName = $this->donation->campaign->charity->name;

        return new Envelope(
            subject: "Your Donation Receipt - {$charityName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.donations.receipt',
            with: [
                'donation' => $this->donation,
                'campaign' => $this->donation->campaign,
                'charity' => $this->donation->campaign->charity,
                'formattedAmount' => $this->formatAmount(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Format the donation amount with currency symbol.
     */
    protected function formatAmount(): string
    {
        $symbol = $this->donation->currency->symbol ?? '€';
        $amount = $this->donation->amount / 100;

        return $symbol.number_format($amount, 2);
    }
}
