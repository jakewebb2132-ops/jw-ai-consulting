import React from 'react';
import {
    Lightbulb, Cpu, ArrowRight, UsersThree,
    LinkedinLogo, TwitterLogo, Envelope, TiktokLogo,
    Globe, Newspaper, FacebookLogo, InstagramLogo,
    MagnifyingGlass, FileText, ChartBar, Article,
    Lightning, YoutubeLogo, ShieldCheck, Palette, User
} from 'phosphor-react';
import { motion } from 'framer-motion';

const ContentEngineDiagram = () => {
    return (
        <div className="w-full mt-12 bg-[#020617] text-slate-50 font-sans rounded-[40px] border border-white/10 overflow-hidden relative p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter italic mb-4 text-white">
                    AGENTIC CONTENT <span className="text-blue-500">GEM</span> ARCHITECTURE
                </h3>
                <p className="text-slate-400 text-lg max-w-2xl">
                    A fully autonomous content OS designed to scale <span className="text-white font-semibold">1 Idea to 14 Platforms</span> while maintaining high-fidelity brand voice.
                </p>
            </div>

            {/* Main Schematic */}
            <div className="relative w-full h-auto min-h-[600px] bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 mb-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)]">

                {/* Background Grid */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" id="svg-layer">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <path d="M 120 180 C 400 180, 400 400, 800 400" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Interactive Pipeline */}
                <div className="relative z-10 flex flex-col gap-12">

                    {/* TOP ROW: INTAKE & BRAIN */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
                        {/* Raw Idea */}
                        <motion.div
                            whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.6)' }}
                            className="w-64 p-6 rounded-2xl text-center border border-amber-500/20 bg-slate-800/40 backdrop-blur-md transition-colors duration-300 relative z-20"
                        >
                            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                                <Lightbulb weight="fill" className="text-amber-400 text-2xl" />
                            </div>
                            <h4 className="font-bold text-lg mb-1 text-white">Raw Idea</h4>
                            <p className="text-xs text-slate-400">Voice memos, notes, or research intake.</p>
                        </motion.div>

                        <div className="hidden md:block text-slate-600 relative z-20">
                            <ArrowRight weight="bold" className="text-2xl animate-pulse" />
                        </div>

                        {/* Synthesis Brain */}
                        <motion.div
                            whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.6)' }}
                            className="w-80 p-6 rounded-2xl text-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-slate-800/40 backdrop-blur-md relative z-20"
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/0 animate-[pulse-ring_2s_cubic-bezier(0.455,0.03,0.515,0.955)_infinite] pointer-events-none" />
                            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/40 relative z-10">
                                <Cpu weight="fill" className="text-blue-400 text-4xl" />
                            </div>
                            <h4 className="font-bold text-xl mb-1 text-blue-400 relative z-10">Synthesis Brain</h4>
                            <p className="text-sm text-slate-300 relative z-10">Generates Master Content DNA: hooks, tone, and logic.</p>
                        </motion.div>
                    </div>

                    {/* MIDDLE: SPECIALIST PODS */}
                    <motion.div
                        whileHover={{ borderColor: 'rgba(59, 130, 246, 0.6)' }}
                        className="rounded-2xl p-6 md:p-8 border border-slate-700/50 bg-slate-800/40 backdrop-blur-md transition-colors duration-300 relative z-20"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                            <h4 className="font-bold text-emerald-400 flex items-center gap-2 m-0 text-lg">
                                <UsersThree weight="fill" className="text-xl" />
                                SPECIALIST PODS (14 AGENTS)
                            </h4>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 py-1.5 px-3 rounded-full border border-slate-700 bg-slate-800">Parallel Processing Active</span>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                            <PlatformCard icon={<LinkedinLogo weight="fill" />} name="LINKEDIN" />
                            <PlatformCard icon={<TwitterLogo weight="fill" />} name="X / TWITTER" />
                            <PlatformCard icon={<Envelope weight="fill" />} name="EMAIL" />
                            <PlatformCard icon={<TiktokLogo weight="fill" />} name="TIKTOK" />
                            <PlatformCard icon={<Globe weight="fill" />} name="SUBSTACK" />
                            <PlatformCard icon={<Newspaper weight="fill" />} name="BLOG" />
                            <PlatformCard icon={<FacebookLogo weight="fill" />} name="FACEBOOK" />
                            <PlatformCard icon={<InstagramLogo weight="fill" />} name="INSTAGRAM" />
                            <PlatformCard icon={<MagnifyingGlass weight="bold" />} name="SEO/AEO" />
                            <PlatformCard icon={<FileText weight="fill" />} name="CASE STUDY" />
                            <PlatformCard icon={<ChartBar weight="fill" />} name="INFOGRAPHIC" />
                            <PlatformCard icon={<Article weight="fill" />} name="MEDIUM" />
                            <PlatformCard icon={<Lightning weight="fill" />} name="LEAD MAGNET" />
                            <PlatformCard icon={<YoutubeLogo weight="fill" />} name="YOUTUBE" />
                        </div>
                    </motion.div>

                    {/* BOTTOM ROW: AUDIT & HITL */}
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 relative z-20">
                        {/* Audit Agent */}
                        <motion.div whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.6)' }} className="flex-1 p-6 rounded-2xl border border-indigo-500/20 bg-slate-800/40 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/30">
                                    <ShieldCheck weight="fill" className="text-indigo-400 text-2xl" />
                                </div>
                                <h4 className="font-bold text-indigo-100 italic m-0">Audit Agent</h4>
                            </div>
                            <p className="text-xs text-slate-400 m-0">Voice validation against Brand KB. Hallucination filter active.</p>
                        </motion.div>

                        {/* Design Wrap */}
                        <motion.div whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.6)' }} className="flex-1 p-6 rounded-2xl border border-purple-500/20 bg-slate-800/40 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/30">
                                    <Palette weight="fill" className="text-purple-400 text-2xl" />
                                </div>
                                <h4 className="font-bold text-purple-100 italic m-0">Design Wrap</h4>
                            </div>
                            <p className="text-xs text-slate-400 m-0">Automated branding & visual formatting for all 14 channels.</p>
                        </motion.div>

                        {/* HITL Approval */}
                        <motion.div whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.6)' }} className="flex-1 p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40">
                                    <User weight="fill" className="text-emerald-400 text-2xl" />
                                </div>
                                <h4 className="font-bold text-emerald-100 italic m-0 tracking-tighter uppercase">HITL Approval</h4>
                            </div>
                            <p className="text-xs text-slate-300 m-0">Human-In-The-Loop final review. One-click distribution.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Metric Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl text-center bg-slate-800/40 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Scale Ratio</div>
                    <div className="text-2xl font-black text-white italic">1 : 14</div>
                </div>
                <div className="p-4 rounded-xl text-center bg-slate-800/40 border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] glow-green">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Status</div>
                    <div className="text-2xl font-black text-emerald-400 italic">ACTIVE</div>
                </div>
                <div className="p-4 rounded-xl text-center bg-slate-800/40 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Brand Accuracy</div>
                    <div className="text-2xl font-black text-white italic">100%</div>
                </div>
                <div className="p-4 rounded-xl text-center bg-slate-800/40 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Human Effort</div>
                    <div className="text-2xl font-black text-blue-400 italic">-95%</div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                @keyframes dash {
                    to { strokeDashoffset: -1000; }
                }
            `}</style>
        </div>
    );
};

const PlatformCard = ({ icon, name }: { icon: React.ReactNode; name: string }) => (
    <div className="p-3 bg-slate-900/60 rounded-lg text-center border border-slate-700 hover:border-emerald-500/60 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 group h-20 shadow-inner">
        <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="text-[9px] font-bold text-slate-500 group-hover:text-emerald-300">{name}</div>
    </div>
);

export default ContentEngineDiagram;
