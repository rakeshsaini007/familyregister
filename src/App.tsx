/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { FamilyMember, emptyMember } from './types.ts';
import { GAS_URL } from './constants.ts';
import { calculateAge, formatDisplayDate, getAgeNumber } from './utils.ts';

import { AppBackground } from './components/AppBackground.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { DashboardHeader } from './components/dashboard/DashboardHeader.tsx';
import { FamilySummaryCard } from './components/dashboard/FamilySummaryCard.tsx';
import { MemberListSection } from './components/dashboard/MemberListSection.tsx';
import { SimpleFilterModal } from './components/modals/SimpleFilterModal.tsx';
import { MemberFormModal } from './components/modals/MemberFormModal.tsx';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal.tsx';
import { FamilyRegisterPreviewModal } from './components/modals/FamilyRegisterPreviewModal.tsx';
import { FilteredReportPreviewModal } from './components/modals/FilteredReportPreviewModal.tsx';
import { FilterPage } from './components/FilterPage.tsx';
import { FamilyRegisterDocument } from './components/pdf/FamilyRegisterDocument.tsx';
import { FilteredReportDocument } from './components/pdf/FilteredReportDocument.tsx';

type Filters = {
  search: string;
  gender: string;
  literacy: string;
  religion: string;
  caste: string;
  occupation: string;
  minAge: number;
  maxAge: number;
};

const DEFAULT_FILTERS: Filters = {
  search: '',
  gender: 'सभी',
  literacy: 'सभी',
  religion: 'सभी',
  caste: 'सभी',
  occupation: 'सभी',
  minAge: 0,
  maxAge: 100,
};

