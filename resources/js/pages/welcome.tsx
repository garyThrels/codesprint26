import { Head, Link } from '@inertiajs/react';
import { Heart, ChevronRight, Users } from 'lucide-react';
import { show as showCampaign } from '@/routes/campaigns';

interface Campaign {
    id: number;
    name: string;
    tagline: string;
    goal_amount: number;
    hero_url: string;
    charity: {
        name: string;
        brand_color: string;
        logo_url: string;
    };
    currency: {
        code: string;
        symbol: string;
    };
}

export default function Welcome({ campaigns }: { campaigns: Campaign[] }) {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white dark:bg-zinc-950">
            <Head title="Tap For Good - Every Tap Matters" />

            {/* Hero Section */}
            <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-zinc-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-zinc-50 dark:to-zinc-950"></div>
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                        alt="Hero background"
                        className="h-full w-full object-cover opacity-60"
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 text-center">
                    <div className="inline-flex animate-in items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md duration-700 fade-in slide-in-from-bottom">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        CodeSprint Charity Network
                    </div>
                    <h1 className="animate-in text-6xl leading-tight font-black tracking-tighter text-white delay-150 duration-700 fade-in slide-in-from-bottom sm:text-8xl">
                        Every Tap <br className="hidden sm:block" />
                        <span className="text-zinc-400 italic">Matters.</span>
                    </h1>
                    <p className="mx-auto max-w-2xl animate-in text-xl font-medium text-white/80 delay-300 duration-700 fade-in slide-in-from-bottom sm:text-2xl">
                        Join our mission to empower communities and save lives
                        through simple, secure, and meaningful giving.
                    </p>
                </div>
            </section>

            {/* Campaigns Grid */}
            <main className="relative z-20 mx-auto -mt-24 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <Link
                            key={campaign.id}
                            href={showCampaign(campaign.id)}
                            className="group block"
                        >
                            <article className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-xl transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="relative aspect-4/3 overflow-hidden">
                                    {campaign.hero_url ? (
                                        <img
                                            src={campaign.hero_url}
                                            alt={campaign.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800"></div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <div className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-zinc-900/90">
                                            <img
                                                src={
                                                    campaign.charity.logo_url ||
                                                    '/images/placeholder-logo.png'
                                                }
                                                alt={campaign.charity.name}
                                                className="h-5 w-5 object-contain"
                                            />
                                            <span className="text-[10px] font-black tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
                                                {campaign.charity.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                </div>

                                <div className="flex grow flex-col space-y-4 p-8">
                                    <h3 className="line-clamp-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                                        {campaign.name}
                                    </h3>
                                    <p className="line-clamp-2 text-sm leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
                                        {campaign.tagline}
                                    </p>

                                    <div className="mt-auto space-y-4 pt-4">
                                        <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase">
                                            <span className="text-zinc-400">
                                                Target
                                            </span>
                                            <span className="text-zinc-900 dark:text-zinc-100">
                                                {campaign.currency.symbol}
                                                {(campaign.goal_amount / 100).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: '45%',
                                                    backgroundColor:
                                                        campaign.charity
                                                            .brand_color,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                                                <Users className="h-3.5 w-3.5" />
                                                <span>482 Donors</span>
                                            </div>
                                            <div
                                                className="flex items-center gap-1 text-sm font-black transition-transform group-hover:translate-x-1"
                                                style={{
                                                    color: campaign.charity
                                                        .brand_color,
                                                }}
                                            >
                                                Donate
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {/* Empty State / Add Campaign */}
                    {campaigns.length === 0 && (
                        <div className="col-span-full space-y-6 py-24 text-center">
                            <div className="inline-flex rounded-[2.5rem] bg-zinc-100 p-6 dark:bg-zinc-800">
                                <img src="/logo.png" alt="Tap For Good" className="h-12 w-12" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                                No active campaigns
                            </h2>
                            <p className="mx-auto max-w-sm font-medium text-zinc-500">
                                We are currently preparing new initiatives.
                                Check back soon or register your charity to get
                                started.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-100 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-7xl space-y-8 px-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-xl font-black text-white dark:bg-zinc-100 dark:text-zinc-900">
                            T
                        </div>
                        <span className="text-2xl font-black tracking-tight">
                            Tap For Good
                        </span>
                    </div>
                    <p className="mx-auto max-w-md font-medium text-zinc-500">
                        A project built for CodeSprint 2026. Empowering
                        charities through seamless digital transactions.
                    </p>
                    <div className="flex justify-center gap-8 text-xs font-black tracking-widest text-zinc-400 uppercase">
                        <a
                            href="#"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
