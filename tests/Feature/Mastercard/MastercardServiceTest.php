<?php

use Domain\Donation\Data\CardData;
use Domain\Donation\Data\DonationRequestData;
use Domain\Mastercard\Services\DonateClient;
use Domain\Mastercard\Services\MastercardService;
use Illuminate\Support\Facades\Http;

function signingKeystore(string $password = 'password'): string
{
    $path = tempnam(sys_get_temp_dir(), 'mc_').'.p12';
    $privateKey = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
    $csr = openssl_csr_new(['commonName' => 'codesprint-test'], $privateKey);
    $certificate = openssl_csr_sign($csr, null, $privateKey, 1);
    openssl_pkcs12_export_to_file($certificate, $path, $privateKey, $password, ['friendly_name' => 'keyalias']);

    return $path;
}

function mastercardService(): MastercardService
{
    $client = new DonateClient([
        'base_url' => 'https://sandbox.api.mastercard.com/donations',
        'consumer_key' => 'test-consumer-key',
        'client_id' => 'test-client-id',
        'keystore_path' => signingKeystore(),
        'keystore_alias' => 'keyalias',
        'keystore_password' => 'password',
    ]);

    return new MastercardService($client);
}

function cardDonation(string $cardNumber = '5555444433331111'): DonationRequestData
{
    return new DonationRequestData(
        campaignId: 1,
        amount: 2500,
        paymentMethod: 'manual',
        card: new CardData(cardNumber: $cardNumber, expiryMonth: '12', expiryYear: '30', cvv: '123'),
    );
}

test('tap payments are approved as a simulated payment without any network call', function () {
    Http::fake();

    $result = mastercardService()->process(new DonationRequestData(campaignId: 1, amount: 1000, paymentMethod: 'tap'));

    expect($result['success'])->toBeTrue()
        ->and($result['meta']['mode'])->toBe('simulated')
        ->and($result['meta']['channel'])->toBe('tap');

    Http::assertNothingSent();
});

test('the 0000 test card is declined without a network call', function () {
    Http::fake();

    $result = mastercardService()->process(cardDonation('0000'));

    expect($result['success'])->toBeFalse();
    Http::assertNothingSent();
});

test('simulate mode approves card payments without calling the sandbox', function () {
    config()->set('services.mastercard.simulate', true);
    Http::fake();

    $result = mastercardService()->process(cardDonation());

    expect($result['success'])->toBeTrue()
        ->and($result['meta']['mode'])->toBe('simulated');

    Http::assertNothingSent();
});

test('a live sandbox approval is reflected in the result', function () {
    config()->set('services.mastercard.simulate', false);
    Http::fake(['*' => Http::response(['transactionId' => 'MC-LIVE-123'], 200)]);

    $result = mastercardService()->process(cardDonation(), 'EUR');

    expect($result['success'])->toBeTrue()
        ->and($result['transaction_id'])->toBe('MC-LIVE-123')
        ->and($result['meta']['mode'])->toBe('live');

    Http::assertSent(fn ($request) => str_contains($request->url(), 'payments/guests') && $request->method() === 'POST');
});

test('a refused sandbox call falls back to a local approval but keeps the api response', function () {
    config()->set('services.mastercard.simulate', false);
    Http::fake(['*' => Http::response([
        'Errors' => ['Error' => [['ReasonCode' => 'DECLINED', 'Description' => 'Unauthorized - Access Not Granted']]],
    ], 401)]);

    $result = mastercardService()->process(cardDonation(), 'EUR');

    expect($result['success'])->toBeTrue()
        ->and($result['meta']['mode'])->toBe('fallback')
        ->and($result['meta']['http_status'])->toBe(401)
        ->and($result['meta']['reason_code'])->toBe('DECLINED');
});
