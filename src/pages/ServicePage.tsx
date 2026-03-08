import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

// Dynamic Content mapping based on URL slug
const SERVICE_CONTENT: Record<string, { title: string; desc: string; details: string }> = {
    'startups': {
        title: 'AI Consulting for Startups',
        desc: 'Accelerate product-market fit with intelligent architectures.',
        details: 'For early-stage companies, technical debt in AI integration can be fatal. We architect lightweight, scalable intelligence layers that let you deploy generative features fast, without locking you into expensive or overly rigid foundational models.'
    },
    'smb': {
        title: 'SMB Technical Optimization',
        desc: 'Automate workflows and unlock data leverage.',
        details: 'Small and medium businesses are sitting on goldmines of unstructured data. We build bespoke data pipelines and fine-tuned models that transform manual back-office tasks into seamless, automated intelligence flows, directly impacting your bottom line.'
    },
    'enterprise': {
        title: 'Enterprise Context Engineering',
        desc: 'Secure, compliant, and scalable AI infrastructure.',
        details: 'Deploying AI across a massive organization requires rigorous governance, deep systems integration, and precise context engineering. We specialize in RAG pipelines and proprietary model deployment strategies that protect your IP while empowering your global workforce.'
    }
};

const ServicePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const content = slug && SERVICE_CONTENT[slug] ? SERVICE_CONTENT[slug] : null;

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
                <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
                <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft /> Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 text-white text-center">
            {/* SEO Meta Tags dynamically inserted into the document head for Web Crawlers */}
            <SEO
                title={content.title}
                description={content.desc}
            />

            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                <ScrollReveal>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 font-medium text-sm mb-6 uppercase tracking-widest">
                        Service Offering
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                        {content.title}
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <p className="text-2xl text-white/70 font-light mb-12">
                        {content.desc}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                    <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl text-left leading-relaxed text-lg text-white/60 shadow-2xl">
                        <p>{content.details}</p>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default ServicePage;
