<?php

namespace App\Http\Controllers;

use Domain\Campaign\Models\Campaign;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        $campaigns = Campaign::with(['charity', 'currency'])->where('status', 'active')->get();

        return Inertia::render('welcome', [
            'campaigns' => $campaigns->map(fn ($campaign) => [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'tagline' => $campaign->tagline,
                'goal_amount' => $campaign->goal_amount,
                'hero_url' => $campaign->getFirstMediaUrl('hero'),
                'charity' => [
                    'name' => $campaign->charity->name,
                    'brand_color' => $campaign->charity->brand_color,
                    'surface_tint' => $campaign->charity->surface_tint,
                    'logo_url' => $campaign->charity->getFirstMediaUrl('logo'),
                ],
                'currency' => $campaign->currency,
            ]),
        ]);
    }

    public function show(Campaign $campaign): Response
    {
        $campaign->load(['charity.currencies', 'currency']);

        $totalRaisedInBaseCurrency = $campaign->donations()
            ->where('status', 'success')
            ->sum('amount_in_base_currency');

        // Convert total raised back to campaign currency for the progress display
        $raisedAmountInCampaignCurrency = (int) round($totalRaisedInBaseCurrency / $campaign->currency->exchange_rate);

        return Inertia::render('donation/show', [
            'campaign' => [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'tagline' => $campaign->tagline,
                'description_html' => $campaign->description_html,
                'about_title' => $campaign->about_title,
                'goal_amount' => $campaign->goal_amount,
                'raised_amount' => $raisedAmountInCampaignCurrency,
                'donor_count' => $campaign->donations()->where('status', 'success')->count(),
                'currency' => $campaign->currency,
                'donation_presets' => $campaign->donation_presets,
                'preselected_index' => $campaign->preselected_index,
                'allow_custom_amount' => $campaign->allow_custom_amount,
                'hero_url' => $campaign->getFirstMediaUrl('hero'),
                'gallery' => $campaign->getMedia('gallery')->map(fn ($media) => $media->getUrl()),
            ],
            'charity' => [
                'name' => $campaign->charity->name,
                'slogan' => $campaign->charity->slogan,
                'brand_color' => $campaign->charity->brand_color,
                'surface_tint' => $campaign->charity->surface_tint,
                'logo_url' => $campaign->charity->getFirstMediaUrl('logo'),
                'supported_currencies' => $campaign->charity->currencies,
            ],
        ]);
    }
}
