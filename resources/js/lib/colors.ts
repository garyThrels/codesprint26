export type CampaignPalette = Record<string, string>;

/**
 * Generate a full campaign color palette from a single brand color.
 */
export function generateCampaignPalette(
    brandHex: string,
    warmth: 'warm' | 'cool' | 'neutral' = 'warm',
): CampaignPalette {
    const { h, s } = hexToHSL(brandHex);

    // Background warmth tint hue (only affects surface-primary)
    const warmHue =
        warmth === 'warm'
            ? 40 // cream / gold
            : warmth === 'cool'
              ? 220 // slate / blue-grey
              : h; // brand hue

    return {
        // ── Brand ──
        'accent-primary': brandHex,

        // ── Dark shades (text + dark backgrounds) ──
        'surface-inverse': hslToHex(h, clamp(s, 25, 50), 16),
        'foreground-primary': hslToHex(h, clamp(s, 25, 50), 16),

        // ── Text hierarchy ──
        'foreground-secondary': hslToHex(h, s * 0.5, 35),
        'foreground-muted': hslToHex(h, s * 0.4, 54),

        // ── Light surfaces ──
        'surface-secondary': hslToHex(h - 40, s * 0.8, 80),
        'surface-primary': hslToHex(warmHue, clamp(s * 0.75, 15, 30), 95),

        // ── Constant ──
        'foreground-inverse': '#FFFFFF',
    };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;

    if (d !== 0) {
        if (max === r) {
            h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        } else if (max === g) {
            h = ((b - r) / d + 2) * 60;
        } else {
            h = ((r - g) / d + 4) * 60;
        }
    }

    const l = (max + min) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    const toHex = (v: number) =>
        Math.round((v + m) * 255)
            .toString(16)
            .padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
