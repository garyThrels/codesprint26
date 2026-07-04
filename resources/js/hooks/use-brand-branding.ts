import { useMemo } from 'react';
import { generateCampaignPalette, type CampaignPalette } from '@/lib/colors';

export function useBrandBranding(
    brandHex?: string,
    warmth?: 'warm' | 'cool' | 'neutral',
) {
    return useMemo(() => {
        if (!brandHex) {
            return {
                styles: {} as React.CSSProperties,
                palette: {} as CampaignPalette,
            };
        }

        const palette = generateCampaignPalette(brandHex, warmth || 'neutral');

        return {
            styles: {
                '--brand-primary': palette['accent-primary'],
                '--brand-surface': palette['surface-primary'],
                '--brand-surface-secondary': palette['surface-secondary'],
                '--brand-surface-inverse': palette['surface-inverse'],
                '--brand-foreground': palette['foreground-primary'],
                '--brand-foreground-secondary': palette['foreground-secondary'],
                '--brand-foreground-muted': palette['foreground-muted'],
                '--brand-foreground-inverse': palette['foreground-inverse'],
            } as React.CSSProperties,
            palette,
        };
    }, [brandHex, warmth]);
}
