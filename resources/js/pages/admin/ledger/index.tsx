import { Head, Link } from '@inertiajs/react';
import { Euro, Calendar, Tag } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as ledgerIndex, reconciliation } from '@/routes/admin/ledger';
import type { Paginated, Donation, DataTableColumn } from '@/types';

export default function LedgerIndex({
    donations,
    filters,
}: {
    donations: Paginated<Donation>;
    filters: any;
}) {
    const columns: DataTableColumn<Donation>[] = [
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            render: (row: Donation) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    {new Date(row.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            key: 'donor_name',
            label: 'Donor',
            render: (row: Donation) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {row.is_anonymous
                            ? 'Anonymous'
                            : row.donor_name || 'N/A'}
                    </span>
                    <span className="text-xs text-zinc-500">
                        {row.is_anonymous ? '' : row.donor_email}
                    </span>
                </div>
            ),
        },
        {
            key: 'campaign',
            label: 'Campaign',
            render: (row: Donation) => (
                <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-zinc-400" />
                    {row.campaign.name}
                </div>
            ),
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (row: Donation) => (
                <div className="flex items-center gap-1 font-bold">
                    <Euro className="h-3 w-3" />
                    {row.amount.toFixed(2)}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <Badge
                    variant={
                        row.status === 'success'
                            ? 'default'
                            : row.status === 'failed'
                              ? 'destructive'
                              : 'outline'
                    }
                    className="capitalize"
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            key: 'transaction_id',
            label: 'TX ID',
            render: (row) => (
                <code className="rounded bg-zinc-100 px-1 text-[10px] dark:bg-zinc-800">
                    {row.transaction_id || 'N/A'}
                </code>
            ),
        },
    ];

    return (
        <>
            <Head title="Transaction Ledger" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Transaction Ledger
                        </h1>
                        <p className="text-zinc-500">
                            View and manage all donations across your campaigns.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={reconciliation()}>
                            <Badge
                                variant="outline"
                                className="cursor-pointer px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                Mastercard Reconciliation
                            </Badge>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    page={donations}
                    filters={filters}
                    baseUrl={ledgerIndex.url()}
                />
            </div>
        </>
    );
}

LedgerIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Ledger', href: ledgerIndex() },
    ],
};
