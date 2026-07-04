import { useForm } from '@inertiajs/react';
import {
    CreditCard,
    Smartphone,
    CheckCircle2,
    Loader2,
    Heart,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeDonation } from '@/routes/donations';

interface Preset {
    amount: number;
    label: string;
}

interface Currency {
    code: string;
    symbol: string;
}

interface Campaign {
    id: number;
    name: string;
    tagline: string;
    currency_id: number;
    currency: Currency;
    donation_presets: Preset[];
    preselected_index: number;
    allow_custom_amount: boolean;
}

interface Charity {
    name: string;
    brand_color: string;
    surface_tint: 'warm' | 'cool' | 'neutral';
}

export default function DonationForm({
    campaign,
    charity,
}: {
    campaign: Campaign;
    charity: Charity;
}) {
    const [step, setStep] = useState<
        'amount' | 'payment' | 'processing' | 'success' | 'failed'
    >('amount');
    const [customAmount, setCustomAmount] = useState<string>('');

    // Default to the preselected index (1-based from model)
    const initialAmount =
        campaign.donation_presets[campaign.preselected_index - 1]?.amount ||
        null;
    const [selectedAmount, setSelectedAmount] = useState<number | null>(
        initialAmount ? Math.round(initialAmount) : null,
    );

    const { data, setData, post } = useForm({
        campaignId: campaign.id,
        amount: 0,
        currencyId: campaign.currency_id,
        paymentMethod: 'tap',
        card: {
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
        },
        donorName: '',
        donorEmail: '',
        isAnonymous: false,
    });

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

    const proceedToPayment = () => {
        const finalAmount = selectedAmount || parseFloat(customAmount) * 100;

        if (!finalAmount || finalAmount <= 0) {
            toast.error('Please select or enter a valid amount');

            return;
        }

        setData('amount', Math.round(finalAmount));
        setStep('payment');
    };

    const processPayment = (method: 'tap' | 'manual') => {
        setStep('processing');

        // We use router.post directly here to ensure we use the absolute latest
        // data including the payment method, bypassing potential stale closures.
        setTimeout(() => {
            post(storeDonation.url(), {
                onBefore: () => {
                    data.paymentMethod = method; // Directly set for the request
                },
                onSuccess: () => setStep('success'),
                onError: () => setStep('failed'),
            });
        }, 2000);
    };

    // UI Colors based on brand color
    const brandStyles = useMemo(() => {
        return {
            '--brand-primary': charity.brand_color,
            '--brand-muted': `${charity.brand_color}15`, // 10% opacity
            '--brand-hover': `${charity.brand_color}dd`,
        } as React.CSSProperties;
    }, [charity.brand_color]);

    if (step === 'processing') {
        return (
            <Card className="w-full overflow-hidden border-none bg-white shadow-xl dark:bg-zinc-900">
                <CardContent className="flex flex-col items-center justify-center space-y-6 py-24">
                    <div className="relative">
                        <div
                            className="absolute inset-0 animate-ping rounded-full opacity-20"
                            style={{ backgroundColor: charity.brand_color }}
                        />
                        <div
                            className="relative rounded-full p-6"
                            style={{ backgroundColor: charity.brand_color }}
                        >
                            {data.paymentMethod === 'tap' ? (
                                <Smartphone className="h-12 w-12 animate-bounce text-white" />
                            ) : (
                                <Loader2 className="h-12 w-12 animate-spin text-white" />
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="mb-2 text-2xl font-black tracking-tight">
                            Processing Donation
                        </h3>
                        <p className="font-medium text-zinc-500">
                            {data.paymentMethod === 'tap'
                                ? 'Hold your device near the reader...'
                                : 'Securing your transaction with Mastercard...'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (step === 'success') {
        return (
            <Card className="w-full overflow-hidden border-none bg-white shadow-xl dark:bg-zinc-900">
                <CardContent className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
                    <div className="rounded-full bg-green-50 p-5 dark:bg-green-900/20">
                        <CheckCircle2 className="h-16 w-16 animate-in text-green-500 duration-500 zoom-in" />
                    </div>
                    <div>
                        <h3 className="mb-2 text-3xl font-black tracking-tight">
                            Thank You!
                        </h3>
                        <p className="mx-auto mb-8 max-w-xs font-medium text-zinc-500">
                            Your gift of{' '}
                            {new Intl.NumberFormat('en-IE', {
                                style: 'currency',
                                currency: campaign.currency.code,
                            }).format(data.amount / 100)}{' '}
                            is making a real difference.
                        </p>
                        <Button
                            onClick={() => setStep('amount')}
                            className="h-12 rounded-full px-8 font-bold"
                            style={{ backgroundColor: charity.brand_color }}
                        >
                            Back to Campaign
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className="w-full overflow-hidden rounded-3xl border-none bg-white shadow-2xl dark:bg-zinc-900"
            style={brandStyles}
        >
            <CardHeader className="bg-zinc-50 pt-8 pb-6 dark:bg-zinc-800/30">
                <CardTitle className="text-2xl font-black tracking-tight">
                    Choose Your Donation
                </CardTitle>
                <CardDescription className="font-medium">
                    100% of your donation goes directly to the cause.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pt-8">
                {step === 'amount' ? (
                    <>
                        <div className="grid grid-cols-3 gap-3">
                            {campaign.donation_presets.map((preset, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-300 ${
                                        selectedAmount === preset.amount
                                            ? 'scale-105 border-transparent text-white shadow-lg'
                                            : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/50'
                                    }`}
                                    style={{
                                        backgroundColor:
                                            selectedAmount === preset.amount
                                                ? charity.brand_color
                                                : undefined,
                                    }}
                                    onClick={() =>
                                        handleAmountSelect(preset.amount)
                                    }
                                >
                                    <span className="text-xl font-black">
                                        {campaign.currency.symbol}
                                        {preset.amount / 100}
                                    </span>
                                    <span
                                        className={`mt-1 text-[10px] font-bold tracking-wider uppercase opacity-70`}
                                    >
                                        {preset.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {campaign.allow_custom_amount && (
                            <div className="space-y-3">
                                <div className="group relative">
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-zinc-400 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100">
                                        {campaign.currency.symbol}
                                    </span>
                                    <Input
                                        id="custom-amount"
                                        type="number"
                                        placeholder="Enter custom amount"
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 pl-8 text-lg font-bold focus:ring-2 focus:ring-offset-0 dark:border-zinc-800 dark:bg-zinc-800/50"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        style={
                                            {
                                                '--tw-ring-color':
                                                    charity.brand_color,
                                            } as React.CSSProperties
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            className="h-16 w-full rounded-2xl text-lg font-black shadow-xl transition-all hover:shadow-2xl active:scale-[0.98]"
                            style={{ backgroundColor: charity.brand_color }}
                            onClick={proceedToPayment}
                        >
                            <Heart className="mr-2 h-5 w-5 fill-current" />
                            Donate Now
                        </Button>
                    </>
                ) : (
                    <div className="animate-in space-y-8 duration-500 slide-in-from-right">
                        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
                            <p className="mb-1 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                Total Donation
                            </p>
                            <p
                                className="text-4xl font-black"
                                style={{ color: charity.brand_color }}
                            >
                                {campaign.currency.symbol}
                                {(data.amount / 100).toFixed(2)}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                className="group flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                style={{
                                    borderColor:
                                        data.paymentMethod === 'tap'
                                            ? charity.brand_color
                                            : undefined,
                                }}
                                onClick={() => processPayment('tap')}
                            >
                                <div className="flex items-center gap-2 text-xl font-black">
                                    <Smartphone className="h-6 w-6" />
                                    Tap to Pay
                                </div>
                                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                    Fast & Secure
                                </span>
                            </Button>

                            <div className="relative flex items-center py-2">
                                <div className="grow border-t border-zinc-100 dark:border-zinc-800"></div>
                                <span className="mx-4 shrink text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                                    or secure card entry
                                </span>
                                <div className="grow border-t border-zinc-100 dark:border-zinc-800"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="ml-1 text-xs font-bold text-zinc-500">
                                        Card Number
                                    </Label>
                                    <div className="relative">
                                        <CreditCard className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                        <Input
                                            placeholder="0000 0000 0000 0000"
                                            className="h-12 rounded-xl border-zinc-100 bg-zinc-50 pl-11 font-mono dark:border-zinc-800 dark:bg-zinc-800/50"
                                            value={data.card.cardNumber}
                                            onChange={(e) =>
                                                setData('card', {
                                                    ...data.card,
                                                    cardNumber: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-xs font-bold text-zinc-500">
                                            Expiry
                                        </Label>
                                        <Input
                                            placeholder="MM / YY"
                                            className="h-12 rounded-xl border-zinc-100 bg-zinc-50 text-center dark:border-zinc-800 dark:bg-zinc-800/50"
                                            value={`${data.card.expiryMonth}${data.card.expiryYear ? ' / ' + data.card.expiryYear : ''}`}
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    );
                                                setData('card', {
                                                    ...data.card,
                                                    expiryMonth: val.substring(
                                                        0,
                                                        2,
                                                    ),
                                                    expiryYear: val.substring(
                                                        2,
                                                        4,
                                                    ),
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-xs font-bold text-zinc-500">
                                            CVV
                                        </Label>
                                        <Input
                                            placeholder="•••"
                                            type="password"
                                            className="h-12 rounded-xl border-zinc-100 bg-zinc-50 text-center dark:border-zinc-800 dark:bg-zinc-800/50"
                                            maxLength={4}
                                            value={data.card.cvv}
                                            onChange={(e) =>
                                                setData('card', {
                                                    ...data.card,
                                                    cvv: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="h-14 w-full rounded-xl text-lg font-black shadow-lg"
                                    style={{
                                        backgroundColor: charity.brand_color,
                                    }}
                                    onClick={() => processPayment('manual')}
                                >
                                    Complete Donation
                                </Button>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
                            onClick={() => setStep('amount')}
                        >
                            ← Back to selection
                        </button>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pt-4 pb-10">
                <div className="flex items-center justify-center gap-3 rounded-full border border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div className="flex -space-x-1">
                        <div className="h-2 w-2 rounded-full bg-zinc-300"></div>
                        <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
                        <div className="h-2 w-2 rounded-full bg-zinc-500"></div>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Secure payment via Mastercard
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
