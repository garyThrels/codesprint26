import { Head, Link } from '@inertiajs/react';
import { Plus, Building2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as charitiesIndex,
    create as createCharity,
    edit as editCharity,
} from '@/routes/admin/charities';

import type { Charity } from '@/types';

export default function CharitiesIndex({
    charities,
}: {
    charities: Charity[];
}) {
    return (
        <>
            <Head title="Charity Management" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Charities
                        </h1>
                        <p className="text-zinc-500">
                            Manage organizations and view their performance.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        <Link href={createCharity()}>
                            <Plus className="mr-2 h-4 w-4" /> New Charity
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Charity</TableHead>
                                    <TableHead className="text-center">
                                        Campaigns
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Brand
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total Gathered
                                    </TableHead>
                                    <TableHead className="w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {charities.map((charity) => (
                                    <TableRow key={charity.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={charity.logo_url}
                                                    />
                                                    <AvatarFallback>
                                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-bold">
                                                    {charity.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="space-x-1.5 text-center">
                                            <Badge
                                                variant="default"
                                                className="bg-emerald-500 hover:bg-emerald-600"
                                                title="Active Campaigns"
                                            >
                                                {charity.active_campaigns_count}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                title="Paused Campaigns"
                                            >
                                                {charity.paused_campaigns_count}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                title="Completed Campaigns"
                                            >
                                                {
                                                    charity.completed_campaigns_count
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center justify-center gap-2">
                                            <div className="h-8 w-8 overflow-hidden rounded-md">
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            charity.brand_color,
                                                        width: '100%',
                                                        height: '100%',
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="capitalize">
                                                {charity.surface_tint}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold">
                                            $
                                            {(
                                                (charity.total_gathered || 0) /
                                                100
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={editCharity(
                                                                charity.id,
                                                            )}
                                                        >
                                                            Edit Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled>
                                                        View Campaigns
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {charities.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-zinc-500 italic"
                                        >
                                            No charities found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CharitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Charities', href: charitiesIndex() },
    ],
};
