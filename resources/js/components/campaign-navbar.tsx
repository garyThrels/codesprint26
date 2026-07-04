import { Link } from '@inertiajs/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { home } from '@/routes';
import type { CampaignPalette } from '@/lib/colors';

interface CampaignNavbarProps {
    title: string;
    palette: CampaignPalette;
}

export default function CampaignNavbar({
    title,
    palette,
}: CampaignNavbarProps) {
    return (
        <nav
            className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b bg-white px-10 md:flex"
            style={{ borderColor: palette['surface-secondary'] }}
        >
            <div className="flex items-center gap-4">
                <Link
                    href={home()}
                    className="font-inter flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors"
                    style={{
                        backgroundColor: palette['surface-secondary'],
                        color: palette['foreground-secondary'],
                    }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    All Charities
                </Link>
                <div
                    className="h-6 w-px"
                    style={{ backgroundColor: palette['surface-secondary'] }}
                />
                <span
                    className="font-inter text-sm font-semibold"
                    style={{ color: palette['foreground-primary'] }}
                >
                    {title}
                </span>
            </div>
            <button
                className="font-inter hover:bg-opacity-5 flex items-center gap-2 rounded-lg border px-4 py-1.5 text-[13px] font-medium transition-all"
                style={{
                    borderColor: palette['surface-secondary'],
                    color: palette['foreground-secondary'],
                }}
            >
                <Share2 className="h-4 w-4" />
                Share
            </button>
        </nav>
    );
}
