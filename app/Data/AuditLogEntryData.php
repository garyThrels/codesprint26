<?php

namespace App\Data;

use Carbon\CarbonInterface;
use Spatie\Activitylog\Models\Activity;
use Spatie\LaravelData\Data;

/**
 * Presentation-ready shape for a single audit log entry, decoupling the
 * frontend and exports from the underlying Activity model.
 */
final class AuditLogEntryData extends Data
{
    public function __construct(
        public int $id,
        public ?string $description,
        public ?string $event,
        public ?string $logName,
        public ?string $causer,
        public ?string $subjectType,
        public CarbonInterface $loggedAt,
    ) {}

    public static function fromActivity(Activity $activity): self
    {
        return new self(
            id: $activity->id,
            description: $activity->description,
            event: $activity->event,
            logName: $activity->log_name,
            causer: $activity->causer?->name ?? $activity->causer?->email,
            subjectType: $activity->subject_type ? class_basename($activity->subject_type) : null,
            loggedAt: $activity->created_at,
        );
    }
}
