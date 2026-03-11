import React, { useEffect, useState } from 'react';
import { useProposalStore } from '../store/proposalStore';
import { Link } from 'react-router-dom';
import { FileText, Eye, CircleDashed } from 'phosphor-react';

const AdminDashboard: React.FC = () => {
  const { proposal } = useProposalStore();
  const [telemetry, setTelemetry] = useState<{ lastViewedAt: string; status: string } | null>(null);

  // Poll for live activity every 30 seconds
  useEffect(() => {
    if (!proposal?.id) return;

    const fetchTelemetry = async () => {
      try {
        const response = await fetch(`/api/proposals?id=${proposal.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.telemetry) {
            setTelemetry(data.telemetry);
          }
        }
      } catch (error) {
        console.error('Failed to fetch telemetry:', error);
      }
    };

    // Initial fetch
    fetchTelemetry();

    // 30 seconds polling interval
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, [proposal?.id]);

  // Determine if 'Live Activity' is happening (within last 5 minutes)
  const isLive = telemetry?.lastViewedAt 
    ? (Date.now() - new Date(telemetry.lastViewedAt).getTime()) < 5 * 60 * 1000 
    : false;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar Mockup */}
      <aside className="w-64 bg-zinc-900 text-zinc-300 p-6 flex flex-col gap-6">
        <h1 className="text-white font-bold text-lg tracking-tight">JW Admin</h1>
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-white rounded-md">
            <FileText /> Proposals
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Recent Proposals</h2>
          <Link 
            to="/proposal-generator" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Create New
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Document Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Live Activity</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase line-clamp-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {/* For this demo, map the single Zustand proposal we have */}
              {proposal ? (
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {proposal.title || 'Untitled Proposal'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {telemetry?.status || proposal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalValue)}
                  </td>
                  <td className="px-6 py-4">
                    {isLive ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                         <span className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                         </span>
                         Viewing now
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-400">
                        {telemetry?.lastViewedAt 
                          ? new Date(telemetry.lastViewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Not viewed yet'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Link to="/proposal-generator" className="text-zinc-400 hover:text-blue-600 transition-colors" title="Edit text">
                      <FileText size={20} />
                    </Link>
                    <Link to={`/p/${proposal.id}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-600 transition-colors" title="View Magic Link">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <CircleDashed size={32} className="text-zinc-300" />
                       No proposals drafted yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
