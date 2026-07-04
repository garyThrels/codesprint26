import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Save, Loader2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';

interface UserFormProps {
    action: {
        action: string;
        method: 'post' | 'put' | 'patch';
    };
    initialData?: {
        id?: number;
        name: string;
        email: string;
        roles: string[];
    };
    roles: string[];
}

export default function UserForm({ action, initialData, roles }: UserFormProps) {
    const isEditing = !!initialData?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '',
        roles: initialData?.roles || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (action.method === 'post') {
            post(action.action);
        } else {
            put(action.action);
        }
    };

    const toggleRole = (role: string) => {
        const newRoles = data.roles.includes(role)
            ? data.roles.filter((r) => r !== role)
            : [...data.roles, role];
        setData('roles', newRoles);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>
                            Basic information and security credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Jane Doe"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="jane@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Roles & Permissions</CardTitle>
                        <CardDescription>
                            Assign roles to define what this user can do.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${role}`}
                                        checked={data.roles.includes(role)}
                                        onCheckedChange={() => toggleRole(role)}
                                    />
                                    <Label
                                        htmlFor={`role-${role}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                                    >
                                        {role.replace('-', ' ')}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.roles} />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col gap-3">
                    <Button size="lg" disabled={processing} className="w-full">
                        {processing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isEditing ? 'Update User' : 'Create User'}
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}
