import React from 'react';
import { Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GENDERS, LITERACY_STATUS, OCCUPATIONS, RELIGIONS, CASTES } from '../../constants.ts';

type Filters = {
  search: string;
  gender: string;
  literacy: string;
  religion: string;
  caste: string;
  occupation: string;
  minAge: number;
  maxAge: number;
};

interface Props {
  isOpen: boolean;
  filters: Filters;
  filteredCount: number;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
  onClose: () => void;
}

export const SimpleFilterModal: React.FC<Props> = ({ isOpen, filters, filteredCount, onFilterChange, onReset, onClose }) => {
  const set = (key: keyof Filters, value: any) => onFilterChange({ ...filters, [key]: value });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#020617] rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white">डाटा फिल्टर</h2>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">अपनी खोज को सीमित करें</p>
              </div>
              <div className="flex gap-4">
                <button onClick={onReset} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                  साफ़ करें
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/40 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">नाम से खोजें</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => set('search', e.target.value)}
                      placeholder="सदस्य का नाम..."
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">लिंग</label>
                  <select value={filters.gender} onChange={(e) => set('gender', e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 outline-none">
                    <option value="सभी">सभी लिंग</option>
                    {GENDERS.map(g => <option key={g} value={g} className="bg-[#020617]">{g}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">साक्षरता स्थिति</label>
                  <select value={filters.literacy} onChange={(e) => set('literacy', e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 outline-none">
                    <option value="सभी">सभी</option>
                    {LITERACY_STATUS.map(s => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">व्यवसाय</label>
                  <select value={filters.occupation} onChange={(e) => set('occupation', e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 outline-none">
                    <option value="सभी">सभी व्यवसाय</option>
                    {OCCUPATIONS.map(o => <option key={o} value={o} className="bg-[#020617]">{o}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">धर्म</label>
                  <select value={filters.religion} onChange={(e) => set('religion', e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 outline-none">
                    <option value="सभी">सभी धर्म</option>
                    {RELIGIONS.map(r => <option key={r} value={r} className="bg-[#020617]">{r}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">जाति</label>
                  <select value={filters.caste} onChange={(e) => set('caste', e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white/10 outline-none">
                    <option value="सभी">सभी जातियां</option>
                    {CASTES.map(c => <option key={c} value={c} className="bg-[#020617]">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">आयु सीमा: {filters.minAge} - {filters.maxAge} वर्ष</label>
                  <button onClick={() => onFilterChange({ ...filters, minAge: 0, maxAge: 100 })} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    Reset Age
                  </button>
                </div>
                <div className="flex gap-4">
                  <input type="range" min="0" max="100" value={filters.minAge} onChange={(e) => set('minAge', parseInt(e.target.value))} className="flex-1 accent-indigo-500" />
                  <input type="range" min="0" max="100" value={filters.maxAge} onChange={(e) => set('maxAge', parseInt(e.target.value))} className="flex-1 accent-indigo-500" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10">
              <button onClick={onClose} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                परिणाम दिखाएं ({filteredCount} सदस्य)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
