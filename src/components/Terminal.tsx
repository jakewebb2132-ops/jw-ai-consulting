import React, { useState, useEffect } from 'react';

const Terminal = () => {
    const [text, setText] = useState('');
    const fullText = "> jwc auth init\n> Authenticating payload...\n> Connection established.\n> Resolving corporate matrix...\n> Status: READY.";

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden md:flex w-full max-w-3xl mx-auto mt-16 h-[256px] bg-[#0a0a0b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex-col font-mono text-sm text-left transform-gpu">
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/50">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 text-xs text-white/40 block w-full text-center pr-12">
                    jwc-core-v2.1.0
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 text-green-400/80 whitespace-pre-wrap flex-1 overflow-auto opacity-90 leading-relaxed">
                {text}
                <span className="inline-block w-2 h-4 bg-green-400/80 ml-1 animate-pulse align-middle"></span>
            </div>
        </div>
    );
};

export default Terminal;
