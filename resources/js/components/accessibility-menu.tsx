import { Accessibility, Contrast, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppearanceTabs from '@/components/appearance-tabs';
import { useAccessibility } from '@/hooks/use-accessibility';
import type { FontScale } from '@/hooks/use-accessibility';
import { cn } from '@/lib/utils';

const FONT_SIZES: { value: FontScale; label: string; sample: string }[] = [
    { value: 'normal', label: 'Default text size', sample: 'A' },
    { value: 'large', label: 'Large text', sample: 'A' },
    { value: 'x-large', label: 'Extra large text', sample: 'A' },
];

const TRIGGER_CLASSES =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export default function AccessibilityMenu({
    className,
}: {
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const { contrast, fontScale, setContrast, setFontScale, reset } =
        useAccessibility();

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const trigger = (extraClasses: string) => (
        <button
            type="button"
            aria-label="Accessibility options"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={cn(TRIGGER_CLASSES, extraClasses)}
        >
            <Accessibility className="h-5 w-5" />
        </button>
    );

    return (
        <>
            {/* Desktop: sits inline wherever the caller places it (e.g. header). */}
            {trigger(cn('hidden md:inline-flex', className))}

            {/* Mobile: unobtrusive floating button, portaled to the body so an
                ancestor's backdrop-blur/transform can't break fixed positioning. */}
            {createPortal(
                trigger(
                    'fixed bottom-4 right-4 z-50 opacity-70 backdrop-blur transition-opacity hover:opacity-100 md:hidden',
                ),
                document.body,
            )}

            {open &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[55]"
                            aria-hidden="true"
                            onClick={() => setOpen(false)}
                        />
                        <div
                            role="dialog"
                            aria-label="Accessibility options"
                            className="fixed top-16 right-4 z-[60] w-72 space-y-5 rounded-2xl border border-border bg-background p-5 text-foreground shadow-2xl max-md:top-auto max-md:bottom-20"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold">
                                    Accessibility
                                </h2>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Reset
                                </button>
                            </div>

                            {/* Text size */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Text size
                                </span>
                                <div className="grid grid-cols-3 gap-1 rounded-lg border border-border p-1">
                                    {FONT_SIZES.map((size, index) => (
                                        <button
                                            key={size.value}
                                            type="button"
                                            aria-label={size.label}
                                            aria-pressed={
                                                fontScale === size.value
                                            }
                                            onClick={() =>
                                                setFontScale(size.value)
                                            }
                                            className={cn(
                                                'flex items-center justify-center rounded-md py-1.5 leading-none transition-colors',
                                                fontScale === size.value
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent hover:text-accent-foreground',
                                            )}
                                        >
                                            <span
                                                style={{
                                                    fontSize: `${0.85 + index * 0.2}rem`,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {size.sample}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* High contrast */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Contrast
                                </span>
                                <button
                                    type="button"
                                    aria-pressed={contrast === 'high'}
                                    onClick={() =>
                                        setContrast(
                                            contrast === 'high'
                                                ? 'normal'
                                                : 'high',
                                        )
                                    }
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm transition-colors',
                                        contrast === 'high'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent hover:text-accent-foreground',
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <Contrast className="h-4 w-4" />
                                        High contrast
                                    </span>
                                    <span className="text-xs opacity-80">
                                        {contrast === 'high' ? 'On' : 'Off'}
                                    </span>
                                </button>
                            </div>

                            {/* Theme */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Theme
                                </span>
                                <AppearanceTabs className="w-full justify-between" />
                            </div>
                        </div>
                    </>,
                    document.body,
                )}
        </>
    );
}
