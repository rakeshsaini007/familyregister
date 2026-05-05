import React from 'react';
import { Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../../types.ts';

interface Props {
  member: FamilyMember | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<Props> = ({ member, loading, onConfirm, onCancel }) => (
  <AnimatePresence>
    {member && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-8 pb-0 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6 border border-rose-500/30">
              <Trash2 className="text-rose-500" size={36} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">क्या आप वाकई हटाना चाहते हैं?</h3>
            <p className="text-white/40 font-medium leading-relaxed">
              आप <span className="text-white font-bold">{member['सदस्य का नाम']}</span> को परिवार सूची से हटाने जा रहे हैं। यह क्रिया स्थायी है।
            </p>
          </div>

          <div className="p-8 pt-10 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-sm tracking-widest rounded-2xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              हाँ, हटा दें (Delete)
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/50 font-black uppercase text-sm tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              निरस्त करें (Cancel)
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
