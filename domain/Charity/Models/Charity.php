<?php

namespace Domain\Charity\Models;

use Domain\Campaign\Models\Campaign;
use Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Charity extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'slogan',
        'brand_color',
        'surface_tint',
        'description',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')
            ->useDisk('public')
            ->singleFile()
            ->useFallbackUrl('/images/placeholder-logo.png');
    }

    /**
     * @return HasMany<Campaign, $this>
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    /**
     * @return HasManyThrough<Donation, Campaign, $this>
     */
    public function donations(): HasManyThrough
    {
        return $this->hasManyThrough(Donation::class, Campaign::class);
    }
}
