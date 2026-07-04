import { Head } from '@inertiajs/react';
import UserForm from './components/user-form';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { dashboard as adminDashboard } from '@/routes/admin';

export default function Create({ roles }: { roles: string[] }) {
    return (
        <>
            <Head title="New User" />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">New User</h1>
                    <p className="text-zinc-500">Create a new administrative user.</p>
                </div>

                <UserForm action={UserController.store.form()} roles={roles} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Users', href: UserController.index.url() },
        { title: 'New', href: '#' },
    ],
};
