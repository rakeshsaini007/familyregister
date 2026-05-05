import React from 'react';
import { Plus, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../../types.ts';
import {
  RATION_CARD_TYPES, RELIGIONS, CASTES, GENDERS,
  DISABILITY_OPTIONS, DISABILITY_TYPES, OCCUPATIONS,
  LITERACY_STATUS, EDUCATION_LEVELS,
} from '../../constants.ts';

interface Props {
  isOpen: boolean;
  mode: 'family' | 'member';
  formData: FamilyMember;
  isUpdate: boolean;
  loading: boolean;
  alert: { type: 'success' | 'error'; message: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const MemberFormModal: React.FC<Props> = ({
  isOpen, mode, formData, isUpdate, loading, alert, onChange, onSubmit, onClose,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020617] rounded-[2.5rem] shadow-2xl border border-white/20 custom-scrollbar"
        >
          <div className="sticky top-0 z-10 px-8 py-6 bg-[#020617] border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">
                {mode === 'family' ? 'पारिवारिक विवरण' : 'सदस्य विवरण'}
              </h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">
                {isUpdate ? 'रिकॉर्ड अपडेट करें' : 'नया विवरण जोड़ें'}
              </p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-white/40 transition-colors">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-8 md:p-12 space-y-10">
            {mode === 'family' && (
              <div className="space-y-6 animate-fade-in shadow-[0_0_50px_-12px_rgba(79,70,229,0.1)]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                  <span className="w-8 h-px bg-white/10" />
                  मुख्य पारिवारिक सूचना
                  <span className="flex-1 h-px bg-white/10" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="मकान नम्बर *"><input name="मकान नम्बर" value={formData['मकान नम्बर']} onChange={onChange} className={inputCls} /></Field>
                  <Field label="परिवार प्रमुख *"><input name="परिवार के प्रमुख का नाम" value={formData['परिवार के प्रमुख का नाम']} onChange={onChange} className={inputCls} /></Field>
                  <Field label="फैमिली ID"><input name="फैमिली ID" value={formData['फैमिली ID']} onChange={onChange} className={`${inputCls} font-mono`} /></Field>
                  <Field label="राशन कार्ड नं"><input name="राशन कार्ड संख्या" value={formData['राशन कार्ड संख्या']} onChange={onChange} className={`${inputCls} font-mono`} /></Field>
                  <Field label="राशन कार्ड प्रकार">
                    <select name="राशन कार्ड का प्रकार" value={formData['राशन कार्ड का प्रकार']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {RATION_CARD_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
                    </select>
                  </Field>
                  <Field label="धर्म">
                    <select name="धर्म" value={formData['धर्म']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {RELIGIONS.map(r => <option key={r} value={r} className="bg-[#020617] text-white">{r}</option>)}
                    </select>
                  </Field>
                  <Field label="जाति">
                    <select name="जाति" value={formData['जाति']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {CASTES.map(c => <option key={c} value={c} className="bg-[#020617] text-white">{c}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {mode === 'member' && (
              <div className="space-y-6 animate-fade-in shadow-[0_0_50px_-12px_rgba(236,72,153,0.1)]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                  <span className="w-8 h-px bg-white/10" />
                  व्यक्तिगत सदस्य सूचना
                  <span className="flex-1 h-px bg-white/10" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="मकान नम्बर *">
                    <input name="मकान नम्बर" value={formData['मकान नम्बर']} readOnly className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none font-bold text-white/60" />
                  </Field>
                  <Field label="सदस्य का नाम *"><input name="सदस्य का नाम" value={formData['सदस्य का नाम']} onChange={onChange} placeholder="हिंदी में दर्ज करें" className={inputCls} /></Field>
                  <Field label="पिता / पति *"><input name="पिता / पति का नाम" value={formData['पिता / पति का नाम']} onChange={onChange} placeholder="हिंदी में दर्ज करें" className={inputCls} /></Field>
                  <Field label="लिंग (पु०/म०) *">
                    <select name="लिंग (पु०/म०)" value={formData['लिंग (पु०/म०)']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {GENDERS.map(g => <option key={g} value={g} className="bg-[#020617] text-white">{g}</option>)}
                    </select>
                  </Field>
                  <Field label="जन्मतिथि"><input name="जन्मतिथि" value={formData['जन्मतिथि']} onChange={onChange} placeholder="DD-MM-YYYY" className={`${inputCls} font-mono`} /></Field>
                  <Field label="उम्र"><input name="उम्र" value={formData['उम्र']} readOnly className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl font-mono text-white/60" /></Field>
                  <Field label="आधार कार्ड संख्या"><input name="आधार कार्ड संख्या" value={formData['आधार कार्ड संख्या']} onChange={onChange} maxLength={12} className={`${inputCls} font-mono`} /></Field>
                  <Field label="मोबाइल नंबर"><input name="मोबाइल नंबर" value={formData['मोबाइल नंबर']} onChange={onChange} maxLength={10} className={`${inputCls} font-mono`} /></Field>
                  <Field label="दिव्यांगता">
                    <select name="दिव्यांगता" value={formData['दिव्यांगता']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {DISABILITY_OPTIONS.map(o => <option key={o} value={o} className="bg-[#020617] text-white">{o}</option>)}
                    </select>
                  </Field>
                  {formData['दिव्यांगता'] === 'Yes' && (
                    <Field label="दिव्यांगता का प्रकार">
                      <select name="दिव्यांगता का प्रकार" value={formData['दिव्यांगता का प्रकार']} onChange={onChange} className={selectCls}>
                        <option value="" className="bg-[#020617] text-white">चुनें</option>
                        {DISABILITY_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
                      </select>
                    </Field>
                  )}
                  <Field label="व्यवसाय">
                    <select name="व्यवसाय" value={formData['व्यवसाय']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {OCCUPATIONS.map(o => <option key={o} value={o} className="bg-[#020617] text-white">{o}</option>)}
                    </select>
                  </Field>
                  <Field label="साक्षर/निरक्षर">
                    <select name="साक्षर/निरक्षर" value={formData['साक्षर/निरक्षर']} onChange={onChange} className={selectCls}>
                      <option value="" className="bg-[#020617] text-white">चुनें</option>
                      {LITERACY_STATUS.map(s => <option key={s} value={s} className="bg-[#020617] text-white">{s}</option>)}
                    </select>
                  </Field>
                  {formData['साक्षर/निरक्षर'] === 'साक्षर' && (
                    <Field label="यदि साक्षर तो शैक्षिक स्तर">
                      <select name="यदि साक्षर तो शैक्षिक स्तर" value={formData['यदि साक्षर तो शैक्षिक स्तर']} onChange={onChange} className={selectCls}>
                        <option value="" className="bg-[#020617] text-white">चुनें</option>
                        {EDUCATION_LEVELS.map(l => <option key={l} value={l} className="bg-[#020617] text-white">{l}</option>)}
                      </select>
                    </Field>
                  )}
                  <Field label="सर्किल छोड़ देने या मृत्यु का दिनाँक">
                    <input name="सर्किल छोड़ देने या मृत्यु का दिनाँक" value={formData['सर्किल छोड़ देने या मृत्यु का दिनाँक']} onChange={onChange} placeholder="DD-MM-YYYY" className={`${inputCls} font-mono`} />
                  </Field>
                </div>
              </div>
            )}

            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-6 rounded-2xl flex items-center gap-4 border backdrop-blur-md ${alert.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-red-500/90 border-red-400 text-white'}`}
                >
                  {alert.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  <p className="text-sm font-black uppercase tracking-widest">{alert.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="group relative w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50">
                <div className={`absolute inset-0 bg-gradient-to-r ${isUpdate ? 'from-amber-500 to-orange-600' : 'from-indigo-600 to-purple-700'}`} />
                <div className="relative flex items-center justify-center gap-3 py-5 text-white font-black text-lg tracking-[0.1em] uppercase">
                  {loading ? <RefreshCw className="animate-spin" size={24} /> : isUpdate ? <RefreshCw size={24} /> : <Save size={24} />}
                  {isUpdate ? 'अद्यतन करें' : 'सुरक्षित करें'}
                </div>
              </button>
              <button type="button" onClick={onClose} className="w-full mt-4 py-4 text-white/30 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                वापस जाएं (Cancel)
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const inputCls = 'w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold focus:bg-white/10 focus:border-indigo-500/50 transition-all';
const selectCls = 'w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer text-white focus:bg-white/10 outline-none';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{label}</label>
    {children}
  </div>
);
