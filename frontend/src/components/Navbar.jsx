import React from 'react';
import { 
  Atom, 
  Activity, 
  LayoutDashboard, 
  UserCheck, 
  BarChart3, 
  Search, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, healthData }) {
  const isOnline = healthData?.status === 'online';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'prediction', label: 'Patient Prediction', icon: UserCheck, badge: null },
    { id: 'explainability', label: 'Explainability', icon: Search, badge: 'XAI' },
    { id: 'benchmarks', label: 'Model Comparison', icon: TrendingUp, badge: null },
    { id: 'quantum', label: 'Quantum Analysis', icon: Atom, badge: '4-Qubit' },
    { id: 'dataset', label: 'Dataset Analysis', icon: BarChart3, badge: '615' },
    { id: 'history', label: 'Audit History', icon: History, badge: null },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-indigo-500/20 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-blue-500 p-[1.5px] shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-[#0c1033] rounded-[10px] flex items-center justify-center">
              <Atom className="w-6 h-6 text-indigo-400 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060818] animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-blue-300">
                QUANTARA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-purple-950/90 text-indigo-300 border border-indigo-600/50 shadow-sm shadow-indigo-950/60">
                v2.0 QML
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 font-medium">
              Hybrid Quantum-Classical Disease Detection & Explainability
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 via-violet-600/25 to-blue-600/20 text-indigo-100 border border-indigo-500/60 shadow-sm shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-indigo-200 hover:bg-purple-950/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                    item.badge === 'Core Demo' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/50'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 rounded-full shadow-sm shadow-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Health Indicator */}
        <div className="hidden xl:flex items-center gap-3 pl-2 border-l border-indigo-900/50">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-purple-950/70 border border-indigo-800/60 text-xs shadow-inner">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
            <span className="text-indigo-200 font-mono text-[11px]">
              {isOnline ? 'Quantum Sim Online' : 'Backend Offline'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}


