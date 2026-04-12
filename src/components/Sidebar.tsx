import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SquaresFour, 
  Users, 
  Activity, 
  ShieldCheck, 
  UserCircleGear, 
  Lightning,
  CaretRight
} from 'phosphor-react';

interface SidebarProps {
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { name: 'Overview', icon: SquaresFour, path: '/admin/dashboard' },
    { name: 'Leads', icon: Users, path: '/admin/leads' }, // Maps to VisitorInsights (Website)
    { name: 'Live Activity', icon: Activity, path: '/admin/activity' }, // Optional/Future
    { name: 'Signals Feed', icon: ShieldCheck, path: '/admin/pipeline' }, // Maps to CAPIPipeline
    { name: 'Job Applications', icon: UserCircleGear, path: '/admin/jobs', color: 'text-violet-500' }, 
    { name: 'Workflows & Campaigns', icon: Lightning, path: '/admin/workflows' },
  ];

  return (
    <aside className="w-72 bg-[#fcfcfd] border-r border-slate-200/60 p-8 flex flex-col gap-10 shrink-0 h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-4 px-2">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Lightning size={24} weight="fill" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
            Home <span className="text-blue-600">Base</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon 
                  size={24} 
                  weight={isActive ? "fill" : "regular"} 
                  className={!isActive && item.color ? item.color : ''}
                />
                <span className={`text-[15px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  {item.name}
                </span>
              </div>
              {isActive && <CaretRight size={14} weight="bold" className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Live Status Card */}
      <div className="mt-auto bg-slate-50 border border-slate-200/50 rounded-3xl p-6 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Live Status</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">System Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
