<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/campaigns/index', [
            'campaigns' => Campaign::with(['charity', 'currency'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/campaigns/create', [
            'charities' => Charity::all(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'charity_id' => 'required|exists:charities,id',
            'name' => 'required|string|max:255',
            'tagline' => 'required|string|max:255',
            'description_html' => 'required|string',
            'about_title' => 'required|string|max:255',
            'goal_amount' => 'required|numeric|min:0',
            'currency_id' => 'required|exists:currencies,id',
            'donation_presets' => 'required|array|min:1|max:3',
            'donation_presets.*.amount' => 'required|numeric|min:1',
            'donation_presets.*.label' => 'required|string|max:20',
            'preselected_index' => 'required|integer|min:1|max:3',
            'allow_custom_amount' => 'required|boolean',
            'status' => 'required|in:active,paused,completed',
            'expires_at' => 'nullable|date',
        ]);

        $campaign = Campaign::create($validated);

        return redirect()->route('admin.campaigns.edit', $campaign)->with('success', 'Campaign created. Please upload images.');
    }

    public function edit(Campaign $campaign): Response
    {
        return Inertia::render('admin/campaigns/edit', [
            'campaign' => array_merge($campaign->load(['charity', 'currency'])->toArray(), [
                'hero_url' => $campaign->getFirstMediaUrl('hero'),
                'gallery_urls' => $campaign->getMedia('gallery')->map->getUrl(),
            ]),
            'charities' => Charity::all(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Campaign $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'charity_id' => 'required|exists:charities,id',
            'name' => 'required|string|max:255',
            'tagline' => 'required|string|max:255',
            'description_html' => 'required|string',
            'about_title' => 'required|string|max:255',
            'goal_amount' => 'required|numeric|min:0',
            'currency_id' => 'required|exists:currencies,id',
            'donation_presets' => 'required|array|min:1|max:3',
            'donation_presets.*.amount' => 'required|numeric|min:1',
            'donation_presets.*.label' => 'required|string|max:20',
            'preselected_index' => 'required|integer|min:1|max:3',
            'allow_custom_amount' => 'required|boolean',
            'status' => 'required|in:active,paused,completed',
            'expires_at' => 'nullable|date',
            'gallery_urls' => 'nullable|array',
            'gallery_urls.*' => 'string',
        ]);

        $campaign->update($validated);

        // Handle gallery removal
        if ($request->has('gallery_urls')) {
            $currentGalleryUrls = $request->input('gallery_urls');
            $campaign->getMedia('gallery')->each(function ($media) use ($currentGalleryUrls) {
                if (! in_array($media->getUrl(), $currentGalleryUrls)) {
                    $media->delete();
                }
            });
        }

        return redirect()->back()->with('success', 'Campaign updated successfully.');
    }

    public function uploadMedia(Request $request, Campaign $campaign): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|max:2048',
            'collection' => 'required|string|in:hero,gallery',
        ]);

        $campaign->addMediaFromRequest('file')->toMediaCollection($request->collection);

        return response()->json(['success' => true]);
    }

    public function destroy(Campaign $campaign): RedirectResponse
    {
        $campaign->delete();

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign deleted successfully.');
    }
}
