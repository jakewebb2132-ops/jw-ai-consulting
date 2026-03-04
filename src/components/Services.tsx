import React from 'react';
import Strategy from "phosphor-react/dist/icons/strategy";
import Cpu from "phosphor-react/dist/icons/cpu";
import TreeStructure from "phosphor-react/dist/icons/tree-structure";
import Database from "phosphor-react/dist/icons/database";

const services = [
    {
        title: "Strategic AI Roadmap",
        description: "Beyond the hype, into the architecture. We audit your technical landscape to design a multi-year AI integration roadmap.",
        icon: <Strategy size={32} weight="thin" />,
    },
    {
        title: "Bespoke LLM Engineering",
        description: "Your data is your moat. We build and deploy custom Large Language Models tailored to your specific security requirements.",
        icon: <Cpu size={32} weight="thin" />,
    },
    {
        title: "Intelligent Process Automation",
        description: "Scaling without the friction. We transform manual workflows into autonomous operations with Human-in-the-Loop systems.",
        icon: <TreeStructure size={32} weight="thin" />,
    },
    {
        title: "Enterprise Data Synthesis",
        description: "Architecting the bridge between fragmented data and actionable intelligence through advanced vector databases.",
        icon: <Database size={32} weight="thin" />,
    },
];

const ServicesSection = () => {
    return (
        <section className="py-24 bg-[#050505] text-white" id="services">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight mb-4">Core Service Pillars</h2>
                    <p className="text-white/60 max-w-2xl">Architecting high-conviction AI solutions for the modern enterprise.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
