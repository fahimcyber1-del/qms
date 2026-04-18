import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, Building, Users, ClipboardCheck, FileText, Link as LinkIcon, FileDown, Clock, Edit, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { SOPRecord } from '../types';
import { getSOPRecords, saveSOPRecords } from '../utils/sopUtils';

interface SOPFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function SOPForm({ params, onNavigate }: SOPFormProps) {
  const { mode, data } = params;
  const [formData, setFormData] = useState<Partial<SOPRecord>>(data || {
    sopId: `SOP-${Date.now().toString().slice(-6)}`,
    title: '', department: 'Cutting', process: '', version: 'V1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    reviewDate: '', status: 'Draft',
    purpose: '', scope: '', responsibility: '', procedureSteps: '',
    safetyGuidelines: '', requiredEquipment: '', qcPoints: '',
    attachments: [], videoLink: '', trainingLink: '',
    createdBy: 'Current User', reviewedBy: '', approvedBy: '',
    versionHistory: []
  });

  const [changeLog, setChangeLog] = useState('');
  const isReadOnly = mode === 'view';

  const handleFormChange = (field: keyof SOPRecord, value: any) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [field]: value });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), { name: file.name, data: reader.result as string, type: file.type }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFormData(prev => {
      const updated = [...(prev.attachments || [])];
      updated.splice(index, 1);
      return { ...prev, attachments: updated };
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.sopId) {
      alert('SOP ID and Title are required.');
      return;
    }

    const now = new Date().toISOString();
    let newHistory = [...(formData.versionHistory || [])];
    
    if (mode === 'edit' && data && changeLog) {
      newHistory.push({
        version: formData.version || 'V1.0',
        updatedAt: now,
        updatedBy: formData.createdBy || 'Current User',
        changes: changeLog
      });
    } else if (mode === 'create') {
      newHistory.push({
        version: formData.version || 'V1.0',
        updatedAt: now,
        updatedBy: formData.createdBy || 'Current User',
        changes: 'Initial Creation'
      });
    }

    const newRecord: SOPRecord = {
      ...(formData as SOPRecord),
      id: formData.id || `REC-${Date.now()}`,
      versionHistory: newHistory,
      createdAt: formData.createdAt || now,
      updatedAt: now
    };

    const records = getSOPRecords();
    let updatedRecords;
    if (mode === 'edit' && data) {
      updatedRecords = records.map(r => r.id === data.id ? newRecord : r);
    } else {
      updatedRecords = [newRecord, ...records];
    }

    saveSOPRecords(updatedRecords);
    onNavigate('sop');
  };

  const handleDownloadPDF = async () => {
    const {
      createDoc, drawPdfHeader, drawRecordTable, drawSectionLabel,
      proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Standard Operating Procedure', `${formData.sopId} \u2022 ${formData.title}`);

    y = drawRecordTable(doc, y, 'SOP Identification & Status', [
      { label: 'SOP ID',         value: formData.sopId || '—' },
      { label: 'Version',        value: formData.version || '—' },
      { label: 'Department',     value: formData.department || '—' },
      { label: 'Process / Area', value: formData.process || '—' },
      { label: 'Effective Date', value: formData.effectiveDate || '—' },
      { label: 'Next Review',    value: formData.reviewDate || '—' },
      { label: 'Current Status', value: formData.status || 'Draft', fullWidth: true },
    ]);

    y = drawRecordTable(doc, y, 'Procedural Scope & Intent', [
      { label: 'Purpose',        value: formData.purpose || 'Objectives not defined.', fullWidth: true },
      { label: 'Scope',          value: formData.scope || 'Scope of application not defined.', fullWidth: true },
      { label: 'Responsibility', value: formData.responsibility || 'Responsible parties not defined.', fullWidth: true },
    ]);

    y = drawSectionLabel(doc, y, 'Operational Procedure Steps');
    y = proTable(doc, y, [['Step Description / Technical Instructions']], [[formData.procedureSteps || 'Technical instructions pending...']]) + 12;

    y = drawRecordTable(doc, y, 'Safety & Quality Control', [
      { label: 'Safety Guidelines', value: formData.safetyGuidelines || 'No specific safety requirements.', fullWidth: true },
      { label: 'QC Checkpoints',   value: formData.qcPoints || 'No specific quality checkpoints.', fullWidth: true },
      { label: 'Required Tools',   value: formData.requiredEquipment || 'N/A', fullWidth: true },
    ]);

    y = drawSignatureRow(doc, y, ['Author / Specialist', 'Quality Assurance', 'Management Approval']);
    addPageFooters(doc);
    doc.save(`${formData.sopId}_${formData.title.replace(/\s+/g, '_')}.pdf`);
  };


  // Form Field Component
  const Field = ({ label, required = false, children }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-text-2">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost px-2 bg-bg-2 border border-border-main" onClick={() => onNavigate('sop')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-text-1">
            {mode === 'create' ? 'Create New SOP Protocol' : mode === 'edit' ? `Edit SOP: ${formData.sopId}` : `SOP Details: ${formData.title}`}
          </h2>
        </div>
        {mode === 'view' ? (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost border border-border-main" onClick={() => onNavigate('sop-form', { mode: 'edit', data: formData })}>
              <Edit className="w-4 h-4 mr-2" /> Edit SOP
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              <FileDown className="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost px-6" onClick={() => onNavigate('sop')}>Cancel</button>
            <button className="btn btn-primary px-8 shadow-md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> {mode === 'create' ? 'Save SOP' : 'Update SOP'}
            </button>
          </div>
        )}
      </div>

      {mode === 'view' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-border-main pb-4">
                <h3 className="text-xl font-bold text-text-1 flex items-center gap-2"><FileText className="w-5 h-5" /> Detailed Protocol</h3>
                <span className={`px-3 py-1 font-bold rounded-full text-xs border shadow-sm ${
                  formData.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  formData.status === 'Draft' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>{formData.status}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-text-3 mb-2 uppercase tracking-wide">Purpose</h4>
                  <p className="text-text-1 whitespace-pre-wrap">{formData.purpose || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-3 mb-2 uppercase tracking-wide">Scope</h4>
                  <p className="text-text-1 whitespace-pre-wrap">{formData.scope || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-3 mb-2 uppercase tracking-wide">Responsibility</h4>
                <p className="text-text-1 whitespace-pre-wrap">{formData.responsibility || 'Not specified'}</p>
              </div>

              <div className="bg-bg-2 p-5 rounded-xl border border-border-main">
                <h4 className="text-sm font-bold text-text-3 mb-3 uppercase tracking-wide">Procedure Steps</h4>
                <p className="text-text-1 font-mono text-sm leading-relaxed whitespace-pre-wrap">{formData.procedureSteps || 'No steps detailed.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-main">
                <div>
                  <h4 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Safety Guidelines
                  </h4>
                  <p className="text-text-1 whitespace-pre-wrap">{formData.safetyGuidelines || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-500 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Control Points
                  </h4>
                  <p className="text-text-1 whitespace-pre-wrap">{formData.qcPoints || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {(formData.videoLink || formData.trainingLink || (formData.attachments && formData.attachments.length > 0)) && (
              <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-text-1 flex items-center gap-2 border-b border-border-main pb-2"><LinkIcon className="w-5 h-5" /> External Links & Attachments</h3>
                <div className="flex flex-col gap-3">
                  {formData.videoLink && (
                    <a href={formData.videoLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                       ðŸŽ¬ Watch Video Instruction
                    </a>
                  )}
                  {formData.trainingLink && (
                    <a href={formData.trainingLink} target="_blank" rel="noreferrer" className="text-purple-500 hover:underline flex items-center gap-2">
                       ðŸŽ“ Open Training Module
                    </a>
                  )}
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <span className="text-xs font-bold text-text-3 uppercase">Attachments</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.attachments.map((att, idx) => (
                          <a key={idx} href={att.data} download={att.name} className="flex items-center gap-2 bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-blue-500 hover:bg-blue-500/10 transition-colors text-sm">
                            <FileDown className="w-4 h-4" />
                            <span className="truncate">{att.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6 text-sm text-text-2">
            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
              <h4 className="font-bold text-text-1 border-b border-border-main pb-3 flex items-center gap-2"><Building className="w-4 h-4" /> Identifier Info</h4>
              <div className="flex justify-between"><span className="text-text-3">ID:</span> <strong className="text-text-1">{formData.sopId}</strong></div>
              <div className="flex justify-between"><span className="text-text-3">Dept:</span> <strong className="text-text-1">{formData.department}</strong></div>
              <div className="flex justify-between"><span className="text-text-3">Process:</span> <strong className="text-text-1">{formData.process}</strong></div>
              <div className="flex justify-between"><span className="text-text-3">Version:</span> <strong className="text-text-1">{formData.version}</strong></div>
              <div className="flex justify-between"><span className="text-text-3">Eff. Date:</span> <strong className="text-text-1">{formData.effectiveDate}</strong></div>
              <div className="flex justify-between"><span className="text-text-3">Review:</span> <strong className="text-text-1">{formData.reviewDate || 'N/A'}</strong></div>
            </div>

            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
              <h4 className="font-bold text-text-1 border-b border-border-main pb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Workflow Info</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-text-3 mb-1">Created By</div>
                  <div className="font-medium text-text-1">{formData.createdBy}</div>
                </div>
                <div>
                  <div className="text-xs text-text-3 mb-1">Reviewed By</div>
                  <div className="font-medium text-text-1">{formData.reviewedBy || 'Pending'}</div>
                </div>
                <div>
                  <div className="text-xs text-text-3 mb-1">Approved By</div>
                  <div className="font-medium text-text-1">{formData.approvedBy || 'Pending'}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-4">
              <h4 className="font-bold text-text-1 border-b border-border-main pb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Version History</h4>
              <div className="space-y-3">
                {formData.versionHistory && formData.versionHistory.length > 0 ? (
                  formData.versionHistory.map((vh, idx) => (
                    <div key={idx} className="text-xs p-3 bg-bg-2 rounded-xl border border-border-main">
                      <div className="flex justify-between font-bold text-text-1 mb-1">
                        <span>Version {vh.version}</span>
                        <span className="text-text-3 font-normal">{new Date(vh.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-text-2">{vh.changes}</p>
                      <div className="text-text-3 mt-2 font-medium">By: {vh.updatedBy}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-text-3 italic text-center p-4">No history recorded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Full page Create / Edit Form Mode
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-6">
              <h4 className="font-bold border-b border-border-main pb-2 text-primary-main flex items-center gap-2">
                <Building className="w-4 h-4" /> Basic Information
              </h4>
              <div className="space-y-4">
                <Field label="SOP ID" required>
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.sopId} readOnly={mode === 'edit'} onChange={e => handleFormChange('sopId', e.target.value)} />
                </Field>
                <Field label="SOP Title" required>
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.title} onChange={e => handleFormChange('title', e.target.value)} />
                </Field>
                <Field label="Department">
                  <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.department} onChange={e => handleFormChange('department', e.target.value)}>
                    {['Cutting', 'Sewing', 'Finishing', 'Packing', 'Quality', 'Maintenance', 'HR'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Process Name">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.process} onChange={e => handleFormChange('process', e.target.value)} />
                </Field>
                <Field label="Version">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.version} onChange={e => handleFormChange('version', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Effective Date">
                    <input type="date" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.effectiveDate} onChange={e => handleFormChange('effectiveDate', e.target.value)} />
                  </Field>
                  <Field label="Review Date">
                    <input type="date" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.reviewDate} onChange={e => handleFormChange('reviewDate', e.target.value)} />
                  </Field>
                </div>
                <Field label="Status">
                  <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.status} onChange={e => handleFormChange('status', e.target.value)}>
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Obsolete">Obsolete</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-6">
              <h4 className="font-bold border-b border-border-main pb-2 text-primary-main flex items-center gap-2">
                <Users className="w-4 h-4" /> Approval Workflow
              </h4>
              <div className="space-y-4">
                <Field label="Creator">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.createdBy} onChange={e => handleFormChange('createdBy', e.target.value)} />
                </Field>
                <Field label="Reviewer (Quality Mgr)">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.reviewedBy} onChange={e => handleFormChange('reviewedBy', e.target.value)} />
                </Field>
                <Field label="Approver (Compliance Mgr)">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.approvedBy} onChange={e => handleFormChange('approvedBy', e.target.value)} />
                </Field>
              </div>
            </div>

            {mode === 'edit' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm space-y-4">
                <h4 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" /> Version Control Change Log
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-300">Describe the changes made in this version mapping.</p>
                <textarea 
                  className="w-full bg-white dark:bg-bg-0 border-none rounded-xl px-4 py-3 text-sm outline-none text-text-1" 
                  placeholder="e.g., Updated safety guidelines to comply with ISO 9001..."
                  value={changeLog}
                  onChange={e => setChangeLog(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
              <h4 className="font-bold border-b border-border-main pb-2 text-primary-main flex items-center gap-2">
                <FileText className="w-4 h-4" /> SOP Documentation Mapping
              </h4>
              <div className="space-y-6">
                <Field label="Purpose">
                  <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[80px]" value={formData.purpose} onChange={e => handleFormChange('purpose', e.target.value)} />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Scope">
                    <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[80px]" value={formData.scope} onChange={e => handleFormChange('scope', e.target.value)} />
                  </Field>
                  <Field label="Responsibility">
                    <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[80px]" value={formData.responsibility} onChange={e => handleFormChange('responsibility', e.target.value)} />
                  </Field>
                </div>
                <Field label="Procedure Steps">
                  <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[250px] font-mono leading-relaxed" placeholder="1. Identify material...\n2. Check specification..." value={formData.procedureSteps} onChange={e => handleFormChange('procedureSteps', e.target.value)} />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Safety Guidelines (EHS)">
                    <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none text-text-1 min-h-[100px]" value={formData.safetyGuidelines} onChange={e => handleFormChange('safetyGuidelines', e.target.value)} />
                  </Field>
                  <Field label="Quality Control Details">
                    <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-text-1 min-h-[100px]" value={formData.qcPoints} onChange={e => handleFormChange('qcPoints', e.target.value)} />
                  </Field>
                </div>
                <Field label="Required Equipment">
                  <textarea className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[80px]" value={formData.requiredEquipment} onChange={e => handleFormChange('requiredEquipment', e.target.value)} />
                </Field>
              </div>
            </div>

            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
              <h4 className="font-bold border-b border-border-main pb-2 text-primary-main flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> External Links & Instructionals
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-2">Upload Attachments (PDF/Images)</label>
                  <input type="file" multiple accept="image/*,.pdf" className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-2 text-sm text-text-1" onChange={onFileChange} />
                </div>
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-bg-2 border border-border-main rounded-lg px-3 py-2">
                        <FileText className="w-4 h-4 text-text-3" />
                        <span className="text-sm truncate text-text-1">{att.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <Field label="Video Instruction Link">
                  <input type="url" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" placeholder="https://..." value={formData.videoLink} onChange={e => handleFormChange('videoLink', e.target.value)} />
                </Field>
                <Field label="Training Module Link">
                  <input type="url" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" placeholder="https://..." value={formData.trainingLink} onChange={e => handleFormChange('trainingLink', e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}



