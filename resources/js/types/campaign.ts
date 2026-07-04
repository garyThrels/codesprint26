import type { Charity } from './charity';
import type { Currency } from './currency';

export interface DonationPreset {
    amount: number;
    label: string;
}

export interface Campaign {
    id: number;
    charity_id: number;
    name: string;
    tagline: string;
    description_html: string;
    about_title: string;
    goal_amount: number;
    raised_amount: number;
    donor_count: number;
    currency_id: number;
    currency: Currency;
    donation_presets: DonationPreset[];
    preselected_index: number;
    allow_custom_amount: boolean;
    status: string;
    expires_at: string | null;
    hero_url: string;
    gallery: string[];
    gallery_urls: string[];
    charity: Charity;
    created_at: string;
    updated_at: string;
}
