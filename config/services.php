<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'mastercard' => [
        'base_url' => env('MASTERCARD_BASE_URL', 'https://sandbox.api.mastercard.com/donations'),
        'consumer_key' => env('MASTERCARD_CONSUMER_KEY'),
        'client_id' => env('MASTERCARD_CLIENT_ID'),
        'program_id' => env('MASTERCARD_PROGRAM_ID'),
        'keystore_path' => env('MASTERCARD_KEYSTORE_PATH', storage_path('mastercard/signing-key.p12')),
        'keystore_alias' => env('MASTERCARD_KEYSTORE_ALIAS', 'keyalias'),
        'keystore_password' => env('MASTERCARD_KEYSTORE_PASSWORD', 'keystorepassword'),
    ],

];
