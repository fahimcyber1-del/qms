import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Save, Check, Plus, Trash2, Printer, History, FileText, X, 
  Download, Edit2, BookOpen, Calendar, User, ShieldCheck, Clock, Building,
  Award, Eye, AlertTriangle, CheckCircle2, Info
} from 'lucide-react';
import { ProcedureRecord, RevisionEntry } from '../types';
import { getProcedureRecords, saveProcedureRecords } from '../utils/procedureUtils';

interface ProcedureFormProps {
  params: {
    mode: 'add' | 'edit' | 'view' | 'revision' | 'document';
    data?: ProcedureRecord;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function ProcedureForm({ params, onNavigate }: ProcedureFormProps) {
  const { mode, data } = params;
  const [formData, setFormData] = useState<Partial<ProcedureRecord>>({});
  const [revData, setRevData] = useState<Partial<RevisionEntry>>({
    rev: '',
    date: new Date().toISOString().split('T')[0],
    by: '',
    change: '',
    approved: ''
  });
  const [companyName] = useState(() => localStorage.getItem('companyName') || 'GarmentQMS Pro ERP');

  useEffect(() => {
    if (mode === 'add') {
      setFormData({
        status: 'Active',
        cat: 'Standard Operating Procedure (SOP)',
        ver: 'v1.0',
        issueNo: '01',
        revNo: 'Rev.0',
        issueDate: new Date().toISOString().split('T')[0],
        reviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        responsibilities: [],
        sections: [],
        relatedDocuments: [],
        distribution: []
      });
    } else if (data) {
      setFormData({ 
        ...data,
        responsibilities: data.responsibilities || [],
        sections: data.sections || [],
        relatedDocuments: data.relatedDocuments || [],
        distribution: data.distribution || []
      });
    }
  }, [mode, data]);

  const handleSave = () => {
    if (!formData.code || !formData.title) {
      alert('Code and title are required.');
      return;
    }

    const procedures = getProcedureRecords();
    let updated: ProcedureRecord[];
    
    if (mode === 'edit' && data) {
      updated = procedures.map(p => p.id === data.id ? { ...p, ...formData } as ProcedureRecord : p);
    } else {
      const newProc: ProcedureRecord = {
        ...formData,
        id: Date.now(),
        revHistory: [],
        linkedSops: formData.linkedSops || [],
        linkedForms: formData.linkedForms || [],
      } as ProcedureRecord;
      updated = [newProc, ...procedures];
    }

    saveProcedureRecords(updated);
    onNavigate('procedure');
  };

  const handleAddRevision = () => {
    if (!revData.rev || !revData.change || !data) {
      alert('Revision number and description required.');
      return;
    }
    
    const procedures = getProcedureRecords();
    const updated = procedures.map(p => {
      if (p.id === data.id) {
        return { ...p, revHistory: [revData as RevisionEntry, ...(p.revHistory || [])] };
      }
      return p;
    });
    
    saveProcedureRecords(updated);
    setRevData({ rev: '', date: new Date().toISOString().split('T')[0], by: '', change: '', approved: '' });
    const updatedProc = updated.find(p => p.id === data.id);
    if (updatedProc) setFormData(updatedProc);
  };

  const handleDownloadPDF = async () => {
    if (!formData) return;
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, formData.title || 'Standard Operating Procedure', `Code: ${formData.code || ''}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Department',     value: formData.dept || 'N/A' },
      { label: 'Document Type',  value: formData.cat || 'N/A' },
      { label: 'ISO Clause',     value: formData.clause || 'N/A' },
      { label: 'Version',        value: formData.ver || 'N/A' },
      { label: 'Issue No',       value: formData.issueNo || 'N/A' },
      { label: 'Status',         value: formData.status || 'N/A' },
      { label: 'Approval Date',  value: formData.issueDate || 'N/A' },
      { label: 'Review Date',    value: formData.reviewDate || 'N/A' },
      { label: 'Author',         value: formData.author || 'N/A' },
      { label: 'Approved By',    value: formData.approvedBy || 'N/A' },
    ]);

    if (formData.purpose) {
      y = drawSectionLabel(doc, y, '1. Purpose & Scope');
      y = proTable(doc, y, [['Content']], [[formData.purpose]]) + 6;
    }

    if (formData.responsibilities && formData.responsibilities.length > 0) {
      y = drawSectionLabel(doc, y, '2. Responsibilities & Authorities');
      y = proTable(doc, y,
        [['Role', 'Responsibility']],
        formData.responsibilities.map((r: any) => [r.role, r.responsibility])
      ) + 6;
    }

    if (formData.sections && formData.sections.length > 0) {
      y = drawSectionLabel(doc, y, '4. Process Control Details');
      const tableBody: (string | number)[][] = [];
      formData.sections.forEach((s: any) => {
        tableBody.push([{ content: `${s.id} ${s.title}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } } as any]);
        if (s.subSections) {
          s.subSections.forEach((sub: any) => {
            tableBody.push([`${sub.id} ${sub.title}${sub.content ? ': ' + sub.content : ''}`]);
          });
        }
      });
      y = proTable(doc, y, [['Details']], tableBody) + 6;
    }

    if (formData.relatedDocuments && formData.relatedDocuments.length > 0) {
      y = drawSectionLabel(doc, y, '5. Related Documents');
      y = proTable(doc, y,
        [['Document Name', 'Reference']],
        formData.relatedDocuments.map((d: any) => [d.name, d.ref])
      ) + 6;
    }

    if (formData.distribution && formData.distribution.length > 0) {
      y = drawSectionLabel(doc, y, '6. Distribution List');
      y = proTable(doc, y,
        [['Recipient']],
        formData.distribution.map((d: string) => [d])
      ) + 6;
    }

    if (formData.revHistory && formData.revHistory.length > 0) {
      y = drawSectionLabel(doc, y, '7. Revision History');
      y = proTable(doc, y,
        [['Rev', 'Date', 'By', 'Change Description', 'Approved']],
        formData.revHistory.map((h: any) => [
          h.rev || '-', h.date || '-',
          typeof h.by === 'object' ? Object.values(h.by).join('') : (h.by || '-'),
          h.change || '-', h.approved || '-'
        ])
      ) + 6;
    }

    drawSignatureRow(doc, y, ['Author (MR)', 'Reviewed By', 'Approved By (MD)']);
    addPageFooters(doc);
    doc.save(`Procedure_${formData.code || 'Doc'}.pdf`);
  };

  const inputClass = "w-full px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-text-2 mb-1.5";
  const sectionTitleClass = "text-base font-semibold text-text-1 flex items-center gap-2";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Obsolete': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 space-y-6" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-bg-1 border border-border-main rounded-xl hover:bg-bg-2 transition-colors shadow-sm" onClick={() => onNavigate('procedure')}>
            <ChevronLeft className="w-5 h-5 text-text-2" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-1">
              {mode === 'add' ? 'Create Procedure' : 
               mode === 'edit' ? 'Edit Procedure' : 
               mode === 'document' ? 'Procedure Document' : 
               mode === 'revision' ? 'Revision History' : 'Procedure Details'}
            </h1>
            <p className="text-text-3 text-sm mt-0.5">
              {formData.code ? `${formData.code} — ${formData.title}` : 'Fill in the procedure details below'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {mode === 'document' && (
            <>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-1 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:border-accent hover:text-accent transition-all shadow-sm" onClick={() => openForm('edit', data!)}>
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4" /> Print
              </button>
            </>
          )}
          {(mode === 'add' || mode === 'edit') && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={handleSave}>
              <Save className="w-4 h-4" /> Save Procedure
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* DOCUMENT VIEW MODE */}
      {/* ================================================================ */}
      {mode === 'document' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Document — Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover/Hero Card */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="relative p-8 md:p-10">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-text-3">
                  {formData.code} • Issue {formData.issueNo}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-text-3 uppercase tracking-wider">Standard Operating Procedure</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border mt-0.5 ${getStatusStyle(formData.status || 'Active')}`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-text-1 leading-tight">{formData.title}</h2>
                <div className="flex items-center gap-4 mt-4 text-sm text-text-2">
                  <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {formData.dept}</span>
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> {formData.ver}</span>
                  {formData.clause && <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> ISO {formData.clause}</span>}
                </div>
              </div>
            </div>

            {/* Document Control */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" /> Document Control Schedule
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Department', value: formData.dept },
                    { label: 'Document Type', value: formData.cat },
                    { label: 'Reference', value: formData.code },
                    { label: 'Issue No', value: formData.issueNo },
                    { label: 'Approval Date', value: formData.issueDate },
                    { label: 'Review Date', value: formData.reviewDate },
                    { label: 'Author', value: formData.author || 'N/A' },
                    { label: 'Approved By', value: formData.approvedBy || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="bg-bg-2/50 rounded-xl p-3.5 border border-border-main">
                      <p className="text-[10px] font-medium text-text-3 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-text-1 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purpose & Scope */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">1</span>
                  Purpose & Scope
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-text-2 leading-relaxed">
                  {formData.purpose || 'To define the procedures & processes of the department to ensure all stages of operation are clearly documented and communicated throughout the process chain.'}
                </p>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">2</span>
                  Responsibilities & Authorities
                </h3>
              </div>
              <div className="p-6">
                {formData.responsibilities && formData.responsibilities.length > 0 ? (
                  <div className="space-y-3">
                    {formData.responsibilities.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 bg-bg-2/50 rounded-xl p-4 border border-border-main">
                        <div className="p-2 bg-accent/10 rounded-lg mt-0.5">
                          <User className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{r.role}</p>
                          <p className="text-sm text-text-2 leading-relaxed">{r.responsibility}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-3 italic">No responsibilities defined.</p>
                )}
              </div>
            </div>

            {/* Process Control */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">3</span>
                  Process Control Details
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {formData.sections && formData.sections.length > 0 ? (
                  formData.sections.map((s) => (
                    <div key={s.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-accent font-mono">{s.id}</span>
                        <h4 className="text-sm font-semibold text-text-1">{s.title}</h4>
                      </div>
                      {s.subSections && s.subSections.length > 0 && (
                        <div className="ml-6 space-y-2 border-l-2 border-accent/20 pl-4">
                          {s.subSections.map((sub) => (
                            <div key={sub.id} className="flex gap-3 items-start">
                              <span className="font-mono text-[11px] font-bold text-accent pt-0.5 shrink-0">{sub.id}</span>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-text-1">{sub.title}</span>
                                {sub.content && <span className="text-sm text-text-2 leading-relaxed">{sub.content}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-3 italic">No process control sections defined.</p>
                )}
              </div>
            </div>

            {/* Related Documents */}
            {formData.relatedDocuments && formData.relatedDocuments.length > 0 && (
              <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border-main">
                  <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                    <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">4</span>
                    Related Documents
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {formData.relatedDocuments.map((d, i) => (
                      <div key={i} className="flex items-center justify-between bg-bg-2/50 rounded-xl px-4 py-3 border border-border-main">
                        <span className="text-sm text-text-1 font-medium">{d.name}</span>
                        <span className="text-xs font-mono text-accent font-bold">{d.ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Distribution */}
            {formData.distribution && formData.distribution.length > 0 && (
              <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border-main">
                  <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                    <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">5</span>
                    Distribution List
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {formData.distribution.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 bg-bg-2/50 rounded-xl px-4 py-3 border border-border-main">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                        <span className="text-sm text-text-1 font-medium">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Notice */}
            <div className="bg-accent/5 rounded-2xl border border-accent/15 p-6 text-center">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Compliance Notice</p>
              <p className="text-sm text-text-2 italic leading-relaxed mx-auto">
                This document is a controlled copy. Any unauthorized reproduction or distribution is strictly prohibited.
                Periodic reviews are conducted to ensure continuous improvement and effectiveness.
              </p>
            </div>
          </div>

          {/* Sidebar — Right 1/3 */}
          <div className="space-y-6">
            {/* Status Indicator */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
              formData.status === 'Active' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400' :
              formData.status === 'Under Review' ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400' :
              formData.status === 'Obsolete' ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-400' :
              'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300'
            }`}>
              <div className="p-6 text-center text-white">
                <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  {formData.status === 'Active' ? <CheckCircle2 className="w-7 h-7" /> :
                   formData.status === 'Under Review' ? <Clock className="w-7 h-7" /> :
                   formData.status === 'Obsolete' ? <AlertTriangle className="w-7 h-7" /> :
                   <FileText className="w-7 h-7" />}
                </div>
                <p className="text-xs font-medium uppercase tracking-widest opacity-80 mb-1">Document Status</p>
                <p className="text-2xl font-bold">{formData.status}</p>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm">
              <div className="px-5 py-3.5 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1">Document Info</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { icon: Building, label: 'Department', value: formData.dept },
                  { icon: Award, label: 'ISO Clause', value: formData.clause || 'N/A' },
                  { icon: FileText, label: 'Version', value: formData.ver },
                  { icon: Calendar, label: 'Approval Date', value: formData.issueDate },
                  { icon: Clock, label: 'Review Date', value: formData.reviewDate },
                  { icon: User, label: 'Author', value: formData.author || 'N/A' },
                  { icon: ShieldCheck, label: 'Approved By', value: formData.approvedBy || 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-bg-2 rounded-lg"><item.icon className="w-4 h-4 text-text-3" /></div>
                    <div>
                      <p className="text-[11px] text-text-3 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-medium text-text-1">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm">
              <div className="px-5 py-3.5 border-b border-border-main">
                <h3 className="text-sm font-semibold text-text-1">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button onClick={() => onNavigate('procedure-form', { mode: 'edit', data })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-1 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 transition-all">
                  <Edit2 className="w-4 h-4" /> Edit Procedure
                </button>
                <button onClick={() => onNavigate('procedure-form', { mode: 'revision', data })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-1 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 transition-all">
                  <History className="w-4 h-4" /> Revision History
                </button>
                <button onClick={() => window.print()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-1 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 transition-all">
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button onClick={handleDownloadPDF} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-1 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 transition-all">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ADD / EDIT / VIEW MODE */}
      {/* ================================================================ */}
      {(mode === 'add' || mode === 'edit' || mode === 'view') && (
        <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm p-6 md:p-8">
          <div className="space-y-8">
            {/* Basic Info */}
            <section>
              <h3 className={sectionTitleClass}>
                <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">1</span>
                Basic Information
              </h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Procedure Code *</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. NFFL/3/1163" />
                </div>
                <div>
                  <label className={labelClass}>Department</label>
                  <select className={inputClass} disabled={mode === 'view'} value={formData.dept || ''} onChange={(e) => setFormData({ ...formData, dept: e.target.value })}>
                    {['QC','QMS','QUALITY','Cutting','Sewing','Finishing','Packing','Washing','Embroidery','Lab','HR','Maintenance','Procurement'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass}>Procedure Title *</label>
                <input className={inputClass} disabled={mode === 'view'} value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. PROCEDURE FOR CONFORMING PROCESS CONTROL" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Document Type</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.cat || ''} onChange={(e) => setFormData({ ...formData, cat: e.target.value })} placeholder="e.g. Standard Operating Procedure (SOP)" />
                </div>
                <div>
                  <label className={labelClass}>ISO Clause</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.clause || ''} onChange={(e) => setFormData({ ...formData, clause: e.target.value })} placeholder="e.g. 8.5" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Version</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.ver || ''} onChange={(e) => setFormData({ ...formData, ver: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Issue No</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.issueNo || ''} onChange={(e) => setFormData({ ...formData, issueNo: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} disabled={mode === 'view'} value={formData.status || ''} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                    {['Active','Under Review','Draft','Obsolete'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Approval Date</label>
                  <input type="date" className={inputClass} disabled={mode === 'view'} value={formData.issueDate || ''} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Next Review Date</label>
                  <input type="date" className={inputClass} disabled={mode === 'view'} value={formData.reviewDate || ''} onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Author (MR)</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.author || ''} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Approved By (MD)</label>
                  <input className={inputClass} disabled={mode === 'view'} value={formData.approvedBy || ''} onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })} />
                </div>
              </div>
            </section>

            {/* Purpose */}
            <section className="pt-6 border-t border-border-main">
              <h3 className={sectionTitleClass}>
                <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">2</span>
                Purpose & Scope
              </h3>
              <div className="mt-4">
                <textarea className={`${inputClass} min-h-[100px] resize-none`} disabled={mode === 'view'} value={formData.purpose || ''} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Define the procedures & processes..." />
              </div>
            </section>

            {/* Responsibilities */}
            <section className="pt-6 border-t border-border-main">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">3</span>
                  Responsibilities & Authorities
                </h3>
                {mode !== 'view' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors" onClick={() => setFormData({ ...formData, responsibilities: [...(formData.responsibilities || []), { role: '', responsibility: '' }] })}>
                    <Plus className="w-3 h-3" /> Add Role
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-3">
                {(formData.responsibilities || []).map((r, i) => (
                  <div key={i} className="bg-bg-2/50 rounded-xl p-4 border border-border-main relative group">
                    <div className="space-y-3">
                      <input className={inputClass} disabled={mode === 'view'} placeholder="Role (e.g. Section Manager)" value={r.role} onChange={(e) => { const nr = [...(formData.responsibilities || [])]; nr[i].role = e.target.value; setFormData({ ...formData, responsibilities: nr }); }} />
                      <textarea className={`${inputClass} min-h-[60px] resize-none`} disabled={mode === 'view'} placeholder="Responsibility description..." value={r.responsibility} onChange={(e) => { const nr = [...(formData.responsibilities || [])]; nr[i].responsibility = e.target.value; setFormData({ ...formData, responsibilities: nr }); }} />
                    </div>
                    {mode !== 'view' && (
                      <button className="absolute top-3 right-3 p-1.5 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" onClick={() => { const nr = (formData.responsibilities || []).filter((_, idx) => idx !== i); setFormData({ ...formData, responsibilities: nr }); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Sections */}
            <section className="pt-6 border-t border-border-main">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">4</span>
                  Process Control Sections
                </h3>
                {mode !== 'view' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors" onClick={() => setFormData({ ...formData, sections: [...(formData.sections || []), { id: '3.' + ((formData.sections?.length || 0) + 1), title: '', subSections: [] }] })}>
                    <Plus className="w-3 h-3" /> Add Section
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-4">
                {(formData.sections || []).map((s, i) => (
                  <div key={i} className="bg-bg-2/50 rounded-xl p-4 border border-border-main space-y-4">
                    <div className="flex gap-3">
                      <input className={`${inputClass} w-20 font-mono text-xs`} disabled={mode === 'view'} value={s.id} onChange={(e) => { const ns = [...(formData.sections || [])]; ns[i].id = e.target.value; setFormData({ ...formData, sections: ns }); }} />
                      <input className={`${inputClass} flex-1 font-semibold`} disabled={mode === 'view'} placeholder="Section Title" value={s.title} onChange={(e) => { const ns = [...(formData.sections || [])]; ns[i].title = e.target.value; setFormData({ ...formData, sections: ns }); }} />
                      {mode !== 'view' && (
                        <button className="p-2 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => { const ns = (formData.sections || []).filter((_, idx) => idx !== i); setFormData({ ...formData, sections: ns }); }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-text-3 uppercase tracking-wider">Sub-sections</span>
                        {mode !== 'view' && (
                          <button className="flex items-center gap-1 text-[10px] font-medium text-accent hover:text-accent/80 transition-colors" onClick={() => { const ns = [...(formData.sections || [])]; const subId = s.id + '.' + ((s.subSections?.length || 0) + 1); ns[i].subSections = [...(s.subSections || []), { id: subId, title: '', content: '' }]; setFormData({ ...formData, sections: ns }); }}>
                            <Plus className="w-2.5 h-2.5" /> Add Sub
                          </button>
                        )}
                      </div>
                      {(s.subSections || []).map((sub, subIdx) => (
                        <div key={subIdx} className="bg-bg-1 p-3 rounded-xl border border-border-main space-y-2 relative group">
                          <div className="flex gap-2">
                            <input className={`${inputClass} w-20 font-mono text-[11px]`} disabled={mode === 'view'} value={sub.id} onChange={(e) => { const ns = [...(formData.sections || [])]; ns[i].subSections![subIdx].id = e.target.value; setFormData({ ...formData, sections: ns }); }} />
                            <input className={`${inputClass} flex-1 text-xs font-semibold`} disabled={mode === 'view'} placeholder="Sub-section Title" value={sub.title} onChange={(e) => { const ns = [...(formData.sections || [])]; ns[i].subSections![subIdx].title = e.target.value; setFormData({ ...formData, sections: ns }); }} />
                          </div>
                          <textarea className={`${inputClass} text-xs min-h-[60px] resize-none`} disabled={mode === 'view'} placeholder="Detailed procedure sequence/content..." value={sub.content} onChange={(e) => { const ns = [...(formData.sections || [])]; ns[i].subSections![subIdx].content = e.target.value; setFormData({ ...formData, sections: ns }); }} />
                          {mode !== 'view' && (
                            <button className="absolute top-2 right-2 p-1.5 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" onClick={() => { const ns = [...(formData.sections || [])]; ns[i].subSections = s.subSections!.filter((_, idx) => idx !== subIdx); setFormData({ ...formData, sections: ns }); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Documents */}
            <section className="pt-6 border-t border-border-main">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">5</span>
                  Related Documents
                </h3>
                {mode !== 'view' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors" onClick={() => setFormData({ ...formData, relatedDocuments: [...(formData.relatedDocuments || []), { name: '', ref: '' }] })}>
                    <Plus className="w-3 h-3" /> Add Doc
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {(formData.relatedDocuments || []).map((d, i) => (
                  <div key={i} className="flex gap-3 items-center group">
                    <input className={`${inputClass} flex-1`} disabled={mode === 'view'} placeholder="Document Name" value={d.name} onChange={(e) => { const nd = [...(formData.relatedDocuments || [])]; nd[i].name = e.target.value; setFormData({ ...formData, relatedDocuments: nd }); }} />
                    <input className={`${inputClass} w-40 font-mono text-xs`} disabled={mode === 'view'} placeholder="Ref No" value={d.ref} onChange={(e) => { const nd = [...(formData.relatedDocuments || [])]; nd[i].ref = e.target.value; setFormData({ ...formData, relatedDocuments: nd }); }} />
                    {mode !== 'view' && (
                      <button className="p-1.5 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" onClick={() => { const nd = (formData.relatedDocuments || []).filter((_, idx) => idx !== i); setFormData({ ...formData, relatedDocuments: nd }); }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Distribution */}
            <section className="pt-6 border-t border-border-main">
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  <span className="w-5 h-5 bg-accent rounded-md flex items-center justify-center text-white text-[10px] font-bold">6</span>
                  Distribution
                </h3>
                {mode !== 'view' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors" onClick={() => setFormData({ ...formData, distribution: [...(formData.distribution || []), ''] })}>
                    <Plus className="w-3 h-3" /> Add Recipient
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {(formData.distribution || []).map((d, i) => (
                  <div key={i} className="flex gap-3 items-center group">
                    <input className={`${inputClass} flex-1`} disabled={mode === 'view'} placeholder="Recipient (e.g. QMS File)" value={d} onChange={(e) => { const nd = [...(formData.distribution || [])]; nd[i] = e.target.value; setFormData({ ...formData, distribution: nd }); }} />
                    {mode !== 'view' && (
                      <button className="p-1.5 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" onClick={() => { const nd = (formData.distribution || []).filter((_, idx) => idx !== i); setFormData({ ...formData, distribution: nd }); }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-main">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:text-text-1 transition-all" onClick={() => onNavigate('procedure')}>Cancel</button>
              {mode !== 'view' && (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={handleSave}>
                  <Check className="w-4 h-4" /> Save Procedure
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* REVISION HISTORY MODE */}
      {/* ================================================================ */}
      {mode === 'revision' && data && (
        <div className="w-full space-y-6">
          {/* Header Card */}
          <div className="bg-accent/5 rounded-2xl border border-accent/15 p-5 flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <History className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[11px] text-text-3 uppercase tracking-wider">Procedure</p>
              <p className="font-bold text-text-1">{formData.code} — {formData.title}</p>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-main">
              <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                <History className="w-4 h-4 text-accent" /> Revision History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-main bg-bg-2/50">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Rev</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-3 uppercase tracking-wider">By</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Change</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.revHistory && formData.revHistory.length > 0 ? (
                    formData.revHistory.map((h, i) => (
                      <tr key={i} className="border-b border-border-main last:border-0 hover:bg-bg-2/50">
                        <td className="px-5 py-3 font-mono font-bold text-accent text-xs">{h.rev}</td>
                        <td className="px-5 py-3 font-mono text-text-2 text-xs">{h.date}</td>
                        <td className="px-5 py-3 text-text-1">{h.by}</td>
                        <td className="px-5 py-3 text-text-2">{h.change}</td>
                        <td className="px-5 py-3 text-text-2">{h.approved}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-text-3 italic">No revision history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Revision Form */}
          <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-main">
              <h3 className="text-sm font-semibold text-text-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" /> Add New Revision
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Revision No.</label>
                  <input className={inputClass} value={revData.rev} onChange={(e) => setRevData({ ...revData, rev: e.target.value })} placeholder="e.g. Rev.1" />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" className={inputClass} value={revData.date} onChange={(e) => setRevData({ ...revData, date: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Changed By</label>
                  <input className={inputClass} value={revData.by} onChange={(e) => setRevData({ ...revData, by: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Approved By</label>
                  <input className={inputClass} value={revData.approved} onChange={(e) => setRevData({ ...revData, approved: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Change Description</label>
                  <textarea className={`${inputClass} min-h-[80px] resize-none`} value={revData.change} onChange={(e) => setRevData({ ...revData, change: e.target.value })} />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={handleAddRevision}>
                  <Plus className="w-4 h-4" /> Add Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </motion.div>
  );

  function openForm(mode: string, proc: ProcedureRecord) {
    onNavigate('procedure-form', { mode, data: proc });
  }
}
