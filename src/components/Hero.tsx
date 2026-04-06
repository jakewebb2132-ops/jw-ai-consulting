import { ArrowRight, Sparkle } from "phosphor-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import MagneticHover from "./MagneticHover";

const Hero = () => {
    return (
        <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-[60px] pt-[80px] pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-space text-[11px] font-semibold tracking-[0.15em] uppercase mb-10 w-fit bg-[var(--bg-surface)] backdrop-blur-[10px] shadow-[0_4px_12px_rgba(58,111,188,0.05)] border border-[rgba(58,111,188,0.15)] text-[var(--text-primary)]">
                        <Sparkle size={14} weight="fill" className="text-[var(--accent-cyan)] animate-pulse shadow-[0_0_10px_var(--accent-cyan)]" />
                        Architecting the Intelligence Layer
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h1 className="font-space text-[clamp(48px,6vw,84px)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] max-w-[900px] mb-6 text-shadow-[0_0_40px_rgba(255,255,255,0.8)]">
                        Startups. SMB. <br />
                        <em className="not-italic text-[var(--accent-cyan)] relative z-10 after:content-[''] after:absolute after:bottom-1 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-[var(--accent-cyan)] after:to-transparent after:-z-10 after:opacity-50">Enterprise.</em>
                    </h1>

                    <p className="font-inter text-[clamp(16px,1.5vw,18px)] font-normal text-[var(--text-secondary)] max-w-[600px] leading-[1.6] mb-14">
                        No matter where you are in your AI journey
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={300} className="relative z-50">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-8 mb-20 pointer-events-auto">
                        <MagneticHover className="relative z-[100]">
                            <a
                                href="https://calendar.app.google/jfu9ejCAa4fAnrVF9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-[14px] bg-[var(--text-primary)] text-white font-space text-[12px] font-semibold tracking-[0.15em] uppercase rounded-[4px] border border-[var(--text-primary)] hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] hover:shadow-[0_0_20px_rgba(58,111,188,0.15)] transition-all flex items-center justify-center gap-2 relative z-[101]"
                            >
                                Book a Discovery Call
                                <ArrowRight size={16} weight="bold" />
                            </a>
                        </MagneticHover>

                        <MagneticHover>
                            <a href="#portfolio" className="w-full sm:w-auto px-8 py-[14px] bg-transparent text-[var(--accent-cyan)] font-space text-[13px] font-semibold tracking-[0.1em] uppercase border border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-white hover:shadow-[0_0_20px_rgba(58,111,188,0.15)] rounded-[4px] transition-all flex items-center justify-center gap-2">
                                Our Architectural Proof
                                <span className="text-[16px] ml-1">→</span>
                            </a>
                        </MagneticHover>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default Hero;
