<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Mastercard\DonateClient;
use Domain\Donation\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationLedgerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Donation::with('campaign')->latest();

        if ($request->search) {
            $query->where('donor_name', 'like', "%{$request->search}%")
                ->orWhere('donor_email', 'like', "%{$request->search}%")
                ->orWhere('transaction_id', 'like', "%{$request->search}%");
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
        $donations = Donation::whereNotNull('transaction_id')->take(50)->get();

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
                'local_transaction_id' => $donation->transaction_id,
                'mastercard_transaction_id' => $donation->transaction_id,
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
