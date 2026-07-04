import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type DataTableColumn<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
};

export type DataTableFilters = {
    search?: string | null;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
};

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
