import React from 'react';
import { Plus, Search, MapPin, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import { MemberCard } from './MemberCard.tsx';

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
  familyMembers: FamilyMember[];
  filteredMembers: FamilyMember[];
  filters: Filters;
  activeFilterCount: number;
  fetching: boolean;
  houseNoEntered: boolean;
  onAddMember: () => void;
  onAddFamily: () => void;
  onEditMember: (member: FamilyMember) => void;
  onDeleteMember: (e: React.MouseEvent, member: FamilyMember) => void;
  onRemoveFilter: (key: string) => void;
  onResetFilters: () => void;
}

const FILTER_LABELS: Record<string, string> = {
  search: 'खोज',
  gender: 'लिंग',
  literacy: 'साक्षरता',
  religion: 'धर्म',
  caste: 'जाति',
  occupation: 'व्यवसाय',
  minAge: 'आयु',
};

export const MemberListSection: React.FC<Props> = ({
  familyMembers,
  filteredMembers,
  filters,
  activeFilterCount,
  fetching,
  houseNoEntered,
  onAddMember,
  onAddFamily,
  onEditMember,
  onDeleteMember,
  onRemoveFilter,
  onResetFilters,
}) => (
  <div className="space-y-8">
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h3 className="text-2xl font-black text-white flex items-center gap-4">
          <span className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full" />
          सदस्य सूची
        </h3>
        {familyMembers.length > 0 && (
          <button
            onClick={onAddMember}
            className="group flex items-center gap-3 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 border border-indigo-400/20"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">नया सदस्य जोड़ें</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 px-2"
          >
            {Object.entries(filters).map(([key, val]) => {
              if (val === '' || val === 'सभी') return null;
              if (key === 'minAge' && val === 0) return null;
              if (key === 'maxAge' && val === 100) return null;

              let displayVal: any = val;
              if (key === 'minAge') {
                displayVal = `Age: ${filters.minAge}-${filters.maxAge}`;
              }
              if (key === 'maxAge') return null;

              return (
                <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400">
                  <span className="opacity-50 uppercase tracking-tighter">{FILTER_LABELS[key]}:</span>
                  <span>{displayVal}</span>
                  <button onClick={() => onRemoveFilter(key)} className="hover:text-white transition-colors">
                    <Plus size={12} className="rotate-45" />
                  </button>
                </div>
              );
            })}
            <button onClick={onResetFilters} className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white/40 transition-all ml-2">
              साफ़ करें
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {!houseNoEntered ? (
      <div className="glass rounded-[2rem] p-20 text-center border-dashed border-white/10 opacity-40">
        <MapPin size={80} className="mx-auto mb-6 opacity-10" />
        <p className="font-black uppercase tracking-[0.3em] text-white/40">खोज प्रारंभ करें</p>
      </div>
    ) : fetching ? (
      <div className="glass rounded-[2rem] p-20 text-center">
        <Search size={80} className="mx-auto mb-6 animate-pulse opacity-20 text-indigo-400" />
        <p className="font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">प्रोसेसिंग...</p>
      </div>
    ) : familyMembers.length === 0 ? (
      <div className="glass rounded-[2.5rem] p-20 text-center border-dashed border-white/10">
        <UserMinus size={80} className="mx-auto mb-6 opacity-20" />
        <p className="font-black uppercase tracking-widest text-white/40">कोई रिकॉर्ड उपलब्ध नहीं है</p>
        <button
          onClick={onAddFamily}
          className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10 transition-all"
        >
          नया परिवार जोड़ें
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredMembers.map((member, idx) => (
          <MemberCard
            key={idx}
            member={member}
            index={idx}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
          />
        ))}
      </div>
    )}
  </div>
);
