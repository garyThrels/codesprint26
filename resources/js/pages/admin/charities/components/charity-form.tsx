import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import InputError from '@/components/input-error';
import { Save, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { Charity } from '@/types';

type ColorPreset = {
    name: string;
    color: string;
    tint: Charity['surface_tint'];
    description: string;
};

const COLOR_PRESETS: ColorPreset[] = [
    {
        name: 'Forest Sage',
        color: '#2D5E3A',
        tint: 'neutral',
        description: 'Nature, environment, water, sustainability',
    },
    {
        name: 'Ocean Depths',
        color: '#2B6B90',
        tint: 'neutral',
        description: 'Health, education, water/marine, humanitarian',
    },
    {
        name: 'Sunset Amber',
        color: '#B86030',
        tint: 'neutral',
        description: 'Emergency relief, food/hunger, community',
    },
    {
        name: 'Royal Plum',
        color: '#7B3F8E',
        tint: 'neutral',
        description: 'Arts, education, mental health, advocacy',
    },
    {
        name: 'Crimson Heart',
        color: '#B03545',
        tint: 'neutral',
        description: 'Medical, heart health, blood donation, children',
    },
];

interface CharityFormProps {
    action: {
        action: string;
        method: 'post' | 'put' | 'patch';
    };
    initialData?: Partial<Charity>;
}

export default function CharityForm({ action, initialData }: CharityFormProps) {
    const defaults = {
        name: initialData?.name || '',
        slogan: initialData?.slogan || '',
        description: initialData?.description || '',
        brand_color: initialData?.brand_color || '#2D5E3A',
        surface_tint: initialData?.surface_tint || 'neutral',
        logo: null as File | null,
        logo_url: initialData?.logo_url || null,
    };

    const { data, setData, post, put, processing, errors } = useForm(defaults);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { forceFormData: true };

        if (action.method === 'post') {
            post(action.action, options);
        } else {
            put(action.action, options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>
                            Basic details about the organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Charity Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Global Relief Foundation"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slogan">Slogan</Label>
                            <Input
                                id="slogan"
                                value={data.slogan}
                                onChange={(e) =>
                                    setData('slogan', e.target.value)
                                }
                                placeholder="A short catchphrase"
                            />
                            <InputError message={errors.slogan} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Describe the charity's mission..."
                                className="min-h-[150px]"
                            />
                            <InputError message={errors.description} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branding & Identity</CardTitle>
                        <CardDescription>
                            Customize the look and feel of the charity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="brand_color">
                                    Custom Brand Color
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={data.brand_color}
                                        onChange={(e) =>
                                            setData(
                                                'brand_color',
                                                e.target.value,
                                            )
                                        }
                                        className="m-0 h-10 w-10 p-0"
                                        placeholder="#000000"
                                        type="color"
                                    />
                                    <Input
                                        id="brand_color"
                                        value={data.brand_color}
                                        onChange={(e) =>
                                            setData(
                                                'brand_color',
                                                e.target.value,
                                            )
                                        }
                                        className="font-mono"
                                        placeholder="#000000"
                                    />
                                </div>
                                <InputError message={errors.brand_color} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="surface_tint">
                                    Surface Tint
                                </Label>
                                <Select
                                    value={data.surface_tint}
                                    onValueChange={(value) =>
                                        setData(
                                            'surface_tint',
                                            value as Charity['surface_tint'],
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="surface_tint"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a tint" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="neutral">
                                            Neutral
                                        </SelectItem>
                                        <SelectItem value="warm">
                                            Warm
                                        </SelectItem>
                                        <SelectItem value="cool">
                                            Cool
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.surface_tint} />
                            </div>
                        </div>
                        <div className="grid gap-4 border-t pt-6">
                            <Label>Color Presets</Label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {COLOR_PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => {
                                            setData(
                                                'brand_color',
                                                preset.color,
                                            );
                                            setData(
                                                'surface_tint',
                                                preset.tint,
                                            );
                                        }}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900',
                                            data.brand_color === preset.color
                                                ? 'border-zinc-900 ring-1 ring-zinc-900 dark:border-zinc-100 dark:ring-zinc-100'
                                                : 'border-zinc-200 dark:border-zinc-800',
                                        )}
                                    >
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                                            style={{
                                                backgroundColor: preset.color,
                                            }}
                                        >
                                            {data.brand_color ===
                                                preset.color && (
                                                <Check className="h-5 w-5 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">
                                                {preset.name}
                                            </p>
                                            <p className="text-xs leading-tight text-zinc-500">
                                                {preset.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Logo</CardTitle>
                        <CardDescription>
                            The organization's primary logo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ImageUpload
                            value={data.logo_url}
                            onChange={(file) => setData('logo', file as File)}
                            onRemove={() => setData('logo_url', null)}
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                            Recommended: Square PNG or SVG.
                        </p>
                        <InputError message={errors.logo} />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    <Button size="lg" disabled={processing} className="w-full">
                        {processing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Charity
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}
