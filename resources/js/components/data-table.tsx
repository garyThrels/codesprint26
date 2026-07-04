import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Paginated } from '@/types';

export type DataTableColumn<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
};

export type DataTableFilters = {
    search?: string | null;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
};

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    page: Paginated<T>;
    filters: DataTableFilters;
    baseUrl: string;
    searchable?: boolean;
    exportUrls?: { csv?: string; pdf?: string };
    emptyMessage?: string;
};

function buildQuery(
    filters: DataTableFilters,
    overrides: Partial<DataTableFilters & { page: number }>,
): string {
    const params = new URLSearchParams();
    const merged = { ...filters, ...overrides };

    Object.entries(merged).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            params.set(key, String(value));
        }
    });

    const query = params.toString();

    return query ? `?${query}` : '';
}

export function DataTable<T extends { id: number | string }>({
    columns,
    page,
    filters,
    baseUrl,
    searchable = true,
    exportUrls,
    emptyMessage = 'No records found.',
}: DataTableProps<T>) {
    const [search, setSearch] = React.useState(filters.search ?? '');

    // Debounce search input, then push it to the server as a fresh query.
    React.useEffect(() => {
        if ((filters.search ?? '') === search) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                baseUrl + buildQuery(filters, { search, page: 1 }),
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters, baseUrl]);

    const toggleSort = (key: string) => {
        const direction =
            filters.sort === key && filters.direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            baseUrl + buildQuery(filters, { sort: key, direction, page: 1 }),
            {},
            { preserveScroll: true },
        );
    };

    const sortIcon = (key: string) => {
        if (filters.sort !== key) {
            return <ChevronsUpDown className="size-3.5 opacity-50" />;
        }

        return filters.direction === 'asc' ? (
            <ArrowUp className="size-3.5" />
        ) : (
            <ArrowDown className="size-3.5" />
        );
    };

    const withCurrentQuery = (url: string): string =>
        url + buildQuery(filters, {});

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                {searchable && (
                    <Input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search..."
                        className="max-w-xs"
                    />
                )}

                {exportUrls && (
                    <div className="flex gap-2">
                        {exportUrls.csv && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={withCurrentQuery(exportUrls.csv)}>
                                    Export CSV
                                </a>
                            </Button>
                        )}
                        {exportUrls.pdf && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={withCurrentQuery(exportUrls.pdf)}>
                                    Export PDF
                                </a>
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>
                                    {column.sortable ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSort(column.key)
                                            }
                                            className="inline-flex items-center gap-1 hover:text-foreground"
                                        >
                                            {column.label}
                                            {sortIcon(column.key)}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {page.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            page.data.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.render
                                                ? column.render(row)
                                                : String(
                                                      (
                                                          row as Record<
                                                              string,
                                                              unknown
                                                          >
                                                      )[column.key] ?? '',
                                                  )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>
                    {page.total > 0
                        ? `Showing ${page.from}-${page.to} of ${page.total}`
                        : 'No results'}
                </span>
                <div className="flex flex-wrap gap-1">
                    {page.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() =>
                                link.url &&
                                router.get(
                                    link.url,
                                    {},
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                )
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
