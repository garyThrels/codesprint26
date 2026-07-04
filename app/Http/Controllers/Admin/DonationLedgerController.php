<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Exports\ExportRowsToCsv;
use App\Http\Controllers\Controller;
use Domain\Campaign\Models\Campaign;
use Domain\Donation\Models\Donation;
use Domain\Donation\Services\DonationReceiptService;
use Domain\Mastercard\Services\DonateClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DonationLedgerController extends Controller
{
    public function __construct(
        private readonly DonationReceiptService $receipts
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/ledger/index', [
            'donations' => $this->query($request)->paginate(20)->withQueryString(),
            'campaigns' => Campaign::all(),
            'filters' => $request->only(['search', 'status', 'campaign_id', 'date_from', 'date_to', 'amount', 'amount_operator']),
        ]);
    }

    public function export(Request $request, ExportRowsToCsv $exportRowsToCsv): StreamedResponse
    {
        $headings = [
            'ID',
            'Date',
            'Donor Name',
            'Donor Email',
            'Campaign',
            'Amount',
            'Currency',
            'Amount (EUR)',
            'Status',
            'Transaction ID',
            'Anonymous',
            'Gift Aid',
        ];

        $rows = $this->query($request)->get()->map(fn (Donation $donation) => [
            $donation->id,
            $donation->created_at->toDateTimeString(),
            $donation->donor_name,
            $donation->donor_email,
            $donation->campaign->name,
            number_format($donation->amount / 100, 2),
            $donation->currency->code,
            number_format($donation->amount_in_base_currency / 100, 2),
            $donation->status->value,
            $donation->mastercard_transaction_id,
            $donation->is_anonymous ? 'Yes' : 'No',
            $donation->gift_aid_enabled ? 'Yes' : 'No',
        ]);

        $filename = 'ledger-'.now()->format('Y-m-d_His').'.csv';

        activity()
            ->withProperties([
                'filename' => $filename,
                'filters' => $request->only(['search', 'status', 'campaign_id', 'date_from', 'date_to', 'amount', 'amount_operator']),
            ])
            ->log('Exported donation ledger');

        return $exportRowsToCsv($filename, $headings, $rows);
    }

    public function update(Request $request, Donation $donation): RedirectResponse
    {
        $validated = $request->validate([
            'donor_email' => ['nullable', 'email', 'max:255'],
            'is_anonymous' => ['required', 'boolean'],
        ]);

        $donation->update($validated);

        return back()->with('success', 'Donation updated successfully.');
    }

    public function sendReceipt(Request $request, Donation $donation): RedirectResponse
    {
        $email = $request->input('email', $donation->donor_email);

        if (! $email) {
            return back()->with('error', 'No email address found for this donor.');
        }

        $this->receipts->send($donation, $email);

        return back()->with('success', 'Receipt sent successfully.');
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
                'currency' => $donation->currency->code,
                'amount_in_base_currency' => $donation->amount_in_base_currency,
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

    /**
     * @return Builder<Donation>
     */
    private function query(Request $request): Builder
    {
        return Donation::with(['campaign', 'currency'])
            ->latest()
            ->when($request->search, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('donor_name', 'like', "%{$search}%")
                        ->orWhere('donor_email', 'like', "%{$search}%")
                        ->orWhere('mastercard_transaction_id', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($request->campaign_id, fn (Builder $query, string $campaignId) => $query->where('campaign_id', $campaignId))
            ->when($request->date_from, fn (Builder $query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn (Builder $query, $date) => $query->whereDate('created_at', '<=', $date))
            ->when($request->filled('amount') && $request->amount_operator, function (Builder $query) use ($request) {
                $amountInCents = (int) round($request->amount * 100);
                $operator = match ($request->amount_operator) {
                    'gt' => '>',
                    'lt' => '<',
                    default => '=',
                };
                $query->where('amount_in_base_currency', $operator, $amountInCents);
            });
    }
}