export default function App() {
  const [formData, setFormData] = useState<FamilyMember>(emptyMember);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'family' | 'member'>('family');
  const [originalRecord, setOriginalRecord] = useState<{ house: string; name: string } | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showFilteredReportPreview, setShowFilteredReportPreview] = useState(false);
  const [reportData, setReportData] = useState<{ members: FamilyMember[]; filters: any }>({ members: [], filters: {} });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [fetchingAll, setFetchingAll] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Derived state
  const filteredMembers = familyMembers.filter(member => {
    const age = getAgeNumber(member['जन्मतिथि']);
    return (
      (!filters.search ||
        member['सदस्य का नाम'].toLowerCase().includes(filters.search.toLowerCase()) ||
        member['पिता / पति का नाम'].toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.gender === 'सभी' || member['लिंग (पु०/म०)'] === filters.gender) &&
      (filters.literacy === 'सभी' || member['साक्षर/निरक्षर'] === filters.literacy) &&
      (filters.religion === 'सभी' || member['धर्म'] === filters.religion) &&
      (filters.caste === 'सभी' || member['जाति'] === filters.caste) &&
      (filters.occupation === 'सभी' || member['व्यवसाय'] === filters.occupation) &&
      age >= filters.minAge && age <= filters.maxAge
    );
  });

  const activeFilterCount = Object.entries(filters).reduce((acc, [key, val]) => {
    if (key === 'minAge' && val === 0) return acc;
    if (key === 'maxAge' && val === 100) return acc;
    return val !== '' && val !== 'सभी' ? acc + 1 : acc;
  }, 0);

  useEffect(() => { setIsUpdate(!!originalRecord); }, [originalRecord]);

  // API: fetch one family
  const fetchFamily = async (houseNo: string) => {
    if (!houseNo || GAS_URL === 'YOUR_DEPLOYED_GAS_URL') return;
    setFetching(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(`${GAS_URL}?houseNumber=${houseNo}`, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setFamilyMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('fetchFamily Failure:', error);
    } finally {
      setFetching(false);
    }
  };

  // API: fetch all members for advanced filter
  const fetchAllMembers = useCallback(async () => {
    if (GAS_URL === 'YOUR_DEPLOYED_GAS_URL') return;
    if (allMembers.length > 0 && !fetchingAll) return;
    setFetchingAll(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(GAS_URL, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) setAllMembers(data);
    } catch (error) {
      console.error('fetchAllMembers Failure:', error);
    } finally {
      setFetchingAll(false);
    }
  }, [allMembers.length, fetchingAll]);

  // PDF generation
  const generatePDF = async (id: string, fileName: string) => {
    const element = document.getElementById(id);
    if (!element) {
      setAlert({ type: 'error', message: 'PDF तत्व नहीं मिला — पुनः प्रयास करें' });
      return;
    }
    setLoading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        onclone: (_clonedDoc, clonedEl) => {
          // 1. Fix left:-9999px ancestors — overflow-x:hidden on root clips them to 0 width.
          let ancestor: HTMLElement | null = (clonedEl as HTMLElement).parentElement;
          for (let i = 0; i < 10 && ancestor; i++, ancestor = ancestor.parentElement) {
            const cls = ancestor.getAttribute('class') || '';
            if (cls.includes('left-[-9999') || ancestor.style.left === '-9999px') {
              ancestor.style.left = '0px';
            }
          }
          // 2. Fix oklch colors — Tailwind v4 uses oklch() which html2canvas can't parse.
          //    The browser already resolves oklch → rgb in getComputedStyle, so we copy
          //    those rgb values from the live DOM onto the cloned elements as inline styles.
          const origEl = document.getElementById(id);
          if (!origEl) return;
          const COLOR_PROPS = ['color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
          const copyColors = (orig: Element, clone: Element) => {
            if (orig instanceof HTMLElement && clone instanceof HTMLElement) {
              const cs = window.getComputedStyle(orig);
              COLOR_PROPS.forEach(p => { const v = cs.getPropertyValue(p); if (v) clone.style.setProperty(p, v); });
            }
            const len = Math.min(orig.children.length, clone.children.length);
            for (let i = 0; i < len; i++) copyColors(orig.children[i], clone.children[i]);
          };
          copyColors(origEl, clonedEl as Element);
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
      setAlert({ type: 'success', message: 'PDF फाइल तैयार है!' });
      setShowPdfPreview(false);
      setShowFilteredReportPreview(false);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'PDF बनाने में विफल: ' + String(err) });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  // Form handlers
  const handleDateInput = (name: keyof FamilyMember, value: string) => {
    let cleaned = value.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '-' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = formatted.slice(0, 5) + '-' + cleaned.slice(4);
    setFormData(prev => {
      const next = { ...prev, [name]: formatted };
      if (name === 'जन्मतिथि') next['उम्र'] = calculateAge(formatted);
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const field = name as keyof FamilyMember;
    if (name === 'जन्मतिथि' || name === 'सर्किल छोड़ देने या मृत्यु का दिनाँक') {
      handleDateInput(field, value);
      return;
    }
    if (['आधार कार्ड संख्या', 'मोबाइल नंबर', 'फैमिली ID', 'राशन कार्ड संख्या'].includes(field)) {
      setFormData(prev => ({ ...prev, [field]: value.replace(/\D/g, '') }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    const required: (keyof FamilyMember)[] = modalMode === 'family'
      ? ['मकान नम्बर', 'परिवार के प्रमुख का नाम', 'राशन कार्ड का प्रकार', 'धर्म', 'जाति']
      : ['मकान नम्बर', 'सदस्य का नाम', 'पिता / पति का नाम', 'लिंग (पु०/म०)'];

    for (const field of required) {
      if (!formData[field]) return `${field} अनिवार्य है`;
    }
    if (modalMode === 'member') {
      if (formData['आधार कार्ड संख्या'] && formData['आधार कार्ड संख्या'].toString().length !== 12)
        return 'आधार कार्ड संख्या 12 अंकों की होनी चाहिए';
      if (formData['मोबाइल नंबर'] && formData['मोबाइल नंबर'].toString().length !== 10)
        return 'मोबाइल नंबर 10 अंकों का होना चाहिए';
    }
    const hindiRegex = /^[ऀ-ॿ\s.]+$/;
    if (modalMode === 'family') {
      if (!hindiRegex.test(formData['परिवार के प्रमुख का नाम']))
        return 'परिवार प्रमुख का नाम केवल हिंदी भाषा में होना चाहिए';
    } else {
      if (!hindiRegex.test(formData['सदस्य का नाम']) || !hindiRegex.test(formData['पिता / पति का नाम']))
        return 'सदस्य और पिता/पति का नाम केवल हिंदी भाषा में होने चाहिए';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) { setAlert({ type: 'error', message: error }); return; }
    if (GAS_URL === 'YOUR_DEPLOYED_GAS_URL') {
      setAlert({ type: 'error', message: 'कृपया Google Apps Script URL को constants.ts में सेट करें' });
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, _originalHouse: originalRecord?.house, _originalName: originalRecord?.name };
      const response = await fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.status === 'success') {
        const savedHouse = formData['मकान नम्बर'];
        setAlert({ type: 'success', message: result.action === 'updated' ? 'डाटा सफलतापूर्वक अपडेट किया गया!' : 'डाटा सफलतापूर्वक सुरक्षित किया गया!' });
        await fetchFamily(savedHouse);
        setFormData({ ...emptyMember, 'मकान नम्बर': savedHouse });
        setOriginalRecord(null);
        setIsModalOpen(false);
      } else {
        setAlert({ type: 'error', message: result.message || 'कुछ गलत हुआ' });
      }
    } catch {
      setAlert({ type: 'error', message: 'नेटवर्क त्रुटि: कृपया जाँचें' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
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
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        mode: 'no-cors',
        body: JSON.stringify({ 'मकान नम्बर': member['मकान नम्बर'], 'सदस्य का नाम': member['सदस्य का नाम'], action: 'delete' }),
      });
      setAlert({ type: 'success', message: 'हटाने का अनुरोध भेजा गया! कृपया कुछ क्षणों में रिफ्रेश करें।' });
      setMemberToDelete(null);
      setTimeout(async () => { await fetchFamily(member['मकान नम्बर']); setLoading(false); }, 2000);
    } catch {
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
      const response = await fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ...member, [field]: value }) });
      const result = await response.json();
      if (result.status === 'success') {
        setAlert({ type: 'success', message: 'विवरण अपडेट किया गया' });
        fetchFamily(member['मकान नम्बर']);
      }
    } catch {
      setAlert({ type: 'error', message: 'अपडेट विफल रहा' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const loadMemberIntoForm = (member: FamilyMember, mode: 'family' | 'member' = 'family') => {
    setFormData(member);
    setOriginalRecord({ house: member['मकान नम्बर'].toString(), name: member['सदस्य का नाम'].toString() });
    setIsUpdate(true);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const openAddMemberForm = () => {
    const [head] = familyMembers;
    setFormData({
      ...emptyMember,
      'मकान नम्बर': head['मकान नम्बर'],
      'परिवार के प्रमुख का नाम': head['परिवार के प्रमुख का नाम'],
      'फैमिली ID': head['फैमिली ID'],
      'राशन कार्ड संख्या': head['राशन कार्ड संख्या'],
      'राशन कार्ड का प्रकार': head['राशन कार्ड का प्रकार'],
      'धर्म': head['धर्म'],
      'जाति': head['जाति'],
    });
    setOriginalRecord(null);
    setIsUpdate(false);
    setModalMode('member');
    setIsModalOpen(true);
  };

  const openAddFamilyForm = () => {
    setOriginalRecord(null);
    setIsUpdate(false);
    setModalMode('family');
    setIsModalOpen(true);
  };

  const handleInitialSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData['मकान नम्बर']) {
      setHasSearched(true);
      fetchFamily(formData['मकान नम्बर']);
    }
  };

  const removeFilter = (key: string) => {
    setFilters((prev: Filters) => ({
      ...prev,
      [key]: key === 'minAge' ? 0 : key === 'maxAge' ? 100 : key === 'search' ? '' : 'सभी',
    }));
  };

  return (
    <div className="min-h-screen relative font-sans text-white overflow-x-hidden selection:bg-indigo-500/40 bg-[#020617]">
      <AppBackground />

      <AnimatePresence mode="wait">
        {!hasSearched ? (
          <LandingPage
            houseNo={formData['मकान नम्बर']}
            onHouseNoChange={handleChange}
            onSearch={handleInitialSearch}
            onOpenAdvancedFilter={() => { setIsAdvancedFilterOpen(true); fetchAllMembers(); }}
          />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <DashboardHeader onBack={() => setHasSearched(false)} />

            <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
              <section className="animate-fade-in-up space-y-10">
                {familyMembers.length > 0 && (
                  <FamilySummaryCard
                    familyMembers={familyMembers}
                    loading={loading}
                    onEdit={() => loadMemberIntoForm(familyMembers[0], 'family')}
                    onDownload={() => setShowPdfPreview(true)}
                    onQuickUpdate={handleQuickUpdate}
                  />
                )}

                <MemberListSection
                  familyMembers={familyMembers}
                  filteredMembers={filteredMembers}
                  filters={filters}
                  activeFilterCount={activeFilterCount}
                  fetching={fetching}
                  houseNoEntered={!!formData['मकान नम्बर']}
                  onAddMember={openAddMemberForm}
                  onAddFamily={openAddFamilyForm}
                  onEditMember={(m) => loadMemberIntoForm(m, 'member')}
                  onDeleteMember={(e, m) => { e.stopPropagation(); setMemberToDelete(m); }}
                  onRemoveFilter={removeFilter}
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                />
              </section>
            </main>

            <SimpleFilterModal
              isOpen={isFilterOpen}
              filters={filters}
              filteredCount={filteredMembers.length}
              onFilterChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              onClose={() => setIsFilterOpen(false)}
            />

            <MemberFormModal
              isOpen={isModalOpen}
              mode={modalMode}
              formData={formData}
              isUpdate={isUpdate}
              loading={loading}
              alert={alert}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClose={() => setIsModalOpen(false)}
            />

            <DeleteConfirmModal
              member={memberToDelete}
              loading={loading}
              onConfirm={confirmDelete}
              onCancel={() => setMemberToDelete(null)}
            />

            {/* Hidden off-screen container for family register PDF capture */}
            {familyMembers.length > 0 && (
              <div className="absolute left-[-9999px] top-0 pointer-events-none select-none">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
                <div id="family-register-pdf" className="w-[210mm] relative bg-white pb-20">
                  <div className="absolute inset-0 z-0 opacity-[0.03] overflow-hidden pointer-events-none select-none rotate-12 flex flex-wrap justify-center content-center gap-20">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="text-8xl font-black whitespace-nowrap">डिजिटल परिवार पंजी</div>
                    ))}
                  </div>
                  <div className="relative z-10">
                    <FamilyRegisterDocument familyMembers={familyMembers} formatDisplayDate={formatDisplayDate} />
                  </div>
                </div>
              </div>
            )}

            <FamilyRegisterPreviewModal
              isOpen={showPdfPreview}
              familyMembers={familyMembers}
              filteredMembers={filteredMembers}
              activeFilterCount={activeFilterCount}
              loading={loading}
              formatDisplayDate={formatDisplayDate}
              onClose={() => setShowPdfPreview(false)}
              onDownload={() => generatePDF('family-register-pdf', `Family_Register_House_${familyMembers[0]['मकान नम्बर']}.pdf`)}
            />

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

      {/* Advanced filter — outside main stacking context */}
      <AnimatePresence mode="wait">
        {isAdvancedFilterOpen && (
          <FilterPage
            allMembers={allMembers}
            loading={fetchingAll}
            onClose={() => setIsAdvancedFilterOpen(false)}
            onDownloadPdf={(members, selectedFilters) => {
              setReportData({ members, filters: selectedFilters });
              setShowFilteredReportPreview(true);
            }}
            onSelectMember={(member) => {
              setFormData({ ...emptyMember, 'मकान नम्बर': member['मकान नम्बर'] });
              setHasSearched(true);
              fetchFamily(member['मकान नम्बर'].toString());
              setIsAdvancedFilterOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Hidden off-screen container for filtered report PDF capture */}
      {reportData.members.length > 0 && (
        <div className="absolute left-[-9999px] top-0 pointer-events-none select-none">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
          <div id="filtered-report-pdf" className="w-[210mm] bg-white">
            <FilteredReportDocument members={reportData.members} filters={reportData.filters} formatDisplayDate={formatDisplayDate} />
          </div>
        </div>
      )}

      {/* Filtered report preview — outside main stacking context, above FilterPage */}
      <FilteredReportPreviewModal
        isOpen={showFilteredReportPreview}
        members={reportData.members}
        filters={reportData.filters}
        loading={loading}
        formatDisplayDate={formatDisplayDate}
        onClose={() => setShowFilteredReportPreview(false)}
        onDownload={() => generatePDF('filtered-report-pdf', `Village_Report_${new Date().getTime()}.pdf`)}
      />
    </div>
  );
}
