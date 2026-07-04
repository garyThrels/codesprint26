import * as React from 'react';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import InputError from '@/components/input-error';

interface CampaignMediaSettingsProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export function CampaignMediaSettings({
    data,
    setData,
    errors,
}: CampaignMediaSettingsProps) {
    return (
        <div className="grid gap-6 p-4">
            <div className="grid gap-2">
                <Label>Hero Image</Label>
                <ImageUpload
                    value={data.hero_url}
                    onChange={(file) => setData('hero', file as File)}
                    onRemove={() => setData('hero_url', null)}
                />
                <p className="text-xs text-muted-foreground">
                    The main image displayed at the top of the campaign page.
                    Max 2MB.
                </p>
                <InputError message={errors.hero} />
            </div>

            <div className="grid gap-2">
                <Label>Gallery Images (Max 4)</Label>
                <ImageUpload
                    multiple
                    maxFiles={4}
                    value={data.gallery_urls}
                    onChange={(files) => setData('gallery', files as File[])}
                    onRemove={(url) => {
                        setData(
                            'gallery_urls',
                            data.gallery_urls.filter((u: string) => u !== url),
                        );
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    Additional images to showcase your cause. Max 2MB each.
                </p>
                <InputError message={errors.gallery} />
            </div>
        </div>
    );
}
