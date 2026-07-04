import { Link } from '@inertiajs/react';
import { LayoutGrid, ScrollText, Shield, Building2, Users } from 'lucide-react';
import { Tag, BookOpen } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as auditLogIndex } from '@/routes/admin/audit-log';
import { index as campaignsIndex } from '@/routes/admin/campaigns';
import { index as charitiesIndex } from '@/routes/admin/charities';
import { index as ledgerIndex } from '@/routes/admin/ledger';
import { index as usersIndex } from '@/routes/admin/users';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { can } = usePermissions();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: adminDashboard(),
            icon: LayoutGrid,
        },
    ];

    if (can('view campaigns')) {
        mainNavItems.push({
            title: 'Campaigns',
            href: campaignsIndex(),
            icon: Tag,
        });
    }

    if (can('view charities')) {
        mainNavItems.push({
            title: 'Charities',
            href: charitiesIndex(),
            icon: Building2,
        });
    }

    if (can('view ledger')) {
        mainNavItems.push({
            title: 'Ledger',
            href: ledgerIndex(),
            icon: BookOpen,
        });
    }

    if (can('manage users')) {
        mainNavItems.push({
            title: 'Users',
            href: usersIndex(),
            icon: Users,
        });
    }

    if (can('view audit log')) {
        mainNavItems.push({
            title: 'Audit log',
            href: auditLogIndex(),
            icon: ScrollText,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={adminDashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
