import { Head, Link, router, usePage } from '@inertiajs/react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dashboard as adminDashboard } from '@/routes/admin';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';

interface UserListItem {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

export default function UsersIndex({ users }: { users: UserListItem[] }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;

    const deleteUser = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this user? This action cannot be undone.',
            )
        ) {
            router.delete(UserController.destroy.url({ user: id }));
        }
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Users
                        </h1>
                        <p className="text-zinc-500">
                            Manage administrative users and their permissions.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        <Link href={UserController.create.url()}>
                            <Plus className="mr-2 h-4 w-4" /> New User
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">
                                        User
                                    </TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                                                        {user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm leading-none font-bold">
                                                        {user.name}
                                                        {user.id ===
                                                            currentUserId && (
                                                            <Badge
                                                                variant="outline"
                                                                className="ml-2 scale-90 text-[10px]"
                                                            >
                                                                You
                                                            </Badge>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-zinc-500">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role}
                                                        variant="secondary"
                                                        className="text-[10px] capitalize"
                                                    >
                                                        {role.replace('-', ' ')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-500">
                                            {new Date(
                                                user.created_at,
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
                                                    <DropdownMenuItem
                                                        asChild
                                                        disabled={
                                                            user.id ===
                                                            currentUserId
                                                        }
                                                        className={
                                                            user.id ===
                                                            currentUserId
                                                                ? 'cursor-not-allowed opacity-50'
                                                                : ''
                                                        }
                                                    >
                                                        {user.id ===
                                                        currentUserId ? (
                                                            <div className="flex items-center px-2 py-1.5 text-sm text-zinc-400">
                                                                <Edit className="mr-2 h-4 w-4" />{' '}
                                                                Edit
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={UserController.edit.url(
                                                                    {
                                                                        user: user.id,
                                                                    },
                                                                )}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />{' '}
                                                                Edit
                                                            </Link>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        disabled={
                                                            user.id ===
                                                            currentUserId
                                                        }
                                                        onClick={() =>
                                                            user.id !==
                                                                currentUserId &&
                                                            deleteUser(user.id)
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Users', href: '#' },
    ],
};
