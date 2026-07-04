import { Head } from '@inertiajs/react';
import CharityForm from './components/charity-form';
import CharityController from '@/actions/App/Http/Controllers/Admin/CharityController';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as charitiesIndex } from '@/routes/admin/charities';

import type { Currency } from '@/types/currency';

export default function Create({ currencies }: { currencies: Currency[] }) {
    return (
        <>
            <Head title="New Charity" />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        New Charity
                    </h1>
                    <p className="text-zinc-500">
                        Register a new organization.
                    </p>
                </div>

                <CharityForm
                    action={CharityController.store.form()}
                    currencies={currencies}
                />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Charities', href: charitiesIndex() },
        { title: 'New', href: '#' },
    ],
};
