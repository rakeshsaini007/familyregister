import React from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import { FilteredReportDocument } from '../pdf/FilteredReportDocument.tsx';

interface Props {
  isOpen: boolean;
  members: FamilyMember[];
  filters: any;
  loading: boolean;
  formatDisplayDate: (d: any) => string;
  onClose: () => void;
  onDownload: () => void;
}

export const FilteredReportPreviewModal: React.FC<Props> = ({
  isOpen, members, filters, loading, formatDisplayDate, onClose, onDownload,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl overflow-y-auto"
      >
        <div className="min-h-full w-full flex flex-col items-center pt-10 pb-20 px-4">
          <div className="sticky top-4 z-[310] flex flex-col md:flex-row items-center justify-between w-full max-w-[210mm] mb-12 px-8 py-6 gap-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 rotate-3 shadow-inner">
                <FileDown className="text-emerald-400" size={28} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] leading-none">रिपोर्ट पूर्वावलोकन</h2>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-2">फिल्टर किया हुआ डाटा डाउनलोड करें</p>
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
                className="flex-1 md:flex-none relative group px-10 py-4 bg-emerald-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-emerald-500/40 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <FileDown size={20} />}
                <span>डाउनलोड रिपोर्ट</span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="bg-white shadow-2xl rounded-sm origin-top border border-white/10"
            style={{ width: '210mm' }}
          >
            <FilteredReportDocument members={members} filters={filters} formatDisplayDate={formatDisplayDate} />
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
