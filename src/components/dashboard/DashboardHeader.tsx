import React from 'react';
import { Users, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const DashboardHeader: React.FC<Props> = ({ onBack }) => (
  <header className="sticky top-0 z-50 glass border-b border-white/10 shadow-2xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-2xl group-hover:scale-110 transition-transform">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white leading-tight">
            पारिवारिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">डाटा पोर्टल</span>
          </h1>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Exit to Home</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-[11px] font-black text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest">
          {new Date().toLocaleDateString('hi-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all active:scale-95 sm:hidden"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  </header>
);
