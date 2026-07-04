import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as ledgerIndex, reconciliation } from '@/routes/admin/ledger';

import type { ReconciliationItem } from '@/types';

export default function Reconciliation({
    comparison,
}: {
    comparison: ReconciliationItem[];
}) {
    const discrepancies = comparison.filter((item) => !item.is_match).length;

    return (
        <>
            <Head title="Mastercard Reconciliation" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <Link
                            href={ledgerIndex()}
                            className="mb-2 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to Ledger
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                            Reconciliation
                        </h1>
                        <p className="text-zinc-500">
                            Cross-referencing local donations with Mastercard
                            records.
                        </p>
                    </div>
                    <Button variant="outline" className="flex gap-2">
                        <RefreshCw className="h-4 w-4" /> Fetch Fresh Data
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="md:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {discrepancies > 0 ? (
                                    <>
                                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                                        <span className="text-xl font-bold">
                                            {discrepancies} Discrepancies
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-xl font-bold">
                                            In Sync
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-zinc-500">
                                Last checked: {new Date().toLocaleTimeString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50 md:col-span-3 dark:border-amber-900/30 dark:bg-amber-900/10">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
                                <div>
                                    <h4 className="font-bold text-amber-900 dark:text-amber-400">
                                        Reconciliation Note
                                    </h4>
                                    <p className="text-sm text-amber-800 dark:text-amber-500/80">
                                        Discrepancies usually occur due to
                                        processing delays in the Mastercard
                                        Sandbox environment. Manual intervention
                                        may be required for "Status Mismatches".
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Comparison Matrix</CardTitle>
                        <CardDescription>
                            Direct mapping of Internal ID to Mastercard
                            Transaction ID.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Internal ID</TableHead>
                                    <TableHead>Mastercard TX ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Local Status</TableHead>
                                    <TableHead>Mastercard Status</TableHead>
                                    <TableHead>Verdict</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comparison.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className={
                                            !item.is_match
                                                ? 'bg-amber-50/50 dark:bg-amber-900/5'
                                                : ''
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            #{item.id}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs">
                                                {item.mastercard_transaction_id}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            €{item.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.local_status ===
                                                    'success'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {item.local_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.mastercard_status ===
                                                    'success'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {item.mastercard_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.is_match ? (
                                                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                                    <CheckCircle2 className="h-3 w-3" />{' '}
                                                    MATCH
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                                                        <AlertTriangle className="h-3 w-3" />{' '}
                                                        DISCREPANCY
                                                    </div>
                                                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-500">
                                                        {item.discrepancy}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Reconciliation.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Ledger', href: ledgerIndex() },
        { title: 'Reconciliation', href: reconciliation() },
    ],
};
