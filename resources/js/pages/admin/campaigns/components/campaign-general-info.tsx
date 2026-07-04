import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

import type { Charity } from '@/types';

interface CampaignGeneralInfoProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    charities: Charity[];
}

export function CampaignGeneralInfo({
    data,
    setData,
    errors,
    charities,
}: CampaignGeneralInfoProps) {
    return (
        <div className="grid gap-6 p-4">
            <div className="grid gap-2">
                <Label htmlFor="charity_id">Charity</Label>
                <Select
                    value={data.charity_id?.toString()}
                    onValueChange={(value) =>
                        setData('charity_id', parseInt(value))
                    }
                >
                    <SelectTrigger id="charity_id">
                        <SelectValue placeholder="Select a charity" />
                    </SelectTrigger>
                    <SelectContent>
                        {charities.map((charity) => (
                            <SelectItem
                                key={charity.id}
                                value={charity.id.toString()}
                            >
                                {charity.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.charity_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Summer Fundraiser 2026"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                    id="tagline"
                    value={data.tagline}
                    onChange={(e) => setData('tagline', e.target.value)}
                    placeholder="A short, catchy phrase"
                />
                <InputError message={errors.tagline} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="about_title">About Section Title</Label>
                <Input
                    id="about_title"
                    value={data.about_title}
                    onChange={(e) => setData('about_title', e.target.value)}
                    placeholder="e.g. Why we need your help"
                />
                <InputError message={errors.about_title} />
            </div>
        </div>
    );
}
