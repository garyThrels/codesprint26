import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';

import type { Currency } from '@/types';

interface CampaignDonationSettingsProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    currencies: Currency[];
}

export function CampaignDonationSettings({
    data,
    setData,
    errors,
    currencies,
}: CampaignDonationSettingsProps) {
    const addPreset = () => {
        if (data.donation_presets.length < 3) {
            setData('donation_presets', [
                ...data.donation_presets,
                { amount: 0, label: '' },
            ]);
        }
    };

    const removePreset = (index: number) => {
        const newPresets = [...data.donation_presets];
        newPresets.splice(index, 1);
        setData('donation_presets', newPresets);

        // Ensure preselected_index is still valid
        if (data.preselected_index > newPresets.length) {
            setData('preselected_index', Math.max(1, newPresets.length));
        }
    };

    const updatePreset = (
        index: number,
        key: 'amount' | 'label',
        value: any,
    ) => {
        const newPresets = [...data.donation_presets];
        newPresets[index][key] = value;
        setData('donation_presets', newPresets);
    };

    return (
        <div className="grid gap-6 p-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="currency_id">Currency</Label>
                    <Select
                        value={data.currency_id?.toString()}
                        onValueChange={(value) =>
                            setData('currency_id', parseInt(value))
                        }
                    >
                        <SelectTrigger id="currency_id">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map((currency) => (
                                <SelectItem
                                    key={currency.id}
                                    value={currency.id.toString()}
                                >
                                    {currency.code} ({currency.symbol})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.currency_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="goal_amount">Goal Amount (Cents)</Label>
                    <Input
                        id="goal_amount"
                        type="number"
                        value={data.goal_amount}
                        onChange={(e) =>
                            setData('goal_amount', parseInt(e.target.value))
                        }
                        placeholder="e.g. 1000000 (for 10,000.00)"
                    />
                    <InputError message={errors.goal_amount} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Donation Presets (Max 3)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPreset}
                        disabled={data.donation_presets.length >= 3}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Preset
                    </Button>
                </div>

                <div className="grid gap-4">
                    {data.donation_presets.map((preset: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-end gap-4 rounded-lg border p-4"
                        >
                            <div className="grid flex-1 gap-2">
                                <Label>Amount (Cents)</Label>
                                <Input
                                    type="number"
                                    value={preset.amount}
                                    onChange={(e) =>
                                        updatePreset(
                                            index,
                                            'amount',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label>Label</Label>
                                <Input
                                    value={preset.label}
                                    onChange={(e) =>
                                        updatePreset(
                                            index,
                                            'label',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Feed a family"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => removePreset(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <InputError message={errors.donation_presets} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="preselected_index">
                        Preselected Preset (1-3)
                    </Label>
                    <Select
                        value={data.preselected_index?.toString()}
                        onValueChange={(value) =>
                            setData('preselected_index', parseInt(value))
                        }
                    >
                        <SelectTrigger id="preselected_index">
                            <SelectValue placeholder="Which is selected?" />
                        </SelectTrigger>
                        <SelectContent>
                            {data.donation_presets.map((_: any, i: number) => (
                                <SelectItem
                                    key={i + 1}
                                    value={(i + 1).toString()}
                                >
                                    Preset {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.preselected_index} />
                </div>

                <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                        id="allow_custom_amount"
                        checked={data.allow_custom_amount}
                        onCheckedChange={(checked) =>
                            setData('allow_custom_amount', checked === true)
                        }
                    />
                    <Label htmlFor="allow_custom_amount">
                        Allow Custom Amount
                    </Label>
                    <InputError message={errors.allow_custom_amount} />
                </div>
            </div>
        </div>
    );
}
