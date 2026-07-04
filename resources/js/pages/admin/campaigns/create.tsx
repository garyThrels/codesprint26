import { Head } from '@inertiajs/react';
import CampaignForm from './components/campaign-form';
import CampaignController from '@/actions/App/Http/Controllers/Admin/CampaignController';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as campaignsIndex } from '@/routes/admin/campaigns';

import type { Charity, Currency } from '@/types';

interface CreateProps {
    charities: Charity[];
    currencies: Currency[];
}

export default function Create({ charities, currencies }: CreateProps) {
    return (
        <>
            <Head title="New Campaign" />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        New Campaign
                    </h1>
                    <p className="text-zinc-500">
                        Create a new fundraising campaign.
                    </p>
                </div>

                <CampaignForm
                    action={CampaignController.store.form()}
                    charities={charities}
                    currencies={currencies}
                />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Campaigns', href: campaignsIndex() },
        { title: 'New', href: '#' },
    ],
};
