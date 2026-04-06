import React, { useRef, useState } from "react";
import { Lightbulb, Plug, Infinity, Cpu } from "phosphor-react";
import ScrollReveal from "./ScrollReveal";

const services = [
    {
        title: "AI 101",
        content: "Learning to prompt like a pro is like learning to talk to a teenager — once you crack the code, they'll do almost anything you ask.",
        icon: <Lightbulb size={32} weight="thin" />
    },
    {
        title: "AI Into Your Business",
        content: "You've got the basics. Now let's plug AI into the tools you already use — your CRM, your inbox, your workflows. No rip-and-replace required.",
        icon: <Plug size={32} weight="thin" />
    },
    {
        title: "Autonomous Workflows",
        content: "What if your business ran while you slept? We map your most repetitive processes and hand them off to AI that executes, decides, and escalates — only when it needs you.",
        icon: <Infinity size={32} weight="thin" />
    },
    {
        title: "Custom Agent Build",
        content: [
            "Connecting to YOUR data",
            "Short + long term memory",
            "Tool use",
            "Computer use"
        ],
        icon: <Cpu size={32} weight="thin" />
    }
];

const TiltCard = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [glare, setGlare] = useState<React.CSSProperties>({ opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt bounds (15 degrees max)
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        });

        // Dynamic glare effect tracking mouse
        setGlare({
            opacity: 1,
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            transition: 'opacity 0.2s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
            transition: 'transform 0.5s ease-out'
        });
        setGlare({
            opacity: 0,
            transition: 'opacity 0.5s ease-out'
        });
    };

    return (
        <ScrollReveal delay={delay} className="h-full">
            <div 
                ref={cardRef} 
                className="group relative h-full w-full rounded-3xl md:rounded-[40px] bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden shadow-sm"
                style={{ ...style, transformStyle: 'preserve-3d' }}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave}
            >
                {/* 3D Glare layer */}
                <div 
                    className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
                    style={glare}
                />
                
                {/* Background glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)] opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none" />

                <div 
                    className="p-8 md:p-10 h-full flex flex-col relative z-10"
                    style={{ transform: 'translateZ(30px)' }}
                >
                    {children}
                </div>
            </div>
        </ScrollReveal>
    );
};

const Services = () => {
    return (
        <section className="relative z-10 py-[120px] px-6 lg:px-[60px]" id="services">
            <div className="max-w-7xl mx-auto w-full">
                <ScrollReveal>
                    <div className="font-space text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--accent-cyan)] mb-6 flex items-center gap-4 before:content-[''] before:w-12 before:h-[1px] before:bg-[var(--accent-cyan)]">
                        Core Service Pillars
                    </div>
                    <h2 className="font-space text-[clamp(28px,4vw,48px)] font-medium leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] max-w-2xl mb-20">
                        <em>From Curiosity to Knowledge.</em>
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative items-stretch">
                    {services.map((service, index) => (
                        <TiltCard key={index} delay={index * 100}>
                            <div className="font-space text-[14px] font-semibold text-[var(--accent-cyan)] tracking-[0.1em] mb-6">
                                0{index + 1}
                            </div>
                            
                            <div className="mb-6 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[var(--accent-cyan)] border border-[var(--border-color)] shadow-[0_2px_10px_rgba(58,111,188,0.05)] group-hover:scale-110 transition-transform duration-500">
                                {service.icon}
                            </div>

                            <h3 className="font-space text-[22px] font-semibold text-[var(--text-primary)] mb-4 leading-tight">
                                {service.title}
                            </h3>

                            <div className="text-[16px] leading-[1.7] text-[var(--text-secondary)] font-normal flex-grow">
                                {Array.isArray(service.content) ? (
                                    <ul className="space-y-3 text-[var(--text-secondary)]">
                                        {service.content.map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{service.content}</p>
                                )}
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
