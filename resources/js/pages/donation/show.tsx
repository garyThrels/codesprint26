import SEO from '@/components/seo';
import { useMemo } from 'react';
import CampaignNavbar from '@/components/campaign-navbar';
import CampaignProgress from '@/components/campaign-progress';
import DonationForm from '@/components/donation-form';
import { useBrandBranding } from '@/hooks/use-brand-branding';
import { useState } from 'react';
import ShareModal from '@/components/share-modal';
import { Share2 } from 'lucide-react';

import type { Campaign, Charity } from '@/types';

export default function CampaignShow({
    campaign,
    charity,
}: {
    campaign: Campaign;
    charity: Charity;
}) {
    const brandingStyles = useBrandBranding(
        charity.brand_color,
        charity.surface_tint,
    );

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
        <div className="min-h-screen bg-brand-surface" style={brandingStyles}>
            <SEO 
                title={campaign.name}
                description={campaign.tagline}
                image={campaign.hero_url}
            />

            <CampaignNavbar 
                title={`${campaign.name} - ${charity.name}`} 
                onShare={() => setIsShareModalOpen(true)}
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
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(to top, color-mix(in srgb, var(--brand-surface-inverse), transparent 12%) 0%, transparent 70%)`,
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
                                    <div className="flex items-start justify-between gap-4">
                                        <h1 className="font-playfair text-2xl font-bold text-white md:text-4xl">
                                            {campaign.name}
                                        </h1>
                                        <button 
                                            onClick={() => setIsShareModalOpen(true)}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 md:hidden"
                                        >
                                            <Share2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="font-inter text-sm text-white/85 md:text-base">
                                        {campaign.tagline}
                                    </p>
                                    <div className="mt-2">
                                        <span className="rounded-full bg-brand-surface-inverse px-2 py-1 font-inter text-sm font-semibold text-white">
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
                        />

                        {/* About Section */}
                        <section className="space-y-4 rounded-2xl bg-brand-surface-secondary p-5 shadow-sm md:space-y-6 md:rounded-3xl md:p-8">
                            <h2 className="font-playfair text-xl font-bold text-brand-foreground md:text-2xl">
                                {campaign.about_title || 'About this Campaign'}
                            </h2>
                            <div
                                className="font-inter text-sm leading-[1.65] text-brand-foreground-secondary md:text-[15px]"
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
                        />

                        {/* Additional Info / Trust Badges */}
                        <div className="space-y-4 px-4 text-center">
                            <p className="font-inter text-[13px] text-brand-foreground-secondary italic">
                                "{charity.slogan}"
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={campaign.name}
            />
        </div>
    );
}
