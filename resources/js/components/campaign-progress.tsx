import type { CampaignPalette } from '@/lib/colors';

interface CampaignProgressProps {
    raisedAmount: number;
    goalAmount: number;
    donorCount: number;
    progress: number;
    formatCurrency: (amount: number) => string;
    palette: CampaignPalette;
    className?: string;
}

export default function CampaignProgress({
    raisedAmount,
    goalAmount,
    donorCount,
    progress,
    formatCurrency,
    palette,
    className = '',
}: CampaignProgressProps) {
    return (
        <section
            className={`space-y-4 rounded-2xl p-5 md:p-6 ${className}`}
            style={{ backgroundColor: palette['surface-inverse'] }}
        >
            <span
                className="font-inter text-[12px] font-bold tracking-widest uppercase"
                style={{ color: palette['foreground-muted'] }}
            >
                Campaign Progress
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <span className="font-geist text-2xl font-bold text-white">
                        {formatCurrency(raisedAmount)}
                    </span>
                    <p className="font-inter text-[11px] text-white/60">
                        raised of {formatCurrency(goalAmount)}
                    </p>
                </div>
                <div className="text-right">
                    <span className="font-geist text-2xl font-bold text-white">
                        {donorCount}
                    </span>
                    <p className="font-inter text-[11px] text-white/60 uppercase">
                        donors
                    </p>
                </div>
            </div>
        </section>
    );
}
