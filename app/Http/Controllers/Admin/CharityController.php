<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CharityController extends Controller
{
    public function index(): Response
    {
        $charities = Charity::withCount([
            'campaigns as active_campaigns_count' => function ($query) {
                $query->where('campaigns.status', 'active');
            },
            'campaigns as paused_campaigns_count' => function ($query) {
                $query->where('campaigns.status', 'paused');
            },
            'campaigns as completed_campaigns_count' => function ($query) {
                $query->where('campaigns.status', 'completed');
            },
        ])
            ->withSum(['donations as total_gathered' => function ($query) {
                $query->where('donations.status', 'success');
            }], 'amount_in_base_currency')
            ->with('currencies')
            ->get();

        return Inertia::render('admin/charities/index', [
            'charities' => $charities->map(function ($charity) {
                return array_merge($charity->toArray(), [
                    'logo_url' => $charity->getFirstMediaUrl('logo'),
                ]);
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/charities/create', [
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'brand_color' => 'required|string|max:7',
            'surface_tint' => 'required|string|in:warm,cool,neutral',
            'logo' => 'nullable|image|max:2048',
            'currency_ids' => 'required|array|min:1',
            'currency_ids.*' => 'exists:currencies,id',
        ]);

        $charity = Charity::create($validated);
        $charity->currencies()->sync($request->input('currency_ids'));

        if ($request->hasFile('logo')) {
            $charity->addMediaFromRequest('logo')->toMediaCollection('logo');
        }

        return redirect()->route('admin.charities.index')->with('success', 'Charity created successfully.');
    }

    public function edit(Charity $charity): Response
    {
        $charity->load('currencies');

        return Inertia::render('admin/charities/edit', [
            'charity' => array_merge($charity->toArray(), [
                'logo_url' => $charity->getFirstMediaUrl('logo'),
                'currency_ids' => $charity->currencies->pluck('id')->toArray(),
            ]),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Charity $charity): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'brand_color' => 'required|string|max:7',
            'surface_tint' => 'required|string|in:warm,cool,neutral',
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|string',
            'currency_ids' => 'required|array|min:1',
            'currency_ids.*' => 'exists:currencies,id',
        ]);

        $charity->update($validated);
        $charity->currencies()->sync($request->input('currency_ids'));

        if ($request->has('logo_url') && $request->input('logo_url') === null) {
            $charity->clearMediaCollection('logo');
        }

        if ($request->hasFile('logo')) {
            $charity->clearMediaCollection('logo');
            $charity->addMediaFromRequest('logo')->toMediaCollection('logo');
        }

        return redirect()->route('admin.charities.index')->with('success', 'Charity updated successfully.');
    }
}
