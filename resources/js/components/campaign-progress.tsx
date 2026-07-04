import type { CampaignPalette } from '@/lib/colors';

interface CampaignProgressProps {
    raisedAmount?: number;
    goalAmount: number;
    donorCount?: number;
    progress: number;
    formatCurrency: (amount: number) => string;
    className?: string;
    palette?: CampaignPalette;
}

export default function CampaignProgress({
    raisedAmount,
    goalAmount,
    donorCount,
    progress,
    formatCurrency,
    className = '',
    palette,
}: CampaignProgressProps) {
    return (
        <section
            className={`space-y-4 rounded-2xl p-5 md:p-6 ${className}`}
            style={{
                backgroundColor:
                    palette?.['surface-inverse'] ||
                    'var(--brand-surface-inverse)',
            }}
        >
            <span
                className="font-inter text-[12px] font-bold tracking-widest uppercase opacity-60"
                style={{ color: palette?.['foreground-inverse'] || 'white' }}
            >
                Campaign Progress
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: palette?.['accent-primary'] || 'white',
                    }}
                />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <span className="font-geist text-2xl font-bold text-white">
                        {formatCurrency(raisedAmount ?? 0)}
                    </span>
                    <p className="font-inter text-[11px] text-white/60">
                        raised of {formatCurrency(goalAmount)}
                    </p>
                </div>
                <div className="text-right">
                    <span className="font-geist text-2xl font-bold text-white">
                        {donorCount ?? 'N/A'}
                    </span>
                    <p className="font-inter text-[11px] text-white/60 uppercase">
                        donors
                    </p>
                </div>
            </div>
        </section>
    );
}
