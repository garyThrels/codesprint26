interface CampaignProgressProps {
    raisedAmount?: number;
    goalAmount: number;
    donorCount?: number;
    progress: number;
    formatCurrency: (amount: number) => string;
    className?: string;
}

export default function CampaignProgress({
    raisedAmount,
    goalAmount,
    donorCount,
    progress,
    formatCurrency,
    className = '',
}: CampaignProgressProps) {
    return (
        <section
            className={`space-y-4 rounded-2xl bg-brand-surface-inverse p-5 md:p-6 ${className}`}
        >
            <span className="font-inter text-[12px] font-bold tracking-widest text-brand-foreground-muted uppercase">
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
