import { GraduationCap, Plug, Zap, Bot } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const services = [
    {
        title: "AI 101",
        content: "Learning to prompt like a pro is like learning to talk to a teenager — once you crack the code, they'll do almost anything you ask.",
        icon: <GraduationCap size={24} strokeWidth={1.5} />,
    },
    {
        title: "AI Into Your Business",
        content: "You've got the basics. Now let's plug AI into the tools you already use — your CRM, your inbox, your workflows. No rip-and-replace required.",
        icon: <Plug size={24} strokeWidth={1.5} />,
    },
    {
        title: "Autonomous Workflows",
        content: "What if your business ran while you slept? We map your most repetitive processes and hand them off to AI that executes, decides, and escalates — only when it needs you.",
        icon: <Zap size={24} strokeWidth={1.5} />,
    },
    {
        title: "Custom Agent Build",
        content: [
            "Connecting to YOUR data",
            "Short + long term memory",
            "Tool use",
            "Computer use",
            "Control from your phone",
        ],
        icon: <Bot size={24} strokeWidth={1.5} />,
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
                                {Array.isArray(service.content) ? (
                                    <ul className="text-slate-600 text-sm leading-relaxed space-y-1.5">
                                        {service.content.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {service.content}
                                    </p>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
