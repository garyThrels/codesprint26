import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { store as storeDonation } from '@/routes/donations';
import { useBrandBranding } from '@/hooks/use-brand-branding';
import { AmountSelector } from './amount-selector';
import { DonationStatus } from './donation-status';
import { PaymentModal } from './payment-modal';
import type {
    Campaign,
    CardData,
    Charity,
    DonationStep,
    PaymentMethod,
} from './types';

const GENERIC_FAILURE_MESSAGE =
    'Something went wrong while processing your donation. Please try again.';

export default function DonationForm({
    campaign,
    charity,
}: {
    campaign: Campaign;
    charity: Charity;
}) {
    const [step, setStep] = useState<DonationStep>('amount');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [failureMessage, setFailureMessage] = useState<string | null>(null);

    const initialAmount =
        campaign.donation_presets[campaign.preselected_index - 1]?.amount ||
        null;

    const [selectedAmount, setSelectedAmount] = useState<number | null>(
        initialAmount ? Math.round(initialAmount) : null,
    );

    const { data, setData, post, transform } = useForm({
        campaignId: campaign.id,
        amount: 0,
        paymentMethod: 'tap',
        card: {
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            cardholderName: '',
        },
        donorName: '',
        donorEmail: '',
        isAnonymous: false,
    });

    const brandingStyles = useBrandBranding(
        charity.brand_color,
        charity.surface_tint,
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: campaign.currency.code,
        }).format(amount / 100);
    };

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCustomAmount(e.target.value);
        setSelectedAmount(null);
    };

    const openPaymentModal = () => {
        const finalAmount = selectedAmount || parseFloat(customAmount) * 100;

        if (!finalAmount || finalAmount <= 0) {
            toast.error('Please select or enter a valid amount');

            return;
        }

        setData('amount', Math.round(finalAmount));
        setIsModalOpen(true);
    };

    const processPayment = (method: PaymentMethod) => {
        setData('paymentMethod', method);
        setIsModalOpen(false);
        setStep('processing');

        if (method === 'fail') {
            setTimeout(() => {
                setFailureMessage(
                    'This is a simulated failure for testing purposes. Your card was not charged.',
                );
                setStep('failed');
            }, 2000);

            return;
        }

        // Card details are only relevant to manual entry; for tap we omit them
        // so the server doesn't validate an empty card object. Currency is
        // resolved server-side from the campaign, so it isn't sent either.
        transform((formData) => ({
            ...formData,
            card: method === 'manual' ? formData.card : null,
        }));

        setTimeout(() => {
            post(storeDonation.url(), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const flashError = page.props.flash?.error;

                    if (flashError) {
                        setFailureMessage(flashError);
                        setStep('failed');

                        return;
                    }

                    setStep('success');
                },
                onError: (formErrors) => {
                    const firstError = Object.values(formErrors)[0];
                    setFailureMessage(firstError ?? GENERIC_FAILURE_MESSAGE);
                    setStep('failed');
                },
            });
        }, 2000);
    };

    if (step !== 'amount') {
        return (
            <DonationStatus
                status={step}
                style={brandingStyles}
                amountLabel={formatCurrency(data.amount)}
                failureMessage={failureMessage ?? GENERIC_FAILURE_MESSAGE}
                onReset={() => setStep('amount')}
            />
        );
    }

    return (
        <div style={brandingStyles} className="space-y-6">
            <AmountSelector
                campaign={campaign}
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                onSelectAmount={handleAmountSelect}
                onCustomAmountChange={handleCustomAmountChange}
                onDonate={openPaymentModal}
            />

            <PaymentModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                style={brandingStyles}
                campaign={campaign}
                amountLabel={formatCurrency(data.amount)}
                card={data.card}
                onCardChange={(card: CardData) => setData('card', card)}
                onPay={processPayment}
            />
        </div>
    );
}
