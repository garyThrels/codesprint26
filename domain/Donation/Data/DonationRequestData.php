<?php

namespace Domain\Donation\Data;

use Spatie\LaravelData\Data;

final class DonationRequestData extends Data
{
    public function __construct(
        public int $campaignId,
        public int $amount,
        public string $paymentMethod = 'tap', // tap or manual
        public ?int $currencyId = null,
        public ?CardData $card = null,
        public ?string $donorName = null,
        public ?string $donorEmail = null,
        public bool $isAnonymous = false,
        public bool $isRecurring = false,
    ) {}
}
