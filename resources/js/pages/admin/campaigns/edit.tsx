import { Head } from '@inertiajs/react';
import CampaignForm from './components/campaign-form';
import CampaignController from '@/actions/App/Http/Controllers/Admin/CampaignController';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as campaignsIndex } from '@/routes/admin/campaigns';

import type { Campaign, Charity, Currency } from '@/types';

interface EditProps {
    campaign: Campaign;
    charities: Charity[];
    currencies: Currency[];
}

export default function Edit({ campaign, charities, currencies }: EditProps) {
    return (
        <>
            <Head title={`Edit ${campaign.name}`} />
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Edit Campaign
                    </h1>
                    <p className="text-zinc-500">
                        Update campaign details and settings.
                    </p>
                </div>

                <CampaignForm
                    action={CampaignController.update.form(campaign.id)}
                    initialData={campaign}
                    charities={charities}
                    currencies={currencies}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: adminDashboard() },
        { title: 'Campaigns', href: campaignsIndex() },
        { title: 'Edit', href: '#' },
    ],
};
