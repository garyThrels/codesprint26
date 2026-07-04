import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { store as storeDonation } from '@/routes/donations';
import { useBrandBranding } from '@/hooks/use-brand-branding';
import { AmountSelector } from './amount-selector';
import { DonationOptions } from './donation-options';
import { GiftAidForm } from './gift-aid-form';
import { DonationStatus } from './donation-status';
import { PaymentModal } from './payment-modal';
import { ReceiptModal } from './receipt-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastDonationId, setLastDonationId] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [failureMessage, setFailureMessage] = useState<string | null>(null);

    const initialAmount =
        campaign.donation_presets[campaign.preselected_index - 1]?.amount ||
        null;

    const [selectedAmount, setSelectedAmount] = useState<number | null>(
        initialAmount ? Math.round(initialAmount) : null,
    );
    const defaultCurrency = charity.supported_currencies?.[0] || campaign.currency;
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

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
        isAnonymous: true,
        isRecurring: false,
        giftAidEnabled: false,
        giftAidName: '',
        giftAidAddress: '',
        roundUp: false,
        currencyId: defaultCurrency.id,
    });

    const { styles: brandingStyles, palette } = useBrandBranding(
        charity.brand_color,
        charity.surface_tint,
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: selectedCurrency.code,
        }).format(amount / 100);
    };

    const handleCurrencyChange = (currency: any) => {
        setSelectedCurrency(currency);
        setData('currencyId', currency.id);
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

                    // Check flash props for donation_id
                    const donationId = (page.props as any).flash?.donation_id;
                    if (donationId) {
                        setLastDonationId(donationId);
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

    const getEffectiveAmount = (baseAmount: number, shouldRoundUp: boolean) => {
        if (!shouldRoundUp) return baseAmount;

        const roundTo = 1000; // Round to nearest 10 Euro

        const rounded = Math.ceil(baseAmount / roundTo) * roundTo;

        return rounded === baseAmount ? baseAmount + roundTo : rounded;
    };

    const effectiveAmount = getEffectiveAmount(data.amount, data.roundUp);

    if (step !== 'amount') {
        return (
            <>
                <DonationStatus
                    status={step}
                    style={brandingStyles}
                    amountLabel={formatCurrency(effectiveAmount)}
                    failureMessage={failureMessage ?? GENERIC_FAILURE_MESSAGE}
                    onReset={() => setStep('amount')}
                    onShowReceipt={() => setIsReceiptModalOpen(true)}
                    donationId={lastDonationId}
                    donorDetails={{
                        donor_name: data.donorName,
                        is_anonymous: data.isAnonymous,
                        gift_aid_enabled: data.giftAidEnabled,
                        gift_aid_name: data.giftAidName,
                        gift_aid_address: data.giftAidAddress,
                    }}
                    palette={palette}
                />
                <ReceiptModal
                    open={isReceiptModalOpen}
                    onOpenChange={setIsReceiptModalOpen}
                    donationId={lastDonationId}
                    initialEmail={data.donorEmail}
                    style={brandingStyles}
                    palette={palette}
                />
            </>
        );
    }

    return (
        <div style={brandingStyles} className="space-y-6">
            <AmountSelector
                campaign={campaign}
                charity={charity}
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                selectedCurrency={selectedCurrency}
                onSelectAmount={handleAmountSelect}
                onCustomAmountChange={handleCustomAmountChange}
                onCurrencyChange={handleCurrencyChange}
                onDonate={openPaymentModal}
                palette={palette}
            />

            <PaymentModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                style={brandingStyles}
                campaign={campaign}
                amountLabel={formatCurrency(effectiveAmount)}
                card={data.card}
                isRecurring={data.isRecurring}
                onRecurringChange={(val) => setData('isRecurring', val)}
                roundUp={data.roundUp}
                onRoundUpChange={(val) => setData('roundUp', val)}
                donorName={data.donorName}
                onDonorNameChange={(val) => setData('donorName', val)}
                isAnonymous={data.isAnonymous}
                onAnonymousChange={(val) => setData('isAnonymous', val)}
                giftAidEnabled={data.giftAidEnabled}
                onGiftAidEnabledChange={(val) => setData('giftAidEnabled', val)}
                giftAidName={data.giftAidName}
                onGiftAidNameChange={(val) => setData('giftAidName', val)}
                giftAidAddress={data.giftAidAddress}
                onGiftAidAddressChange={(val) => setData('giftAidAddress', val)}
                onCardChange={(card: CardData) => setData('card', card)}
                onPay={processPayment}
                palette={palette}
            />
        </div>
    );
}
