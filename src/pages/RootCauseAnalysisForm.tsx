import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, SearchCode, Building, User, Calendar, 
  Search, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Activity, Layers, Tag, HelpCircle, AlertTriangle
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Management'
];

export function RootCauseAnalysisForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `RCA-${Date.now()}`,
    problemTitle: initialData.problemTitle || '',
    sourceModule: initialData.sourceModule || 'NCR',
    referenceId: initialData.referenceId || '',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    analysisMethod: initialData.analysisMethod || '5 Why',
    status: initialData.status || 'Open',
    date: initialData.date || new Date().toISOString().split('T')[0],
    problemDescription: initialData.problemDescription || '',
    why1: initialData.why1 || '',
    why2: initialData.why2 || '',
    why3: initialData.why3 || '',
    why4: initialData.why4 || '',
    why5: initialData.why5 || '',
    rootCause: initialData.rootCause || '',
    correctiveAction: initialData.correctiveAction || '',
    preventiveAction: initialData.preventiveAction || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('rootCauseAnalysis').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('rootCauseAnalysis').put(formData);
      }
      onNavigate('rca');
    } catch (error) {
      console.error('Error saving RCA record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

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

  const inputClass = "w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto" onSubmit={handleSave}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('rca')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Start Root Cause Analysis' : mode === 'edit' ? 'Update Investigation' : 'Investigation Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('rca')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Analysis
            </button>
          )}
        </div>
      </div>

      <Section title="Investigation Context" icon={Tag} number="01">
        <Field label="Problem Title" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.problemTitle} 
            onChange={e => setFormData(p => ({ ...p, problemTitle: e.target.value }))}
            placeholder="Summarize the core failure or problem..."
          />
        </Field>
        <Field label="Source Module" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.sourceModule} 
            onChange={e => setFormData(p => ({ ...p, sourceModule: e.target.value }))}
          >
            <option>NCR</option>
            <option>CAPA</option>
            <option>Audit</option>
            <option>Customer Complaint</option>
            <option>Inspection</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Reference ID" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.referenceId} 
            onChange={e => setFormData(p => ({ ...p, referenceId: e.target.value }))}
            placeholder="Related ID (e.g., NCR-1002)"
          />
        </Field>
        <Field label="Problem Description" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.problemDescription} 
            onChange={e => setFormData(p => ({ ...p, problemDescription: e.target.value }))}
            placeholder="Describe exactly what happened, when, and where..."
          />
        </Field>
        <Field label="Analysis Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.date} 
            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          />
        </Field>
        <Field label="Department" required>
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

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-8">
        <div className="border-b border-border-main pb-4">
          <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-main/10 flex items-center justify-center text-purple-main">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="opacity-40 font-mono text-sm mr-1">02.</span>
            5 Why Analysis
          </h3>
        </div>

        <div className="space-y-4 relative">
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-border-main opacity-30 border-dashed" />
          
          {[
            { key: 'why1', label: 'Why 1?', placeholder: 'The direct cause of the reported problem...' },
            { key: 'why2', label: 'Why 2?', placeholder: 'Why did Why 1 happen?' },
            { key: 'why3', label: 'Why 3?', placeholder: 'Why did Why 2 happen?' },
            { key: 'why4', label: 'Why 4?', placeholder: 'Why did Why 3 happen?' },
            { key: 'why5', label: 'Why 5 (Root Cause)?', placeholder: 'The deepest point of failure...' },
          ].map((why, idx) => (
            <div key={why.key} className="flex gap-6 relative">
              <div className="z-10 bg-bg-1 flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 ${
                  formData[why.key as keyof typeof formData] ? 'border-accent text-accent bg-accent/5' : 'border-border-main text-text-3'
                }`}>
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1 pb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-3 mb-1 block">{why.label}</label>
                <textarea 
                  disabled={isReadOnly}
                  className={`${inputClass} min-h-[60px] resize-none`} 
                  value={formData[why.key as keyof typeof formData] as string} 
                  onChange={e => setFormData(p => ({ ...p, [why.key]: e.target.value }))}
                  placeholder={why.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Section title="Conclusions & Actions" icon={CheckCircle2} number="03">
        <Field label="Root Cause Summary" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[80px] bg-accent/5 focus:ring-accent border border-accent/20`} 
            value={formData.rootCause} 
            onChange={e => setFormData(p => ({ ...p, rootCause: e.target.value }))}
            placeholder="Final determination of the root cause..."
          />
        </Field>
        <Field label="Corrective Action" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.correctiveAction} 
            onChange={e => setFormData(p => ({ ...p, correctiveAction: e.target.value }))}
            placeholder="Immediate action taken to solve the problem..."
          />
        </Field>
        <Field label="Preventive Action" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.preventiveAction} 
            onChange={e => setFormData(p => ({ ...p, preventiveAction: e.target.value }))}
            placeholder="Long-term systematic change to prevent recurrence..."
          />
        </Field>
        <Field label="Responsible Investigator" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
        </Field>
        <Field label="Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Supporting Evidence (RCA)
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Add Files
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <SearchCode className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No documentation attached</p>
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
