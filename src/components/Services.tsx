import { Strategy, Cpu, TreeStructure, Database } from "phosphor-react";
import ScrollReveal from "./ScrollReveal";

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
        description: "Building the bridge between fragmented data and actionable intelligence through custom skills and a bespoke \"Agent Brain\" data architecture.",
        icon: <Database size={32} weight="thin" />,
    },
];

const ServicesSection = () => {
    return (
        <section className="py-24 bg-[#f0f4f8] text-slate-900 border-t border-slate-200/50 relative z-10" id="services">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <ScrollReveal>
                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">Core Service Pillars</h2>
                        <p className="text-slate-500 max-w-2xl text-lg">Architecting high-conviction AI solutions for the modern enterprise.</p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} delay={index * 100}>
                            <div
                                className="group p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">{service.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
