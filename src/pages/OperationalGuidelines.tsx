import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, Tag, History, Users, QrCode, Link, Check, Plus, X, Edit, Trash2, Download as DownloadIcon, ChevronLeft, FileText, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { OperationalGuideline } from '../types';
import { getGuidelineRecords, saveGuidelineRecords } from '../utils/guidelineUtils';
import { 
  createDoc, drawPdfHeader, drawRecordTable, addPageFooters, 
  drawSectionLabel, proTable, drawSignatureRow 
} from '../utils/pdfExport';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const INITIAL_FORM: Partial<OperationalGuideline> = {
  title: '',
  department: 'Sewing',
  category: 'Operational',
  content: '',
  version: 'V1.0',
  status: 'Active',
  issueDate: new Date().toISOString().split('T')[0],
  nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  approvedBy: '',
  versionHistory: [],
  acknowledgements: []
};

export function OperationalGuidelines() {
  const [guidelines, setGuidelines] = useState<OperationalGuideline[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuideline, setSelectedGuideline] = useState<OperationalGuideline | null>(null);
  const [activeDept, setActiveDept] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [formData, setFormData] = useState<Partial<OperationalGuideline>>(INITIAL_FORM);

  useEffect(() => { setGuidelines(getGuidelineRecords()); }, []);

  const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Packing', 'Embroidery', 'Washing', 'Quality Control', 'IE', 'Fabric Store', 'Buyer-Specific', 'AQL', 'Machine', 'Measurement', 'Safety'];
  
  const categoriesList = ['All', 'Safety', 'Operational', 'Quality', 'Compliance', 'HR'];

  const filtered = useMemo(() => {
    return guidelines.filter(g => 
      (activeDept === 'All' || g.department === activeDept) &&
      (filterCategory === 'All' || g.category === filterCategory) &&
      (g.title.toLowerCase().includes(searchTerm.toLowerCase()) || g.department.toLowerCase().includes(searchTerm.toLowerCase()) || g.id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [guidelines, activeDept, filterCategory, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: guidelines.length,
      active: guidelines.filter(g => g.status === 'Active').length,
      expiring: guidelines.filter(g => new Date(g.nextReviewDate) < new Date()).length
    };
  }, [guidelines]);

  const handleAcknowledge = (id: string) => {
    const updated = guidelines.map(g => {
      if (g.id === id) {
        return {
          ...g,
          acknowledgements: [...(g.acknowledgements || []), { userId: 'USER1', userName: 'Current User', date: new Date().toISOString().split('T')[0] }]
        };
      }
      return g;
    });
    setGuidelines(updated);
    saveGuidelineRecords(updated);
    if (selectedGuideline?.id === id) {
      setSelectedGuideline(updated.find(g => g.id === id) || null);
    }
  };

  const handleSaveGuideline = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields.');
      return;
    }

    let updated: OperationalGuideline[];
    if (viewMode === 'create') {
      const newRecord: OperationalGuideline = {
        ...formData as OperationalGuideline,
        id: `GL-${formData.department?.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        versionHistory: [{ version: formData.version || 'V1.0', date: formData.issueDate || '', changes: 'Initial Release', approvedBy: formData.approvedBy || '' }],
        acknowledgements: []
      };
      updated = [newRecord, ...guidelines];
    } else {
      updated = guidelines.map(g => g.id === formData.id ? (formData as OperationalGuideline) : g);
    }

    setGuidelines(updated);
    saveGuidelineRecords(updated);
    setViewMode('list');
    setFormData(INITIAL_FORM);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this guideline?')) {
      const updated = guidelines.filter(g => g.id !== id);
      setGuidelines(updated);
      saveGuidelineRecords(updated);
    }
  };

  const handleDownload = async (g: OperationalGuideline) => {
    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    
    let y = drawPdfHeader(doc, 'OPERATIONAL GUIDELINE', `Ref: ${g.id}  ·  v${g.version}`);

    // High-level metadata
    y = drawRecordTable(doc, y, 'Protocol Information', [
      { label: 'Guideline Title', value: g.title, fullWidth: true },
      { label: 'Department',      value: g.department },
      { label: 'Category',        value: g.category },
      { label: 'Current Version', value: g.version },
      { label: 'Guideline Status',value: g.status },
      { label: 'Effective Date',  value: g.issueDate },
      { label: 'Review Due Date', value: g.nextReviewDate },
      { label: 'Approved By',     value: g.approvedBy || 'AUTHORIZED QMS PERSONNEL' },
    ]);

    // Main Content Section
    y = drawSectionLabel(doc, y, 'Guideline Protocol & Procedures');
    
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 60, 80);
    const splitContent = doc.splitTextToSize(g.content, 185);
    doc.text(splitContent, 12, y + 5);
    
    y += (splitContent.length * 5) + 20;

    // History Table
    if (g.versionHistory && g.versionHistory.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      y = drawSectionLabel(doc, y, 'Version Control History');
      y = proTable(doc, y,
        [['Ver.', 'Date', 'Changes / Remarks', 'Approved By']],
        g.versionHistory.map(h => [h.version, h.date, h.changes, h.approvedBy || '—']),
        { columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 25 }, 3: { cellWidth: 35 } } }
      ) + 12;
    }

    // Acknowledgements
    if (g.acknowledgements && g.acknowledgements.length > 0) {
       if (y > 240) { doc.addPage(); y = 20; }
       y = drawSectionLabel(doc, y, 'Staff Acknowledgements');
       y = proTable(doc, y,
         [['Name / Designation', 'Department', 'Date Signed']],
         g.acknowledgements.map(a => [a.userName, g.department, a.date]),
         { columnStyles: { 2: { halign: 'center', cellWidth: 40 } } }
       ) + 12;
    }

    if (y > 250) { doc.addPage(); y = 20; }
    drawSignatureRow(doc, y, ['Prepared By', 'QA Head', 'Factory Manager']);

    addPageFooters(doc);
    doc.save(`${g.id}_${g.title.replace(/\s+/g, '_')}.pdf`);
  };

  if (viewMode !== 'list') {
    return (
      <motion.div className="p-4 md:p-8 space-y-6" initial={{opacity: 0}} animate={{opacity: 1}}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost px-2 bg-bg-2 border border-border-main" onClick={() => { setViewMode('list'); setFormData(INITIAL_FORM); }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-text-1">
              {viewMode === 'create' ? 'Create New Operational Guideline' : viewMode === 'edit' ? `Edit Guideline ${formData.id}` : `Guideline Details: ${selectedGuideline?.title}`}
            </h2>
          </div>
          {viewMode === 'view' && selectedGuideline && (
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost border border-border-main" onClick={() => {setFormData(selectedGuideline); setViewMode('edit');}}>
                <Edit className="w-4 h-4 mr-2" /> Edit Info
              </button>
              <button className="btn btn-primary" onClick={() => handleDownload(selectedGuideline)}>
                <DownloadIcon className="w-4 h-4 mr-2" /> Download PDF
              </button>
            </div>
          )}
        </div>

        {viewMode === 'view' && selectedGuideline ? (
          // Full page View mode
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-border-main pb-4">
                  <h3 className="text-xl font-bold text-text-1">Guideline Protocol</h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 font-bold rounded-full text-xs box-border border-green-500/20 shadow-sm border">{selectedGuideline.status}</span>
                </div>
                <p className="text-text-2 leading-relaxed whitespace-pre-wrap">{selectedGuideline.content}</p>
                <div className="pt-6 mt-4 flex gap-4 border-t border-border-main">
                  <button className="btn btn-primary shadow-lg shadow-accent/20" onClick={() => handleAcknowledge(selectedGuideline.id)}>
                    <Check className="w-4 h-4 mr-2" /> Acknowledge Form
                  </button>
                  {selectedGuideline.sopLinkId && (
                    <button className="btn btn-ghost border border-border-main bg-bg-2">
                      <Link className="w-4 h-4 mr-2" /> View Related SOP
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6 text-sm text-text-2">
              <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
                <h4 className="font-bold text-text-1 border-b border-border-main pb-3">Properties</h4>
                <div className="flex justify-between"><span className="text-text-3">ID:</span> <strong className="text-text-1">{selectedGuideline.id}</strong></div>
                <div className="flex justify-between"><span className="text-text-3">Department:</span> <strong className="text-text-1">{selectedGuideline.department}</strong></div>
                <div className="flex justify-between"><span className="text-text-3">Category:</span> <strong className="text-text-1">{selectedGuideline.category}</strong></div>
                <div className="flex justify-between"><span className="text-text-3">Version:</span> <strong className="text-text-1">{selectedGuideline.version}</strong></div>
                <div className="flex justify-between"><span className="text-text-3">Review Due:</span> <strong className="text-red-500">{selectedGuideline.nextReviewDate}</strong></div>
              </div>
              
              <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm flex flex-col items-center justify-center">
                <div className="bg-bg-2 p-4 rounded-xl border border-border-main">
                  <QrCode className="w-24 h-24 text-text-1" />
                </div>
                <span className="text-[10px] text-text-3 mt-4 font-black uppercase tracking-widest">Floor Post QR Link</span>
              </div>
              
              <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
                <h4 className="font-bold text-text-1 border-b border-border-main pb-3 flex items-center gap-2"><History className="w-4 h-4" /> Version History</h4>
                <div className="space-y-3">
                  {(selectedGuideline.versionHistory || []).map((h, i) => (
                    <div key={i} className="text-xs p-3 bg-bg-2 rounded-xl border border-border-main">
                      <div className="font-bold text-text-1">{h.version} • {h.date}</div>
                      <div className="text-text-3 mt-1.5">{h.changes}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
                <h4 className="font-bold text-text-1 border-b border-border-main pb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Acknowledgements ({(selectedGuideline.acknowledgements || []).length})</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                  {(selectedGuideline.acknowledgements || []).map((a, i) => (
                    <div key={i} className="text-xs p-3 bg-bg-2 rounded-xl border border-border-main flex justify-between items-center">
                      <span className="font-bold text-text-1">{a.userName}</span>
                      <span className="text-text-3">{a.date}</span>
                    </div>
                  ))}
                  {(!selectedGuideline.acknowledgements || selectedGuideline.acknowledgements.length === 0) && (
                    <div className="text-xs text-text-3 italic text-center p-4">No team acknowledgements yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Full page Create/Edit Form
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Guideline Title *</label>
                <input 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g. Fabric Relaxation Standards"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Department</label>
                <select 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.department} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                >
                  {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Category</label>
                <select 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  {categoriesList.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Version</label>
                <input 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.version} 
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-2">Guideline Content *</label>
              <textarea 
                className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[250px] resize-y" 
                value={formData.content} 
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write detailed instructions, parameters, and protocols here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Issue Date</label>
                <input 
                  type="date" 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.issueDate} 
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Next Review Date</label>
                <input 
                  type="date" 
                  className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                  value={formData.nextReviewDate} 
                  onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2 w-full md:w-1/2 md:pr-3">
              <label className="text-sm font-bold text-text-2">Approved By</label>
              <input 
                className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" 
                value={formData.approvedBy} 
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })} 
                placeholder="e.g. Factory Manager"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border-main">
              <button className="btn btn-ghost px-6" onClick={() => { setViewMode('list'); setFormData(INITIAL_FORM); }}>Cancel</button>
              <button className="btn btn-primary px-8 shadow-md hover:shadow-lg" onClick={handleSaveGuideline}>
                {viewMode === 'create' ? 'Publish Guideline' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <FileText className="w-8 h-8 text-accent" />
            Operational Guidelines
          </h1>
          <p className="text-text-2 text-base mt-2">Standardized Factory Safety, Operational, and Compliance Protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow" onClick={() => { setViewMode('create'); setFormData(INITIAL_FORM); }}>
            <Plus className="w-4 h-4" /> Create Guideline
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Total Guidelines', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Protocols', value: stats.active, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Expiring/Expired Review', value: stats.expiring, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search guidelines by ID, Title or Department..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="w-full md:w-40 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={activeDept} onChange={(e) => setActiveDept(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <select className="w-full md:w-40 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categoriesList.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-bg-2 text-text-2 font-medium uppercase text-[10px] tracking-wider border-b border-border-main">
                <th className="px-6 py-4">Guideline Info</th>
                <th className="px-6 py-4">Department / Cat</th>
                <th className="px-6 py-4">Status & Next Review</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main text-text-1">
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map(g => {
                    const isExpiring = new Date(g.nextReviewDate) < new Date();
                    return (
                      <motion.tr 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        layout
                        key={g.id} 
                        className={`hover:bg-bg-2/50 transition-colors group ${isExpiring ? 'bg-red-500/5 hover:bg-red-500/10' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-text-1 tracking-tight group-hover:text-accent transition-colors">{g.title}</span>
                            <span className="text-xs text-text-3 font-medium mt-1">{g.id} • {g.version}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-1">{g.department}</span>
                            <span className="text-xs text-text-3 mt-1">{g.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <div className="flex items-center gap-2">
                               <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-500/10 text-green-500 border border-green-500/20">{g.status}</span>
                               {isExpiring && <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">Review Due</span>}
                            </div>
                            <span className={`text-xs font-semibold ${isExpiring ? 'text-red-500' : 'text-text-3'}`}><Clock className="w-3 h-3 inline mr-1"/> {g.nextReviewDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 bg-bg-2 text-text-2 hover:text-accent hover:bg-accent/10 rounded-lg transition-all" title="View Details" onClick={() => { setSelectedGuideline(g); setViewMode('view'); }}>
                              <FileText className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-bg-2 text-text-2 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Edit" onClick={() => { setFormData(g); setViewMode('edit'); }}>
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-bg-2 text-text-2 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all" title="Download PDF" onClick={() => handleDownload(g)}>
                              <DownloadIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-bg-2 text-text-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete" onClick={() => handleDelete(g.id!)}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-3">
                      <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                      <p className="font-semibold text-lg">No guidelines found</p>
                      <p className="text-sm">Try adjusting your category or department filters.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-main bg-bg-2/30 flex items-center justify-between text-xs text-text-2 font-medium">
          <span>{filtered.length} guidelines matching criteria</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
