import React, { useState } from 'react';
import CheckCircle from "phosphor-react/dist/icons/check-circle";

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd send data to an API here
        setIsSubmitted(true);
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
                                <input required type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors" />
                                <input required type="email" placeholder="Corporate Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors" />
                            </div>
                            <textarea required rows={4} placeholder="Tell us about your strategic objectives..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 transition-colors"></textarea>
                            <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest text-sm">
                                Send Briefing Request
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
