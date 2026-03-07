import { ArrowRight, Sparkle } from "phosphor-react";
import SplineScene from "./SplineScene";
import ScrollReveal from "./ScrollReveal";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#050505] z-0">
            {/* Base Background Decorative Elements (Fallback) */}
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse -z-[5]" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-[5]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none -z-[5]" />



            {/* Premium Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505] z-0 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs sm:text-sm font-medium text-blue-400 mb-8 backdrop-blur-md">
                        <Sparkle size={14} weight="fill" />
                        <span>Architecting the Intelligence Layer</span>
                    </div>
                </ScrollReveal>

                {/* Seamless Spline Interactive Experience - Full Width Focus */}
                <ScrollReveal delay={100}>
                    <div className="relative w-screen left-1/2 -translate-x-1/2 h-[400px] sm:h-[450px] md:h-[600px] overflow-hidden mb-12 group">
                        {/* Spline Scene as a seamless background element */}
                        <div className="absolute inset-0 z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-1000">
                            <SplineScene
                                scene="https://prod.spline.design/XVKGVA47YfyrZy5H/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Custom Text Overlay - Centered and Integrated to perfectly match Spline typography */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6 -mt-10">
                                <span className="text-5xl sm:text-7xl md:text-[5.5rem] font-light tracking-wide bg-gradient-to-r from-[#8ab4f8] to-[#bfdbfe] bg-clip-text text-transparent">
                                    Startups.
                                </span>
                                <span className="text-5xl sm:text-7xl md:text-[5.5rem] font-light tracking-wide text-[#f8f9fa]">
                                    SMB.
                                </span>
                                <span className="text-5xl sm:text-7xl md:text-[5.5rem] font-light tracking-wide bg-gradient-to-r from-[#b152d1] to-[#e879f9] bg-clip-text text-transparent">
                                    Enterprise.
                                </span>
                            </div>

                            <p className="text-xl sm:text-2xl md:text-3xl font-thin text-[#a8adc2] tracking-wide mt-2">
                                No matter where you are in your AI journey
                            </p>
                        </div>

                        {/* Subtle bottom fade to blend */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
                    </div>
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

            </div>
        </section>
    );
};

export default Hero;
