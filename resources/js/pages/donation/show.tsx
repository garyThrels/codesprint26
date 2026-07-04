import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import CampaignNavbar from '@/components/campaign-navbar';
import CampaignProgress from '@/components/campaign-progress';
import DonationForm from '@/components/donation-form';
import { generateCampaignPalette } from '@/lib/colors';

interface Campaign {
    id: number;
    name: string;
    tagline: string;
    currency_id: number;
    description_html: string;
    about_title: string;
    goal_amount: number;
    raised_amount: number;
    donor_count: number;
    currency: {
        code: string;
        symbol: string;
    };
    donation_presets: { amount: number; label: string }[];
    preselected_index: number;
    allow_custom_amount: boolean;
    hero_url: string;
    gallery: string[];
}

interface Charity {
    name: string;
    slogan: string;
    brand_color: string;
    surface_tint: 'warm' | 'cool' | 'neutral';
    logo_url: string;
}

export default function CampaignShow({
    campaign,
    charity,
}: {
    campaign: Campaign;
    charity: Charity;
}) {
    const palette = useMemo(
        () =>
            generateCampaignPalette(charity.brand_color, charity.surface_tint),
        [charity.brand_color, charity.surface_tint],
    );

    const progress = useMemo(() => {
        if (campaign.goal_amount <= 0) {
            return 0;
        }

        return Math.min(
            Math.round((campaign.raised_amount / campaign.goal_amount) * 100),
            100,
        );
    }, [campaign.raised_amount, campaign.goal_amount]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: campaign.currency.code,
            maximumFractionDigits: 0,
        }).format(amount / 100);
    };

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: palette['surface-primary'] }}
        >
            <Head title={campaign.name} />

            <CampaignNavbar
                title={`${campaign.name} - ${charity.name}`}
                palette={palette}
            />

            <main className="mx-auto max-w-[1280px] p-4 md:px-10 md:py-8">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Left Column: Content */}
                    <div className="flex flex-col gap-6 md:flex-1 md:gap-8">
                        {/* Hero Section */}
                        <section className="group relative h-[280px] overflow-hidden rounded-2xl shadow-sm md:h-[360px] md:rounded-3xl">
                            <img
                                src={campaign.hero_url}
                                alt={campaign.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div
                                className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
                                style={{
                                    background: `linear-gradient(to top, ${palette['surface-inverse']}E0 0%, transparent 70%)`,
                                }}
                            />

                            <div className="absolute bottom-0 left-0 space-y-2 p-5 md:space-y-3 md:p-8">
                                {charity.logo_url && (
                                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20 backdrop-blur-md md:h-12 md:w-12">
                                        <img
                                            src={charity.logo_url}
                                            className="h-full w-full object-cover"
                                            alt=""
                                        />
                                    </div>
                                )}
                                <div>
                                    <h1 className="font-playfair text-2xl font-bold text-white md:text-4xl">
                                        {campaign.name}
                                    </h1>
                                    <p className="font-inter text-sm text-white/85 md:text-base">
                                        {campaign.tagline}
                                    </p>
                                    <div className="mt-2">
                                        <span
                                            className="font-inter rounded-full px-2 py-1 text-sm font-semibold text-white"
                                            style={{
                                                backgroundColor:
                                                    palette['surface-inverse'],
                                            }}
                                        >
                                            {charity.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Image Gallery */}
                        {campaign.gallery.length > 0 && (
                            <section className="grid grid-cols-4 gap-2 md:gap-3">
                                {campaign.gallery.map((img, i) => (
                                    <div
                                        key={i}
                                        className="h-[90px] cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md md:h-[120px] md:rounded-xl"
                                    >
                                        <img
                                            src={img}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Mobile Stats (Visible only on mobile) */}
                        <CampaignProgress
                            className="shadow-sm md:hidden"
                            raisedAmount={campaign.raised_amount}
                            goalAmount={campaign.goal_amount}
                            donorCount={campaign.donor_count}
                            progress={progress}
                            formatCurrency={formatCurrency}
                            palette={palette}
                        />

                        {/* About Section */}
                        <section
                            className="space-y-4 rounded-2xl p-5 shadow-sm md:space-y-6 md:rounded-3xl md:p-8"
                            style={{
                                backgroundColor: palette['surface-secondary'],
                            }}
                        >
                            <h2
                                className="font-playfair text-xl font-bold md:text-2xl"
                                style={{ color: palette['foreground-primary'] }}
                            >
                                {campaign.about_title || 'About this Campaign'}
                            </h2>
                            <div
                                className="font-inter text-sm leading-[1.65] md:text-[15px]"
                                style={{
                                    color: palette['foreground-secondary'],
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: campaign.description_html,
                                }}
                            />
                        </section>

                        {/* Mobile Donation Section (Visible only on mobile) */}
                        <div className="md:hidden">
                            <DonationForm
                                campaign={campaign}
                                charity={charity}
                            />
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Desktop Only) */}
                    <aside className="hidden w-[380px] flex-col gap-5 md:flex">
                        {/* Donation Card */}
                        <DonationForm campaign={campaign} charity={charity} />

                        {/* Stats Card */}
                        <CampaignProgress
                            className="shadow-lg"
                            raisedAmount={campaign.raised_amount}
                            goalAmount={campaign.goal_amount}
                            donorCount={campaign.donor_count}
                            progress={progress}
                            formatCurrency={formatCurrency}
                            palette={palette}
                        />

                        {/* Additional Info / Trust Badges */}
                        <div className="space-y-4 px-4 text-center">
                            <p
                                className="font-inter text-[13px] italic"
                                style={{
                                    color: palette['foreground-secondary'],
                                }}
                            >
                                "{charity.slogan}"
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Global Styles for Fonts and Palette */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
                .font-geist { font-family: 'Geist Mono', monospace; }
            `,
                }}
            />
        </div>
    );
}
