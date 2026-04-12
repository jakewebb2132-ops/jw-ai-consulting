import React, { useEffect, useState, useMemo } from 'react';
import { useProposalStore } from '../store/proposalStore';
import { useInteractionStore } from '../store/interactionStore';
import { useSignalStore } from '../store/signalStore';
import { useVisitorStore } from '../store/visitorStore';
import { Link } from 'react-router-dom';
import { FileText, Eye, CircleNotch, Briefcase, ChartLineUp, Users, PresentationChart, ChatCenteredDots, Sword, Handshake, ClockCounterClockwise, ShieldCheck, LinkedinLogo, MagnifyingGlass, Broadcast, Funnel, CheckCircle } from 'phosphor-react';
import { Proposal } from '../types/proposal';

const AdminDashboard: React.FC = () => {
  const { proposals, fetchAllProposals } = useProposalStore();
  const { interactions, fetchInteractions, isLoading: isInteractionsLoading } = useInteractionStore();
  const { signals, fetchSignals } = useSignalStore();
  const { leads, fetchLeads } = useVisitorStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAllProposals(), 
        fetchInteractions(),
        fetchSignals(),
        fetchLeads()
      ]);
      setIsLoading(false);
    };
    loadData();

    // Refresh every 30 seconds for live updates
    const interval = setInterval(() => {
      fetchAllProposals();
      fetchInteractions();
      fetchSignals();
      fetchLeads();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAllProposals, fetchInteractions, fetchSignals, fetchLeads]);

  const stats = useMemo(() => {
    const totalValue = proposals.reduce((sum: number, p: Proposal) => sum + (p.totalValue || 0), 0);
    const activeViewers = proposals.filter((p: Proposal) => (p.viewCount || 0) > 0).length;
    const acceptedCount = proposals.filter((p: Proposal) => p.status === 'ACCEPTED').length;
    
    return {
      totalValue,
      activeViewers,
      acceptedCount,
      totalCount: proposals.length,
      interactionCount: interactions.length,
      signalCount: signals.length,
      revealCount: leads.length
    };
  }, [proposals, interactions, signals, leads]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans selection:bg-blue-100">
      {/* Sidebar - Boardroom Branding */}
      <aside className="w-64 bg-[#0a0a0b] text-zinc-400 p-6 flex flex-col gap-8 shrink-0 border-r border-white/5 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <PresentationChart size={20} weight="fill" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight leading-none">Boardroom</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-1 rounded mt-1">Executive</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2 px-2">Main Menu</p>
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
            <Briefcase weight="fill" /> Documents
          </Link>
          <Link to="/admin/leads" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl transition-all font-semibold shadow-sm border border-white/5">
            <ShieldCheck weight="fill" className="text-blue-400" /> Sales Intelligence
          </Link>
          <Link to="/admin/pipeline" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
            <Funnel weight="fill" className="text-emerald-400" size={20} /> CAPI Pipeline
          </Link>
          <Link to="/admin/council" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold break-words">
            <Users size={20} /> The Council
          </Link>
          <Link to="/admin/jobs" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
            <Briefcase size={20} className="text-violet-400" /> Job Applications
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Live Strategic Overview</span>
              </div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Executive Boardroom</h2>
              <p className="text-zinc-500 font-medium mt-1">Secure management of AI consulting implementations and deliverables.</p>
            </div>
            <Link 
              to="/proposal-generator" 
              className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-xl shadow-zinc-200 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"
            >
              Draft New Strategy
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ChartLineUp size={24} weight="bold" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Revenue</span>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pipeline</p>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.totalValue)}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-zinc-50 text-zinc-600 rounded-lg">
                  <FileText size={24} weight="bold" />
                </div>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Strategies</p>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{stats.totalCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-[#0a66c2]/10 text-[#0a66c2] rounded-lg">
                  <LinkedinLogo size={24} weight="fill" />
                </div>
                <span className="text-[9px] font-bold text-[#0a66c2] animate-pulse">Live</span>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">LI Signals</p>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{stats.signalCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <MagnifyingGlass size={24} weight="bold" />
                </div>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Site Reveals</p>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{stats.revealCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Broadcast size={24} weight="bold" />
                </div>
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Consults</p>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{stats.interactionCount}</h3>
            </div>
          </div>

          {/* Strategic Consultation Feed */}
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden mb-12">
            <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <ClockCounterClockwise size={16} weight="bold" className="text-zinc-400" />
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Boardroom Strategic Consultation Feed</h4>
              </div>
              {isInteractionsLoading && <CircleNotch size={14} className="animate-spin text-indigo-600" />}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Timestamp</th>
                    <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Strategic Challenge (Question)</th>
                    <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Mode</th>
                    <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right border-b border-zinc-100">Advisory Board</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {interactions.length > 0 ? (
                    interactions.map((it) => (
                      <tr key={it.id} className="hover:bg-[#f8faff] transition-colors group">
                        <td className="px-8 py-6 text-[11px] font-bold text-zinc-400 font-mono">
                          {new Date(it.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-zinc-900 font-bold text-sm line-clamp-1">{it.question}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             {it.mode === 'debate' ? (
                               <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                                 <Sword size={10} weight="fill" /> Debate
                               </span>
                             ) : (
                               <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                 <Handshake size={10} weight="fill" /> Consensus
                               </span>
                             )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end -space-x-2">
                              {it.advisors.map(adv => (
                                <div key={adv} className="w-6 h-6 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-zinc-500 uppercase" title={adv}>
                                  {adv.charAt(0)}
                                </div>
                              ))}
                              <span className="ml-3 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                                {it.advisors.length} Members
                              </span>
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-zinc-400">
                         <div className="flex flex-col items-center gap-2">
                            <ChatCenteredDots size={32} weight="thin" className="opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No recent strategic activity</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Table */}
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Strategic Document Real-time Feed</h4>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Document Identification</th>
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Account / Client</th>
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Board Status</th>
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Financial Impact</th>
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center border-b border-zinc-100">Engagement</th>
                  <th className="px-8 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right border-b border-zinc-100">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                           <CircleNotch size={40} className="animate-spin text-blue-600" />
                           <span className="text-zinc-900 font-bold tracking-tight">Synchronizing Boardroom Data...</span>
                        </div>
                     </td>
                   </tr>
                ) : proposals.length > 0 ? (
                  proposals.map((p) => {
                    return (
                      <tr key={p.id} className="hover:bg-[#f8faff] transition-colors group">
                        <td className="px-8 py-6 font-bold text-zinc-900">
                          {p.title || 'Untitled Strategic Document'}
                        </td>
                        <td className="px-8 py-6 text-zinc-600 font-semibold">
                          {p.companyName || 'Untitled Account'}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm ${
                            p.status === 'ACCEPTED' ? 'bg-emerald-500 text-white' : 
                            p.status === 'VIEWED' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-zinc-900 font-black">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.totalValue || 0)}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-zinc-900 font-black text-sm">
                              {p.viewCount || 0}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Views</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-4 opacity-50 group-hover:opacity-100 transition-all">
                            <Link 
                              to="/proposal-generator" 
                              onClick={() => useProposalStore.getState().initializeProposal(p)} 
                              className="px-4 py-2 bg-zinc-900 hover:bg-blue-600 text-white text-[11px] font-black rounded-lg transition-all shadow-lg active:scale-95"
                            >
                              Update Document
                            </Link>
                            <Link 
                              to={`/p/${p.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 text-zinc-400 hover:text-blue-600 transition-colors bg-zinc-100 rounded-lg" 
                              title="Executive Review Link"
                            >
                              <Eye size={20} weight="bold" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-4">
                         <div className="w-20 h-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center text-zinc-200 border-4 border-white shadow-inner">
                           <Briefcase size={48} weight="thin" />
                         </div>
                         <div className="max-w-xs mx-auto">
                           <p className="text-zinc-900 font-black text-xl tracking-tight">Boardroom Empty</p>
                           <p className="text-sm text-zinc-400 font-medium mt-1">Start by drafting your first executive AI delivery strategy using the generator.</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
