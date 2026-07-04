<?php

namespace Domain\Campaign\Models;

use Domain\Campaign\Enums\CampaignStatus;
use Domain\Charity\Models\Charity;
use Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Campaign extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use LogsActivity;

    protected $fillable = [
        'charity_id',
        'name',
        'tagline',
        'description_html',
        'about_title',
        'goal_amount',
        'currency_id',
        'donation_presets',
        'preselected_index',
        'allow_custom_amount',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'donation_presets' => 'array',
        'allow_custom_amount' => 'boolean',
        'expires_at' => 'datetime',
        'goal_amount' => 'integer',
        'preselected_index' => 'integer',
        'status' => CampaignStatus::class,
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero')
            ->useDisk('public')
            ->singleFile();

        $this->addMediaCollection('gallery')
            ->useDisk('public')
            ->onlyKeepLatest(4);
    }

    /**
     * @return BelongsTo<Charity, $this>
     */
    public function charity(): BelongsTo
    {
        return $this->belongsTo(Charity::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(\Domain\Currency\Models\Currency::class);
    }

    /**
     * @return HasMany<Donation, $this>
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
