<?php

use Domain\Donation\Mail\DonationReceiptMail;
use Domain\Donation\Models\Donation;
use Domain\Donation\Services\DonationReceiptService;
use Illuminate\Support\Facades\Mail;

test('it sends a donation receipt email', function () {
    Mail::fake();

    $donation = Donation::factory()->create([
        'donor_email' => 'donor@example.com',
        'donor_name' => 'John Doe',
        'amount' => 5000, // €50.00
    ]);

    $service = new DonationReceiptService();
    $result = $service->send($donation);

    expect($result)->toBeTrue();
    expect($donation->fresh()->receipt_sent_at)->not->toBeNull();

    Mail::assertSent(DonationReceiptMail::class, function ($mail) use ($donation) {
        return $mail->hasTo('donor@example.com') &&
               $mail->donation->id === $donation->id;
    });
});

test('it uses the provided email address if given', function () {
    Mail::fake();

    $donation = Donation::factory()->create([
        'donor_email' => null,
        'amount' => 5000,
    ]);

    $service = new DonationReceiptService();
    $result = $service->send($donation, 'custom@example.com');

    expect($result)->toBeTrue();
    expect($donation->fresh()->donor_email)->toBe('custom@example.com');
    expect($donation->fresh()->receipt_sent_at)->not->toBeNull();

    Mail::assertSent(DonationReceiptMail::class, function ($mail) {
        return $mail->hasTo('custom@example.com');
    });
});

test('it fails if no email address is available', function () {
    Mail::fake();

    $donation = Donation::factory()->create([
        'donor_email' => null,
    ]);

    $service = new DonationReceiptService();
    $result = $service->send($donation);

    expect($result)->toBeFalse();
    expect($donation->fresh()->receipt_sent_at)->toBeNull();

    Mail::assertNotSent(DonationReceiptMail::class);
});
