<?php

namespace Domain\Donation;

use Domain\Campaign\Models\Campaign;
use Domain\Currency\Models\Currency;
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
        $campaign = Campaign::with(['charity.currencies', 'currency'])->findOrFail($data->campaignId);

        // Resolve the currency. Use the provided currencyId if it's supported by the charity,
        // otherwise fall back to the campaign's default currency.
        $supportedCurrencies = $campaign->charity->currencies;
        $currencyId = $data->currencyId;

        if ($currencyId && $supportedCurrencies->isNotEmpty()) {
            $isSupported = $supportedCurrencies->contains('id', $currencyId);
            if (! $isSupported) {
                $currencyId = $campaign->currency_id;
            }
        } else {
            $currencyId = $campaign->currency_id;
        }

        $currency = Currency::findOrFail($currencyId);

        return DB::transaction(function () use ($data, $campaign, $currency) {
            $giftAidAmount = $data->giftAidEnabled ? (int) round($data->amount * 0.25) : 0;
            $totalBenefitAmount = $data->amount + $giftAidAmount;

            // Calculate amount in base currency (EUR)
            // exchange_rate is expressed relative to EUR (e.g. 1 USD = 0.92 EUR)
            $amountInBaseCurrency = (int) round($data->amount * $currency->exchange_rate);

            // 1. Create a pending donation record
            $donation = Donation::create([
                'campaign_id' => $campaign->id,
                'amount' => $data->amount,
                'amount_in_base_currency' => $amountInBaseCurrency,
                'currency_id' => $currency->id,
                'status' => 'pending',
                'payment_method' => $data->paymentMethod,
                'donor_name' => $data->isAnonymous ? null : $data->donorName,
                'donor_email' => $data->donorEmail,
                'is_anonymous' => $data->isAnonymous,
                'is_recurring' => $data->isRecurring,
                'gift_aid_enabled' => $data->giftAidEnabled,
                'gift_aid_name' => $data->giftAidName,
                'gift_aid_address' => $data->giftAidAddress,
                'gift_aid_amount' => $giftAidAmount,
                'total_benefit_amount' => $totalBenefitAmount,
                'round_up' => $data->roundUp,
                'metadata' => [
                    'simulated' => true,
                ],
            ]);

            // 2. Process with Mastercard (real signed call for card payments)
            $result = $this->mastercard->process($data, $currency->code);

            // 3. Update donation status, keeping the Mastercard response details
            $donation->update([
                'status' => $result['success'] ? 'success' : 'failed',
                'mastercard_transaction_id' => $result['transaction_id'],
                'metadata' => array_merge($donation->metadata ?? [], [
                    'message' => $result['message'],
                    'mastercard' => $result['meta'],
                ]),
            ]);

            return $donation;
        });
    }
}
