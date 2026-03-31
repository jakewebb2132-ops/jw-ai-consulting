import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, ExternalLink, Activity, ArrowUpRight, Shield, Globe } from 'lucide-react';

interface VisitorLead {
    id: string;
    visitor_id: string;
    full_name: string;
    job_title: string;
    company_name: string;
    linkedin_url: string;
    ip_address: string;
    last_page_viewed: string;
    visit_count: number;
    intent_score: number;
    last_seen: string;
}

const VisitorInsights = () => {
    const [leads, setLeads] = useState<VisitorLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('visitor_leads_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'visitor_leads' }, () => {
                fetchLeads();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchLeads = async () => {
        const { data, error } = await supabase
            .from('visitor_leads')
            .select('*')
            .order('last_seen', { ascending: false });

        if (!error && data) {
            setLeads(data);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#c9a96e]/10 rounded-lg">
                                <Shield className="w-5 h-5 text-[#c9a96e]" />
                            </div>
                            <span className="text-xs font-bold tracking-[0.2em] text-[#c9a96e] uppercase">Identity Resolution</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">Executive <span className="text-[#c9a96e] italic">Reveal</span></h1>
                        <p className="text-zinc-400 mt-4 max-w-xl font-light leading-relaxed">De-anonymized B2B leads detected in real-time. Identify who is browsing your site before they ever fill out a form.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-4 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                            <div className="text-2xl font-light text-white">{leads.length}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Total Reveals</div>
                        </div>
                        <div className="px-6 py-4 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                            <div className="text-2xl font-light text-[#c9a96e]">{leads.filter(l => l.intent_score > 50).length}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">High Intent</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-3xl bg-zinc-900/30 border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        leads.map((lead) => (
                            <div key={lead.id} className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl hover:border-[#c9a96e]/30 transition-all duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${lead.intent_score > 50 ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {lead.intent_score > 50 ? 'Hot Lead' : 'Identified'}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-light text-white mb-1 group-hover:text-[#c9a96e] transition-colors">{lead.full_name}</h3>
                                    <p className="text-zinc-400 text-sm font-light">{lead.job_title} at <span className="text-white font-normal">{lead.company_name}</span></p>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>{lead.ip_address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>Visited {lead.visit_count} times • Score: {lead.intent_score}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {lead.linkedin_url ? (
                                        <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 rounded-xl bg-[#c9a96e] text-black text-xs font-bold text-center hover:bg-white transition-all flex items-center justify-center gap-2">
                                            LinkedIn Profile <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <button className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold cursor-not-allowed">
                                            Profile Unmatched
                                        </button>
                                    )}
                                    <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <ArrowUpRight className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorInsights;
