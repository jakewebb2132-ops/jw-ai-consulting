import { ArrowRight } from "phosphor-react";
import Terminal from './Terminal';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#050505] z-0">
            {/* Background Decorative Element */}
            {/* Negative z-index ensures it sits behind nav and content */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none -z-10 transform-gpu" />

            <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                {/* Subtle Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-blue-400 mb-8 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                    </span>
                    Now accepting Q3 Strategic Partnerships
                </div>

                {/* The Gradient Headline */}
                {/* Scaled gracefully from 4xl on tight mobile screens up to 8xl */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-balance">
                    <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent block">
                        Architecting the
                    </span>
                    <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent block">
                        Intelligence Layer
                    </span>
                </h1>

                {/* Sub-headline */}
                {/* text-balance and responsive sizing for elegance */}
                <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/50 mb-12 leading-relaxed text-balance">
                    Bridging the gap between raw machine potential and executive vision with bespoke AI ecosystems designed for scale.
                </p>

                {/* CTAs */}
                {/* Full width on mobile, auto width on larger screens for better UX */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group">
                        Book a Discovery Call
                        <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                        Our Strategy Framework
                    </button>
                </div>

                {/* Animated Terminal */}
                <Terminal />
            </div>
        </section>
    );
};

export default Hero;
