import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CircleNotch, Broadcast, ChartLineUp, Users,
  LinkedinLogo, MetaLogo, TiktokLogo, XLogo,
  CheckCircle, Clock, Warning,
} from 'phosphor-react';
import { useCAPIStore, LeadSummary } from '../store/capiStore';

const CHANNEL_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  linkedin: { icon: <LinkedinLogo size={11} weight="fill" />, label: 'LI', color: 'bg-[#0a66c2]/10 text-[#0a66c2]' },
  meta:     { icon: <MetaLogo size={11} weight="fill" />,     label: 'Meta', color: 'bg-blue-50 text-blue-600' },
  tiktok:   { icon: <TiktokLogo size={11} weight="fill" />,  label: 'TT', color: 'bg-zinc-100 text-zinc-700' },
  x:        { icon: <XLogo size={11} weight="fill" />,       label: 'X', color: 'bg-zinc-900/10 text-zinc-800' },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 100) * 100);
  const color = score >= 20 ? 'bg-emerald-500' : score >= 10 ? 'bg-amber-400' : 'bg-zinc-200';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-black text-zinc-900 tabular-nums">{score}</span>
    </div>
  );
}

function ChannelBadges({ channels }: { channels: string[] | null }) {
  if (!channels?.length) return <span className="text-zinc-300 text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {channels.filter(Boolean).map((ch) => {
        const cfg = CHANNEL_CONFIG[ch];
        if (!cfg) return null;
        return (
          <span key={ch} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${cfg.color}`}>
            {cfg.icon}{cfg.label}
          </span>
        );
      })}
    </div>
  );
}

function QueueStatus({ inQueue }: { inQueue: boolean | null }) {
  if (inQueue) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
        <CheckCircle size={11} weight="fill" /> Queued
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-400 border border-zinc-100">
      <Clock size={11} /> Pending
    </span>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CAPIPipeline: React.FC = () => {
  const { leads, isLoading, fetchLeads } = useCAPIStore();

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const hotLeads   = leads.filter((l) => l.score >= 20);
  const warmLeads  = leads.filter((l) => l.score >= 10 && l.score < 20);
  const totalSignals = leads.reduce((s, l) => s + (l.total_signals ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans selection:bg-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0b] text-zinc-400 p-6 flex flex-col gap-8 shrink-0 border-r border-white/5 shadow-2xl overflow-y-auto h-screen sticky top-0">
        <div className="flex flex-col gap-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ChartLineUp size={20} weight="fill" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight leading-none">Pipeline</h1>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-1 rounded mt-1">CAPI Signal Feed</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2 px-2">Navigation</p>
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
            <ArrowLeft size={18} /> Back to Boardroom
          </Link>
          <div className="h-px bg-white/5 my-2 mx-2" />
          <Link to="/admin/leads" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold">
            <Users size={20} /> Visitor Reveals
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/5 shadow-sm">
            <ChartLineUp size={20} className="text-emerald-400" weight="fill" /> CAPI Pipeline
          </div>
        </nav>

        {/* Live stat */}
        <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Pipeline Health</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Hot leads</span>
              <span className="font-black text-emerald-400">{hotLeads.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Warming up</span>
              <span className="font-black text-amber-400">{warmLeads.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Total signals</span>
              <span className="font-black text-white">{totalSignals}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Live CAPI Feed</span>
              </div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Signal Pipeline</h2>
              <p className="text-zinc-500 font-medium mt-1">Leads scored by cross-channel CAPI events. Threshold for outreach: 20 pts.</p>
            </div>
            <button
              onClick={fetchLeads}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Broadcast size={14} /> Refresh
            </button>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Leads', value: leads.length, accent: 'text-zinc-900' },
              { label: 'Hot (≥20 pts)', value: hotLeads.length, accent: 'text-emerald-600' },
              { label: 'Warming (10–19)', value: warmLeads.length, accent: 'text-amber-500' },
              { label: 'Signals Captured', value: totalSignals, accent: 'text-blue-600' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-black tabular-nums ${accent}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Lead Scoring Feed — lead_activity_summary</h4>
              {isLoading && <CircleNotch size={14} className="animate-spin text-emerald-600" />}
            </div>

            {isLoading && leads.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-3">
                <CircleNotch size={36} className="animate-spin text-emerald-500" />
                <span className="text-zinc-400 text-sm font-bold">Loading pipeline…</span>
              </div>
            ) : leads.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-4 text-zinc-400">
                <Broadcast size={48} weight="thin" className="opacity-20" />
                <div className="text-center">
                  <p className="font-black text-xl text-zinc-900">No signals yet</p>
                  <p className="text-sm font-medium mt-1">Deploy the GTM tag and fire your first event to see leads appear here.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white">
                      {['Company / Title', 'Score', 'Channels', 'Signals', 'Campaign', 'Last Page', 'Last Seen', 'Outreach'].map((h) => (
                        <th key={h} className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {leads.map((lead: LeadSummary) => (
                      <tr key={lead.id} className="hover:bg-[#f8faff] transition-colors group">

                        {/* Company / Title */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {lead.score >= 20 && (
                              <Warning size={14} weight="fill" className="text-emerald-500 shrink-0" />
                            )}
                            <div>
                              <p className="font-bold text-zinc-900 text-sm leading-tight">{lead.company || '—'}</p>
                              <p className="text-xs text-zinc-400 font-medium mt-0.5">{lead.job_title || 'Unknown role'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="px-6 py-5">
                          <ScoreBar score={lead.score} />
                        </td>

                        {/* Channels */}
                        <td className="px-6 py-5">
                          <ChannelBadges channels={lead.channels} />
                        </td>

                        {/* Signal count */}
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-zinc-900 tabular-nums">{lead.total_signals ?? 0}</span>
                        </td>

                        {/* Campaign */}
                        <td className="px-6 py-5 max-w-[140px]">
                          {lead.campaigns?.filter(Boolean).length ? (
                            <span className="text-xs font-medium text-zinc-600 truncate block" title={lead.campaigns?.join(', ')}>
                              {lead.campaigns?.filter(Boolean)[0]}
                              {(lead.campaigns?.filter(Boolean).length ?? 0) > 1 && (
                                <span className="text-zinc-400"> +{(lead.campaigns?.filter(Boolean).length ?? 0) - 1}</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-zinc-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Last page */}
                        <td className="px-6 py-5 max-w-[160px]">
                          {lead.last_page ? (
                            <span className="text-[11px] font-mono text-zinc-500 truncate block" title={lead.last_page}>
                              {new URL(lead.last_page).pathname}
                            </span>
                          ) : (
                            <span className="text-zinc-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Last seen */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-xs font-bold text-zinc-400">{timeAgo(lead.last_seen_at)}</span>
                        </td>

                        {/* Outreach status */}
                        <td className="px-6 py-5">
                          <QueueStatus inQueue={lead.in_outreach_queue} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CAPIPipeline;
