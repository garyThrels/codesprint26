<?php

namespace Domain\Donation\Data;

use Spatie\LaravelData\Data;

final class CardData extends Data
{
    public function __construct(
        public string $cardNumber,
        public string $expiryMonth,
        public string $expiryYear,
        public string $cvv,
    ) {}
}
