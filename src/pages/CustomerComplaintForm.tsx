import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, MessageSquareOff, Building, User, Calendar, 
  Frown, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, ShieldAlert, Activity, Search
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export function CustomerComplaintForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `CMP-${Date.now()}`,
    complaintTitle: initialData.complaintTitle || '',
    buyer: initialData.buyer || '',
    orderNo: initialData.orderNo || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Open',
    severity: initialData.severity || 'Medium',
    description: initialData.description || '',
    rootCause: initialData.rootCause || '',
    correctiveAction: initialData.correctiveAction || '',
    preventiveAction: initialData.preventiveAction || '',
    resolvedBy: initialData.resolvedBy || '',
    resolutionDate: initialData.resolutionDate || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('customerComplaint').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('customerComplaint').put(formData);
      }
      onNavigate('customer-complaint');
    } catch (error) {
      console.error('Error saving complaint record:', error);
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
          <button type="button" onClick={() => onNavigate('customer-complaint')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Log Customer Complaint' : mode === 'edit' ? 'Process Dispute Ticket' : 'Complaint Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('customer-complaint')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Ticket
            </button>
          )}
        </div>
      </div>

      <Section title="Complaint Source" icon={Frown} number="01">
        <Field label="Complaint Title" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.complaintTitle} 
            onChange={e => setFormData(p => ({ ...p, complaintTitle: e.target.value }))}
            placeholder="e.g., Fabric Shading issue in Style #XYZ"
          />
        </Field>
        <Field label="Buyer Name" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.buyer} 
            onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
          />
        </Field>
        <Field label="Related Order / PO #" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.orderNo} 
            onChange={e => setFormData(p => ({ ...p, orderNo: e.target.value }))}
          />
        </Field>
        <Field label="Date Received" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.date} 
            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          />
        </Field>
        <Field label="Severity Level" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.severity} 
            onChange={e => setFormData(p => ({ ...p, severity: e.target.value }))}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </Field>
        <Field label="Complaint Description" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[100px] bg-red-500/5 border border-red-500/10`} 
            value={formData.description} 
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="What exactly did the customer report? Include quantities and details..."
          />
        </Field>
      </Section>

      <Section title="Investigation & Root Cause" icon={Search} number="02">
        <Field label="Root Cause Analysis" required span2>
           <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.rootCause} 
            onChange={e => setFormData(p => ({ ...p, rootCause: e.target.value }))}
            placeholder="Determine the primary reason for the failure..."
          />
        </Field>
        <Field label="Corrective Action taken" span2>
           <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.correctiveAction} 
            onChange={e => setFormData(p => ({ ...p, correctiveAction: e.target.value }))}
            placeholder="Immediate actions taken to resolve the current issue..."
          />
        </Field>
        <Field label="Long-term Preventive Action" span2>
           <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px] bg-accent/5`} 
            value={formData.preventiveAction} 
            onChange={e => setFormData(p => ({ ...p, preventiveAction: e.target.value }))}
            placeholder="Changes implemented to prevent recurrence..."
          />
        </Field>
      </Section>

      <Section title="Resolution Status" icon={ShieldAlert} number="03">
        <Field label="Overall Ticket Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Open</option>
            <option>Investigating</option>
            <option>Awaiting Customer Feedback</option>
            <option>Resolved</option>
            <option>Closed - Unresolved</option>
          </select>
        </Field>
        <Field label="Resolution Date">
           <input 
            type="date" disabled={isReadOnly}
            className={inputClass} 
            value={formData.resolutionDate} 
            onChange={e => setFormData(p => ({ ...p, resolutionDate: e.target.value }))}
          />
        </Field>
        <Field label="Resolved / Authorized By" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.resolvedBy} 
            onChange={e => setFormData(p => ({ ...p, resolvedBy: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Evidence & Correspondence (Photos, Emails)
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Add Evidence
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <Activity className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No evidence files provided</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.attachments.map((file: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-1 truncate">{typeof file === 'string' ? file : file.name}</span>
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
