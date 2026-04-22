import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, MessageSquareOff, Building, User, Calendar, 
  Frown, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  ShieldAlert, Activity, Search, Download, Flag, ShoppingBag
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

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

export function CustomerComplaintForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Customer Complaint Record',
      moduleId: 'customer-complaint',
      recordId: formData.id,
      fileName: `Complaint_${formData.id}`,
      fields: [
        { label: 'Subject',      value: formData.complaintTitle },
        { label: 'Buyer',        value: formData.buyer },
        { label: 'Order/PO',     value: formData.orderNo },
        { label: 'Received on',  value: formData.date },
        { label: 'Severity',     value: formData.severity },
        { label: 'Status',       value: formData.status },
        { label: 'Resolved By',  value: formData.resolvedBy },
        { label: 'Resolution',   value: formData.resolutionDate },
      ],
      summary: [
        'Complaint Description:', formData.description,
        'Root Cause Investigation:', formData.rootCause,
        'Corrective Actions:', formData.correctiveAction,
        'Preventive Measures:', formData.preventiveAction
      ]
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('customer-complaint')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Log Customer Complaint' : mode === 'edit' ? 'Update Complaint' : 'Complaint Intelligence'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('customer-complaint-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Ticket
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Report
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('customer-complaint')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Ticket
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className={`p-4 rounded-2xl mb-4 ${
              formData.severity === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 
              formData.severity === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent'
            }`}>
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Severity Level</div>
            <div className={`text-2xl font-black uppercase ${
               formData.severity === 'Critical' ? 'text-rose-500' : 
               formData.severity === 'High' ? 'text-amber-500' : 'text-accent'
            }`}>{formData.severity}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><Search className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Investigation Phase</div>
            <div className="text-2xl font-black text-text-1">{formData.status}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Resolved' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <CheckCircle2 className={`w-8 h-8 ${formData.status === 'Resolved' ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Outcome Status</div>
            <div className={`text-2xl font-black uppercase ${formData.status === 'Resolved' ? 'text-green-600' : 'text-amber-600'}`}>
              {formData.status === 'Resolved' ? 'COMPLETED' : 'ACTIVE'}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Dispute Origins" icon={Frown} number="01">
            <Field label="Complaint Title" icon={Flag} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.complaintTitle} 
                onChange={e => setFormData(p => ({ ...p, complaintTitle: e.target.value }))}
                placeholder="e.g., Fabric Shading issue in Style #XYZ"
              />
            </Field>
            <Field label="Buyer Name" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.buyer} 
                onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
              />
            </Field>
            <Field label="Related Order / PO #" icon={ShoppingBag} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.orderNo} 
                onChange={e => setFormData(p => ({ ...p, orderNo: e.target.value }))}
              />
            </Field>
            <Field label="Date Received" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.date} 
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              />
            </Field>
            <Field label="Severity Level" icon={ShieldAlert} required>
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
            <Field label="Complaint Narrative" icon={FileText} required span2>
              <textarea 
                required disabled={isReadOnly}
                className={`${inputClass} min-h-[160px] resize-none ${formData.description ? 'bg-rose-500/5' : ''}`} 
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="What exactly did the customer report? Include quantities and details..."
              />
            </Field>
          </Section>

          <Section title="CAPA Investigation" icon={Search} number="02">
            <Field label="Root Cause Analysis" icon={Search} required span2>
               <textarea 
                required disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none`} 
                value={formData.rootCause} 
                onChange={e => setFormData(p => ({ ...p, rootCause: e.target.value }))}
                placeholder="Determine the primary reason for the failure..."
              />
            </Field>
            <Field label="Corrective Action taken" icon={CheckCircle2} span2>
               <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none`} 
                value={formData.correctiveAction} 
                onChange={e => setFormData(p => ({ ...p, correctiveAction: e.target.value }))}
                placeholder="Immediate actions taken to resolve the current issue..."
              />
            </Field>
            <Field label="Preventive Strategy" icon={ShieldAlert} span2>
               <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none bg-accent/5`} 
                value={formData.preventiveAction} 
                onChange={e => setFormData(p => ({ ...p, preventiveAction: e.target.value }))}
                placeholder="Long-term changes implemented to prevent recurrence..."
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Resolution" icon={ShieldAlert} number="03" className="md:grid-cols-1">
            <Field label="Ticket Status" icon={Activity} required>
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
            <Field label="Resolution Date" icon={Calendar}>
               <input 
                type="date" disabled={isReadOnly}
                className={inputClass} 
                value={formData.resolutionDate} 
                onChange={e => setFormData(p => ({ ...p, resolutionDate: e.target.value }))}
              />
            </Field>
            <Field label="Authorized By" icon={User} required>
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
                Proof of Issue
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
                <Activity className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No evidence files</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {formData.attachments.map((file: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-text-1 truncate">{typeof file === 'string' ? file : file.name}</span>
                    </div>
                    {!isReadOnly && (
                      <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
