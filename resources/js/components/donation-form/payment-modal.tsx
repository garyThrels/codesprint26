import { useState } from 'react';
import {
    Heart,
    ShieldCheck,
    SmartphoneNfc,
    Nfc,
    X,
    ChevronLeft,
    CreditCard,
    Lock,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { GiftAidForm } from './gift-aid-form';
import { CardForm } from './card-form';
import { DonationOptions } from './donation-options';
import type { CardData, Campaign, PaymentMethod } from './types';
import type { CampaignPalette } from '@/lib/colors';

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    style: React.CSSProperties;
    campaign: Campaign;
    amountLabel: string;
    card: CardData;
    isRecurring: boolean;
    onRecurringChange: (value: boolean) => void;
    roundUp: boolean;
    onRoundUpChange: (value: boolean) => void;
    donorName: string;
    onDonorNameChange: (value: string) => void;
    isAnonymous: boolean;
    onAnonymousChange: (value: boolean) => void;
    giftAidEnabled: boolean;
    onGiftAidEnabledChange: (value: boolean) => void;
    giftAidName: string;
    onGiftAidNameChange: (value: string) => void;
    giftAidAddress: string;
    onGiftAidAddressChange: (value: string) => void;
    onCardChange: (card: CardData) => void;
    onPay: (method: PaymentMethod) => void;
    palette?: CampaignPalette;
}

