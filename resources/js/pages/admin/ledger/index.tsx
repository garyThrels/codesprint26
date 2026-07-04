import { Head, Link } from '@inertiajs/react';
import { Euro, Calendar, Tag, Download } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as ledgerIndex,
    reconciliation,
    update as ledgerUpdate,
    sendReceipt,
    exportMethod as ledgerExport,
} from '@/routes/admin/ledger';
import type { Paginated, Donation, DataTableColumn, Campaign } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';
import { MoreHorizontal, Edit, Mail, Info } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/use-permissions';
import { Filter, X } from 'lucide-react';

export default function LedgerIndex({
    donations,
    campaigns,
    filters,
}: {
    donations: Paginated<Donation>;
    campaigns: Campaign[];
    filters: any;
}) {
    const { can } = usePermissions();
    const [editingDonation, setEditingDonation] = useState<Donation | null>(
        null,
    );
    const [sendingReceiptId, setSendingReceiptId] = useState<number | null>(
        null,
    );

    const [currentFilters, setCurrentFilters] = useState(filters);

    useEffect(() => {
        setCurrentFilters(filters);
    }, [filters]);

    const handleFilterChange = (key: string, value: any) => {
        const nextFilters = { ...currentFilters, [key]: value, page: 1 };
        router.get(ledgerIndex.url(), nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(ledgerIndex.url(), {}, { preserveState: true });
    };

    const handleUpdateDonation = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingDonation) return;

        router.patch(
            ledgerUpdate(editingDonation.id),
            {
                donor_email: editingDonation.donor_email,
                is_anonymous: editingDonation.is_anonymous,
            },
            {
                onSuccess: () => {
                    setEditingDonation(null);
                    toast.success('Donation updated successfully');
                },
            },
        );
    };

    const handleSendReceipt = (donation: Donation) => {
        setSendingReceiptId(donation.id);
        router.post(
            sendReceipt(donation.id),
            {},
            {
                onSuccess: () => {
                    setSendingReceiptId(null);
                    toast.success('Receipt sent successfully');
                },
            },
        );
    };
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
                <div className="flex flex-col">
                    <span className="font-bold">
                        {row.currency.symbol}
                        {(row.amount / 100).toFixed(2)}
                    </span>
                    {row.currency.code !== 'EUR' && (
                        <span className="text-[10px] text-zinc-500">
                            (€{(row.amount_in_base_currency / 100).toFixed(2)})
                        </span>
                    )}
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
        {
            key: 'actions',
            label: '',
            render: (row: Donation) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {can('export ledger') && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => setEditingDonation(row)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleSendReceipt(row)}
                                    disabled={sendingReceiptId === row.id}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    {row.receipt_sent_at
                                        ? 'Resend Receipt'
                                        : 'Send Receipt'}
                                </DropdownMenuItem>
                            </>
                        )}
                        {!can('export ledger') && (
                            <DropdownMenuItem disabled>
                                <Info className="mr-2 h-4 w-4" /> No actions available
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
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
                        {can('export ledger') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    window.location.href = ledgerExport.url({
                                        query: filters,
                                    });
                                }}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        )}
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

                <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="campaign" className="text-xs">Campaign</Label>
                            <Select
                                value={currentFilters.campaign_id?.toString() || 'all'}
                                onValueChange={(value) => handleFilterChange('campaign_id', value === 'all' ? null : value)}
                            >
                                <SelectTrigger id="campaign" size="sm" className="w-full">
                                    <SelectValue placeholder="All Campaigns" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Campaigns</SelectItem>
                                    {campaigns.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs">Status</Label>
                            <Select
                                value={currentFilters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? null : value)}
                            >
                                <SelectTrigger id="status" size="sm" className="w-full">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="date_from" className="text-xs">From Date</Label>
                            <Input
                                id="date_from"
                                type="date"
                                value={currentFilters.date_from || ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="h-8 py-1 text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="date_to" className="text-xs">To Date</Label>
                            <Input
                                id="date_to"
                                type="date"
                                value={currentFilters.date_to || ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="h-8 py-1 text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="amount_operator" className="text-xs">Amount Comparison</Label>
                            <Select
                                value={currentFilters.amount_operator || 'eq'}
                                onValueChange={(value) => handleFilterChange('amount_operator', value)}
                            >
                                <SelectTrigger id="amount_operator" size="sm" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="eq">Equal to (=)</SelectItem>
                                    <SelectItem value="gt">Greater than (&gt;)</SelectItem>
                                    <SelectItem value="lt">Less than (&lt;)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="amount" className="text-xs">Amount (€)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={currentFilters.amount || ''}
                                onChange={(e) => handleFilterChange('amount', e.target.value)}
                                placeholder="0.00"
                                className="h-8 py-1 text-xs"
                            />
                        </div>
                    </div>

                    {Object.values(currentFilters).some(v => v !== null && v !== '' && v !== undefined) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 px-2 text-zinc-500 hover:text-zinc-900"
                        >
                            <X className="mr-1 h-3 w-3" />
                            Clear
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    page={donations}
                    filters={currentFilters}
                    baseUrl={ledgerIndex.url()}
                />

                <Dialog
                    open={!!editingDonation}
                    onOpenChange={(open) => !open && setEditingDonation(null)}
                >
                    <DialogContent className="max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Donation Details</DialogTitle>
                        </DialogHeader>

                        {editingDonation && (
                            <form
                                onSubmit={handleUpdateDonation}
                                className="space-y-6 pt-4"
                            >
                                <div className="space-y-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                        <Info className="h-3 w-3" />
                                        Read-only Information
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-zinc-400 uppercase">
                                                Donor Name
                                            </Label>
                                            <p className="text-sm font-medium">
                                                {editingDonation.donor_name ||
                                                    'Anonymous'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-zinc-400 uppercase">
                                                Amount
                                            </Label>
                                            <p className="text-sm font-medium">
                                                {editingDonation.currency.symbol}
                                                {(
                                                    editingDonation.amount / 100
                                                ).toFixed(2)}
                                                {editingDonation.currency
                                                    .code !== 'EUR' &&
                                                    ` (€${(editingDonation.amount_in_base_currency / 100).toFixed(2)})`}
                                            </p>
                                        </div>
                                    </div>
                                    {editingDonation.gift_aid_enabled && (
                                        <div className="space-y-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
                                            <Label className="text-[10px] text-zinc-400 uppercase">
                                                Gift Aid Info
                                            </Label>
                                            <p className="text-xs">
                                                {editingDonation.gift_aid_name}
                                                <br />
                                                {
                                                    editingDonation.gift_aid_address
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email">
                                            Donor Email
                                        </Label>
                                        <Input
                                            id="edit-email"
                                            value={
                                                editingDonation.donor_email ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setEditingDonation({
                                                    ...editingDonation,
                                                    donor_email: e.target.value,
                                                })
                                            }
                                            placeholder="donor@example.com"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="edit-anonymous"
                                            checked={
                                                editingDonation.is_anonymous
                                            }
                                            onCheckedChange={(checked) =>
                                                setEditingDonation({
                                                    ...editingDonation,
                                                    is_anonymous: !!checked,
                                                })
                                            }
                                        />
                                        <Label htmlFor="edit-anonymous">
                                            Hide name from supporters wall
                                            (Anonymous)
                                        </Label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingDonation(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
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
