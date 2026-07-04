<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DonationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CampaignController::class, 'index'])->name('home');
Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');
Route::post('donations', [DonationController::class, 'store'])->name('donations.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('campaigns', \App\Http\Controllers\Admin\CampaignController::class);
    Route::post('campaigns/{campaign}/media', [\App\Http\Controllers\Admin\CampaignController::class, 'uploadMedia'])->name('campaigns.media');
    Route::resource('charities', \App\Http\Controllers\Admin\CharityController::class);
    Route::get('ledger', [\App\Http\Controllers\Admin\DonationLedgerController::class, 'index'])->name('ledger.index');
    Route::get('ledger/reconciliation', [\App\Http\Controllers\Admin\DonationLedgerController::class, 'reconciliation'])->name('ledger.reconciliation');

    Route::middleware('permission:view audit log')->group(function () {
        Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
        Route::get('audit-log/export/{format}', [AuditLogController::class, 'export'])->name('audit-log.export');
    });
});

require __DIR__.'/settings.php';
