import { Helmet } from 'react-helmet-async';

interface FAQ {
    question: string;
    answer: string;
}

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
    faqs?: FAQ[];
}

export default function SEO({ title, description, name = "JW AI Consulting", type = "website", faqs }: SEOProps) {
    const faqSchema = faqs && faqs.length > 0 ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }) : null;

    return (
        <Helmet>
            <title>{title} | {name}</title>
            <meta name='description' content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {faqSchema && (
                <script type="application/ld+json">{faqSchema}</script>
            )}
        </Helmet>
    );
}
