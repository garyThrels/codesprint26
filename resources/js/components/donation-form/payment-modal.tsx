import { Heart, ShieldCheck, Smartphone, X } from 'lucide-react';
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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[430px] overflow-hidden border-none bg-brand-surface p-0 sm:rounded-3xl"
                style={style}
            >
                <div className="space-y-8 p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="font-playfair text-2xl font-bold text-brand-foreground">
                            Complete Donation
                        </h2>
                        <DialogClose className="rounded-full bg-brand-surface-secondary p-2">
                            <X className="h-5 w-5 text-brand-foreground-secondary" />
                        </DialogClose>
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

                    {/* Quick Pay */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-px grow bg-brand-surface-secondary" />
                            <span className="font-inter text-[12px] font-bold tracking-widest text-brand-foreground-muted uppercase">
                                Quick Pay
                            </span>
                            <div className="h-px grow bg-brand-surface-secondary" />
                        </div>
                        <Button
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-brand-surface-inverse font-inter text-lg font-bold text-white shadow-lg"
                            onClick={() => onPay('tap')}
                        >
                            <Smartphone className="h-6 w-6" />
                            Tap to Donate
                        </Button>
                    </div>

                    {/* Manual Form */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px grow bg-brand-surface-secondary" />
                            <span className="font-inter text-[12px] font-bold tracking-widest text-brand-foreground-muted uppercase">
                                Or pay with card
                            </span>
                            <div className="h-px grow bg-brand-surface-secondary" />
                        </div>

                        <CardForm card={card} onChange={onCardChange} />

                        <Button
                            className="h-14 w-full rounded-full bg-brand-primary font-inter text-lg font-bold text-white shadow-xl"
                            onClick={() => onPay('manual')}
                        >
                            <Heart className="mr-2 h-5 w-5 fill-current" />
                            Confirm Donation
                        </Button>

                        <div className="flex items-center justify-center gap-2 font-inter text-[11px] font-medium text-brand-foreground-muted">
                            <ShieldCheck className="h-4 w-4" />
                            Secured with 256-bit SSL encryption
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
