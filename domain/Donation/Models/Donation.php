<?php

namespace Domain\Donation\Models;

use Domain\Campaign\Models\Campaign;
use Domain\Donation\Enums\DonationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    /** @use HasFactory<\Database\Factories\DonationFactory> */
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'amount',
        'amount_in_base_currency',
        'currency_id',
        'status',
        'payment_method',
        'mastercard_transaction_id',
        'donor_name',
        'donor_email',
        'is_anonymous',
        'is_recurring',
        'gift_aid_enabled',
        'gift_aid_name',
        'gift_aid_address',
        'gift_aid_amount',
        'total_benefit_amount',
        'receipt_sent_at',
        'round_up',
        'metadata',
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(\Domain\Currency\Models\Currency::class);
    }

    /**
     * @return BelongsTo<Campaign, $this>
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Limit the query to donations that have been successfully collected.
     *
     * @param  Builder<Donation>  $query
     */
    public function scopeSuccessful(Builder $query): void
    {
        $query->where('status', DonationStatus::Success);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'amount_in_base_currency' => 'integer',
            'status' => DonationStatus::class,
            'is_anonymous' => 'boolean',
            'is_recurring' => 'boolean',
            'gift_aid_enabled' => 'boolean',
            'round_up' => 'boolean',
            'receipt_sent_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
