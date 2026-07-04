import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import type { CampaignPalette } from '@/lib/colors';

interface ReceiptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donationId: number | null;
    initialEmail: string;
    style: React.CSSProperties;
    palette?: CampaignPalette;
}

export function ReceiptModal({
    open,
    onOpenChange,
    donationId,
    initialEmail,
    style,
    palette,
}: ReceiptModalProps) {
    const [email, setEmail] = useState(initialEmail);
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!email || !donationId) return;

        setIsSending(true);

        // Use router.post to call our new receipt endpoint
        router.post(
            `/admin/ledger/${donationId}/receipt`,
            { email },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSent(true);
                    setIsSending(false);
                    setTimeout(() => {
                        onOpenChange(false);
                        setSent(false);
                    }, 2000);
                },
                onError: () => {
                    setIsSending(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[400px] overflow-hidden border-none p-0 sm:rounded-3xl"
                style={{
                    ...style,
                    backgroundColor:
                        palette?.['surface-primary'] || 'var(--brand-surface)',
                }}
            >
                <div className="space-y-6 p-8">
                    <DialogHeader>
                        <DialogTitle
                            className="font-playfair text-2xl font-bold"
                            style={{
                                color:
                                    palette?.['foreground-primary'] ||
                                    'var(--brand-foreground)',
                            }}
                        >
                            {sent ? 'Receipt Sent!' : 'Email Receipt'}
                        </DialogTitle>
                    </DialogHeader>

                    {sent ? (
                        <div className="flex animate-in flex-col items-center justify-center space-y-4 py-8 duration-300 zoom-in-95">
                            <div className="rounded-full bg-green-100 p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <p className="text-center font-inter text-brand-foreground-secondary">
                                Your receipt has been sent to <br />
                                <span className="font-bold text-brand-foreground">
                                    {email}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="font-inter text-sm leading-relaxed text-brand-foreground-secondary">
                                Enter your email address below and we'll send a
                                detailed receipt of your donation for your
                                records.
                            </p>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="receipt-email"
                                    className="text-xs font-bold tracking-wider text-brand-foreground-muted uppercase"
                                >
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-foreground-muted" />
                                    <Input
                                        id="receipt-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="h-12 border-none pl-11 font-medium"
                                        style={{
                                            backgroundColor:
                                                palette?.[
                                                    'surface-secondary'
                                                ] ||
                                                'var(--brand-surface-secondary)',
                                        }}
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                className="h-12 w-full rounded-xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                                style={{
                                    backgroundColor:
                                        palette?.['accent-primary'] ||
                                        'var(--brand-primary)',
                                }}
                                onClick={handleSend}
                                disabled={isSending || !email}
                            >
                                {isSending ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Receipt
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
