import React, { useEffect, useState } from 'react';
import { useProposalStore } from '../store/proposalStore';
import { Link } from 'react-router-dom';
import { FileText, Eye, CircleDashed, CircleNotch } from 'phosphor-react';

const AdminDashboard: React.FC = () => {
  const { proposals, fetchAllProposals } = useProposalStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllProposals();
      setIsLoading(false);
    };
    loadData();

    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchAllProposals, 30000);
    return () => clearInterval(interval);
  }, [fetchAllProposals]);

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans">
      {/* Sidebar Mockup */}
      <aside className="w-64 bg-zinc-900 text-zinc-300 p-6 flex flex-col gap-6 shrink-0">
        <h1 className="text-white font-bold text-xl tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">JW</div>
          Admin
        </h1>
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-white/10 text-white rounded-lg transition-all font-medium">
            <FileText weight="bold" /> Proposals
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-1">Recent Proposals</h2>
              <p className="text-zinc-500 font-medium">Manage and track your AI consulting deliverables.</p>
            </div>
            <Link 
              to="/proposal-generator" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              Create New
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Document Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Estimated Value</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-center">Views</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Live Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <CircleNotch size={32} className="animate-spin text-blue-600" />
                          <span className="text-zinc-400 font-medium">Syncing with database...</span>
                        </div>
                     </td>
                   </tr>
                ) : proposals.length > 0 ? (
                  proposals.map((p) => {
                    const isLive = p.updatedAt && (Date.now() - new Date(p.updatedAt).getTime()) < 5 * 60 * 1000;
                    
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-5 font-semibold text-zinc-900">
                          {p.title || 'Untitled Proposal'}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            p.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 
                            p.status === 'VIEWED' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-zinc-600 font-bold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.totalValue || 0)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="font-mono bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-bold">
                             {p.viewCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {isLive ? (
                            <div className="flex items-center gap-2 text-green-600 text-[11px] font-bold uppercase tracking-wider">
                               <span className="relative flex h-2 w-2">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                               </span>
                               Editing Now
                            </div>
                          ) : (
                            <div className="text-[11px] text-zinc-400 font-medium font-mono uppercase">
                               Stable
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all text-zinc-400">
                            <Link to="/proposal-generator" onClick={() => useProposalStore.getState().initializeProposal(p)} className="hover:text-blue-600 transition-colors" title="Edit">
                              <FileText size={20} />
                            </Link>
                            <Link to={`/p/${p.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors" title="View Magic Link">
                              <Eye size={20} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                           <CircleDashed size={40} weight="thin" />
                         </div>
                         <div>
                           <p className="text-zinc-900 font-bold text-lg">No proposals found</p>
                           <p className="max-w-xs mx-auto text-sm text-zinc-400">Start by creating your first client deliverable using the generator.</p>
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
