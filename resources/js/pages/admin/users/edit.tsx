import { Head } from '@inertiajs/react';
import UserForm from './components/user-form';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { dashboard as adminDashboard } from '@/routes/admin';

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

export default function Edit({ user, roles }: { user: UserData; roles: string[] }) {
    return (
        <>
            <Head title={`Edit User: ${user.name}`} />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Edit User</h1>
                    <p className="text-zinc-500">Update user details and permissions.</p>
                </div>

                <UserForm 
                    action={UserController.update.form({ user: user.id })} 
                    initialData={user} 
                    roles={roles} 
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Users', href: UserController.index.url() },
        { title: 'Edit', href: '#' },
    ],
};
