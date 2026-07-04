import { Head, Link } from '@inertiajs/react';
import { Heart, ChevronRight, ShieldCheck } from 'lucide-react';
import { show as showCampaign } from '@/routes/campaigns';

import type { Campaign } from '@/types';

import { useBrandBranding } from '@/hooks/use-brand-branding';

function CampaignCard({ campaign }: { campaign: Campaign }) {
    const brandingStyles = useBrandBranding(
        campaign.charity.brand_color,
        campaign.charity.surface_tint || 'warm',
    );

    return (
        <Link href={showCampaign(campaign.id)} className="group block">
            <article
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-surface-secondary bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl"
                style={brandingStyles}
            >
                <div className="relative aspect-4/3 overflow-hidden">
                    {campaign.hero_url ? (
                        <img
                            src={campaign.hero_url}
                            alt={campaign.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="h-full w-full bg-zinc-100"></div>
                    )}
                    <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                            {campaign.charity.logo_url && (
                                <img
                                    src={campaign.charity.logo_url}
                                    alt={campaign.charity.name}
                                    className="h-4 w-4 object-contain"
                                />
                            )}
                            <span className="font-inter text-[10px] font-bold tracking-widest text-brand-foreground uppercase">
                                {campaign.charity.name}
                            </span>
                        </div>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-primary opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
                </div>

                <div className="flex grow flex-col space-y-3 p-7">
                    <h3 className="line-clamp-1 font-playfair text-2xl font-bold text-brand-foreground">
                        {campaign.name}
                    </h3>
                    <p className="line-clamp-2 font-inter text-sm leading-relaxed font-medium text-brand-foreground-secondary">
                        {campaign.tagline}
                    </p>

                    <div className="mt-auto space-y-4 pt-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-surface-secondary">
                            <div
                                className="h-full rounded-full bg-brand-primary transition-all duration-1000 group-hover:opacity-80"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-geist text-[14px] font-bold text-brand-foreground">
                                    {campaign.currency.symbol}
                                    {(
                                        campaign.goal_amount / 100
                                    ).toLocaleString()}
                                </span>
                                <span className="font-inter text-[10px] font-bold tracking-wider text-brand-foreground-muted uppercase">
                                    Target Goal
                                </span>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white transition-all duration-300 group-hover:scale-110">
                                <ChevronRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function Welcome({ campaigns }: { campaigns: Campaign[] }) {
    return (
        <div className="min-h-screen bg-[#F9F9F8] font-inter">
            <Head title="Tap For Good - Every Tap Matters" />

            {/* Premium Hero Section */}
            <section className="relative flex h-[85vh] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#F9F9F8]" />
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                        alt="Hero background"
                        className="animate-pulse-slow h-full w-full scale-105 object-cover"
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 text-center">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-xl transition-all hover:bg-white/20">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        CodeSprint Global Network
                    </div>
                    <h1 className="font-playfair text-7xl leading-[1.1] font-black tracking-tight text-white sm:text-9xl">
                        Every Tap <br />
                        <span className="italic opacity-50">Matters.</span>
                    </h1>
                    <p className="mx-auto max-w-xl font-inter text-lg font-medium text-white/90 sm:text-xl">
                        A seamless, secure way to support the causes you love.
                        Direct impact, powered by Mastercard.
                    </p>
                </div>
            </section>

            {/* Campaigns Grid */}
            <main className="relative z-20 mx-auto -mt-32 max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}

                    {/* Empty State */}
                    {campaigns.length === 0 && (
                        <div className="col-span-full space-y-6 py-32 text-center">
                            <div className="inline-flex rounded-3xl bg-white p-8 shadow-sm">
                                <Heart className="h-12 w-12 text-zinc-200" />
                            </div>
                            <h2 className="font-playfair text-3xl font-bold text-zinc-900">
                                New campaigns incoming
                            </h2>
                            <p className="mx-auto max-w-sm font-inter font-medium text-zinc-400">
                                We're working with charities to launch
                                meaningful initiatives. Check back very soon.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Secure Footer Section */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-4xl space-y-12 px-4 text-center">
                    <div className="space-y-4">
                        <h2 className="font-playfair text-4xl font-bold text-zinc-900">
                            Direct Impact, Guaranteed.
                        </h2>
                        <p className="font-inter text-lg text-zinc-500">
                            100% of your donation goes directly to the charity's
                            mission. Powered by global-standard security.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
                        <div className="flex items-center gap-2 font-geist font-bold">
                            <ShieldCheck className="h-6 w-6" />
                            SSL SECURED
                        </div>
                        <div className="font-inter text-2xl font-black tracking-tighter">
                            Mastercard.
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#111111] py-20 text-white">
                <div className="mx-auto max-w-7xl space-y-10 px-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2">
                            <img
                                src="/logo.png"
                                alt="Tap For Good"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span className="font-playfair text-3xl font-bold tracking-tight">
                            Tap For Good
                        </span>
                    </div>
                    {/* <div className="flex justify-center gap-10 font-inter text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div> */}
                </div>
            </footer>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.6; transform: scale(1.05); }
                    50% { opacity: 0.7; transform: scale(1.08); }
                }
                .animate-pulse-slow { animation: pulse-slow 10s infinite ease-in-out; }
            `,
                }}
            />
        </div>
    );
}
