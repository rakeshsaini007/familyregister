import React from 'react';
import { Users, FileDown, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import { RATION_CARD_TYPES, RELIGIONS, CASTES } from '../../constants.ts';

interface Props {
  familyMembers: FamilyMember[];
  loading: boolean;
  onEdit: () => void;
  onDownload: () => void;
  onQuickUpdate: (member: FamilyMember, field: keyof FamilyMember, value: string) => void;
}

export const FamilySummaryCard: React.FC<Props> = ({ familyMembers, loading, onEdit, onDownload, onQuickUpdate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden glass rounded-[2.5rem] p-10 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div className="flex items-center gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl text-white shadow-xl">
          <Users size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-widest text-white/90">परिवार मुख्य विवरण</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
            <p className="text-sm font-bold text-indigo-400 font-mono tracking-widest">मकान नम्बर: {familyMembers[0]['मकान नम्बर']}</p>
            <p className="text-sm font-bold text-purple-400 font-mono tracking-widest">फैमिली ID: {familyMembers[0]['फैमिली ID']}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownload}
          disabled={loading}
          className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-indigo-600 border border-indigo-400/20 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          <FileDown size={18} />
          <span>परिवार रजिस्टर की नकल डाउनलोड करें</span>
        </button>
        <button
          onClick={onEdit}
          className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-black uppercase tracking-widest shadow-xl hover:bg-white/10 transition-all flex items-center gap-3"
        >
          <Edit2 size={18} />
          <span>संपादित करें</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/10">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">प्रमुख का नाम</p>
        <p className="text-xl font-black text-white">{familyMembers[0]['परिवार के प्रमुख का नाम']}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">राशन कार्ड संख्या</p>
        <p className="text-xl font-black text-white font-mono">{familyMembers[0]['राशन कार्ड संख्या']}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">राशन कार्ड प्रकार</p>
        <select
          value={familyMembers[0]['राशन कार्ड का प्रकार']}
          onChange={(e) => onQuickUpdate(familyMembers[0], 'राशन कार्ड का प्रकार', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:bg-white/10 outline-none transition-all cursor-pointer"
        >
          {RATION_CARD_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">धर्म</p>
        <select
          value={familyMembers[0]['धर्म']}
          onChange={(e) => onQuickUpdate(familyMembers[0], 'धर्म', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:bg-white/10 outline-none transition-all cursor-pointer"
        >
          {RELIGIONS.map(r => <option key={r} value={r} className="bg-[#020617] text-white">{r}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">जाति</p>
        <select
          value={familyMembers[0]['जाति']}
          onChange={(e) => onQuickUpdate(familyMembers[0], 'जाति', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:bg-white/10 outline-none transition-all cursor-pointer"
        >
          {CASTES.map(c => <option key={c} value={c} className="bg-[#020617] text-white">{c}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">कुल सदस्य</p>
        <p className="text-xl font-black text-indigo-400">{familyMembers.length}</p>
      </div>
    </div>
  </motion.div>
);
