import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronRight, 
  Search, 
  User, 
  MapPin, 
  RefreshCcw,
  SlidersHorizontal,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember } from '../types';
import { 
  RATION_CARD_TYPES, 
  RELIGIONS, 
  CASTES, 
  GENDERS, 
  DISABILITY_OPTIONS, 
  DISABILITY_TYPES, 
  OCCUPATIONS, 
  LITERACY_STATUS, 
  EDUCATION_LEVELS 
} from '../constants';

interface FilterPageProps {
  allMembers: FamilyMember[];
  loading?: boolean;
  onClose: () => void;
  onSelectMember: (member: FamilyMember) => void;
  onDownloadPdf: (members: FamilyMember[], filters: any) => void;
}

export const FilterPage: React.FC<FilterPageProps> = ({ allMembers, loading, onClose, onSelectMember, onDownloadPdf }) => {
  const [filters, setFilters] = useState({
    rationCardType: 'सभी',
    religion: 'सभी',
    caste: 'सभी',
    gender: 'सभी',
    minAge: 0,
    maxAge: 100,
    disability: 'सभी',
    disabilityType: 'सभी',
    occupation: 'सभी',
    literacy: 'सभी',
    educationLevel: 'सभी',
    search: ''
  });

  const resetFilters = () => {
    setFilters({
      rationCardType: 'सभी',
      religion: 'सभी',
      caste: 'सभी',
      gender: 'सभी',
      minAge: 0,
      maxAge: 100,
      disability: 'सभी',
      disabilityType: 'सभी',
      occupation: 'सभी',
      literacy: 'सभी',
      educationLevel: 'सभी',
      search: ''
    });
  };

  const calculateAge = (dob: any) => {
    if (!dob) return 0;
    const dStr = dob.toString();
    let birthDate: Date;
    
    if (/^\d{2}-\d{2}-\d{4}$/.test(dStr)) {
      const [d, m, y] = dStr.split('-').map(n => parseInt(n, 10));
      birthDate = new Date(y, m - 1, d);
    } else {
      birthDate = new Date(dStr);
    }
    
    if (isNaN(birthDate.getTime())) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredResults = useMemo(() => {
    return allMembers.filter(member => {
      const age = calculateAge(member['जन्मतिथि']);
      
      const matchesSearch = !filters.search || 
        member['सदस्य का नाम'].toLowerCase().includes(filters.search.toLowerCase()) ||
        member['फैमिली ID'].toLowerCase().includes(filters.search.toLowerCase()) ||
        member['राशन कार्ड संख्या'].toLowerCase().includes(filters.search.toLowerCase());

      const matchesRation = filters.rationCardType === 'सभी' || member['राशन कार्ड का प्रकार'] === filters.rationCardType;
      const matchesReligion = filters.religion === 'सभी' || member['धर्म'] === filters.religion;
      const matchesCaste = filters.caste === 'सभी' || member['जाति'] === filters.caste;
      const matchesGender = filters.gender === 'सभी' || member['लिंग (पु०/म०)'] === filters.gender;
      const matchesAge = age >= filters.minAge && age <= filters.maxAge;
      const matchesDisability = filters.disability === 'सभी' || member['दिव्यांगता'] === filters.disability;
      const matchesDisabilityType = filters.disability === 'No' || filters.disabilityType === 'सभी' || member['दिव्यांगता का प्रकार'] === filters.disabilityType;
      const matchesOccupation = filters.occupation === 'सभी' || member['व्यवसाय'] === filters.occupation;
      const matchesLiteracy = filters.literacy === 'सभी' || member['साक्षर/निरक्षर'] === filters.literacy;
      const matchesEducation = filters.literacy === 'निरक्षर' || filters.educationLevel === 'सभी' || member['यदि साक्षर तो शैक्षिक स्तर'] === filters.educationLevel;

      return matchesSearch && matchesRation && matchesReligion && matchesCaste && 
             matchesGender && matchesAge && matchesDisability && 
             matchesDisabilityType && matchesOccupation && matchesLiteracy && matchesEducation;
    });
  }, [allMembers, filters]);

  // Derived filter options with "सभी" prepended
  const rationOptions = ['सभी', ...RATION_CARD_TYPES];
  const religionOptions = ['सभी', ...RELIGIONS];
  const casteOptions = ['सभी', ...CASTES];
  const genderOptions = ['सभी', ...GENDERS];
  const disabilityStatusOptions = ['सभी', ...DISABILITY_OPTIONS];
  const disabilityTypeOptions = ['सभी', ...DISABILITY_TYPES];
  const occupationOptions = ['सभी', ...OCCUPATIONS];
  const literacyOptions = ['सभी', ...LITERACY_STATUS];
  const educationOptions = ['सभी', ...EDUCATION_LEVELS];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex flex-col bg-[#020617] text-white overflow-hidden"
    >
      {/* Header */}
      <header className="flex-none glass border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Filter size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">डाटा फिल्टर सेंटर</h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em]">ADVANCED DATA FILTRATION</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {filteredResults.length} परिणाम मिले
          </div>
          <button 
            onClick={() => onDownloadPdf(filteredResults, filters)}
            disabled={filteredResults.length === 0}
            className="group flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
          >
            <FileDown size={16} />
            <span className="hidden sm:inline">रिपोर्ट (PDF)</span>
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Filters */}
        <aside className="w-full md:w-80 flex-none border-r border-white/10 overflow-y-auto p-6 space-y-8 bg-slate-900/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
              <SlidersHorizontal size={14} /> फिल्टर मापदंड
            </h3>
            <button 
              onClick={resetFilters}
              className="text-[10px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <RefreshCcw size={12} /> रीसेट करें
            </button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">नाम / ID से खोजें</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text"
                  placeholder="खोजें..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Ration Card Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">राशन कार्ड का प्रकार</label>
              <select 
                value={filters.rationCardType}
                onChange={(e) => setFilters({...filters, rationCardType: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {rationOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
              </select>
            </div>

            {/* Religion & Caste */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">धर्म</label>
                <select 
                  value={filters.religion}
                  onChange={(e) => setFilters({...filters, religion: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  {religionOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">जाति</label>
                <select 
                  value={filters.caste}
                  onChange={(e) => setFilters({...filters, caste: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  {casteOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">लिंग</label>
                <select 
                  value={filters.gender}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  {genderOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">उम्र (न्यूनतम)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minAge}
                  onChange={(e) => setFilters({...filters, minAge: parseInt(e.target.value || '0')})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">उम्र (अधिकतम)</label>
              <input 
                type="range"
                min="0"
                max="100"
                value={filters.maxAge}
                onChange={(e) => setFilters({...filters, maxAge: parseInt(e.target.value)})}
                className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-white/40">
                <span>0</span>
                <span className="text-indigo-400">{filters.maxAge} साल</span>
                <span>100</span>
              </div>
            </div>

            {/* Disability */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">दिव्यांगता</label>
                <select 
                  value={filters.disability}
                  onChange={(e) => setFilters({...filters, disability: e.target.value, disabilityType: 'सभी'})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  {disabilityStatusOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>
              
              <AnimatePresence>
                {filters.disability === 'Yes' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">दिव्यांगता का प्रकार</label>
                    <select 
                      value={filters.disabilityType}
                      onChange={(e) => setFilters({...filters, disabilityType: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all font-sans"
                    >
                      {disabilityTypeOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Occupation */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">व्यवसाय</label>
              <select 
                value={filters.occupation}
                onChange={(e) => setFilters({...filters, occupation: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
              >
                {occupationOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
              </select>
            </div>

            {/* Literacy */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">साक्षर / निरक्षर</label>
                <select 
                  value={filters.literacy}
                  onChange={(e) => setFilters({...filters, literacy: e.target.value, educationLevel: 'सभी'})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  {literacyOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>

              <AnimatePresence>
                {filters.literacy === 'साक्षर' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">शैक्षिक स्तर</label>
                    <select 
                      value={filters.educationLevel}
                      onChange={(e) => setFilters({...filters, educationLevel: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
                    >
                      {educationOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Main Content - Results */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white flex items-center gap-4">
                <span className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></span>
                परिणाम <span className="text-white/40 text-sm font-bold">({filteredResults.length})</span>
              </h3>
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div>
                  <p className="text-xl font-black text-white/60">डाटा लोड हो रहा है...</p>
                  <p className="text-sm text-white/30">कृपया प्रतीक्षा करें, पूरा डाटा लोड किया जा रहा है।</p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                  <Search size={40} />
                </div>
                <div>
                  <p className="text-xl font-black text-white/60">कोई परिणाम नहीं मिला</p>
                  <p className="text-sm text-white/30">कृपया अपने फिल्टर मापदंड बदलें और पुनः प्रयास करें।</p>
                </div>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/30 hover:bg-indigo-600/30 transition-all"
                >
                  फिल्टर रीसेट करें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((member, idx) => (
                  <motion.div
                    key={`${member['फैमिली ID']}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    onClick={() => onSelectMember(member)}
                    className="group relative glass rounded-3xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <User size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">मकान नम्बर</p>
                        <p className="text-sm font-black text-indigo-400">{member['मकान नम्बर']}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">{member['सदस्य का नाम']}</h4>
                        <p className="text-xs text-white/40 font-bold">{member['पिता / पति का नाम']}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">उम्र</p>
                          <p className="text-sm font-bold text-white/80">{calculateAge(member['जन्मतिथि'])} साल</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">लिंग</p>
                          <p className="text-sm font-bold text-white/80">{member['लिंग (पु०/म०)']}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white/40">
                          {member['जाति']}
                        </span>
                        {member['दिव्यांगता'] === 'Yes' && (
                          <span className="px-2 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-[9px] font-black uppercase text-rose-400">
                            दिव्यांग
                          </span>
                        )}
                        <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black uppercase text-emerald-400">
                          {member['साक्षर/निरक्षर']}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <ChevronRight className="text-indigo-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button - Apply (Mobile only) */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <button 
          onClick={() => {}} // In this case, results are dynamic, so just close or scroll to top
          className="bg-indigo-600 p-4 rounded-full shadow-2xl text-white active:scale-95"
        >
          <Filter size={24} />
        </button>
      </div>
    </motion.div>
  );
};
