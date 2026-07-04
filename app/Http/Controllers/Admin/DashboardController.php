<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Domain\Campaign\Models\Campaign;
use Domain\Donation\Models\Donation;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRaised = Donation::where('status', 'success')->sum('amount');
        $donorCount = Donation::where('status', 'success')->distinct('donor_email')->count('donor_email');
        $totalDonations = Donation::where('status', 'success')->count();
        $averageDonation = $totalDonations > 0 ? $totalRaised / $totalDonations : 0;

        $campaigns = Campaign::withCount(['donations' => function ($query) {
            $query->where('status', 'success');
        }])
            ->withSum(['donations' => function ($query) {
                $query->where('status', 'success');
            }], 'amount')
            ->with(['currency'])
            ->get()
            ->map(function ($campaign) {
                $raised = $campaign->donations_sum_amount ?? 0;

                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'goal' => $campaign->goal_amount,
                    'raised' => $raised,
                    'progress' => ($campaign->goal_amount > 0) ? round(($raised / $campaign->goal_amount) * 100, 2) : 0,
                    'donors' => $campaign->donations_count,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalRaised' => $totalRaised / 100,
                'donorCount' => $donorCount,
                'averageDonation' => round($averageDonation / 100, 2),
            ],
            'campaigns' => $campaigns->map(fn ($c) => [
                ...$c,
                'goal' => $c['goal'] / 100,
                'raised' => $c['raised'] / 100,
            ]),
            'recentDonations' => Donation::with(['campaign', 'currency'])->latest()->take(10)->get()->map(fn ($d) => [
                ...$d->toArray(),
                'amount' => $d->amount / 100,
            ]),
        ]);
    }
}
