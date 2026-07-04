<?php

namespace App\Services\Mastercard;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Mastercard\Developer\OAuth\OAuth;
use Mastercard\Developer\OAuth\Utils\AuthenticationUtils;
use OpenSSLAsymmetricKey;
use RuntimeException;

/**
 * Thin wrapper around the Mastercard Donate sandbox API.
 *
 * Every request is signed with OAuth 1.0a using the consumer key and the
 * PKCS#12 signing key issued by the Mastercard developer portal. The signature
 * covers the fully-qualified URL (including query string) and the raw body, so
 * the URL passed to the signer must match the URL that is actually sent.
 */
final class DonateClient
{
    private ?OpenSSLAsymmetricKey $signingKey = null;

    /**
     * @param  array{base_url: string, consumer_key: ?string, client_id?: ?string, program_id?: ?string, keystore_path: ?string, keystore_alias: string, keystore_password: string}  $config
     */
    public function __construct(private readonly array $config) {}

    /**
     * @param  array<string, mixed>  $query
     */
    public function get(string $path, array $query = []): Response
    {
        return $this->send('GET', $path, query: $query);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function post(string $path, array $payload = []): Response
    {
        return $this->send('POST', $path, payload: $payload);
    }

    /**
     * Send a signed request to the Donate API.
     *
     * @param  array<string, mixed>  $query
     * @param  array<string, mixed>|null  $payload
     */
    public function send(string $method, string $path, array $query = [], ?array $payload = null): Response
    {
        $url = $this->buildUrl($path, $query);
        $body = $payload === null ? '' : json_encode($payload, JSON_THROW_ON_ERROR);

        $authorization = OAuth::getAuthorizationHeader(
            $url,
            $method,
            $body,
            $this->consumerKey(),
            $this->signingKey(),
        );

        $request = Http::withHeaders([
            'Authorization' => $authorization,
            'Accept' => 'application/json',
            ...$this->donateHeaders(),
        ])->contentType('application/json');

        if ($payload !== null) {
            $request = $request->withBody($body, 'application/json');
        }

        return $request->send($method, $url);
    }

    /**
     * Donate-specific headers required by most endpoints. The client id
     * (X-Openapi-Clientid) is mandatory; the program id is optional.
     *
     * @return array<string, string>
     */
    private function donateHeaders(): array
    {
        $headers = [];

        if (is_string($this->config['client_id'] ?? null) && $this->config['client_id'] !== '') {
            $headers['X-Openapi-Clientid'] = $this->config['client_id'];
        }

        if (is_string($this->config['program_id'] ?? null) && $this->config['program_id'] !== '') {
            $headers['X-Program-Id'] = $this->config['program_id'];
        }

        return $headers;
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function buildUrl(string $path, array $query): string
    {
        $url = mb_rtrim($this->config['base_url'], '/').'/'.mb_ltrim($path, '/');

        return $query === [] ? $url : $url.'?'.http_build_query($query);
    }

    private function consumerKey(): string
    {
        $consumerKey = $this->config['consumer_key'];

        if (! is_string($consumerKey) || $consumerKey === '') {
            throw new RuntimeException('The Mastercard consumer key is not configured (MASTERCARD_CONSUMER_KEY).');
        }

        return $consumerKey;
    }

    private function signingKey(): OpenSSLAsymmetricKey
    {
        if ($this->signingKey instanceof OpenSSLAsymmetricKey) {
            return $this->signingKey;
        }

        $path = $this->config['keystore_path'];

        if (! is_string($path) || ! is_file($path)) {
            throw new RuntimeException("The Mastercard signing key could not be found at [{$path}]. Place your .p12 file there or set MASTERCARD_KEYSTORE_PATH.");
        }

        return $this->signingKey = AuthenticationUtils::loadSigningKey(
            $path,
            $this->config['keystore_alias'],
            $this->config['keystore_password'],
        );
    }
}
