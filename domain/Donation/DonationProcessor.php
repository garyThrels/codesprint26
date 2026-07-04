<?php

namespace Domain\Donation;

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
        return DB::transaction(function () use ($data) {
            // 1. Create a pending donation record
            $donation = Donation::create([
                'campaign_id' => $data->campaignId,
                'amount' => $data->amount,
                'currency_id' => $data->currencyId,
                'status' => 'pending',
                'payment_method' => $data->paymentMethod,
                'donor_name' => $data->isAnonymous ? null : $data->donorName,
                'donor_email' => $data->donorEmail,
                'is_anonymous' => $data->isAnonymous,
                'is_recurring' => $data->isRecurring,
                'metadata' => [
                    'simulated' => true,
                ],
            ]);

            // 2. Process with Mastercard
            $result = $this->mastercard->process($data);

            // 3. Update donation status
            $donation->update([
                'status' => $result['success'] ? 'success' : 'failed',
                'mastercard_transaction_id' => $result['transaction_id'],
                'metadata' => array_merge($donation->metadata ?? [], [
                    'message' => $result['message'],
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
