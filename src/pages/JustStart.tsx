import { ArrowRight, Phone, Users, ChatCircleText, FileText, CheckCircle, Sparkle } from "phosphor-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollReveal from "../components/ScrollReveal";
import MagneticHover from "../components/MagneticHover";
import MeshCanvas from "../components/MeshCanvas";
import ScrollProgress from "../components/ScrollProgress";

const BOOKING_URL = "https://calendar.app.google/jfu9ejCAa4fAnrVF9";

const steps = [
    {
        num: "01",
        week: "Week 1",
        title: "The Call",
        body: "One hour. You tell me what you're trying to build, fix, or understand. I give you my honest read — no jargon, no fluff.",
        detail: "We leave with a clear picture of what AI can do for you right now.",
    },
    {
        num: "02",
        week: "Weeks 2–4",
        title: "The Month",
        body: "I join your team meeting once a week. Your team gets a dedicated Slack channel — ask anything, anytime, get real answers fast.",
        detail: "No more guessing. No more falling behind.",
    },
    {
        num: "03",
        week: "Day 30",
        title: "Your Menu",
        body: "I'll put together a full picture of what would make sense to keep going. Every option tied to what you actually said you needed.",
        detail: "You decide. Zero pressure.",
    },
];

const includes = [
    {
        icon: <Phone size={18} weight="bold" />,
        title: "1-Hour Kickoff Call",
        body: "Your goals, your situation, my honest take — all in one focused conversation.",
    },
    {
        icon: <Users size={18} weight="bold" />,
        title: "Weekly Team Meeting",
        body: "I join once a week to answer questions, clear up confusion, and keep momentum going.",
    },
    {
        icon: <ChatCircleText size={18} weight="bold" />,
        title: "Slack Channel for Your Team",
        body: "Real-time access all month. Anyone on your team can ask — no question too basic.",
    },
    {
        icon: <FileText size={18} weight="bold" />,
        title: "Your AI Roadmap",
        body: "At month end, a full menu of exactly what to build next — tailored to everything you told me.",
    },
];

const features = [
    "1-hour kickoff call (your goals + my read)",
    "Weekly team meeting (up to 1 hour each)",
    "Dedicated Slack channel for your whole team",
    "Tailored AI roadmap at end of month",
    "Full refund if you don't get value — no questions",
];

