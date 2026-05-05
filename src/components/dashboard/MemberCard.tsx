import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import { calculateAge, formatDisplayDate } from '../../utils.ts';

interface Props {
  member: FamilyMember;
  index: number;
  onEdit: (member: FamilyMember) => void;
  onDelete: (e: React.MouseEvent, member: FamilyMember) => void;
}

export const MemberCard: React.FC<Props> = ({ member, index, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="relative overflow-hidden glass rounded-[2.5rem] p-8 shadow-2xl hover:shadow-indigo-500/20 transition-all group border-2 border-transparent hover:border-white/10"
  >
    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${member['लिंग (पु०/म०)'] === 'पु०' ? 'from-blue-400 to-indigo-500' : 'from-pink-400 to-rose-500'}`} />

    <div className="flex justify-between items-start mb-8">
      <div className="flex gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl transition-transform group-hover:scale-110 ${
          member['लिंग (पु०/म०)'] === 'पु०' ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white' : 'bg-gradient-to-br from-pink-400 to-rose-600 text-white'
        }`}>
          {index + 1}
        </div>
        <div>
          <h3 className="text-xl font-black text-white leading-tight">{member['सदस्य का नाम']}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">S/W of: {member['पिता / पति का नाम']}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(member)}
          className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-white/10 transition-all active:scale-90"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => onDelete(e, member)}
          className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-400/50 hover:bg-white/10 transition-all active:scale-90"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 p-5 bg-black/40 rounded-2xl border border-white/5 font-mono">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">DOB / Age</p>
        <p className="text-xs font-bold text-white/80">{formatDisplayDate(member['जन्मतिथि'])} ({calculateAge(member['जन्मतिथि'])})</p>
      </div>
      <div className="space-y-1 text-right">
        <p className={`text-[9px] font-black uppercase tracking-widest ${member['आधार कार्ड संख्या'] ? 'text-emerald-400' : 'text-rose-400'}`}>Aadhaar</p>
        <p className="text-xs font-bold text-white/80">{member['आधार कार्ड संख्या'] || 'नदारद (Missing)'}</p>
      </div>
    </div>
  </motion.div>
);
