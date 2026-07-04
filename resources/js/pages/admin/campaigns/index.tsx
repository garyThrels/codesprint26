import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as campaignsIndex,
    create,
    edit,
    destroy,
} from '@/routes/admin/campaigns';
import { usePermissions } from '@/hooks/use-permissions';
import type { Campaign } from '@/types';

export default function CampaignsIndex({
    campaigns,
}: {
    campaigns: Campaign[];
}) {
    const { can } = usePermissions();
    const deleteCampaign = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this campaign? All associated donations will also be removed.',
            )
        ) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Campaign Management" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Campaigns
                        </h1>
                        <p className="text-zinc-500">
                            Create and manage your fundraising campaigns.
                        </p>
                    </div>
                    {can('manage campaigns') && (
                        <Button
                            asChild
                            className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                        >
                            <Link href={create()}>
                                <Plus className="mr-2 h-4 w-4" /> New Campaign
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Charity</TableHead>
                                    <TableHead>Goal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-bold">
                                            {campaign.name}
                                        </TableCell>
                                        <TableCell>
                                            {campaign.charity.name}
                                        </TableCell>
                                        <TableCell>
                                            {campaign.currency.symbol}
                                            {(
                                                campaign.goal_amount / 100
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    campaign.status === 'active'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="capitalize"
                                            >
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                campaign.created_at,
                                            ).toLocaleDateString()}
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
                                                    {can('manage campaigns') && (
                                                        <>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={edit(
                                                                        campaign.id,
                                                                    )}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />{' '}
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() =>
                                                                    deleteCampaign(
                                                                        campaign.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {campaigns.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-zinc-500 italic"
                                        >
                                            No campaigns found. Create your
                                            first one to get started!
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

CampaignsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Campaigns', href: campaignsIndex() },
    ],
};
