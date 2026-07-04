import { Head, Link } from '@inertiajs/react';
import { Share2, ChevronLeft, Users, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import DonationForm from '@/components/donation-form';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';

interface Campaign {
    id: number;
    name: string;
    tagline: string;
    description_html: string;
    about_title: string;
    goal_amount: number;
    currency: string;
    donation_presets: any[];
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

export default function Show({ campaign, charity, totalRaised = 34250, donorCount = 482 }: { 
    campaign: Campaign, 
    charity: Charity,
    totalRaised?: number,
    donorCount?: number
}) {
    // Surface tint colors
    const tintStyles = useMemo(() => {
        const tints = {
            warm: { bg: '#F2F4E8', text: '#2D5A41', muted: '#4A6B53' },
            cool: { bg: '#E8F2F4', text: '#2D4A5A', muted: '#4A536B' },
            neutral: { bg: '#F4F4F4', text: '#2D2D2D', muted: '#5A5A5A' }
        };
        const activeTint = tints[charity.surface_tint] || tints.neutral;

        return {
            '--brand-primary': charity.brand_color,
            '--tint-bg': activeTint.bg,
            '--tint-text': activeTint.text,
            '--tint-muted': activeTint.muted,
        } as React.CSSProperties;
    }, [charity.brand_color, charity.surface_tint]);

    const progress = Math.min(100, (totalRaised / campaign.goal_amount) * 100);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans" style={tintStyles}>
            <Head title={`${campaign.name} - ${charity.name}`} />
            
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link 
                            href={home()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-zinc-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            All Charities
                        </Link>
                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
                        <span className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight hidden sm:block">
                            {campaign.name}
                        </span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-zinc-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Hero Section */}
                        <section className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] shadow-2xl">
                            {campaign.hero_url ? (
                                <img src={campaign.hero_url} alt={campaign.name} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-zinc-900"></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 sm:p-12 text-white">
                                {charity.logo_url && (
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                                        <img src={charity.logo_url} alt={charity.name} className="w-8 h-8 object-contain" />
                                    </div>
                                )}
                                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4">
                                    {campaign.name}
                                </h1>
                                <p className="text-lg sm:text-xl font-medium text-white/80 max-w-xl">
                                    {campaign.tagline}
                                </p>
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {campaign.gallery.map((url, i) => (
                                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
                                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {/* Placeholders if less than 4 */}
                            {[...Array(Math.max(0, 4 - campaign.gallery.length))].map((_, i) => (
                                <div key={`p-${i}`} className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white/50 animate-pulse"></div>
                                </div>
                            ))}
                        </section>

                        {/* About Section */}
                        <section className="rounded-[2.5rem] p-10 sm:p-16 space-y-8" style={{ backgroundColor: 'var(--tint-bg)' }}>
                            <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--tint-text)' }}>
                                {campaign.about_title}
                            </h2>
                            <div 
                                className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none font-medium leading-relaxed"
                                style={{ color: 'var(--tint-muted)' }}
                                dangerouslySetInnerHTML={{ __html: campaign.description_html }}
                            />
                        </section>
                    </div>

                    {/* Right Column: Donation Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-24 space-y-6">
                            
                            <DonationForm campaign={campaign} charity={charity} />

                            {/* Progress Card */}
                            <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-zinc-900 text-white">
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign Progress</span>
                                            <span className="text-xs font-black">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${progress}%`, backgroundColor: charity.brand_color }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="space-y-1">
                                            <div className="text-3xl font-black flex items-center gap-1">
                                                <span className="text-lg opacity-50">€</span>
                                                {(totalRaised / 100).toLocaleString()}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                                                raised of <span className="text-white">€{(campaign.goal_amount / 100).toLocaleString()}</span>
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="text-3xl font-black flex items-center justify-end gap-2">
                                                {donorCount}
                                                <Users className="w-5 h-5 text-zinc-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                generous donors
                                            </p>
                                        </div>
                                    </div>

                                    {progress >= 100 && (
                                        <div className="p-4 bg-green-500/20 rounded-2xl border border-green-500/30 flex items-center gap-3">
                                            <Trophy className="w-5 h-5 text-green-400" />
                                            <p className="text-xs font-bold text-green-400">Goal achieved! Every extra bit helps.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    Member of the CodeSprint Charity Network
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-zinc-50 dark:bg-zinc-900/50 py-12 mt-12 border-t border-zinc-100 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold">T</div>
                        <span className="font-black tracking-tight">Tap For Good</span>
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        © 2026 CodeSprintMT. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors">Privacy</a>
                        <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors">Terms</a>
                        <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
