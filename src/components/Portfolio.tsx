import { ArrowUpRight, Bank, Megaphone, FilmStrip } from "phosphor-react";
import ScrollReveal from "./ScrollReveal";
import { Link } from "react-router-dom";

const caseStudies = [
    {
        id: "wall-street-bank",
        client: "Top 10 Wall Street Bank",
        title: "Agent Brain: Ecosystem-Wide AI Understanding",
        description: "A custom plugin and skill set that gives Claude Code, OpenCode, and other AI coding tools comprehensive knowledge of an entire enterprise ecosystem.",
        impact: "Transformed scattered repositories and docs into an intelligent context structure utilizing BM25, vector search, and GraphRAG.",
        icon: <Bank size={32} weight="thin" />,
        color: "from-emerald-300/30 to-emerald-100/50",
        borderHover: "hover:border-emerald-300 hover:shadow-emerald-900/5"
    },
    {
        id: "dusted-pixels",
        client: "Dusted Pixels",
        title: "From Fully Manual to 95% Autonomous",
        description: "Designed and deployed a custom multi-agent 'Content Engine' that fully automated 95% of a boutique agency's content creation and scheduling workflow.",
        impact: "Scaled monthly output from under 100 to over 800 and reduced content creation time from days to minutes",
        icon: <Megaphone size={32} weight="thin" />,
        color: "from-blue-300/30 to-blue-100/50",
        borderHover: "hover:border-blue-300 hover:shadow-blue-900/5"
    },
    {
        id: "hollywood-screenwriter",
        client: "Hollywood Screenwriter",
        title: "Voice-First AI Ideation Partner",
        description: "Fine-tuned a Claude Haiku model on the writer's full body of work to learn tone, cadence, and creative instincts. Built a mobile voice-first experience.",
        impact: "Brainstorm anywhere hands-free, switch between 3 active projects instantly, and document ideations automatically while maintaining authentic voice.",
        icon: <FilmStrip size={32} weight="thin" />,
        color: "from-amber-300/30 to-amber-100/50",
        borderHover: "hover:border-amber-300 hover:shadow-amber-900/5"
    }
];

const Portfolio = () => {
    return (
        <section id="portfolio" className="py-24 bg-[#f0f4f8] text-slate-900 border-t border-slate-200/50 z-10 relative">
            {/* Decorative Glows */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-300/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-300/20 blur-[120px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <div className="mb-16 md:flex md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">The Proof</h2>
                            <p className="text-slate-500 text-lg">Real-world impact of our bespoke AI architectures across enterprise and agency environments.</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group mt-6 md:mt-0">
                            View All Case Studies
                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {caseStudies.map((study, index) => (
                        <ScrollReveal key={index} delay={index * 150}>
                            <Link
                                to={`/case-study/${study.id}`}
                                className={`group relative p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-500 ${study.borderHover} hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full block`}
                            >
                                {/* Abstract Gradient Mesh Placeholder */}
                                <div className="absolute top-0 right-0 w-64 h-64 opacity-50 transition-transform duration-700 group-hover:scale-110 transform-gpu pointer-events-none">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${study.color} blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:opacity-100 transition-opacity duration-500 transform-gpu`} />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                {study.icon}
                                            </div>
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{study.client}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 shadow-sm transition-all duration-300">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-balance text-slate-900 group-hover:text-blue-700 transition-colors">
                                            {study.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            {study.description}
                                        </p>

                                        <div className="pt-6 border-t border-slate-100">
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                <span className="text-blue-600 font-bold mr-2 block mb-1">Impact:</span>
                                                {study.impact}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={500}>
                    <button className="md:hidden w-full flex items-center justify-center gap-2 mt-8 py-4 px-6 rounded-full border border-blue-200 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-sm">
                        View All Case Studies
                        <ArrowUpRight size={16} />
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default Portfolio;