const JustStart = () => {
    return (
        <div className="flex min-h-screen flex-col font-sans overflow-x-hidden relative">
            <MeshCanvas />
            <ScrollProgress />
            <Navbar />

            {/* ── HERO ─────────────────────────────────────── */}
            <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-[60px] pt-[100px] pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-space text-[11px] font-semibold tracking-[0.15em] uppercase mb-10 w-fit bg-[var(--bg-surface)] backdrop-blur-[10px] shadow-[0_4px_12px_rgba(58,111,188,0.05)] border border-[rgba(58,111,188,0.15)] text-[var(--text-primary)]">
                            <Sparkle size={14} weight="fill" className="text-[var(--accent-cyan)] animate-pulse" />
                            Getting started with AI
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={100}>
                        <h1 className="font-space text-[clamp(52px,7vw,96px)] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--text-primary)] max-w-[800px] mb-6">
                            Just <br />
                            <em className="not-italic text-[var(--accent-cyan)]">Start.</em>
                        </h1>
                        <p className="font-inter text-[clamp(16px,1.5vw,20px)] font-normal text-[var(--text-secondary)] max-w-[520px] leading-[1.65] mb-6">
                            One call. One month. One person who actually answers your questions about your actual business.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="flex items-baseline gap-3 mb-12">
                            <span className="font-space text-[clamp(40px,5vw,64px)] font-bold text-[var(--text-primary)] tracking-[-0.03em] leading-none">$1,500</span>
                            <span className="font-inter text-[18px] text-[var(--text-muted)]">/ month</span>
                            <span className="font-inter text-[14px] text-[var(--accent-cyan)] font-semibold ml-2">Full refund if you don't get value</span>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={300} className="relative z-50">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                            <MagneticHover>
                                <a
                                    href={BOOKING_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-[14px] bg-[var(--text-primary)] text-white font-space text-[12px] font-semibold tracking-[0.15em] uppercase rounded-[4px] border border-[var(--text-primary)] hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all flex items-center justify-center gap-2"
                                >
                                    Book the First Hour
                                    <ArrowRight size={16} weight="bold" />
                                </a>
                            </MagneticHover>
                            <MagneticHover>
                                <a
                                    href="#how-it-works"
                                    className="px-8 py-[14px] bg-transparent text-[var(--accent-cyan)] font-space text-[13px] font-semibold tracking-[0.1em] uppercase border border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-white transition-all flex items-center justify-center gap-2 rounded-[4px]"
                                >
                                    See How It Works
                                    <span className="text-[16px]">→</span>
                                </a>
                            </MagneticHover>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────── */}
            <section id="how-it-works" className="relative z-10 px-6 md:px-[60px] py-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <p className="font-space text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-4">How it works</p>
                        <h2 className="font-space text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] mb-16 max-w-[560px]">
                            From overwhelmed to clear — in 30 days.
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-[var(--border-color)]">
                        {steps.map((step, i) => (
                            <ScrollReveal key={step.num} delay={i * 100}>
                                <div className="bg-white p-10 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="font-space text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--accent-cyan)]">{step.num}</span>
                                        <div className="flex-1 h-[1px] bg-[var(--border-color)]" />
                                        <span className="font-space text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">{step.week}</span>
                                    </div>
                                    <h3 className="font-space text-[22px] font-semibold text-[var(--text-primary)] mb-4 tracking-[-0.01em]">{step.title}</h3>
                                    <p className="font-inter text-[15px] text-[var(--text-secondary)] leading-[1.7] flex-1">{step.body}</p>
                                    <p className="font-space text-[13px] font-semibold text-[var(--text-primary)] mt-6">{step.detail}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHAT'S INCLUDED ──────────────────────────── */}
            <section className="relative z-10 px-6 md:px-[60px] py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <ScrollReveal>
                        <div>
                            <p className="font-space text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-4">What's included</p>
                            <h2 className="font-space text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] mb-8">
                                Access to someone who's already figured it out.
                            </h2>
                            <p className="font-inter text-[16px] text-[var(--text-secondary)] leading-[1.8] mb-5 max-w-[480px]">
                                You don't need another AI course. You need someone who's already figured it out to sit down with you and your specific situation.
                            </p>
                            <p className="font-inter text-[16px] text-[var(--text-secondary)] leading-[1.8] max-w-[480px]">
                                This isn't a subscription to content. It's access to a person — one who's already done this for Wall Street banks, boutique agencies, Hollywood screenwriters, and ambitious founders.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="flex flex-col gap-[2px]">
                        {includes.map((item, i) => (
                            <ScrollReveal key={item.title} delay={i * 80}>
                                <div className="glass-card p-7 flex items-start gap-5">
                                    <div className="w-9 h-9 rounded-[4px] bg-blue-50 border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-cyan)] flex-shrink-0 mt-0.5">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-space text-[15px] font-semibold text-[var(--text-primary)] mb-1">{item.title}</h4>
                                        <p className="font-inter text-[14px] text-[var(--text-secondary)] leading-[1.65]">{item.body}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ──────────────────────────────────── */}
            <section className="relative z-10 px-6 md:px-[60px] py-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <p className="font-space text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-4 text-center">Pricing</p>
                        <h2 className="font-space text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] mb-14 text-center max-w-[400px] mx-auto">
                            One flat price. No surprises.
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal delay={100}>
                        <div className="max-w-[520px] mx-auto border border-[var(--border-color)] rounded-[4px] p-12 relative bg-white shadow-xl shadow-blue-900/5">
                            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[var(--accent-cyan)] text-white font-space text-[10px] font-bold tracking-[0.15em] uppercase rounded-full">
                                Just Start Plan
                            </div>

                            <div className="text-center mb-10">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="font-space text-[72px] font-bold text-[var(--text-primary)] tracking-[-0.04em] leading-none">$1,500</span>
                                    <span className="font-inter text-[18px] text-[var(--text-muted)]">/ month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 font-inter text-[15px] text-[var(--text-primary)]">
                                        <CheckCircle size={18} weight="fill" className="text-[var(--accent-cyan)] flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <MagneticHover>
                                <a
                                    href={BOOKING_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--text-primary)] text-white font-space text-[12px] font-semibold tracking-[0.15em] uppercase rounded-[4px] hover:bg-[var(--accent-cyan)] transition-all"
                                >
                                    Book the First Hour
                                    <ArrowRight size={16} weight="bold" />
                                </a>
                            </MagneticHover>

                            <p className="text-center font-inter text-[13px] text-[var(--text-muted)] mt-5 italic">
                                Not sure yet? <strong className="not-italic text-[var(--text-primary)] font-semibold">Start with the call.</strong> One hour, zero commitment.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ── GUARANTEE ────────────────────────────────── */}
            <section className="relative z-10 px-6 md:px-[60px] py-28 bg-[var(--text-primary)] text-white overflow-hidden">
                {/* subtle geometric decoration */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='480,30 560,110 410,100' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='520,170 590,250 460,240' fill='none' stroke='white' stroke-width='1'/%3E%3Cpolygon points='440,310 520,360 370,355' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                }} />

                <div className="max-w-7xl mx-auto text-center">
                    <ScrollReveal>
                        <p className="font-space text-[11px] font-bold tracking-[0.2em] uppercase text-blue-300/70 mb-5">Zero risk</p>
                        <h2 className="font-space text-[clamp(32px,5vw,60px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white mb-7 max-w-[640px] mx-auto">
                            If it didn't move the needle — you get the{" "}
                            <em className="not-italic text-[var(--accent-cyan)]">$1,500 back.</em>
                        </h2>
                        <p className="font-inter text-[18px] text-white/60 max-w-[520px] mx-auto mb-12 leading-[1.7]">
                            No forms. No argument. If after 30 days you feel like you didn't get real value, I'll refund every dollar. That's the deal.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={150}>
                        <MagneticHover className="inline-block">
                            <a
                                href={BOOKING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--accent-cyan)] text-white font-space text-[12px] font-semibold tracking-[0.15em] uppercase rounded-[4px] hover:bg-white hover:text-[var(--text-primary)] transition-all"
                            >
                                Book the First Hour
                                <ArrowRight size={16} weight="bold" />
                            </a>
                        </MagneticHover>
                    </ScrollReveal>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────── */}
            <footer className="border-t border-[var(--border-color)] bg-white px-6 py-8 relative z-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-[var(--text-muted)] md:flex-row">
                    <Link to="/" className="font-space text-[13px] font-bold tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors">
                        ← Back to JW AI Consulting
                    </Link>
                    <p className="font-inter text-[13px]">&copy; 2026 JW AI Consulting. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default JustStart;
