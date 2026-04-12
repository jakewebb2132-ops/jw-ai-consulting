import React, { useEffect, useState } from 'react';
import { useVisitorStore } from '../store/visitorStore';
import { useSignalStore } from '../store/signalStore';
import { Link } from 'react-router-dom';
import { Users, ArrowSquareOut, Activity, ArrowUpRight, Shield, Globe, LinkedinLogo, Eye, ChartLineUp, Broadcast, ArrowLeft, Clock, Briefcase } from 'phosphor-react';
import { supabase } from '../lib/supabase';

const SalesIntelligence = () => {
    const { leads, fetchLeads, subscribeToLeads, isLoading: leadsLoading } = useVisitorStore();
    const { signals, fetchSignals, subscribeToSignals, isLoading: signalsLoading } = useSignalStore();
    const [activeTab, setActiveTab] = useState<'website' | 'linkedin'>('website');

    useEffect(() => {
        fetchLeads();
        fetchSignals();
        
        const unsubscribeLeads = subscribeToLeads();
        const unsubscribeSignals = subscribeToSignals();

        return () => {
            unsubscribeLeads();
            unsubscribeSignals();
        };
    }, [fetchLeads, fetchSignals, subscribeToLeads, subscribeToSignals]);

    return (
        <div className="min-h-screen bg-[#fcfcfd] flex font-sans selection:bg-blue-100">
            {/* Sidebar - Consistent with Admin */}
            <aside className="w-64 bg-[#0a0a0b] text-zinc-400 p-6 flex flex-col gap-8 shrink-0 border-r border-white/5 shadow-2xl overflow-y-auto h-screen sticky top-0">
                <div className="flex flex-col gap-1">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Shield size={20} weight="fill" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg tracking-tight leading-none">Intelligence</h1>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-1 rounded mt-1">Executive Reveal</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2 px-2">Navigation</p>
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
                        <ArrowLeft size={18} /> Back to Boardroom
                    </Link>
                    <div className="h-px bg-white/5 my-2 mx-2"></div>
                    <button 
                        onClick={() => setActiveTab('website')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'website' ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Globe size={20} weight={activeTab === 'website' ? "fill" : "regular"} className={activeTab === 'website' ? "text-blue-400" : ""} /> Website Reveals
                    </button>
                    <button 
                        onClick={() => setActiveTab('linkedin')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'linkedin' ? 'bg-white/5 text-white border border-white/5 shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <LinkedinLogo size={20} weight={activeTab === 'linkedin' ? "fill" : "regular"} className={activeTab === 'linkedin' ? "text-[#0a66c2]" : ""} /> LinkedIn Signals
                    </button>
                    <div className="h-px bg-white/5 my-2 mx-2"></div>
                    <Link to="/admin/jobs" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
                        <Briefcase size={20} className="text-violet-400" /> Job Applications
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Live Audience Intelligence</span>
                            </div>
                            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
                                {activeTab === 'website' ? 'Executive Reveal' : 'LinkedIn Command'}
                            </h2>
                            <p className="text-zinc-500 font-medium mt-1">
                                {activeTab === 'website' 
                                    ? 'De-anonymized B2B traffic tracked in real-time.' 
                                    : 'Live monitoring of LinkedIn profile views and engagement.'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-6 py-4 rounded-2xl border border-zinc-200 shadow-sm">
                                <div className="text-2xl font-black text-zinc-900">
                                    {activeTab === 'website' ? leads.length : signals.length}
                                </div>
                                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                    {activeTab === 'website' ? 'Total Reveals' : 'Active signals'}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leadsLoading || signalsLoading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 rounded-3xl bg-white border border-zinc-200 animate-pulse shadow-sm" />
                            ))
                        ) : activeTab === 'website' ? (
                            leads.map((lead) => (
                                <div key={lead.id} className="group relative p-8 rounded-3xl bg-white border border-zinc-200 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                            {lead.profile_image_url ? (
                                                <img src={lead.profile_image_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                                            ) : (
                                                <Users size={24} className="text-zinc-400" />
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${lead.intent_score > 50 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {lead.intent_score > 50 ? 'Hot Lead' : 'Identified'}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors">{lead.full_name}</h3>
                                        <p className="text-zinc-500 text-sm font-medium">{lead.job_title} <span className="text-zinc-400">at</span> {lead.company_name}</p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-xs text-zinc-400 font-bold uppercase tracking-tight">
                                            <Globe size={16} />
                                            <span>{lead.company_domain || lead.ip_address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-zinc-400 font-bold uppercase tracking-tight">
                                            <Activity size={16} />
                                            <span>{lead.visit_count} views • Score: {lead.intent_score}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {lead.linkedin_url ? (
                                            <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 rounded-xl bg-[#0a66c2] text-white text-[11px] font-black text-center hover:bg-[#004182] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0a66c2]/20">
                                                LinkedIn Profile <ArrowSquareOut className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <button className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 text-zinc-400 text-[11px] font-black cursor-not-allowed">
                                                Profile Unmatched
                                            </button>
                                        )}
                                        <button className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                                            <ArrowUpRight size={18} className="text-zinc-900" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            signals.map((signal) => (
                                <div key={signal.id} className="group relative p-8 rounded-3xl bg-white border border-zinc-200 hover:border-[#0a66c2]/30 hover:shadow-xl hover:shadow-[#0a66c2]/5 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                                            {signal.person_image ? (
                                                <img src={signal.person_image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <LinkedinLogo size={24} weight="fill" className="text-[#0a66c2]" />
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${signal.type === 'profile_view' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                            {signal.type === 'profile_view' ? 'Profile View' : 'Interaction'}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-zinc-900 mb-1 group-hover:text-[#0a66c2] transition-colors">{signal.person_name}</h3>
                                        <p className="text-zinc-500 text-sm font-medium">{signal.person_title} <span className="text-zinc-400">at</span> {signal.person_company}</p>
                                    </div>

                                    <div className="mb-8 p-3 bg-zinc-50 rounded-xl border border-zinc-100 min-h-[60px]">
                                        <p className="text-[11px] text-zinc-500 leading-relaxed italic line-clamp-2">
                                            "{signal.interaction_text || 'Viewed your profile in Stealth Mode'}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-bold uppercase tracking-tight mb-8">
                                        <Clock size={16} />
                                        <span>{new Date(signal.timestamp).toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <a href={signal.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 rounded-xl bg-[#0a66c2] text-white text-[11px] font-black text-center hover:bg-[#004182] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0a66c2]/20">
                                            View Target Profile <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {((activeTab === 'website' && leads.length === 0) || (activeTab === 'linkedin' && signals.length === 0)) && !leadsLoading && !signalsLoading && (
                        <div className="py-20 text-center text-zinc-400 bg-white rounded-3xl border border-dashed border-zinc-200">
                            <div className="flex flex-col items-center gap-4">
                                <Broadcast size={48} weight="thin" className="opacity-20" />
                                <div>
                                    <p className="text-zinc-900 font-black text-xl tracking-tight">No signals detected yet</p>
                                    <p className="text-sm font-medium mt-1">Live tracking is active. Signals will appear here as they are captured.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SalesIntelligence;
