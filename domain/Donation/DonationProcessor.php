<?php

namespace Domain\Donation;

use Domain\Campaign\Models\Campaign;
use Domain\Donation\Data\DonationRequestData;
use Domain\Donation\Models\Donation;
use Domain\Mastercard\Services\MastercardService;
use Illuminate\Support\Facades\DB;

final class DonationProcessor
{
    public function __construct(
        private readonly MastercardService $mastercard
    ) {}

    public function execute(DonationRequestData $data): Donation
    {
        // The donation is always made in the campaign's own currency, so we
        // resolve it here rather than trusting whatever the client submitted.
        $campaign = Campaign::with('currency')->findOrFail($data->campaignId);

        return DB::transaction(function () use ($data, $campaign) {
            // 1. Create a pending donation record
            $donation = Donation::create([
                'campaign_id' => $campaign->id,
                'amount' => $data->amount,
                'currency_id' => $campaign->currency_id,
                'status' => 'pending',
                'payment_method' => $data->paymentMethod,
                'donor_name' => $data->isAnonymous ? null : $data->donorName,
                'donor_email' => $data->donorEmail,
                'is_anonymous' => $data->isAnonymous,
                'is_recurring' => $data->isRecurring,
                'metadata' => [],
            ]);

            // 2. Process with Mastercard (real signed call for card payments)
            $result = $this->mastercard->process($data, $campaign->currency?->code ?? 'EUR');

            // 3. Update donation status, keeping the Mastercard response details
            $donation->update([
                'status' => $result['success'] ? 'success' : 'failed',
                'mastercard_transaction_id' => $result['transaction_id'],
                'metadata' => array_merge($donation->metadata ?? [], [
                    'message' => $result['message'],
                    'mastercard' => $result['meta'],
                ]),
            ]);

            // 4. Log the action (M2.7 Audit log)
            activity()
                ->performedOn($donation)
                ->withProperties(['amount' => $data->amount, 'status' => $donation->status])
                ->log($result['success'] ? 'Donation processed successfully' : 'Donation failed');

            return $donation;
        });
    }
}
