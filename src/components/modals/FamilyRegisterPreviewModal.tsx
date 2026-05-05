import React from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import { FamilyRegisterDocument } from '../pdf/FamilyRegisterDocument.tsx';

interface Props {
  isOpen: boolean;
  familyMembers: FamilyMember[];
  filteredMembers: FamilyMember[];
  activeFilterCount: number;
  loading: boolean;
  formatDisplayDate: (d: any) => string;
  onClose: () => void;
  onDownload: () => void;
}

export const FamilyRegisterPreviewModal: React.FC<Props> = ({
  isOpen, familyMembers, filteredMembers, activeFilterCount, loading, formatDisplayDate, onClose, onDownload,
}) => (
  <AnimatePresence>
    {isOpen && familyMembers.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl overflow-y-auto"
      >
        <div className="min-h-full w-full flex flex-col items-center pt-10 pb-20 px-4">
          <div className="sticky top-4 z-[110] flex flex-col md:flex-row items-center justify-between w-full max-w-[210mm] mb-12 px-8 py-6 gap-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 rotate-3 shadow-inner">
                <FileDown className="text-indigo-400" size={28} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] leading-none">दस्तावेज़ पूर्वावलोकन</h2>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-2">डाउनलोड करने से पहले विवरण जांचें</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none group px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/50 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                वापस जाएं
              </button>
              <button
                onClick={onDownload}
                disabled={loading}
                className="flex-1 md:flex-none relative group px-10 py-4 bg-indigo-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-indigo-500/40 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <FileDown size={20} />}
                <span>डाउनलोड करें</span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            className="bg-white shadow-[0_60px_130px_-30px_rgba(0,0,0,0.9)] rounded-sm origin-top overflow-hidden transition-all border border-white/10"
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            <div className="w-full h-full scale-[0.4] sm:scale-[0.6] md:scale-[0.85] lg:scale-100 origin-top">
              <div className="bg-white">
                {activeFilterCount > 0 && (
                  <div className="px-12 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">फिल्टर लागू: {activeFilterCount} मानदंड सक्रिय</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">दिखाए गए परिणाम: {filteredMembers.length} / {familyMembers.length}</p>
                  </div>
                )}
                <FamilyRegisterDocument familyMembers={filteredMembers} formatDisplayDate={formatDisplayDate} />
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
            SCROLL TO PREVIEW FULL DOCUMENT
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
