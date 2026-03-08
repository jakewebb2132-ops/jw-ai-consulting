import { ArrowRight, Sparkle } from "phosphor-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SplineScene from "./SplineScene";
import ScrollReveal from "./ScrollReveal";
import MagneticHover from "./MagneticHover";

const Hero = () => {
    const { scrollY } = useScroll();

    // Smooth scroll-driven parallax effects
    const textY = useTransform(scrollY, [0, 500], [0, 150]);
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const splineScale = useTransform(scrollY, [0, 600], [1, 1.15]);
    const splineOpacity = useTransform(scrollY, [0, 600], [0.9, 0.2]);

    return (
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#f8fafc] z-0">
            {/* Base Background Decorative Elements (Fallback) */}
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-300/30 blur-[120px] rounded-full pointer-events-none animate-pulse -z-[5]" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-sky-300/30 blur-[100px] rounded-full pointer-events-none -z-[5]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,black,rgba(0,0,0,0))] opacity-5 pointer-events-none -z-[5]" />


            {/* Premium Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/50 to-[#f8fafc] z-0 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-semibold text-blue-700 mb-8 backdrop-blur-md">
                        <Sparkle size={14} weight="fill" />
                        <span>Architecting the Intelligence Layer</span>
                    </div>
                </ScrollReveal>

                {/* Seamless Spline Interactive Experience - Full Width Focus */}
                <ScrollReveal delay={100}>
                    <div className="relative w-screen left-1/2 -translate-x-1/2 h-[400px] sm:h-[450px] md:h-[600px] overflow-hidden mb-12 group">
                        {/* Spline Scene as a seamless background element with Scroll Scale */}
                        <motion.div
                            style={{ scale: splineScale, opacity: splineOpacity }}
                            className="absolute inset-0 z-0 transition-opacity duration-1000"
                        >
                            <SplineScene
                                scene="https://prod.spline.design/XVKGVA47YfyrZy5H/scene.splinecode"
                                className="w-full h-full"
                            />
                        </motion.div>

                        {/* Custom Text Overlay - Centered and Integrated to perfectly match Spline typography */}
                        <motion.div
                            style={{ y: textY, opacity: textOpacity }}
                            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                        >
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6 -mt-10">
                                <Link to="/services/startups" className="text-5xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer pointer-events-auto hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                    Startups.
                                </Link>
                                <Link to="/services/smb" className="text-5xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight text-slate-800 hover:scale-105 transition-transform cursor-pointer pointer-events-auto hover:drop-shadow-[0_0_15px_rgba(15,23,42,0.2)]">
                                    SMB.
                                </Link>
                                <Link to="/services/enterprise" className="text-5xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer pointer-events-auto hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                    Enterprise.
                                </Link>
                            </div>

                            <p className="text-xl sm:text-2xl md:text-3xl font-light text-slate-500 tracking-normal mt-2">
                                No matter where you are in your AI journey
                            </p>
                        </motion.div>

                        {/* Subtle bottom fade to blend */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none z-20" />
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-20">
                        <MagneticHover>
                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95"
                            >
                                Book a Discovery Call
                                <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </MagneticHover>

                        <MagneticHover>
                            <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                                Our Architectural Proof
                            </a>
                        </MagneticHover>
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
};

export default Hero;
