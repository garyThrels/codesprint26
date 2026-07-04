<?php

use App\Http\Controllers\Admin\AuditLogController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

    Route::middleware('permission:view audit log')->group(function () {
        Route::get('audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
        Route::get('audit-log/export/{format}', [AuditLogController::class, 'export'])->name('audit-log.export');
    });
});

require __DIR__.'/settings.php';
