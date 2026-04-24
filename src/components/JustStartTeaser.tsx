import { ArrowRight } from "phosphor-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import MagneticHover from "./MagneticHover";

const JustStartTeaser = () => {
    return (
        <section className="relative z-10 px-6 md:px-[60px] py-0">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="bg-[var(--text-primary)] rounded-[4px] px-10 md:px-16 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 overflow-hidden relative">
                        {/* Subtle geometric bg */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='300,20 380,100 240,90' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='340,140 400,220 280,210' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
                            backgroundPosition: 'right center',
                            backgroundRepeat: 'no-repeat',
                        }} />

                        <div className="relative">
                            <p className="font-space text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-3">
                                New &mdash; Just Start
                            </p>
                            <h2 className="font-space text-[clamp(22px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white max-w-[520px]">
                                Maintaining your job AND learning AI{" "}
                                <em className="not-italic text-[var(--accent-cyan)]">is a lot.</em>
                            </h2>
                            <p className="font-inter text-[15px] text-white/55 mt-4 max-w-[460px] leading-[1.7]">
                                $1,500/month gets you a person &mdash; not a course &mdash; who answers your actual questions
                                about your actual business. One call to start. Full refund if it doesn't land.
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-4 relative flex-shrink-0">
                            <div>
                                <div className="font-space text-[48px] font-bold text-white tracking-[-0.04em] leading-none md:text-right">$1,500</div>
                                <div className="font-inter text-[13px] text-white/40 mt-1 md:text-right">per month &middot; cancel anytime</div>
                            </div>
                            <MagneticHover>
                                <Link
                                    to="/just-start"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--accent-cyan)] text-white font-space text-[11px] font-bold tracking-[0.15em] uppercase rounded-[4px] hover:bg-white hover:text-[var(--text-primary)] transition-all whitespace-nowrap"
                                >
                                    Just Start
                                    <ArrowRight size={15} weight="bold" />
                                </Link>
                            </MagneticHover>
                            <p className="font-inter text-[11px] text-white/30 md:text-right">Full refund if you don't get value</p>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default JustStartTeaser;
