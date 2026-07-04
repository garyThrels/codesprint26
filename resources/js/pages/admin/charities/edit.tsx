import { Head } from '@inertiajs/react';
import CharityForm from './components/charity-form';
import CharityController from '@/actions/App/Http/Controllers/Admin/CharityController';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as charitiesIndex } from '@/routes/admin/charities';

import type { Charity } from '@/types';
import type { Currency } from '@/types/currency';

export default function Edit({
    charity,
    currencies,
}: {
    charity: Charity;
    currencies: Currency[];
}) {
    return (
        <>
            <Head title={`Edit ${charity.name}`} />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Edit Charity
                    </h1>
                    <p className="text-zinc-500">
                        Update organization details and branding.
                    </p>
                </div>

                <CharityForm
                    action={CharityController.update.form(charity.id)}
                    initialData={charity}
                    currencies={currencies}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Charities', href: charitiesIndex() },
        { title: 'Edit', href: '#' },
    ],
};
