import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DonationStatusProps {
    status: 'processing' | 'success' | 'failed';
    style: React.CSSProperties;
    amountLabel?: string;
    failureMessage?: string;
    onReset: () => void;
}

export function DonationStatus({
    status,
    style,
    amountLabel,
    failureMessage,
    onReset,
}: DonationStatusProps) {
    if (status === 'processing') {
        return (
            <div
                style={style}
                className="flex flex-col items-center justify-center space-y-6 py-24 text-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-brand-primary opacity-20" />
                    <div className="relative rounded-full bg-brand-primary p-8">
                        <Loader2 className="h-12 w-12 animate-spin text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="font-playfair text-2xl font-bold text-brand-foreground">
                        Processing Donation
                    </h3>
                    <p className="font-inter text-sm font-medium text-brand-foreground-secondary">
                        Securing your transaction with Mastercard...
                    </p>
                </div>
            </div>
        );
    }

    const isSuccess = status === 'success';

    return (
        <div
            style={style}
            className="flex flex-col items-center justify-center space-y-6 py-24 text-center"
        >
            <div className="rounded-full bg-brand-surface-secondary p-6">
                {isSuccess ? (
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                )}
            </div>
            <div>
                <h3 className="font-playfair text-3xl font-bold text-brand-foreground">
                    {isSuccess ? 'Thank You!' : 'Donation Failed'}
                </h3>
                <p className="mx-auto mb-8 max-w-xs font-inter text-sm font-medium text-brand-foreground-secondary">
                    {isSuccess
                        ? `Your gift of ${amountLabel} is making a real difference.`
                        : failureMessage}
                </p>
                <Button
                    onClick={onReset}
                    className="h-14 rounded-full bg-brand-primary px-10 font-inter font-bold text-white shadow-lg"
                >
                    {isSuccess ? 'Back to Campaign' : 'Try Again'}
                </Button>
            </div>
        </div>
    );
}
