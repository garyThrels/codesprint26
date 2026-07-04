<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Admin\CharityController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DonationLedgerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DonationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CampaignController::class, 'index'])->name('home');
Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');
Route::post('donations', [DonationController::class, 'store'])->name('donations.store');
Route::patch('donations/{donation}', [DonationController::class, 'update'])->name('donations.update');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Campaigns
    Route::middleware('permission:view campaigns')->group(function () {
        Route::get('campaigns', [AdminCampaignController::class, 'index'])->name('campaigns.index');
    });
    Route::middleware('permission:manage campaigns')->group(function () {
        Route::get('campaigns/create', [AdminCampaignController::class, 'create'])->name('campaigns.create');
        Route::post('campaigns', [AdminCampaignController::class, 'store'])->name('campaigns.store');
        Route::get('campaigns/{campaign}/edit', [AdminCampaignController::class, 'edit'])->name('campaigns.edit');
        Route::put('campaigns/{campaign}', [AdminCampaignController::class, 'update'])->name('campaigns.update');
        Route::delete('campaigns/{campaign}', [AdminCampaignController::class, 'destroy'])->name('campaigns.destroy');
        Route::post('campaigns/{campaign}/media', [AdminCampaignController::class, 'uploadMedia'])->name('campaigns.media');
    });

    // Charities
    Route::middleware('permission:view charities')->group(function () {
        Route::get('charities', [CharityController::class, 'index'])->name('charities.index');
    });
    Route::middleware('permission:manage charities')->group(function () {
        Route::get('charities/create', [CharityController::class, 'create'])->name('charities.create');
        Route::post('charities', [CharityController::class, 'store'])->name('charities.store');
        Route::get('charities/{charity}/edit', [CharityController::class, 'edit'])->name('charities.edit');
        Route::put('charities/{charity}', [CharityController::class, 'update'])->name('charities.update');
    });

    // Users
    Route::middleware('permission:manage users')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Ledger
    Route::middleware('permission:view ledger')->group(function () {
        Route::get('ledger', [DonationLedgerController::class, 'index'])->name('ledger.index');
    });
    Route::middleware('permission:export ledger')->group(function () {
        Route::get('ledger/export', [DonationLedgerController::class, 'export'])->name('ledger.export');
        Route::patch('ledger/{donation}', [DonationLedgerController::class, 'update'])->name('ledger.update');
        Route::post('ledger/{donation}/receipt', [DonationLedgerController::class, 'sendReceipt'])->name('ledger.send-receipt');
        Route::get('ledger/reconciliation', [DonationLedgerController::class, 'reconciliation'])->name('ledger.reconciliation');
    });

    Route::middleware('permission:view audit log')->group(function () {
        Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
        Route::get('audit-log/export/{format}', [AuditLogController::class, 'export'])->name('audit-log.export');
    });
});

require __DIR__.'/settings.php';
