import React from 'react';
import { Users, MapPin, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyMember } from '../types.ts';

interface Props {
  houseNo: string;
  onHouseNoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
  onOpenAdvancedFilter: () => void;
}

export const LandingPage: React.FC<Props> = ({ houseNo, onHouseNoChange, onSearch, onOpenAdvancedFilter }) => (
  <motion.div
    key="landing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4"
  >
    <div className="text-center mb-12 animate-fade-in-up">
      <div className="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/50 mb-8 border border-white/10">
        <Users size={64} />
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
        <span className="block sm:inline">परिवार डाटा पोर्टल </span>
      </h1>
      <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
        Family Records Management System
      </p>
    </div>

    <div className="w-full max-w-2xl px-4">
      <form onSubmit={onSearch} className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-40 group-focus-within:opacity-60 transition duration-500 animate-pulse" />
        <div className="relative flex p-3 bg-white/10 backdrop-blur-2xl rounded-[2.2rem] shadow-2xl border border-white/20">
          <div className="pl-6 flex items-center text-white/40">
            <MapPin size={24} />
          </div>
          <input
            type="text"
            name="मकान नम्बर"
            value={houseNo}
            onChange={onHouseNoChange}
            placeholder="मकान नम्बर दर्ज करें (उदा: 42)"
            autoFocus
            className="w-full px-6 py-6 bg-transparent text-2xl font-black text-white placeholder:text-white/20 outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 rounded-[1.8rem] font-black text-lg shadow-lg shadow-indigo-500/50 transition-all duration-300 active:scale-95 flex items-center gap-3"
          >
            <Search size={24} strokeWidth={3} />
            <span>खोजें</span>
          </button>
        </div>
      </form>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onOpenAdvancedFilter}
          className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95"
        >
          <div className="bg-indigo-500/20 p-2 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
            <Filter className="text-indigo-400" size={20} />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
            एडवांस फिल्टर (पूरा डाटा)
          </span>
        </button>
      </div>

      <div className="mt-12 flex justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Real-time Sync</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Secure Data</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Hindi UI</span>
      </div>
    </div>
  </motion.div>
);
