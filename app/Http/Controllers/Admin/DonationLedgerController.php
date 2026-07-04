<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Domain\Donation\Models\Donation;
use Domain\Mastercard\Services\DonateClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationLedgerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Donation::with('campaign')->latest();

        if ($request->search) {
            $search = $request->search;

            $query->where(function (Builder $query) use ($search): void {
                $query->where('donor_name', 'like', "%{$search}%")
                    ->orWhere('donor_email', 'like', "%{$search}%")
                    ->orWhere('mastercard_transaction_id', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->campaign_id) {
            $query->where('campaign_id', $request->campaign_id);
        }

        return Inertia::render('admin/ledger/index', [
            'donations' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'campaign_id']),
        ]);
    }

    public function reconciliation(DonateClient $mastercard): Response
    {
        // In a real app, we'd fetch from Mastercard API
        // $mcTransactions = $mastercard->get('/donations');

        // Simulating Mastercard response for reconciliation
        $donations = Donation::whereNotNull('mastercard_transaction_id')->take(50)->get();

        $comparison = $donations->map(function ($donation) {
            // Simulate that 5% of transactions might have a discrepancy (e.g. status mismatch)
            $isMatch = true;
            $discrepancy = null;

            if ($donation->id % 20 === 0) {
                $isMatch = false;
                $discrepancy = 'Status Mismatch: Local SUCCESS, Mastercard PENDING';
            }

            return [
                'id' => $donation->id,
                'local_transaction_id' => $donation->mastercard_transaction_id,
                'mastercard_transaction_id' => $donation->mastercard_transaction_id,
                'amount' => $donation->amount,
                'local_status' => $donation->status,
                'mastercard_status' => $isMatch ? $donation->status : 'pending',
                'is_match' => $isMatch,
                'discrepancy' => $discrepancy,
            ];
        });

        return Inertia::render('admin/ledger/reconciliation', [
            'comparison' => $comparison,
        ]);
    }
}
