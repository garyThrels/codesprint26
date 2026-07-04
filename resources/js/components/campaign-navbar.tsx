import { Link } from '@inertiajs/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { home } from '@/routes';
import type { CampaignPalette } from '@/lib/colors';

interface CampaignNavbarProps {
    title: string;
    onShare: () => void;
    palette?: CampaignPalette;
}

export default function CampaignNavbar({
    title,
    onShare,
    palette,
}: CampaignNavbarProps) {
    return (
        <nav
            className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b bg-white px-10 md:flex"
            style={{
                borderColor:
                    palette?.['surface-secondary'] ||
                    'var(--brand-surface-secondary)',
            }}
        >
            <div className="flex items-center gap-4">
                <Link
                    href={home()}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-inter text-[13px] font-medium transition-colors"
                    style={{
                        backgroundColor:
                            palette?.['surface-secondary'] ||
                            'var(--brand-surface-secondary)',
                        color:
                            palette?.['foreground-secondary'] ||
                            'var(--brand-foreground-secondary)',
                    }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    All Charities
                </Link>
                <div
                    className="h-6 w-px"
                    style={{
                        backgroundColor:
                            palette?.['surface-secondary'] ||
                            'var(--brand-surface-secondary)',
                    }}
                />
                <span
                    className="font-inter text-sm font-semibold"
                    style={{
                        color:
                            palette?.['foreground-primary'] ||
                            'var(--brand-foreground)',
                    }}
                >
                    {title}
                </span>
            </div>
            <button
                onClick={onShare}
                className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-1.5 font-inter text-[13px] font-medium transition-all hover:bg-black/5"
                style={{
                    borderColor:
                        palette?.['surface-secondary'] ||
                        'var(--brand-surface-secondary)',
                    color:
                        palette?.['foreground-secondary'] ||
                        'var(--brand-foreground-secondary)',
                }}
            >
                <Share2 className="h-4 w-4" />
                Share
            </button>
        </nav>
    );
}
