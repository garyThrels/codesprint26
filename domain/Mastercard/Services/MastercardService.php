<?php

namespace Domain\Mastercard\Services;

use Domain\Donation\Data\DonationRequestData;
use Illuminate\Support\Str;
use Throwable;

/**
 * Turns a donation request into a payment result.
 *
 * "Tap to pay" is always simulated because the Donate sandbox does not support
 * contactless donations. Card ("manual") payments make a real, OAuth-signed
 * call to the sandbox and reflect its response; because the sandbox account is
 * not entitled to a live donation program, that call is expected to be refused,
 * so we gracefully fall back to a local authorisation while preserving the real
 * API response for transparency and reconciliation.
 */
final class MastercardService
{
    /**
     * Guest (one-off) donation endpoint, relative to the Donate base URL.
     */
    private const string PAYMENT_PATH = 'payments/guests';

    /**
     * A card number that always simulates an issuer decline — handy for demos
     * and for exercising the failure path without depending on the sandbox.
     */
    private const string DECLINE_TEST_CARD = '0000';

    public function __construct(
        private readonly DonateClient $client
    ) {}

    /**
     * @return array{success: bool, transaction_id: string, message: string, meta: array<string, mixed>}
     */
    public function process(DonationRequestData $data, string $currency = 'EUR'): array
    {
        if ($data->paymentMethod === 'tap') {
            return $this->approve(
                'sim_tap_'.Str::random(12),
                'Tap payment approved (simulated — the Donate sandbox does not support contactless).',
                ['mode' => 'simulated', 'channel' => 'tap'],
            );
        }

        return $this->processCardPayment($data, $currency);
    }

    /**
     * @return array{success: bool, transaction_id: string, message: string, meta: array<string, mixed>}
     */
    private function processCardPayment(DonationRequestData $data, string $currency): array
    {
        if ($data->card?->cardNumber === self::DECLINE_TEST_CARD) {
            return $this->decline(
                'sim_decline_'.Str::random(12),
                'Card declined by the issuer.',
                ['mode' => 'simulated', 'channel' => 'card'],
            );
        }

        if ((bool) config('services.mastercard.simulate', false)) {
            return $this->approve(
                'sim_card_'.Str::random(12),
                'Card payment approved (simulated).',
                ['mode' => 'simulated', 'channel' => 'card'],
            );
        }

        try {
            $response = $this->client->post(self::PAYMENT_PATH, $this->buildPaymentPayload($data, $currency));
        } catch (Throwable $exception) {
            return $this->approve(
                'sim_card_'.Str::random(12),
                'Card payment approved (offline fallback — the Donate sandbox was unreachable).',
                ['mode' => 'fallback', 'channel' => 'card', 'reason' => 'connection_error', 'detail' => $exception->getMessage()],
            );
        }

        if ($response->successful()) {
            return $this->approve(
                (string) ($response->json('transactionId') ?? 'mc_'.Str::random(12)),
                'Payment authorised by the Mastercard Donate sandbox.',
                ['mode' => 'live', 'channel' => 'card', 'http_status' => $response->status()],
            );
        }

        // The sandbox was reached but refused to authorise (e.g. the client id
        // is not provisioned with a live program). Fall back so the prototype
        // flow completes, while keeping the real response for reconciliation.
        return $this->approve(
            'sim_card_'.Str::random(12),
            'Card payment approved (sandbox fallback — see captured Mastercard response).',
            [
                'mode' => 'fallback',
                'channel' => 'card',
                'http_status' => $response->status(),
                'reason_code' => $response->json('Errors.Error.0.ReasonCode'),
                'api_message' => $response->json('Errors.Error.0.Description'),
            ],
        );
    }

    /**
     * Build a guest (one-off) donation payment request for the Donate API.
     * Amounts are sent as a decimal string in major units.
     *
     * @return array<string, mixed>
     */
    private function buildPaymentPayload(DonationRequestData $data, string $currency): array
    {
        return [
            'payment' => [
                'amount' => number_format($data->amount / 100, 2, '.', ''),
                'currency' => $currency,
                'card' => [
                    'accountNumber' => $data->card?->cardNumber,
                    'expiryMonth' => $data->card?->expiryMonth,
                    'expiryYear' => $data->card?->expiryYear,
                    'securityCode' => $data->card?->cvv,
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array{success: bool, transaction_id: string, message: string, meta: array<string, mixed>}
     */
    private function approve(string $transactionId, string $message, array $meta): array
    {
        return ['success' => true, 'transaction_id' => $transactionId, 'message' => $message, 'meta' => $meta];
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array{success: bool, transaction_id: string, message: string, meta: array<string, mixed>}
     */
    private function decline(string $transactionId, string $message, array $meta): array
    {
        return ['success' => false, 'transaction_id' => $transactionId, 'message' => $message, 'meta' => $meta];
    }
}
