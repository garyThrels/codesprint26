import { Link } from '@inertiajs/react';
import { LayoutGrid, ScrollText, Shield } from 'lucide-react';
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
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as auditLogIndex } from '@/routes/admin/audit-log';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { isAdmin, can } = usePermissions();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (isAdmin()) {
        mainNavItems.push({
            title: 'Admin',
            href: adminDashboard(),
            icon: Shield,
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
                            <Link href={dashboard()} prefetch>
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
