<?php

use Domain\Mastercard\Services\DonateClient;
use Illuminate\Support\Facades\Http;

function makeDonateClient(array $overrides = []): DonateClient
{
    return new DonateClient(array_merge([
        'base_url' => 'https://sandbox.api.mastercard.com/donation',
        'consumer_key' => 'test-consumer-key',
        'keystore_path' => null,
        'keystore_alias' => 'keyalias',
        'keystore_password' => 'password',
    ], $overrides));
}

function makeSelfSignedKeystore(string $password = 'password'): string
{
    $path = tempnam(sys_get_temp_dir(), 'mc_').'.p12';
    $privateKey = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
    $csr = openssl_csr_new(['commonName' => 'codesprint-test'], $privateKey);
    $certificate = openssl_csr_sign($csr, null, $privateKey, 1);

    openssl_pkcs12_export_to_file($certificate, $path, $privateKey, $password, ['friendly_name' => 'keyalias']);

    return $path;
}

test('it throws when the consumer key is not configured', function () {
    Http::fake();

    makeDonateClient(['consumer_key' => null])->get('donations');
})->throws(RuntimeException::class, 'consumer key');

test('it throws when the signing key file is missing', function () {
    Http::fake();

    makeDonateClient(['keystore_path' => '/tmp/does-not-exist.p12'])->get('donations');
})->throws(RuntimeException::class, 'signing key could not be found');

test('it signs and sends a request with an OAuth authorization header', function () {
    Http::fake(['*' => Http::response(['status' => 'ok'], 200)]);

    $keystore = makeSelfSignedKeystore();

    $response = makeDonateClient(['keystore_path' => $keystore])
        ->post('donations', ['amount' => 1000, 'currency' => 'EUR']);

    expect($response->json('status'))->toBe('ok');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://sandbox.api.mastercard.com/donation/donations'
            && $request->method() === 'POST'
            && str_starts_with($request->header('Authorization')[0], 'OAuth ');
    });

    unlink($keystore);
});

test('it appends query parameters to the signed url', function () {
    Http::fake(['*' => Http::response([], 200)]);

    $keystore = makeSelfSignedKeystore();

    makeDonateClient(['keystore_path' => $keystore])->get('donations', ['page' => 2]);

    Http::assertSent(fn ($request) => $request->url() === 'https://sandbox.api.mastercard.com/donation/donations?page=2');

    unlink($keystore);
});
