import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GiftAidForm } from './gift-aid-form';
import { update as updateDonation } from '@/routes/donations';
import type { CampaignPalette } from '@/lib/colors';

interface DonationEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    donationId: number | null;
    style: React.CSSProperties;
    initialData: {
        donor_name: string;
        is_anonymous: boolean;
        gift_aid_enabled: boolean;
        gift_aid_name: string;
        gift_aid_address: string;
    };
    palette?: CampaignPalette;
}

export function DonationEditModal({
    open,
    onOpenChange,
    donationId,
    style,
    initialData,
    palette,
}: DonationEditModalProps) {
    const [data, setData] = useState(initialData);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<{
        donor_name?: string;
        gift_aid_name?: string;
        gift_aid_address?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!data.is_anonymous && !data.donor_name?.trim()) {
            newErrors.donor_name = 'Please enter your name for the wall';
        }
        if (data.gift_aid_enabled) {
            if (!data.gift_aid_name?.trim()) {
                newErrors.gift_aid_name = 'Full name is required for Gift Aid';
            }
            if (!data.gift_aid_address?.trim()) {
                newErrors.gift_aid_address =
                    'Home address is required for Gift Aid';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!donationId) return;
        if (!validate()) return;

        setIsProcessing(true);
        router.patch(updateDonation(donationId).url, data as any, {
            onSuccess: () => {
                toast.success('Donation details updated!');
                onOpenChange(false);
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[430px] p-8"
                style={{
                    ...style,
                    backgroundColor:
                        palette?.['surface-primary'] || 'var(--brand-surface)',
                }}
            >
                <DialogHeader>
                    <DialogTitle
                        className="font-playfair text-2xl font-bold"
                        style={{
                            color:
                                palette?.['foreground-primary'] ||
                                'var(--brand-foreground)',
                        }}
                    >
                        Edit Donation Details
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="space-y-4">
                        <div
                            className="flex items-center space-x-3 rounded-xl p-4"
                            style={{
                                backgroundColor:
                                    palette?.['surface-secondary'] ||
                                    'var(--brand-surface-secondary)',
                            }}
                        >
                            <Checkbox
                                id="edit-show-name"
                                checked={!data.is_anonymous}
                                onCheckedChange={(checked) =>
                                    setData({ ...data, is_anonymous: !checked })
                                }
                            />
                            <Label
                                htmlFor="edit-show-name"
                                className="flex flex-1 cursor-pointer flex-col select-none"
                            >
                                <span className="font-inter text-sm font-bold text-brand-foreground">
                                    Show my name on the supporters wall
                                </span>
                            </Label>
                        </div>

                        {!data.is_anonymous && (
                            <Input
                                placeholder="Your name for the wall"
                                value={data.donor_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        donor_name: e.target.value,
                                    })
                                }
                                className="h-12 border-none px-4 font-inter font-medium"
                                style={{
                                    backgroundColor:
                                        palette?.['surface-secondary'] ||
                                        'var(--brand-surface-secondary)',
                                }}
                            />
                        )}
                        {errors.donor_name && (
                            <p className="animate-in text-[10px] font-semibold text-red-500 fade-in slide-in-from-top-1">
                                {errors.donor_name}
                            </p>
                        )}
                    </div>

                    <GiftAidForm
                        enabled={data.gift_aid_enabled}
                        onEnabledChange={(val) =>
                            setData({ ...data, gift_aid_enabled: val })
                        }
                        name={data.gift_aid_name}
                        onNameChange={(val) =>
                            setData({ ...data, gift_aid_name: val })
                        }
                        address={data.gift_aid_address}
                        onAddressChange={(val) =>
                            setData({ ...data, gift_aid_address: val })
                        }
                        style={style}
                        errors={{
                            name: errors.gift_aid_name,
                            address: errors.gift_aid_address,
                        }}
                        palette={palette}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 text-white hover:opacity-90"
                            style={{
                                backgroundColor:
                                    palette?.['accent-primary'] ||
                                    'var(--brand-primary)',
                            }}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
