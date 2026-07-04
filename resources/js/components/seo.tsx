import { Head } from '@inertiajs/react';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    twitterCard?: string;
}

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    twitterCard = 'summary_large_image',
}: SEOProps) {
    const siteName = 'Tap For Good';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDescription =
        description ||
        'A seamless, secure way to support the causes you love. Direct impact, powered by Mastercard.';
    const metaImage = image || '/logo.png'; // Fallback to a default OG image
    const metaUrl =
        url || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={metaUrl} />
        </Head>
    );
}
