import React from 'react';
import { FamilyMember } from '../../types.ts';
import { calculateAge } from '../../utils.ts';

interface Props {
  members: FamilyMember[];
  filters: any;
  formatDisplayDate: (d: any) => string;
}

export const FilteredReportDocument: React.FC<Props> = ({ members, filters, formatDisplayDate }) => {
  const maleCount = members.filter(m => m['लिंग (पु०/म०)'] === 'पु०').length;
  const femaleCount = members.filter(m => m['लिंग (पु०/म०)'] === 'म०').length;

  return (
    <div
      className="p-10 bg-white text-black text-[11px]"
      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
    >
      <div className="flex items-center justify-between border-b-4 border-indigo-600 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl rotate-3 shadow-xl">
            PP
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">परिवार पंजी सर्वेक्षण रिपोर्ट</h1>
            <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px]">Village Administration Data Center</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">तैयार दिनांक</p>
          <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">कुल सदस्य</p>
          <p className="text-2xl font-black text-indigo-600 leading-none">{members.length}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">पुरुष</p>
          <p className="text-2xl font-black text-slate-700 leading-none">{maleCount}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">महिलाएं</p>
          <p className="text-2xl font-black text-slate-700 leading-none">{femaleCount}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">अन्य</p>
          <p className="text-2xl font-black text-slate-700 leading-none">{members.length - maleCount - femaleCount}</p>
        </div>
      </div>

      <div className="mb-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-wrap gap-x-8 gap-y-2">
        <p className="w-full text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 border-b border-indigo-100 pb-2">सक्रिय फिल्टर मापदंड</p>
        {Object.entries(filters).map(([key, value]) => {
          if (value === 'सभी' || (key === 'search' && !value) || (key === 'minAge' && value === 0) || (key === 'maxAge' && value === 100)) return null;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key}:</span>
              <span className="text-[10px] font-bold text-slate-700">{(value as any).toString()}</span>
            </div>
          );
        })}
        {!Object.values(filters).some(v => v !== 'सभी' && v !== '' && v !== 0 && v !== 100) && (
          <p className="text-[10px] font-bold text-slate-400 italic">कोई विशेष फिल्टर लागू नहीं (संपूर्ण डाटा)</p>
        )}
      </div>

      <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm mb-12">
        <table className="w-full border-collapse text-left text-[10px]">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700 text-center w-10">#</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700 text-center">मकान नं०</th>
              <th className="px-4 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700">सदस्य का विवरण</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700">पिता / पति</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700 text-center">लिंग</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700">जन्मतिथि (उम्र)</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest border-r border-slate-700">आधार / मोबाइल</th>
              <th className="px-3 py-4 font-black uppercase text-[9px] tracking-widest text-center">जाति/धर्म</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m, i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/20' : 'bg-white'}>
                <td className="px-3 py-3 font-bold text-slate-400 text-center border-r border-slate-100">{i + 1}</td>
                <td className="px-3 py-3 font-black text-indigo-600 text-center border-r border-slate-100">{m['मकान नम्बर']}</td>
                <td className="px-4 py-3 border-r border-slate-100">
                  <p className="font-black text-slate-800 text-xs leading-tight mb-0.5">{m['सदस्य का नाम']}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">FID: {m['फैमिली ID'] || 'N/A'}</p>
                </td>
                <td className="px-3 py-3 text-slate-600 border-r border-slate-100 font-medium leading-tight">{m['पिता / पति का नाम']}</td>
                <td className="px-3 py-3 text-center border-r border-slate-100 font-black text-[10px] text-slate-500">{m['लिंग (पु०/म०)']}</td>
                <td className="px-3 py-3 border-r border-slate-100 text-center">
                  <p className="font-bold text-slate-700">{formatDisplayDate(m['जन्मतिथि'])}</p>
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mt-1">उम्र: {calculateAge(m['जन्मतिथि'])}</p>
                </td>
                <td className="px-3 py-3 border-r border-slate-100">
                  <p className="font-mono font-bold text-slate-700 text-[10px] mb-1">{m['आधार कार्ड संख्या'] || '-'}</p>
                  <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none">{m['मोबाइल नंबर'] || '-'}</p>
                </td>
                <td className="px-3 py-3 text-center">
                  <p className="font-black text-slate-700 text-[9px] leading-tight mb-1">{m['जाति']}</p>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] leading-none">{m['धर्म']}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl text-white">
        <div>
          <h3 className="text-lg font-black uppercase tracking-widest mb-1">डिजिटल ग्राम सचिवालय</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">पुष्वाड़ा, रामपुर (उत्तर प्रदेश)</p>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <div className="w-24 h-px bg-white/20 mb-2 mx-auto"></div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">प्रधान/सचिव</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-px bg-white/20 mb-2 mx-auto"></div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">हस्ताक्षर</p>
          </div>
        </div>
      </div>
    </div>
  );
};
