import * as React from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { CampaignGeneralInfo } from './campaign-general-info';
import { CampaignDonationSettings } from './campaign-donation-settings';
import { CampaignStatusSettings } from './campaign-status-settings';
import { CampaignMediaSettings } from './campaign-media-settings';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
    edit as editCampaign,
    media as campaignMedia,
} from '@/routes/admin/campaigns';

import type { Campaign, Charity, Currency } from '@/types';

interface CampaignFormProps {
    action: {
        action: string;
        method: 'post' | 'put' | 'patch' | 'get' | 'delete';
    };
    initialData?: Partial<Campaign>;
    charities: Charity[];
    currencies: Currency[];
}

export default function CampaignForm({
    action,
    initialData,
    charities,
    currencies,
}: CampaignFormProps) {
    const [isUploading, setIsUploading] = React.useState(false);

    const defaults = {
        charity_id: initialData?.charity_id || '',
        name: initialData?.name || '',
        tagline: initialData?.tagline || '',
        description_html: initialData?.description_html || '',
        about_title: initialData?.about_title || '',
        goal_amount: initialData?.goal_amount || 0,
        currency_id: initialData?.currency_id || '',
        donation_presets: initialData?.donation_presets || [
            { amount: 1000, label: 'Small gift' },
            { amount: 2500, label: 'Helpful gift' },
            { amount: 5000, label: 'Major gift' },
        ],
        preselected_index: initialData?.preselected_index || 2,
        allow_custom_amount: initialData?.allow_custom_amount ?? true,
        status: initialData?.status || 'active',
        expires_at: initialData?.expires_at || '',
        hero: null as File | null,
        gallery: [] as File[],
        hero_url: initialData?.hero_url || null,
        gallery_urls: initialData?.gallery_urls || [],
    };

    const { data, setData, post, put, processing, errors, transform } =
        useForm(defaults);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Strip files from main request to avoid PostTooLargeException
        transform((data) => ({
            ...data,
            hero: null,
            gallery: [],
        }));

        const options = {
            onSuccess: async (page: any) => {
                const campaignId = page.props.campaign?.id || initialData?.id;

                if (!campaignId) {
                    return;
                }

                if (data.hero || data.gallery.length > 0) {
                    setIsUploading(true);

                    try {
                        if (data.hero) {
                            await router.post(
                                `/admin/campaigns/${campaignId}/media`,
                                {
                                    file: data.hero,
                                    collection: 'hero',
                                },
                            );
                        }

                        for (const file of data.gallery) {
                            await router.post(
                                `/admin/campaigns/${campaignId}/media`,
                                {
                                    file,
                                    collection: 'gallery',
                                },
                            );
                        }

                        toast.success('Campaign saved and images uploaded.');
                    } catch {
                        toast.error('Campaign saved, but image upload failed.');
                    } finally {
                        setIsUploading(false);
                        router.visit(editCampaign(campaignId));
                    }
                } else {
                    toast.success('Campaign saved successfully.');
                }
            },
        };

        if (action.method === 'post') {
            post(action.action, options);
        } else {
            put(action.action, options);
        }
    };

    const combinedProcessing = processing || isUploading;

    return (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>
                            Basic details about your campaign.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="border-t p-0">
                        <CampaignGeneralInfo
                            data={data}
                            setData={setData}
                            errors={errors}
                            charities={charities}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Donation Settings</CardTitle>
                        <CardDescription>
                            Configure how people can donate to this campaign.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="border-t p-0">
                        <CampaignDonationSettings
                            data={data}
                            setData={setData}
                            errors={errors}
                            currencies={currencies}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Content & Status</CardTitle>
                        <CardDescription>
                            The detailed description and campaign lifecycle.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="border-t p-0">
                        <CampaignStatusSettings
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Media</CardTitle>
                        <CardDescription>
                            Images for your campaign.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="border-t p-0">
                        <CampaignMediaSettings
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        disabled={combinedProcessing}
                        className="w-full"
                    >
                        {combinedProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isUploading
                                    ? 'Uploading Images...'
                                    : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Campaign
                            </>
                        )}
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
