import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  WarningCircle,
  XCircle,
  SkipForward,
  Copy,
  LinkedinLogo,
  ArrowSquareOut,
  CircleNotch,
  Funnel,
  MagnifyingGlass,
  CalendarBlank,
  Buildings,
  MapPin,
  Robot,
  Clock,
} from 'phosphor-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'submitted' | 'needs_manual_review' | 'error' | 'skipped_duplicate' | 'skipped_irrelevant';
type ApplyType = 'easy_apply' | 'external_ats';

interface JobApplication {
  job_id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  apply_type: ApplyType;
  ats: string | null;
  status: JobStatus;
  reason: string | null;
  applied_date: string;
  logged_at: string;
}

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<JobStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  dot: string;
}> = {
  submitted: {
    label: 'Submitted',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <CheckCircle size={13} weight="fill" />,
  },
  needs_manual_review: {
    label: 'Manual Review',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    icon: <WarningCircle size={13} weight="fill" />,
  },
  error: {
    label: 'Error',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    icon: <XCircle size={13} weight="fill" />,
  },
  skipped_duplicate: {
    label: 'Duplicate',
    color: 'text-zinc-500',
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    dot: 'bg-zinc-400',
    icon: <Copy size={13} weight="fill" />,
  },
  skipped_irrelevant: {
    label: 'Irrelevant',
    color: 'text-zinc-500',
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    dot: 'bg-zinc-300',
    icon: <SkipForward size={13} weight="fill" />,
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Apply Type Badge ─────────────────────────────────────────────────────────

const ApplyTypeBadge: React.FC<{ type: ApplyType; ats?: string | null }> = ({ type, ats }) => {
  if (type === 'easy_apply') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20">
        <LinkedinLogo size={9} weight="fill" /> Easy Apply
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
      <Robot size={9} weight="fill" /> {ats || 'External ATS'}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-3xl font-black text-zinc-900 tracking-tight tabular-nums">{value}</h3>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

import Sidebar from '../components/Sidebar';

const JobApplications: React.FC = () => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/data/applied-jobs.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(data.applied_jobs ?? []);
      setLastRefreshed(new Date());
    } catch (e) {
      setError('Could not load applied-jobs.json — check public/data/ path.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 60_000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    submitted: jobs.filter(j => j.status === 'submitted').length,
    needs_manual_review: jobs.filter(j => j.status === 'needs_manual_review').length,
    error: jobs.filter(j => j.status === 'error').length,
    skipped: jobs.filter(j => j.status === 'skipped_duplicate' || j.status === 'skipped_irrelevant').length,
    total: jobs.length,
  }), [jobs]);

  // ─── Filtered list ─────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
      const q = search.toLowerCase();
      const matchesSearch = !q || [j.title, j.company, j.location, j.ats ?? '']
        .some(f => f.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [jobs, filterStatus, search]);

  // ─── Group by date ─────────────────────────────────────────────────────────

  const groupedByDate = useMemo(() => {
    const groups: Record<string, JobApplication[]> = {};
    for (const job of filtered) {
      if (!groups[job.applied_date]) groups[job.applied_date] = [];
      groups[job.applied_date].push(job);
    }
    // Sort dates descending
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const statusFilters: Array<{ value: JobStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'needs_manual_review', label: 'Manual Review' },
    { value: 'error', label: 'Errors' },
    { value: 'skipped_duplicate', label: 'Duplicate' },
    { value: 'skipped_irrelevant', label: 'Irrelevant' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans selection:bg-blue-100 uppercase-badges">
      <Sidebar />

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest">AI-Powered Job Agent</span>
              </div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Job Applications</h2>
              <p className="text-zinc-500 font-medium mt-1">Automated GTM & Enterprise Sales applications tracked in real-time.</p>
            </div>
            <button
              onClick={loadJobs}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-violet-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <CircleNotch size={16} className="animate-spin" /> : <Robot size={16} weight="fill" />}
              {isLoading ? 'Syncing…' : 'Refresh'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Submitted" value={stats.submitted} icon={<CheckCircle size={20} weight="fill" />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="Manual Review" value={stats.needs_manual_review} icon={<WarningCircle size={20} weight="fill" />} color="text-amber-600" bg="bg-amber-50" />
            <StatCard label="Errors" value={stats.error} icon={<XCircle size={20} weight="fill" />} color="text-rose-600" bg="bg-rose-50" />
            <StatCard label="Skipped" value={stats.skipped} icon={<SkipForward size={20} weight="fill" />} color="text-zinc-500" bg="bg-zinc-100" />
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 relative">
              <MagnifyingGlass size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="job-search"
                type="text"
                placeholder="Search by title, company, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 shadow-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-400 shadow-sm select-none">
              <Funnel size={14} />
              {filtered.length} of {stats.total}
            </div>
          </div>

          {/* Content */}
          {error && (
            <div className="py-16 text-center bg-rose-50 rounded-3xl border border-rose-200">
              <XCircle size={40} className="mx-auto text-rose-400 mb-3" weight="thin" />
              <p className="font-black text-rose-700">{error}</p>
              <p className="text-xs text-rose-500 mt-1">Make sure <code>public/data/applied-jobs.json</code> exists.</p>
            </div>
          )}

          {isLoading && !error && (
            <div className="py-20 flex flex-col items-center gap-4 text-zinc-400">
              <CircleNotch size={40} className="animate-spin text-violet-500" />
              <p className="font-bold text-sm uppercase tracking-widest">Loading application logs…</p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="py-20 text-center text-zinc-400 bg-white rounded-3xl border border-dashed border-zinc-200">
              <div className="flex flex-col items-center gap-4">
                <Briefcase size={48} weight="thin" className="opacity-20" />
                <div>
                  <p className="text-zinc-900 font-black text-xl tracking-tight">No applications found</p>
                  <p className="text-sm font-medium mt-1">
                    {search || filterStatus !== 'all'
                      ? 'Try clearing your filters.'
                      : 'The agent hasn\'t run yet — applications will appear here automatically.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && groupedByDate.length > 0 && (
            <div className="space-y-10">
              {groupedByDate.map(([date, dateJobs]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <CalendarBlank size={14} weight="bold" />
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-zinc-200" />
                    <span className="text-[10px] font-black text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {dateJobs.length} job{dateJobs.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Table */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/80">
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Role</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Company</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Location</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Method</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 text-right">Time</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 text-right">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {dateJobs.map(job => (
                          <tr key={job.job_id} className="group hover:bg-violet-50/40 transition-colors">
                            <td className="px-6 py-5">
                              <p className="font-bold text-zinc-900 text-sm leading-tight group-hover:text-violet-700 transition-colors">{job.title}</p>
                              {job.reason && (
                                <p className="text-[10px] text-zinc-400 font-medium mt-1 line-clamp-1 italic">{job.reason}</p>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <Buildings size={13} className="text-zinc-300 shrink-0" />
                                <span className="text-sm font-semibold text-zinc-700">{job.company}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-zinc-300 shrink-0" />
                                <span className="text-[12px] text-zinc-500 font-medium">{job.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <ApplyTypeBadge type={job.apply_type} ats={job.ats} />
                            </td>
                            <td className="px-6 py-5">
                              <StatusBadge status={job.status} />
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className="text-[11px] font-mono text-zinc-400">
                                {new Date(job.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              {job.url ? (
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-[#0a66c2] hover:text-white text-zinc-500 text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  <ArrowSquareOut size={11} />
                                  View
                                </a>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobApplications;
