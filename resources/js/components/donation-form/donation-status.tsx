import { CheckCircle2, Loader2, XCircle, Mail, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DonationEditModal } from './donation-edit-modal';
import type { CampaignPalette } from '@/lib/colors';

interface DonationStatusProps {
    status: 'processing' | 'success' | 'failed';
    style: React.CSSProperties;
    amountLabel: string;
    failureMessage: string;
    onReset: () => void;
    onShowReceipt: () => void;
    donationId: number | null;
    donorDetails: {
        donor_name: string;
        is_anonymous: boolean;
        gift_aid_enabled: boolean;
        gift_aid_name: string;
        gift_aid_address: string;
    };
    palette?: CampaignPalette;
}

export function DonationStatus({
    status,
    style,
    amountLabel,
    failureMessage,
    onReset,
    onShowReceipt,
    donationId,
    donorDetails,
    palette,
}: DonationStatusProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    if (status === 'processing') {
        return (
            <div
                style={style}
                className="flex flex-col items-center justify-center space-y-6 py-24 text-center"
            >
                <div className="relative">
                    <div
                        className="absolute inset-0 animate-ping rounded-full opacity-20"
                        style={{
                            backgroundColor:
                                palette?.['accent-primary'] ||
                                'var(--brand-primary)',
                        }}
                    />
                    <div
                        className="relative rounded-full p-8"
                        style={{
                            backgroundColor:
                                palette?.['accent-primary'] ||
                                'var(--brand-primary)',
                        }}
                    >
                        <Loader2 className="h-12 w-12 animate-spin text-white" />
                    </div>
                </div>
                <div>
                    <h3
                        className="font-playfair text-2xl font-bold"
                        style={{
                            color:
                                palette?.['foreground-primary'] ||
                                'var(--brand-foreground)',
                        }}
                    >
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
            <div
                className="rounded-full p-6"
                style={{
                    backgroundColor:
                        palette?.['surface-secondary'] ||
                        'var(--brand-surface-secondary)',
                }}
            >
                {isSuccess ? (
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                )}
            </div>
            <div>
                <h3
                    className="mb-2 font-playfair text-3xl font-bold"
                    style={{
                        color:
                            palette?.['foreground-primary'] ||
                            'var(--brand-foreground)',
                    }}
                >
                    {isSuccess ? 'Thank You!' : 'Donation Failed'}
                </h3>
                {isSuccess ? (
                    <>
                        <p className="mx-auto mb-8 max-w-xs font-inter text-sm font-medium text-brand-foreground-secondary">
                            Your {amountLabel} donation was successful. You'll
                            receive a confirmation email shortly.
                        </p>
                        <div
                            className="mb-8 flex animate-in flex-col gap-3 rounded-2xl p-6 text-center delay-300 duration-700 fade-in slide-in-from-bottom-4"
                            style={{
                                backgroundColor:
                                    palette?.['surface-primary'] ||
                                    'var(--brand-surface)',
                            }}
                        >
                            <span className="font-inter text-xs font-bold tracking-widest text-brand-foreground-muted uppercase">
                                Need a receipt?
                            </span>
                            <p className="font-inter text-sm text-brand-foreground-secondary">
                                Get a detailed receipt for your records and tax
                                purposes.
                            </p>
                            <Button
                                variant="outline"
                                className="h-14 w-full rounded-2xl font-inter font-bold hover:opacity-90"
                                style={{
                                    borderColor:
                                        palette?.['accent-primary'] ||
                                        'var(--brand-primary)',
                                    color:
                                        palette?.['accent-primary'] ||
                                        'var(--brand-primary)',
                                    backgroundColor:
                                        palette?.['surface-primary'] ||
                                        'var(--brand-surface)',
                                }}
                                onClick={onShowReceipt}
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Get Email Receipt
                            </Button>

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center justify-center gap-2 font-inter text-sm font-semibold transition-colors hover:opacity-80"
                                style={{ color: palette?.['foreground-secondary'] || 'var(--brand-foreground-secondary)' }}
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit name or Gift Aid info
                            </button>
                        </div>

                        <DonationEditModal
                            open={isEditModalOpen}
                            onOpenChange={setIsEditModalOpen}
                            donationId={donationId}
                            style={style}
                            initialData={donorDetails}
                            palette={palette}
                        />

                        <Button
                            onClick={onReset}
                            className="h-14 w-full rounded-full font-inter text-lg font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{
                                backgroundColor:
                                    palette?.['accent-primary'] ||
                                    'var(--brand-primary)',
                            }}
                        >
                            Make Another Donation
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="mx-auto mb-8 max-w-xs font-inter text-sm font-medium text-brand-foreground-secondary">
                            {failureMessage}
                        </p>
                        <Button
                            onClick={onReset}
                            className="h-14 rounded-full px-10 font-inter font-bold text-white shadow-lg hover:opacity-90"
                            style={{
                                backgroundColor:
                                    palette?.['accent-primary'] ||
                                    'var(--brand-primary)',
                            }}
                        >
                            Try Again
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
