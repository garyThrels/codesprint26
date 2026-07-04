import { Head } from '@inertiajs/react';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard as adminDashboard } from '@/routes/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import {
    Users,
    Euro,
    Heart,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    trend?: 'up' | 'down';
}

function StatCard({ title, value, icon, description, trend }: StatCardProps) {
    return (
        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="mt-1 flex items-center text-xs text-zinc-500">
                        {trend === 'up' && (
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                        )}
                        {trend === 'down' && (
                            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard({
    stats,
    campaigns,
    recentDonations,
}: {
    stats: { totalRaised: number; donorCount: number; averageDonation: number };
    campaigns: any[];
    recentDonations: any[];
}) {
    const { roles } = usePermissions();

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-zinc-500">
                            Welcome back. Here is what's happening with your
                            campaigns today.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            variant="outline"
                            className="bg-zinc-100 px-3 py-1 dark:bg-zinc-800"
                        >
                            {roles.join(', ')}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        title="Total Raised"
                        value={`€${stats.totalRaised.toLocaleString()}`}
                        icon={<Euro className="h-4 w-4" />}
                        description="+12% from last month"
                        trend="up"
                    />
                    <StatCard
                        title="Total Donors"
                        value={stats.donorCount}
                        icon={<Users className="h-4 w-4" />}
                        description="+5% from last week"
                        trend="up"
                    />
                    <StatCard
                        title="Avg. Donation"
                        value={`€${stats.averageDonation}`}
                        icon={<Heart className="h-4 w-4" />}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="border-zinc-200 lg:col-span-4 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Campaign Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] pl-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={campaigns}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            value.length > 10
                                                ? value.substring(0, 10) + '...'
                                                : value
                                        }
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `€${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Bar dataKey="raised" radius={[4, 4, 0, 0]}>
                                        {campaigns.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200 lg:col-span-3 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Recent Donations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentDonations.map((donation) => (
                                    <div
                                        key={donation.id}
                                        className="flex items-center"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800">
                                            {donation.donor_name
                                                ? donation.donor_name
                                                      .substring(0, 2)
                                                      .toUpperCase()
                                                : 'AN'}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {donation.is_anonymous
                                                    ? 'Anonymous Donor'
                                                    : donation.donor_name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {donation.campaign.name}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            +€{donation.amount}
                                        </div>
                                    </div>
                                ))}
                                {recentDonations.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 text-zinc-400 italic">
                                        <Clock className="mb-2 h-8 w-8 opacity-20" />
                                        No recent donations
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: adminDashboard(),
        },
    ],
};
