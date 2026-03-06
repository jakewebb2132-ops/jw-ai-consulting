import { ArrowRight, Sparkle } from "phosphor-react";
import Terminal from './Terminal';
import SplineScene from "./SplineScene";
import ScrollReveal from "./ScrollReveal";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#050505] z-0">
            {/* Base Background Decorative Elements (Fallback) */}
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse -z-[5]" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-[5]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none -z-[5]" />

            {/* Spline 3D Scene Background */}
            <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40 lg:opacity-60 xl:opacity-80">
                <SplineScene
                    scene="https://prod.spline.design/kZS1ORPeLrtByu7X/scene.splinecode"
                />
            </div>

            {/* Premium Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505] z-0 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs sm:text-sm font-medium text-blue-400 mb-8 backdrop-blur-md">
                        <Sparkle size={14} weight="fill" />
                        <span>Architecting the Intelligence Layer</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-balance">
                        <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent block">
                            Bespoke AI
                        </span>
                        <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent block">
                            Context Engineering
                        </span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/50 mb-12 leading-relaxed text-balance backdrop-blur-[1px]">
                        Bridging the gap between raw data potential and executive vision with
                        bespoke multi-agent architectures designed for complex ecosystems.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-20">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                            Book a Discovery Call
                            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95">
                            Our Architectural Proof
                        </a>
                    </div>
                </ScrollReveal>

                {/* Animated Terminal as content, not just decoration */}
                <ScrollReveal delay={400}>
                    <div className="max-w-3xl mx-auto opacity-80 hover:opacity-100 transition-opacity">
                        <Terminal />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default Hero;
