import { Repeat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { CampaignPalette } from '@/lib/colors';

interface DonationOptionsProps {
    isRecurring: boolean;
    onRecurringChange: (value: boolean) => void;
    roundUp: boolean;
    onRoundUpChange: (value: boolean) => void;
    currencySymbol: string;
    roundUpAmount: number; // e.g. 10 for nearest 10
    style: React.CSSProperties;
    palette?: CampaignPalette;
}

export function DonationOptions({
    isRecurring,
    onRecurringChange,
    roundUp,
    onRoundUpChange,
    currencySymbol,
    roundUpAmount,
    style,
    palette,
}: DonationOptionsProps) {
    return (
        <div className="space-y-4" style={style}>
            <div className="flex flex-col gap-2">
                <Label className="font-inter text-xs font-bold tracking-widest text-brand-foreground-muted uppercase">
                    Donation Options
                </Label>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={isRecurring ? 'outline' : 'default'}
                        className="h-12 rounded-xl border-none font-inter font-bold"
                        style={{
                            backgroundColor: !isRecurring
                                ? palette?.['surface-inverse'] ||
                                  'var(--brand-surface-inverse)'
                                : palette?.['surface-primary'] ||
                                  'var(--brand-surface)',
                            color: !isRecurring
                                ? palette?.['foreground-inverse'] || 'white'
                                : palette?.['foreground-primary'] ||
                                  'var(--brand-foreground)',
                        }}
                        onClick={() => onRecurringChange(false)}
                    >
                        One-time
                    </Button>
                    <Button
                        type="button"
                        variant={isRecurring ? 'default' : 'outline'}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl border-none font-inter font-bold"
                        style={{
                            backgroundColor: isRecurring
                                ? palette?.['surface-inverse'] ||
                                  'var(--brand-surface-inverse)'
                                : palette?.['surface-primary'] ||
                                  'var(--brand-surface)',
                            color: isRecurring
                                ? palette?.['foreground-inverse'] || 'white'
                                : palette?.['foreground-primary'] ||
                                  'var(--brand-foreground)',
                        }}
                        onClick={() => onRecurringChange(true)}
                    >
                        <Repeat className="h-4 w-4" />
                        Monthly
                    </Button>
                </div>
            </div>

            <div
                className="flex items-center space-x-3 rounded-xl p-4"
                style={{
                    backgroundColor:
                        palette?.['surface-primary'] || 'var(--brand-surface)',
                }}
            >
                <Checkbox
                    id="round-up"
                    checked={roundUp}
                    onCheckedChange={(checked) => onRoundUpChange(!!checked)}
                    className="h-5 w-5 rounded-md border-zinc-200"
                />
                <Label
                    htmlFor="round-up"
                    className="flex flex-1 cursor-pointer flex-col select-none"
                >
                    <span className="font-inter text-sm font-bold text-brand-foreground">
                        Round up to the nearest {currencySymbol}
                        {roundUpAmount}
                    </span>
                    <span className="font-inter text-xs text-brand-foreground-muted">
                        Boost your impact with a small extra gift
                    </span>
                </Label>
            </div>
        </div>
    );
}
