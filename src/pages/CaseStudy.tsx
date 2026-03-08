import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, ChartBar, Rocket, ArrowUpRight } from "phosphor-react";
import ScrollReveal from '../components/ScrollReveal';
import ContentEngineDiagram from '../components/ContentEngineDiagram';
import AgentBrainDiagram from '../components/AgentBrainDiagram';

interface CaseStudyMetric {
    label: string;
    value: string;
    icon: React.ReactNode;
}

interface CaseStudyInfo {
    client: string;
    title: string;
    overview: string;
    solution: string;
    metrics: CaseStudyMetric[];
    externalLink?: {
        label: string;
        url: string;
    };
    diagram?: React.ReactNode;
    image?: string;
}

const caseStudyData: Record<string, CaseStudyInfo> = {
    "wall-street-bank": {
        client: "Top 10 Wall Street Bank",
        title: "Agent Brain: Ecosystem-Wide AI Understanding",
        overview: "A massive multi-national bank was struggling with 'Knowledge Fragmentation.' With 14,000+ repositories and disparate documentation across Confluence, Jira, and internal wikis, their AI coding tools (Claude Code, OpenCode) lacked the environmental context to be truly effective.",
        solution: "We architected 'Agent Brain'—a semantic knowledge layer that maps the entire enterprise ecosystem. Using a hybrid of GraphRAG and BM25 search, we gave the AI a 'nervous system' that understands cross-repo dependencies and internal standards.",
        metrics: [
            { label: "Onboarding Time", value: "-65%", icon: <Clock /> },
            { label: "Code Quality Index", value: "+42%", icon: <ChartBar /> },
            { label: "AI Completion Rate", value: "98%", icon: <CheckCircle weight="thin" /> }
        ],
        externalLink: {
            label: "Full Project Details from the Engineer",
            url: "https://pub.spillwave.com/agent-brain-agentic-skills-for-enterprise-context-engineering-b5f61d8f57f0"
        },
        diagram: <AgentBrainDiagram />
    },
    "dusted-pixels": {
        client: "Dusted Pixels",
        title: "From Fully Manual to 95% Autonomous",
        overview: "Dusted Pixels, a high-growth digital agency, was hitting a hard ceiling. Content creation was a manual bottleneck, with senior creatives spending 70% of their time on repetitive formatting and scheduling tasks rather than strategy.",
        solution: "We deployed a bespoke multi-agent 'Content Engine.' This system doesn't just generate text; it researches trends, cross-references brand voice, designs layout concepts, and automatically stages posts across 9 platforms simultaneously.",
        metrics: [
            { label: "Content Volume", value: "10x", icon: <Rocket /> },
            { label: "Creation Time", value: "-95%", icon: <Clock /> },
            { label: "Brand Consistency", value: "100%", icon: <CheckCircle weight="thin" /> }
        ],
        diagram: <ContentEngineDiagram />
    },
    "hollywood-screenwriter": {
        client: "Hollywood Screenwriter",
        title: "Voice-First AI Ideation Partner",
        overview: "A prolific Hollywood screenwriter needed a sounding board that functioned like a creative partner, not a generic chatbot. The requirement was a system that understood their specific tone, pacing, and thematic instincts.",
        solution: "We engineered a voice-first mobile experience powered by a fine-tuned Claude Haiku model. The system was trained entirely on the writer's past scripts and treatments, allowing them to brainstorm hands-free while driving or walking, with the AI maintaining their authentic creative voice.",
        metrics: [
            { label: "Ideation Speed", value: "3x", icon: <Rocket /> },
            { label: "Voice Accuracy", value: "98%", icon: <CheckCircle weight="thin" /> },
            { label: "Active Projects", value: "3+", icon: <ChartBar /> }
        ]
    }
};

const CaseStudy = () => {
    const { id } = useParams();
    const study = caseStudyData[id as keyof typeof caseStudyData];

    if (!study) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
                    <Link to="/" className="text-blue-400 hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft /> Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-24">
            {/* Header */}
            <header className="relative py-24 lg:py-32 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-blue-400/5 blur-[120px] rounded-full -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors group">
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Insights
                    </Link>

                    <ScrollReveal>
                        <span className="text-blue-400 font-medium tracking-widest uppercase text-sm mb-4 block">
                            {study.client}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 max-w-4xl text-balance leading-tight">
                            {study.title}
                        </h1>
                    </ScrollReveal>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Metrics */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 h-fit">
                        {study.metrics.map((metric, idx) => (
                            <ScrollReveal key={idx} delay={idx * 100}>
                                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
                                            {metric.icon}
                                        </div>
                                        <span className="text-white/40 text-sm font-medium uppercase tracking-wider">{metric.label}</span>
                                    </div>
                                    <div className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                        {metric.value}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Right Column: Case Story */}
                    <div className="lg:col-span-8 space-y-16">
                        <ScrollReveal>
                            <section>
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-400 rounded-full" />
                                    The Challenge
                                </h2>
                                <p className="text-xl text-white/60 leading-relaxed font-light italic">
                                    "{study.overview}"
                                </p>
                            </section>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <section>
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-400 rounded-full" />
                                    The Architecture
                                </h2>
                                <p className="text-lg text-white/70 leading-relaxed lg:pr-12">
                                    {study.solution}
                                </p>

                                {study.image && (
                                    <div className="mt-16 mb-8 w-full rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-white/5">
                                        <img src={study.image} alt="Architecture Schematic" className="w-full h-auto" />
                                    </div>
                                )}

                                {study.diagram && (
                                    <div className="mt-16 mb-8 w-full max-w-[100vw] overflow-x-hidden">
                                        {study.diagram}
                                    </div>
                                )}


                            </section>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <div className="p-12 rounded-[40px] bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold mb-4">Ready to Architect Your Success?</h3>
                                    <p className="text-white/80 mb-8 max-w-lg">Let's discuss how we can apply similar architectures to your organization.</p>
                                    <Link to="/#contact" className="inline-block px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs">
                                        Initiate Discovery Call
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>

                        {study.externalLink && (
                            <ScrollReveal delay={400}>
                                <div className="pt-8 border-t border-white/5">
                                    <a
                                        href={study.externalLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors group text-lg font-medium"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-blue-400/20 flex items-center justify-center group-hover:bg-blue-400/10 transition-colors text-blue-400">
                                            <ArrowUpRight size={20} />
                                        </div>
                                        {study.externalLink.label}
                                    </a>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CaseStudy;
