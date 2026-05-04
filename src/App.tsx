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
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Age calculation
  const calculateAge = (dob: string) => {
    if (!dob || dob.length < 10) return '';
    const parts = dob.split('-');
    if (parts.length !== 3) return '';
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
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
    const requiredFields: (keyof FamilyMember)[] = [
      'मकान नम्बर', 'परिवार के प्रमुख का नाम', 'फैमिली ID', 'राशन कार्ड संख्या', 
      'राशन कार्ड का प्रकार', 'धर्म', 'जाति', 'सदस्य का नाम', 'पिता / पति का नाम', 
      'लिंग (पु०/म०)', 'जन्मतिथि', 'आधार कार्ड संख्या', 'दिव्यांगता', 'व्यवसाय', 
      'साक्षर/निरक्षर', 'मोबाइल नंबर'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) return `${field} अनिवार्य है`;
    }

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

    const hindiRegex = /^[\u0900-\u097F\s.]+$/;
    if (!hindiRegex.test(formData['परिवार के प्रमुख का नाम']) || 
        !hindiRegex.test(formData['सदस्य का नाम']) || 
        !hindiRegex.test(formData['पिता / पति का नाम'])) {
      return 'नाम केवल हिंदी भाषा में होने चाहिए';
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
        setAlert({ 
          type: 'success', 
          message: result.action === 'updated' ? 'डाटा सफलतापूर्वक अपडेट किया गया!' : 'डाटा सफलतापूर्वक सुरक्षित किया गया!' 
        });
        fetchFamily(formData['मकान नम्बर']);
        const savedHouse = formData['मकान नम्बर'];
        setFormData({ ...emptyMember, 'मकान नम्बर': savedHouse });
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

  const loadMemberIntoForm = (member: FamilyMember) => {
    setFormData(member);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-[#141414]">
      {/* Header */}
      <header className="bg-white border-b border-[#141414]/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#141414] p-2 rounded-lg text-white">
              <Users size={24} />
            </div>
            <div>
              <h1 className="font-serif italic text-xl font-bold tracking-tight">परिवार पंजी सर्वेक्षण</h1>
              <p className="text-[10px] uppercase tracking-wider opacity-50 font-mono">Family Registry Survey</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-right text-[11px] font-mono opacity-60">
              {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Form */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#141414]/10 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-[#141414]/10 bg-gray-50 flex justify-between items-center">
            <h2 className="font-serif italic text-xl">विवरण भरें</h2>
            <div className="flex gap-2">
              {loading && <RefreshCw size={18} className="animate-spin opacity-50" />}
              {fetching && <Search size={18} className="animate-spin text-blue-500" />}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <MapPin size={12} /> मकान नम्बर *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="मकान नम्बर"
                    value={formData['मकान नम्बर']}
                    onChange={handleChange}
                    onBlur={handleHouseBlur}
                    placeholder="उदा. 42"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all outline-none"
                  />
                  {formData['मकान नम्बर'] && (
                    <button 
                      type="button"
                      onClick={() => fetchFamily(formData['मकान नम्बर'])}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    >
                      <Search size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <UserCheck size={12} /> परिवार के प्रमुख का नाम *
                </label>
                <input
                  type="text"
                  name="परिवार के प्रमुख का नाम"
                  value={formData['परिवार के प्रमुख का नाम']}
                  onChange={handleChange}
                  placeholder="हिंदी में लिखें"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <IdCard size={12} /> फैमिली ID *
                </label>
                <input
                  type="text"
                  name="फैमिली ID"
                  value={formData['फैमिली ID']}
                  onChange={handleChange}
                  placeholder="अंकों में"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <IdCard size={12} /> राशन कार्ड संख्या *
                </label>
                <input
                  type="text"
                  name="राशन कार्ड संख्या"
                  value={formData['राशन कार्ड संख्या']}
                  onChange={handleChange}
                  placeholder="अंकों में"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">राशन कार्ड का प्रकार *</label>
                <select 
                  name="राशन कार्ड का प्रकार" 
                  value={formData['राशन कार्ड का प्रकार']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {RATION_CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">धर्म *</label>
                <select 
                  name="धर्म" 
                  value={formData['धर्म']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">जाति *</label>
                <select 
                  name="जाति" 
                  value={formData['जाति']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {CASTES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <User size={12} /> सदस्य का नाम *
                </label>
                <input
                  type="text"
                  name="सदस्य का नाम"
                  value={formData['सदस्य का नाम']}
                  onChange={handleChange}
                  placeholder="हिंदी में लिखें"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">पिता / पति का नाम *</label>
                <input
                  type="text"
                  name="पिता / पति का नाम"
                  value={formData['पिता / पति का नाम']}
                  onChange={handleChange}
                  placeholder="हिंदी में लिखें"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">लिंग *</label>
                <select 
                  name="लिंग (पु०/म०)" 
                  value={formData['लिंग (पु०/म०)']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <Calendar size={12} /> जन्मतिथि *
                </label>
                <input
                  type="text"
                  name="जन्मतिथि"
                  value={formData['जन्मतिथि']}
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">उम्र (ऑटो)</label>
                <input
                  type="text"
                  name="उम्र"
                  value={formData['उम्र']}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg outline-none cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">आधार कार्ड संख्या *</label>
                <input
                  type="text"
                  name="आधार कार्ड संख्या"
                  value={formData['आधार कार्ड संख्या']}
                  onChange={handleChange}
                  placeholder="12 अंक"
                  maxLength={12}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">दिव्यांगता *</label>
                <select 
                  name="दिव्यांगता" 
                  value={formData['दिव्यांगता']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  {DISABILITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {formData['दिव्यांगता'] === 'Yes' && (
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">दिव्यांगता का प्रकार *</label>
                  <select 
                    name="दिव्यांगता का प्रकार" 
                    value={formData['दिव्यांगता का प्रकार']} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  >
                    <option value="">चुनें</option>
                    {DISABILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <Briefcase size={12} /> व्यवसाय *
                </label>
                <select 
                  name="व्यवसाय" 
                  value={formData['व्यवसाय']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <GraduationCap size={12} /> साक्षर/निरक्षर *
                </label>
                <select 
                  name="साक्षर/निरक्षर" 
                  value={formData['साक्षर/निरक्षर']} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="">चुनें</option>
                  {LITERACY_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {formData['साक्षर/निरक्षर'] === 'साक्षर' && (
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">शैक्षिक स्तर *</label>
                  <select 
                    name="यदि साक्षर तो शैक्षिक स्तर" 
                    value={formData['यदि साक्षर तो शैक्षिक स्तर']} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  >
                    <option value="">चुनें</option>
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <Phone size={12} /> मोबाइल नंबर *
                </label>
                <input
                  type="text"
                  name="मोबाइल नंबर"
                  value={formData['मोबाइल नंबर']}
                  onChange={handleChange}
                  placeholder="10 अंक"
                  maxLength={10}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60 flex items-center gap-2">
                  <Clock size={12} /> मृत्यु/निकासी तिथि
                </label>
                <input
                  type="text"
                  name="सर्किल छोड़ देने या मृत्यु का दिनाँक"
                  value={formData['सर्किल छोड़ देने या मृत्यु का दिनाँक']}
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#141414] outline-none font-mono"
                />
              </div>

            </div>

            <AnimatePresence>
              {alert && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    alert.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {alert.type === 'success' ? <CheckCircle2 className="shrink-0 pt-0.5" /> : <AlertCircle className="shrink-0 pt-0.5" />}
                  <span className="text-sm font-medium">{alert.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white font-bold transition-all shadow-lg shadow-[#141414]/10 active:scale-[0.98] ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : isUpdate ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#141414] hover:bg-[#252525]'
                }`}
              >
                {loading ? <RefreshCw className="animate-spin" /> : isUpdate ? <RefreshCw /> : <Save />}
                {isUpdate ? 'अद्यतन करें (Update)' : 'सुरक्षित करें (Submit)'}
              </button>
            </div>
          </form>
        </section>

        {/* Right Side: Family Cards */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#141414]/10 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-[#141414]/10 bg-gray-50 flex items-center gap-3">
              <Users className="text-[#141414]/60" />
              <h2 className="font-serif italic text-xl">परिवार सदस्य</h2>
            </div>
            
            <div className="p-4 space-y-4 max-h-[700px] overflow-y-auto">
              {!formData['मकान नम्बर'] ? (
                <div className="text-center py-20 text-gray-400">
                  <MapPin size={48} className="mx-auto mb-4 opacity-10" />
                  <p>मकान नम्बर दर्ज करें</p>
                </div>
              ) : fetching ? (
                <div className="text-center py-20">
                  <Search size={48} className="mx-auto mb-4 animate-pulse opacity-20" />
                  <p className="text-sm text-gray-500">डाटा खोजा जा रहा है...</p>
                </div>
              ) : familyMembers.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <UserMinus size={48} className="mx-auto mb-4 opacity-10" />
                  <p>कोई सदस्य नहीं मिला</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-4 max-h-[800px] overflow-y-auto">
                  {familyMembers.map((member, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#141414]/20 transition-all group relative overflow-hidden"
                    >
                      {/* Card Background Accent */}
                      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${member['लिंग (पु०/म०)'] === 'पु०' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${member['लिंग (पु०/म०)'] === 'पु०' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                            {member['लिंग (पु०/म०)'] === 'पु०' ? <User size={24} /> : <UserCheck size={24} />}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{member['सदस्य का नाम']}</h3>
                            <p className="text-xs text-gray-400 font-medium">पुत्र/पत्नी: {member['पिता / पति का नाम']}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">{member['धर्म']}</span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">{member['जाति']}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => loadMemberIntoForm(member)}
                          className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-90"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-50 text-[11px] font-mono relative z-10">
                        <div className="space-y-1">
                          <p className="text-gray-400 flex items-center gap-1 uppercase tracking-tighter"><Calendar size={10} /> DOB / Age</p>
                          <p className="font-bold text-gray-700">{member['जन्मतिथि']} <span className="text-gray-400 ml-1">({member['उम्र']} Yr)</span></p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-gray-400 flex items-center justify-end gap-1 uppercase tracking-tighter"><IdCard size={10} /> Aadhaar</p>
                          <p className="font-bold text-gray-700">{member['आधार कार्ड संख्या']}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-400 flex items-center gap-1 uppercase tracking-tighter"><Phone size={10} /> Mobile</p>
                          <p className="font-bold text-gray-700">{member['मोबाइल नंबर']}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-gray-400 flex items-center justify-end gap-1 uppercase tracking-tighter"><Briefcase size={10} /> Occupation</p>
                          <p className="font-bold text-gray-700 truncate">{member['व्यवसाय']}</p>
                        </div>
                      </div>

                      {member['दिव्यांगता'] === 'Yes' && (
                        <div className="mt-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold flex items-center gap-2">
                          <AlertCircle size={12} />
                          दिव्यांग: {member['दिव्यांगता का प्रकार']}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#141414] text-white p-6 rounded-2xl shadow-xl shadow-[#141414]/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-serif italic text-lg mb-2">महत्वपूर्ण सूचना</h3>
              <ul className="text-xs space-y-2 opacity-80 list-disc pl-4">
                <li>सभी फील्ड भरना अनिवार्य है।</li>
                <li>आधार कार्ड के 12 अंक होना आवश्यक है।</li>
                <li>मोबाइल नंबर भारतीय प्रारूप (10 अंक) में हो।</li>
                <li>नाम केवल हिंदी भाषा में ही दर्ज करें।</li>
              </ul>
            </div>
            <Users size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-[#141414]/10 text-center text-gray-400 text-xs">
        <p>© 2026 परिवार पंजी सर्वेक्षण प्रणाली | सर्व अधिकार सुरक्षित</p>
      </footer>
    </div>
  );
}
