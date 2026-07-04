import { useMemo } from 'react';
import { generateCampaignPalette } from '@/lib/colors';

export function useBrandBranding(
    brandHex?: string,
    warmth?: 'warm' | 'cool' | 'neutral',
) {
    return useMemo(() => {
        if (!brandHex) {
            return {};
        }

        const palette = generateCampaignPalette(brandHex, warmth || 'neutral');

        return {
            '--brand-accent-primary': palette['accent-primary'],
            '--brand-surface-inverse': palette['surface-inverse'],
            '--brand-foreground-primary': palette['foreground-primary'],
            '--brand-foreground-secondary': palette['foreground-secondary'],
            '--brand-foreground-muted': palette['foreground-muted'],
            '--brand-surface-secondary': palette['surface-secondary'],
            '--brand-surface-primary': palette['surface-primary'],
            '--brand-foreground-inverse': palette['foreground-inverse'],
        } as React.CSSProperties;
    }, [brandHex, warmth]);
}
