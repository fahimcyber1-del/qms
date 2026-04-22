import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Archive, Building, User, Calendar, 
  Database, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Trash, ShieldCheck, MapPin
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Finance', 'Management'
];

const Section = ({ title, icon: Icon, children, number }: any) => (
  <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
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

const Field = ({ label, required, children, span2 }: any) => (
  <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
    <label className="text-sm font-bold text-text-2 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export function RecordRetentionForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `REC-${Date.now()}`,
    recordTitle: initialData.recordTitle || '',
    docReference: initialData.docReference || '',
    storageFormat: initialData.storageFormat || 'Hard Copy',
    storageLocation: initialData.storageLocation || '',
    retentionPeriod: initialData.retentionPeriod || '5 Years',
    disposalMethod: initialData.disposalMethod || 'Shredding',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    status: initialData.status || 'Active',
    confidentiality: initialData.confidentiality || 'Internal',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('recordRetentionControl').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('recordRetentionControl').put(formData);
      }
      onNavigate('record-retention');
    } catch (error) {
      console.error('Error saving retention record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const inputClass = "w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto" onSubmit={handleSave}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('record-retention')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Define Retention Protocol' : mode === 'edit' ? 'Update Lifecycle Policy' : 'Retention Specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('record-retention')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Protocol
            </button>
          )}
        </div>
      </div>

      <Section title="Record Classification" icon={FileText} number="01">
        <Field label="Record Title / Description" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.recordTitle} 
            onChange={e => setFormData(p => ({ ...p, recordTitle: e.target.value }))}
            placeholder="e.g., Daily Production Checklists"
          />
        </Field>
        <Field label="Document Reference #" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.docReference} 
            onChange={e => setFormData(p => ({ ...p, docReference: e.target.value }))}
            placeholder="e.g., FORM-QA-PRD-02"
          />
        </Field>
        <Field label="Departmental Owner" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.department} 
            onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
          >
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </Section>

      <Section title="Storage & Lifecycle" icon={Database} number="02">
        <Field label="Storage Format" required>
           <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.storageFormat} 
            onChange={e => setFormData(p => ({ ...p, storageFormat: e.target.value }))}
          >
            <option>Hard Copy</option>
            <option>Digital (Local Server)</option>
            <option>Cloud Storage</option>
            <option>Microfilm</option>
          </select>
        </Field>
        <Field label="Retention Period" required>
           <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.retentionPeriod} 
            onChange={e => setFormData(p => ({ ...p, retentionPeriod: e.target.value }))}
          >
            <option>1 Year</option>
            <option>3 Years</option>
            <option>5 Years</option>
            <option>10 Years</option>
            <option>Permanent</option>
          </select>
        </Field>
        <Field label="Storage Exact Location" required span2>
          <div className="relative">
             <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
             <input 
                type="text" required disabled={isReadOnly}
                className={`${inputClass} pl-11`} 
                value={formData.storageLocation} 
                onChange={e => setFormData(p => ({ ...p, storageLocation: e.target.value }))}
                placeholder="e.g., Row 4, Shelf B, Archive Room 1"
              />
          </div>
        </Field>
        <Field label="Disposal Method" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.disposalMethod} 
            onChange={e => setFormData(p => ({ ...p, disposalMethod: e.target.value }))}
          >
            <option>Shredding</option>
            <option>Incineration</option>
            <option>Digital Deletion</option>
            <option>Recycling (Non-Confidential)</option>
          </select>
        </Field>
        <Field label="Confidentiality Level" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.confidentiality} 
            onChange={e => setFormData(p => ({ ...p, confidentiality: e.target.value }))}
          >
            <option>Public</option>
            <option>Internal</option>
            <option>Confidential</option>
            <option>Highly Sensitive</option>
          </select>
        </Field>
      </Section>

      <Section title="Maintenance & Remarks" icon={ShieldCheck} number="03">
        <Field label="Custodian Name" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
        </Field>
        <Field label="Protocol Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Active</option>
            <option>Archived</option>
            <option>Disposed</option>
          </select>
        </Field>
        <Field label="General Remarks" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px] bg-accent/5`} 
            value={formData.remarks} 
            onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Storage Certificates / Sample Records
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Add File
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <Archive className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No evidence files provided</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.attachments.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-1 truncate">{file}</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
