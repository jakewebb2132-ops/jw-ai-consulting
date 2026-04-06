import { ArrowUpRight, Bank, Megaphone, FilmStrip, Robot } from "phosphor-react";
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
        accent: "emerald"
    },
    {
        id: "dusted-pixels",
        client: "Dusted Pixels",
        title: "From Fully Manual to 95% Autonomous",
        description: "Designed and deployed a custom multi-agent 'Content Engine' that fully automated 95% of a boutique agency's content creation and scheduling workflow.",
        impact: "Scaled monthly output from under 100 to over 800 and reduced content creation time from days to minutes",
        icon: <Megaphone size={32} weight="thin" />,
        color: "from-blue-300/30 to-blue-100/50",
        accent: "blue"
    },
    {
        id: "hollywood-screenwriter",
        client: "Hollywood Screenwriter",
        title: "Voice-First AI Ideation Partner",
        description: "Fine-tuned a Claude Haiku model on the writer's full body of work to learn tone, cadence, and creative instincts. Built a mobile voice-first experience.",
        impact: "Brainstorm anywhere hands-free, switch between 3 active projects instantly, and document ideations automatically while maintaining authentic voice.",
        icon: <FilmStrip size={32} weight="thin" />,
        color: "from-amber-300/30 to-amber-100/50",
        accent: "amber"
    },
    {
        id: "claude-code-agents",
        client: "Use Case · Autonomous AI",
        title: "Production Claude Code Agents",
        description: "A 10-step framework for deploying self-improving, memory-enabled agent systems — combining Claude Code, Obsidian.ai long-term memory, and the Karpathy self-learning loop.",
        impact: "Agents that execute, evaluate, reflect, and revise their own skills continuously — closing the loop from instruction to improvement without human intervention.",
        icon: <Robot size={32} weight="thin" />,
        color: "from-violet-300/30 to-violet-100/50",
        accent: "violet"
    }
];

const Portfolio = () => {
    return (
        <section id="portfolio" className="py-[120px] relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-[60px] relative z-10">
                <ScrollReveal>
                    <div className="mb-20 md:flex md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="font-space text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-6 flex items-center gap-4 before:content-[''] before:w-12 before:h-[1px] before:bg-[var(--accent-cyan)]">
                                Architectural Proof
                            </div>
                            <h2 className="font-space text-[clamp(28px,4vw,48px)] font-medium leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)]">
                                From Knowledge to Impact.
                            </h2>
                        </div>
                        <button className="hidden md:flex items-center gap-2 font-space text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--accent-cyan)] hover:text-[var(--accent-hover)] transition-colors group mt-6 md:mt-0">
                            View All Case Studies
                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </ScrollReveal>

                <div className="flex flex-col gap-16">
                    {caseStudies.map((study, index) => {
                        const isEven = index % 2 === 0;

                        const TitleBlock = ({ className = "" }) => (
                            <div className={`flex flex-col h-full justify-center ${className}`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-color)] group-hover:scale-105 transition-transform duration-500 shadow-[0_2px_10px_rgba(58,111,188,0.05)]">
                                        {study.icon}
                                    </div>
                                    <span className="font-space text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">{study.client}</span>
                                </div>
                                <h3 className="font-space text-[clamp(24px,3vw,36px)] font-semibold mb-4 leading-tight text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                                    {study.title}
                                </h3>
                            </div>
                        );

                        const ExplanationBlock = ({ className = "" }) => (
                            <div className={`flex flex-col h-full justify-center ${className}`}>
                                <div className="bg-white/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-8 group-hover:bg-white transition-colors duration-500">
                                    <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8 font-normal">
                                        {study.description}
                                    </p>
                                    <div className="pt-6 border-t border-[var(--border-color)]">
                                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                                            <span className="text-[var(--accent-cyan)] font-space font-bold uppercase tracking-widest text-[11px] block mb-2">Impact Delivered</span>
                                            {study.impact}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );

                        return (
                            <ScrollReveal key={index} delay={100}>
                                <Link
                                    to={`/case-study/${study.id}`}
                                    className="group relative block rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(58,111,188,0.1)] hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 transition-transform duration-700 group-hover:scale-110 transform-gpu pointer-events-none">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${study.color} blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:opacity-60 transition-opacity duration-500 transform-gpu`} />
                                    </div>

                                    <div className="relative z-10 p-8 md:p-12 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch">
                                        {isEven ? (
                                            <>
                                                <TitleBlock />
                                                <ExplanationBlock />
                                            </>
                                        ) : (
                                            <>
                                                <ExplanationBlock className="order-2 md:order-1" />
                                                <TitleBlock className="order-1 md:order-2" />
                                            </>
                                        )}
                                        
                                        {/* Hover Arrow Indicator */}
                                        <div className={`absolute ${isEven ? 'top-8 right-8' : 'top-8 left-8'} w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-white group-hover:bg-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)] shadow-sm transition-all duration-300 z-20`}>
                                            <ArrowUpRight size={20} className={!isEven ? 'rotate-90 md:rotate-0' : ''} />
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        );
                    })}
                </div>

                <ScrollReveal delay={300}>
                    <button className="md:hidden w-full flex items-center justify-center gap-2 mt-12 py-4 px-6 rounded border border-[var(--accent-cyan)] text-[12px] font-space font-bold uppercase tracking-[0.1em] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-white transition-colors shadow-sm">
                        View All Case Studies
                        <ArrowUpRight size={16} />
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default Portfolio;
