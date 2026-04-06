import React, { useState } from 'react';
import { CheckCircle, LinkedinLogo, Envelope } from "phosphor-react";
import MagneticHover from "./MagneticHover";

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("https://formspree.io/f/mjgavnwe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    _subject: `New Lead from JW AI Consulting: ${formData.name}`
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                const data = await response.json();
                setError(data.error || "Submission failed. Please try again.");
            }
        } catch (err) {
            setError("Connectivity error. Please check your network.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ContactInfo = () => {
        const links = [
            {
                href: "https://www.linkedin.com/in/jakewebb/",
                label: "Professional Network",
                value: "linkedin.com/in/jakewebb",
                icon: LinkedinLogo,
                isExternal: true
            },
            {
                href: "mailto:jake@jwaiconsulting.com",
                label: "Direct Correspondence",
                value: "jake@jwaiconsulting.com",
                icon: Envelope
            },
            {
                href: "mailto:jw@connectivity.vc",
                label: "Venture Capital",
                value: "jw@connectivity.vc",
                icon: Envelope
            },
            {
                href: "mailto:jake@wonderwomentech.com",
                label: "Tech Advocacy",
                value: "jake@wonderwomentech.com",
                icon: Envelope
            }
        ];

        return (
            <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-4 group transition-all"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all border border-slate-200 group-hover:border-blue-200 shadow-sm shrink-0">
                            <link.icon size={24} weight="light" className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium mb-0.5">{link.label}</p>
                            <p className="text-slate-600 group-hover:text-blue-700 transition-colors font-medium text-sm sm:text-base break-all sm:break-normal">{link.value}</p>
                        </div>
                    </a>
                ))}
            </div>
        );
    };

    return (
        <section id="contact" className="py-24 bg-[#f0f4f8] border-t border-slate-200/50 relative z-10">
            <div className="max-w-3xl mx-auto px-6 text-center">
                {!isSubmitted ? (
                    <>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">Let's Chat</h2>
                        <p className="text-slate-500 mb-12">
                            No matter where you are in your AI journey - I promise you will learn something new
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                />
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Corporate Email"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                />
                            </div>
                            <textarea
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your strategic objectives..."
                                className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                            ></textarea>

                            {error && (
                                <p className="text-red-400 text-sm text-left px-2">{error}</p>
                            )}

                            <MagneticHover>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Connect'
                                    )}
                                </button>
                            </MagneticHover>
                        </form>
                        <ContactInfo />
                    </>
                ) : (
                    /* SUCCESS STATE */
                    <div className="py-12 px-8 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-900/5 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 pointer-events-none" />
                        <div className="relative z-10 flex justify-center mb-6 text-blue-600">
                            <CheckCircle size={64} weight="thin" />
                        </div>
                        <h2 className="relative z-10 text-3xl font-bold text-slate-900 mb-4">Briefing Received</h2>
                        <p className="relative z-10 text-slate-500 mb-8 max-w-md mx-auto">
                            Your inquiry has been logged. A senior partner is reviewing your objectives and will contact you shortly to schedule a technical discovery session.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="relative z-10 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 mb-12"
                        >
                            Send another message
                        </button>
                        <div className="relative z-10">
                            <ContactInfo />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;
