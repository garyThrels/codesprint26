<?php

namespace App\Http\Controllers;

use Domain\Donation\Data\DonationRequestData;
use Domain\Donation\DonationProcessor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function __construct(
        private readonly DonationProcessor $processor
    ) {}

    public function store(DonationRequestData $data): \Illuminate\Http\RedirectResponse
    {
        $donation = $this->processor->execute($data);

        if ($donation->status === 'success') {
            return back()->with('success', 'Thank you for your donation!');
        }

        return back()->with('error', 'There was an issue processing your donation. Please try again.');
    }
}
