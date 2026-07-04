<?php

namespace App\Http\Controllers;

use Domain\Donation\Data\DonationRequestData;
use Domain\Donation\DonationProcessor;
use Domain\Donation\Enums\DonationStatus;
use Illuminate\Http\RedirectResponse;

class DonationController extends Controller
{
    public function __construct(
        private readonly DonationProcessor $processor
    ) {}

    public function store(DonationRequestData $data): RedirectResponse
    {
        $donation = $this->processor->execute($data);

        if ($donation->status === DonationStatus::Success) {
            return back()->with('success', 'Thank you for your donation!');
        }

        return back()->with('error', 'There was an issue processing your donation. Please try again.');
    }
}
