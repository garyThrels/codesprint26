<?php

namespace Domain\Donation\Data;

use Spatie\LaravelData\Data;

class DonationUpdateData extends Data
{
    public function __construct(
        public ?string $donor_name = null,
        public ?bool $is_anonymous = null,
        public ?bool $gift_aid_enabled = null,
        public ?string $gift_aid_name = null,
        public ?string $gift_aid_address = null,
    ) {}
}
