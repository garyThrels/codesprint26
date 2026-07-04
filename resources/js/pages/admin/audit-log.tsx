import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import type {
    DataTableColumn,
    DataTableFilters,
} from '@/components/data-table';
import { index as auditLogIndex, exportMethod } from '@/routes/admin/audit-log';
import type { Paginated } from '@/types';

type AuditLogEntry = {
    id: number;
    description: string | null;
    event: string | null;
    logName: string | null;
    causer: string | null;
    subjectType: string | null;
    loggedAt: string;
};

type AuditLogPageProps = {
    entries: Paginated<AuditLogEntry>;
    filters: DataTableFilters;
};

const columns: DataTableColumn<AuditLogEntry>[] = [
    { key: 'description', label: 'Description', sortable: true },
    { key: 'event', label: 'Event' },
    {
        key: 'log_name',
        label: 'Log',
        sortable: true,
        render: (row) => row.logName ?? '—',
    },
    { key: 'causer', label: 'User', render: (row) => row.causer ?? 'System' },
    {
        key: 'subjectType',
        label: 'Subject',
        render: (row) => row.subjectType ?? '—',
    },
    {
        key: 'logged_at',
        label: 'Logged at',
        render: (row) => new Date(row.loggedAt).toLocaleString(),
    },
];

export default function AuditLog({ entries, filters }: AuditLogPageProps) {
    return (
        <>
            <Head title="Audit Log" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Audit log</h1>
                    <p className="text-sm text-muted-foreground">
                        Every recorded action, filterable, sortable and
                        exportable.
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    page={entries}
                    filters={filters}
                    baseUrl={auditLogIndex().url}
                    exportUrls={{
                        csv: exportMethod('csv').url,
                        pdf: exportMethod('pdf').url,
                    }}
                    emptyMessage="No activity has been recorded yet."
                />
            </div>
        </>
    );
}

AuditLog.layout = {
    breadcrumbs: [{ title: 'Audit log', href: auditLogIndex() }],
};
