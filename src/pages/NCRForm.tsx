import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, AlertOctagon, Building, User, Calendar, 
  ShieldAlert, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  Activity, Layers, Tag, Download, Info as InfoIcon, Flag, Search
} from 'lucide-react';
import { getTable } from '../db/db';
import { AttachmentList } from '../components/AttachmentList';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Management'
];

// ── Sub-Components ────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, number }: any) => (
  <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        <span className="opacity-40 font-mono text-sm mr-1">{number}.</span>
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, required, children, span2, icon: Icon }: any) => (
  <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
    <label className="text-xs font-bold text-text-2 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 opacity-50" />}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export function NCRForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState({
    id: initialData.id || `NCR-${Date.now()}`,
    ncrTitle: initialData.ncrTitle || '',
    ncrType: initialData.ncrType || 'Product',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    detectedBy: initialData.detectedBy || '',
    detectionStage: initialData.detectionStage || 'In-Process',
    status: initialData.status || 'Open',
    description: initialData.description || '',
    affectedQuantity: initialData.affectedQuantity || 0,
    disposition: initialData.disposition || 'Rework',
    rootCause: initialData.rootCause || '',
    correctiveAction: initialData.correctiveAction || '',
    verificationDate: initialData.verificationDate || '',
    attachments: initialData.attachments || []
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('ncr').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('ncr').put(formData);
      }
      onNavigate('ncr');
    } catch (error) {
      console.error('Error saving NCR record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAtts: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAtts.push({ name: file.name, data });
    }
    
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    const isMajor = formData.ncrType === 'Product' || formData.ncrType === 'System';
    const severityColor = isMajor ? '#dc2626' : '#f59e0b';
    const statusColor: Record<string, string> = {
      'Closed': '#16a34a', 'Open': '#dc2626',
      'Under Review': '#f59e0b', 'Disposition Decided': '#3b82f6',
      'Corrective Action': '#8b5cf6'
    };

    await exportDetailToPDF({
      moduleName: 'Non-Conformance Report (NCR)',
      moduleId: 'ncr',
      recordId: formData.id,
      fileName: `NCR_${formData.id}`,
      sections: [
        {
          title: '1. NCR Identification',
          fields: [
            { label: 'NCR Reference No.', value: formData.id },
            { label: 'NCR Title', value: formData.ncrTitle || '—', fullWidth: true },
            { label: 'Category', value: formData.ncrType || '—' },
            { label: 'Detection Stage', value: formData.detectionStage || '—' },
            { label: 'Detected By', value: formData.detectedBy || '—' },
            { label: 'Quantity Impacted (Pcs)', value: String(formData.affectedQuantity || 0) },
          ]
        },
        {
          title: '2. Responsibility & Timeline',
          fields: [
            { label: 'Department', value: formData.department || '—' },
            { label: 'Responsible Person', value: formData.responsiblePerson || '—' },
            { label: 'Current Status', value: formData.status || '—' },
            { label: 'Target Verification Date', value: formData.verificationDate || '—' },
          ]
        },
        {
          title: '3. Non-Conformance Description',
          fields: [
            { label: 'Detailed Description', value: formData.description || '—', fullWidth: true },
          ]
        },
        {
          title: '4. Disposition Decision',
          fields: [
            { label: 'Disposition', value: formData.disposition || '—' },
            { label: 'ISO Reference', value: 'ISO 9001:2015 — Clause 8.7' },
          ]
        },
        {
          title: '5. Root Cause & Corrective Action',
          fields: [
            { label: 'Root Cause (Initial Assessment)', value: formData.rootCause || 'Pending analysis.', fullWidth: true },
            { label: 'Corrective Action Taken', value: formData.correctiveAction || 'Pending.', fullWidth: true },
          ]
        }
      ],
      summary: [
        `Disposition Decision: ${formData.disposition || 'Pending'}`,
        `Current Status: ${formData.status} — ${formData.status === 'Closed' ? 'NCR resolved and closed.' : 'Action still required.'}`
      ],
      signatureLabels: ['QC Inspector', 'Dept. Head', 'QA Manager', 'Closure Authorization'],
      styleOverrides: { accentColor: statusColor[formData.status] || severityColor }
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('ncr')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Issue New Nonconformance' : mode === 'edit' ? 'Update NCR Record' : 'Nonconformance Intel'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('ncr-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Record
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download NCR
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('ncr')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl mb-4"><AlertOctagon className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Impacted Items</div>
            <div className="text-4xl font-black text-text-1 font-mono">{formData.affectedQuantity.toLocaleString()}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><Search className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Detection Stage</div>
            <div className="text-2xl font-black text-text-1">{formData.detectionStage}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Closed' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <ShieldAlert className={`w-8 h-8 ${formData.status === 'Closed' ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Workflow State</div>
            <div className={`text-2xl font-black uppercase ${formData.status === 'Closed' ? 'text-green-600' : 'text-amber-600'}`}>
              {formData.status}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="NCR Identification" icon={Tag} number="01">
            <Field label="NCR Title" icon={Flag} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.ncrTitle} 
                onChange={e => setFormData(p => ({ ...p, ncrTitle: e.target.value }))}
                placeholder="e.g., Fabric shading issue in lot #123"
              />
            </Field>
            <Field label="Category" icon={Layers} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.ncrType} 
                onChange={e => setFormData(p => ({ ...p, ncrType: e.target.value }))}
              >
                <option>Product</option>
                <option>Process</option>
                <option>Material</option>
                <option>System</option>
              </select>
            </Field>
            <Field label="Quantity Impacted" icon={AlertOctagon} required>
              <input 
                type="number" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.affectedQuantity} 
                onChange={e => setFormData(p => ({ ...p, affectedQuantity: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Detection Stage" icon={Search} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.detectionStage} 
                onChange={e => setFormData(p => ({ ...p, detectionStage: e.target.value }))}
              >
                <option>Incoming Inspection</option>
                <option>In-Process</option>
                <option>Final Inspection</option>
                <option>Customer Return</option>
              </select>
            </Field>
            <Field label="Detected By" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.detectedBy} 
                onChange={e => setFormData(p => ({ ...p, detectedBy: e.target.value }))}
              />
            </Field>
          </Section>

          <Section title="Description & Analysis" icon={Layers} number="02">
            <Field label="Nonconformance Description" icon={FileText} required span2>
              <textarea 
                required disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none`} 
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Detailed explanation of the issue found..."
              />
            </Field>
            <Field label="Disposition Decision" icon={CheckCircle2} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.disposition} 
                onChange={e => setFormData(p => ({ ...p, disposition: e.target.value }))}
              >
                <option>Rework</option>
                <option>Reject</option>
                <option>Accept as-is</option>
                <option>Return to Supplier</option>
              </select>
            </Field>
            <Field label="Department" icon={Building} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.department} 
                onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Root Cause (Initial)" icon={Activity} span2>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none bg-accent/5`} 
                value={formData.rootCause} 
                onChange={e => setFormData(p => ({ ...p, rootCause: e.target.value }))}
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Governance" icon={ShieldAlert} number="03" className="md:grid-cols-1">
            <Field label="Current Status" icon={Activity} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.status} 
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
              >
                <option>Open</option>
                <option>Under Review</option>
                <option>Disposition Decided</option>
                <option>Corrective Action</option>
                <option>Closed</option>
              </select>
            </Field>
            <Field label="Target Verification" icon={Calendar}>
               <input 
                type="date" disabled={isReadOnly}
                className={inputClass} 
                value={formData.verificationDate} 
                onChange={e => setFormData(p => ({ ...p, verificationDate: e.target.value }))}
              />
            </Field>
            <Field label="Responsible Person" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.responsiblePerson} 
                onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
              />
            </Field>
            <Field label="Action Taken" icon={CheckCircle2} span2>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none`} 
                value={formData.correctiveAction} 
                onChange={e => setFormData(p => ({ ...p, correctiveAction: e.target.value }))}
              />
            </Field>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <Paperclip className="w-5 h-5 text-accent" />
                NCR Evidence
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add Media
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            {formData.attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <InfoIcon className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No evidence files</p>
              </div>
            ) : (
              <AttachmentList
                attachments={formData.attachments}
                onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) })) : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
