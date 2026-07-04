<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Exports\ExportRowsToCsv;
use App\Actions\Exports\ExportRowsToPdf;
use App\Data\AuditLogEntryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexAuditLogRequest;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

final class AuditLogController extends Controller
{
    public function index(IndexAuditLogRequest $request): Response
    {
        $entries = $this->query($request)
            ->paginate($request->perPage())
            ->withQueryString()
            ->through(fn (Activity $activity): AuditLogEntryData => AuditLogEntryData::fromActivity($activity));

        return Inertia::render('admin/audit-log', [
            'entries' => $entries,
            'filters' => [
                'search' => $request->search(),
                'sort' => $request->input('sort', 'logged_at'),
                'direction' => $request->sortDirection(),
                'per_page' => $request->perPage(),
            ],
        ]);
    }

    public function export(
        IndexAuditLogRequest $request,
        string $format,
        ExportRowsToCsv $toCsv,
        ExportRowsToPdf $toPdf,
    ): HttpResponse {
        abort_unless(in_array($format, ['csv', 'pdf'], true), HttpResponse::HTTP_NOT_FOUND);

        $headings = ['ID', 'Description', 'Event', 'Log', 'User', 'Subject', 'Logged at'];

        $rows = $this->query($request)->get()->map(fn (Activity $activity): array => [
            $activity->id,
            $activity->description,
            $activity->event,
            $activity->log_name,
            $activity->causer?->name ?? $activity->causer?->email,
            $activity->subject_type ? class_basename($activity->subject_type) : null,
            $activity->created_at?->toDateTimeString(),
        ]);

        $filename = 'audit-log-'.now()->format('Y-m-d_His').'.'.$format;

        activity()
            ->withProperties(['filename' => $filename, 'format' => $format])
            ->log('Exported audit log');

        return $format === 'csv'
            ? $toCsv($filename, $headings, $rows)
            : $toPdf($filename, 'Audit Log', $headings, $rows);
    }

    /**
     * @return Builder<Activity>
     */
    private function query(IndexAuditLogRequest $request): Builder
    {
        return Activity::query()
            ->with('causer')
            ->when($request->search(), function (Builder $query, string $search): void {
                $query->where(function (Builder $inner) use ($search): void {
                    $inner->where('description', 'like', "%{$search}%")
                        ->orWhere('log_name', 'like', "%{$search}%")
                        ->orWhere('event', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->sortColumn(), $request->sortDirection());
    }
}
