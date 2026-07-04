<?php

namespace App\Http\Controllers;

use Domain\Donation\Data\DonationRequestData;
use Domain\Donation\Data\DonationUpdateData;
use Domain\Donation\DonationProcessor;
use Domain\Donation\Enums\DonationStatus;
use Domain\Donation\Models\Donation;
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
            return back()
                ->with('success', 'Thank you for your donation!')
                ->with('donation_id', $donation->id);
        }

        return back()->with('error', 'There was an issue processing your donation. Please try again.');
    }

    public function update(Donation $donation, DonationUpdateData $data): RedirectResponse
    {
        $updateData = array_filter($data->toArray(), fn ($value) => $value !== null);

        if (isset($updateData['gift_aid_enabled']) && $updateData['gift_aid_enabled']) {
            $updateData['gift_aid_amount'] = (int) round($donation->amount * 0.25);
            $updateData['total_benefit_amount'] = (int) round($donation->amount * 1.25);
        }

        $donation->update($updateData);

        return back()->with('success', 'Donation details updated successfully!');
    }
}