export function PaymentModal({
    open,
    onOpenChange,
    style,
    campaign,
    amountLabel,
    card,
    isRecurring,
    onRecurringChange,
    roundUp,
    onRoundUpChange,
    donorName,
    onDonorNameChange,
    isAnonymous,
    onAnonymousChange,
    giftAidEnabled,
    onGiftAidEnabledChange,
    giftAidName,
    onGiftAidNameChange,
    giftAidAddress,
    onGiftAidAddressChange,
    onCardChange,
    onPay,
    palette,
}: PaymentModalProps) {
    const [showManual, setShowManual] = useState(isRecurring);
    const [errors, setErrors] = useState<{
        donorName?: string;
        giftAidName?: string;
        giftAidAddress?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!isAnonymous && !donorName.trim()) {
            newErrors.donorName = 'Please enter your name for the wall';
        }
        if (giftAidEnabled) {
            if (!giftAidName.trim()) {
                newErrors.giftAidName = 'Full name is required for Gift Aid';
            }
            if (!giftAidAddress.trim()) {
                newErrors.giftAidAddress =
                    'Home address is required for Gift Aid';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = (method: PaymentMethod) => {
        if (method !== 'fail' && !validate()) return;
        onPay(method);
    };

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (!newOpen) {
            // Reset to tap view when closed (unless it's recurring)
            setTimeout(() => setShowManual(isRecurring), 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-[430px] overflow-hidden border-none p-0 sm:rounded-3xl"
                style={{
                    ...style,
                    backgroundColor:
                        palette?.['surface-primary'] || 'var(--brand-surface)',
                }}
            >
                <div className="custom-scrollbar flex max-h-[90vh] flex-col overflow-y-auto p-8 pt-6 pb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {showManual && !isRecurring && (
                                <button
                                    onClick={() => setShowManual(false)}
                                    className="rounded-full p-1.5 transition-colors hover:opacity-80"
                                    style={{
                                        backgroundColor:
                                            palette?.['surface-secondary'] ||
                                            'var(--brand-surface-secondary)',
                                    }}
                                >
                                    <ChevronLeft className="h-5 w-5 text-brand-foreground" />
                                </button>
                            )}
                            <h2
                                className="font-playfair text-2xl font-bold"
                                style={{
                                    color:
                                        palette?.['foreground-primary'] ||
                                        'var(--brand-foreground)',
                                }}
                            >
                                {showManual
                                    ? 'Card Details'
                                    : 'Complete Donation'}
                            </h2>
                        </div>
                    </div>

                    {/* Summary */}
                    <div
                        className="flex flex-col items-center justify-center space-y-2 rounded-2xl p-6"
                        style={{
                            backgroundColor:
                                palette?.['surface-secondary'] ||
                                'var(--brand-surface-secondary)',
                        }}
                    >
                        <span className="font-inter text-xs font-medium tracking-widest text-brand-foreground-muted uppercase">
                            Your Donation
                        </span>
                        <span
                            className="font-geist text-4xl font-bold"
                            style={{
                                color:
                                    palette?.['foreground-primary'] ||
                                    'var(--brand-foreground)',
                            }}
                        >
                            {amountLabel}
                        </span>
                        <span className="font-inter text-sm font-medium text-brand-foreground-secondary">
                            to {campaign.name}
                        </span>
                    </div>

                    {!showManual ? (
                        /* Tap to Pay View */
                        <div className="space-y-8">
                            <div className="flex flex-col items-center justify-center space-y-6 py-4">
                                <button
                                    onClick={() => handlePay('tap')}
                                    className="group relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                    aria-label="Tap to pay"
                                >
                                    <div
                                        className="absolute -inset-4 animate-ping rounded-full opacity-10"
                                        style={{
                                            backgroundColor:
                                                palette?.['accent-primary'] ||
                                                'var(--brand-primary)',
                                        }}
                                    />
                                    <div
                                        className="relative rounded-full p-8 transition-colors"
                                        style={{
                                            backgroundColor:
                                                palette?.['surface-primary'] ||
                                                'var(--brand-surface)',
                                        }}
                                    >
                                        <Nfc
                                            className="h-16 w-16"
                                            style={{
                                                color:
                                                    palette?.[
                                                        'accent-primary'
                                                    ] || 'var(--brand-primary)',
                                            }}
                                        />
                                    </div>
                                    <div className="absolute -right-2 -bottom-2 rounded-full bg-white p-2 shadow-lg">
                                        <SmartphoneNfc
                                            className="h-6 w-6"
                                            style={{
                                                color:
                                                    palette?.[
                                                        'foreground-primary'
                                                    ] ||
                                                    'var(--brand-foreground)',
                                            }}
                                        />
                                    </div>
                                </button>
                                <div className="space-y-1 text-center">
                                    <p
                                        className="font-inter text-lg font-bold"
                                        style={{
                                            color:
                                                palette?.[
                                                    'foreground-primary'
                                                ] || 'var(--brand-foreground)',
                                        }}
                                    >
                                        Tap to Pay
                                    </p>
                                    <p className="font-inter text-sm text-brand-foreground-secondary">
                                        Click the icon above to simulate tapping
                                        your device
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div
                                        className="flex items-center space-x-3 rounded-xl p-4"
                                        style={{
                                            backgroundColor:
                                                palette?.[
                                                    'surface-secondary'
                                                ] ||
                                                'var(--brand-surface-secondary)',
                                        }}
                                    >
                                        <Checkbox
                                            id="modal-show-name-tap"
                                            checked={!isAnonymous}
                                            onCheckedChange={(checked) =>
                                                onAnonymousChange(!checked)
                                            }
                                        />
                                        <Label
                                            htmlFor="modal-show-name-tap"
                                            className="flex flex-1 cursor-pointer flex-col select-none"
                                        >
                                            <span className="font-inter text-sm font-bold text-brand-foreground">
                                                Show my name on the supporters
                                                wall
                                            </span>
                                        </Label>
                                    </div>

                                    {!isAnonymous && (
                                        <Input
                                            placeholder="Your name for the wall"
                                            value={donorName}
                                            onChange={(e) =>
                                                onDonorNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 border-none px-4 font-inter font-medium"
                                            style={{
                                                backgroundColor:
                                                    palette?.[
                                                        'surface-secondary'
                                                    ] ||
                                                    'var(--brand-surface-secondary)',
                                            }}
                                        />
                                    )}
                                    {errors.donorName && (
                                        <p className="animate-in text-[10px] font-semibold text-red-500 fade-in slide-in-from-top-1">
                                            {errors.donorName}
                                        </p>
                                    )}

                                    <GiftAidForm
                                        enabled={giftAidEnabled}
                                        onEnabledChange={onGiftAidEnabledChange}
                                        name={giftAidName}
                                        onNameChange={onGiftAidNameChange}
                                        address={giftAidAddress}
                                        onAddressChange={onGiftAidAddressChange}
                                        style={style}
                                        errors={{
                                            name: errors.giftAidName,
                                            address: errors.giftAidAddress,
                                        }}
                                        palette={palette}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    {!isRecurring && (
                                        <button
                                            onClick={() => setShowManual(true)}
                                            className="cursor-pointer font-inter text-sm font-semibold underline transition-colors"
                                            style={{
                                                color:
                                                    palette?.[
                                                        'foreground-secondary'
                                                    ] ||
                                                    'var(--brand-foreground-secondary)',
                                            }}
                                        >
                                            Make a recurring donation or enter
                                            card details manually
                                        </button>
                                    )}

                                    <div
                                        className="flex items-center gap-2 font-inter text-[11px] font-medium"
                                        style={{
                                            color:
                                                palette?.[
                                                    'foreground-secondary'
                                                ] ||
                                                'var(--brand-foreground-muted)',
                                        }}
                                    >
                                        <Lock className="h-3 w-3" />
                                        Secure encrypted transaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Manual Form View */
                        <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-right-4">
                            <DonationOptions
                                isRecurring={isRecurring}
                                onRecurringChange={onRecurringChange}
                                roundUp={roundUp}
                                onRoundUpChange={onRoundUpChange}
                                currencySymbol={campaign.currency.symbol}
                                roundUpAmount={10}
                                style={{}}
                                palette={palette}
                            />

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold tracking-widest text-brand-foreground-muted uppercase">
                                        Donor Recognition
                                    </Label>
                                    <div
                                        className="flex items-center space-x-3 rounded-xl p-4"
                                        style={{
                                            backgroundColor:
                                                palette?.[
                                                    'surface-secondary'
                                                ] ||
                                                'var(--brand-surface-secondary)',
                                        }}
                                    >
                                        <Checkbox
                                            id="modal-show-name-manual"
                                            checked={!isAnonymous}
                                            onCheckedChange={(checked) =>
                                                onAnonymousChange(!checked)
                                            }
                                        />
                                        <Label
                                            htmlFor="modal-show-name-manual"
                                            className="flex flex-1 cursor-pointer flex-col select-none"
                                        >
                                            <span className="font-inter text-sm font-bold text-brand-foreground">
                                                Show my name on the wall
                                            </span>
                                        </Label>
                                    </div>
                                    {!isAnonymous && (
                                        <Input
                                            placeholder="Your name for the wall"
                                            value={donorName}
                                            onChange={(e) =>
                                                onDonorNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 h-12 border-none px-4 font-inter font-medium"
                                            style={{
                                                backgroundColor:
                                                    palette?.[
                                                        'surface-secondary'
                                                    ] ||
                                                    'var(--brand-surface-secondary)',
                                            }}
                                        />
                                    )}
                                    {errors.donorName && (
                                        <p className="mt-1 animate-in text-[10px] font-semibold text-red-500 fade-in slide-in-from-top-1">
                                            {errors.donorName}
                                        </p>
                                    )}
                                </div>

                                <GiftAidForm
                                    enabled={giftAidEnabled}
                                    onEnabledChange={onGiftAidEnabledChange}
                                    name={giftAidName}
                                    onNameChange={onGiftAidNameChange}
                                    address={giftAidAddress}
                                    onAddressChange={onGiftAidAddressChange}
                                    style={style}
                                    errors={{
                                        name: errors.giftAidName,
                                        address: errors.giftAidAddress,
                                    }}
                                    palette={palette}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold tracking-widest text-brand-foreground-muted uppercase">
                                    Card Information
                                </Label>
                                <CardForm card={card} onChange={onCardChange} />
                            </div>

                            <div className="space-y-6 pt-2">
                                <Button
                                    className="h-16 w-full rounded-2xl font-inter text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        backgroundColor:
                                            palette?.['accent-primary'] ||
                                            'var(--brand-primary)',
                                    }}
                                    onClick={() => handlePay('manual')}
                                >
                                    <Heart className="mr-2 h-5 w-5 fill-current" />
                                    Confirm Donation
                                </Button>

                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="flex items-center justify-center gap-2 font-inter text-[11px] font-medium"
                                        style={{
                                            color:
                                                palette?.[
                                                    'foreground-secondary'
                                                ] ||
                                                'var(--brand-foreground-muted)',
                                        }}
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Secured with 256-bit SSL encryption
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Test Tools */}
                    <div
                        className="mt-4 flex flex-col items-center gap-3 border-t pt-6"
                        style={{
                            borderColor:
                                palette?.['surface-secondary'] ||
                                'var(--brand-surface-secondary)',
                        }}
                    >
                        <span
                            className="font-inter text-[10px] font-bold tracking-widest uppercase"
                            style={{
                                color:
                                    palette?.['foreground-secondary'] ||
                                    'var(--brand-foreground-muted)',
                            }}
                        >
                            Test Tools
                        </span>
                        <button
                            onClick={() => onPay('fail')}
                            className="flex items-center gap-1.5 font-inter text-xs font-semibold text-red-500/60 transition-colors hover:text-red-500"
                        >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Simulate Payment Failure
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
