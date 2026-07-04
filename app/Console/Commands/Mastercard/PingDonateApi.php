<?php

namespace App\Console\Commands\Mastercard;

use Domain\Mastercard\Services\DonateClient;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

#[Signature('mastercard:ping {path? : Donate API path to call, relative to the base URL} {--method=GET : HTTP method to use}')]
#[Description('Send a signed request to the Mastercard Donate sandbox to verify your credentials and signing key.')]
final class PingDonateApi extends Command
{
    /**
     * A no-encryption GET endpoint that only needs the client id header, so it
     * is a safe default for verifying connectivity, signing and credentials.
     */
    private const string DEFAULT_PATH = 'transactions?transactionId=smoke-test';

    public function handle(DonateClient $client): int
    {
        if (blank(config('services.mastercard.client_id'))) {
            $this->warn('MASTERCARD_CLIENT_ID is not set. Most Donate endpoints require the X-Openapi-Clientid header and will reject the request without it.');
        }

        $path = (string) ($this->argument('path') ?? self::DEFAULT_PATH);
        $method = mb_strtoupper((string) $this->option('method'));

        $this->info(sprintf('Calling [%s %s]...', $method, $path === '' ? '(base URL)' : $path));

        try {
            $response = $client->send($method, $path);
        } catch (Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->line("HTTP status: {$response->status()}");
        $this->line($response->body());

        if ($response->successful()) {
            $this->info('Success: credentials, signing key and request are all working.');

            return self::SUCCESS;
        }

        // A gateway-level failure means the signature or certificate was rejected;
        // a DONATE_SERVICE business error means auth passed and the API was reached.
        $body = $response->body();
        $isAuthFailure = str_contains($body, 'AUTHENTICATION_FAILED')
            || str_contains($body, 'INVALID_KEY')
            || str_contains($body, '"Source":"Gateway"');

        if ($isAuthFailure) {
            $this->error('Auth failure: the OAuth signature or signing certificate was rejected. Check the consumer key, .p12 key and passwords.');

            return self::FAILURE;
        }

        $this->info('Signing and credentials are working — the request reached the Donate service.');
        $this->warn('The API returned a business error (see above). This is a data/config issue (e.g. missing program/charity or unknown id), not an authentication problem.');

        return self::FAILURE;
    }
}
