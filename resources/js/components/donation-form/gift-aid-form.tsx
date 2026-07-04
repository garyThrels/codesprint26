import { Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { CampaignPalette } from '@/lib/colors';

interface GiftAidFormProps {
    enabled: boolean;
    onEnabledChange: (value: boolean) => void;
    name: string;
    onNameChange: (value: string) => void;
    address: string;
    onAddressChange: (value: string) => void;
    style: React.CSSProperties;
    errors?: {
        name?: string;
        address?: string;
    };
    palette?: CampaignPalette;
}

export function GiftAidForm({
    enabled,
    onEnabledChange,
    name,
    onNameChange,
    address,
    onAddressChange,
    style,
    errors,
    palette,
}: GiftAidFormProps) {
    return (
        <div className="space-y-4" style={style}>
            <div
                className="flex items-start space-x-3 rounded-xl p-4"
                style={{
                    backgroundColor:
                        palette?.['surface-primary'] || 'var(--brand-surface)',
                }}
            >
                <Checkbox
                    id="gift-aid"
                    checked={enabled}
                    onCheckedChange={(checked) => onEnabledChange(!!checked)}
                    className="mt-1 h-5 w-5 rounded-md border-zinc-200"
                />
                <div className="flex flex-1 flex-col space-y-1">
                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor="gift-aid"
                            className="cursor-pointer font-inter text-sm font-bold text-brand-foreground select-none"
                        >
                            Gift Aid declaration
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button type="button">
                                        <Info className="h-3.5 w-3.5 text-brand-foreground-muted" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px] text-xs">
                                    Boost your gift by 25% at no extra cost to
                                    you. We just need your name and home address
                                    to claim it.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="font-inter text-xs text-brand-foreground-muted">
                        Boost your gift by 25% at no extra cost (demo).
                    </span>
                </div>
            </div>

            {enabled && (
                <div
                    className="flex animate-in flex-col gap-4 rounded-xl p-5 duration-300 fade-in slide-in-from-top-2"
                    style={{
                        backgroundColor:
                            palette?.['surface-secondary'] ||
                            'var(--brand-surface-secondary)',
                    }}
                >
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="ga-name"
                            className="text-xs font-bold text-brand-foreground-muted uppercase"
                        >
                            Your full name
                        </Label>
                        <Input
                            id="ga-name"
                            placeholder="John Doe"
                            className="h-12 border-none"
                            style={{
                                backgroundColor:
                                    palette?.['surface-primary'] ||
                                    'var(--brand-surface)',
                            }}
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                        />
                        {errors?.name && (
                            <p className="animate-in text-[10px] font-semibold text-red-500 fade-in slide-in-from-top-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="ga-address"
                            className="text-xs font-bold text-brand-foreground-muted uppercase"
                        >
                            Home address
                        </Label>
                        <Input
                            id="ga-address"
                            placeholder="Street, City, Postcode"
                            className="h-12 border-none"
                            style={{
                                backgroundColor:
                                    palette?.['surface-primary'] ||
                                    'var(--brand-surface)',
                            }}
                            value={address}
                            onChange={(e) => onAddressChange(e.target.value)}
                        />
                        {errors?.address && (
                            <p className="animate-in text-[10px] font-semibold text-red-500 fade-in slide-in-from-top-1">
                                {errors.address}
                            </p>
                        )}
                    </div>
                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox
                            id="ga-confirm"
                            checked={enabled}
                            disabled
                            className="mt-1"
                        />
                        <Label
                            htmlFor="ga-confirm"
                            className="text-[11px] leading-tight text-brand-foreground-secondary"
                        >
                            I confirm I am a taxpayer and want Gift Aid added to
                            my donation.
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
}
