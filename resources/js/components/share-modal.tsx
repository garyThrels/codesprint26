import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Link, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const shareOnX = () => {
        const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
    };

    const shareOnFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(fbUrl, '_blank', 'noopener,noreferrer');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-playfair text-2xl">Share this Campaign</DialogTitle>
                    <DialogDescription className="font-inter">
                        Help us spread the word and make an even bigger impact.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <Button
                        variant="outline"
                        className="flex h-12 w-full items-center justify-start gap-4 rounded-xl border-brand-surface-secondary px-6 font-inter text-base transition-all hover:bg-brand-surface-secondary"
                        onClick={shareOnX}
                    >
                        <Twitter className="h-5 w-5 fill-current" />
                        Share on X
                    </Button>
                    <Button
                        variant="outline"
                        className="flex h-12 w-full items-center justify-start gap-4 rounded-xl border-brand-surface-secondary px-6 font-inter text-base transition-all hover:bg-brand-surface-secondary"
                        onClick={shareOnFacebook}
                    >
                        <Facebook className="h-5 w-5 fill-current" />
                        Share on Facebook
                    </Button>
                    <div className="relative mt-2">
                        <div className="flex items-center gap-2 rounded-xl border border-brand-surface-secondary bg-brand-surface p-1 pl-4">
                            <span className="max-w-[200px] truncate font-inter text-sm text-brand-foreground-secondary md:max-w-[280px]">
                                {url}
                            </span>
                            <Button
                                className="ml-auto h-10 rounded-lg px-4 font-inter text-sm font-bold"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Link className="mr-2 h-4 w-4" />
                                        Copy Link
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
