import React, { useState } from 'react';
import { CheckCircle } from "phosphor-react";

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
            const response = await fetch("https://formspree.io/f/mqaeobon", {
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

    return (
        <section id="contact" className="py-24 bg-[#050505]">
            <div className="max-w-3xl mx-auto px-6 text-center">
                {!isSubmitted ? (
                    <>
                        <h2 className="text-4xl font-semibold text-white mb-6">Initiate Consultation</h2>
                        <p className="text-white/50 mb-12">
                            Ready to architect your intelligence layer? Brief us on your objectives and a senior consultant will reach out within 24 hours.
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
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                                />
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Corporate Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                                />
                            </div>
                            <textarea
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your strategic objectives..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                            ></textarea>

                            {error && (
                                <p className="text-red-400 text-sm text-left px-2">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 bg-white text-black font-bold rounded-xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Send Briefing Request'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* SUCCESS STATE */
                    <div className="py-12 px-8 rounded-3xl bg-white/[0.02] border border-blue-400/20 backdrop-blur-xl animate-fade-in">
                        <div className="flex justify-center mb-6 text-blue-400">
                            <CheckCircle size={64} weight="thin" />
                        </div>
                        <h2 className="text-3xl font-semibold text-white mb-4">Briefing Received</h2>
                        <p className="text-white/50 mb-8 max-w-md mx-auto">
                            Your inquiry has been logged. A senior partner is reviewing your objectives and will contact you shortly to schedule a technical discovery session.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
                        >
                            Send another message
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;
