/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  User, 
  MapPin, 
  Calendar, 
  IdCard, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Clock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  UserMinus,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember, emptyMember } from './types.ts';
import { 
  RATION_CARD_TYPES, 
  RELIGIONS, 
  CASTES, 
  GENDERS, 
  DISABILITY_OPTIONS, 
  DISABILITY_TYPES, 
  OCCUPATIONS, 
  LITERACY_STATUS, 
  EDUCATION_LEVELS,
  GAS_URL 
} from './constants.ts';

export default function App() {
  const [formData, setFormData] = useState<FamilyMember>(emptyMember);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'family' | 'member'>('family');
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);

  // Age calculation
  const calculateAge = (dob: any) => {
    if (!dob) return '';
    const dStr = dob.toString();
    let birthDate: Date;
    
    if (/^\d{2}-\d{2}-\d{4}$/.test(dStr)) {
      const [d, m, y] = dStr.split('-').map(n => parseInt(n, 10));
      birthDate = new Date(y, m - 1, d);
    } else {
      birthDate = new Date(dStr);
    }
    
    if (isNaN(birthDate.getTime())) return '';
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
  };

  const formatDisplayDate = (date: any) => {
    if (!date) return '';
    const dStr = date.toString();
    
    // If it's already DD-MM-YYYY, return as is
    if (/^\d{2}-\d{2}-\d{4}$/.test(dStr)) return dStr;
    
    const d = new Date(dStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dStr;
  };

  // Date auto-separator (DD-MM-YYYY)
  const handleDateInput = (name: keyof FamilyMember, value: string) => {
    let cleaned = value.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '-' + cleaned.slice(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.slice(0, 5) + '-' + cleaned.slice(4);
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: formatted };
      if (name === 'जन्मतिथि') {
        newData['उम्र'] = calculateAge(formatted);
      }
      return newData;
    });
  };

  // Validation
  const validateForm = () => {
    let requiredFields: (keyof FamilyMember)[] = [];
    
    if (modalMode === 'family') {
      requiredFields = [
        'मकान नम्बर', 'परिवार के प्रमुख का नाम', 'फैमिली ID', 'राशन कार्ड संख्या', 
        'राशन कार्ड का प्रकार', 'धर्म', 'जाति'
      ];
    } else {
      requiredFields = [
        'मकान नम्बर', 'सदस्य का नाम', 'पिता / पति का नाम', 
        'लिंग (पु०/म०)', 'जन्मतिथि', 'आधार कार्ड संख्या', 'दिव्यांगता', 'व्यवसाय', 
        'साक्षर/निरक्षर', 'मोबाइल नंबर'
      ];
    }

    for (const field of requiredFields) {
      if (!formData[field]) return `${field} अनिवार्य है`;
    }

    if (modalMode === 'member') {
      if (formData['आधार कार्ड संख्या'].toString().length !== 12) {
        return 'आधार कार्ड संख्या 12 अंकों की होनी चाहिए';
      }

      if (formData['मोबाइल नंबर'].toString().length !== 10) {
        return 'मोबाइल नंबर 10 अंकों का होना चाहिए';
      }

      if (formData['दिव्यांगता'] === 'Yes' && !formData['दिव्यांगता का प्रकार']) {
        return 'दिव्यांगता का प्रकार अनिवार्य है';
      }

      if (formData['साक्षर/निरक्षर'] === 'साक्षर' && !formData['यदि साक्षर तो शैक्षिक स्तर']) {
        return 'शैक्षिक स्तर अनिवार्य है';
      }
    }

    const hindiRegex = /^[\u0900-\u097F\s.]+$/;
    
    if (modalMode === 'family') {
      if (!hindiRegex.test(formData['परिवार के प्रमुख का नाम'])) {
        return 'परिवार प्रमुख का नाम केवल हिंदी भाषा में होना चाहिए';
      }
    } else {
      if (!hindiRegex.test(formData['सदस्य का नाम']) || 
          !hindiRegex.test(formData['पिता / पति का नाम'])) {
        return 'सदस्य और पिता/पति का नाम केवल हिंदी भाषा में होने चाहिए';
      }
    }

    return null;
  };

  // Fetch Family Members by House Number
  const fetchFamily = async (houseNo: string) => {
    if (!houseNo || GAS_URL === 'YOUR_DEPLOYED_GAS_URL') return;
    setFetching(true);
    try {
      const response = await fetch(`${GAS_URL}?houseNumber=${houseNo}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setFamilyMembers(data);
      } else {
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setFetching(false);
    }
  };

  // Check if member exists to toggle Update/Submit
  useEffect(() => {
    const existing = familyMembers.find(m => 
      m['सदस्य का नाम'] === formData['सदस्य का नाम'] && 
      m['मकान नम्बर'].toString() === formData['मकान नम्बर'].toString()
    );
    setIsUpdate(!!existing);
  }, [formData['सदस्य का नाम'], formData['मकान नम्बर'], familyMembers]);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FamilyMember;

    if (fieldName === 'जन्मतिथि' || fieldName === 'सर्किल छोड़ देने या मृत्यु का दिनाँक') {
      handleDateInput(fieldName, value);
      return;
    }

    if (fieldName === 'आधार कार्ड संख्या' || fieldName === 'मोबाइल नंबर' || fieldName === 'फैमिली ID' || fieldName === 'राशन कार्ड संख्या') {
      const numeric = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [fieldName]: numeric }));
      return;
    }

    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleHouseBlur = () => {
    if (formData['मकान नम्बर']) {
      fetchFamily(formData['मकान नम्बर']);
    }
  };

  // Submit/Update Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setAlert({ type: 'error', message: error });
      return;
    }

    if (GAS_URL === 'YOUR_DEPLOYED_GAS_URL') {
      setAlert({ type: 'error', message: 'कृपया Google Apps Script URL को constants.ts में सेट करें' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        const savedHouse = formData['मकान नम्बर'];
        setAlert({ 
          type: 'success', 
          message: result.action === 'updated' ? 'डाटा सफलतापूर्वक अपडेट किया गया!' : 'डाटा सफलतापूर्वक सुरक्षित किया गया!' 
        });
        
        // Refresh the list immediately
        await fetchFamily(savedHouse);
        
        // Reset form but keep house number
        setFormData({ ...emptyMember, 'मकान नम्बर': savedHouse });
        setIsModalOpen(false);
      } else {
        setAlert({ type: 'error', message: result.message || 'कुछ गलत हुआ' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'नेटवर्क त्रुटि: कृपया जाँचें' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDelete = (e: React.MouseEvent, member: FamilyMember) => {
    e.stopPropagation();
    setMemberToDelete(member);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    const member = memberToDelete;
    
    if (GAS_URL === 'YOUR_DEPLOYED_GAS_URL') {
      setAlert({ type: 'error', message: 'कृपया Google Apps Script URL को constants.ts में सेट करें' });
      setMemberToDelete(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        mode: 'no-cors', // Use no-cors to avoid preflight issues with GAS
        body: JSON.stringify({ 
          'मकान नम्बर': member['मकान नम्बर'],
          'सदस्य का नाम': member['सदस्य का नाम'],
          action: 'delete' 
        })
      });
      
      // With no-cors, we can't read the response body, 
      // but we can assume success if no error is thrown
      setAlert({ type: 'success', message: 'हटाने का अनुरोध भेजा गया! कृपया कुछ क्षणों में रिफ्रेश करें।' });
      setMemberToDelete(null);
      
      // Delay fetch to give GAS time to finish
      setTimeout(async () => {
        await fetchFamily(member['मकान नम्बर']);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      setAlert({ type: 'error', message: 'हटाने में विफल: नेटवर्क त्रुटि' });
      setMemberToDelete(null);
      setLoading(false);
    } finally {
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleQuickUpdate = async (member: FamilyMember, field: keyof FamilyMember, value: string) => {
    if (GAS_URL === 'YOUR_DEPLOYED_GAS_URL') return;
    
    setLoading(true);
    try {
      const updatedMember = { ...member, [field]: value };
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(updatedMember)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setAlert({ type: 'success', message: 'विवरण अपडेट किया गया' });
        fetchFamily(member['मकान नम्बर']);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'अपडेट विफल रहा' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const loadMemberIntoForm = (member: FamilyMember, mode: 'family' | 'member' = 'family') => {
    setFormData(member);
    setIsUpdate(true);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleInitialSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData['मकान नम्बर']) {
      setHasSearched(true);
      fetchFamily(formData['मकान नम्बर']);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white overflow-x-hidden selection:bg-indigo-500/40 bg-[#020617]">
      {/* Background System */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[130px] opacity-15 animate-pulse delay-2000"></div>
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 5}s`
            } as any}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!hasSearched ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4"
          >
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/50 mb-8 border border-white/10">
                <Users size={64} />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
                <span className="block sm:inline">परिवार डाटा पोर्टल </span>

              </h1>
              <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
                Family Records Management System
              </p>
            </div>

            <div className="w-full max-w-2xl px-4">
              <form onSubmit={handleInitialSearch} className="relative group">
                {/* Glowing Outer Ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-40 group-focus-within:opacity-60 transition duration-500 animate-pulse"></div>
                
                <div className="relative flex p-3 bg-white/10 backdrop-blur-2xl rounded-[2.2rem] shadow-2xl border border-white/20">
                  <div className="pl-6 flex items-center text-white/40">
                    <MapPin size={24} />
                  </div>
                  <input
                    type="text"
                    name="मकान नम्बर"
                    value={formData['मकान नम्बर']}
                    onChange={handleChange}
                    placeholder="मकान नम्बर दर्ज करें (उदा: 42)"
                    autoFocus
                    className="w-full px-6 py-6 bg-transparent text-2xl font-black text-white placeholder:text-white/20 outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 rounded-[1.8rem] font-black text-lg shadow-lg shadow-indigo-500/50 transition-all duration-300 active:scale-95 flex items-center gap-3"
                  >
                    <Search size={24} strokeWidth={3} />
                    <span>खोजें</span>
                  </button>
                </div>
              </form>
              <div className="mt-12 flex justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Real-time Sync</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Secure Data</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Hindi UI</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <header className="sticky top-0 z-50 glass border-b border-white/10 shadow-2xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setHasSearched(false)}
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-2xl group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-white leading-tight">
                      पारिवारिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">डाटा पोर्टल</span>
                    </h1>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Exit to Home</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-[11px] font-black text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                    {new Date().toLocaleDateString('hi-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <button 
                    onClick={() => setHasSearched(false)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all active:scale-95 sm:hidden"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
              <section className="animate-fade-in-up space-y-10">
                {/* Family Summary Card - THE PRIMARY DATA */}
                {familyMembers.length > 0 && (
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
                      
                      <button 
                        onClick={() => loadMemberIntoForm(familyMembers[0], 'family')}
                        className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-black uppercase tracking-widest shadow-xl hover:bg-white/10 transition-all flex items-center gap-3"
                      >
                        <Edit2 size={18} />
                        <span>संपादित करें</span>
                      </button>
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
                          onChange={(e) => handleQuickUpdate(familyMembers[0], 'राशन कार्ड का प्रकार', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:bg-white/10 outline-none transition-all cursor-pointer"
                        >
                          {RATION_CARD_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">धर्म</p>
                        <select 
                          value={familyMembers[0]['धर्म']}
                          onChange={(e) => handleQuickUpdate(familyMembers[0], 'धर्म', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:bg-white/10 outline-none transition-all cursor-pointer"
                        >
                          {RELIGIONS.map(r => <option key={r} value={r} className="bg-[#020617] text-white">{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">जाति</p>
                        <select 
                          value={familyMembers[0]['जाति']}
                          onChange={(e) => handleQuickUpdate(familyMembers[0], 'जाति', e.target.value)}
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
                )}

                {/* Member List */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-4 px-2">
                    <h3 className="text-2xl font-black text-white flex items-center gap-4">
                      <span className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
                      सदस्य सूची
                    </h3>
                    {familyMembers.length > 0 && (
                      <button 
                        onClick={() => {
                          const house = familyMembers[0]['मकान नम्बर'];
                          const head = familyMembers[0]['परिवार के प्रमुख का नाम'];
                          const fid = familyMembers[0]['फैमिली ID'];
                          const rno = familyMembers[0]['राशन कार्ड संख्या'];
                          const rtype = familyMembers[0]['राशन कार्ड का प्रकार'];
                          const rel = familyMembers[0]['धर्म'];
                          const cast = familyMembers[0]['जाति'];
                          
                          setFormData({
                            ...emptyMember,
                            'मकान नम्बर': house,
                            'परिवार के प्रमुख का नाम': head,
                            'फैमिली ID': fid,
                            'राशन कार्ड संख्या': rno,
                            'राशन कार्ड का प्रकार': rtype,
                            'धर्म': rel,
                            'जाति': cast
                          });
                          setIsUpdate(false);
                          setModalMode('member');
                          setIsModalOpen(true);
                        }}
                        className="group flex items-center gap-3 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 border border-indigo-400/20"
                      >
                        <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest">नया सदस्य जोड़ें</span>
                      </button>
                    )}
                  </div>

                  {!formData['मकान नम्बर'] ? (
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
                        onClick={() => {
                          setIsUpdate(false);
                          setModalMode('family');
                          setIsModalOpen(true);
                        }}
                        className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10 transition-all"
                      >
                        नया परिवार जोड़ें
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {familyMembers.map((member, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative overflow-hidden glass rounded-[2.5rem] p-8 shadow-2xl hover:shadow-indigo-500/20 transition-all group border-2 border-transparent hover:border-white/10"
                        >
                          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${member['लिंग (पु०/म०)'] === 'पु०' ? 'from-blue-400 to-indigo-500' : 'from-pink-400 to-rose-500'}`} />
                          <div className="flex justify-between items-start mb-8">
                            <div className="flex gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl transition-transform group-hover:scale-110 ${
                                member['लिंग (पु०/म०)'] === 'पु०' ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white' : 'bg-gradient-to-br from-pink-400 to-rose-600 text-white'
                              }`}>
                                {idx + 1}
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-white leading-tight">{member['सदस्य का नाम']}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">S/W of: {member['पिता / पति का नाम']}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => loadMemberIntoForm(member, 'member')}
                                className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-white/10 transition-all active:scale-90"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={(e) => handleDelete(e, member)}
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
                              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Aadhaar</p>
                              <p className="text-xs font-bold text-white/80">{member['आधार कार्ड संख्या']}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020617] rounded-[2.5rem] shadow-2xl border border-white/20 custom-scrollbar"
            >
              <div className="sticky top-0 z-10 px-8 py-6 bg-[#020617] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-widest text-white">
                    {modalMode === 'family' ? 'पारिवारिक विवरण' : 'सदस्य विवरण'}
                  </h2>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">
                    {isUpdate ? 'रिकॉर्ड अपडेट करें' : 'नया विवरण जोड़ें'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl text-white/40 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form 
                onSubmit={handleSubmit}
                className="p-8 md:p-12 space-y-10"
              >
                {/* Family Section */}
                {modalMode === 'family' && (
                  <div className="space-y-6 animate-fade-in shadow-[0_0_50px_-12px_rgba(79,70,229,0.1)]">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                      <span className="w-8 h-px bg-white/10"></span>
                      मुख्य पारिवारिक सूचना
                      <span className="flex-1 h-px bg-white/10"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">मकान नम्बर *</label>
                        <input
                          type="text"
                          name="मकान नम्बर"
                          value={formData['मकान नम्बर']}
                          onChange={handleChange}
                          onBlur={handleHouseBlur}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold focus:bg-white/10 focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">परिवार प्रमुख *</label>
                        <input
                          type="text"
                          name="परिवार के प्रमुख का नाम"
                          value={formData['परिवार के प्रमुख का नाम']}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold focus:bg-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">फैमिली ID *</label>
                        <input
                          type="text"
                          name="फैमिली ID"
                          value={formData['फैमिली ID']}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">राशन कार्ड नं *</label>
                        <input
                          type="text"
                          name="राशन कार्ड संख्या"
                          value={formData['राशन कार्ड संख्या']}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">राशन कार्ड प्रकार</label>
                        <select 
                          name="राशन कार्ड का प्रकार" 
                          value={formData['राशन कार्ड का प्रकार']} 
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer text-white"
                        >
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {RATION_CARD_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">धर्म</label>
                        <select name="धर्म" value={formData['धर्म']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {RELIGIONS.map(r => <option key={r} value={r} className="bg-[#020617] text-white">{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">जाति</label>
                        <select name="जाति" value={formData['जाति']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {CASTES.map(c => <option key={c} value={c} className="bg-[#020617] text-white">{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Section */}
                {modalMode === 'member' && (
                  <div className="space-y-6 animate-fade-in shadow-[0_0_50px_-12px_rgba(236,72,153,0.1)]">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                      <span className="w-8 h-px bg-white/10"></span>
                      व्यक्तिगत सदस्य सूचना
                      <span className="flex-1 h-px bg-white/10"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">मकान नम्बर *</label>
                        <input
                          type="text"
                          name="मकान नम्बर"
                          value={formData['मकान नम्बर']}
                          readOnly
                          className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none font-bold text-white/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">सदस्य का नाम *</label>
                        <input name="सदस्य का नाम" value={formData['सदस्य का नाम']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:bg-white/10 outline-none" placeholder="हिंदी में दर्ज करें" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">पिता / पति *</label>
                        <input name="पिता / पति का नाम" value={formData['पिता / पति का नाम']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:bg-white/10 outline-none" placeholder="हिंदी में दर्ज करें" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">लिंग (पु०/म०) *</label>
                        <select name="लिंग (पु०/म०)" value={formData['लिंग (पु०/म०)']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {GENDERS.map(g => <option key={g} value={g} className="bg-[#020617] text-white">{g}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">जन्मतिथि *</label>
                        <input name="जन्मतिथि" value={formData['जन्मतिथि']} onChange={handleChange} placeholder="DD-MM-YYYY" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">उम्र</label>
                        <input name="उम्र" value={formData['उम्र']} readOnly className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl font-mono text-white/60" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">आधार कार्ड संख्या *</label>
                        <input name="आधार कार्ड संख्या" value={formData['आधार कार्ड संख्या']} onChange={handleChange} maxLength={12} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">मोबाइल नंबर *</label>
                        <input name="मोबाइल नंबर" value={formData['मोबाइल नंबर']} onChange={handleChange} maxLength={10} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">दिव्यांगता</label>
                        <select name="दिव्यांगता" value={formData['दिव्यांगता']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {DISABILITY_OPTIONS.map(o => <option key={o} value={o} className="bg-[#020617] text-white">{o}</option>)}
                        </select>
                      </div>
                      {formData['दिव्यांगता'] === 'Yes' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">दिव्यांगता का प्रकार *</label>
                          <select name="दिव्यांगता का प्रकार" value={formData['दिव्यांगता का प्रकार']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                            <option value="" className="bg-[#020617] text-white">चुनें</option>
                            {DISABILITY_TYPES.map(t => <option key={t} value={t} className="bg-[#020617] text-white">{t}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">व्यवसाय</label>
                        <select name="व्यवसाय" value={formData['व्यवसाय']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {OCCUPATIONS.map(o => <option key={o} value={o} className="bg-[#020617] text-white">{o}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">साक्षर/निरक्षर *</label>
                        <select name="साक्षर/निरक्षर" value={formData['साक्षर/निरक्षर']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                          <option value="" className="bg-[#020617] text-white">चुनें</option>
                          {LITERACY_STATUS.map(s => <option key={s} value={s} className="bg-[#020617] text-white">{s}</option>)}
                        </select>
                      </div>
                      {formData['साक्षर/निरक्षर'] === 'साक्षर' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">यदि साक्षर तो शैक्षिक स्तर *</label>
                          <select name="यदि साक्षर तो शैक्षिक स्तर" value={formData['यदि साक्षर तो शैक्षिक स्तर']} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white">
                            <option value="" className="bg-[#020617] text-white">चुनें</option>
                            {EDUCATION_LEVELS.map(l => <option key={l} value={l} className="bg-[#020617] text-white">{l}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">सर्किल छोड़ देने या मृत्यु का दिनाँक</label>
                        <input name="सर्किल छोड़ देने या मृत्यु का दिनाँक" value={formData['सर्किल छोड़ देने या मृत्यु का दिनाँक']} onChange={handleChange} placeholder="DD-MM-YYYY" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono" />
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {alert && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-6 rounded-2xl flex items-center gap-4 border backdrop-blur-md ${
                        alert.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-red-500/90 border-red-400 text-white'
                      }`}
                    >
                      {alert.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                      <p className="text-sm font-black uppercase tracking-widest">{alert.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${isUpdate ? 'from-amber-500 to-orange-600' : 'from-indigo-600 to-purple-700'}`} />
                    <div className="relative flex items-center justify-center gap-3 py-5 text-white font-black text-lg tracking-[0.1em] uppercase">
                      {loading ? <RefreshCw className="animate-spin" size={24} /> : isUpdate ? <RefreshCw size={24} /> : <Save size={24} />}
                      {isUpdate ? 'अद्यतन करें' : 'सुरक्षित करें'}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-4 py-4 text-white/30 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                  >
                    वापस जाएं (Cancel)
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        <AnimatePresence>
          {memberToDelete && (
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
                    आप <span className="text-white font-bold">{memberToDelete['सदस्य का नाम']}</span> को परिवार सूची से हटाने जा रहे हैं। यह क्रिया स्थायी है।
                  </p>
                </div>
                
                <div className="p-8 pt-10 flex flex-col gap-3">
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-sm tracking-widest rounded-2xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    हाँ, हटा दें (Delete)
                  </button>
                  <button
                    onClick={() => setMemberToDelete(null)}
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

      <footer className="relative z-10 max-w-6xl mx-auto px-4 py-16 border-t border-white/5 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">
            Powered By <span className="text-white/60">Parivar Panji System</span>
          </div>
          <p className="text-white/20 text-[10px] font-bold">© 2026 परिवार पंजी सर्वेक्षण प्रणाली | समस्त अधिकार सुरक्षित</p>
        </div>
      </footer>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
