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
import type { Campaign, Charity } from './types';
import type { CampaignPalette } from '@/lib/colors';
import type { Currency } from '@/types/currency';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AmountSelectorProps {
    campaign: Campaign;
    charity: Charity;
    selectedAmount: number | null;
    customAmount: string;
    selectedCurrency: Currency;
    onSelectAmount: (amount: number) => void;
    onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCurrencyChange: (currency: Currency) => void;
    onDonate: () => void;
    palette?: CampaignPalette;
}

export function AmountSelector({
    campaign,
    charity,
    selectedAmount,
    customAmount,
    selectedCurrency,
    onSelectAmount,
    onCustomAmountChange,
    onCurrencyChange,
    onDonate,
    palette,
}: AmountSelectorProps) {
    return (
        <Card
            className="overflow-hidden border-none shadow-none"
            style={{
                backgroundColor:
                    palette?.['surface-secondary'] ||
                    'var(--brand-surface-secondary)',
            }}
        >
            <CardHeader className="pt-8 pb-4">
                <CardTitle
                    className="font-playfair text-2xl font-bold"
                    style={{
                        color:
                            palette?.['foreground-primary'] ||
                            'var(--brand-foreground)',
                    }}
                >
                    Choose Your Donation
                </CardTitle>
                {charity.supported_currencies &&
                    charity.supported_currencies.length > 1 && (
                        <div className="mt-2">
                            <Select
                                value={selectedCurrency.id.toString()}
                                onValueChange={(value) => {
                                    const currency =
                                        charity.supported_currencies?.find(
                                            (c) => c.id.toString() === value,
                                        );
                                    if (currency) onCurrencyChange(currency);
                                }}
                            >
                                <SelectTrigger
                                    className="h-9 w-[120px] border-none shadow-sm"
                                    style={{
                                        backgroundColor:
                                            palette?.['surface-primary'] ||
                                            'white',
                                        color:
                                            palette?.['foreground-primary'] ||
                                            'black',
                                    }}
                                >
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {charity.supported_currencies.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={c.id.toString()}
                                        >
                                            {c.code} ({c.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                    {campaign.donation_presets.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                onSelectAmount(Number(preset.amount))
                            }
                            className={`flex h-20 flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                Number(selectedAmount) === Number(preset.amount)
                                    ? 'scale-105 shadow-md'
                                    : 'shadow-sm hover:scale-[1.02]'
                            }`}
                            style={{
                                backgroundColor:
                                    Number(selectedAmount) ===
                                    Number(preset.amount)
                                        ? palette?.['surface-inverse'] ||
                                          'var(--brand-surface-inverse)'
                                        : palette?.['surface-primary'] ||
                                          'white',
                                color:
                                    Number(selectedAmount) ===
                                    Number(preset.amount)
                                        ? palette?.['foreground-inverse'] ||
                                          'white'
                                        : palette?.['foreground-primary'] ||
                                          'black',
                            }}
                        >
                            <span className="font-geist text-2xl font-bold">
                                {selectedCurrency.symbol}
                                {preset.amount / 100}
                            </span>
                            <span className="font-inter text-[11px] font-medium tracking-wider uppercase opacity-70">
                                {preset.label}
                            </span>
                        </button>
                    ))}
                </div>

                {campaign.allow_custom_amount && (
                    <div className="group relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-geist text-lg font-bold text-brand-foreground-muted">
                            {selectedCurrency.symbol}
                        </span>
                        <Input
                            type="number"
                            placeholder="Enter custom amount"
                            className="h-14 border-none pl-10 font-geist text-lg font-bold focus-visible:ring-2"
                            style={{
                                backgroundColor:
                                    palette?.['surface-primary'] || 'white',
                                color:
                                    palette?.['foreground-primary'] || 'black',
                            }}
                            value={customAmount}
                            onChange={onCustomAmountChange}
                        />
                    </div>
                )}

                <Button
                    onClick={onDonate}
                    className="h-14 w-full rounded-full font-inter text-lg font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                        backgroundColor:
                            palette?.['accent-primary'] ||
                            'var(--brand-primary)',
                    }}
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
