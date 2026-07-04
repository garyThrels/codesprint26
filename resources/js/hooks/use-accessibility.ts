import { useSyncExternalStore } from 'react';

export type Contrast = 'normal' | 'high';
export type FontScale = 'normal' | 'large' | 'x-large';

export type UseAccessibilityReturn = {
    readonly contrast: Contrast;
    readonly fontScale: FontScale;
    readonly setContrast: (value: Contrast) => void;
    readonly setFontScale: (value: FontScale) => void;
    readonly reset: () => void;
};

const listeners = new Set<() => void>();

let contrast: Contrast = 'normal';
let fontScale: FontScale = 'normal';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${name}=${value};path=/;max-age=${days * 24 * 60 * 60};SameSite=Lax`;
};

const apply = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;

    root.classList.toggle('high-contrast', contrast === 'high');

    if (fontScale === 'normal') {
        root.removeAttribute('data-font-scale');
    } else {
        root.setAttribute('data-font-scale', fontScale);
    }
};

const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
};

const notify = (): void => listeners.forEach((listener) => listener());

/**
 * Apply the stored accessibility preferences on page load. The Blade template
 * sets the same classes inline to avoid a flash, so this mainly re-syncs from
 * localStorage (the client-side source of truth).
 */
export function initializeAccessibility(): void {
    if (typeof window === 'undefined') {
        return;
    }

    contrast = (localStorage.getItem('contrast') as Contrast) || 'normal';
    fontScale = (localStorage.getItem('font_scale') as FontScale) || 'normal';

    apply();
}

export function useAccessibility(): UseAccessibilityReturn {
    const currentContrast = useSyncExternalStore(
        subscribe,
        () => contrast,
        () => 'normal' as const,
    );

    const currentFontScale = useSyncExternalStore(
        subscribe,
        () => fontScale,
        () => 'normal' as const,
    );

    const setContrast = (value: Contrast): void => {
        contrast = value;
        localStorage.setItem('contrast', value);
        setCookie('contrast', value);
        apply();
        notify();
    };

    const setFontScale = (value: FontScale): void => {
        fontScale = value;
        localStorage.setItem('font_scale', value);
        setCookie('font_scale', value);
        apply();
        notify();
    };

    const reset = (): void => {
        setContrast('normal');
        setFontScale('normal');
    };

    return {
        contrast: currentContrast,
        fontScale: currentFontScale,
        setContrast,
        setFontScale,
        reset,
    } as const;
}
