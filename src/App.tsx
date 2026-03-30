import React, { useState } from 'react';
import { ArrowRight, Sparkle, Brain, RocketLaunch, Network, GlobeHemisphereWest } from 'phosphor-react';

const PremiumShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#05060A] text-[#F4F4F5] font-sans relative overflow-hidden selected-none">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1a150b] to-transparent opacity-80 z-0"></div>
      <div className="hero-glow"></div>

      {/* Navigation */}
      <nav className="relative z-10 glass-panel border-b border-white/5 py-4 px-10 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a96e] to-[#9F8246] flex items-center justify-center shadow-lg shadow-[#c9a96e]/20">
            <Sparkle size={20} weight="fill" className="text-[#05060A]" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">AI Strategies</h1>
            <p className="text-[10px] text-[#c9a96e] font-bold tracking-[0.2em] uppercase">Enterprise</p>
          </div>
        </div>

        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {['overview', 'intelligence', 'deployment', 'systems'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white/10 text-[#c9a96e] shadow-sm'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all">
          Connect Core
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-32">
        
        {/* Hero Section */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse"></span>
            System Online & Ready
          </div>
          <h2 className="text-7xl font-light tracking-tight mb-8">
            Architect the <span className="gold-gradient-text font-bold italic">Future</span>.
          </h2>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Build, deploy, and scale autonomous AI systems with unprecedented control. State-of-the-art infrastructure disguised as a beautiful, reactive front-end.
          </p>
          
          <div className="flex justify-center gap-6">
            <button className="px-10 py-5 bg-gradient-to-br from-[#c9a96e] to-[#9F8246] text-[#05060A] rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl shadow-[#c9a96e]/20">
              Launch Protocol <ArrowRight weight="bold" />
            </button>
            <button className="px-10 py-5 bg-transparent border border-white/10 text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:bg-white/5 transition-colors">
              View Documentation
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          
          {/* Large Feature Card */}
          <div className="col-span-2 glass-panel rounded-3xl p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a96e] rounded-full filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
            <Brain size={48} className="text-[#c9a96e] mb-6 animate-float" />
            <h3 className="text-2xl font-bold text-white mb-3">Neural Architecture</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-md">
              Deploy complex neural pipelines with simple declarative configuration. Our abstraction layer handles the tensor math while you design the logic flows.
            </p>
          </div>

          {/* Small Card 1 */}
          <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between hover:border-[#c9a96e]/30 transition-colors">
             <RocketLaunch size={32} className="text-zinc-600 mb-6" />
             <div>
                <h4 className="text-lg font-bold text-white mb-2">Hyperscale</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">Global edge caching guarantees sub-10ms response times for inference.</p>
             </div>
          </div>

          {/* Small Card 2 */}
          <div className="glass-panel rounded-3xl p-10 flex flex-col justify-between hover:border-[#c9a96e]/30 transition-colors">
             <Network size={32} className="text-zinc-600 mb-6" />
             <div>
                <h4 className="text-lg font-bold text-white mb-2">Live Nodes</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">Monitor real-time agent chains and asynchronous worker pools.</p>
             </div>
          </div>

          {/* Wide Metric Card */}
          <div className="col-span-2 glass-panel rounded-3xl p-10 flex items-center justify-between">
             <div className="max-w-xs">
                <GlobeHemisphereWest size={24} className="text-zinc-600 mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Global Routing</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">Automatically routs payloads to the nearest compute cluster with optimal GPU availability.</p>
             </div>
             <div className="flex gap-4">
               {[85, 92, 78].map((metric, i) => (
                 <div key={i} className="w-16 h-32 bg-white/5 rounded-full flex flex-col justify-end p-1 pb-1.5 border border-white/5">
                   <div 
                     className="w-full bg-gradient-to-t from-[#9F8246] to-[#c9a96e] rounded-full" 
                     style={{ height: `${metric}%` }}
                   ></div>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default PremiumShell;
