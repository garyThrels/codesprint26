import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import InputError from '@/components/input-error';

interface CampaignStatusSettingsProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export function CampaignStatusSettings({
    data,
    setData,
    errors,
}: CampaignStatusSettingsProps) {
    return (
        <div className="grid gap-6 p-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="expires_at">Expires At (Optional)</Label>
                    <Input
                        id="expires_at"
                        type="date"
                        value={
                            data.expires_at ? data.expires_at.split('T')[0] : ''
                        }
                        onChange={(e) => setData('expires_at', e.target.value)}
                    />
                    <InputError message={errors.expires_at} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Description (Tiptap)</Label>
                <RichTextEditor
                    value={data.description_html}
                    onChange={(value) => setData('description_html', value)}
                />
                <InputError message={errors.description_html} />
            </div>
        </div>
    );
}
