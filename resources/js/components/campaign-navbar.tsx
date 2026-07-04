import { Link } from '@inertiajs/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { home } from '@/routes';

interface CampaignNavbarProps {
    title: string;
}

export default function CampaignNavbar({ title }: CampaignNavbarProps) {
    return (
        <nav className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b border-brand-surface-secondary bg-white px-10 md:flex">
            <div className="flex items-center gap-4">
                <Link
                    href={home()}
                    className="flex items-center gap-2 rounded-lg bg-brand-surface-secondary px-3 py-1.5 font-inter text-[13px] font-medium text-brand-foreground-secondary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All Charities
                </Link>
                <div className="h-6 w-px bg-brand-surface-secondary" />
                <span className="font-inter text-sm font-semibold text-brand-foreground">
                    {title}
                </span>
            </div>
            <button className="hover:bg-opacity-5 flex items-center gap-2 rounded-lg border border-brand-surface-secondary px-4 py-1.5 font-inter text-[13px] font-medium text-brand-foreground-secondary transition-all">
                <Share2 className="h-4 w-4" />
                Share
            </button>
        </nav>
    );
}
