import { usePage } from '@inertiajs/react';

/**
 * Read the authenticated user's roles and permissions (shared from the server
 * via HandleInertiaRequests) and expose helpers for gating UI.
 */
export function usePermissions() {
    const { auth } = usePage().props;

    const roles = auth?.roles ?? [];
    const permissions = auth?.permissions ?? [];

    const can = (permission: string): boolean =>
        roles.includes('super-admin') || permissions.includes(permission);

    const hasRole = (role: string | string[]): boolean =>
        (Array.isArray(role) ? role : [role]).some((r) => roles.includes(r));

    const isAdmin = (): boolean => can('access admin panel');

    return { roles, permissions, can, hasRole, isAdmin } as const;
}
