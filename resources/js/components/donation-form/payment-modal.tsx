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
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { CardForm } from './card-form';
import type { CardData, Campaign, PaymentMethod } from './types';

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    style: React.CSSProperties;
    campaign: Campaign;
    amountLabel: string;
    card: CardData;
    onCardChange: (card: CardData) => void;
    onPay: (method: PaymentMethod) => void;
}

export function PaymentModal({
    open,
    onOpenChange,
    style,
    campaign,
    amountLabel,
    card,
    onCardChange,
    onPay,
}: PaymentModalProps) {
    const [showManual, setShowManual] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (!newOpen) {
            // Reset to tap view when closed
            setTimeout(() => setShowManual(false), 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-[430px] overflow-hidden border-none bg-brand-surface p-0 sm:rounded-3xl"
                style={style}
            >
                <div className="space-y-8 p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {showManual && (
                                <button
                                    onClick={() => setShowManual(false)}
                                    className="rounded-full bg-brand-surface-secondary p-1.5 transition-colors hover:bg-brand-surface-secondary/80"
                                >
                                    <ChevronLeft className="h-5 w-5 text-brand-foreground" />
                                </button>
                            )}
                            <h2 className="font-playfair text-2xl font-bold text-brand-foreground">
                                {showManual ? 'Card Details' : 'Complete Donation'}
                            </h2>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl bg-brand-surface-secondary p-6">
                        <span className="font-inter text-xs font-medium tracking-widest text-brand-foreground-muted uppercase">
                            Your Donation
                        </span>
                        <span className="font-geist text-4xl font-bold text-brand-foreground">
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
                                <div className="relative">
                                    <div className="absolute -inset-4 animate-ping rounded-full bg-brand-primary/10" />
                                    <div className="relative rounded-full bg-brand-primary/5 p-8">
                                        <Nfc className="h-16 w-16 text-brand-primary" />
                                    </div>
                                    <div className="absolute -right-2 -bottom-2 rounded-full bg-white p-2 shadow-lg">
                                        <SmartphoneNfc className="h-6 w-6 text-brand-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-inter text-lg font-bold text-brand-foreground">
                                        Tap to Pay
                                    </p>
                                    <p className="font-inter text-sm text-brand-foreground-secondary">
                                        Hold your device or card near the reader
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Button
                                    className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-surface-inverse font-inter text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => onPay('tap')}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                    <SmartphoneNfc className="h-6 w-6" />
                                    Pay with Apple / Google
                                </Button>

                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={() => setShowManual(true)}
                                        className="font-inter text-sm font-semibold text-brand-foreground-secondary transition-colors hover:text-brand-foreground"
                                    >
                                        Enter card details manually
                                    </button>

                                    <div className="flex items-center gap-2 font-inter text-[11px] font-medium text-brand-foreground-muted">
                                        <Lock className="h-3 w-3" />
                                        Secure encrypted transaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Manual Form View */
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <CardForm card={card} onChange={onCardChange} />

                            <div className="space-y-6 pt-2">
                                <Button
                                    className="h-16 w-full rounded-2xl bg-brand-primary font-inter text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => onPay('manual')}
                                >
                                    <Heart className="mr-2 h-5 w-5 fill-current" />
                                    Confirm Donation
                                </Button>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center justify-center gap-2 font-inter text-[11px] font-medium text-brand-foreground-muted">
                                        <ShieldCheck className="h-4 w-4" />
                                        Secured with 256-bit SSL encryption
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Test Tools */}
                    <div className="flex flex-col items-center gap-3 border-t border-brand-surface-secondary pt-6">
                        <span className="font-inter text-[10px] font-bold tracking-widest text-brand-foreground-muted uppercase">
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
