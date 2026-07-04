import { Heart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Campaign } from './types';

interface AmountSelectorProps {
    campaign: Campaign;
    selectedAmount: number | null;
    customAmount: string;
    onSelectAmount: (amount: number) => void;
    onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDonate: () => void;
}

export function AmountSelector({
    campaign,
    selectedAmount,
    customAmount,
    onSelectAmount,
    onCustomAmountChange,
    onDonate,
}: AmountSelectorProps) {
    return (
        <Card className="overflow-hidden border-none bg-brand-surface-secondary shadow-none">
            <CardHeader className="pt-8 pb-4">
                <CardTitle className="font-playfair text-2xl font-bold text-brand-foreground">
                    Choose Your Donation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                    {campaign.donation_presets.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectAmount(Number(preset.amount))}
                            className={`flex h-20 flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                Number(selectedAmount) === Number(preset.amount)
                                    ? 'scale-105 bg-brand-surface-inverse text-brand-foreground-inverse shadow-md'
                                    : 'bg-brand-surface text-brand-foreground shadow-sm hover:scale-[1.02]'
                            }`}
                        >
                            <span className="font-geist text-2xl font-bold">
                                {campaign.currency.symbol}
                                {preset.amount / 100}
                            </span>
                            <span
                                className={`font-inter text-[11px] font-medium tracking-wider uppercase ${
                                    selectedAmount === preset.amount
                                        ? 'text-brand-foreground-inverse opacity-70'
                                        : 'text-brand-foreground-muted opacity-50'
                                }`}
                            >
                                {preset.label}
                            </span>
                        </button>
                    ))}
                </div>

                {campaign.allow_custom_amount && (
                    <div className="group relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-geist text-lg font-bold text-brand-foreground-muted">
                            {campaign.currency.symbol}
                        </span>
                        <Input
                            type="number"
                            placeholder="Enter custom amount"
                            className="h-14 border-none bg-brand-surface pl-10 font-geist text-lg font-bold text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand-primary"
                            value={customAmount}
                            onChange={onCustomAmountChange}
                        />
                    </div>
                )}

                <Button
                    onClick={onDonate}
                    className="h-14 w-full rounded-full bg-brand-primary font-inter text-lg font-bold text-white shadow-xl transition-all active:scale-[0.98]"
                >
                    <Heart className="mr-2 h-5 w-5 fill-current" />
                    Donate Now
                </Button>
            </CardContent>
            <CardFooter className="justify-center pt-2 pb-8">
                <div className="flex items-center gap-2 font-inter text-[11px] font-medium tracking-wide text-brand-foreground-muted uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure payment via Mastercard
                </div>
            </CardFooter>
        </Card>
    );
}
